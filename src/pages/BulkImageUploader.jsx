import React, { useState, useEffect } from 'react';
import { 
  FiUpload, 
  FiDatabase, 
  FiCloud, 
  FiSettings,
  FiPlay,
  FiPause,
  FiRefreshCw,
  FiDownload,
  FiEye,
  FiCheck,
  FiX,
  FiEdit,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiClock,
  FiLink,
  FiSearch
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import BulkImageUploadService from '@/services/BulkImageUploadService';

const BulkImageUploader = () => {
  const [uploadState, setUploadState] = useState('idle'); // idle, loading, fetching, uploading, completed
  const [products, setProducts] = useState([]);
  const [siteLinks, setSiteLinks] = useState(['', '', '', '', '']); // 5 site links
  const [productImages, setProductImages] = useState({}); // productId: { siteIndex: [images] }
  const [selectedImages, setSelectedImages] = useState({}); // productId: [selectedImageUrls]
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
    skipped: 0
  });

  // Filtering states
  const [filterStatus, setFilterStatus] = useState('all'); // all, with_images, without_images
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Connection status states
  const [dbConnected, setDbConnected] = useState(false);
  const [cloudinaryConnected, setCloudinaryConnected] = useState(false);

  useEffect(() => {
    // Check connections on component mount
    checkConnections();
  }, []);

  const checkConnections = async () => {
    try {
      // Check MongoDB connection using the bulk upload service
      const dbResponse = await BulkImageUploadService.checkConnections();
      setDbConnected(dbResponse.dbConnected);
      setCloudinaryConnected(dbResponse.cloudinaryConnected);
    } catch (error) {
      console.error('Connection check failed:', error);
      setDbConnected(false);
      setCloudinaryConnected(false);
    }
  };

  const handleAddSiteLink = (index, url) => {
    const newSiteLinks = [...siteLinks];
    newSiteLinks[index] = url;
    setSiteLinks(newSiteLinks);
  };

  const handleFetchImagesFromSites = async (productId) => {
    try {
      setUploadState('fetching');
      toast.info('Fetching images from sites...');
      
      const product = products.find(p => p._id === productId);
      if (!product) {
        toast.error('Product not found');
        return;
      }

      const productName = product.title?.en || product.name?.en || '';
      const productNameAr = product.title?.ar || product.name?.ar || '';
      
      // Fetch images from each site link
      const fetchedImages = {};
      
      for (let i = 0; i < siteLinks.length; i++) {
        const siteUrl = siteLinks[i];
        if (!siteUrl.trim()) continue;
        
        try {
          // Call backend service to fetch images from the site
          const response = await BulkImageUploadService.fetchImagesFromSite(siteUrl, productName, productNameAr);
          fetchedImages[i] = response.images || [];
        } catch (error) {
          console.error(`Failed to fetch from site ${i}:`, error);
          fetchedImages[i] = [];
        }
      }
      
      setProductImages(prev => ({
        ...prev,
        [productId]: fetchedImages
      }));
      
      toast.success('Images fetched from sites');
      setUploadState('idle');
    } catch (error) {
      toast.error('Failed to fetch images: ' + error.message);
      setUploadState('idle');
    }
  };

  const handleLoadProducts = async () => {
    try {
      setUploadState('loading');
      toast.info('Loading products without images...');
      
      const data = await BulkImageUploadService.loadProductsWithoutImages();
      
      setProducts(data.products || []);
      toast.success(`Loaded ${data.products?.length || 0} products without images`);
      setUploadState('idle');
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products: ' + error.message);
      setUploadState('idle');
    }
  };

  const handleSelectImage = (productId, imageUrl, isSelected) => {
    setSelectedImages(prev => {
      const currentSelected = prev[productId] || [];
      
      if (isSelected) {
        // Add image to selection
        return {
          ...prev,
          [productId]: [...currentSelected, imageUrl]
        };
      } else {
        // Remove image from selection
        return {
          ...prev,
          [productId]: currentSelected.filter(url => url !== imageUrl)
        };
      }
    });
  };

  const handleSelectAllImagesForProduct = (productId) => {
    const productImagesData = productImages[productId] || {};
    const allImages = [];
    
    Object.values(productImagesData).forEach(siteImages => {
      allImages.push(...siteImages);
    });
    
    setSelectedImages(prev => ({
      ...prev,
      [productId]: allImages.map(img => img.url)
    }));
  };

  const handleClearSelectionForProduct = (productId) => {
    setSelectedImages(prev => ({
      ...prev,
      [productId]: []
    }));
  };

  const findBestImageForProduct = (product, images, settings) => {
    let bestImage = null;
    let bestScore = 0;
    
    for (const image of images) {
      const score = calculateImageProductMatch(image, product, settings);
      if (score > bestScore) {
        bestScore = score;
        bestImage = {
          ...image,
          confidence: score
        };
      }
    }
    
    return bestImage;
  };

  const calculateImageProductMatch = (image, product, settings) => {
    const imageKeywords = extractKeywordsFromImage(image.name);
    const productNameEn = product.title?.en || product.name?.en || '';
    const productNameAr = product.title?.ar || product.name?.ar || '';
    const productSku = product.sku || '';
    const productBarcode = product.barcode || '';
    
    let totalScore = 0;
    let weightSum = 0;
    
    // Product name matching - English (40% weight)
    if (settings.enableEnglishMatching && productNameEn) {
      const score = fuzzyMatch(imageKeywords.product, productNameEn) * 0.4;
      totalScore += score;
      weightSum += 0.4;
    }
    
    // Product name matching - Arabic (40% weight)
    if (settings.enableArabicMatching && productNameAr) {
      const score = fuzzyMatch(imageKeywords.product, productNameAr) * 0.4;
      totalScore += score;
      weightSum += 0.4;
    }
    
    // SKU/Barcode matching (20% weight)
    const skuScore = fuzzyMatch(imageKeywords.product, productSku) * 0.1;
    const barcodeScore = fuzzyMatch(imageKeywords.product, productBarcode) * 0.1;
    totalScore += Math.max(skuScore, barcodeScore);
    weightSum += 0.2;
    
    const finalScore = Math.round((totalScore / weightSum) * 100);
    
    // Debug logging removed to prevent console spam
    
    return finalScore;
  };

  const extractKeywordsFromImage = (filename) => {
    // Remove common extensions and separators
    let cleanName = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    cleanName = cleanName.replace(/[_-]/g, ' ');
    
    // Remove company keywords
    const companyKeywords = ['sapt', 'شركة', 'company', 'شركة سابت'];
    for (const keyword of companyKeywords) {
      cleanName = cleanName.replace(new RegExp(keyword, 'gi'), '');
    }
    
    // Remove size patterns but keep the numbers
    const sizePatterns = [
      /(كبير|صغير|متوسط)/i,
      /(large|medium|small)/i,
      /(\d+)\s*(كجم|كيلو|kg|g)/i,
      /(\d+)\s*(لتر|liter|l)/i,
      /(\d+)\s*(مل|ml)/i
    ];
    
    for (const pattern of sizePatterns) {
      cleanName = cleanName.replace(pattern, '');
    }
    
    // Clean up extra spaces
    cleanName = cleanName.replace(/\s+/g, ' ').trim();
    
    return {
      product: cleanName
    };
  };

  const fuzzyMatch = (str1, str2) => {
    if (!str1 || !str2) return 0;
    
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    // Exact match
    if (s1 === s2) return 1;
    
    // Contains match (high score)
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;
    
    // Word-by-word matching
    const words1 = s1.split(/\s+/).filter(w => w.length > 2);
    const words2 = s2.split(/\s+/).filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    let exactWordMatches = 0;
    let partialWordMatches = 0;
    
    for (const word1 of words1) {
      for (const word2 of words2) {
        // Exact word match
        if (word1 === word2) {
          exactWordMatches++;
        }
        // Partial word match (one contains the other)
        else if (word1.includes(word2) || word2.includes(word1)) {
          partialWordMatches++;
        }
      }
    }
    
    // Calculate score based on word matches
    const totalWords = Math.max(words1.length, words2.length);
    const exactScore = exactWordMatches / totalWords;
    const partialScore = partialWordMatches / totalWords * 0.5;
    
    return Math.min(0.8, exactScore + partialScore);
  };

  const handleStartUpload = async () => {
    try {
      setUploadState('uploading');
      
      // Get all products with selected images
      const productsToUpload = Object.keys(selectedImages).filter(productId => 
        selectedImages[productId] && selectedImages[productId].length > 0
      );
      
      if (productsToUpload.length === 0) {
        toast.warning('No images selected for upload! Please select images first.');
        setUploadState('idle');
        return;
      }
      
      // Calculate total images to upload
      const totalImages = productsToUpload.reduce((total, productId) => 
        total + selectedImages[productId].length, 0
      );
      
      setUploadStats({ total: totalImages, processed: 0, success: 0, failed: 0, skipped: 0 });
      
      let processedCount = 0;
      
      for (const productId of productsToUpload) {
        const imageUrls = selectedImages[productId];
        
        for (const imageUrl of imageUrls) {
          try {
            // Upload image from URL to Cloudinary
            const uploadResult = await BulkImageUploadService.uploadImageFromUrl(imageUrl);
            
            // Update product with image URL
            await BulkImageUploadService.updateProductImage(productId, uploadResult.url);
            
            processedCount++;
            setUploadProgress((processedCount / totalImages) * 100);
            setUploadStats(prev => ({ 
              ...prev, 
              processed: processedCount, 
              success: prev.success + 1 
            }));
            
          } catch (error) {
            console.error(`Failed to upload image ${imageUrl}:`, error);
            processedCount++;
            setUploadStats(prev => ({ 
              ...prev, 
              processed: processedCount, 
              failed: prev.failed + 1 
            }));
          }
          
          // Small delay to prevent overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      toast.success(`Upload completed! ${uploadStats.success} successful, ${uploadStats.failed} failed`);
      setUploadState('completed');
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
      setUploadState('idle');
    }
  };

  const handleMatchUpdate = (index, action) => {
    if (action === 'approve') {
      setMatches(prev => prev.map((match, i) => 
        i === index ? { ...match, status: 'matched' } : match
      ));
      toast.success('Product marked as matched');
    } else if (action === 'reject') {
      setMatches(prev => prev.map((match, i) => 
        i === index ? { ...match, status: 'unmatched' } : match
      ));
      toast.info('Product marked as unmatched');
    } else if (action === 'manual') {
      setMatches(prev => prev.map((match, i) => 
        i === index ? { ...match, status: 'manual' } : match
      ));
      toast.success('Product marked for manual upload');
    } else if (action === 'preview') {
      // Show image preview
      const match = matches[index];
      if (match && match.imagePreview) {
        setPreviewImage(match.imagePreview);
        setShowImagePreview(true);
      } else {
        toast.error('No image preview available');
      }
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleSelectMatch = (index) => {
    setSelectedMatches(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAllMatches = () => {
    const filteredMatches = getFilteredMatches();
    setSelectedMatches(filteredMatches.map((_, index) => index));
  };

  const handleClearSelection = () => {
    setSelectedMatches([]);
  };

  const getFilteredMatches = () => {
    if (filterStatus === 'all') return matches;
    return matches.filter(match => {
      if (filterStatus === 'matched') return match.status === 'matched';
      if (filterStatus === 'manual') return match.status === 'manual';
      if (filterStatus === 'unmatched') return match.status === 'unmatched';
      return true;
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FiLink className="mr-3 text-blue-600" />
          Product Image Finder
        </h1>
        <p className="text-gray-600 mt-2">
          Find and upload product images from multiple websites (English & Arabic support)
        </p>
      </div>

      {/* Connection Status */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiDatabase className={`mr-2 ${dbConnected ? 'text-green-600' : 'text-red-600'}`} />
              <span className="font-medium">MongoDB Connection</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              dbConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {dbConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiCloud className={`mr-2 ${cloudinaryConnected ? 'text-green-600' : 'text-red-600'}`} />
              <span className="font-medium">Cloudinary Connection</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              cloudinaryConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {cloudinaryConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel - Settings & Actions */}
        <div className="lg:col-span-1">
          <SettingsPanel 
            settings={settings}
            onSettingsChange={setSettings}
            onLoadImages={handleLoadImages}
            onLoadProducts={handleLoadProducts}
            onStartMatching={handleStartMatching}
            onStartUpload={handleStartUpload}
            uploadState={uploadState}
            imagesCount={images.length}
            productsCount={products.length}
            matchesCount={matches.length}
          />
        </div>

        {/* Right Panel - Main Table & Preview */}
        <div className="lg:col-span-2">
                  <MatchingTable 
          matches={matches} 
          onMatchUpdate={handleMatchUpdate} 
          uploadState={uploadState}
          filterStatus={filterStatus}
          onFilterChange={handleFilterChange}
          selectedMatches={selectedMatches}
          onSelectMatch={handleSelectMatch}
          onSelectAllMatches={handleSelectAllMatches}
          onClearSelection={handleClearSelection}
        />

        {/* Image Preview Modal */}
        {showImagePreview && previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-2xl max-h-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Image Preview</h3>
                <button
                  onClick={() => setShowImagePreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          </div>
        )}
          
          {/* Progress Section */}
          {uploadState === 'uploading' && (
            <ProgressBar 
              current={uploadState}
              progress={uploadProgress}
              stats={uploadStats}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Settings Panel Component
const SettingsPanel = ({ 
  settings, 
  onSettingsChange, 
  onLoadImages, 
  onLoadProducts, 
  onStartMatching, 
  onStartUpload, 
  uploadState,
  imagesCount,
  productsCount,
  matchesCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FiSettings className="mr-2 text-gray-600" />
        Configuration
      </h3>
      
      {/* Stats */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Images Loaded:</span>
          <span className="font-medium">{imagesCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Products Loaded:</span>
          <span className="font-medium">{productsCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Matches Found:</span>
          <span className="font-medium">{matchesCount}</span>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Confidence Threshold: {settings.confidenceThreshold}%
          </label>
          <input
            type="range"
            min="50"
            max="95"
            value={settings.confidenceThreshold}
            onChange={(e) => onSettingsChange({
              ...settings,
              confidenceThreshold: parseInt(e.target.value)
            })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Batch Size</label>
          <select
            value={settings.batchSize}
            onChange={(e) => onSettingsChange({
              ...settings,
              batchSize: parseInt(e.target.value)
            })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={5}>5 items</option>
            <option value={10}>10 items</option>
            <option value={20}>20 items</option>
            <option value={50}>50 items</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Language Support</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableArabicMatching}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  enableArabicMatching: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm">Arabic Matching</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableEnglishMatching}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  enableEnglishMatching: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm">English Matching</span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-2">
        <button
          onClick={onLoadImages}
          disabled={uploadState !== 'idle'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
        >
          <FiUpload className="mr-2" />
          Load Images
        </button>
        
        <button
          onClick={onLoadProducts}
          disabled={uploadState !== 'idle'}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
        >
          <FiDatabase className="mr-2" />
          Load Products
        </button>
        
        <button
          onClick={onStartMatching}
          disabled={!imagesCount || !productsCount || uploadState !== 'idle'}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
        >
          <FiPlay className="mr-2" />
          Start Matching
        </button>
        
        <button
          onClick={onStartUpload}
          disabled={!matchesCount || uploadState !== 'idle'}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center"
        >
          <FiCloud className="mr-2" />
          Upload & Save
        </button>
      </div>
    </div>
  );
};

// Matching Table Component
const MatchingTable = ({ matches, onMatchUpdate, uploadState, filterStatus, onFilterChange, selectedMatches, onSelectMatch, onSelectAllMatches, onClearSelection }) => {
  const filteredMatches = filterStatus === 'all' ? matches : matches.filter(match => {
    if (filterStatus === 'matched') return match.status === 'matched';
    if (filterStatus === 'unmatched') return match.status === 'unmatched';
    return true;
  });

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FiInfo className="mx-auto text-gray-400 text-4xl mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Matches Yet</h3>
        <p className="text-gray-500">
          Load images and products, then start matching to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Product Matches</h3>
            <p className="text-sm text-gray-600">
              {filteredMatches.length} of {matches.length} items • {matches.filter(m => m.status === 'matched').length} matched
            </p>
          </div>
          
          {/* Filter Controls */}
          <div className="flex items-center space-x-2">
            <select 
              value={filterStatus} 
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Matches</option>
              <option value="matched">Matched Only</option>
              <option value="manual">Manual Only</option>
              <option value="unmatched">Unmatched Only</option>
            </select>
            
            <button
              onClick={onSelectAllMatches}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Select All
            </button>
            
            <button
              onClick={onClearSelection}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product Name (English)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product Name (Arabic)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Matched Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Confidence
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMatches.map((match, index) => (
              <tr key={index} className={`hover:bg-gray-50 ${selectedMatches.includes(index) ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMatches.includes(index)}
                      onChange={() => onSelectMatch(index)}
                      className="mr-2"
                    />
                    <div className="text-sm font-medium text-gray-900">
                      {match.productName?.en || 'Unknown'}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-700">
                    {match.productName?.ar || 'غير معروف'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span 
                      className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => onMatchUpdate(index, 'preview')}
                      title="Click to preview image"
                    >
                      {match.imageName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          match.confidence >= 80 ? 'bg-green-500' :
                          match.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${match.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm">{match.confidence}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    match.status === 'matched' ? 'bg-green-100 text-green-800' :
                    match.status === 'manual' ? 'bg-blue-100 text-blue-800' :
                    match.status === 'unmatched' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {match.status === 'matched' ? '✅ Matched' :
                     match.status === 'manual' ? '🔧 Manual' :
                     match.status === 'unmatched' ? '❌ Unmatched' : '⚠️ Unknown'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onMatchUpdate(index, 'preview')}
                      className="text-blue-600 hover:text-blue-800"
                      title="Preview Image"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMatchUpdate(index, 'approve')}
                      className="text-green-600 hover:text-green-800"
                      title="Approve Match"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMatchUpdate(index, 'manual')}
                      className="text-blue-600 hover:text-blue-800"
                      title="Mark for Manual Upload"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMatchUpdate(index, 'reject')}
                      className="text-red-600 hover:text-red-800"
                      title="Reject Match"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ current, progress, stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">Upload Progress</h4>
        <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="grid grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="font-medium">{stats.total}</div>
          <div className="text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-green-600">{stats.success}</div>
          <div className="text-gray-500">Success</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-red-600">{stats.failed}</div>
          <div className="text-gray-500">Failed</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-yellow-600">{stats.skipped}</div>
          <div className="text-gray-500">Skipped</div>
        </div>
      </div>
    </div>
  );
};

// Placeholder FiImage component
const FiImage = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default BulkImageUploader; 
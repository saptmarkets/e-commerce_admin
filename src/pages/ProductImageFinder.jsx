import React, { useState, useEffect } from 'react';
import { 
  FiUpload, 
  FiDatabase, 
  FiCloud, 
  FiLink,
  FiSearch,
  FiEye,
  FiCheck,
  FiX,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import BulkImageUploadService from '@/services/BulkImageUploadService';

const ProductImageFinder = () => {
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

  // Connection status states
  const [dbConnected, setDbConnected] = useState(false);
  const [cloudinaryConnected, setCloudinaryConnected] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Check connections on component mount
    checkConnections();
  }, []);

  const checkConnections = async () => {
    try {
      const response = await BulkImageUploadService.checkConnections();
      setDbConnected(response.dbConnected);
      setCloudinaryConnected(response.cloudinaryConnected);
    } catch (error) {
      console.error('Connection check failed:', error);
      setDbConnected(false);
      setCloudinaryConnected(false);
    }
  };

  const handleLoadProducts = async () => {
    try {
      setUploadState('loading');
      toast.info('Loading products without images...');
      
      const response = await BulkImageUploadService.loadProductsWithoutImages(1, 1000);
      setProducts(response.products || []);
      
      toast.success(`Loaded ${response.products?.length || 0} products`);
      setUploadState('idle');
    } catch (error) {
      toast.error('Failed to load products: ' + error.message);
      setUploadState('idle');
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
      
      // Filter out empty site links
      const validSiteUrls = siteLinks.filter(link => link && link.trim());
      
      if (validSiteUrls.length === 0) {
        toast.warning('Please add at least one website URL first');
        setUploadState('idle');
        return;
      }
      
      try {
        // Call backend service to fetch images from all sites at once
        const response = await BulkImageUploadService.fetchImagesFromMultipleSites(validSiteUrls, productName, productNameAr);
        
        // Map the results back to the original site indices
        const fetchedImages = {};
        validSiteUrls.forEach((siteUrl, index) => {
          const originalIndex = siteLinks.indexOf(siteUrl);
          fetchedImages[originalIndex] = response.images[index] || [];
        });
        
        setProductImages(prev => ({
          ...prev,
          [productId]: fetchedImages
        }));
        
        const totalImages = Object.values(fetchedImages).reduce((sum, images) => sum + images.length, 0);
        toast.success(`Found ${totalImages} images from ${validSiteUrls.length} sites`);
        setUploadState('idle');
      } catch (error) {
        console.error('Failed to fetch images:', error);
        toast.error('Failed to fetch images: ' + error.message);
        setUploadState('idle');
      }
    } catch (error) {
      toast.error('Failed to fetch images: ' + error.message);
      setUploadState('idle');
    }
  };

  const handleSelectImage = (productId, imageUrl, isSelected) => {
    setSelectedImages(prev => {
      const currentSelected = prev[productId] || [];
      
      if (isSelected) {
        return {
          ...prev,
          [productId]: [...currentSelected, imageUrl]
        };
      } else {
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

      {/* Site Links Configuration */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiLink className="mr-2 text-blue-600" />
            Website Links Configuration
          </h3>
          <p className="text-gray-600 mb-4">Add up to 5 website links where products might be found:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteLinks.map((link, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Site {index + 1}
                </label>
                <input
                  type="url"
                  placeholder={`https://example${index + 1}.com`}
                  value={link}
                  onChange={(e) => handleAddSiteLink(index, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions Panel */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleLoadProducts}
              disabled={uploadState === 'loading'}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <FiDatabase className="mr-2" />
              {uploadState === 'loading' ? 'Loading...' : 'Load Products'}
            </button>
            
            <button
              onClick={handleStartUpload}
              disabled={uploadState === 'uploading' || Object.keys(selectedImages).length === 0}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              <FiUpload className="mr-2" />
              {uploadState === 'uploading' ? 'Uploading...' : 'Upload Selected Images'}
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {products.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Products Without Images</h3>
            <p className="text-sm text-gray-600">{products.length} products loaded</p>
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
                  {siteLinks.map((link, index) => (
                    <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Site {index + 1}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {product.title?.en || product.name?.en || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">
                        {product.title?.ar || product.name?.ar || 'غير معروف'}
                      </div>
                    </td>
                    {siteLinks.map((link, siteIndex) => (
                      <td key={siteIndex} className="px-4 py-3">
                        {uploadState === 'fetching' && !productImages[product._id]?.[siteIndex] ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-xs text-gray-500">Loading...</span>
                          </div>
                        ) : productImages[product._id]?.[siteIndex] ? (
                          <div className="flex flex-wrap gap-1">
                            {productImages[product._id][siteIndex].map((image, imgIndex) => (
                              <div key={imgIndex} className="relative">
                                <img
                                  src={image.url}
                                  alt={image.title || "Product"}
                                  className="w-12 h-12 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500"
                                  onClick={() => {
                                    setPreviewImage(image.url);
                                    setShowImagePreview(true);
                                  }}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/48x48?text=Error';
                                    e.target.alt = 'Image failed to load';
                                  }}
                                  onLoad={(e) => {
                                    e.target.style.borderColor = 'transparent';
                                  }}
                                />
                                <input
                                  type="checkbox"
                                  checked={selectedImages[product._id]?.includes(image.url) || false}
                                  onChange={(e) => handleSelectImage(product._id, image.url, e.target.checked)}
                                  className="absolute -top-1 -right-1 w-4 h-4"
                                />
                                <div className="absolute -bottom-1 -left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                  {imgIndex + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">No images</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFetchImagesFromSites(product._id)}
                          disabled={uploadState === 'fetching'}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          title="Fetch Images"
                        >
                          <FiSearch className="w-4 h-4" />
                        </button>
                        {selectedImages[product._id]?.length > 0 && (
                          <>
                            <button
                              onClick={() => handleSelectAllImagesForProduct(product._id)}
                              className="text-green-600 hover:text-green-800"
                              title="Select All"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleClearSelectionForProduct(product._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Clear Selection"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {uploadState === 'uploading' && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Upload Progress</h4>
            <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium">{uploadStats.total}</div>
              <div className="text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-600">{uploadStats.success}</div>
              <div className="text-gray-500">Success</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-red-600">{uploadStats.failed}</div>
              <div className="text-gray-500">Failed</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-yellow-600">{uploadStats.skipped}</div>
              <div className="text-gray-500">Skipped</div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl max-h-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Image Preview</h3>
              <button
                onClick={() => setShowImagePreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-96 object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageFinder; 
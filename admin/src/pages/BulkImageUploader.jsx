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
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const BulkImageUploader = () => {
  const [uploadState, setUploadState] = useState('idle'); // idle, loading, matching, uploading, completed
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
    skipped: 0
  });
  const [settings, setSettings] = useState({
    confidenceThreshold: 70,
    batchSize: 10,
    uploadQuality: 'auto',
    retryAttempts: 3,
    enableArabicMatching: true,
    enableEnglishMatching: true
  });

  // Connection status states
  const [dbConnected, setDbConnected] = useState(false);
  const [cloudinaryConnected, setCloudinaryConnected] = useState(false);

  useEffect(() => {
    // Check connections on component mount
    checkConnections();
  }, []);

  const checkConnections = async () => {
    try {
      // Check MongoDB connection
      const dbResponse = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL || 'https://e-commerce-backend-l0s0.onrender.com/api'}/health`);
      setDbConnected(dbResponse.ok);
      
      // Check Cloudinary connection (we'll implement this later)
      setCloudinaryConnected(true); // Placeholder for now
    } catch (error) {
      console.error('Connection check failed:', error);
      setDbConnected(false);
      setCloudinaryConnected(false);
    }
  };

  const handleLoadImages = async () => {
    try {
      setUploadState('loading');
      toast.info('Loading images...');
      
      // Create file input for image selection
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const files = Array.from(e.target.files);
        const imageFiles = [];
        
        for (const file of files) {
          // Create preview URL
          const preview = URL.createObjectURL(file);
          
          imageFiles.push({
            name: file.name,
            path: file.path || file.name,
            size: file.size,
            preview: preview,
            file: file, // Keep the actual file for upload
            lastModified: file.lastModified
          });
        }
        
        setImages(imageFiles);
        toast.success(`Loaded ${imageFiles.length} images`);
        setUploadState('idle');
      };
      
      input.click();
    } catch (error) {
      toast.error('Failed to load images: ' + error.message);
      setUploadState('idle');
    }
  };

  const handleLoadProducts = async () => {
    try {
      setUploadState('loading');
      toast.info('Loading products without images...');
      
      // This will fetch from your existing API
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL || 'https://e-commerce-backend-l0s0.onrender.com/api'}/products/without-images`);
      const data = await response.json();
      
      setProducts(data.products || []);
      toast.success(`Loaded ${data.products?.length || 0} products without images`);
      setUploadState('idle');
    } catch (error) {
      toast.error('Failed to load products: ' + error.message);
      setUploadState('idle');
    }
  };

  const handleStartMatching = async () => {
    try {
      setUploadState('matching');
      toast.info('Starting image matching...');
      
      // This will be implemented with the matching service
      // For now, we'll simulate matching
      const mockMatches = images.map((image, index) => ({
        imageName: image.name,
        imagePath: image.path,
        imagePreview: image.preview,
        productId: index < products.length ? products[index]?.id : null,
        productName: index < products.length ? products[index]?.name : null,
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
        alternatives: ['Product A', 'Product B'],
        status: Math.random() > 0.3 ? 'matched' : 'manual'
      }));
      
      setMatches(mockMatches);
      toast.success(`Matched ${mockMatches.filter(m => m.status === 'matched').length} images`);
      setUploadState('idle');
    } catch (error) {
      toast.error('Failed to match images: ' + error.message);
      setUploadState('idle');
    }
  };

  const handleStartUpload = async () => {
    try {
      setUploadState('uploading');
      setUploadStats({ total: matches.length, processed: 0, success: 0, failed: 0, skipped: 0 });
      
      // This will be implemented with the upload service
      for (let i = 0; i < matches.length; i++) {
        setUploadProgress(((i + 1) / matches.length) * 100);
        setUploadStats(prev => ({ ...prev, processed: i + 1, success: i + 1 }));
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast.success('Upload completed successfully!');
      setUploadState('completed');
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
      setUploadState('idle');
    }
  };

  const handleMatchUpdate = (index, action) => {
    if (action === 'edit') {
      // Open edit modal or dropdown for manual selection
      toast.info('Manual selection feature coming soon...');
    } else if (action === 'preview') {
      // Show image preview
      toast.info('Image preview feature coming soon...');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FiUpload className="mr-3 text-blue-600" />
          Bulk Image Uploader
        </h1>
        <p className="text-gray-600 mt-2">
          Upload and match product images with database products (English & Arabic support)
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
          />
          
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
const MatchingTable = ({ matches, onMatchUpdate, uploadState }) => {
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
        <h3 className="text-lg font-semibold">Product Matches</h3>
        <p className="text-sm text-gray-600">
          {matches.length} items • {matches.filter(m => m.status === 'matched').length} matched
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product Name
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
            {matches.map((match, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <FiImage className="text-gray-400" />
                    </div>
                    <span className="ml-2 text-sm font-medium max-w-xs truncate">
                      {match.imageName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">
                      {match.productName || 'No match found'}
                    </div>
                    {match.alternatives && match.alternatives.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Alternatives: {match.alternatives.slice(0, 2).join(', ')}
                      </div>
                    )}
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
                    match.status === 'manual' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {match.status === 'matched' ? '✅ Matched' :
                     match.status === 'manual' ? '⚠️ Manual' : '❌ No Match'}
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
                      onClick={() => onMatchUpdate(index, 'edit')}
                      className="text-green-600 hover:text-green-800"
                      title="Edit Match"
                    >
                      <FiCheck className="w-4 h-4" />
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
import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiImage } from "react-icons/fi";
import BannerDrawer from "../components/drawer/BannerDrawer";
import axios from "axios";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  
  // Add error boundary state
  const [hasError, setHasError] = useState(false);

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      console.log('🔄 Starting fetchBanners...');
      setLoading(true);
      const response = await axios.get('/api/admin/banners');
      console.log('✅ Banners API response received:', response.data);
      
      if (response.data && response.data.banners) {
        console.log('📊 Raw banners data:', response.data.banners);
        // Ensure all banner objects have safe text fields
        const safeBanners = response.data.banners.map((banner, index) => {
          console.log(`🔍 Processing banner ${index + 1}/${response.data.banners.length}:`, banner);
          
          const safeTitle = getLocalizedText(banner.title, 'Untitled');
          const safeDescription = getLocalizedText(banner.description, '');
          
          // Double-check that we have strings
          const finalTitle = typeof safeTitle === 'string' ? safeTitle : 'Untitled';
          const finalDescription = typeof safeDescription === 'string' ? safeDescription : '';
          
          console.log(`✅ Banner ${banner._id} processed:`, {
            originalTitle: banner.title,
            safeTitle: finalTitle,
            originalDescription: banner.description,
            safeDescription: finalDescription
          });
          
          // Overwrite risky multilingual fields with safe strings to prevent accidental object rendering
          return {
            ...banner,
            title: finalTitle,
            description: finalDescription,
            linkText: getLocalizedText(banner.linkText, ''),
            ctaButtonText: getLocalizedText(banner.ctaButtonText, ''),
            _safeTitle: finalTitle,
            _safeDescription: finalDescription
          };
        });
        console.log('🎯 Final processed banners:', safeBanners);
        setBanners(safeBanners);
        console.log('✅ Banners state updated successfully');
      } else {
        console.log('⚠️ No banners data in response, setting empty array');
        setBanners([]);
      }
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching banners:', err);
      setError(err.response?.data?.message || 'Failed to fetch banners');
      setBanners([]);
    } finally {
      setLoading(false);
      console.log('🏁 fetchBanners completed');
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const getLocalizedText = (field, fallback = '') => {
    try {
      // Handle null, undefined, or empty values
      if (!field || field === null || field === undefined) return fallback;
      
      // Handle string values
      if (typeof field === 'string') {
        const trimmed = field.trim();
        return trimmed || fallback;
      }
      
      // Handle multilingual objects
      if (typeof field === 'object' && field !== null) {
        // Check if it's a multilingual object with en/ar keys
        // Only process if the value is a non-empty string
        if (field.en && typeof field.en === 'string' && field.en.trim() && field.en !== 'null') {
          const trimmed = field.en.trim();
          return trimmed || fallback;
        }
        if (field.ar && typeof field.ar === 'string' && field.ar.trim() && field.ar !== 'null') {
          const trimmed = field.ar.trim();
          return trimmed || fallback;
        }
        
        // If no valid multilingual text found, return fallback
        return fallback;
      }
      
      // For any other type, return fallback
      return fallback;
    } catch (error) {
      console.error('Error in getLocalizedText:', error, 'field:', field);
      return fallback;
    }
  };

  const handleAddBanner = () => {
    setSelectedBanner(null);
    setIsDrawerOpen(true);
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedBanner(null);
  };

  const handleRefresh = () => {
    fetchBanners();
  };

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          <div>Something went wrong. Please refresh the page.</div>
          <button 
            onClick={() => {
              setHasError(false);
              fetchBanners();
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading banners...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          <div>Error: {error}</div>
          <button 
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  try {
    console.log('🎨 Starting to render Banners component...');
    console.log('📊 Current banners state:', banners);
    console.log('🔄 Loading state:', loading);
    console.log('❌ Error state:', error);
    
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              Refresh
            </button>
            <button 
              onClick={handleAddBanner}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiPlus className="mr-2" />
              Add Banner
            </button>
          </div>
        </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            All Banners ({banners.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <tr key={banner._id || banner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {banner.imageUrl ? (
                          <img 
                            src={banner.imageUrl} 
                            alt={(() => {
                              const alt = banner._safeTitle;
                              return typeof alt === 'string' ? alt : 'Banner';
                            })()} 
                            className="w-12 h-8 object-cover rounded border" 
                          />
                        ) : (
                          <div className="w-12 h-8 bg-gray-200 rounded border flex items-center justify-center">
                            <FiImage className="text-gray-400 text-sm" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {(() => {
                          const title = banner._safeTitle;
                          return typeof title === 'string' ? title : 'Untitled';
                        })()}
                      </div>
                      {(() => {
                        const desc = banner._safeDescription;
                        return typeof desc === 'string' && desc.trim() ? (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            {desc}
                          </div>
                        ) : null;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{banner.location || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        banner.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : banner.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditBanner(banner)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="text-gray-500">No banners found</div>
                    <button 
                      onClick={handleAddBanner}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      Create your first banner
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDrawerOpen && (
        <BannerDrawer 
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          banner={(() => {
            // Ensure selectedBanner is safe before passing to BannerDrawer
            if (!selectedBanner) return null;
            
            try {
              // Create a safe copy of the banner with only string values
              const safeBanner = {
                _id: selectedBanner._id,
                location: typeof selectedBanner.location === 'string' ? selectedBanner.location : 'home-hero',
                status: typeof selectedBanner.status === 'string' ? selectedBanner.status : 'active',
                imageUrl: typeof selectedBanner.imageUrl === 'string' ? selectedBanner.imageUrl : '',
                title: selectedBanner.title, // Pass original for processing in BannerDrawer
                description: selectedBanner.description // Pass original for processing in BannerDrawer
              };
              
              console.log('🛡️ Safe banner created for BannerDrawer:', safeBanner);
              return safeBanner;
            } catch (error) {
              console.error('❌ Error creating safe banner:', error);
              return null;
            }
          })()}
          onSuccess={handleRefresh}
        />
      )}
    </div>
    );
  } catch (error) {
    console.error('Error rendering Banners component:', error);
    setHasError(true);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          <div>Something went wrong while rendering. Please refresh the page.</div>
          <button 
            onClick={() => {
              setHasError(false);
              fetchBanners();
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
};

export default Banners;



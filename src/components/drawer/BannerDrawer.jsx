import React, { useState, useEffect } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import axios from "axios";

const BannerDrawer = ({ isOpen, onClose, banner = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    location: 'home-hero',
    status: 'active',
    imageUrl: '',
    showTitle: true
  });

  const [loading, setLoading] = useState(false);

  // Reset form when banner changes or drawer opens
  useEffect(() => {
    try {
      console.log('🔧 BannerDrawer useEffect triggered with banner:', banner);
      
      if (banner) {
        // Handle multilingual text objects safely
        const title = banner.title || '';
        const description = banner.description || '';
        
        console.log('🔍 Processing title:', title, 'type:', typeof title);
        console.log('🔍 Processing description:', description, 'type:', typeof description);
        
        // Safe extraction of multilingual text with additional safety checks
        const safeTitleEn = (() => {
          if (typeof title === 'string') return title;
          if (title && typeof title === 'object' && title.en && typeof title.en === 'string') {
            const trimmed = title.en.trim();
            return trimmed || '';
          }
          return '';
        })();
        
        const safeTitleAr = (() => {
          if (typeof title === 'string') return '';
          if (title && typeof title === 'object' && title.ar && typeof title.ar === 'string') {
            const trimmed = title.ar.trim();
            return trimmed || '';
          }
          return '';
        })();
        
        const safeDescEn = (() => {
          if (typeof description === 'string') return description;
          if (description && typeof description === 'object' && description.en && typeof description.en === 'string') {
            const trimmed = description.en.trim();
            return trimmed || '';
          }
          return '';
        })();
        
        const safeDescAr = (() => {
          if (typeof description === 'string') return '';
          if (description && typeof description === 'object' && description.ar && typeof description.ar === 'string') {
            const trimmed = description.ar.trim();
            return trimmed || '';
          }
          return '';
        })();
        
        console.log('✅ Safe values extracted:', {
          safeTitleEn,
          safeTitleAr,
          safeDescEn,
          safeDescAr
        });
        
        setFormData({
          title: safeTitleEn,
          titleAr: safeTitleAr,
          description: safeDescEn,
          descriptionAr: safeDescAr,
          location: banner.location || 'home-hero',
          status: banner.status || 'active',
          imageUrl: banner.imageUrl || '',
          showTitle: typeof banner.showTitle === 'boolean' ? banner.showTitle : true
        });
      } else {
        console.log('🔄 Resetting form to default values');
        setFormData({
          title: '',
          titleAr: '',
          description: '',
          descriptionAr: '',
          location: 'home-hero',
          status: 'active',
          imageUrl: '',
          showTitle: true
        });
      }
    } catch (error) {
      console.error('❌ Error in BannerDrawer useEffect:', error);
      // Set safe default values on error
      setFormData({
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        location: 'home-hero',
        status: 'active',
        imageUrl: ''
      });
    }
  }, [banner]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare banner data with multilingual support
      const titleEn = (typeof formData.title === 'string' ? formData.title : '').trim();
      const titleAr = (typeof formData.titleAr === 'string' ? formData.titleAr : '').trim();
      const normalizedTitle = {
        en: titleEn || (titleAr ? '' : 'Untitled'),
        ar: titleAr || ''
      };

      const bannerData = {
        title: normalizedTitle,
        description: formData.description.trim() ? {
          en: formData.description.trim(),
          ar: formData.descriptionAr.trim()
        } : undefined,
        location: formData.location,
        status: formData.status,
        imageUrl: formData.imageUrl,
        showTitle: !!formData.showTitle
      };

      if (banner) {
        // Update existing banner
        await axios.put(`/api/admin/banners/${banner._id}`, bannerData);
        console.log('Banner updated successfully');
      } else {
        // Create new banner
        await axios.post('/api/admin/banners', bannerData);
        console.log('Banner created successfully');
      }

      // Call onSuccess to refresh the banner list
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert(error.response?.data?.message || 'Error saving banner');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">
            {banner ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full pb-20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showTitle"
                  checked={!!formData.showTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, showTitle: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Show Title on Customer App</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (English)
              </label>
              <input
                type="text"
                name="title"
                value={typeof formData.title === 'string' ? formData.title : ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter banner title in English"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (Arabic)
              </label>
              <input
                type="text"
                name="titleAr"
                value={typeof formData.titleAr === 'string' ? formData.titleAr : ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="أدخل عنوان البانر بالعربية"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (English)
              </label>
              <textarea
                name="description"
                value={typeof formData.description === 'string' ? formData.description : ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter banner description in English"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Arabic)
              </label>
              <textarea
                name="descriptionAr"
                value={typeof formData.descriptionAr === 'string' ? formData.descriptionAr : ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="أدخل وصف البانر بالعربية"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="home-hero">Home Page Hero</option>
                <option value="home-middle">Home Page Middle</option>
                <option value="products-hero">Products Page Hero</option>
                <option value="category-top">Category Section Top</option>
                <option value="promotions-hero">Promotions Page Hero</option>
                <option value="page-header">Page Headers</option>
                <option value="sidebar-ads">Sidebar Advertisements</option>
                <option value="footer-banner">Footer Banner</option>
              </select>
            </div>

            {/* Visibility controls */}
            <div>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showTitle"
                  checked={!!formData.showTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, showTitle: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Show Title on Customer App</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {loading ? 'Saving...' : (banner ? 'Update Banner' : 'Create Banner')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannerDrawer;



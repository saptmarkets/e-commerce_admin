import requests from './httpService';
import axios from 'axios';
import Cookies from 'js-cookie';

class BulkImageUploadService {
  constructor() {
    this.baseURL = import.meta.env.VITE_APP_API_BASE_URL || 'https://e-commerce-backend-l0s0.onrender.com/api';
  }

  // Load images from directory (backend will handle file system)
  async loadImagesFromDirectory(directoryPath) {
    try {
      return await requests.post('/bulk-upload/load-images', {
        directoryPath
      });
    } catch (error) {
      throw new Error(`Failed to load images: ${error.message}`);
    }
  }

  // Load products without images
  async loadProductsWithoutImages(page = 1, limit = 1000, search = '', category = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (search) {
        params.append('title', search);
      }
      
      if (category) {
        params.append('category', category);
      }
      
      return await requests.get(`/bulk-upload/products/without-images?${params}`);
    } catch (error) {
      console.error('Error loading products without images:', error);
      throw new Error(`Failed to load products: ${error.message}`);
    }
  }

  // Match images with products
  async matchImagesWithProducts(images, products, settings) {
    try {
      return await requests.post('/bulk-upload/match', {
        images,
        products,
        settings
      });
    } catch (error) {
      throw new Error(`Failed to match products: ${error.message}`);
    }
  }

  // Upload images to Cloudinary and update database
  async uploadImagesToCloudinary(matches, onProgress) {
    const results = [];
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      
      try {
        // Upload to Cloudinary
        const uploadResult = await this.uploadToCloudinary(match.file || match.imagePath);
        
        // Update database
        if (match.productId) {
          await this.updateProductImage(match.productId, uploadResult.url);
        }
        
        results.push({
          ...match,
          status: 'success',
          cloudinaryUrl: uploadResult.url
        });
        
        onProgress(i + 1, matches.length);
      } catch (error) {
        results.push({
          ...match,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return results;
  }

  async uploadToCloudinary(fileOrPath) {
    try {
      if (fileOrPath instanceof File) {
        // Upload file directly using axios for better FormData handling
        const formData = new FormData();
        formData.append('image', fileOrPath);
        
        // Get authentication token from cookies (same as httpService)
        let adminInfo;
        if (Cookies.get("adminInfo")) {
          adminInfo = JSON.parse(Cookies.get("adminInfo"));
        }
        
        const response = await axios.post(`${this.baseURL}/bulk-upload/upload-file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': adminInfo ? `Bearer ${adminInfo.token}` : null
          }
        });
        
        return response.data;
      } else {
        // Upload by path
        return await requests.post('/bulk-upload/upload-to-cloudinary', {
          imagePath: fileOrPath
        });
      }
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async updateProductImage(productId, imageUrl) {
    try {
      return await requests.put(`/bulk-upload/products/${productId}/image`, {
        image_url: imageUrl
      });
    } catch (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }
  }

  // Fetch images from a website
  async fetchImagesFromSite(siteUrl, productNameEn, productNameAr) {
    try {
      return await requests.post('/bulk-upload/fetch-images-from-site', {
        siteUrl,
        productNameEn,
        productNameAr
      });
    } catch (error) {
      throw new Error(`Failed to fetch images from site: ${error.message}`);
    }
  }

  // Fetch images from multiple websites
  async fetchImagesFromMultipleSites(siteUrls, productNameEn, productNameAr) {
    try {
      return await requests.post('/bulk-upload/fetch-images-from-multiple-sites', {
        siteUrls,
        productNameEn,
        productNameAr
      });
    } catch (error) {
      throw new Error(`Failed to fetch images from multiple sites: ${error.message}`);
    }
  }

  // Upload image from URL to Cloudinary
  async uploadImageFromUrl(imageUrl) {
    try {
      return await requests.post('/bulk-upload/upload-from-url', {
        imageUrl
      });
    } catch (error) {
      throw new Error(`Failed to upload image from URL: ${error.message}`);
    }
  }

  // Check connection status
  async checkConnections() {
    try {
      const [dbResponse, cloudinaryResponse] = await Promise.all([
        requests.get('/bulk-upload/check-mongodb'),
        requests.get('/bulk-upload/check-cloudinary')
      ]);
      
      return {
        dbConnected: dbResponse.connected,
        cloudinaryConnected: cloudinaryResponse.connected,
        dbStatus: dbResponse,
        cloudinaryStatus: cloudinaryResponse
      };
    } catch (error) {
      console.error('Connection check error:', error);
      return {
        dbConnected: false,
        cloudinaryConnected: false,
        error: error.message
      };
    }
  }
}

export default new BulkImageUploadService(); 
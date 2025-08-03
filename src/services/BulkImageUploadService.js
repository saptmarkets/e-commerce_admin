import requests from './httpService';

class BulkImageUploadService {
  constructor() {
    // No need for baseURL since httpService handles it
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
  async loadProductsWithoutImages(page = 1, limit = 50, search = '', category = '') {
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
        // Upload file directly
        const formData = new FormData();
        formData.append('image', fileOrPath);
        
        const response = await axios.post(`${this.baseURL}/bulk-upload/upload-file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Upload by path
        const response = await axios.post(`${this.baseURL}/bulk-upload/upload-to-cloudinary`, {
          imagePath: fileOrPath
        });
        return response.data;
      }
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async updateProductImage(productId, imageUrl) {
    try {
      const response = await axios.put(`${this.baseURL}/bulk-upload/products/${productId}/image`, {
        image_url: imageUrl
      });
      return response.data;
    } catch (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }
  }

  // Check connection status
  async checkConnections() {
    try {
      const [dbResponse, cloudinaryResponse] = await Promise.all([
        axios.get(`${this.baseURL}/bulk-upload/check-mongodb`),
        axios.get(`${this.baseURL}/bulk-upload/check-cloudinary`)
      ]);
      
      return {
        dbConnected: dbResponse.data.connected,
        cloudinaryConnected: cloudinaryResponse.data.connected,
        dbStatus: dbResponse.data,
        cloudinaryStatus: cloudinaryResponse.data
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
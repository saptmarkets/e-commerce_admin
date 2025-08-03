import axios from 'axios';

class BulkImageUploadService {
  constructor() {
    this.baseURL = import.meta.env.VITE_APP_API_BASE_URL || 'https://e-commerce-backend-l0s0.onrender.com/api';
  }

  // Load images from directory (backend will handle file system)
  async loadImagesFromDirectory(directoryPath) {
    try {
      const response = await axios.post(`${this.baseURL}/bulk-upload/load-images`, {
        directoryPath
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to load images: ${error.message}`);
    }
  }

  // Load products without images
  async loadProductsWithoutImages() {
    try {
      const response = await axios.get(`${this.baseURL}/bulk-upload/products/without-images`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to load products: ${error.message}`);
    }
  }

  // Match images with products
  async matchImagesWithProducts(images, products, settings) {
    try {
      const response = await axios.post(`${this.baseURL}/bulk-upload/match`, {
        images,
        products,
        settings
      });
      return response.data;
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
      let response;
      
      if (fileOrPath instanceof File) {
        // Upload file directly
        const formData = new FormData();
        formData.append('image', fileOrPath);
        
        response = await axios.post(`${this.baseURL}/bulk-upload/upload-file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Upload by path
        response = await axios.post(`${this.baseURL}/bulk-upload/upload-to-cloudinary`, {
          imagePath: fileOrPath
        });
      }
      
      return response.data;
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
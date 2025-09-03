import requests from "./httpService";
import Cookies from "js-cookie";

/**
 * OdooIntegrationServices
 * ---------------------------------------------------------
 * Service layer for interacting with the backend
 * Odoo Integration API endpoints for order processing.
 */

const OdooIntegrationServices = {
  /**
   * Get Odoo integration statistics
   * GET /api/odoo-integration/statistics
   */
  getStatistics: () => requests.get("/odoo-integration/statistics"),

  /**
   * Get Odoo integration sessions
   * GET /api/odoo-integration/sessions
   */
  getSessions: (params = {}) => requests.get("/odoo-integration/sessions", { params }),

  /**
   * Get pending orders
   * GET /api/odoo-integration/pending-orders
   */
  getPendingOrders: (params = {}) => requests.get("/odoo-integration/pending-orders", { params }),

  /**
   * Get failed orders
   * GET /api/odoo-integration/failed-orders
   */
  getFailedOrders: (params = {}) => requests.get("/odoo-integration/failed-orders", { params }),

  /**
   * Process orders for a specific date with real-time progress tracking
   * POST /api/odoo-integration/process-orders
   */
  processOrders: (data) => requests.post("/odoo-integration/process-orders", data),

  /**
   * Process orders with real-time progress tracking using Server-Sent Events
   * POST /api/odoo-integration/process-orders (with SSE support)
   */
  processOrdersWithProgress: (data, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Get auth token from adminInfo cookie (same as httpService)
      let adminInfo;
      let token = null;
      if (Cookies.get("adminInfo")) {
        try {
          adminInfo = JSON.parse(Cookies.get("adminInfo"));
          token = adminInfo.token;
        } catch (error) {
          console.error('Error parsing adminInfo cookie:', error);
        }
      }
      console.log('🔑 Auth token found:', token ? 'Yes' : 'No');
      
      // Use the same base URL as the regular requests
      const baseURL = process.env.REACT_APP_API_URL || 'https://e-commerce-backend-l0s0.onrender.com/api';
      const apiUrl = `${baseURL}/odoo-integration/process-orders`;
      console.log('🌐 Making SSE request to:', apiUrl);
      
      xhr.open('POST', apiUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'text/event-stream');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      
      // Add authorization header if token exists
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        console.log('🔐 Authorization header added');
      } else {
        console.log('⚠️ No auth token found');
      }
      
      let buffer = '';
      
      xhr.onreadystatechange = function() {
        console.log('📡 XHR State:', xhr.readyState, 'Status:', xhr.status);
        
        if (xhr.readyState === 3) { // Loading
          const newData = xhr.responseText.substring(buffer.length);
          buffer = xhr.responseText;
          
          const lines = newData.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                console.log('📊 SSE Data received:', data);
                if (onProgress) {
                  onProgress(data);
                }
                
                // Check for completion or error
                if (data.type === 'processing_completed') {
                  resolve(data);
                } else if (data.type === 'processing_error') {
                  reject(new Error(data.error));
                }
              } catch (error) {
                console.error('Error parsing SSE data:', error);
              }
            }
          }
        } else if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // SSE connection completed successfully
            console.log('✅ SSE connection completed successfully');
            resolve({ success: true });
          } else {
            console.error('SSE request failed:', xhr.status, xhr.statusText);
            console.error('Response text:', xhr.responseText);
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        }
      };
      
      xhr.onerror = function() {
        console.error('SSE network error');
        reject(new Error('Network error'));
      };
      
      console.log('📤 Sending request with data:', JSON.stringify(data));
      xhr.send(JSON.stringify(data));
    });
  },

  /**
   * Process orders with fallback to regular HTTP request (for compatibility)
   * POST /api/odoo-integration/process-orders (fallback version)
   */
  processOrdersWithFallback: async (data, onProgress) => {
    try {
      // First try SSE
      console.log('🔄 Attempting SSE connection...');
      console.log('📋 Request data:', data);
      const baseURL = process.env.REACT_APP_API_URL || 'https://e-commerce-backend-l0s0.onrender.com/api';
      console.log('📋 API URL:', `${baseURL}/odoo-integration/process-orders`);
      
      return await OdooIntegrationServices.processOrdersWithProgress(data, onProgress);
    } catch (error) {
      console.log('⚠️ SSE failed, falling back to regular HTTP request:', error.message);
      
      // Fallback to regular HTTP request
      console.log('🔄 Using fallback HTTP request...');
      const res = await requests.post("/odoo-integration/process-orders", data);
      
      if (res.success) {
        // Simulate progress updates for the fallback
        if (onProgress) {
          onProgress({
            type: 'session_started',
            message: 'Processing started (fallback mode)...',
            progress: 10
          });
          
          onProgress({
            type: 'orders_found',
            message: 'Orders found, processing...',
            progress: 30
          });
          
          onProgress({
            type: 'session_completed',
            message: `Processing completed: ${res.results?.successful || 0}/${res.results?.processed || 0} orders synced`,
            progress: 100,
            results: res.results
          });
        }
        
        return res;
      } else {
        throw new Error(res.error || 'Processing failed');
      }
    }
  },

  /**
   * Retry failed orders
   * POST /api/odoo-integration/retry-failed-orders
   */
  retryFailedOrders: (data) => requests.post("/odoo-integration/retry-failed-orders", data),

  /**
   * Get session details
   * GET /api/odoo-integration/session/:sessionId
   */
  getSessionDetails: (sessionId) => requests.get(`/odoo-integration/session/${sessionId}`),

  /**
   * Reset order sync status
   * POST /api/odoo-integration/reset-order/:orderId
   */
  resetOrderSyncStatus: (orderId) => requests.post(`/odoo-integration/reset-order/${orderId}`),

  /**
   * Manual sync order
   * POST /api/odoo-integration/order/:orderId/sync
   */
  manualSyncOrder: (orderId, adminEmail) => requests.post(`/odoo-integration/order/${orderId}/sync`, { adminEmail }),

  /**
   * Get Odoo configuration
   * GET /api/odoo-integration/config
   */
  getConfig: () => requests.get("/odoo-integration/config"),

  /**
   * Update Odoo configuration
   * PUT /api/odoo-integration/config
   */
  updateConfig: (configData) => requests.put("/odoo-integration/config", configData),

  // ========================================
  // COUPON/GIFT CARD MANAGEMENT
  // ========================================

  /**
   * Get all coupons/gift cards from Odoo
   * GET /api/odoo-integration/coupons
   */
  getAllCoupons: () => requests.get("/odoo-integration/coupons"),

  /**
   * Create a new gift card in Odoo
   * POST /api/odoo-integration/create-gift-card
   */
  createGiftCard: (data) => requests.post("/odoo-integration/create-gift-card", data),

  /**
   * Check gift card balance
   * GET /api/odoo-integration/gift-card-balance/:code
   */
  checkGiftCardBalance: (code) => requests.get(`/odoo-integration/gift-card-balance/${code}`),

  /**
   * Validate a coupon code
   * POST /api/odoo-integration/validate-coupon
   */
  validateCoupon: (data) => requests.post("/odoo-integration/validate-coupon", data),

  /**
   * Apply a coupon to an order
   * POST /api/odoo-integration/apply-coupon
   */
  applyCoupon: (data) => requests.post("/odoo-integration/apply-coupon", data)
};

export default OdooIntegrationServices;

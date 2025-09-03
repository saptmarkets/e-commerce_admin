import requests from "./httpService";

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
      
      xhr.open('POST', `${process.env.REACT_APP_API_URL || ''}/api/odoo-integration/process-orders`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'text/event-stream');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      
      let buffer = '';
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 3) { // Loading
          const newData = xhr.responseText.substring(buffer.length);
          buffer = xhr.responseText;
          
          const lines = newData.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
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
            resolve({ success: true });
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error'));
      };
      
      xhr.send(JSON.stringify(data));
    });
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

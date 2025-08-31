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
   * Process orders for a specific date
   * POST /api/odoo-integration/process-orders
   */
  processOrders: (data) => requests.post("/odoo-integration/process-orders", data),

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
};

export default OdooIntegrationServices;

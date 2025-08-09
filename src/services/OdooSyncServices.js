import requests from "./httpService";

/**
 * OdooSyncServices
 * ---------------------------------------------------------
 * A simple service layer for interacting with the backend
 * Odoo Sync API endpoints. All methods return the raw API
 * response allowing callers to handle success/error cases.
 */

const OdooSyncServices = {
  /**
   * Test Odoo connection
   * GET /api/odoo-sync/connection/test
   */
  testConnection: () => requests.get("/odoo-sync/connection/test"),

  /**
   * Get current connection status
   * GET /api/odoo-sync/connection/status
   */
  getConnectionStatus: () => requests.get("/odoo-sync/connection/status"),

  /**
   * Fetch data from Odoo to temporary odoo_* collections.
   * @param {Array<string>} dataTypes - Optional list of data types, defaults to ['all']
   */
  fetchFromOdoo: (dataTypes = ["all"]) =>
    requests.post("/odoo-sync/fetch", { dataTypes }),

  /**
   * Fetch data from Odoo with batching support
   * @param {Array<string>} dataTypes - Optional list of data types, defaults to ['all']
   * @param {number} offset - Starting position for batched fetch
   * @param {number} limit - Maximum number of records to fetch
   */
  fetchFromOdooBatched: (dataTypes = ["all"], offset = 0, limit = null) =>
    requests.post("/odoo-sync/fetch", { 
      dataTypes, 
      offset: offset || 0, 
      limit: limit || undefined 
    }),

  /**
   * Retrieve high-level statistics about fetched data.
   */
  getStatistics: () => requests.get("/odoo-sync/statistics"),

  /**
   * Preview import from odoo_* collections into store collections.
   * @param {Array<string>} dataTypes
   */
  getImportPreview: (dataTypes = ["all"]) =>
    requests.post("/odoo-sync/import/preview", { dataTypes }),

  /**
   * Trigger actual import into store collections.
   * @param {Array<string>} dataTypes
   */
  importToStore: (dataTypes = ["all"]) =>
    requests.post("/odoo-sync/import", { dataTypes }),

  /**
   * Clear temporary odoo_* collections (dangerous!).
   */
  clearOdooData: () => requests.delete("/odoo-sync/clear"),

  /**
   * Sync store with selected fields
   * @param {Object} payload
   */
  syncToStore: (payload) => requests.post("/odoo-sync/sync", payload),

  /**
   * Get internal locations (branches) list
   */
  listBranches: () => requests.get("/odoo-sync/branches"),

  /**
   * Push accumulated stock back to Odoo.
   * If locationId omitted, backend will fall back to env var.
   */
  pushBackStock: (payload) => requests.post("/odoo-sync/push-back/stock", payload),

  // New Category-based Sync Methods
  /**
   * Get all categories for sync selection
   * GET /api/odoo-sync/categories
   */
  getOdooCategories: () => requests.get("/odoo-sync/categories"),

  /**
   * Sync products by category with progress
   * POST /api/odoo/sync-category-products
   */
  syncCategoryProducts: (categoryId) => 
    requests.post("/odoo/sync-category-products", { categoryId }),

  /**
   * Sync selected categories with updated prices (like fetch data but for specific categories)
   * POST /api/odoo/sync-selected-categories
   */
  syncSelectedCategories: (categoryIds) =>
    requests.post("/odoo/sync-selected-categories", { categoryIds }),

  /**
   * Get products by category
   * GET /api/odoo/products/category/:categoryId
   */
  getProductsByCategory: (categoryId, params = {}) => 
    requests.get(`/odoo/products/category/${categoryId}`, { params }),

  /**
   * Get stock levels by category
   * GET /api/odoo/stock/category/:categoryId
   */
  getStockByCategory: (categoryId, params = {}) => 
    requests.get(`/odoo/stock/category/${categoryId}`, { params }),
};

export default OdooSyncServices; 
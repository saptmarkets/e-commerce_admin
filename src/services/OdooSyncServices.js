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
  syncToStore: (payload) => {
    console.log('🚨🚨🚨 OdooSyncServices.syncToStore called! 🚨🚨🚨');
    console.log('🔍 Payload:', payload);
    console.log('🔍 Calling requests.post("/odoo-sync/sync", payload)');
    return requests.post("/odoo-sync/sync", payload);
  },

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
   * GET /api/odoo/categories
   */
  getOdooCategories: () => requests.get("/odoo/categories"),

  /**
   * Sync products by category with progress
   * POST /api/odoo/sync-category/:categoryId
   */
  syncCategoryProducts: (categoryId) => 
    requests.post(`/odoo/sync-category/${categoryId}`),

  /**
   * Sync selected categories with updated prices (like fetch data but for specific categories)
   * POST /api/odoo/sync-categories
   * @param {Array<number>} categoryIds - Array of category IDs to sync
   * @param {Function} progressCallback - Optional callback for progress updates
   */
  syncSelectedCategories: (categoryIds, progressCallback = null) => {
    if (progressCallback) {
      // If progress callback is provided, use polling approach
      return new Promise((resolve, reject) => {
        const syncRequest = requests.post("/odoo/sync-categories", { categoryIds });
        
        syncRequest.then(response => {
          // Start polling for progress if sync is in progress
          if (response.data?.status === 'syncing' || response.data?.status === 'syncing_barcode_units') {
            pollSyncProgress(categoryIds, progressCallback, resolve, reject);
          } else {
            resolve(response);
          }
        }).catch(reject);
      });
    }
    
    // No progress callback, return direct response
    return requests.post("/odoo/sync-categories", { categoryIds });
  },

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

  /**
   * Poll sync progress for category sync operations
   * @private
   */
  pollSyncProgress: (categoryIds, progressCallback, resolve, reject) => {
    const pollInterval = setInterval(async () => {
      try {
        // Check progress for each category
        const progressPromises = categoryIds.map(categoryId => 
          requests.get(`/odoo/sync-category/${categoryId}/progress`)
        );
        
        const progressResponses = await Promise.all(progressPromises);
        const overallProgress = {
          status: 'syncing',
          totalCategories: categoryIds.length,
          completedCategories: 0,
          currentCategory: null,
          barcodeUnitsProgress: null
        };
        
        // Aggregate progress from all categories
        progressResponses.forEach((response, index) => {
          const categoryProgress = response.data;
          if (categoryProgress?.status === 'completed') {
            overallProgress.completedCategories++;
          } else if (categoryProgress?.status === 'syncing' || categoryProgress?.status === 'syncing_barcode_units') {
            overallProgress.currentCategory = categoryProgress.category;
            overallProgress.barcodeUnitsProgress = categoryProgress.barcodeUnitsProgress;
          }
        });
        
        // Call progress callback
        progressCallback(overallProgress);
        
        // Check if all categories are completed
        if (overallProgress.completedCategories === categoryIds.length) {
          clearInterval(pollInterval);
          // Get final result
          const finalResult = await requests.post("/odoo/sync-categories", { categoryIds });
          resolve(finalResult);
        }
      } catch (error) {
        clearInterval(pollInterval);
        reject(error);
      }
    }, 2000); // Poll every 2 seconds
  },

  /**
   * Promotions-only: Fetch public pricelist items using new lightweight route.
   * POST /api/odoo-sync/refresh-public-pricelist-items
   * @param {Object} options
   *   - incremental: boolean (default false)
   *   - forceRefresh: boolean (default true)
   */
  fetchPublicPricelistItems: (options = {}) => {
    const { incremental = false, forceRefresh = true } = options;
    // Use new lightweight route that only handles pricelist items
    return requests.post('/odoo-sync/refresh-public-pricelist-items', { incremental, forceRefresh });
  },
};

export default OdooSyncServices; 
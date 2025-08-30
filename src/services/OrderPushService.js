/**
 * Order Push Service for Admin Interface
 * Based on Plan 03: Admin Interface Plan
 */

import httpService from './httpService';

const OrderPushService = {
  // Create new session
  createSession: async (sessionData) => {
    try {
      const response = await httpService.post('/api/odoo-integration/order-push-sessions', sessionData);
      return response.data;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  },
  
  // Get all sessions
  getSessions: async (params = {}) => {
    try {
      const response = await httpService.get('/api/odoo-integration/sessions', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get sessions:', error);
      throw error;
    }
  },
  
  // Get session details
  getSessionDetails: async (sessionId) => {
    try {
      const response = await httpService.get(`/api/odoo-integration/order-push-sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get session details:', error);
      throw error;
    }
  },
  
  // Retry failed orders
  retryFailedOrders: async (sessionId) => {
    try {
      const response = await httpService.post(`/api/odoo-integration/order-push-sessions/${sessionId}/retry`);
      return response.data;
    } catch (error) {
      console.error('Failed to retry orders:', error);
      throw error;
    }
  },
  
  // Get session statistics
  getSessionStats: async (period = '30d') => {
    try {
      const response = await httpService.get('/api/odoo-integration/order-push-sessions/stats', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get session stats:', error);
      throw error;
    }
  },

  // Get session reports
  getSessionReports: async (params = {}) => {
    try {
      const response = await httpService.get('/api/odoo-integration/order-push-sessions/reports', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get session reports:', error);
      throw error;
    }
  },

  // Export session report
  exportSessionReport: async (params = {}) => {
    try {
      const response = await httpService.get('/api/odoo-integration/order-push-sessions/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export session report:', error);
      throw error;
    }
  },

  // Get pending sync orders
  getPendingSyncOrders: async (params = {}) => {
    try {
      const response = await httpService.get('/api/odoo-integration/orders/pending-sync', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get pending sync orders:', error);
      throw error;
    }
  },

  // Manual order sync
  syncOrderManually: async (orderId) => {
    try {
      const response = await httpService.post(`/api/odoo-integration/orders/${orderId}/sync`);
      return response.data;
    } catch (error) {
      console.error('Failed to sync order manually:', error);
      throw error;
    }
  },

  // Get order sync status
  getOrderSyncStatus: async (orderId) => {
    try {
      const response = await httpService.get(`/api/odoo-integration/orders/${orderId}/sync-status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get order sync status:', error);
      throw error;
    }
  },

  // Get Odoo sync configuration
  getOdooSyncConfig: async () => {
    try {
      const response = await httpService.get('/api/odoo-integration/odoo-sync/config');
      return response.data;
    } catch (error) {
      console.error('Failed to get Odoo sync config:', error);
      throw error;
    }
  },

  // Update Odoo sync configuration
  updateOdooSyncConfig: async (configData) => {
    try {
      const response = await httpService.put('/api/odoo-integration/odoo-sync/config', configData);
      return response.data;
    } catch (error) {
      console.error('Failed to update Odoo sync config:', error);
      throw error;
    }
  },

  // Test Odoo connection
  testConnection: async () => {
    try {
      const response = await httpService.get('/api/odoo-integration/test-connection');
      return response.data;
    } catch (error) {
      console.error('Failed to test Odoo connection:', error);
      throw error;
    }
  },

  // Get sync statistics
  getSyncStatistics: async () => {
    try {
      const response = await httpService.get('/api/odoo-integration/statistics');
      return response.data;
    } catch (error) {
      console.error('Failed to get sync statistics:', error);
      throw error;
    }
  },

  // Get pending orders
  getPendingOrders: async (params = {}) => {
    try {
      const response = await httpService.get('/api/odoo-integration/pending-orders', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get pending orders:', error);
      throw error;
    }
  },

  // Get failed orders
  getFailedOrders: async (params = {}) => {
    try {
      const response = await httpService.get('/api/odoo-integration/failed-orders', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get failed orders:', error);
      throw error;
    }
  },

  // Reset order sync status
  resetOrderSyncStatus: async (orderId) => {
    try {
      const response = await httpService.put(`/api/odoo-integration/reset-order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to reset order sync status:', error);
      throw error;
    }
  },

  // Process orders for date
  processOrdersForDate: async (data) => {
    try {
      const response = await httpService.post('/api/odoo-integration/process-orders', data);
      return response.data;
    } catch (error) {
      console.error('Failed to process orders for date:', error);
      throw error;
    }
  },

  // Retry failed orders
  retryFailedOrdersBatch: async (data) => {
    try {
      const response = await httpService.post('/api/odoo-integration/retry-failed-orders', data);
      return response.data;
    } catch (error) {
      console.error('Failed to retry failed orders:', error);
      throw error;
    }
  }
};

export default OrderPushService;

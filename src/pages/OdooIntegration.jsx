import React, { useState, useEffect } from "react";
import { 
  FiRefreshCw, 
  FiCloud, 
  FiDownload, 
  FiUpload, 
  FiArrowUpCircle, 
  FiList, 
  FiCheckSquare, 
  FiX,
  FiCalendar,
  FiClock,
  FiUsers,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiBarChart3,
  FiSettings,
  FiEye,
  FiFileText
} from "react-icons/fi";
import Cookies from "js-cookie";

// internal imports
import PageTitle from "@/components/Typography/PageTitle";
import Loading from "@/components/preloader/Loading";
import { notifySuccess, notifyError } from "@/utils/toast";

const OdooIntegration = () => {
  // UI states
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [failedOrders, setFailedOrders] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);
  
  // Process order states
  const [targetDate, setTargetDate] = useState('');
  const [adminId, setAdminId] = useState('');
  const [processingSession, setProcessingSession] = useState(null);
  const [processProgress, setProcessProgress] = useState(null);
  
  // Loading states
  const [statsLoading, setStatsLoading] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // API Base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'https://your-cloud-server.com/api';
  const token = Cookies.get('token');

  // Helper function to make API calls
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      handleConnectionTest(),
      loadStatistics(),
      loadSessions(),
      loadPendingOrders(),
      loadFailedOrders()
    ]);
  };

  // Connection Test
  const handleConnectionTest = async () => {
    try {
      setConnectionLoading(true);
      const res = await apiCall('/odoo-integration/test-connection');
      setConnectionStatus(res);
      if (res.success) {
        notifySuccess("Odoo connection successful");
      } else {
        notifyError("Odoo connection failed");
      }
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Odoo connection failed");
      setConnectionStatus({ success: false, error: err.message });
    } finally {
      setConnectionLoading(false);
    }
  };

  // Load Statistics
  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      const res = await apiCall('/odoo-integration/statistics');
      setStatistics(res.statistics);
    } catch (err) {
      console.error("Failed to load statistics", err);
      notifyError("Failed to load statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  // Load Sessions
  const loadSessions = async () => {
    try {
      setSessionsLoading(true);
      const res = await apiCall(`/odoo-integration/sessions?page=${currentPage}&limit=${pageSize}`);
      setSessions(res.sessions || []);
      setTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      console.error("Failed to load sessions", err);
      notifyError("Failed to load sessions");
    } finally {
      setSessionsLoading(false);
    }
  };

  // Load Pending Orders
  const loadPendingOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await apiCall('/odoo-integration/pending-orders?limit=5');
      setPendingOrders(res.orders || []);
    } catch (err) {
      console.error("Failed to load pending orders", err);
      notifyError("Failed to load pending orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load Failed Orders
  const loadFailedOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await apiCall('/odoo-integration/failed-orders?limit=5');
      setFailedOrders(res.orders || []);
    } catch (err) {
      console.error("Failed to load failed orders", err);
      notifyError("Failed to load failed orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Process Orders for Date
  const handleProcessOrders = async () => {
    if (!targetDate || !adminId) {
      notifyError("Please select a date and enter admin ID");
      return;
    }

    try {
      setProcessLoading(true);
      setProcessProgress({ status: 'starting', message: 'Initializing batch processing...' });
      
      const res = await apiCall('/odoo-integration/process-orders', {
        method: 'POST',
        body: JSON.stringify({
          targetDate: targetDate,
          adminId: adminId
        })
      });

      if (res.success) {
        setProcessingSession(res.sessionId);
        notifySuccess(`Batch processing started: ${res.results.successful}/${res.results.processed} orders synced`);
        setShowProcessModal(false);
        setTargetDate('');
        setAdminId('');
        
        // Reload data
        setTimeout(() => {
          loadSessions();
          loadStatistics();
          loadPendingOrders();
          loadFailedOrders();
        }, 2000);
      } else {
        notifyError(res.error || "Failed to process orders");
      }
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Failed to process orders");
    } finally {
      setProcessLoading(false);
      setProcessProgress(null);
    }
  };

  // Retry Failed Orders
  const handleRetryFailedOrders = async (sessionId) => {
    try {
      setRetryLoading(true);
      const res = await apiCall('/odoo-integration/retry-failed-orders', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: sessionId,
          maxRetries: 3
        })
      });

      if (res.success) {
        notifySuccess(`Retry completed: ${res.results.successful}/${res.results.retried} successful`);
        loadSessions();
        loadStatistics();
        loadFailedOrders();
      } else {
        notifyError(res.error || "Failed to retry orders");
      }
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Failed to retry orders");
    } finally {
      setRetryLoading(false);
    }
  };

  // View Session Details
  const handleViewSession = async (sessionId) => {
    try {
      const res = await apiCall(`/odoo-integration/session/${sessionId}`);
      setSelectedSession(res.session);
      setShowSessionModal(true);
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Failed to load session details");
    }
  };

  // Reset Order Sync Status
  const handleResetOrder = async (orderId) => {
    try {
      const res = await apiCall(`/odoo-integration/reset-order/${orderId}`, {
        method: 'PUT'
      });

      if (res.success) {
        notifySuccess("Order sync status reset successfully");
        loadPendingOrders();
        loadFailedOrders();
      } else {
        notifyError(res.error || "Failed to reset order");
      }
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Failed to reset order");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <>
      <PageTitle>Odoo Integration Dashboard</PageTitle>

      {/* Connection Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${connectionStatus?.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <FiCloud className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Connection Status</p>
              <p className={`text-lg font-semibold ${connectionStatus?.success ? 'text-green-600' : 'text-red-600'}`}>
                {connectionStatus?.success ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <button
            onClick={handleConnectionTest}
            disabled={connectionLoading}
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {connectionLoading ? <Loading /> : 'Test Connection'}
          </button>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiPackage className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-lg font-semibold text-gray-900">{statistics.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FiClock className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Sync</p>
                  <p className="text-lg font-semibold text-gray-900">{statistics.pendingOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FiCheckSquare className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{statistics.successRate?.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowProcessModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center"
          >
            <FiPlay className="w-4 h-4 mr-2" />
            Process Orders
          </button>
          
          <button
            onClick={loadInitialData}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          
          <button
            onClick={() => loadSessions()}
            disabled={sessionsLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
          >
            <FiList className="w-4 h-4 mr-2" />
            View Sessions
          </button>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
        {sessionsLoading ? (
          <Loading />
        ) : sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.sessionId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {session.sessionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(session.sessionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        session.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {session.summary?.successRate?.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewSession(session.sessionId)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      {session.summary?.totalOrdersFailed > 0 && (
                        <button
                          onClick={() => handleRetryFailedOrders(session.sessionId)}
                          disabled={retryLoading}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiRotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No sessions found</p>
        )}
      </div>

      {/* Pending Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Orders</h3>
          {ordersLoading ? (
            <Loading />
          ) : pendingOrders.length > 0 ? (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div key={order._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">#{order.invoice}</p>
                      <p className="text-sm text-gray-600">{order.user_info?.name}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(order.total)}</p>
                    </div>
                    <button
                      onClick={() => handleResetOrder(order._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiRotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No pending orders</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Failed Orders</h3>
          {ordersLoading ? (
            <Loading />
          ) : failedOrders.length > 0 ? (
            <div className="space-y-3">
              {failedOrders.map((order) => (
                <div key={order._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">#{order.invoice}</p>
                      <p className="text-sm text-gray-600">{order.user_info?.name}</p>
                      <p className="text-sm text-red-600">{order.odooSync?.errorMessage}</p>
                    </div>
                    <button
                      onClick={() => handleResetOrder(order._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiRotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No failed orders</p>
          )}
        </div>
      </div>

      {/* Process Orders Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Process Orders for Date</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin ID</label>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter admin ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessOrders}
                  disabled={processLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {processLoading ? <Loading /> : 'Process Orders'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Details Modal */}
      {showSessionModal && selectedSession && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Session Details</h3>
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Session ID</p>
                  <p className="text-sm text-gray-900">{selectedSession.sessionId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-sm text-gray-900">{selectedSession.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Started At</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedSession.startedAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Completed At</p>
                  <p className="text-sm text-gray-900">{selectedSession.completedAt ? formatDate(selectedSession.completedAt) : 'N/A'}</p>
                </div>
              </div>
              
              {selectedSession.summary && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Summary</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedSession.summary.totalOrdersSuccess}</p>
                      <p className="text-sm text-gray-600">Successful</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{selectedSession.summary.totalOrdersFailed}</p>
                      <p className="text-sm text-gray-600">Failed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedSession.summary.successRate?.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedSession.orderResults && selectedSession.orderResults.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Order Results</h4>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Odoo ID</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedSession.orderResults.map((result, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">#{result.invoiceNumber}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{result.customerInfo?.name}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                result.syncStatus === 'synced' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {result.syncStatus}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{result.odooOrderId || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OdooIntegration;

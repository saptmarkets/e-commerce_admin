import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiRotateCw,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiSettings,
  FiCalendar
} from 'react-icons/fi';
import PageTitle from '@/components/Typography/PageTitle';
import { Card, CardBody } from '@windmill/react-ui';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const StockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    movementType: '',
    syncStatus: ''
  });

  // Helper function to safely get product information
  const getProductInfo = (movement) => {
    try {
      if (!movement || !movement.product) {
        return { title: 'Unknown Product', image: null, id: 'Unknown' };
      }
      
      // If product is an ObjectId (string)
      if (typeof movement.product === 'string') {
        return { title: `Product ID: ${movement.product}`, image: null, id: movement.product };
      }
      
      // If product is an object (populated)
      if (typeof movement.product === 'object' && movement.product !== null) {
        return {
          title: movement.product.title || movement.product.name || `Product ID: ${movement.product._id || 'Unknown'}`,
          image: movement.product.image || movement.product.images?.[0] || null,
          id: movement.product._id || 'Unknown'
        };
      }
      
      return { title: 'Unknown Product', image: null, id: 'Unknown' };
    } catch (error) {
      console.error('Error in getProductInfo:', error);
      return { title: 'Unknown Product', image: null, id: 'Unknown' };
    }
  };

  // Load movements
  const loadMovements = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-movements?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Stock movements API response:', data); // Debug log
      if (data.success) {
        // Handle the case where data.data is an array directly
        const movements = Array.isArray(data.data) ? data.data : (data.data?.movements || []);
        const total = data.data?.total || data.pagination?.total || movements.length;
        
        setMovements(movements);
        setTotalItems(total);
        setTotalPages(Math.ceil(total / itemsPerPage));
      } else {
        toast.error(data.message || 'Failed to load stock movements');
      }
    } catch (error) {
      console.error('Error loading movements:', error);
      toast.error('Failed to load stock movements');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-movements/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Handle statistics if needed
        }
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      movementType: '',
      syncStatus: ''
    });
  };

  // Handle view details
  const handleViewDetails = (movement) => {
    setSelectedMovement(movement);
    setShowDetailModal(true);
  };

  // Get sync status display
  const getSyncStatusDisplay = (status) => {
    try {
      switch (status) {
        case 'synced':
          return { text: 'Synced', color: 'text-green-600', bgColor: 'bg-green-100' };
        case 'pending':
          return { text: 'Pending Sync', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
        case 'failed':
          return { text: 'Failed', color: 'text-red-600', bgColor: 'bg-red-100' };
        default:
          return { text: 'Unknown', color: 'text-gray-600', bgColor: 'bg-gray-100' };
      }
    } catch (error) {
      console.error('Error in getSyncStatusDisplay:', error);
      return { text: 'Unknown', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  // Get movement type color
  const getMovementTypeColor = (type) => {
    try {
      switch (type) {
        case 'sale':
          return 'text-red-600 bg-red-100';
        case 'purchase':
          return 'text-green-600 bg-green-100';
        case 'adjustment':
          return 'text-blue-600 bg-blue-100';
        case 'return':
          return 'text-purple-600 bg-purple-100';
        default:
          return 'text-gray-600 bg-gray-100';
      }
    } catch (error) {
      console.error('Error in getMovementTypeColor:', error);
      return 'text-gray-600 bg-gray-100';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadMovements();
    loadStatistics();
  }, [currentPage, itemsPerPage, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <PageTitle>Stock Movement History</PageTitle>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search movements..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filters.movementType}
                onChange={(e) => handleFilterChange('movementType', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="sale">Sale</option>
                <option value="purchase">Purchase</option>
                <option value="adjustment">Adjustment</option>
                <option value="return">Return</option>
              </select>

              <select
                value={filters.syncStatus}
                onChange={(e) => handleFilterChange('syncStatus', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="synced">Synced</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Movements Table */}
        <Card>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date/Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Before
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      After
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sync Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {movements && movements.length > 0 ? movements.map((movement) => {
                    try {
                      const productInfo = getProductInfo(movement);
                      const syncStatus = getSyncStatusDisplay(movement?.odoo_sync_status || 'unknown');
                      
                      return (
                        <tr key={movement._id || movement.movement_id || Math.random()} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(movement?.movement_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {productInfo.image && (
                                <img
                                  src={productInfo.image}
                                  alt={productInfo.title}
                                  className="w-8 h-8 rounded-full mr-3 object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {productInfo.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {movement?.movement_id || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement?.movement_type || 'unknown')}`}>
                              {movement?.movement_type || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {movement?.quantity_before || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {movement?.quantity_after || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {movement?.invoice_number || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${syncStatus.bgColor} ${syncStatus.color}`}>
                              {syncStatus.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewDetails(movement)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    } catch (error) {
                      console.error('Error rendering movement row:', error);
                      return (
                        <tr key={`error-${Math.random()}`} className="hover:bg-gray-50">
                          <td colSpan="8" className="px-6 py-4 text-sm text-red-500">
                            Error rendering movement data
                          </td>
                        </tr>
                      );
                    }
                  }) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        No movements found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedMovement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Movement Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Movement ID:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.movement_id}</p>
                </div>
                <div>
                  <span className="font-semibold">Product:</span>
                  <p className="text-sm text-gray-600">{getProductInfo(selectedMovement).title}</p>
                </div>
                <div>
                  <span className="font-semibold">Type:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.movement_type}</p>
                </div>
                <div>
                  <span className="font-semibold">Quantity Before:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.quantity_before}</p>
                </div>
                <div>
                  <span className="font-semibold">Quantity After:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.quantity_after}</p>
                </div>
                <div>
                  <span className="font-semibold">Quantity Changed:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.quantity_changed}</p>
                </div>
                <div>
                  <span className="font-semibold">Invoice Number:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.invoice_number || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-semibold">Reference Document:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.reference_document || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-semibold">Sync Status:</span>
                  <p className="text-sm text-gray-600">{getSyncStatusDisplay(selectedMovement.odoo_sync_status).text}</p>
                </div>
                <div>
                  <span className="font-semibold">Date:</span>
                  <p className="text-sm text-gray-600">{formatDate(selectedMovement.movement_date)}</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StockMovements; 
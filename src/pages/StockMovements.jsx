// Stock Movements Component v1.0.1 - Clean Build
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
// Stock Movements Component - Build Fix
import PageTitle from '@/components/Typography/PageTitle';
import { Card, CardBody } from '@windmill/react-ui';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

// @version 1.0.2
const StockMovements = () => {
  const { t: rawT } = useTranslation();
  const t = React.useCallback((key, options) => {
    const res = rawT(key, options);
    // If i18next returns the full language object (e.g. { ar, en }),
    // fall back to the key itself to avoid rendering an object.
    if (typeof res === 'object' && res !== null) {
      console.warn(`Translation for "${key}" returned an object. Falling back to key.`);
      return key;
    }
    return res;
  }, [rawT]);

  // Remove previous safeT usage for PageTitle and headers by redefining safeT to use the new t
  const safeT = (key, defaultValue = key) => t(key) || defaultValue;
  
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({});
  const [selectedMovements, setSelectedMovements] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  
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
    syncStatus: '',
    productId: '',
    userId: '',
    invoiceNumber: ''
  });

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
      if (data.success) {
        setMovements(data.data);
        setTotalPages(data.pagination.pages);
        setTotalItems(data.pagination.total);
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
      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-movements/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  useEffect(() => {
    loadMovements();
    loadStatistics();
  }, [currentPage, itemsPerPage, filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      movementType: '',
      syncStatus: '',
      productId: '',
      userId: '',
      invoiceNumber: ''
    });
    setCurrentPage(1);
  };

  // Handle movement selection
  const handleSelectMovement = (movementId) => {
    setSelectedMovements(prev => 
      prev.includes(movementId) 
        ? prev.filter(id => id !== movementId)
        : [...prev, movementId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedMovements.length === movements.length) {
      setSelectedMovements([]);
    } else {
      setSelectedMovements(movements.map(m => m._id));
    }
  };

  // Handle sync movement
  const handleSyncMovement = async (movementId) => {
    try {
      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-movements/sync/${movementId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Movement synced successfully');
        loadMovements(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to sync movement');
      }
    } catch (error) {
      console.error('Error syncing movement:', error);
      toast.error('Failed to sync movement');
    }
  };

  // Handle bulk sync
  const handleBulkSync = async () => {
    if (selectedMovements.length === 0) {
      toast.warning('Please select movements to sync');
      return;
    }

    try {
      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-movements/bulk-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movementIds: selectedMovements
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success(`Successfully synced ${data.syncedCount} movements`);
        setSelectedMovements([]); // Clear selection
        loadMovements(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to sync movements');
      }
    } catch (error) {
      console.error('Error bulk syncing movements:', error);
      toast.error('Failed to sync movements');
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-movements/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          filters,
          selectedIds: selectedMovements.length > 0 ? selectedMovements : null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stock-movements-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Error exporting movements:', error);
      toast.error('Failed to export movements');
    }
  };

  // View movement details
  const handleViewDetails = (movement) => {
    setSelectedMovement(movement);
    setShowDetailModal(true);
  };

  // Get sync status icon and color
  const getSyncStatusDisplay = (status) => {
    const statusConfig = {
      'pending': { icon: FiClock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Pending' },
      'syncing': { icon: FiRefreshCw, color: 'text-blue-600', bg: 'bg-blue-100', text: 'Syncing' },
      'success': { icon: FiCheck, color: 'text-green-600', bg: 'bg-green-100', text: 'Synced' },
      'failed': { icon: FiX, color: 'text-red-600', bg: 'bg-red-100', text: 'Failed' },
      'retry': { icon: FiAlertCircle, color: 'text-orange-600', bg: 'bg-orange-100', text: 'Retry' },
      'not_required': { icon: FiCheck, color: 'text-gray-600', bg: 'bg-gray-100', text: 'N/A' }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // Get movement type color
  const getMovementTypeColor = (type) => {
    const colors = {
      'sale': 'text-red-600 bg-red-100',
      'purchase': 'text-green-600 bg-green-100',
      'transfer': 'text-blue-600 bg-blue-100',
      'return': 'text-yellow-600 bg-yellow-100',
      'adjustment': 'text-purple-600 bg-purple-100',
      'sync': 'text-gray-600 bg-gray-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  return (
    <>
      <PageTitle>{safeT("Stock Movement History", "Stock Movement History")}</PageTitle>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.overview?.todayMovements || 0}</div>
            <div className="text-sm text-gray-600">{safeT("Today", "Today")}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.overview?.weekMovements || 0}</div>
            <div className="text-sm text-gray-600">{safeT("This Week", "This Week")}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statistics.overview?.pendingSync || 0}</div>
            <div className="text-sm text-gray-600">{safeT("Pending Sync", "Pending Sync")}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.overview?.successfulSync || 0}</div>
            <div className="text-sm text-gray-600">{safeT("Synced", "Synced")}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-red-600">{statistics.overview?.failedSync || 0}</div>
            <div className="text-sm text-gray-600">{safeT("Failed", "Failed")}</div>
          </CardBody>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={safeT("Search products, invoices, users...", "Search products, invoices, users...")}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FiFilter className="mr-2" />
                {safeT("Filters", "Filters")}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiDownload className="mr-2" />
                {safeT("Export", "Export")}
              </button>
              <button
                onClick={loadMovements}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiRefreshCw className="mr-2" />
                {safeT("Refresh", "Refresh")}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{safeT("Start Date", "Start Date")}</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{safeT("End Date", "End Date")}</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{safeT("Movement Type", "Movement Type")}</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={filters.movementType}
                  onChange={(e) => handleFilterChange('movementType', e.target.value)}
                >
                  <option value="">{safeT("All Types", "All Types")}</option>
                  <option value="sale">{safeT("Sale", "Sale")}</option>
                  <option value="purchase">{safeT("Purchase", "Purchase")}</option>
                  <option value="transfer">{safeT("Transfer", "Transfer")}</option>
                  <option value="return">{safeT("Return", "Return")}</option>
                  <option value="adjustment">{safeT("Adjustment", "Adjustment")}</option>
                  <option value="sync">{safeT("Sync", "Sync")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{safeT("Sync Status", "Sync Status")}</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={filters.syncStatus}
                  onChange={(e) => handleFilterChange('syncStatus', e.target.value)}
                >
                  <option value="">{safeT("All Status", "All Status")}</option>
                  <option value="pending">{safeT("Pending", "Pending")}</option>
                  <option value="syncing">{safeT("Syncing", "Syncing")}</option>
                  <option value="success">{safeT("Success", "Success")}</option>
                  <option value="failed">{safeT("Failed", "Failed")}</option>
                  <option value="retry">{safeT("Retry", "Retry")}</option>
                </select>
              </div>
              <div className="md:col-span-3 lg:col-span-4 flex gap-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {safeT("Clear Filters", "Clear Filters")}
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Bulk Actions */}
      {selectedMovements.length > 0 && (
        <Card className="mb-4">
          <CardBody>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedMovements.length} movement(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkSync}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                                      <FiRotateCw className="mr-2" />
                  Sync Selected
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FiDownload className="mr-2" />
                  Export Selected
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Movements Table */}
      <Card>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FiRefreshCw className="animate-spin text-2xl text-blue-600" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedMovements.length === movements.length && movements.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {safeT("Date/Time", "Date/Time")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {safeT("Product", "Product")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {safeT("Type", "Type")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {safeT("Qty", "Qty")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {safeT("Before", "Before")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {safeT("After", "After")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {safeT("Invoice", "Invoice")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {safeT("Sync Status", "Sync Status")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {safeT("Actions", "Actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movements.map((movement) => (
                      <tr key={movement._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedMovements.includes(movement._id)}
                            onChange={() => handleSelectMovement(movement._id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            {new Date(movement.movement_date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(movement.movement_date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {movement.product?.image && (
                              <img
                                src={movement.product.image}
                                alt={movement.product?.title}
                                className="w-8 h-8 rounded-full mr-3 object-cover"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {movement.product?.title || 'Unknown Product'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {movement.movement_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement.movement_type)}`}>
                            {movement.movement_type}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={movement.quantity_changed > 0 ? 'text-green-600' : 'text-red-600'}>
                            {movement.quantity_changed > 0 ? '+' : ''}{movement.quantity_changed}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.quantity_before}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.quantity_after}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.invoice_number || '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getSyncStatusDisplay(movement.odoo_sync_status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(movement)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <FiEye />
                            </button>
                            {(movement.odoo_sync_status === 'pending' || movement.odoo_sync_status === 'failed') && (
                              <button
                                onClick={() => handleSyncMovement(movement._id)}
                                className="text-green-600 hover:text-green-900"
                                title="Sync to Odoo"
                              >
                                <FiRotateCw />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Movement Detail Modal */}
      {showDetailModal && selectedMovement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Movement Details - {selectedMovement.movement_id}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMovement.product?.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Movement Type</label>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(selectedMovement.movement_type)}`}>
                        {selectedMovement.movement_type}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date/Time</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedMovement.movement_date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity Changed</label>
                    <p className={`mt-1 text-sm font-medium ${selectedMovement.quantity_changed > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedMovement.quantity_changed > 0 ? '+' : ''}{selectedMovement.quantity_changed} units
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Before → After</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedMovement.quantity_before} → {selectedMovement.quantity_after}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMovement.user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invoice/Reference</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMovement.invoice_number || selectedMovement.reference_document || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Value</label>
                    <p className="mt-1 text-sm text-gray-900">${selectedMovement.total_value?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </div>

              {/* Odoo Sync Status */}
              <div>
                <h3 className="text-lg font-medium mb-3">Odoo Sync Status</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1">{getSyncStatusDisplay(selectedMovement.odoo_sync_status)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Attempts</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMovement.sync_attempt_count || 0}</p>
                    </div>
                    {selectedMovement.sync_success_date && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sync Date</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedMovement.sync_success_date).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedMovement.odoo_record_id && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Odoo Record ID</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedMovement.odoo_record_id}</p>
                      </div>
                    )}
                    {selectedMovement.error_message && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Error Message</label>
                        <p className="mt-1 text-sm text-red-600">{selectedMovement.error_message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                {(selectedMovement.odoo_sync_status === 'pending' || selectedMovement.odoo_sync_status === 'failed') && (
                  <button
                    onClick={() => {
                      handleSyncMovement(selectedMovement._id);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sync to Odoo
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
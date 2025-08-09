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
import { useTranslation } from 'react-i18next';

const StockMovements = () => {
  const { t } = useTranslation();
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
      console.log('Movement data:', movement); // Debug log
      console.log('Product data:', movement?.product); // Debug log

      if (!movement || !movement.product) {
        return { title: String(t('UnknownProduct')), image: null, id: 'Unknown' };
      }

      // If product is a string (ObjectId)
      if (typeof movement.product === 'string') {
        return { 
          title: String(movement.reference_document || movement.movement_id || t('UnknownProduct')), 
          image: null, 
          id: movement.product 
        };
      }

      // If product is an object
      if (typeof movement.product === 'object' && movement.product !== null) {
        // Extract product name from reference document if available
        let productName = '';
        if (movement.reference_document && movement.reference_document.startsWith('Order:')) {
          productName = movement.reference_document.split('Order:')[1].trim();
        }

        // Handle product title - it might be an object with language keys
        let productTitle = '';
        if (movement.product.title) {
          if (typeof movement.product.title === 'object') {
            // If title is an object with language keys, get the current language or fallback to 'en'
            const currentLang = localStorage.getItem('i18nextLng') || 'en';
            productTitle = movement.product.title[currentLang] || movement.product.title.en || movement.product.title.ar || Object.values(movement.product.title)[0] || '';
          } else {
            productTitle = String(movement.product.title);
          }
        }

        // Handle product name - it might also be an object with language keys
        let productNameFromProduct = '';
        if (movement.product.name) {
          if (typeof movement.product.name === 'object') {
            // If name is an object with language keys, get the current language or fallback to 'en'
            const currentLang = localStorage.getItem('i18nextLng') || 'en';
            productNameFromProduct = movement.product.name[currentLang] || movement.product.name.en || movement.product.name.ar || Object.values(movement.product.name)[0] || '';
          } else {
            productNameFromProduct = String(movement.product.name);
          }
        }

        // Get product title
        const title = String(
          productTitle || 
          productNameFromProduct || 
          productName ||
          movement.movement_id ||
          `${t('Product')} ID: ${movement.product._id || t('Unknown')}`
        );

        // Get product image
        const image = movement.product.image || 
                     (movement.product.images && movement.product.images.length > 0 ? movement.product.images[0] : null);

        // Get product ID
        const id = String(movement.product._id || movement.product || t('Unknown'));

        console.log('Product info:', { title, image, id }); // Debug log

        return { title, image, id };
      }

      // Fallback to movement ID or reference document
      return { 
        title: String(movement.reference_document || movement.movement_id || t('UnknownProduct')), 
        image: null, 
        id: String(movement._id || 'Unknown') 
      };
    } catch (error) {
      console.error('Error in getProductInfo:', error, movement);
      return { 
        title: String(movement?.reference_document || movement?.movement_id || t('UnknownProduct')), 
        image: null, 
        id: String(movement?._id || 'Unknown') 
      };
    }
  };

  // Load movements with aggregation support
  const loadMovements = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        groupBy: 'day', // Can be 'day', 'week', 'month', 'product'
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      // Use aggregated endpoint for better performance
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-movements/aggregated?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Aggregated stock movements API response:', data);

      if (data.success) {
        // Transform aggregated data to match existing structure
        const transformedMovements = data.data.map(group => {
          // Use the first movement as the representative for the group
          const representativeMovement = group.movements[0];
          return {
            ...representativeMovement,
            _id: group._id,
            totalQuantity: group.totalQuantity,
            totalValue: group.totalValue,
            movementCount: group.movementCount,
            product: group.productInfo || representativeMovement.product
          };
        });

        setMovements(transformedMovements || []);
        setTotalItems(data.pagination?.total || 0);
        setTotalPages(Math.ceil((data.pagination?.total || 0) / itemsPerPage));
      } else {
        toast.error(data.message || 'Failed to load stock movements');
      }
    } catch (error) {
      console.error('Error loading movements:', error);
      // Fallback to regular endpoint if aggregated fails
      await loadMovementsFallback();
    } finally {
      setLoading(false);
    }
  };

  // Fallback to regular movements endpoint
  const loadMovementsFallback = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

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
      console.log('Fallback stock movements API response:', data);

      if (data.success) {
        setMovements(data.data || []);
        setTotalItems(data.pagination?.total || 0);
        setTotalPages(Math.ceil((data.pagination?.total || 0) / itemsPerPage));
      } else {
        toast.error(data.message || 'Failed to load stock movements');
      }
    } catch (error) {
      console.error('Error in fallback loading:', error);
      toast.error('Failed to load stock movements');
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
      console.log('Sync status:', status); // Debug log
      const text = String(t(status === 'synced' ? 'Synced' : 
                         status === 'pending' ? 'PendingSync' : 
                         status === 'failed' ? 'Failed' : 'Unknown'));
      
      switch (status) {
        case 'synced':
          return { text, color: 'text-green-600', bgColor: 'bg-green-100' };
        case 'pending':
          return { text, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
        case 'failed':
          return { text, color: 'text-red-600', bgColor: 'bg-red-100' };
        default:
          return { text, color: 'text-gray-600', bgColor: 'bg-gray-100' };
      }
    } catch (error) {
      console.error('Error in getSyncStatusDisplay:', error);
      return { text: String(t('Unknown')), color: 'text-gray-600', bgColor: 'bg-gray-100' };
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
        <PageTitle>{t('Stock Movement History')}</PageTitle>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder={t('SearchMovements')}
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
                <option value="">{t('AllTypes')}</option>
                <option value="sale">{t('Sale')}</option>
                <option value="purchase">{t('Purchase')}</option>
                <option value="adjustment">{t('Adjustment')}</option>
                <option value="return">{t('Return')}</option>
              </select>

              <select
                value={filters.syncStatus}
                onChange={(e) => handleFilterChange('syncStatus', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('AllStatus')}</option>
                <option value="synced">{t('Synced')}</option>
                <option value="pending">{t('PendingSync')}</option>
                <option value="failed">{t('Failed')}</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t('Clear')}
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
                      {t('DateTime')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Product')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Type')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Before')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('After')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Invoice')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('SyncStatus')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {movements && movements.length > 0 ? movements.map((movement) => {
                    try {
                      const productInfo = getProductInfo(movement);
                      
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
                                  {movement?.reference_document || movement?.movement_id || 'N/A'}
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
                            {(() => {
                              const status = getSyncStatusDisplay(movement?.odoo_sync_status || 'unknown');
                              return (
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.bgColor} ${status.color}`}>
                                  {String(status.text)}
                                </span>
                              );
                            })()}
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
                            {t('ErrorRenderingMovementData')}
                          </td>
                        </tr>
                      );
                    }
                  }) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        {t('NoMovementsFound')}
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
                  {t('Showing')} {((currentPage - 1) * itemsPerPage) + 1} {t('to')} {Math.min(currentPage * itemsPerPage, totalItems)} {t('of')} {totalItems} {t('results')}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('Previous')}
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('Next')}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('MovementDetails')}</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">{t('MovementID')}:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.movement_id}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('Product')}:</span>
                  <p className="text-sm text-gray-600">{getProductInfo(selectedMovement).title}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('Type')}:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.movement_type}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('QuantityBefore')}:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.quantity_before}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('QuantityAfter')}:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.quantity_after}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('QuantityChanged')}:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.quantity_changed}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('InvoiceNumber')}:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.invoice_number || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('ReferenceDocument')}:</span>
                  <p className="text-sm text-gray-600">{selectedMovement.reference_document || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('SyncStatus')}:</span>
                  <p className="text-sm text-gray-600">{getSyncStatusDisplay(selectedMovement.odoo_sync_status).text}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('Date')}:</span>
                  <p className="text-sm text-gray-600">{formatDate(selectedMovement.movement_date)}</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {t('Close')}
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
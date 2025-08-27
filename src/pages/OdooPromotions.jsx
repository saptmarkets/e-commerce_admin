import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/Typography/PageTitle';
import Loading from '@/components/preloader/Loading';
import { 
  FiDownload, 
  FiRefreshCw, 
  FiChevronLeft, 
  FiChevronRight, 
  FiChevronsLeft, 
  FiChevronsRight,
  FiFilter,
  FiSearch,
  FiCheck,
  FiX,
  FiPackage,
  FiDatabase
} from 'react-icons/fi';
import OdooPricelistServices from '@/services/OdooPricelistServices';
import OdooCatalogServices from '@/services/OdooCatalogServices';
import { notifySuccess, notifyError, notifyInfo } from '@/utils/toast';
import Select from 'react-select';

const OdooPromotions = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ 
    current_page: 1, 
    per_page: 20, 
    total: 0, 
    total_pages: 0 
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [importing, setImporting] = useState(false);
  const [showExpired, setShowExpired] = useState(false);

  // New states for enhanced functionality
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [importStatusFilter, setImportStatusFilter] = useState(null); // 🔥 NEW: Import status filter
  const [showAllPages, setShowAllPages] = useState(false);
  const [customPageSize, setCustomPageSize] = useState(20);
  const [allSelectedIds, setAllSelectedIds] = useState(new Set()); // Track all selected across pages

  // New states for product import functionality
  const [importingProducts, setImportingProducts] = useState(false);
  const [productImportProgress, setProductImportProgress] = useState(0);
  const [importedProducts, setImportedProducts] = useState([]);
  const [failedImports, setFailedImports] = useState([]);

  // 🔥 NEW: Auto-sync states for promotions
  const [autoSyncLoading, setAutoSyncLoading] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [showImportStatus, setShowImportStatus] = useState(false);

  // Filter options
  const statusOptions = [
    { value: null, label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'future', label: 'Future' },
  ];

  // 🔥 ENHANCED: Import status filter options
  const importStatusOptions = [
    { value: null, label: 'All Import Status' },
    { value: 'imported', label: '✅ Imported' },
    { value: 'pending', label: '⏳ Pending Import' },
    { value: 'failed', label: '❌ Failed Import' },
    { value: 'updated', label: '🔄 Recently Updated' },
    { value: 'current', label: '✅ Current (No Updates)' },
  ];

  // Page size options
  const pageSizeOptions = [
    { value: 20, label: '20 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
    { value: 200, label: '200 per page' },
    { value: 500, label: '500 per page' },
  ];

  const fetchItems = async (page = 1, pageSize = null) => {
    try {
      setLoading(true);
      
      // Determine the actual page size to use
      const actualPageSize = showAllPages 
        ? Math.min(pagination.total || 1000, 1000) // Cap at 1000 for performance
        : (pageSize || pagination.per_page);
      
      // 🔥 FIXED: Build proper search parameters
      const searchParams = {
        page: showAllPages ? 1 : page, // Always fetch page 1 when showing all
        limit: actualPageSize,
        active_only: showExpired ? 'false' : 'true',
      };
      
      // Add search parameter if provided
      if (search && search.trim()) {
        searchParams.search = search.trim();
      }
      
      // Add status filter if selected
      if (statusFilter?.value) {
        searchParams.status = statusFilter.value;
      }

      // 🔥 NEW: Add import status filter if selected
      if (importStatusFilter?.value) {
        searchParams.import_status = importStatusFilter.value;
      }
      
      console.log('🔍 Fetching with params:', searchParams);
      
      const res = await OdooPricelistServices.listItems(searchParams);
      
      const data = res.data?.data || res.data;
      const newItems = data?.items || [];
      setItems(newItems);
      
      if (!showAllPages) {
      setPagination(data?.pagination || pagination);
      } else {
        // When showing all pages, update pagination to reflect total
        setPagination(prev => ({
          ...prev,
          current_page: 1,
          total: newItems.length,
          total_pages: 1,
          per_page: newItems.length
        }));
      }
    } catch (err) {
      console.error(err);
      notifyError(err.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  // New function to extract unique product IDs from promotions
  const extractProductIdsFromPromotions = () => {
    const productIds = new Set();
    items.forEach(item => {
      if (item.product_id) {
        productIds.add(item.product_id);
      }
    });
    return Array.from(productIds);
  };

  // New function to import products from catalog to store
  const importProductsFromCatalog = async () => {
    try {
      setImportingProducts(true);
      setProductImportProgress(0);
      setImportedProducts([]);
      setFailedImports([]);

      // Get unique product IDs from promotions
      const productIds = extractProductIdsFromPromotions();
      
      if (productIds.length === 0) {
        notifyError('No products found in promotions to import');
        return;
      }

      notifyInfo(`Found ${productIds.length} unique products in promotions. Starting import...`);

      // Import products in batches
      const batchSize = 10;
      const totalBatches = Math.ceil(productIds.length / batchSize);
      
      for (let i = 0; i < totalBatches; i++) {
        const batch = productIds.slice(i * batchSize, (i + 1) * batchSize);
        
        try {
          // Import batch from catalog to store products
          const res = await OdooCatalogServices.runImport({
            productIds: batch,
            importType: 'products_only', // Only import products, not promotions
            targetTable: 'store_products'
          });

          const results = res.data?.data || res.data;
          
          if (results?.imported) {
            setImportedProducts(prev => [...prev, ...batch]);
            notifySuccess(`Imported batch ${i + 1}/${totalBatches}: ${batch.length} products`);
          }

          if (results?.failed && results.failed.length > 0) {
            setFailedImports(prev => [...prev, ...results.failed]);
            notifyError(`Failed to import ${results.failed.length} products in batch ${i + 1}`);
          }

        } catch (err) {
          console.error(`Batch ${i + 1} import failed:`, err);
          setFailedImports(prev => [...prev, ...batch]);
          notifyError(`Batch ${i + 1} import failed: ${err.message}`);
        }

        // Update progress
        setProductImportProgress(((i + 1) / totalBatches) * 100);
      }

      // Final summary
      const totalImported = importedProducts.length;
      const totalFailed = failedImports.length;
      
      if (totalImported > 0) {
        notifySuccess(`Successfully imported ${totalImported} products to store!`);
      }
      
      if (totalFailed > 0) {
        notifyError(`${totalFailed} products failed to import. Check logs for details.`);
      }

    } catch (err) {
      console.error('Product import failed:', err);
      notifyError(`Import failed: ${err.message}`);
    } finally {
      setImportingProducts(false);
      setProductImportProgress(0);
    }
  };

  // New function to check what products are available in promotions
  const checkPromotionsProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch all promotions to analyze products
      const res = await OdooPricelistServices.listItems({ 
        page: 1,
        limit: 10000, // Get all items
        active_only: 'true'
      });
      
      const data = res.data?.data || res.data;
      const allItems = data?.items || [];
      
      // Extract unique product information
      const uniqueProducts = new Map();
      
      allItems.forEach(item => {
        if (item.product_id && item.product_name) {
          uniqueProducts.set(item.product_id, {
            id: item.product_id,
            name: item.product_name,
            unit: item.barcode_unit_name || item.barcode_unit_id,
            price: item.fixed_price,
            count: (uniqueProducts.get(item.product_id)?.count || 0) + 1
          });
        }
      });

      const productsList = Array.from(uniqueProducts.values());
      
      notifySuccess(`Found ${productsList.length} unique products in promotions`);
      
      // Show summary
      console.log('Products in promotions:', productsList);
      
      return productsList;
      
    } catch (err) {
      console.error('Failed to check promotions products:', err);
      notifyError('Failed to analyze promotions products');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ENHANCED: Auto-sync promotions function with price updates
  const checkPromotionImportStatus = async () => {
    try {
      setAutoSyncLoading(true);
      setShowImportStatus(true);
      
      console.log('🔍 Checking promotion import status and updating prices...');
      const res = await OdooPricelistServices.checkImportStatus(true); // auto-update enabled
      
      const data = res.data?.data || res.data;
      setImportStatus(data);
      
      if (data) {
        const { total, imported, pending, failed } = data;
        notifySuccess(`Sync completed: ${imported} imported/updated, ${pending} pending, ${failed} failed`);
        
        // Refresh the list to show updated status and prices
        await fetchItems(pagination.current_page);
      }
      
    } catch (err) {
      console.error('❌ Failed to check promotion import status:', err);
      notifyError(err.response?.data?.message || 'Failed to check import status');
    } finally {
      setAutoSyncLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [showExpired, search, statusFilter, importStatusFilter]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const newSelected = prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id];
      
      // Update all selected tracking
      setAllSelectedIds(prev => {
        const newSet = new Set(prev);
        if (newSelected.includes(id)) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
      
      return newSelected;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
      setAllSelectedIds(new Set());
    } else {
      const newSelected = items.map(i => i.id);
      setSelectedIds(newSelected);
      setAllSelectedIds(new Set(newSelected));
    }
  };

  const selectAllAcrossPages = async () => {
    if (allSelectedIds.size === pagination.total) {
      // Deselect all
      setAllSelectedIds(new Set());
      setSelectedIds([]);
    } else {
      // Select all across all pages
      const allIds = new Set();
      // This would need to be implemented with a backend call to get all IDs
      // For now, we'll select all visible items
      const newSelected = items.map(i => i.id);
      setSelectedIds(newSelected);
      setAllSelectedIds(new Set(newSelected));
    }
  };

  const handlePageSizeChange = (selectedOption) => {
    setCustomPageSize(selectedOption.value);
    setPagination(prev => ({ ...prev, per_page: selectedOption.value }));
    fetchItems(1, selectedOption.value);
  };

  const toggleShowAllPages = () => {
    setShowAllPages(!showAllPages);
    setSelectedIds([]); // Clear current selection when switching modes
  };

  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    } else {
      // Smart pagination with ellipsis
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const runImport = async () => {
    if (selectedIds.length === 0) {
      notifyInfo('Please select at least one item');
      return;
    }
    try {
      setImporting(true);
      const res = await OdooPricelistServices.importPromotions(selectedIds);
      const result = res.data?.data || res.data;
      if (result.errors && result.errors.length) {
        notifyError(`Imported ${result.imported} with ${result.errors.length} errors`);
        console.error('Promotion import errors:', result.errors);
      } else {
        notifySuccess(`Imported ${result.imported || 0} promotions`);
      }
      setSelectedIds([]);
      setAllSelectedIds(new Set());
      fetchItems(pagination.current_page);
    } catch (err) {
      console.error(err);
      notifyError(err.response?.data?.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  if (loading && items.length === 0) return <Loading/>;

  return (
    <>
      <PageTitle>Odoo Promotions (Public Pricelist)</PageTitle>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-4">
          <button
            className={`px-4 py-2 text-white rounded flex items-center gap-2 ${selectedIds.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={selectedIds.length === 0 || importing}
            onClick={runImport}
          >
            {importing ? <FiRefreshCw className="animate-spin"/> : <FiDownload/>}
            Import Selected ({selectedIds.length})
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700"
            onClick={() => fetchItems(pagination.current_page)}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''}/>
            Refresh
          </button>

          {/* New: Check Promotions Products Button */}
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded flex items-center gap-2 hover:bg-purple-700"
            onClick={checkPromotionsProducts}
            disabled={loading}
          >
            <FiPackage className={loading ? 'animate-spin' : ''}/>
            Check Products
          </button>

          {/* New: Import Products from Catalog Button */}
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded flex items-center gap-2 hover:bg-orange-700"
            onClick={importProductsFromCatalog}
            disabled={importingProducts}
          >
            <FiDatabase className={importingProducts ? 'animate-spin' : ''}/>
            {importingProducts ? 'Importing Products...' : 'Import Products to Store'}
          </button>

          {/* 🔥 NEW: Auto-sync Promotions Button */}
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded flex items-center gap-2 hover:bg-indigo-700"
            onClick={checkPromotionImportStatus}
            disabled={autoSyncLoading}
          >
            <FiRefreshCw className={autoSyncLoading ? 'animate-spin' : ''}/>
            {autoSyncLoading ? 'Checking Status...' : 'Auto-Sync Promotions'}
          </button>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showExpired} onChange={e=>setShowExpired(e.target.checked)} />Show expired</label>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Showing {items.length} of {pagination.total} items (Page {pagination.current_page} of {pagination.total_pages})
        </div>
      </div>

      {/* Progress Bar for Product Import */}
      {importingProducts && (
        <div className="mb-4 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Importing Products to Store...</span>
            <span className="text-sm text-gray-500">{Math.round(productImportProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${productImportProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Imported: {importedProducts.length} | Failed: {failedImports.length}
          </div>
        </div>
      )}

      {/* 🔥 NEW: Promotion Import Status Display */}
      {showImportStatus && importStatus && (
        <div className="mb-4 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Promotion Import Status</h3>
            <button
              onClick={() => setShowImportStatus(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{importStatus.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{importStatus.imported}</div>
              <div className="text-sm text-gray-600">Imported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{importStatus.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{importStatus.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
          
          {importStatus.updateResult && (
            <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
              <strong>Auto-update result:</strong> {JSON.stringify(importStatus.updateResult)}
            </div>
          )}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Promotions
            </label>
            <input
              type="text"
              placeholder="Search by product name, unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiFilter className="inline mr-1" />
              Date Status
            </label>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Date Status"
              isClearable
              className="text-sm"
            />
          </div>

          {/* 🔥 NEW: Import Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiFilter className="inline mr-1" />
              Import Status
            </label>
            <Select
              options={importStatusOptions}
              value={importStatusFilter}
              onChange={setImportStatusFilter}
              placeholder="All Import Status"
              isClearable
              className="text-sm"
            />
          </div>

          {/* Expired Filter */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={showExpired} 
                onChange={e => setShowExpired(e.target.checked)} 
              />
              Show expired
            </label>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={() => fetchItems(1)}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Advanced Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {selectedIds.length > 0 ? (
                <span>
                  <span className="font-medium text-blue-600">{selectedIds.length}</span> promotion{selectedIds.length > 1 ? 's' : ''} selected
                  {items.length > 0 && (
                    <span className="text-gray-500 ml-1">
                      ({items.filter(p => selectedIds.includes(p.id)).length} on this page)
                    </span>
                  )}
                </span>
              ) : (
                `${pagination.total || 0} promotions found`
              )}
            </div>
            
            {/* Page Size Selector */}
            {!showAllPages && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <Select
                  options={pageSizeOptions}
                  value={pageSizeOptions.find(opt => opt.value === customPageSize)}
                  onChange={handlePageSizeChange}
                  className="text-sm min-w-[120px]"
                  isSearchable={false}
                />
              </div>
            )}

            {/* Show All Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleShowAllPages}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  showAllPages 
                    ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {showAllPages ? 'Show Paginated' : 'Show All Pages'}
              </button>
              {showAllPages && (
                <span className="text-xs text-orange-600 font-medium">
                  Showing all {items.length} promotions
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={() => {
                  setSelectedIds([]);
                  setAllSelectedIds(new Set());
                }}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear All
              </button>
            )}
            <button
              onClick={runImport}
              disabled={selectedIds.length === 0 || importing}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiDownload className={importing ? 'animate-spin' : ''} />
              {importing ? 'Importing...' : `Import Selected (${selectedIds.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-3 text-left">
                <input 
                  type="checkbox" 
                  checked={items.length > 0 && items.every(p => selectedIds.includes(p.id))}
                  onChange={toggleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="px-3 py-3 text-left">Product</th>
              <th className="px-3 py-3 text-left">Unit</th>
              <th className="px-3 py-3 text-left">Fixed Price</th>
              <th className="px-3 py-3 text-left">Min Qty</th>
              <th className="px-3 py-3 text-left">Max Qty</th>
              <th className="px-3 py-3 text-left">Start</th>
              <th className="px-3 py-3 text-left">End</th>
              <th className="px-3 py-3 text-left">Date Status</th>
              <th className="px-3 py-3 text-left">Import Status</th> {/* 🔥 NEW */}
            </tr>
          </thead>
          <tbody>
          {items.map(item => {
            const isExpired = item.date_end && new Date(item.date_end) < new Date();
            const isFuture = item.date_start && new Date(item.date_start) > new Date();
            
            return (
            <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(item.id)} 
                    onChange={() => toggleSelect(item.id)}
                    className="rounded"
                  />
                </td>
              <td className="px-3 py-2">{item.product_name || item.product_id}</td>
              <td className="px-3 py-2">{item.barcode_unit_name || item.barcode_unit_id || '-'}</td>
              <td className="px-3 py-2">{item.fixed_price?.toFixed(2)}</td>
              <td className="px-3 py-2">{item.min_quantity || 1}</td>
              <td className="px-3 py-2">{item.max_quantity || '-'}</td>
              <td className="px-3 py-2">{item.date_start ? new Date(item.date_start).toLocaleDateString() : '-'}</td>
              <td className="px-3 py-2">{item.date_end ? new Date(item.date_end).toLocaleDateString() : '-'}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isExpired 
                      ? 'bg-red-100 text-red-800' 
                      : isFuture 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {isExpired ? 'Expired' : isFuture ? 'Future' : 'Active'}
                  </span>
                </td>
                {/* 🔥 ENHANCED: Import Status Column */}
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item._sync_status === 'updated'
                      ? 'bg-blue-100 text-blue-800'
                      : item._sync_status === 'current'
                        ? 'bg-green-100 text-green-800'
                        : item.store_promotion_id 
                          ? 'bg-green-100 text-green-800' 
                          : item._sync_status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item._sync_status === 'updated'
                      ? '🔄 Updated' 
                      : item._sync_status === 'current'
                        ? '✅ Current'
                        : item.store_promotion_id 
                          ? '✅ Imported' 
                          : item._sync_status === 'failed'
                            ? '❌ Failed'
                            : '⏳ Pending'}
                  </span>
                </td>
            </tr>
            );
          })}
          {items.length === 0 && (
            <tr><td className="px-3 py-4 text-center" colSpan="10">No items found</td></tr>
          )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!showAllPages && pagination.total_pages > 1 && (
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} items
            </div>
            
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => fetchItems(1)}
                disabled={pagination.current_page <= 1 || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="First page"
              >
                <FiChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => fetchItems(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1 || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-2">
                {generatePageNumbers().map((page) => (
                  <React.Fragment key={`page-${page}`}>
                    {page === '...' ? (
                      <span className="px-2 py-1 text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => fetchItems(page)}
                        disabled={loading}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          pagination.current_page === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next Page */}
              <button
                onClick={() => fetchItems(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.total_pages || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => fetchItems(pagination.total_pages)}
                disabled={pagination.current_page >= pagination.total_pages || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last page"
              >
                <FiChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show All Mode Indicator */}
      {showAllPages && (
        <div className="px-6 py-3 bg-orange-50 border-t border-orange-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-orange-800">
              <strong>Bulk Mode:</strong> Showing all {items.length} promotions in one scrolling page for easy bulk operations.
            </div>
            <div className="text-xs text-orange-600">
              Perfect for selecting large datasets for import!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OdooPromotions; 
import React, { useContext, useEffect, useState, useRef } from 'react';
import { FiPlus, FiSearch, FiFilter, FiDownload, FiRefreshCw, FiEdit, FiTrash2, FiEye, FiGrid, FiList, FiChevronDown, FiChevronRight, FiSettings, FiCheck, FiX } from 'react-icons/fi';
import { SidebarContext } from '@/context/SidebarContext';
import { useHistory } from 'react-router-dom';
import Main from '@/layout/Main';
import PageTitle from '@/components/Typography/PageTitle';
import { notifyError, notifySuccess } from '@/utils/toast';
import { useQuery } from '@tanstack/react-query';
import PromotionServices from '@/services/PromotionServices';
import PromotionListServices from '@/services/PromotionListServices';
import PromotionModal from '@/components/modal/PromotionModal';
import Loading from '@/components/preloader/Loading';
import toast from 'react-hot-toast';
import exportFromJSON from 'export-from-json';
import MainDrawer from '@/components/drawer/MainDrawer';
import DeleteModal from '@/components/modal/DeleteModal';
import useUtilsFunction from "@/hooks/useUtilsFunction";

const Promotions = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const history = useHistory();
  const { currency, getNumberTwo } = useUtilsFunction();
  
  // Helper function to safely render text that might be an object
  const renderSafeText = (text, fallback = '') => {
    if (typeof text === 'object' && text) {
      return text.en || text.ar || Object.values(text)[0] || fallback;
    }
    return text || fallback;
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);

  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [promotions, setPromotions] = useState([]);
  const [promotionLists, setPromotionLists] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [fetchError, setFetchError] = useState(null);
  const [expandedLists, setExpandedLists] = useState(new Set());
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const dataLoadedRef = useRef(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [showAllPages, setShowAllPages] = useState(false);
  const [customPageSize, setCustomPageSize] = useState(20);

  // Page size options
  const pageSizeOptions = [
    { value: 20, label: '20 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
    { value: 200, label: '200 per page' },
  ];

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const totalPagesCount = totalPages;
    const currentPageNum = currentPage;
    
    if (totalPagesCount <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPagesCount; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (currentPageNum <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPagesCount);
      } else if (currentPageNum >= totalPagesCount - 3) {
        pages.push(1, '...', totalPagesCount - 4, totalPagesCount - 3, totalPagesCount - 2, totalPagesCount - 1, totalPagesCount);
      } else {
        pages.push(1, '...', currentPageNum - 1, currentPageNum, currentPageNum + 1, '...', totalPagesCount);
      }
    }
    
    return pages;
  };

  const toggleSelectPromotion = (promotionId) => {
    setSelectedPromotions(prev => 
      prev.includes(promotionId) 
        ? prev.filter(id => id !== promotionId)
        : [...prev, promotionId]
    );
  };

  const toggleSelectAllPromotions = () => {
    const allPromotionIds = promotions.map(p => p._id);
    const allSelected = allPromotionIds.every(id => selectedPromotions.includes(id));
    
    if (allSelected) {
      setSelectedPromotions([]);
    } else {
      setSelectedPromotions(allPromotionIds);
    }
  };

  const handlePageSizeChange = (selectedOption) => {
    setCustomPageSize(selectedOption.value);
    setCurrentPage(1); // Reset to first page when changing page size
    // React Query will automatically refetch due to queryKey change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // React Query will automatically refetch due to queryKey change
  };

  const toggleShowAllPages = () => {
    setShowAllPages(!showAllPages);
    setSelectedPromotions([]); // Clear selection when switching modes
  };

  // 🔥 FIXED: Load promotion lists with proper pagination
  useEffect(() => {
    const loadPromotionLists = async () => {
      try {
        // 🔥 NEW: Use pagination for promotion lists
        const response = await PromotionListServices.getAllPromotionLists({ 
          page: currentPage, 
          limit: customPageSize 
        });
        console.log('Promotion lists response in Promotions page:', response);
        
        if (response?.promotionLists) {
          setPromotionLists(response.promotionLists);
          // 🔥 NEW: Update pagination info for promotion lists
          if (response.totalPages) {
            setTotalPages(response.totalPages);
          }
          if (response.totalPromotionLists) {
            setTotalPromotions(response.totalPromotionLists);
          }
        } else if (Array.isArray(response)) {
          setPromotionLists(response);
          setTotalPages(1);
          setTotalPromotions(response.length);
        } else {
          console.error('Unexpected promotion lists response:', response);
          setPromotionLists([]);
          setTotalPages(1);
          setTotalPromotions(0);
        }
      } catch (error) {
        console.error('Error loading promotion lists:', error);
        setPromotionLists([]);
        setTotalPages(1);
        setTotalPromotions(0);
      }
    };
    
    loadPromotionLists();
  }, [currentPage, customPageSize]); // 🔥 NEW: Re-fetch when page or page size changes
  
  // Use React Query for promotions data
  const {
    data: promotionsData,
    isLoading: isPromotionsLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['promotions', status, currentPage, customPageSize, showAllPages],
    queryFn: () => {
      const params = { 
        page: showAllPages ? 1 : currentPage, 
        limit: showAllPages ? 1000 : customPageSize, 
        status 
      };
      return PromotionServices.getAllPromotions(params);
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Update promotions state when React Query data changes
  useEffect(() => {
    if (promotionsData) {
      setFetchError(null);
      dataLoadedRef.current = true;
      
      if (promotionsData.promotions) {
        setPromotions(promotionsData.promotions);
        setTotalPages(promotionsData.totalPages || 1);
        setTotalPromotions(promotionsData.totalPromotions || 0);
      } else if (Array.isArray(promotionsData)) {
        setPromotions(promotionsData);
        setTotalPages(1);
        setTotalPromotions(promotionsData.length);
      } else {
        setPromotions([]);
        setTotalPages(1);
        setTotalPromotions(0);
      }
    }
  }, [promotionsData]);

  // Handle React Query errors
  useEffect(() => {
    if (error) {
      console.error('React Query error fetching promotions:', error);
      setFetchError(error?.message || 'Failed to fetch promotions');
      setPromotions([]);
    }
  }, [error]);

  // Group promotions by promotion lists
  const getPromotionsByLists = () => {
    const groupedPromotions = {
      withoutList: []
    };
    
    // Initialize groups for each promotion list
    promotionLists.forEach(list => {
      groupedPromotions[list._id] = {
        list,
        promotions: []
      };
    });

    // Group promotions
    promotions.forEach(promotion => {
      // Apply search filter
      if (searchText) {
        const matchesSearch = 
          renderSafeText(promotion?.name, '').toLowerCase().includes(searchText.toLowerCase()) ||
          renderSafeText(promotion?.description, '').toLowerCase().includes(searchText.toLowerCase());
        if (!matchesSearch) return;
      }

      if (promotion.promotionList) {
        const listId = promotion.promotionList._id || promotion.promotionList;
        if (groupedPromotions[listId]) {
          groupedPromotions[listId].promotions.push(promotion);
        }
      } else {
        groupedPromotions.withoutList.push(promotion);
      }
    });

    return groupedPromotions;
  };

  const groupedPromotions = getPromotionsByLists();

  // Toggle list expansion
  const toggleListExpansion = (listId) => {
    const newExpanded = new Set(expandedLists);
    if (newExpanded.has(listId)) {
      newExpanded.delete(listId);
    } else {
      newExpanded.add(listId);
    }
    setExpandedLists(newExpanded);
  };

  const handleAddPromotion = () => {
    setSelectedPromotionId(null);
    setIsModalOpen(true);
  };

  const handleUpdatePromotion = (promotion) => {
    setSelectedPromotionId(promotion._id);
    setIsModalOpen(true);
  };

  const handleManagePromotionList = (list) => {
    history.push(`/promotions/manage/${list._id}`, { 
      list,
      promotions: groupedPromotions[list._id]?.promotions || []
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromotionId(null);
    refetch(); // Refresh data after modal closes
  };

  const handleDeletePromotion = (promotion) => {
    console.log('Delete button clicked for promotion:', promotion);
    setSelectedPromotion(promotion);
    setOpenModal(true);
    console.log('Delete modal should be open now, openModal:', true);
  };

  const confirmDelete = async () => {
    console.log('confirmDelete called with selectedPromotion:', selectedPromotion);
    if (!selectedPromotion || !selectedPromotion._id) {
      console.error('No promotion selected for deletion');
      notifyError('No promotion selected for deletion');
      return;
    }
    
    try {
      console.log('Attempting to delete promotion with ID:', selectedPromotion._id);
      await PromotionServices.deletePromotion(selectedPromotion._id);
      console.log('Promotion deleted successfully');
      notifySuccess('Promotion deleted successfully');
      setOpenModal(false);
      setSelectedPromotion(null);
      refetch();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      notifyError(error.message || 'Failed to delete promotion');
    }
  };

  const handleManualRefresh = () => {
    refetch();
  };

  const exportToCSV = () => {
    exportFromJSON({ data: promotions, fileName: 'promotions', exportType: 'csv' });
  };

  const exportToExcel = () => {
    exportFromJSON({ data: promotions, fileName: 'promotions', exportType: 'xls' });
  };

  const handleStatusFilter = (newStatus) => {
    setStatus(newStatus);
  };

  const getProductDisplay = (promotion) => {
    if (promotion.productUnit && promotion.productUnit.product) {
      return renderSafeText(promotion.productUnit.product.name, 'No Product Name');
    } else if (promotion.selectionMode === 'all') {
      return 'All Products';
    } else if (promotion.categories && promotion.categories.length > 0) {
      return `${promotion.categories.length} Categories`;
    }
    return 'No Product Selected';
  };

  const getPromotionValueDisplay = (promotion) => {
    if (promotion.type === 'bulk_purchase') {
      if (promotion.selectionMode === 'all') {
        return `Buy ${getNumberTwo(promotion.requiredQty)} get ${getNumberTwo(promotion.freeQty)} free`;
      } else {
        return `${getNumberTwo(promotion.requiredQty)} + ${getNumberTwo(promotion.freeQty)} free`;
      }
    } else if (promotion.type === 'assorted_items') {
      return `${currency}${getNumberTwo(promotion.value)} for ${promotion.requiredItemCount || 0} items`;
    }
    return `${currency}${getNumberTwo(promotion.value)}`;
  };

  const getUnitDisplay = (promotion) => {
    if (promotion.productUnit && promotion.productUnit.unit) {
      return renderSafeText(promotion.productUnit.unit, 'No Unit');
    } else if (promotion.selectionMode === 'all') {
      return 'N/A';
    } else if (promotion.categories && promotion.categories.length > 0) {
      return 'Multiple';
    }
    return 'N/A';
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  if (isPromotionsLoading && !dataLoadedRef.current) {
    return (
      <Main>
        <div className="flex items-center justify-center min-h-screen">
          <Loading loading={true} />
        </div>
      </Main>
    );
  }

  return (
    <Main>
      <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Promotions by Lists</h1>
              <p className="text-gray-600">Manage promotions organized by promotion lists</p>
            </div>
            <button
              onClick={handleAddPromotion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              Add Promotion
            </button>
          </div>

          {/* Summary Statistics */}
          <div className="w-full flex flex-wrap gap-6 mb-8">
            <div className="flex-1 min-w-[250px] bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                  <p className="text-3xl font-bold text-gray-900">{totalPromotions}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiEye className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-[250px] bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">{promotions.filter(p => p.isActive).length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FiCheck className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-[250px] bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Inactive</p>
                  <p className="text-3xl font-bold text-red-600">{promotions.filter(p => !p.isActive).length}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <FiX className="w-7 h-7 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-[250px] bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Selected</p>
                  <p className="text-3xl font-bold text-purple-600">{selectedPromotions.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FiCheck className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search promotions..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-2 flex items-center gap-2 transition-colors duration-200 ${
                      viewMode === 'cards' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 flex items-center gap-2 transition-colors duration-200 border-l border-gray-300 ${
                      viewMode === 'list' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                    List
                  </button>
                </div>
                
                <button
                  onClick={handleManualRefresh}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
                >
                  <FiRefreshCw className={`w-4 h-4 ${isPromotionsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Bulk Selection Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {selectedPromotions.length > 0 ? (
                    <span>
                      <span className="font-medium text-blue-600">{selectedPromotions.length}</span> promotion{selectedPromotions.length > 1 ? 's' : ''} selected
                    </span>
                  ) : (
                    `${promotions.length} promotions found`
                  )}
                </div>
                
                {/* Page Size Selector */}
                {!showAllPages && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={customPageSize}
                      onChange={(e) => handlePageSizeChange({ value: parseInt(e.target.value) })}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      {pageSizeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
                      Showing all {promotions.length} promotions
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedPromotions.length > 0 && (
                <button
                    onClick={() => setSelectedPromotions([])}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                  >
                    Clear All
                  </button>
                )}
                
                {/* Bulk Actions */}
                {selectedPromotions.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // Bulk delete selected promotions
                        if (window.confirm(`Are you sure you want to delete ${selectedPromotions.length} promotions?`)) {
                          // Implement bulk delete
                          console.log('Bulk delete:', selectedPromotions);
                        }
                      }}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                      Delete Selected
                    </button>
                    <button
                      onClick={() => {
                        // Bulk export selected promotions
                        console.log('Bulk export:', selectedPromotions);
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      Export Selected
                </button>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusFilter('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  status === '' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => handleStatusFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  status === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  status === 'inactive' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
              <button
                onClick={() => handleStatusFilter('expired')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  status === 'expired' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Expired
              </button>
            </div>
          </div>
        </div>

        {/* Content - Promotions grouped by lists */}
        {fetchError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium mb-2">Error loading promotions</p>
            <p className="text-red-600 mb-4">{fetchError}</p>
            <button 
              onClick={() => refetch()} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Promotions with Lists */}
            {promotionLists.map((list) => {
              const listData = groupedPromotions[list._id];
              const isExpanded = expandedLists.has(list._id);
              const promotionCount = listData?.promotions?.length || 0;
              
              return (
                <div key={list._id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  {/* List Header */}
                  <div 
                    className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleListExpansion(list._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-500">
                          {isExpanded ? <FiChevronDown className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            📋 {renderSafeText(list.name, 'Unnamed List')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {renderSafeText(list.description, 'No description')} • Type: {renderSafeText(list.type, 'N/A')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {promotionCount} promotion{promotionCount !== 1 ? 's' : ''}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          list.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {list.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManagePromotionList(list);
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md flex items-center gap-2 text-sm transition-colors duration-200"
                        >
                          <FiSettings className="w-4 h-4" />
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* List Content */}
                  {isExpanded && (
                    <div className="p-6">
                      {promotionCount > 0 ? (
                        viewMode === 'cards' ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {listData.promotions.map((promotion) => (
                              <div key={promotion._id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                      {renderSafeText(promotion.name, 'No Name')}
                                    </h4>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promotion.isActive)}`}>
                                      {promotion.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleUpdatePromotion(promotion)}
                                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                                    >
                                      <FiEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePromotion(promotion)}
                                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                                    >
                                      <FiTrash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Type:</span>
                                    <span className="text-gray-900 capitalize">{promotion.type?.replace('_', ' ')}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Product:</span>
                                    <span className="text-gray-900 truncate max-w-32">{getProductDisplay(promotion)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Value:</span>
                                    <span className="text-gray-900 font-medium">{getPromotionValueDisplay(promotion)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                                                  <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4">Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/6">Type</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4">Product</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/6">Value</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/6">Status</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase w-1/6">Actions</th>
                              </tr>
                            </thead>
                                                              <tbody className="divide-y divide-gray-200">
                                  {listData.promotions.map((promotion) => (
                                    <tr key={promotion._id} className="hover:bg-gray-50">
                                      <td className="px-3 py-2 text-sm text-gray-900">
                                        <div className="max-w-xs truncate" title={renderSafeText(promotion.name, 'No Name')}>
                                          {renderSafeText(promotion.name, 'No Name')}
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 text-sm text-gray-900 capitalize">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                          {promotion.type?.replace('_', ' ')}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2 text-sm text-gray-900">
                                        <div className="max-w-xs truncate" title={getProductDisplay(promotion)}>
                                          {getProductDisplay(promotion)}
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 text-sm text-gray-900 font-medium">
                                        {getPromotionValueDisplay(promotion)}
                                      </td>
                                      <td className="px-3 py-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promotion.isActive)}`}>
                                          {promotion.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                          <button
                                            onClick={() => handleUpdatePromotion(promotion)}
                                            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                            title="Edit promotion"
                                          >
                                            <FiEdit className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDeletePromotion(promotion)}
                                            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                            title="Delete promotion"
                                          >
                                            <FiTrash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                            </table>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiEye className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No promotions in this list</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Promotions without Lists */}
            {groupedPromotions.withoutList.length > 0 && (
              <div className="bg-white rounded-lg border border-red-200 shadow-sm">
                <div 
                  className="px-6 py-4 border-b border-red-200 cursor-pointer hover:bg-red-50"
                  onClick={() => toggleListExpansion('withoutList')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500">
                        {expandedLists.has('withoutList') ? <FiChevronDown className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-900">
                          ⚠️ Promotions Without Lists
                        </h3>
                        <p className="text-sm text-red-600">
                          These promotions are not assigned to any promotion list
                        </p>
                      </div>
                    </div>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      {groupedPromotions.withoutList.length} promotion{groupedPromotions.withoutList.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {expandedLists.has('withoutList') && (
                  <div className="p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 text-sm">
                        <strong>Warning:</strong> These promotions should be assigned to promotion lists for better organization and management.
                      </p>
                    </div>
                    
                    {viewMode === 'cards' ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {groupedPromotions.withoutList.map((promotion) => (
                          <div key={promotion._id} className="bg-red-50 rounded-lg border border-red-200 p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-red-900 mb-1">
                                  {renderSafeText(promotion.name, 'No Name')}
                                </h4>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promotion.isActive)}`}>
                                  {promotion.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUpdatePromotion(promotion)}
                                  className="p-1 text-red-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                                >
                                  <FiEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePromotion(promotion)}
                                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-red-500">Type:</span>
                                <span className="text-red-900 capitalize">{promotion.type?.replace('_', ' ')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-500">Product:</span>
                                <span className="text-red-900 truncate max-w-32">{getProductDisplay(promotion)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-500">Value:</span>
                                <span className="text-red-900 font-medium">{getPromotionValueDisplay(promotion)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-red-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-red-500 uppercase w-1/4">Name</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-red-500 uppercase w-1/6">Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-red-500 uppercase w-1/4">Product</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-red-500 uppercase w-1/6">Value</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-red-500 uppercase w-1/6">Status</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-red-500 uppercase w-1/6">Actions</th>
                            </tr>
                          </thead>
                                                      <tbody className="divide-y divide-red-200">
                              {groupedPromotions.withoutList.map((promotion) => (
                                <tr key={promotion._id} className="hover:bg-red-50">
                                  <td className="px-3 py-2 text-sm text-red-900">
                                    <div className="max-w-xs truncate" title={renderSafeText(promotion.name, 'No Name')}>
                                      {renderSafeText(promotion.name, 'No Name')}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-sm text-red-900 capitalize">
                                    <span className="px-2 py-1 bg-red-100 rounded text-xs">
                                      {promotion.type?.replace('_', ' ')}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-sm text-red-900">
                                    <div className="max-w-xs truncate" title={getProductDisplay(promotion)}>
                                      {getProductDisplay(promotion)}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-sm text-red-900 font-medium">
                                    {getPromotionValueDisplay(promotion)}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promotion.isActive)}`}>
                                      {promotion.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        onClick={() => handleUpdatePromotion(promotion)}
                                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                        title="Edit promotion"
                                      >
                                        <FiEdit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePromotion(promotion)}
                                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                        title="Delete promotion"
                                      >
                                        <FiTrash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* 🔥 NEW: Main Promotion Lists Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Page Size Selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Show:</label>
                      <select
                        value={customPageSize}
                        onChange={(e) => handlePageSizeChange({ value: parseInt(e.target.value) })}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {pageSizeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Show All Toggle */}
                    <button
                      onClick={toggleShowAllPages}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        showAllPages 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {showAllPages ? 'Show Paginated' : 'Show All'}
                    </button>
                  </div>
                  
                  {/* Pagination Info */}
                  <div className="text-sm text-gray-600">
                    {showAllPages ? (
                      <span>Showing all {totalPromotions} promotion lists</span>
                    ) : (
                      <span>
                        Page {currentPage} of {totalPages} • {totalPromotions} total promotion lists
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Pagination Navigation */}
                {!showAllPages && totalPages > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * customPageSize) + 1} to {Math.min(currentPage * customPageSize, totalPromotions)} of {totalPromotions} promotion lists
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {generatePageNumbers().map((page, index) => (
                            <button
                              key={index}
                              onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                              disabled={typeof page !== 'number'}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                typeof page === 'number'
                                  ? page === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                  : 'text-gray-400 cursor-default'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        
                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Individual Promotions Pagination Controls */}
            {totalPages > 1 && !showAllPages && (
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * customPageSize) + 1} to {Math.min(currentPage * customPageSize, totalPromotions)} of {totalPromotions} promotions
                  </span>
                  
                  {/* Show All Toggle */}
                  <button
                    onClick={toggleShowAllPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Show All
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Page Size Selector */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Show:</span>
                    <select
                      value={customPageSize}
                      onChange={(e) => handlePageSizeChange({ value: parseInt(e.target.value) })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {pageSizeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Pagination Navigation */}
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {generatePageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                        disabled={page === '...'}
                        className={`px-3 py-1 text-sm border rounded ${
                          page === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : page === '...'
                            ? 'border-gray-300 text-gray-500 cursor-default'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            )}
            
            {/* Show All Mode Info */}
            {showAllPages && (
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Showing all {totalPromotions} promotions
                  </span>
                  
                  {/* Back to Paginated Toggle */}
                  <button
                    onClick={toggleShowAllPages}
                    className="px-3 py-1 text-sm border border-green-600 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Show Paginated
                  </button>
                </div>
              </div>
            )}
            
            {/* Empty state */}
            {promotionLists.length === 0 && groupedPromotions.withoutList.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiEye className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No promotions found</h3>
                <p className="text-gray-600 mb-6">Create your first promotion to get started</p>
                <button
                  onClick={handleAddPromotion}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Add Promotion
                </button>
              </div>
            )}
          </div>
        )}

        {/* Promotion Modal */}
        <PromotionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          promotionId={selectedPromotionId}
        />

        {/* Delete Modal */}
        <DeleteModal
          id={selectedPromotion?._id}
          title="Delete Promotion"
          isOpen={openModal}
          handleDelete={confirmDelete}
          handleModalClose={() => setOpenModal(false)}
        />
    </Main>
  );
};

export default Promotions; 
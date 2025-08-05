import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiCloud, FiDownload, FiUpload, FiArrowUpCircle, FiList, FiCheckSquare, FiX } from "react-icons/fi";
import Cookies from "js-cookie";

// internal imports
import PageTitle from "@/components/Typography/PageTitle";
import Loading from "@/components/preloader/Loading";
import { notifySuccess, notifyError } from "@/utils/toast";
import OdooSyncServices from "@/services/OdooSyncServices";

const OdooSync = () => {
  // UI states
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncFields, setSyncFields] = useState({ name:true, price:true, stock:true, categories:false, units:false, promotions:false });
  const [showPushModal, setShowPushModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // New category-based sync states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [syncProgress, setSyncProgress] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // New batch fetch states
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchOffset, setBatchOffset] = useState(0);
  const [batchLimit, setBatchLimit] = useState(5000);
  const [batchLoading, setBatchLoading] = useState(false);

  // Additional loading states for better UX
  const [statsLoading, setStatsLoading] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushReport, setPushReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Helper to update stats
  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      const res = await OdooSyncServices.getStatistics();
      setStatistics(res.data || res);
    } catch (err) {
      console.error("Failed to load statistics", err);
      notifyError("Failed to load statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  // Initial load: get connection status and statistics
  useEffect(() => {
    const init = async () => {
      await handleConnectionStatus();
    };
    init();
  }, []);

  const handleConnectionTest = async () => {
    try {
      setConnectionLoading(true);
      const res = await OdooSyncServices.testConnection();
      setConnectionStatus(res.data || res);
      if (res.success || res.data?.success) {
        notifySuccess("Odoo connection successful");
      } else {
        notifyError("Odoo connection failed");
      }
    } catch (err) {
      console.error(err);
      notifyError(err.response?.data?.message || "Odoo connection failed");
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleConnectionStatus = async () => {
    try {
      setLoading(true);
      const res = await OdooSyncServices.getConnectionStatus();
      setConnectionStatus(res.data || res);
      await loadStatistics();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async () => {
    if (!window.confirm("Fetch data from Odoo? This might take a while.")) return;

    try {
      setFetchLoading(true);
      setLastAction("fetch");
      const res = await OdooSyncServices.fetchFromOdoo();
      notifySuccess(res.message || "Data fetched successfully");
      await loadStatistics();
    } catch (err) {
      console.error(err);
      notifyError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setFetchLoading(false);
    }
  };

  // Batch fetch handlers
  const handleOpenBatchModal = () => {
    setShowBatchModal(true);
  };
  
  const handleCloseBatchModal = () => setShowBatchModal(false);

  const handleBatchFetch = async () => {
    if (!window.confirm(`Fetch products ${batchOffset} to ${batchOffset + batchLimit} from Odoo?`)) return;

    try {
      setBatchLoading(true);
      setLastAction("batch_fetch");
      const res = await OdooSyncServices.fetchFromOdooBatched(['products'], batchOffset, batchLimit);
      notifySuccess(res.message || `Batch fetch completed: ${res.data?.products || 0} products processed`);
      await loadStatistics();
      setShowBatchModal(false);
    } catch (err) {
      console.error('❌ Batch fetch error:', err);
      notifyError(err.response?.data?.message || "Failed to batch fetch data");
    } finally {
      setBatchLoading(false);
    }
  };

  const handleOpenSyncModal = () => setShowSyncModal(true);
  const handleCloseSyncModal = () => setShowSyncModal(false);

  const handleRunSync = async () => {
    try {
      setSyncLoading(true);
      const res = await OdooSyncServices.syncToStore({ fields: syncFields });
      notifySuccess(`Sync completed. Updated ${res.updated || 0} products`);
    } catch(err) {
      console.error(err);
      notifyError(err.response?.data?.message || 'Sync failed');
    } finally {
      setSyncLoading(false);
      setShowSyncModal(false);
    }
  };

  // New category-based sync functions
  const handleOpenCategoryModal = async () => {
    try {
      setCategoryLoading(true);
      const res = await OdooSyncServices.getOdooCategories();
      setCategories(res.data?.categories || res.categories || []);
      setShowCategoryModal(true);
    } catch(err) {
      console.error('❌ Failed to load categories:', err);
      notifyError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setSyncProgress(null);
  };

  const handleCategorySelection = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories(categories.map(cat => cat.id));
  };

  const handleDeselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleSyncCategories = async () => {
    if (!window.confirm(`Sync ${selectedCategories.length} selected categories? This will update prices from Odoo.`)) return;
    
    try {
      setCategoryLoading(true);
      setSyncProgress({ status: 'syncing', message: `Syncing ${selectedCategories.length} categories...` });
      
      // Use the new enhanced selective category sync
      const res = await OdooSyncServices.syncSelectedCategories(selectedCategories);
      
      if (res.success) {
        setSyncProgress({ 
          status: 'completed', 
          message: `Successfully synced ${res.data?.updated || 0} products from ${selectedCategories.length} categories`,
          details: res.data
        });
        notifySuccess(`Category sync completed! Updated ${res.data?.updated || 0} products`);
        await loadStatistics(); // Refresh stats
      } else {
        throw new Error(res.message || 'Sync failed');
      }
    } catch(err) {
      console.error('❌ Category sync failed:', err);
      setSyncProgress({ 
        status: 'error', 
        message: err.response?.data?.message || err.message || 'Category sync failed' 
      });
      notifyError(err.response?.data?.message || 'Category sync failed');
    } finally {
      setCategoryLoading(false);
    }
  };

  const openPushModal = async () => {
    try{
      setPushLoading(true);
      const res = await OdooSyncServices.listBranches();
      const branchesData = res.data?.data || res.data || [];
      setBranches(branchesData);
      setShowPushModal(true);
    }catch(err){
      console.error(err);
      notifyError(err.response?.data?.message || 'Failed to load branches');
    }finally{
      setPushLoading(false);
    }
  };

  const closePushModal = () => setShowPushModal(false);

  const handlePushBack = async () => {
    try{
      setPushLoading(true);
      const res = await OdooSyncServices.pushBackStock({
        sourceLocationId: selectedSource?.id,
        destinationLocationId: selectedDestination?.id
      });
      
      // Store the detailed report
      if (res.detailedReport) {
        setPushReport(res.detailedReport);
        setShowReportModal(true);
      }
      
      notifySuccess(`Pushed ${res.pushed||0} units back to Odoo`);
      setShowPushModal(false);
    }catch(err){
      console.error(err);
      notifyError(err.response?.data?.message || 'Push-back failed');
    }finally{
      setPushLoading(false);
    }
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setPushReport(null);
  };

  const handleDownloadReport = async () => {
    try {
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;
      
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL || 'https://e-commerce-backend-l0s0.onrender.com/api'}/odoo-sync/download-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reportData: pushReport })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `push-back-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        notifySuccess('Report downloaded successfully');
      } else {
        notifyError('Failed to download report');
      }
    } catch (error) {
      console.error('Download error:', error);
      notifyError('Failed to download report');
    }
  };

  return (
    <>
      <PageTitle>Odoo Data Synchronization</PageTitle>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleConnectionTest}
          disabled={connectionLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connectionLoading ? <FiRefreshCw className="mr-2 animate-spin" /> : <FiCloud className="mr-2" />}
          Test Connection
        </button>

        <button
          onClick={handleFetchData}
          disabled={fetchLoading}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {fetchLoading ? <FiRefreshCw className="mr-2 animate-spin" /> : <FiDownload className="mr-2" />}
          Fetch Data
        </button>

        <button
          onClick={handleOpenBatchModal}
          disabled={batchLoading}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {batchLoading ? <FiRefreshCw className="mr-2 animate-spin" /> : <FiDownload className="mr-2" />}
          Batch Fetch
        </button>

        <button
          onClick={handleOpenSyncModal}
          disabled={syncLoading}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncLoading ? <FiRefreshCw className="mr-2 animate-spin" /> : <FiRefreshCw className="mr-2" />}
          Sync Selected Fields
        </button>

        <button
          onClick={handleOpenCategoryModal}
          disabled={categoryLoading}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {categoryLoading ? <FiRefreshCw className="mr-2 animate-spin" /> : <FiList className="mr-2" />}
          Sync by Category
        </button>

        <button
          onClick={loadStatistics}
          disabled={statsLoading}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {statsLoading ? <FiRefreshCw className="mr-2 animate-spin" /> : <FiRefreshCw className="mr-2" />}
          Refresh Stats
        </button>

        <button
          onClick={openPushModal}
          disabled={pushLoading}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pushLoading ? <FiRefreshCw className="mr-2 animate-spin" /> : <FiArrowUpCircle className="mr-2" />}
          Push Stock Back
        </button>
      </div>

      {loading && <Loading loading={loading} />}

      {/* Connection Status */}
      {connectionStatus && (
        <div className="mb-4 p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
          <p>
            {connectionStatus.connected ? (
              <span className="text-green-600">Connected</span>
            ) : (
              <span className="text-red-600">Disconnected</span>
            )}
          </p>
          {connectionStatus.message && (
            <p className="text-sm text-gray-600 mt-1">{connectionStatus.message}</p>
          )}
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Fetched Data Statistics</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <li>Products: <span className="font-medium">{statistics.total_records?.products || 0}</span></li>
            <li>Categories: <span className="font-medium">{statistics.total_records?.categories || 0}</span></li>
            <li>Units of Measure: <span className="font-medium">{statistics.total_records?.uom || 0}</span></li>
            <li>Stock: <span className="font-medium">{statistics.total_records?.stock || 0}</span></li>
            <li>Barcode Units: <span className="font-medium">{statistics.total_records?.barcode_units || 0}</span></li>
            <li>Pricelists: <span className="font-medium">{statistics.total_records?.pricelists || 0}</span></li>
            <li>Pricelist Items: <span className="font-medium">{statistics.total_records?.pricelist_items || 0}</span></li>
          </ul>
        </div>
      )}

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Select Categories to Sync</h2>
            
            {/* Progress indicator */}
            {syncProgress && (
              <div className={`mb-4 p-3 rounded ${
                syncProgress.status === 'completed' ? 'bg-green-100 text-green-800' :
                syncProgress.status === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {syncProgress.message}
              </div>
            )}

            {/* Category selection controls */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleSelectAllCategories}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAllCategories}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Deselect All
              </button>
              <span className="text-sm text-gray-600 ml-auto">
                {selectedCategories.length} of {categories.length} selected
              </span>
            </div>

            {/* Categories list */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategorySelection(category.id)}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{category.complete_name}</div>
                    <div className="text-sm text-gray-600">
                      {category.product_count} products
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={handleCloseCategoryModal} 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={handleSyncCategories}
                disabled={selectedCategories.length === 0 || categoryLoading}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {categoryLoading ? (
                  <>
                    <FiRefreshCw className="mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  `Sync ${selectedCategories.length} Categories`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Fetch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Batch Fetch from Odoo</h2>
            <p className="text-sm text-gray-600 mb-4">
              Fetch products in batches to avoid timeout. Useful for large catalogs (20k+ products).
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Starting Position (Offset)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={batchOffset}
                  onChange={(e) => setBatchOffset(parseInt(e.target.value) || 0)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Start from product number (0 = beginning)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Batch Size (Limit)</label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={batchLimit}
                  onChange={(e) => setBatchLimit(parseInt(e.target.value) || 5000)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="5000"
                />
                <p className="text-xs text-gray-500 mt-1">Number of products to fetch (recommended: 1000-5000)</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded text-sm">
                <strong>Will fetch:</strong> Products {batchOffset} to {batchOffset + batchLimit}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={handleCloseBatchModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={handleBatchFetch}
                disabled={batchLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {batchLoading ? (
                  <>
                    <FiRefreshCw className="mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  'Start Batch Fetch'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSyncModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Select Fields to Sync</h2>
            {Object.keys(syncFields).map(key=> (
              <label key={key} className="flex items-center gap-2 mb-2">
                <input type="checkbox" className="rounded" checked={syncFields[key]} onChange={()=>setSyncFields(prev=>({...prev,[key]:!prev[key]}))} />
                <span className="capitalize">{key}</span>
              </label>
            ))}
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={handleCloseSyncModal} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              <button 
                onClick={handleRunSync} 
                disabled={syncLoading}
                className="flex items-center px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncLoading ? (
                  <>
                    <FiRefreshCw className="mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  'Sync'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPushModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Push Stock Back to Odoo</h2>
            {branches.length>0 ? (
              <>
                <label className="block mb-2 font-medium">Source Location</label>
                <select value={selectedSource?.id||''} onChange={e=>{
                  const id=parseInt(e.target.value,10);
                  setSelectedSource(branches.find(b=>b.id===id));
                }} className="w-full border px-3 py-2 mb-4 rounded">
                  <option value="">Select Source</option>
                  {branches.map(b=> (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <label className="block mb-2 font-medium">Destination Location</label>
                <select value={selectedDestination?.id||''} onChange={e=>{
                  const id=parseInt(e.target.value,10);
                  setSelectedDestination(branches.find(b=>b.id===id));
                }} className="w-full border px-3 py-2 mb-4 rounded">
                  <option value="">Select Destination</option>
                  {branches.map(b=> (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </>
            ):(
              <p className="text-sm text-gray-500 mb-4">No branches found.</p>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={closePushModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button 
                disabled={!(selectedSource && selectedDestination) || pushLoading} 
                onClick={handlePushBack} 
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pushLoading ? (
                  <>
                    <FiRefreshCw className="mr-2 animate-spin" />
                    Pushing...
                  </>
                ) : (
                  'Push'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Report Modal */}
      {showReportModal && pushReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Push Back Report</h2>
              <button onClick={closeReportModal} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            {/* Summary Section */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{pushReport.summary.totalUnits}</div>
                  <div className="text-sm text-gray-600">Total Units</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{pushReport.summary.successfulPushes}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{pushReport.summary.failedPushes}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{pushReport.summary.totalQuantity}</div>
                  <div className="text-sm text-gray-600">Total Quantity</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-sm">
                  <strong>Source Location:</strong> {pushReport.sourceLocationName || pushReport.sourceLocation}<br/>
                  <strong>Destination Location:</strong> {pushReport.destinationLocationName || pushReport.destinationLocation}<br/>
                  <strong>Timestamp:</strong> {new Date(pushReport.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Successful Transfers */}
            {pushReport.successfulTransfers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-green-600">✅ Successful Transfers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Store Product</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Store Unit</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Odoo Product</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Odoo Unit</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Quantity</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Source</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Destination</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pushReport.successfulTransfers.map((transfer, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                            {typeof transfer.storeProductName === 'object' ? 
                              (transfer.storeProductName?.en || transfer.storeProductName?.ar || 'Unknown') : 
                              (transfer.storeProductName || 'Unknown')}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                            {typeof transfer.storeUnitName === 'object' ? 
                              (transfer.storeUnitName?.en || transfer.storeUnitName?.ar || 'Unknown') : 
                              (transfer.storeUnitName || 'Unknown')}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                            {typeof transfer.odooProductName === 'object' ? 
                              (transfer.odooProductName?.en || transfer.odooProductName?.ar || 'Unknown') : 
                              (transfer.odooProductName || 'Unknown')}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                            {typeof transfer.odooUnitName === 'object' ? 
                              (transfer.odooUnitName?.en || transfer.odooUnitName?.ar || 'Unknown') : 
                              (transfer.odooUnitName || 'Unknown')}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">{transfer.quantity}</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">{transfer.sourceLocationName || transfer.sourceLocation}</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">{transfer.destinationLocationName || transfer.destinationLocation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Failed Transfers */}
            {pushReport.failedTransfers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-red-600">❌ Failed Transfers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Store Product</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Store Unit</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Quantity</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pushReport.failedTransfers.map((transfer, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                            {typeof transfer.storeProductName === 'object' ? 
                              (transfer.storeProductName?.en || transfer.storeProductName?.ar || 'Unknown') : 
                              (transfer.storeProductName || 'Unknown')}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                            {typeof transfer.storeUnitName === 'object' ? 
                              (transfer.storeUnitName?.en || transfer.storeUnitName?.ar || 'Unknown') : 
                              (transfer.storeUnitName || 'Unknown')}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">{transfer.quantity}</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-red-600">{transfer.error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download Report
              </button>
              <button 
                onClick={closeReportModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OdooSync; 
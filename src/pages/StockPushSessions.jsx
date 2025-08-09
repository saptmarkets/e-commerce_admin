import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FiEye, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { Card, CardBody, Modal } from '@windmill/react-ui';
import PageTitle from '@/components/Typography/PageTitle';
import Button from '@/components/form/button/CMButton';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import OdooSyncServices from '@/services/OdooSyncServices';

const StockPushSessions = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [syncingSession, setSyncingSession] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    partial: 0,
    pending: 0,
    success_rate: 0
  });
  const [branchMap, setBranchMap] = useState({});

  const ensureBranchesLoaded = async () => {
    if (Object.keys(branchMap).length > 0) return;
    try {
      const res = await OdooSyncServices.listBranches();
      const branches = res.data?.data || res.data || [];
      const map = {};
      branches.forEach(b => { map[b.id] = b.name; });
      setBranchMap(map);
    } catch (err) {
      console.error('Failed to load branches:', err);
    }
  };

  const getSourceBranchName = (sess) => {
    const id = sess?.settings?.sourceLocationId;
    return (id && branchMap[id]) || 'Unknown';
  };
  const getDestinationBranchName = (sess) => {
    const id = sess?.settings?.destinationLocationId;
    return (id && branchMap[id]) || 'Unknown';
  };

  // Helper: resolve product title from populated product or stored title
  const resolveProductTitle = (product) => {
    try {
      const productInfo = product?.product || {};
      if (productInfo.title) {
        if (typeof productInfo.title === 'object') {
          const currentLang = localStorage.getItem('i18nextLng') || 'en';
          return productInfo.title[currentLang] || productInfo.title.en || productInfo.title.ar || Object.values(productInfo.title)[0] || 'Unknown Product';
        }
        return String(productInfo.title);
      }
      if (product?.productTitle) {
        if (typeof product.productTitle === 'object') {
          const currentLang = localStorage.getItem('i18nextLng') || 'en';
          return product.productTitle[currentLang] || product.productTitle.en || product.productTitle.ar || Object.values(product.productTitle)[0] || 'Unknown Product';
        }
        return String(product.productTitle);
      }
      if (productInfo.name) {
        if (typeof productInfo.name === 'object') {
          const currentLang = localStorage.getItem('i18nextLng') || 'en';
          return productInfo.name[currentLang] || productInfo.name.en || productInfo.name.ar || Object.values(productInfo.name)[0] || 'Unknown Product';
        }
        return String(productInfo.name);
      }
      return 'Unknown Product';
    } catch {
      return 'Unknown Product';
    }
  };

  // PDF download
  const handleDownloadPdf = async () => {
    try {
      if (!selectedSession) return;
      const styles = StyleSheet.create({
        page: { padding: 24, fontSize: 11, fontFamily: 'Helvetica' },
        title: { fontSize: 16, marginBottom: 12, fontWeight: 700 },
        row: { flexDirection: 'row', marginBottom: 6 },
        header: { fontWeight: 700, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 6, marginBottom: 6 },
        tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 6 },
        colProduct: { width: '42%' },
        colSmall: { width: '12%', textAlign: 'right' },
        colStatus: { width: '22%' },
      });

      const srcName = getSourceBranchName(selectedSession);
      const dstName = getDestinationBranchName(selectedSession);

      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Push Back Report</Text>
            <View style={[styles.row, styles.header]}>
              <Text>Session ID: {selectedSession.session_id}</Text>
            </View>
            <View style={styles.row}>
              <Text>Date/Time: {new Date(selectedSession.push_timestamp).toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text>Source: {srcName}  →  Destination: {dstName}</Text>
            </View>
            <View style={[styles.row, styles.header]}> 
              <Text>Summary</Text>
            </View>
            <View style={[styles.tableRow, styles.header]}>
              <Text style={styles.colProduct}>Product</Text>
              <Text style={styles.colSmall}>Before</Text>
              <Text style={styles.colSmall}>After</Text>
              <Text style={styles.colSmall}>Changed</Text>
              <Text style={styles.colStatus}>Status</Text>
            </View>
            {(selectedSession.products_summary || []).map((p, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.colProduct}>{resolveProductTitle(p)}</Text>
                <Text style={styles.colSmall}>{p.quantity_before || 0}</Text>
                <Text style={styles.colSmall}>{p.quantity_after || 0}</Text>
                <Text style={styles.colSmall}>{p.total_changed || 0}</Text>
                <Text style={styles.colStatus}>{String(p.sync_status || 'synced')}</Text>
              </View>
            ))}
          </Page>
        </Document>
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `push-session-${selectedSession.session_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error('Failed to download PDF');
    }
  };

  // Load sessions
  const loadSessions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage
      });

      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-push-sessions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Stock push sessions API response:', data);

      if (data.success) {
        setSessions(data.data || []);
        setTotalItems(data.pagination?.total || 0);
        setTotalPages(Math.ceil((data.pagination?.total || 0) / itemsPerPage));
      } else {
        toast.error(data.message || 'Failed to load stock push sessions');
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load stock push sessions');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-push-sessions/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Open details
  const handleViewDetails = async (session) => {
    setSelectedSession(session);
    setShowDetailModal(true);
    await ensureBranchesLoaded();
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

  // Get status display
  const getStatusDisplay = (status) => {
    try {
      const normalized = String(status || '').toLowerCase();
      // Map backend session statuses to UI statuses
      const mapped = normalized === 'in_progress' ? 'pending'
                    : normalized === 'completed' ? 'synced'
                    : normalized;

      const statusText = String(t(mapped === 'synced' ? 'Synced' : 
                         mapped === 'pending' ? 'Pending' : 
                         mapped === 'failed' ? 'Failed' : 
                         mapped === 'partial' ? 'Partial' : 'Unknown'));
      
      switch (mapped) {
        case 'synced':
          return { text: statusText, color: 'text-green-600', bgColor: 'bg-green-100' };
        case 'pending':
          return { text: statusText, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
        case 'failed':
          return { text: statusText, color: 'text-red-600', bgColor: 'bg-red-100' };
        case 'partial':
          return { text: statusText, color: 'text-blue-600', bgColor: 'bg-blue-100' };
        default:
          return { text: statusText, color: 'text-gray-600', bgColor: 'bg-gray-100' };
      }
    } catch (error) {
      console.error('Error in getStatusDisplay:', error);
      return { text: String(t('Unknown')), color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  // Create new push session
  const createPushSession = async () => {
    try {
      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-push-sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notes: 'Manual push session created from admin panel'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Push session created successfully');
        loadSessions();
        loadStats();
      } else {
        toast.error(data.message || 'Failed to create push session');
      }
    } catch (error) {
      console.error('Error creating push session:', error);
      toast.error('Failed to create push session: ' + error.message);
    }
  };

  // Sync push session to Odoo
  const syncPushSession = async (sessionId) => {
    try {
      setSyncingSession(sessionId);
      
      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-push-sessions/${sessionId}/sync`, {
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
        toast.success('Push session synced successfully');
        
        // If we're viewing this session's details, update the selected session
        if (selectedSession && selectedSession._id === sessionId) {
          setSelectedSession(data.data);
        }
        
        loadSessions();
        loadStats();
      } else {
        toast.error(data.message || 'Failed to sync push session');
      }
    } catch (error) {
      console.error('Error syncing push session:', error);
      toast.error('Failed to sync push session: ' + error.message);
    } finally {
      setSyncingSession(null);
    }
  };

  // Delete push session
  const deletePushSession = async (sessionId) => {
    if (!window.confirm(t('Are you sure you want to delete this push session?'))) {
      return;
    }
    
    try {
      // Get admin token from cookies
      const adminInfo = Cookies.get("adminInfo");
      const token = adminInfo ? JSON.parse(adminInfo).token : null;

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/admin/stock-push-sessions/${sessionId}`, {
        method: 'DELETE',
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
        toast.success('Push session deleted successfully');
        
        // If we're viewing this session's details, close the modal
        if (selectedSession && selectedSession._id === sessionId) {
          setShowDetailModal(false);
          setSelectedSession(null);
        }
        
        loadSessions();
        loadStats();
      } else {
        toast.error(data.message || 'Failed to delete push session');
      }
    } catch (error) {
      console.error('Error deleting push session:', error);
      toast.error('Failed to delete push session: ' + error.message);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadSessions();
    loadStats();
  }, [currentPage, itemsPerPage]);

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <PageTitle>{t('Stock Push Sessions')}</PageTitle>
          <Button onClick={createPushSession}>
            {t('Create New Push Session')}
          </Button>
        </div>

        {/* Statistics */}
        <Card className="mb-6">
          <CardBody>
            <h2 className="text-lg font-semibold mb-4">{t('Push Session Statistics')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                <div className="text-sm text-blue-600">{t('Total Sessions')}</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{stats.successful}</div>
                <div className="text-sm text-green-600">{t('Successful')}</div>
              </div>
              <div className="bg-red-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{stats.failed}</div>
                <div className="text-sm text-red-600">{t('Failed')}</div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                <div className="text-sm text-yellow-600">{t('Pending')}</div>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{stats.success_rate}%</div>
                <div className="text-sm text-purple-600">{t('Success Rate')}</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sessions Table */}
        <Card>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Session ID')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Date/Time')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Products')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Total Quantity')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions && sessions.length > 0 ? sessions.map((session) => {
                    try {
                      const status = getStatusDisplay(session.status);
                      
                      return (
                        <tr key={session._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.session_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(session.push_timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.total_products_affected || session.products_summary?.length || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.total_quantity_changed || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.bgColor} ${status.color}`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(session)}
                                className="text-blue-600 hover:text-blue-900"
                                title={t('View Details')}
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => syncPushSession(session._id)}
                                className={`text-green-600 hover:text-green-900 ${syncingSession === session._id ? 'animate-spin' : ''}`}
                                disabled={syncingSession === session._id}
                                title={t('Sync to Odoo')}
                              >
                                <FiRefreshCw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePushSession(session._id)}
                                className="text-red-600 hover:text-red-900"
                                title={t('Delete')}
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    } catch (error) {
                      console.error('Error rendering session row:', error);
                      return (
                        <tr key={`error-${Math.random()}`} className="hover:bg-gray-50">
                          <td colSpan="6" className="px-6 py-4 text-sm text-red-500">
                            {t('Error rendering session data')}
                          </td>
                        </tr>
                      );
                    }
                  }) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        {t('No push sessions found')}
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
      {showDetailModal && selectedSession && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)}>
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{t('Push Session Details')}</h3>
            </div>
          </div>
          <div className="p-6">
            {/* Width wrapper to enlarge modal content area */}
            <div className="w-[92vw] max-w-6xl">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="font-semibold">{t('Session ID')}:</div>
                <div className="text-gray-700 break-all">{selectedSession.session_id}</div>
              </div>
              <div>
                <div className="font-semibold">{t('Date/Time')}:</div>
                <div className="text-gray-700">{new Date(selectedSession.push_timestamp).toLocaleString()}</div>
              </div>
              <div>
                <div className="font-semibold">{t('Source Branch')}:</div>
                <div className="text-gray-700">{getSourceBranchName(selectedSession)}</div>
              </div>
              <div>
                <div className="font-semibold">{t('Destination Branch')}:</div>
                <div className="text-gray-700">{getDestinationBranchName(selectedSession)}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mb-4">
              <Button onClick={handleDownloadPdf}>{t('Download PDF')}</Button>
              <Button layout="outline" onClick={() => setShowDetailModal(false)}>{t('Close')}</Button>
            </div>

            <div className="mb-4">
              <div className="font-semibold">{t('Products')}:</div>
              <div className="mt-2 max-h-[28rem] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Product')}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Before')}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('After')}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Changed')}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedSession.products_summary && selectedSession.products_summary.length > 0 ? (
                      selectedSession.products_summary.map((product, index) => (
                        <tr key={`product-${index}`} className="hover:bg-gray-50">
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              {/* Product image if available */}
                              {(() => {
                                const info = product?.product || {};
                                const img = info.image || (Array.isArray(info.images) && info.images[0]) || info.thumbnail || null;
                                return img ? (
                                  <img
                                    src={img}
                                    alt={resolveProductTitle(product)}
                                    className="w-10 h-10 rounded mr-2 object-cover border"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                ) : null;
                              })()}
                              <span>{resolveProductTitle(product)}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{product.quantity_before || 0}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{product.quantity_after || 0}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                            <span className={product.total_changed > 0 ? 'text-green-600' : 'text-red-600'}>
                              {product.total_changed > 0 ? '+' : ''}{product.total_changed}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusDisplay(product.sync_status || 'pending').bgColor} ${getStatusDisplay(product.sync_status || 'pending').color}`}>
                              {getStatusDisplay(product.sync_status || 'pending').text}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-2 py-2 text-center text-sm text-gray-500">{t('No products found')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default StockPushSessions; 
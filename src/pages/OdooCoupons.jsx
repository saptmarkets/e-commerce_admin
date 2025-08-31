import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiGift,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiRefreshCw,
  FiEye,
  FiTrash2,
  FiEdit,
  FiDownload,
  FiUpload
} from "react-icons/fi";
import Cookies from "js-cookie";

// internal imports
import PageTitle from "@/components/Typography/PageTitle";
import Loading from "@/components/preloader/Loading";
import { notifySuccess, notifyError } from "@/utils/toast";
import OdooIntegrationServices from "@/services/OdooIntegrationServices";

const OdooCoupons = () => {
  // UI states
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  
  // Form states
  const [giftCardValue, setGiftCardValue] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [validationCode, setValidationCode] = useState('');
  const [validationPhone, setValidationPhone] = useState('');
  
  // Loading states
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [validationLoading, setValidationLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadCoupons();
  }, []);

  // Filter coupons based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCoupons(coupons);
    } else {
      const filtered = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCoupons(filtered);
    }
  }, [searchTerm, coupons]);

  // Load all coupons from Odoo
  const loadCoupons = async () => {
    try {
      setCouponsLoading(true);
      const res = await OdooIntegrationServices.getAllCoupons();
      
      if (res.success) {
        setCoupons(res.data.coupons || []);
        setFilteredCoupons(res.data.coupons || []);
      } else {
        notifyError(res.message || "Failed to load coupons");
      }
    } catch (err) {
      console.error("Failed to load coupons", err);
      notifyError("Failed to load coupons");
    } finally {
      setCouponsLoading(false);
    }
  };

  // Create new gift card
  const handleCreateGiftCard = async () => {
    if (!giftCardValue || giftCardValue <= 0) {
      notifyError("Please enter a valid gift card value");
      return;
    }

    try {
      setCreateLoading(true);
      const res = await OdooIntegrationServices.createGiftCard({
        value: parseFloat(giftCardValue),
        code: giftCardCode || undefined
      });

      if (res.success) {
        notifySuccess(`Gift card created successfully: ${res.data.code}`);
        setShowCreateModal(false);
        setGiftCardValue('');
        setGiftCardCode('');
        loadCoupons(); // Refresh the list
      } else {
        notifyError(res.message || "Failed to create gift card");
      }
    } catch (err) {
      console.error("Failed to create gift card", err);
      notifyError("Failed to create gift card");
    } finally {
      setCreateLoading(false);
    }
  };

  // Validate coupon code
  const handleValidateCoupon = async () => {
    if (!validationCode || !validationPhone) {
      notifyError("Please enter both coupon code and phone number");
      return;
    }

    try {
      setValidationLoading(true);
      const res = await OdooIntegrationServices.validateCoupon({
        couponCode: validationCode,
        customerPhone: validationPhone
      });

      if (res.success && res.data.valid) {
        notifySuccess(`Coupon ${validationCode} is valid! Discount: ${res.data.discountAmount}`);
      } else {
        notifyError(res.data.error || "Invalid coupon code");
      }
    } catch (err) {
      console.error("Coupon validation failed", err);
      notifyError("Coupon validation failed");
    } finally {
      setValidationLoading(false);
    }
  };

  // View coupon details
  const handleViewDetails = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDetailsModal(true);
  };

  // Get status badge
  const getStatusBadge = (state) => {
    switch (state) {
      case 'valid':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Valid</span>;
      case 'used':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Used</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">{state}</span>;
    }
  };

  return (
    <>
      <PageTitle>Odoo Coupons & Gift Cards</PageTitle>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowValidationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiCheckCircle />
            Validate Coupon
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiPlus />
            Create Gift Card
          </button>
          
          <button
            onClick={loadCoupons}
            disabled={couponsLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={couponsLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Coupons List */}
      <div className="bg-white rounded-lg shadow">
        {couponsLoading ? (
          <div className="p-8 text-center">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiGift className="mr-2 text-gray-400" />
                        <span className="font-mono text-sm">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDollarSign className="mr-1 text-green-600" />
                        <span className="font-medium">{coupon.value}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {coupon.useCount} / {coupon.maxUseCount || '∞'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(coupon.state)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.expirationDate ? (
                        <div className="flex items-center">
                          <FiClock className="mr-1 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {new Date(coupon.expirationDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No expiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(coupon)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCoupons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No coupons found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Gift Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create Gift Card</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value (SAR)
                </label>
                <input
                  type="number"
                  value={giftCardValue}
                  onChange={(e) => setGiftCardValue(e.target.value)}
                  placeholder="Enter gift card value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code (Optional)
                </label>
                <input
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  placeholder="Leave empty for auto-generation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGiftCard}
                disabled={createLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {createLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validate Coupon Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Validate Coupon</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={validationCode}
                  onChange={(e) => setValidationCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Phone
                </label>
                <input
                  type="text"
                  value={validationPhone}
                  onChange={(e) => setValidationPhone(e.target.value)}
                  placeholder="Enter customer phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowValidationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleValidateCoupon}
                disabled={validationLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {validationLoading ? 'Validating...' : 'Validate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Details Modal */}
      {showDetailsModal && selectedCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Coupon Details</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Code:</span>
                <p className="font-mono">{selectedCoupon.code}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Value:</span>
                <p className="font-medium">SAR {selectedCoupon.value}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Usage:</span>
                <p>{selectedCoupon.useCount} / {selectedCoupon.maxUseCount || '∞'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <div className="mt-1">{getStatusBadge(selectedCoupon.state)}</div>
              </div>
              
              {selectedCoupon.expirationDate && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Expires:</span>
                  <p>{new Date(selectedCoupon.expirationDate).toLocaleDateString()}</p>
                </div>
              )}
              
              {selectedCoupon.createdAt && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Created:</span>
                  <p>{new Date(selectedCoupon.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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

export default OdooCoupons;

import React from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiPlay, FiPackage, FiTruck, FiFileText } from 'react-icons/fi';

const ProgressBar = ({ progress, currentStep, totalSteps, message, status = 'processing' }) => {
  const getStepIcon = (step) => {
    switch (step) {
      case 'creating_order':
        return <FiPackage className="w-4 h-4" />;
      case 'order_created':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'confirming_order':
        return <FiPlay className="w-4 h-4" />;
      case 'order_confirmed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'waiting_delivery':
        return <FiClock className="w-4 h-4" />;
      case 'validating_delivery':
        return <FiTruck className="w-4 h-4" />;
      case 'delivery_validated':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'creating_invoice':
        return <FiFileText className="w-4 h-4" />;
      case 'invoice_created':
        return <FiCheckCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const getStepLabel = (step) => {
    switch (step) {
      case 'creating_order':
        return 'Creating Order (0-25%)';
      case 'order_created':
        return '✅ Order Created (25%)';
      case 'confirming_order':
        return 'Confirming Order (25-50%)';
      case 'order_confirmed':
        return '✅ Order Confirmed (50%)';
      case 'waiting_delivery':
        return 'Waiting for Delivery (50-75%)';
      case 'validating_delivery':
        return 'Validating Delivery (75-100%)';
      case 'delivery_validated':
        return '✅ Delivery Validated (100%)';
      case 'creating_invoice':
        return 'Creating Invoice (Bonus)';
      case 'invoice_created':
        return '✅ Invoice Created (Complete)';
      default:
        return 'Processing';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{message}</span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(status)}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {currentStep && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {getStepIcon(currentStep)}
          <span>{getStepLabel(currentStep)}</span>
        </div>
      )}
    </div>
  );
};

const OrderProgressCard = ({ order, progress, isActive = false }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <FiClock className="w-5 h-5 text-blue-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor(order.status)} ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getStatusIcon(order.status)}
          <div>
            <h4 className="font-medium text-gray-900">Order #{order.invoiceNumber}</h4>
            <p className="text-sm text-gray-600">{order.customerName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{order.orderTotal}</p>
          <p className="text-xs text-gray-500">{order.itemCount} items</p>
        </div>
      </div>
      
      {order.status === 'processing' && progress && (
        <ProgressBar 
          progress={progress.overallProgress || 0}
          currentStep={progress.currentStep}
          message={progress.message}
          status="processing"
        />
      )}
      
      {order.status === 'completed' && order.odooOrderId && (
        <div className="text-sm text-green-600">
          <p>✅ Odoo Order ID: {order.odooOrderId}</p>
          {order.deliveryValidated && <p>✅ Delivery Validated</p>}
          {order.invoiceCreated && <p>✅ Invoice Created</p>}
        </div>
      )}
      
      {order.status === 'failed' && order.error && (
        <div className="text-sm text-red-600">
          <p>❌ {order.error}</p>
        </div>
      )}
    </div>
  );
};

const BatchProgressModal = ({ isOpen, onClose, progressData, orders }) => {
  if (!isOpen) return null;

  const getOverallProgress = () => {
    if (!progressData) return 0;
    
    switch (progressData.type) {
      case 'session_started':
        return 5;
      case 'orders_found':
        return 10;
      case 'chunk_started':
        return progressData.progress || 20;
      case 'order_started':
        return progressData.progress || 30;
      case 'order_completed':
        return progressData.progress || 80;
      case 'session_completed':
        return 100;
      default:
        return progressData.progress || 0;
    }
  };

  const getOverallMessage = () => {
    if (!progressData) return 'Initializing...';
    return progressData.message || 'Processing orders...';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Batch Processing Progress</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiXCircle className="w-6 h-6" />
            </button>
          </div>
          
          {/* Overall Progress */}
          <div className="mb-6">
            <ProgressBar 
              progress={getOverallProgress()}
              message={getOverallMessage()}
              status={progressData?.type === 'session_completed' ? 'completed' : 'processing'}
            />
          </div>
          
          {/* Orders List */}
          <div className="max-h-96 overflow-y-auto">
            <h4 className="text-md font-medium text-gray-900 mb-3">Order Progress</h4>
            <div className="space-y-3">
              {orders.map((order, index) => (
                <OrderProgressCard 
                  key={order._id} 
                  order={order}
                  progress={progressData?.orderId === order._id ? progressData : null}
                  isActive={progressData?.orderId === order._id}
                />
              ))}
            </div>
          </div>
          
          {/* Summary */}
          {progressData?.type === 'session_completed' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-md font-medium text-green-900 mb-2">Processing Completed</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-green-600 font-medium">{progressData.results?.successful || 0}</p>
                  <p className="text-green-500">Successful</p>
                </div>
                <div>
                  <p className="text-red-600 font-medium">{progressData.results?.failed || 0}</p>
                  <p className="text-red-500">Failed</p>
                </div>
                <div>
                  <p className="text-blue-600 font-medium">{progressData.results?.processed || 0}</p>
                  <p className="text-blue-500">Total</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProgressBar, OrderProgressCard, BatchProgressModal };

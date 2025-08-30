import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiPlay, FiSettings, FiBarChart3 } from 'react-icons/fi';

const OdooIntegrationTesting = () => {
  const testSteps = [
    {
      section: 'Connection Status',
      tests: [
        {
          name: 'Test Odoo Connection',
          description: 'Click "Test Connection" button',
          expected: 'Should show "Connected" with green status',
          action: 'Click the "Test Connection" button in the top right'
        },
        {
          name: 'Check Environment Variables',
          description: 'Verify Odoo credentials are configured',
          expected: 'No "Configuration Error" messages',
          action: 'Look for any red error messages in the status section'
        }
      ]
    },
    {
      section: 'Statistics Dashboard',
      tests: [
        {
          name: 'View Sync Statistics',
          description: 'Check the statistics cards',
          expected: 'Should show numbers for Total Orders, Pending, Synced, Failed',
          action: 'Look at the 4 cards in the statistics section'
        },
        {
          name: 'Check Recent Activity',
          description: 'View recent sync sessions',
          expected: 'Should show list of recent sessions or "No sessions found"',
          action: 'Scroll down to the Recent Sessions section'
        }
      ]
    },
    {
      section: 'Session Management',
      tests: [
        {
          name: 'Create New Session',
          description: 'Create a test session with dry run',
          expected: 'Should create session successfully',
          action: 'Click "Create New Session", set dry run to true, click "Start Session"'
        },
        {
          name: 'View Session Details',
          description: 'Click on a session to see details',
          expected: 'Should show session details with order breakdown',
          action: 'Click on any session in the sessions list'
        },
        {
          name: 'Retry Failed Orders',
          description: 'Test retry functionality',
          expected: 'Should retry failed orders if any exist',
          action: 'Click "Retry Failed Orders" button if available'
        }
      ]
    },
    {
      section: 'Order Processing',
      tests: [
        {
          name: 'View Pending Orders',
          description: 'Check pending sync orders',
          expected: 'Should show list of orders pending sync',
          action: 'Click "View Pending Orders" tab'
        },
        {
          name: 'Manual Order Sync',
          description: 'Test manual sync for a single order',
          expected: 'Should sync order and update status',
          action: 'Click "Sync" button next to any pending order'
        },
        {
          name: 'Reset Order Status',
          description: 'Test reset functionality',
          expected: 'Should reset order sync status',
          action: 'Click "Reset" button next to any synced order'
        }
      ]
    },
    {
      section: 'Configuration',
      tests: [
        {
          name: 'View Configuration',
          description: 'Check current Odoo sync settings',
          expected: 'Should show current configuration',
          action: 'Click "Configuration" tab'
        },
        {
          name: 'Update Configuration',
          description: 'Test configuration updates',
          expected: 'Should save configuration changes',
          action: 'Modify any setting and click "Save Configuration"'
        }
      ]
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center mb-6">
        <FiPlay className="w-6 h-6 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Odoo Integration Testing Guide</h1>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Quick Start</h2>
        <p className="text-blue-700">
          This guide will help you test all the Odoo Integration features we've implemented. 
          Follow each section step by step to verify everything is working correctly.
        </p>
      </div>

      {testSteps.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <div className="flex items-center mb-4">
            <FiBarChart3 className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-800">{section.section}</h3>
          </div>
          
          <div className="space-y-4">
            {section.tests.map((test, testIndex) => (
              <div key={testIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">{test.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">{test.description}</p>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-700 mb-1">Expected Result:</p>
                      <p className="text-sm text-gray-600">{test.expected}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded mt-2">
                      <p className="text-sm font-medium text-blue-700 mb-1">Action:</p>
                      <p className="text-sm text-blue-600">{test.action}</p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                        Pass
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                        Fail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Testing Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-green-700 mb-2">✅ What Should Work:</h3>
            <ul className="text-sm text-green-600 space-y-1">
              <li>• Connection testing to Odoo</li>
              <li>• Statistics dashboard with real data</li>
              <li>• Session creation and management</li>
              <li>• Order processing and sync</li>
              <li>• Configuration management</li>
              <li>• Error handling and reporting</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-orange-700 mb-2">⚠️ Common Issues:</h3>
            <ul className="text-sm text-orange-600 space-y-1">
              <li>• Odoo credentials not configured</li>
              <li>• Network connectivity issues</li>
              <li>• No orders in "Delivered" status</li>
              <li>• Missing SKU format (should start with "ODOO-")</li>
              <li>• Database connection issues</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Next Steps After Testing</h2>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. If all tests pass, the implementation is working correctly</li>
          <li>2. Configure real Odoo credentials for production use</li>
          <li>3. Test with actual delivered orders</li>
          <li>4. Monitor the system for any issues</li>
          <li>5. Set up automated sync schedules if needed</li>
        </ol>
      </div>
    </div>
  );
};

export default OdooIntegrationTesting;

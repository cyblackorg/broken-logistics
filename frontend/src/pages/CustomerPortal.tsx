import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Mock user data enhanced with business customer features
const createMockUser = (user: any) => ({
  name: user?.name || "John Customer",
  email: user?.email || "john@example.com",
  id: user?.id || "12345",
  accountTier: user?.customer_type === 'business' ? "Business Premium" : "Individual",
  balance: user?.customer_type === 'business' ? "$15,432.18" : "$243.18",
  customerType: user?.customer_type || 'individual',
  companyName: (user as any)?.company_name || null
});

const mockPackages = [
  {
    id: "BL789012",
    recipient: "Sarah Wilson",
    status: "In Transit",
    statusColor: "text-blue-600 bg-blue-100",
    destination: "New York, NY",
    estimatedDelivery: "Today, 3:00 PM",
    progress: 75,
    lastUpdate: "2 hours ago"
  },
  {
    id: "BL456789",
    recipient: "John Customer",
    status: "Delivered",
    statusColor: "text-green-600 bg-green-100",
    destination: "Boston, MA",
    estimatedDelivery: "Delivered Dec 15",
    progress: 100,
    lastUpdate: "3 days ago"
  },
  {
    id: "BL123456",
    recipient: "Mike Johnson", 
    status: "Exception",
    statusColor: "text-red-600 bg-red-100",
    destination: "Chicago, IL",
    estimatedDelivery: "Delayed",
    progress: 45,
    lastUpdate: "1 day ago"
  }
];

const mockActivity = [
  {
    time: "2 hours ago",
    action: "Package BL789012 departed facility",
    location: "Atlanta, GA",
    icon: "🚚"
  },
  {
    time: "5 hours ago", 
    action: "Shipment created for Chicago delivery",
    location: "Boston, MA",
    icon: "📦"
  },
  {
    time: "1 day ago",
    action: "Payment processed successfully",
    location: "System",
    icon: "💳"
  },
  {
    time: "2 days ago",
    action: "Account login",
    location: "Boston, MA",
    icon: "🔐"
  }
];

const CustomerPortal: React.FC = () => {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  
  // Create mock user with business customer enhancements
  const mockUser = createMockUser(user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {mockUser.name}!
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {mockUser.accountTier} Member • Account: {mockUser.id}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
                to="/shipping"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Ship Package
              </Link>
              <Link
                to="/track"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Track Package
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">📦</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Shipments</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {mockPackages.filter(p => p.status !== 'Delivered').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Delivered This Month</h3>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Account Balance</h3>
                <p className="text-2xl font-bold text-green-600">{mockUser.balance}</p>
                <p className="text-xs text-gray-400">Available credit</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Customer Rating</h3>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-xs text-gray-400">Based on feedback</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Packages
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {mockPackages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-gray-900">
                            {pkg.id}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pkg.statusColor}`}>
                            {pkg.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          To: {pkg.recipient} • {pkg.destination}
                        </p>
                        <p className="text-sm text-gray-500">
                          {pkg.estimatedDelivery} • Last updated {pkg.lastUpdate}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                pkg.status === 'Delivered' ? 'bg-green-500' : 
                                pkg.status === 'Exception' ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${pkg.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Track
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Details
                        </button>
                      </div>
                    </div>
                    
                    {selectedPackage === pkg.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Tracking Details:</strong> Package is currently in transit and will be delivered within the estimated time window.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/ship"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  📦 Ship New Package
                </Link>
                <Link
                  to="/track"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  🔍 Track Packages
                </Link>
                <Link
                  to="/shipping"
                  className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  💰 Ship Package
                  {mockUser.customerType === 'business' && (
                    <span className="ml-1 text-xs">✨ Business Rates!</span>
                  )}
                </Link>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  📊 View Analytics
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  ⚙️ Account Settings
                </button>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="text-sm text-gray-900">{mockUser.accountTier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-900">March 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Shipments</span>
                  <span className="text-sm text-gray-900">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer ID</span>
                  <span className="text-sm text-gray-900">{mockUser.id}</span>
                </div>
                <button className="w-full mt-3 px-4 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100">
                  Update Profile
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mockActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.location} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal; 
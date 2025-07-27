import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface OverviewData {
  users: {
    total_users: number;
    active_users: number;
    customers: number;
    drivers: number;
    admins: number;
  };
  packages: {
    total_packages: number;
    delivered_packages: number;
    in_transit_packages: number;
    pending_packages: number;
    exception_packages: number;
    total_revenue: number;
    avg_package_value: number;
  };
  metrics: {
    delivery_success_rate: string;
    avg_delivery_distance: string;
  };
}

interface RevenueData {
  daily_revenue: Array<{
    date: string;
    package_count: number;
    revenue: number;
  }>;
  revenue_by_size: Array<{
    package_size: string;
    package_count: number;
    revenue: number;
  }>;
  revenue_by_speed: Array<{
    speed_option: string;
    package_count: number;
    revenue: number;
  }>;
}

interface PackageData {
  status_distribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  top_routes: Array<{
    origin_state: string;
    destination_state: string;
    package_count: number;
    total_revenue: number;
  }>;
  delivery_metrics: Array<{
    speed_option: string;
    total_packages: number;
    delivered_count: number;
    avg_delivery_days: number;
  }>;
}

interface PerformanceData {
  on_time_delivery_rate: string;
  exception_rate: string;
  avg_delivery_time_days: string;
  avg_shipment_distance: string;
  total_deliveries: number;
  on_time_deliveries: number;
  exception_count: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(false);
  
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/analytics/overview');
      setOverviewData(response.data);
    } catch (error) {
      console.error('Failed to load overview data:', error);
      toast.error('Failed to load overview data');
    } finally {
      setLoading(false);
    }
  };

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/analytics/revenue?period=${period}`);
      setRevenueData(response.data);
    } catch (error) {
      console.error('Failed to load revenue data:', error);
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const loadPackageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/analytics/packages?period=${period}`);
      setPackageData(response.data);
    } catch (error) {
      console.error('Failed to load package data:', error);
      toast.error('Failed to load package data');
    } finally {
      setLoading(false);
    }
  };

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/analytics/performance');
      setPerformanceData(response.data);
    } catch (error) {
      console.error('Failed to load performance data:', error);
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      loadOverviewData();
      loadPerformanceData();
    } else if (activeTab === 'revenue') {
      loadRevenueData();
    } else if (activeTab === 'packages') {
      loadPackageData();
    }
  }, [activeTab, period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'created': return 'bg-yellow-100 text-yellow-800';
      case 'dropped_off': return 'bg-orange-100 text-orange-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'origin_depot': return 'bg-indigo-100 text-indigo-800';
      case 'destination_depot': return 'bg-cyan-100 text-cyan-800';
      case 'out_for_delivery': return 'bg-pink-100 text-pink-800';
      case 'exception': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            <p className="text-gray-600">Business intelligence and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Period:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            {loading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', desc: 'Key Metrics' },
              { id: 'revenue', name: 'Revenue', desc: 'Financial Analytics' },
              { id: 'packages', name: 'Packages', desc: 'Shipment Analytics' },
              { id: 'performance', name: 'Performance', desc: 'KPIs & Efficiency' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <div className="text-xs text-gray-400">{tab.desc}</div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && overviewData && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(overviewData.users.total_users)}
                  </p>
                  <p className="text-xs text-green-600">
                    {overviewData.users.active_users} active
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(overviewData.packages.total_revenue)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Avg: {formatCurrency(overviewData.packages.avg_package_value)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">📦</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Packages</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(overviewData.packages.total_packages)}
                  </p>
                  <p className="text-xs text-green-600">
                    {overviewData.packages.delivered_packages} delivered
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-semibold">⚡</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewData.metrics.delivery_success_rate}%
                  </p>
                  <p className="text-xs text-gray-600">
                    Avg distance: {overviewData.metrics.avg_delivery_distance} mi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          {performanceData && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {performanceData.on_time_delivery_rate}%
                  </div>
                  <div className="text-sm text-gray-500">On-Time Delivery Rate</div>
                  <div className="text-xs text-gray-400">
                    {formatNumber(performanceData.on_time_deliveries)} / {formatNumber(performanceData.total_deliveries)} deliveries
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {performanceData.avg_delivery_time_days}
                  </div>
                  <div className="text-sm text-gray-500">Avg Delivery Time (days)</div>
                  <div className="text-xs text-gray-400">
                    {performanceData.avg_shipment_distance} mi avg distance
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {performanceData.exception_rate}%
                  </div>
                  <div className="text-sm text-gray-500">Exception Rate</div>
                  <div className="text-xs text-gray-400">
                    {formatNumber(performanceData.exception_count)} exceptions
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && revenueData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Package Size */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Package Size</h3>
              <div className="space-y-3">
                {revenueData.revenue_by_size.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="capitalize font-medium text-gray-700">
                        {item.package_size}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({item.package_count} packages)
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Speed Option */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Speed Option</h3>
              <div className="space-y-3">
                {revenueData.revenue_by_speed.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="capitalize font-medium text-gray-700">
                        {item.speed_option}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({item.package_count} packages)
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Daily Revenue */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue (Last {period} days)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Packages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {revenueData.daily_revenue.slice(0, 10).map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(day.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(day.package_count)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(day.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Packages Tab */}
      {activeTab === 'packages' && packageData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Status Distribution</h3>
              <div className="space-y-3">
                {packageData.status_distribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Number(item.percentage).toFixed(1)}%
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(item.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Metrics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
              <div className="space-y-3">
                {packageData.delivery_metrics.map((item, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="capitalize font-medium text-gray-700">
                        {item.speed_option}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.avg_delivery_days ? Number(item.avg_delivery_days).toFixed(1) : 'N/A'} days
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.delivered_count} / {item.total_packages} delivered
                      ({item.total_packages > 0 ? ((item.delivered_count / item.total_packages) * 100).toFixed(1) : '0'}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Routes */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Routes (Last {period} days)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {packageData.top_routes.map((route, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {route.origin_state} → {route.destination_state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(route.package_count)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(route.total_revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && performanceData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {performanceData.on_time_delivery_rate}%
              </div>
              <div className="text-sm font-medium text-gray-700">On-Time Delivery</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatNumber(performanceData.on_time_deliveries)} / {formatNumber(performanceData.total_deliveries)}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {performanceData.avg_delivery_time_days}
              </div>
              <div className="text-sm font-medium text-gray-700">Avg Delivery Days</div>
              <div className="text-xs text-gray-500 mt-1">
                {performanceData.avg_shipment_distance} mi avg distance
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {performanceData.exception_rate}%
              </div>
              <div className="text-sm font-medium text-gray-700">Exception Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatNumber(performanceData.exception_count)} exceptions
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatNumber(performanceData.total_deliveries)}
              </div>
              <div className="text-sm font-medium text-gray-700">Total Deliveries</div>
              <div className="text-xs text-gray-500 mt-1">
                Last 90 days
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                <strong>Delivery Performance:</strong> Your logistics network is achieving a{' '}
                <span className="text-green-600 font-semibold">{performanceData.on_time_delivery_rate}%</span>{' '}
                on-time delivery rate with an average delivery time of{' '}
                <span className="text-blue-600 font-semibold">{performanceData.avg_delivery_time_days} days</span>.
              </p>
              
              <p className="mb-4">
                <strong>Exception Handling:</strong> The current exception rate is{' '}
                <span className="text-red-600 font-semibold">{performanceData.exception_rate}%</span>, 
                with {formatNumber(performanceData.exception_count)} packages experiencing delivery issues.
              </p>
              
              <p>
                <strong>Network Efficiency:</strong> Packages travel an average distance of{' '}
                <span className="text-purple-600 font-semibold">{performanceData.avg_shipment_distance} miles</span>{' '}
                across your logistics network.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 
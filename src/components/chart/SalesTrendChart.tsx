import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
} from 'recharts';
import { useUsers } from '../../hooks/useUsers';
import { usePosts } from '../../hooks/usePosts';
import { useExchangeRates } from '../../hooks/useExchangeRate';
import {
  generateSalesTimeline,
  convertSalesToMultipleCurrencies,
  generateWeeklySalesData,
} from '../../utils/salesDataTransformer';

type ChartType = 'revenue' | 'orders' | 'customers' | 'aov' | 'currency' | 'combined';
type TimeFrame = 'daily' | 'weekly';

const SalesTrendChart: React.FC = () => {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: exchangeRates, isLoading: ratesLoading } = useExchangeRates();
  
  const [chartType, setChartType] = useState<ChartType>('revenue');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  const isLoading = usersLoading || postsLoading || ratesLoading;

  const salesData = useMemo(() => {
    if (!users || !posts) return [];
    
    const dailyData = generateSalesTimeline(posts, users);
    return timeFrame === 'weekly' ? generateWeeklySalesData(dailyData) : dailyData;
  }, [users, posts, timeFrame]);

  const currencyData = useMemo(() => {
    if (!salesData.length) return [];
    return convertSalesToMultipleCurrencies(salesData, exchangeRates);
  }, [salesData, exchangeRates]);

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return timeFrame === 'weekly' 
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {
                entry.name.includes('revenue') || entry.name.includes('Revenue')
                  ? formatCurrency(entry.value, selectedCurrency)
                  : entry.value.toLocaleString()
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    const commonProps = {
      width: '100%',
      height: 400,
      data: chartType === 'currency' ? currencyData : salesData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'revenue':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis tickFormatter={(value) => formatCurrency(value, selectedCurrency)} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'orders':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                strokeWidth={3}
                name="Orders"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'customers':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#F59E0B"
                strokeWidth={3}
                name="Customers"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'aov':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis tickFormatter={(value) => formatCurrency(value, selectedCurrency)} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="averageOrderValue"
                stroke="#8B5CF6"
                strokeWidth={3}
                name="Average Order Value"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'currency':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={currencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenueUSD"
                stroke="#3B82F6"
                name="Revenue (USD)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="revenueEUR"
                stroke="#10B981"
                name="Revenue (EUR)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="revenueGBP"
                stroke="#F59E0B"
                name="Revenue (GBP)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="revenueJPY"
                stroke="#EF4444"
                name="Revenue (JPY)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'combined':
        return (
          <ResponsiveContainer {...commonProps}>
            <ComposedChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value, selectedCurrency)} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                fill="#3B82F6"
                fillOpacity={0.3}
                stroke="#3B82F6"
                name="Revenue"
              />
              <Bar yAxisId="right" dataKey="orders" fill="#10B981" name="Orders" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="customers"
                stroke="#F59E0B"
                strokeWidth={3}
                name="Customers"
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    const titles = {
      revenue: 'Sales Revenue Trend',
      orders: 'Order Volume Trend',
      customers: 'Customer Acquisition Trend',
      aov: 'Average Order Value Trend',
      currency: 'Multi-Currency Revenue Comparison',
      combined: 'Combined Sales Metrics',
    };
    return titles[chartType];
  };

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{getChartTitle()}</h2>
        <p className="text-gray-600">Track sales performance over time with multiple metrics</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Chart Type:</span>
          {[
            { key: 'revenue', label: 'Revenue' },
            { key: 'orders', label: 'Orders' },
            { key: 'customers', label: 'Customers' },
            { key: 'aov', label: 'AOV' },
            { key: 'currency', label: 'Currency' },
            { key: 'combined', label: 'Combined' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setChartType(key as ChartType)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                chartType === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Time Frame:</span>
          {[
            { key: 'daily', label: 'Daily' },
            { key: 'weekly', label: 'Weekly' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeFrame(key as TimeFrame)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeFrame === key
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {chartType !== 'currency' && (
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Currency:</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-3 py-1 rounded border border-gray-300 text-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="mb-6">
        {renderChart()}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(totalRevenue, selectedCurrency)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-xl font-bold text-green-600">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Average Order Value</p>
          <p className="text-xl font-bold text-purple-600">
            {formatCurrency(avgOrderValue, selectedCurrency)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Time Period</p>
          <p className="text-xl font-bold text-orange-600">{timeFrame === 'daily' ? '30 Days' : '4 Weeks'}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesTrendChart;
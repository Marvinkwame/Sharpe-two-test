import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { usePosts } from '../hooks/usePosts';
// import CustomerSegmentationChart from './CustomerSegmentationChart';
import {
  segmentByEmailDomain,
  segmentByCity,
  segmentByCompany,
  segmentByEngagement,
} from '../utils/customerSegmentation';
import CustomerSegmentationChart from '../components/chart/CustomerSegmentationChart';

const Cus: React.FC = () => {
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts();
  const [selectedSegmentation, setSelectedSegmentation] = useState<'domain' | 'city' | 'company' | 'engagement'>('domain');

  const isLoading = usersLoading || postsLoading;
  const error = usersError || postsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-600">Unable to load customer data. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!users || !posts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const getSegmentationData = () => {
    switch (selectedSegmentation) {
      case 'domain':
        return segmentByEmailDomain(users);
      case 'city':
        return segmentByCity(users);
      case 'company':
        return segmentByCompany(users);
      case 'engagement':
        return segmentByEngagement(users, posts);
      default:
        return segmentByEmailDomain(users);
    }
  };

  const getChartTitle = () => {
    switch (selectedSegmentation) {
      case 'domain':
        return 'Customer Distribution by Email Domain';
      case 'city':
        return 'Customer Distribution by City';
      case 'company':
        return 'Customer Distribution by Company';
      case 'engagement':
        return 'Customer Distribution by Engagement Level';
      default:
        return 'Customer Distribution';
    }
  };

  const segmentationData = getSegmentationData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Segmentation</h1>
          <p className="text-gray-600">
            Analyze customer distribution across different segments to gain insights into user behavior.
          </p>
        </div>

        {/* Segmentation Controls */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Segmentation Options</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'domain', label: 'Email Domain' },
              { key: 'city', label: 'City' },
              { key: 'company', label: 'Company' },
              { key: 'engagement', label: 'Engagement Level' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedSegmentation(key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSegmentation === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="xl:col-span-2">
            <CustomerSegmentationChart
              data={segmentationData}
              title={getChartTitle()}
              height={400}
            />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Customers</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Posts</h3>
            <p className="text-3xl font-bold text-green-600">{posts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Segments</h3>
            <p className="text-3xl font-bold text-purple-600">{segmentationData.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Avg per Segment</h3>
            <p className="text-3xl font-bold text-orange-600">
              {segmentationData.length > 0 ? Math.round(users.length / segmentationData.length) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cus;
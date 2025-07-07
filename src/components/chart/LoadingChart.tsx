import React from 'react';

const LoadingChart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-1/3"></div>
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
};

export default LoadingChart;
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorChartProps {
  message: string;
  onRetry?: () => void;
}

const ErrorChart: React.FC<ErrorChartProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center justify-center h-96">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Chart
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorChart;
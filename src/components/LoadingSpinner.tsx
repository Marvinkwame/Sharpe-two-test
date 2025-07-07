import { memo } from "react";

const LoadingSpinner: React.FC = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">Loading...</p>
    </div>
  </div>
));

export default LoadingSpinner
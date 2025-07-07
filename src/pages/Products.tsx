import React from 'react';
import { useProductPerformance } from '../hooks/useProductPerformance';
import LoadingChart from '../components/chart/LoadingChart';
import ErrorChart from '../components/chart/ErrorChart';
import ProductSalesChart from '../components/chart/ProductSalesChart';
import CategoryRevenueChart from '../components/chart/CategoryRevenueChart';
import ProductStockChart from '../components/chart/ProdcutStockChart';
// import ProductSalesChart from './charts/ProductSalesChart';
// import CategoryRevenueChart from './charts/CategoryRevenueChart';
// import ProductStockChart from './charts/ProductStockChart';
// import LoadingChart from './charts/LoadingChart';
// import ErrorChart from './charts/ErrorChart';

const Products: React.FC = () => {
  const { 
    topPerformers, 
    categoryPerformance, 
    productData, 
    isLoading, 
    error 
  } = useProductPerformance();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingChart />
        <LoadingChart />
        <LoadingChart />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorChart
          message="Failed to load product performance data. Please try again later." 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Product Performance Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Analyze your product sales, revenue, and inventory levels
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="xl:col-span-2">
          <ProductSalesChart products={topPerformers} />
        </div>
        
        <CategoryRevenueChart categories={categoryPerformance} />
        
        <ProductStockChart products={productData} />
      </div>
    </div>
  );
};

export default Products;
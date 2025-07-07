import React from 'react';
import CustomBarChart from './CustomBarChart';
import { ProductPerformance } from '../../types/product';

interface ProductStockChartProps {
  products: ProductPerformance[];
}

const ProductStockChart: React.FC<ProductStockChartProps> = ({ products }) => {
  const lowStockProducts = products
    .filter(product => product.stock < 30)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 10);

  const chartData = lowStockProducts.map(product => ({
    name: product.name,
    value: product.stock,
    color: product.stock < 15 ? '#EF4444' : product.stock < 25 ? '#F59E0B' : '#10B981'
  }));

  const colors = chartData.map(item => item.color);

  return (
    <CustomBarChart
      data={chartData}
      title="Low Stock Alert - Products Requiring Attention"
      dataKey="value"
      xAxisKey="name"
      colors={colors}
      formatValue={(value) => `${value} units`}
    />
  );
};

export default ProductStockChart;
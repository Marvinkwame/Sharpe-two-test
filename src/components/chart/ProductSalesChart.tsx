import React from 'react';
import CustomBarChart from './CustomBarChart';
import { ProductPerformance, ChartData } from '../../types/product';

interface ProductSalesChartProps {
  products: ProductPerformance[];
}

const ProductSalesChart: React.FC<ProductSalesChartProps> = ({ products }) => {
  const chartData: ChartData[] = products.map(product => ({
    name: product.name,
    value: product.sales,
    category: product.category
  }));

  return (
    <CustomBarChart
      data={chartData}
      title="Top 10 Products by Sales Volume"
      dataKey="value"
      xAxisKey="name"
      color="#3B82F6"
      formatValue={(value) => `${value.toLocaleString()} units`}
    />
  );
};

export default ProductSalesChart;
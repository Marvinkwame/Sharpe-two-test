import React from 'react';
import CustomBarChart from './CustomBarChart';

interface CategoryData {
  name: string;
  sales: number;
  revenue: number;
  averageRating: number;
}

interface CategoryRevenueChartProps {
  categories: CategoryData[];
}

const CategoryRevenueChart: React.FC<CategoryRevenueChartProps> = ({ categories }) => {
  const chartData = categories.map(category => ({
    name: category.name,
    value: category.revenue
  }));

  const colors = [
    '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316',
    '#06B6D4', '#84CC16', '#EC4899', '#6B7280', '#3B82F6'
  ];

  return (
    <CustomBarChart
      data={chartData}
      title="Revenue by Category"
      dataKey="value"
      xAxisKey="name"
      colors={colors}
      formatValue={(value) => `$${(value / 1000).toFixed(1)}k`}
    />
  );
};

export default CategoryRevenueChart;
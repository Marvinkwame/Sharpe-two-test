import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CustomerSegment } from '../utils/customerSegmentation';

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#6366F1', // Indigo
];

interface CustomerSegmentationChartProps {
  data: CustomerSegment[];
  title: string;
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload[0].payload.total || 0;
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-600">
          Count: <span className="font-medium text-blue-600">{data.value}</span>
        </p>
        <p className="text-sm text-gray-600">
          Percentage: <span className="font-medium text-green-600">{percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomerSegmentationChart: React.FC<CustomerSegmentationChartProps> = ({ 
  data, 
  title, 
  height = 300 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={height * 0.35}
              fill="#8884d8"
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {dataWithTotal.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Total Customers: <span className="font-semibold text-blue-600">{total}</span>
        </p>
      </div>
    </div>
  );
};

export default CustomerSegmentationChart
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CustomerSegment } from '../../types/comment';

// Enhanced color palette with better contrast and accessibility
const COLORS = [
  '#2563eb', // Blue
  '#059669', // Emerald
  '#dc2626', // Red
  '#7c2d12', // Orange
  '#7c3aed', // Purple
  '#0891b2', // Cyan
  '#ea580c', // Orange
  '#be185d', // Pink
  '#065f46', // Green
  '#1e40af', // Blue
];

interface CustomerPieChartProps {
  data: CustomerSegment[];
  title: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-600">
          Count: <span className="font-medium">{data.value}</span>
        </p>
        <p className="text-sm text-gray-600">
          Percentage: <span className="font-medium">{((data.value / data.total) * 100).toFixed(1)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomerPieChart: React.FC<CustomerPieChartProps> = ({ data, title }) => {
  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  // Custom label function with better formatting
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is > 5% to avoid overcrowding
    if (percent > 0.05) {
      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="text-sm font-semibold"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <h2 className="text-xl font-bold text-white text-center">{title}</h2>
        <p className="text-blue-100 text-center text-sm mt-1">
          Total entries: {total}
        </p>
      </div>
      
      <div className="p-6">
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithTotal}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                stroke="#fff"
                strokeWidth={2}
              >
                {dataWithTotal.map((_, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CustomerPieChart;
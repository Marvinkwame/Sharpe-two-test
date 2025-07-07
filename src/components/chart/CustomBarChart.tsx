import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartData } from '../../types/product';

interface CustomBarChartProps {
  data: ChartData[];
  title: string;
  dataKey: string;
  xAxisKey: string;
  color?: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  title,
  dataKey,
  xAxisKey,
  color = '#3B82F6',
  colors,
  height = 400,
  showLegend = true,
  formatValue
}) => {
 
  const formatTooltipValue = (value: number) => {
    if (formatValue) return formatValue(value);
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
            className="text-gray-600 dark:text-gray-300"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-gray-600 dark:text-gray-300"
            tickFormatter={formatTooltipValue}
          />
          <Tooltip
formatter={(value: number, name: string) => [formatTooltipValue(value), name]}
            labelFormatter={(label) => `Product: ${label}`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          {showLegend && <Legend />}
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors ? colors[index % colors.length] : color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
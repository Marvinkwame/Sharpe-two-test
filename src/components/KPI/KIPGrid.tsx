// src/components/dashboard/KPICards/KPIGrid.tsx
import React from 'react';
// import { KPICard } from './KPICard';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { KPICard } from './KPICard';

const kpiData = [
  {
    title: 'Total Revenue',
    value: '$45,231',
    change: 12.5,
    changeType: 'increase' as const,
    icon: CurrencyDollarIcon,
    color: 'blue' as const,
  },
  {
    title: 'Orders',
    value: '1,234',
    change: 8.2,
    changeType: 'increase' as const,
    icon: ShoppingCartIcon,
    color: 'green' as const,
  },
  {
    title: 'Customers',
    value: '892',
    change: -3.1,
    changeType: 'decrease' as const,
    icon: UsersIcon,
    color: 'purple' as const,
  },
  {
    title: 'Pending Orders',
    value: '43',
    change: 15.3,
    changeType: 'increase' as const,
    icon: TruckIcon,
    color: 'orange' as const,
  },
];

export const KPIGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          changeType={kpi.changeType}
          icon={kpi.icon}
          color={kpi.color}
        />
      ))}
    </div>
  );
};

export default KPIGrid;

import { Post, User } from '../types/user';
import { ExchangeRateType } from '../types/country';

export interface SalesTrendData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  averageOrderValue: number;
}

export interface CurrencyConvertedSales {
  date: string;
  revenueUSD: number;
  revenueEUR: number;
  revenueGBP: number;
  revenueJPY: number;
  orders: number;
}

export const generateSalesTimeline = (posts: Post[], users: User[]): SalesTrendData[] => {
  const today = new Date();
  const daysToGenerate = 30;
  const salesMap = new Map<string, SalesTrendData>();

  // Initialize all days with zero values
  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    salesMap.set(dateString, {
      date: dateString,
      revenue: 0,
      orders: 0,
      customers: 0,
      averageOrderValue: 0,
    });
  }

  // Distribute posts across the timeline
  posts.forEach((post, index) => {
    const dayIndex = Math.floor((index / posts.length) * daysToGenerate);
    const date = new Date(today);
    date.setDate(date.getDate() - dayIndex);
    const dateString = date.toISOString().split('T')[0];

    const existing = salesMap.get(dateString);
    if (existing) {
      // Simulate revenue based on post characteristics
      const baseRevenue = post.title.length * 10 + post.body.length * 2;
      const userMultiplier = users.find(u => u.id === post.userId)?.company ? 1.5 : 1;
      const revenue = baseRevenue * userMultiplier;

      existing.revenue += revenue;
      existing.orders += 1;
      existing.customers += 1;
      existing.averageOrderValue = existing.orders > 0 ? existing.revenue / existing.orders : 0;
    }
  });

  // Convert to array and sort by date
  return Array.from(salesMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const convertSalesToMultipleCurrencies = (
  salesData: SalesTrendData[],
  exchangeRates?: ExchangeRateType
): CurrencyConvertedSales[] => {
  if (!exchangeRates) {
    return salesData.map(sale => ({
      date: sale.date,
      revenueUSD: sale.revenue,
      revenueEUR: sale.revenue * 0.85, // Fallback rates
      revenueGBP: sale.revenue * 0.73,
      revenueJPY: sale.revenue * 110,
      orders: sale.orders,
    }));
  }

  return salesData.map(sale => ({
    date: sale.date,
    revenueUSD: sale.revenue,
    revenueEUR: sale.revenue * (exchangeRates.rates?.EUR || 0.85),
    revenueGBP: sale.revenue * (exchangeRates.rates?.GBP || 0.73),
    revenueJPY: sale.revenue * (exchangeRates.rates?.JPY || 110),
    orders: sale.orders,
  }));
};

export const generateWeeklySalesData = (dailyData: SalesTrendData[]): SalesTrendData[] => {
  const weeklyData: SalesTrendData[] = [];
  
  for (let i = 0; i < dailyData.length; i += 7) {
    const weekData = dailyData.slice(i, i + 7);
    const weekStart = weekData[0]?.date;
    
    if (weekStart) {
      const weekSummary: SalesTrendData = {
        date: weekStart,
        revenue: weekData.reduce((sum, day) => sum + day.revenue, 0),
        orders: weekData.reduce((sum, day) => sum + day.orders, 0),
        customers: weekData.reduce((sum, day) => sum + day.customers, 0),
        averageOrderValue: 0,
      };
      
      weekSummary.averageOrderValue = weekSummary.orders > 0 
        ? weekSummary.revenue / weekSummary.orders 
        : 0;
      
      weeklyData.push(weekSummary);
    }
  }
  
  return weeklyData.reverse();
};
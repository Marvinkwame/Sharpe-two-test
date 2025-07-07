export interface ProductPerformance {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  rating: number;
  stock: number;
  userId: number;
}

export interface ChartData {
  name: string;
  value: number;
  category?: string;
  color?: string;
}
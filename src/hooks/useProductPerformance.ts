import { useMemo } from 'react';
import { usePosts } from './usePosts';
import { ProductPerformance } from '../types/product';

export const useProductPerformance = () => {
  const { data: posts, isLoading, error } = usePosts();

  const productData = useMemo((): ProductPerformance[] => {
    if (!posts) return [];

    return posts.map(post => ({
      id: post.id,
      name: post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title,
      category: `Category ${post.userId}`,
      sales: Math.floor(Math.random() * 1000) + 100,
      revenue: Math.floor(Math.random() * 10000) + 1000,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      stock: Math.floor(Math.random() * 100) + 10,
      userId: post.userId
    }));
  }, [posts]);

  const topPerformers = useMemo(() => {
    return productData
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }, [productData]);

  const categoryPerformance = useMemo(() => {
    const categoryMap = new Map<string, { sales: number; revenue: number; count: number }>();
    
    productData.forEach(product => {
      const existing = categoryMap.get(product.category) || { sales: 0, revenue: 0, count: 0 };
      categoryMap.set(product.category, {
        sales: existing.sales + product.sales,
        revenue: existing.revenue + product.revenue,
        count: existing.count + 1
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      name: category,
      sales: data.sales,
      revenue: data.revenue,
      averageRating: Number((data.sales / data.count).toFixed(1))
    }));
  }, [productData]);

  return {
    productData,
    topPerformers,
    categoryPerformance,
    isLoading,
    error
  };
};
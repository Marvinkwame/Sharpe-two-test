import { User, Post } from "../types/user";
import { Country } from "../types/country";

export const transformUserToCustomer = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  company: user.company.name,
  location: {
    city: user.address.city,
    country: "Unknown", // Would need to map from address
    coordinates: {
      lat: parseFloat(user.address.geo.lat),
      lng: parseFloat(user.address.geo.lng),
    },
  },
  phone: user.phone,
  website: user.website,
  totalOrders: 0, // Would be calculated from orders
  totalSpent: 0, // Would be calculated from orders
  registrationDate: new Date().toISOString(), // Mock data
  status: "active" as const,
});

export const transformPostToOrder = (post: Post, user: User) => ({
  id: post.id,
  customerId: post.userId,
  customerName: user.name,
  customerEmail: user.email,
  date: new Date().toISOString(),
  total: Math.floor(Math.random() * 1000) + 50, // Mock total
  status: (["pending", "processing", "shipped", "delivered"] as const)[
    Math.floor(Math.random() * 4)
  ],
  items: Math.floor(Math.random() * 5) + 1,
  description: post.title,
});

export const transformCountryData = (country: Country) => ({
  name: country.name.common,
  officialName: country.name.official,
  code: country.cca2,
  region: country.region,
  subregion: country.subregion,
  population: country.population,
  area: country.area,
  capital: country.capital?.[0] || "N/A",
  currencies: Object.entries(country.currencies || {}).map(
    ([code, currency]) => ({
      code,
      name: currency.name,
      symbol: currency.symbol,
    })
  ),
  languages: Object.values(country.languages || {}),
  flag: country.flags?.svg || country.flag,
});

export const generateMockSalesData = (days: number = 30) => {
  const data = [];
  const baseDate = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      sales: Math.floor(Math.random() * 10000) + 5000,
      orders: Math.floor(Math.random() * 200) + 50,
      revenue: Math.floor(Math.random() * 50000) + 25000,
    });
  }

  return data;
};

export const aggregateDataByPeriod = <T>(data: T[]): T[] => {
  // Implementation would depend on specific aggregation needs
  return data;
};

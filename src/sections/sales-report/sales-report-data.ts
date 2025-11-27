// ----------------------------------------------------------------------
// Sales Report Mock Data
// TypeScript interfaces and mock data for the Sales Report dashboard
// ----------------------------------------------------------------------

// Types for stat cards (Total Sales, Total Orders, Visitor, Total Sold Products)
export interface StatCardData {
  id: string;
  title: string;
  value: number;
  percentChange: number;
  description: string;
  icon: 'sales' | 'orders' | 'visitor' | 'products';
  color: 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'info';
}

// Types for Product Statistic section
export interface ProductCategoryData {
  id: string;
  name: string;
  value: number;
  percentChange: number;
  icon: 'mdi:television' | 'mdi:gamepad-variant' | 'mdi:sofa';
}

export interface ProductStatisticData {
  totalSales: number;
  percentChange: number;
  categories: ProductCategoryData[];
}

// Types for Customer Habits chart
export interface CustomerHabitsMonthlyData {
  month: string;
  seenProduct: number;
  sales: number;
}

export interface CustomerHabitsSummary {
  seenProductTotal: number;
  salesTotal: number;
}

// Types for Customer Growth section
export interface CountryGrowthData {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface CustomerGrowthData {
  countries: CountryGrowthData[];
  total: number;
}

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

export const statCardsData: StatCardData[] = [
  {
    id: '1',
    title: 'Total Sales',
    value: 612917,
    percentChange: 2.09,
    description: 'Products vs last month',
    icon: 'sales',
    color: 'primary',
  },
  {
    id: '2',
    title: 'Total Orders',
    value: 34760,
    percentChange: 2.4,
    description: 'Orders vs last month',
    icon: 'orders',
    color: 'info',
  },
  {
    id: '3',
    title: 'Visitor',
    value: 14987,
    percentChange: -2.09,
    description: 'Users vs last month',
    icon: 'visitor',
    color: 'warning',
  },
  {
    id: '4',
    title: 'Total Sold Products',
    value: 12987,
    percentChange: 12.1,
    description: 'Products vs last month',
    icon: 'products',
    color: 'success',
  },
];

export const productStatisticData: ProductStatisticData = {
  totalSales: 9829,
  percentChange: 5.34,
  categories: [
    {
      id: '1',
      name: 'Electronic',
      value: 2487,
      percentChange: 1.8,
      icon: 'mdi:television',
    },
    {
      id: '2',
      name: 'Games',
      value: 1828,
      percentChange: -2.3,
      icon: 'mdi:gamepad-variant',
    },
    {
      id: '3',
      name: 'Furniture',
      value: 1463,
      percentChange: -1.04,
      icon: 'mdi:sofa',
    },
  ],
};

export const customerHabitsData: CustomerHabitsMonthlyData[] = [
  { month: 'Jan', seenProduct: 10000, sales: 8000 },
  { month: 'Feb', seenProduct: 15000, sales: 12000 },
  { month: 'Mar', seenProduct: 30000, sales: 25000 },
  { month: 'Apr', seenProduct: 42000, sales: 38000 },
  { month: 'May', seenProduct: 50000, sales: 40000 },
  { month: 'Jun', seenProduct: 55000, sales: 42000 },
  { month: 'Jul', seenProduct: 45000, sales: 40000 },
];

export const customerHabitsSummary: CustomerHabitsSummary = {
  seenProductTotal: 43787,
  salesTotal: 39784,
};

export const customerGrowthData: CustomerGrowthData = {
  countries: [
    { id: '1', name: 'United States', value: 287, color: '#5C6BC0' },
    { id: '2', name: 'Germany', value: 2417, color: '#42A5F5' },
    { id: '3', name: 'Australia', value: 2281, color: '#9575CD' },
    { id: '4', name: 'France', value: 812, color: '#7986CB' },
  ],
  total: 5797,
};

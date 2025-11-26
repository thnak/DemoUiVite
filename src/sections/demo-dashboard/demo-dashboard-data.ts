// ----------------------------------------------------------------------
// Demo Dashboard Mock Data
// TypeScript interfaces and mock data for the E-commerce Dashboard demo
// ----------------------------------------------------------------------

// Types for metric cards
export interface MetricData {
  id: string;
  title: string;
  value: number;
  percentChange: number;
  sparklineData: number[];
  color: 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'info';
  icon: string;
}

// Types for sale by gender chart
export interface GenderSalesData {
  label: string;
  value: number;
  color: string;
}

// Types for yearly sales chart
export interface MonthlySalesData {
  month: string;
  income: number;
  expenses: number;
}

// Types for sales overview
export interface SalesOverviewItem {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  color: 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'info';
}

// Types for current balance
export interface BalanceData {
  currentBalance: number;
  currency: string;
}

// Types for salesman
export interface Salesman {
  id: string;
  name: string;
  avatarUrl: string;
  product: string;
  country: string;
  countryCode: string;
  total: number;
  rank: number;
}

// Types for product
export interface DemoProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  salePrice: number | null;
  colors: string[];
  isNew?: boolean;
  isSale?: boolean;
}

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

export const metricCardsData: MetricData[] = [
  {
    id: '1',
    title: 'Product sold',
    value: 765,
    percentChange: 2.6,
    sparklineData: [22, 8, 35, 50, 82, 84, 77, 12, 35, 48],
    color: 'primary',
    icon: '/assets/icons/glass/ic-glass-bag.svg',
  },
  {
    id: '2',
    title: 'Total balance',
    value: 18765,
    percentChange: -0.1,
    sparklineData: [56, 47, 40, 62, 73, 30, 23, 54, 67, 40],
    color: 'warning',
    icon: '/assets/icons/glass/ic-glass-buy.svg',
  },
  {
    id: '3',
    title: 'Sales profit',
    value: 4876,
    percentChange: 0.6,
    sparklineData: [40, 70, 50, 28, 70, 75, 7, 64, 38, 52],
    color: 'success',
    icon: '/assets/icons/glass/ic-glass-message.svg',
  },
];

export const genderSalesData: GenderSalesData[] = [
  { label: 'Men', value: 44, color: '#1877F2' },
  { label: 'Women', value: 75, color: '#EB4132' },
  { label: 'Other', value: 25, color: '#FFC107' },
];

export const yearlySalesData: MonthlySalesData[] = [
  { month: 'Jan', income: 10, expenses: 8 },
  { month: 'Feb', income: 41, expenses: 40 },
  { month: 'Mar', income: 35, expenses: 28 },
  { month: 'Apr', income: 151, expenses: 90 },
  { month: 'May', income: 49, expenses: 55 },
  { month: 'Jun', income: 62, expenses: 58 },
  { month: 'Jul', income: 69, expenses: 55 },
  { month: 'Aug', income: 91, expenses: 80 },
  { month: 'Sep', income: 148, expenses: 58 },
  { month: 'Oct', income: 38, expenses: 100 },
  { month: 'Nov', income: 80, expenses: 88 },
  { month: 'Dec', income: 100, expenses: 120 },
];

export const salesOverviewData: SalesOverviewItem[] = [
  { id: '1', label: 'Total profit', value: 18765, maxValue: 25000, color: 'primary' },
  { id: '2', label: 'Total income', value: 8765, maxValue: 20000, color: 'warning' },
  { id: '3', label: 'Total expenses', value: 6785, maxValue: 15000, color: 'error' },
];

export const currentBalanceData: BalanceData = {
  currentBalance: 187650,
  currency: 'USD',
};

export const bestSalesmenData: Salesman[] = [
  {
    id: '1',
    name: 'Jayvion Simon',
    avatarUrl: '/assets/images/avatar/avatar-1.webp',
    product: 'CAP',
    country: 'Germany',
    countryCode: 'DE',
    total: 83740,
    rank: 1,
  },
  {
    id: '2',
    name: 'Lucian Obrien',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    product: 'Branded shoes',
    country: 'England',
    countryCode: 'GB',
    total: 72800,
    rank: 2,
  },
  {
    id: '3',
    name: 'Deja Brady',
    avatarUrl: '/assets/images/avatar/avatar-3.webp',
    product: 'Headphone',
    country: 'France',
    countryCode: 'FR',
    total: 52450,
    rank: 3,
  },
  {
    id: '4',
    name: 'Harrison Stein',
    avatarUrl: '/assets/images/avatar/avatar-4.webp',
    product: 'Cell phone',
    country: 'South Korea',
    countryCode: 'KR',
    total: 44120,
    rank: 4,
  },
  {
    id: '5',
    name: 'Reece Chung',
    avatarUrl: '/assets/images/avatar/avatar-5.webp',
    product: 'Earbuds',
    country: 'United States',
    countryCode: 'US',
    total: 35890,
    rank: 5,
  },
];

export const latestProductsData: DemoProduct[] = [
  {
    id: '1',
    name: 'Nike Air Force 1 NDESTRUKT',
    imageUrl: '/assets/images/product/product-1.webp',
    price: 83.74,
    salePrice: null,
    colors: ['#00AB55', '#000000', '#FFFFFF'],
    isNew: true,
  },
  {
    id: '2',
    name: 'Nike Space Hippie 04',
    imageUrl: '/assets/images/product/product-2.webp',
    price: 97.14,
    salePrice: 83.74,
    colors: ['#000000', '#FFFFFF'],
    isSale: true,
  },
  {
    id: '3',
    name: 'Nike Air Zoom Pegasus 37 A.I.R. Chaz Bear',
    imageUrl: '/assets/images/product/product-3.webp',
    price: 68.71,
    salePrice: null,
    colors: ['#FFFFFF', '#FFC0CB'],
  },
  {
    id: '4',
    name: 'Nike Blazer Low 77 Vintage',
    imageUrl: '/assets/images/product/product-4.webp',
    price: 52.17,
    salePrice: null,
    colors: ['#FFC0CB', '#FF4842', '#1890FF'],
    isNew: true,
  },
  {
    id: '5',
    name: 'Nike ZoomX SuperRep Surge',
    imageUrl: '/assets/images/product/product-5.webp',
    price: 75.85,
    salePrice: 68.71,
    colors: ['#94D82D', '#FFC107'],
    isSale: true,
  },
];

import {
  _id,
  _price,
  _times,
  _email,
  _company,
  _boolean,
  _fullName,
  _taskNames,
  _createdAt,
  _areaNames,
  _postTitles,
  _description,
  _phoneNumber,
  _productNames,
  _machineNames,
  _publishStatus,
  _idealCycleTime,
  _stockQuantities,
  _areaDescriptions,
  _downtimeThreshold,
  _productCategories,
  _quantityPerSignal,
  _productGroupCodes,
  _productGroupNames,
  _productGroupDescriptions,
} from './_mock';

// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatar/avatar-25.webp',
};

// ----------------------------------------------------------------------

export type UserStatus = 'active' | 'pending' | 'banned' | 'rejected';

const USER_STATUSES: UserStatus[] = ['active', 'pending', 'banned', 'rejected'];

export const _users = [...Array(20)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index),
  email: _email(index),
  phoneNumber: _phoneNumber(index),
  company: _company(index),
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  status: USER_STATUSES[index % 4] as UserStatus,
  role:
    [
      'Content Creator',
      'IT Administrator',
      'Financial Planner',
      'HR Recruiter',
      'Graphic Designer',
      'Project Manager',
      'Backend Developer',
      'Full Stack Designer',
      'Front End Developer',
      'Full Stack Developer',
    ][index % 10] || 'UI Designer',
}));

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: 8829,
  totalComments: 7977,
  totalShares: 8556,
  totalFavorites: 8870,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));

// ----------------------------------------------------------------------

const COLORS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

export type ProductStatus = 'published' | 'draft';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export const _products = [...Array(20)].map((_, index) => {
  const setIndex = index + 1;
  const stockQty = _stockQuantities(index);
  const stockStatus: StockStatus =
    stockQty === 0 ? 'out_of_stock' : stockQty <= 10 ? 'low_stock' : 'in_stock';

  return {
    id: _id(index),
    price: _price(index),
    name: _productNames(index),
    priceSale: setIndex % 3 ? null : _price(index),
    coverUrl: `/assets/images/product/product-${setIndex}.webp`,
    colors:
      (setIndex === 1 && COLORS.slice(0, 2)) ||
      (setIndex === 2 && COLORS.slice(1, 3)) ||
      (setIndex === 3 && COLORS.slice(2, 4)) ||
      (setIndex === 4 && COLORS.slice(3, 6)) ||
      (setIndex === 19 && COLORS.slice(4, 6)) ||
      (setIndex === 20 && COLORS.slice(5, 6)) ||
      COLORS,
    status:
      ([1, 3, 5].includes(setIndex) && 'sale') || ([4, 8, 12].includes(setIndex) && 'new') || '',
    // New fields for list view
    category: _productCategories(index),
    stock: stockQty,
    stockStatus,
    publish: _publishStatus(index),
    createdAt: _createdAt(index),
  };
});

// ----------------------------------------------------------------------

export const _areas = [...Array(20)].map((_, index) => ({
  id: _id(index),
  name: _areaNames(index),
  description: _areaDescriptions(index),
}));

export const _productGroups = [...Array(20)].map((_, index) => ({
  id: _id(index),
  code: _productGroupCodes(index),
  name: _productGroupNames(index),
  description: _productGroupDescriptions(index),
}));

// ----------------------------------------------------------------------

export const _langs = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg',
  },
  {
    value: 'vi',
    label: 'Tiếng Việt',
    icon: '/assets/icons/flags/ic-flag-vi.svg',
  },
];

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
  id: _id(index),
  title: [
    '1983, orders, $4220',
    '12 Invoices have been paid',
    'Order #37745 from September',
    'New order placed #XF-2356',
    'New order placed #XF-2346',
  ][index],
  type: `order${index + 1}`,
  time: _times(index),
}));

export const _traffic = [
  {
    value: 'facebook',
    label: 'Facebook',
    total: 19500,
  },
  {
    value: 'google',
    label: 'Google',
    total: 91200,
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    total: 69800,
  },
  {
    value: 'twitter',
    label: 'Twitter',
    total: 84900,
  },
];

export const _tasks = Array.from({ length: 5 }, (_, index) => ({
  id: _id(index),
  name: _taskNames(index),
}));

// ----------------------------------------------------------------------

export type StopType = 'Plan' | 'UnPlan';

const STOP_TYPES: StopType[] = ['Plan', 'UnPlan'];

const STOP_GROUPS = [
  'Mechanical',
  'Electrical',
  'Quality',
  'Material',
  'Changeover',
  'Maintenance',
  'Operator',
  'External',
];

const STOP_REASON_NAMES = [
  'Motor Overheating',
  'Belt Replacement',
  'Quality Inspection',
  'Material Shortage',
  'Product Changeover',
  'Scheduled Maintenance',
  'Operator Break',
  'Power Outage',
  'Sensor Malfunction',
  'Calibration',
  'Tool Change',
  'Safety Check',
  'Software Update',
  'Emergency Stop',
  'Cleaning',
  'Lubrication',
  'Alignment Adjustment',
  'Component Failure',
  'Training Session',
  'Shift Handover',
];

const STOP_REASON_DESCRIPTIONS = [
  'Machine stopped due to motor temperature exceeding safe limits',
  'Scheduled replacement of worn conveyor belt',
  'Quality control inspection of produced items',
  'Production halted due to insufficient raw materials',
  'Reconfiguration for different product specifications',
  'Regular preventive maintenance as per schedule',
  'Mandatory operator rest period',
  'Unplanned power supply interruption',
  'Malfunction detected in proximity sensor',
  'Periodic calibration of measuring instruments',
  'Replacement of worn cutting or forming tools',
  'Routine safety equipment verification',
  'Installation of software patches or updates',
  'Machine stopped due to emergency situation',
  'Cleaning of machine components and work area',
  'Application of lubricants to moving parts',
  'Adjustment of machine alignment parameters',
  'Unexpected failure of machine component',
  'Operator training on new procedures',
  'Handover briefing between shifts',
];

export const _stopMachineReasons = [...Array(20)].map((_, index) => ({
  id: _id(index),
  code: `SMR-${String(index + 1).padStart(3, '0')}`,
  name: STOP_REASON_NAMES[index % 20],
  stopGroup: STOP_GROUPS[index % 8],
  stopType: STOP_TYPES[index % 2] as StopType,
  description: STOP_REASON_DESCRIPTIONS[index % 20],
}));

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(1),
    title: 'Your order is placed',
    description: 'waiting for shipping',
    avatarUrl: null,
    type: 'order-placed',
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: _fullName(2),
    description: 'answered to your comment on the Minimal',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    type: 'friend-interactive',
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: 'You have new message',
    description: '5 unread messages',
    avatarUrl: null,
    type: 'chat-message',
    postedAt: _times(3),
    isUnRead: false,
  },
  {
    id: _id(4),
    title: 'You have new mail',
    description: 'sent from Guido Padberg',
    avatarUrl: null,
    type: 'mail',
    postedAt: _times(4),
    isUnRead: false,
  },
  {
    id: _id(5),
    title: 'Delivery processing',
    description: 'Your order is being shipped',
    avatarUrl: null,
    type: 'order-shipped',
    postedAt: _times(5),
    isUnRead: false,
  },
];

// ----------------------------------------------------------------------

export const _workingParameters = [...Array(20)].map((_, index) => ({
  id: _id(index),
  product: _productNames(index),
  machine: _machineNames(index),
  idealCycleTime: _idealCycleTime(index),
  quantityPerSignal: _quantityPerSignal(index),
  downtimeThreshold: _downtimeThreshold(index),
  }));

export type MachineInputType = 'WeightChannels' | 'PairChannel';

const MACHINE_INPUT_TYPES: MachineInputType[] = ['WeightChannels', 'PairChannel'];

// OEE Data Types
export type OEEData = {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
};

export type ProductOEEData = {
  id: string; // unique entry ID
  productId: string;
  productName: string;
  oeeData: OEEData;
  runTime: number; // in hours
};

export type DailyOEEData = {
  date: string;
  dayOfWeek: string;
  oeeData: OEEData;
  productData: ProductOEEData[];
};

export type MonthlyOEEData = {
  month: string;
  monthNumber: number;
  oeeData: OEEData;
  productData: ProductOEEData[];
  weeklyData: DailyOEEData[];
};

export type YearlyOEEData = {
  year: number;
  oeeData: OEEData;
  monthlyData: MonthlyOEEData[];
  bestProduct: ProductOEEData;
};

const MACHINE_AREAS = [
  'Production Line A',
  'Production Line B',
  'Warehouse Zone 1',
  'Warehouse Zone 2',
  'Assembly Area',
  'Quality Control',
  'Packaging Zone',
  'Storage Area',
];

const MACHINE_CALENDARS = [
  'Ultimate 7 Days Work',
  '6 Days with Break Times',
  'Standard 5 Days Work',
  '24/7 Continuous Operation',
  'Night Shift Schedule',
  'Weekend Maintenance',
];

const MACHINE_NAMES = [
  'CNC Milling Machine',
  'Industrial Robot Arm',
  'Conveyor Belt System',
  'Packaging Machine',
  'Quality Scanner',
  'Assembly Line Unit',
  'Welding Station',
  'Paint Sprayer',
  'Laser Cutter',
  'Press Machine',
  '3D Printer',
  'Injection Molder',
  'Sorting Machine',
  'Labeling Machine',
  'Palletizer',
  'Wrapping Machine',
  'Testing Equipment',
  'Inspection Camera',
  'Material Handler',
  'Storage Retrieval',
];

const MACHINE_CODES = [
  'MCH-001',
  'MCH-002',
  'MCH-003',
  'MCH-004',
  'MCH-005',
  'MCH-006',
  'MCH-007',
  'MCH-008',
  'MCH-009',
  'MCH-010',
  'MCH-011',
  'MCH-012',
  'MCH-013',
  'MCH-014',
  'MCH-015',
  'MCH-016',
  'MCH-017',
  'MCH-018',
  'MCH-019',
  'MCH-020',
];

export const _machines = [...Array(20)].map((_, index) => ({
  id: _id(index),
  code: MACHINE_CODES[index],
  name: MACHINE_NAMES[index],
  imageUrl: `/assets/images/product/product-${(index % 20) + 1}.webp`,
  area: MACHINE_AREAS[index % MACHINE_AREAS.length],
  inputType: MACHINE_INPUT_TYPES[index % 2] as MachineInputType,
  numberOfInputChannels: [4, 8, 12, 16, 24, 32][index % 6],
  workCalendar: MACHINE_CALENDARS[index % MACHINE_CALENDARS.length],
}));

// ----------------------------------------------------------------------
// OEE Data Generator Functions
// ----------------------------------------------------------------------

const PRODUCT_NAMES_FOR_OEE = [
  'Widget Alpha',
  'Component Beta',
  'Part Gamma',
  'Assembly Delta',
  'Module Epsilon',
  'Unit Zeta',
  'Device Eta',
  'Element Theta',
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Seed-based random number generator for consistent data
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate random OEE data within realistic ranges
function generateOEEData(seed: number): OEEData {
  const availability = 75 + seededRandom(seed) * 20; // 75-95%
  const performance = 70 + seededRandom(seed + 1) * 25; // 70-95%
  const quality = 85 + seededRandom(seed + 2) * 14; // 85-99%
  const oee = (availability * performance * quality) / 10000;
  
  return {
    availability: Math.round(availability * 10) / 10,
    performance: Math.round(performance * 10) / 10,
    quality: Math.round(quality * 10) / 10,
    oee: Math.round(oee * 10) / 10,
  };
}

// Generate product OEE data
function generateProductOEEData(seed: number, productCount: number): ProductOEEData[] {
  return [...Array(productCount)].map((_, index) => {
    const productSeed = seed + index * 100;
    return {
      id: `${seed}-${index}`, // unique entry ID based on seed and index
      productId: _id(index),
      productName: PRODUCT_NAMES_FOR_OEE[index % PRODUCT_NAMES_FOR_OEE.length],
      oeeData: generateOEEData(productSeed),
      runTime: Math.round((10 + seededRandom(productSeed) * 40) * 10) / 10,
    };
  });
}

// Generate daily OEE data for a week
function generateWeeklyData(seed: number, weekNumber: number): DailyOEEData[] {
  return DAYS_OF_WEEK.map((day, dayIndex) => {
    const daySeed = seed + weekNumber * 7 + dayIndex;
    const productCount = 2 + Math.floor(seededRandom(daySeed) * 3); // 2-4 products
    return {
      date: `Week ${weekNumber + 1}, ${day}`,
      dayOfWeek: day,
      oeeData: generateOEEData(daySeed),
      productData: generateProductOEEData(daySeed, productCount),
    };
  });
}

// Generate monthly OEE data
function generateMonthlyData(seed: number, year: number): MonthlyOEEData[] {
  return MONTHS.map((month, monthIndex) => {
    const monthSeed = seed + year * 12 + monthIndex;
    const productCount = 3 + Math.floor(seededRandom(monthSeed) * 4); // 3-6 products
    return {
      month,
      monthNumber: monthIndex + 1,
      oeeData: generateOEEData(monthSeed),
      productData: generateProductOEEData(monthSeed, productCount),
      weeklyData: generateWeeklyData(monthSeed, monthIndex),
    };
  });
}

// Find best product by OEE
function findBestProduct(products: ProductOEEData[]): ProductOEEData {
  return products.reduce((best, current) =>
    current.oeeData.oee > best.oeeData.oee ? current : best
  );
}

// Generate yearly OEE data for a machine
export function generateMachineOEEData(machineId: string, year: number): YearlyOEEData {
  // Create seed from machineId and year for consistency
  const seed = machineId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + year;
  
  const monthlyData = generateMonthlyData(seed, year);
  
  // Calculate yearly averages
  const yearlyOEE = {
    availability: Math.round(monthlyData.reduce((sum, m) => sum + m.oeeData.availability, 0) / 12 * 10) / 10,
    performance: Math.round(monthlyData.reduce((sum, m) => sum + m.oeeData.performance, 0) / 12 * 10) / 10,
    quality: Math.round(monthlyData.reduce((sum, m) => sum + m.oeeData.quality, 0) / 12 * 10) / 10,
    oee: 0,
  };
  yearlyOEE.oee = Math.round((yearlyOEE.availability * yearlyOEE.performance * yearlyOEE.quality) / 10000 * 10) / 10;
  
  // Collect all products from all months and find the best one
  const allProducts = monthlyData.flatMap(m => m.productData);
  const bestProduct = findBestProduct(allProducts);
  
  return {
    year,
    oeeData: yearlyOEE,
    monthlyData,
    bestProduct,
  };
}

// Get OEE data for a specific machine across multiple years
export function getMachineOEEHistory(machineId: string, startYear: number = 2023, endYear: number = 2025): YearlyOEEData[] {
  const years: YearlyOEEData[] = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(generateMachineOEEData(machineId, year));
  }
  return years;
}

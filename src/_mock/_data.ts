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
// User Profile Mock Data
// ----------------------------------------------------------------------

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'India',
  'Germany',
  'France',
  'Japan',
  'China',
  'Brazil',
  'South Africa',
  'Russia',
  'Mexico',
  'Italy',
  'Spain',
  'Sweden',
  'Switzerland',
  'Netherlands',
];

const ROLES = [
  'CEO',
  'CTO',
  'Project Coordinator',
  'Team Leader',
  'Software Developer',
  'Marketing Strategist',
  'Data Analyst',
  'Product Owner',
  'Graphic Designer',
  'Operations Manager',
  'Customer Support Specialist',
  'Sales Manager',
];

export const _userProfile = {
  id: 'user-profile-1',
  displayName: 'Jaydon Frankie',
  role: 'CTO',
  email: 'ashlynn.ohara62@gmail.com',
  avatarUrl: '/assets/images/avatar/avatar-25.webp',
  coverUrl: '/assets/images/cover/cover-4.webp',
  followerCount: 1947,
  followingCount: 9124,
  about:
    'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
  location: 'United Kingdom',
  company: 'Gleichner, Mueller and Tromp',
  school: 'Nikolaus - Leuschke',
  socialLinks: {
    facebook: 'https://www.facebook.com/frankie',
    instagram: 'https://www.instagram.com/frankie',
    linkedin: 'https://www.linkedin.com/in/frankie',
    twitter: 'https://www.twitter.com/frankie',
  },
};

export const _userProfileFollowers = [...Array(18)].map((_, index) => ({
  id: _id(index),
  name:
    [
      'Jayvion Simon',
      'Lucian Obrien',
      'Deja Brady',
      'Harrison Stein',
      'Reece Chung',
      'Lainey Davidson',
      'Cristopher Cardenas',
      'Melanie Noble',
      'Chase Day',
      'Shawn Manning',
      'Soren Durham',
      'Cortez Herring',
      'Brycen Jimenez',
      'Giana Brandt',
      'Aspen Schmitt',
      'Colten Aguilar',
      'Angelique Morse',
      'Selina Boyer',
    ][index] || _fullName(index),
  avatarUrl: `/assets/images/avatar/avatar-${(index % 25) + 1}.webp`,
  country: COUNTRIES[index % COUNTRIES.length],
  isFollowed: _boolean(index),
}));

export const _userProfileFriends = [...Array(18)].map((_, index) => ({
  id: _id(index),
  name:
    [
      'Jayvion Simon',
      'Lucian Obrien',
      'Deja Brady',
      'Harrison Stein',
      'Reece Chung',
      'Lainey Davidson',
      'Cristopher Cardenas',
      'Melanie Noble',
      'Chase Day',
      'Shawn Manning',
      'Soren Durham',
      'Cortez Herring',
      'Brycen Jimenez',
      'Giana Brandt',
      'Aspen Schmitt',
      'Colten Aguilar',
      'Angelique Morse',
      'Selina Boyer',
    ][index] || _fullName(index),
  role: ROLES[index % ROLES.length],
  avatarUrl: `/assets/images/avatar/avatar-${(index % 25) + 1}.webp`,
  socialLinks: {
    facebook: `https://www.facebook.com/user${index}`,
    instagram: `https://www.instagram.com/user${index}`,
    linkedin: `https://www.linkedin.com/in/user${index}`,
    twitter: `https://www.twitter.com/user${index}`,
  },
}));

const GALLERY_TITLES = [
  'The Future of Renewable Energy: Innovations and Challenges Ahead',
  'Exploring the Impact of Artificial Intelligence on Modern Society',
  'Climate Change and Its Effects on Global Ecosystems',
  'The Rise of Remote Work: Benefits, Challenges, and Best Practices',
  'Understanding Blockchain Technology: Beyond Cryptocurrency',
  'Mental Health in the Digital Age: Navigating Online Wellbeing',
  'Sustainable Fashion: How the Industry is Changing',
  'Space Exploration: New Frontiers and Technological Breakthroughs',
  'The Evolution of E-Commerce: Trends Shaping Online Shopping',
];

export const _userProfileGallery = [...Array(9)].map((_, index) => ({
  id: _id(index),
  title: GALLERY_TITLES[index % GALLERY_TITLES.length],
  coverUrl: `/assets/images/cover/cover-${(index % 24) + 1}.webp`,
  postedAt: _createdAt(index),
}));

const POST_COMMENTS_DATA = [
  { name: 'Lainey Davidson', content: 'Praesent venenatis metus at' },
  {
    name: 'Cristopher Cardenas',
    content:
      'Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.',
  },
];

export const _userProfilePosts = [...Array(5)].map((_, index) => ({
  id: _id(index),
  author: {
    id: 'user-profile-1',
    name: 'Jaydon Frankie',
    avatarUrl: '/assets/images/avatar/avatar-25.webp',
  },
  content:
    [
      'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
      'She eagerly opened the gift, her eyes sparkling with excitement.',
      'The old oak tree stood tall and majestic, its branches swaying gently in the wind.',
      'A gentle breeze rustled the leaves as the children played in the park.',
      'The aroma of freshly baked cookies filled the kitchen, enticing everyone nearby.',
    ][index] || '',
  coverUrl: index % 2 === 0 ? `/assets/images/cover/cover-${(index % 24) + 1}.webp` : null,
  likes: Math.floor(Math.random() * 50) + 10,
  personLikes: [...Array(Math.min(3, Math.floor(Math.random() * 5) + 1))].map((__, i) => ({
    name: _fullName(i),
    avatarUrl: `/assets/images/avatar/avatar-${(i % 25) + 1}.webp`,
  })),
  comments: POST_COMMENTS_DATA.slice(0, (index % 2) + 1).map((comment, i) => ({
    id: `comment-${index}-${i}`,
    author: {
      name: comment.name,
      avatarUrl: `/assets/images/avatar/avatar-${((index + i) % 25) + 1}.webp`,
    },
    content: comment.content,
    postedAt: _createdAt(index + i + 1),
  })),
  postedAt: _createdAt(index),
}));

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
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
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
    availability:
      Math.round((monthlyData.reduce((sum, m) => sum + m.oeeData.availability, 0) / 12) * 10) / 10,
    performance:
      Math.round((monthlyData.reduce((sum, m) => sum + m.oeeData.performance, 0) / 12) * 10) / 10,
    quality:
      Math.round((monthlyData.reduce((sum, m) => sum + m.oeeData.quality, 0) / 12) * 10) / 10,
    oee: 0,
  };
  yearlyOEE.oee =
    Math.round(
      ((yearlyOEE.availability * yearlyOEE.performance * yearlyOEE.quality) / 10000) * 10
    ) / 10;

  // Collect all products from all months and find the best one
  const allProducts = monthlyData.flatMap((m) => m.productData);
  const bestProduct = findBestProduct(allProducts);

  return {
    year,
    oeeData: yearlyOEE,
    monthlyData,
    bestProduct,
  };
}

// Get OEE data for a specific machine across multiple years
export function getMachineOEEHistory(
  machineId: string,
  startYear: number = 2023,
  endYear: number = 2025
): YearlyOEEData[] {
  const years: YearlyOEEData[] = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(generateMachineOEEData(machineId, year));
  }
  return years;
}

// ----------------------------------------------------------------------
// Downtime Report Data Types and Generators
// ----------------------------------------------------------------------

export type DowntimeReasonCategory =
  | 'Material Issue'
  | 'Human Resource'
  | 'Technical'
  | 'Planned Maintenance'
  | 'Quality Issue'
  | 'External'
  | 'Setup/Changeover'
  | 'Utilities';

export type DowntimeEvent = {
  id: string;
  machineId: string;
  machineName: string;
  productId: string;
  productName: string;
  reason: string;
  reasonCategory: DowntimeReasonCategory;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  isPlanned: boolean;
};

export type DailyDowntimeData = {
  date: string;
  dayOfWeek: string;
  dayNumber: number;
  totalRuntimeMinutes: number;
  totalUptimeMinutes: number;
  totalDowntimeMinutes: number;
  breakTimeMinutes: number;
  downtimeByReason: Record<DowntimeReasonCategory, number>;
  downtimeEvents: DowntimeEvent[];
};

export type MonthlyDowntimeData = {
  month: string;
  monthNumber: number;
  totalRuntimeMinutes: number;
  totalUptimeMinutes: number;
  totalDowntimeMinutes: number;
  breakTimeMinutes: number;
  downtimeByReason: Record<DowntimeReasonCategory, number>;
  dailyData: DailyDowntimeData[];
};

export type MachineDowntimeSummary = {
  machineId: string;
  machineName: string;
  totalRuntimeMinutes: number;
  totalUptimeMinutes: number;
  totalDowntimeMinutes: number;
  totalDowntimeEvents: number;
  topReasons: { reason: DowntimeReasonCategory; minutes: number; count: number }[];
};

export type ProductDowntimeSummary = {
  productId: string;
  productName: string;
  totalDowntimeMinutes: number;
  totalDowntimeEvents: number;
  topReasons: { reason: DowntimeReasonCategory; minutes: number; count: number }[];
};

export type DowntimeReportData = {
  year: number;
  totalRuntimeMinutes: number;
  totalUptimeMinutes: number;
  totalDowntimeMinutes: number;
  totalBreakTimeMinutes: number;
  downtimeByReason: Record<DowntimeReasonCategory, number>;
  monthlyData: MonthlyDowntimeData[];
  machinesSummary: MachineDowntimeSummary[];
  productsSummary: ProductDowntimeSummary[];
};

const DOWNTIME_REASON_CATEGORIES: DowntimeReasonCategory[] = [
  'Material Issue',
  'Human Resource',
  'Technical',
  'Planned Maintenance',
  'Quality Issue',
  'External',
  'Setup/Changeover',
  'Utilities',
];

const DOWNTIME_REASONS_BY_CATEGORY: Record<DowntimeReasonCategory, string[]> = {
  'Material Issue': [
    'Raw material shortage',
    'Material quality defect',
    'Wrong material delivered',
    'Material handling issue',
  ],
  'Human Resource': [
    'Operator absence',
    'Operator training',
    'Shift handover',
    'Labor shortage',
    'Skill mismatch',
  ],
  Technical: [
    'Motor failure',
    'Sensor malfunction',
    'PLC error',
    'Hydraulic leak',
    'Electrical fault',
    'Software crash',
    'Belt broken',
    'Bearing failure',
  ],
  'Planned Maintenance': [
    'Scheduled maintenance',
    'Preventive maintenance',
    'Calibration',
    'Lubrication',
    'Inspection',
  ],
  'Quality Issue': [
    'Quality inspection',
    'Product rejection',
    'Rework required',
    'Quality control check',
  ],
  External: ['Power outage', 'Network failure', 'Weather conditions', 'Supplier delay'],
  'Setup/Changeover': [
    'Product changeover',
    'Tool change',
    'Mold change',
    'Setup adjustment',
    'Line reconfiguration',
  ],
  Utilities: [
    'Compressed air failure',
    'Cooling system issue',
    'Steam supply issue',
    'Water supply issue',
  ],
};

function generateDowntimeEvent(
  seed: number,
  machineId: string,
  machineName: string,
  baseDate: Date
): DowntimeEvent {
  const categoryIndex = Math.floor(seededRandom(seed) * DOWNTIME_REASON_CATEGORIES.length);
  const category = DOWNTIME_REASON_CATEGORIES[categoryIndex];
  const reasons = DOWNTIME_REASONS_BY_CATEGORY[category];
  const reasonIndex = Math.floor(seededRandom(seed + 1) * reasons.length);
  const reason = reasons[reasonIndex];

  const productIndex = Math.floor(seededRandom(seed + 2) * PRODUCT_NAMES_FOR_OEE.length);
  const productName = PRODUCT_NAMES_FOR_OEE[productIndex];

  const isPlanned = category === 'Planned Maintenance' || category === 'Setup/Changeover';
  const durationMinutes = Math.floor(
    (isPlanned ? 15 : 5) + seededRandom(seed + 3) * (isPlanned ? 120 : 180)
  );

  const startHour = 6 + Math.floor(seededRandom(seed + 4) * 16); // 6 AM to 10 PM
  const startMinute = Math.floor(seededRandom(seed + 5) * 60);

  const startTime = new Date(baseDate);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);

  return {
    id: `dt-${seed}`,
    machineId,
    machineName,
    productId: `prod-${productIndex}`,
    productName,
    reason,
    reasonCategory: category,
    startTime,
    endTime,
    durationMinutes,
    isPlanned,
  };
}

function generateDailyDowntimeData(seed: number, date: Date, dayNumber: number): DailyDowntimeData {
  const dayOfWeekIndex = date.getDay();
  const isWeekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6;

  // Factory operates 16 hours per day (6 AM - 10 PM), less on weekends
  const plannedRuntimeMinutes = isWeekend ? 480 : 960; // 8 hours weekends, 16 hours weekdays
  const breakTimeMinutes = isWeekend ? 60 : 120;

  // Generate 2-8 downtime events per day
  const numEvents = 2 + Math.floor(seededRandom(seed) * 7);
  const downtimeEvents: DowntimeEvent[] = [];

  // Pick machines for this day
  for (let i = 0; i < numEvents; i++) {
    const machineIndex = Math.floor(seededRandom(seed + i * 10) * _machines.length);
    const machine = _machines[machineIndex];
    const event = generateDowntimeEvent(seed + i * 100, machine.id, machine.name, date);
    downtimeEvents.push(event);
  }

  // Aggregate downtime by reason
  const downtimeByReason: Record<DowntimeReasonCategory, number> = {
    'Material Issue': 0,
    'Human Resource': 0,
    Technical: 0,
    'Planned Maintenance': 0,
    'Quality Issue': 0,
    External: 0,
    'Setup/Changeover': 0,
    Utilities: 0,
  };

  let totalDowntimeMinutes = 0;
  for (const event of downtimeEvents) {
    downtimeByReason[event.reasonCategory] += event.durationMinutes;
    totalDowntimeMinutes += event.durationMinutes;
  }

  // Cap downtime to available runtime
  totalDowntimeMinutes = Math.min(totalDowntimeMinutes, plannedRuntimeMinutes - breakTimeMinutes);
  const totalUptimeMinutes = plannedRuntimeMinutes - breakTimeMinutes - totalDowntimeMinutes;

  return {
    date: date.toISOString().split('T')[0],
    dayOfWeek: DAYS_OF_WEEK[dayOfWeekIndex === 0 ? 6 : dayOfWeekIndex - 1],
    dayNumber,
    totalRuntimeMinutes: plannedRuntimeMinutes,
    totalUptimeMinutes,
    totalDowntimeMinutes,
    breakTimeMinutes,
    downtimeByReason,
    downtimeEvents,
  };
}

function generateMonthlyDowntimeData(
  seed: number,
  year: number,
  monthIndex: number
): MonthlyDowntimeData {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const dailyData: DailyDowntimeData[] = [];

  let monthlyRuntime = 0;
  let monthlyUptime = 0;
  let monthlyDowntime = 0;
  let monthlyBreakTime = 0;
  const monthlyDowntimeByReason: Record<DowntimeReasonCategory, number> = {
    'Material Issue': 0,
    'Human Resource': 0,
    Technical: 0,
    'Planned Maintenance': 0,
    'Quality Issue': 0,
    External: 0,
    'Setup/Changeover': 0,
    Utilities: 0,
  };

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    const daySeed = seed + day * 1000;
    const dayData = generateDailyDowntimeData(daySeed, date, day);

    dailyData.push(dayData);
    monthlyRuntime += dayData.totalRuntimeMinutes;
    monthlyUptime += dayData.totalUptimeMinutes;
    monthlyDowntime += dayData.totalDowntimeMinutes;
    monthlyBreakTime += dayData.breakTimeMinutes;

    for (const category of DOWNTIME_REASON_CATEGORIES) {
      monthlyDowntimeByReason[category] += dayData.downtimeByReason[category];
    }
  }

  return {
    month: MONTHS[monthIndex],
    monthNumber: monthIndex + 1,
    totalRuntimeMinutes: monthlyRuntime,
    totalUptimeMinutes: monthlyUptime,
    totalDowntimeMinutes: monthlyDowntime,
    breakTimeMinutes: monthlyBreakTime,
    downtimeByReason: monthlyDowntimeByReason,
    dailyData,
  };
}

function calculateMachinesSummary(monthlyData: MonthlyDowntimeData[]): MachineDowntimeSummary[] {
  const machineMap = new Map<
    string,
    {
      name: string;
      events: DowntimeEvent[];
      totalDowntime: number;
    }
  >();

  // Aggregate events by machine
  for (const month of monthlyData) {
    for (const day of month.dailyData) {
      for (const event of day.downtimeEvents) {
        const existing = machineMap.get(event.machineId);
        if (existing) {
          existing.events.push(event);
          existing.totalDowntime += event.durationMinutes;
        } else {
          machineMap.set(event.machineId, {
            name: event.machineName,
            events: [event],
            totalDowntime: event.durationMinutes,
          });
        }
      }
    }
  }

  // Calculate summaries
  const summaries: MachineDowntimeSummary[] = [];
  for (const [machineId, data] of machineMap) {
    // Count reasons
    const reasonCounts = new Map<DowntimeReasonCategory, { minutes: number; count: number }>();
    for (const event of data.events) {
      const existing = reasonCounts.get(event.reasonCategory);
      if (existing) {
        existing.minutes += event.durationMinutes;
        existing.count += 1;
      } else {
        reasonCounts.set(event.reasonCategory, { minutes: event.durationMinutes, count: 1 });
      }
    }

    // Sort by minutes descending
    const topReasons = Array.from(reasonCounts.entries())
      .map(([reason, stats]) => ({ reason, ...stats }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);

    // Estimate runtime (assuming 16 hrs/day * 30 days * 12 months)
    const estimatedRuntime = 16 * 60 * 30 * 12;

    summaries.push({
      machineId,
      machineName: data.name,
      totalRuntimeMinutes: estimatedRuntime,
      totalUptimeMinutes: estimatedRuntime - data.totalDowntime,
      totalDowntimeMinutes: data.totalDowntime,
      totalDowntimeEvents: data.events.length,
      topReasons,
    });
  }

  return summaries.sort((a, b) => b.totalDowntimeMinutes - a.totalDowntimeMinutes);
}

function calculateProductsSummary(monthlyData: MonthlyDowntimeData[]): ProductDowntimeSummary[] {
  const productMap = new Map<
    string,
    {
      name: string;
      events: DowntimeEvent[];
      totalDowntime: number;
    }
  >();

  for (const month of monthlyData) {
    for (const day of month.dailyData) {
      for (const event of day.downtimeEvents) {
        const existing = productMap.get(event.productId);
        if (existing) {
          existing.events.push(event);
          existing.totalDowntime += event.durationMinutes;
        } else {
          productMap.set(event.productId, {
            name: event.productName,
            events: [event],
            totalDowntime: event.durationMinutes,
          });
        }
      }
    }
  }

  const summaries: ProductDowntimeSummary[] = [];
  for (const [productId, data] of productMap) {
    const reasonCounts = new Map<DowntimeReasonCategory, { minutes: number; count: number }>();
    for (const event of data.events) {
      const existing = reasonCounts.get(event.reasonCategory);
      if (existing) {
        existing.minutes += event.durationMinutes;
        existing.count += 1;
      } else {
        reasonCounts.set(event.reasonCategory, { minutes: event.durationMinutes, count: 1 });
      }
    }

    const topReasons = Array.from(reasonCounts.entries())
      .map(([reason, stats]) => ({ reason, ...stats }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);

    summaries.push({
      productId,
      productName: data.name,
      totalDowntimeMinutes: data.totalDowntime,
      totalDowntimeEvents: data.events.length,
      topReasons,
    });
  }

  return summaries.sort((a, b) => b.totalDowntimeMinutes - a.totalDowntimeMinutes);
}

export function generateDowntimeReportData(year: number): DowntimeReportData {
  const seed = year * 1000;
  const monthlyData: MonthlyDowntimeData[] = [];

  let totalRuntime = 0;
  let totalUptime = 0;
  let totalDowntime = 0;
  let totalBreakTime = 0;
  const totalDowntimeByReason: Record<DowntimeReasonCategory, number> = {
    'Material Issue': 0,
    'Human Resource': 0,
    Technical: 0,
    'Planned Maintenance': 0,
    'Quality Issue': 0,
    External: 0,
    'Setup/Changeover': 0,
    Utilities: 0,
  };

  for (let month = 0; month < 12; month++) {
    const monthSeed = seed + month * 10000;
    const monthData = generateMonthlyDowntimeData(monthSeed, year, month);

    monthlyData.push(monthData);
    totalRuntime += monthData.totalRuntimeMinutes;
    totalUptime += monthData.totalUptimeMinutes;
    totalDowntime += monthData.totalDowntimeMinutes;
    totalBreakTime += monthData.breakTimeMinutes;

    for (const category of DOWNTIME_REASON_CATEGORIES) {
      totalDowntimeByReason[category] += monthData.downtimeByReason[category];
    }
  }

  return {
    year,
    totalRuntimeMinutes: totalRuntime,
    totalUptimeMinutes: totalUptime,
    totalDowntimeMinutes: totalDowntime,
    totalBreakTimeMinutes: totalBreakTime,
    downtimeByReason: totalDowntimeByReason,
    monthlyData,
    machinesSummary: calculateMachinesSummary(monthlyData),
    productsSummary: calculateProductsSummary(monthlyData),
  };
}

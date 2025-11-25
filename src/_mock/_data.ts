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
  _publishStatus,
  _stockQuantities,
  _areaDescriptions,
  _productCategories,
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
    value: 'de',
    label: 'German',
    icon: '/assets/icons/flags/ic-flag-de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/flags/ic-flag-fr.svg',
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

export type MachineInputType = 'WeightChannels' | 'PairChannel';

const MACHINE_INPUT_TYPES: MachineInputType[] = ['WeightChannels', 'PairChannel'];

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

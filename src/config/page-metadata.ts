/**
 * Page metadata configuration for search functionality
 * This file contains metadata for all pages in the application
 * including titles, descriptions, breadcrumbs, and page sections
 */

export type PageSection = {
  id: string;
  title: {
    en: string;
    vi: string;
  };
  description?: {
    en: string;
    vi: string;
  };
};

export type PageMetadata = {
  path: string;
  title: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
  breadcrumbs: {
    en: string[];
    vi: string[];
  };
  sections?: PageSection[];
  keywords?: string[]; // Additional search keywords
  category?: 'dashboard' | 'master-data' | 'user-management' | 'device-management' | 'mms' | 'oi' | 'settings' | 'other';
};

/**
 * All page metadata for the application
 * Add new pages here to make them searchable
 */
export const pageMetadata: PageMetadata[] = [
  // Dashboard Pages
  {
    path: '/analytics',
    title: { en: 'Analytics Dashboard', vi: 'Bảng Điều Khiển Phân Tích' },
    description: {
      en: 'View comprehensive analytics and business intelligence metrics',
      vi: 'Xem các số liệu phân tích và thông tin kinh doanh toàn diện',
    },
    breadcrumbs: { en: ['Dashboard', 'Analytics'], vi: ['Bảng Điều Khiển', 'Phân Tích'] },
    category: 'dashboard',
    keywords: ['metrics', 'kpi', 'performance'],
  },
  {
    path: '/dashboard-builder',
    title: { en: 'Dashboard Builder', vi: 'Trình Tạo Bảng Điều Khiển' },
    description: {
      en: 'Create and customize your own dashboards with widgets',
      vi: 'Tạo và tùy chỉnh bảng điều khiển của riêng bạn với các widget',
    },
    breadcrumbs: { en: ['Dashboard', 'Builder'], vi: ['Bảng Điều Khiển', 'Trình Tạo'] },
    category: 'dashboard',
    sections: [
      {
        id: 'widgets',
        title: { en: 'Widget Gallery', vi: 'Thư Viện Widget' },
        description: {
          en: 'Browse available widgets to add to your dashboard',
          vi: 'Duyệt các widget có sẵn để thêm vào bảng điều khiển',
        },
      },
      {
        id: 'layout',
        title: { en: 'Layout Settings', vi: 'Cài Đặt Bố Cục' },
        description: {
          en: 'Configure dashboard layout and grid settings',
          vi: 'Cấu hình bố cục bảng điều khiển và cài đặt lưới',
        },
      },
    ],
  },

  // Master Data - Machines
  {
    path: '/machines',
    title: { en: 'Machine List', vi: 'Danh Sách Máy' },
    description: {
      en: 'Manage all machines in the factory including status, OEE, and configurations',
      vi: 'Quản lý tất cả các máy trong nhà máy bao gồm trạng thái, OEE và cấu hình',
    },
    breadcrumbs: { en: ['Master Data', 'Machines'], vi: ['Dữ Liệu Chính', 'Máy'] },
    category: 'master-data',
    keywords: ['equipment', 'oee', 'production'],
  },
  {
    path: '/machines/create',
    title: { en: 'Create Machine', vi: 'Tạo Máy Mới' },
    description: {
      en: 'Add a new machine to the system with specifications and configurations',
      vi: 'Thêm máy mới vào hệ thống với thông số kỹ thuật và cấu hình',
    },
    breadcrumbs: { en: ['Master Data', 'Machines', 'Create'], vi: ['Dữ Liệu Chính', 'Máy', 'Tạo Mới'] },
    category: 'master-data',
  },
  {
    path: '/machine-types',
    title: { en: 'Machine Types', vi: 'Loại Máy' },
    description: {
      en: 'Define and manage different types of machines and their characteristics',
      vi: 'Xác định và quản lý các loại máy khác nhau và đặc tính của chúng',
    },
    breadcrumbs: { en: ['Master Data', 'Machine Types'], vi: ['Dữ Liệu Chính', 'Loại Máy'] },
    category: 'master-data',
  },

  // Master Data - Products
  {
    path: '/products',
    title: { en: 'Product List', vi: 'Danh Sách Sản Phẩm' },
    description: {
      en: 'Manage all products including specifications, categories, and working parameters',
      vi: 'Quản lý tất cả sản phẩm bao gồm thông số kỹ thuật, danh mục và thông số làm việc',
    },
    breadcrumbs: { en: ['Master Data', 'Products'], vi: ['Dữ Liệu Chính', 'Sản Phẩm'] },
    category: 'master-data',
    keywords: ['items', 'sku', 'inventory'],
  },
  {
    path: '/products/create',
    title: { en: 'Create Product', vi: 'Tạo Sản Phẩm Mới' },
    description: {
      en: 'Add a new product with details, images, and working parameters',
      vi: 'Thêm sản phẩm mới với chi tiết, hình ảnh và thông số làm việc',
    },
    breadcrumbs: { en: ['Master Data', 'Products', 'Create'], vi: ['Dữ Liệu Chính', 'Sản Phẩm', 'Tạo Mới'] },
    category: 'master-data',
  },
  {
    path: '/product-categories',
    title: { en: 'Product Categories', vi: 'Danh Mục Sản Phẩm' },
    description: {
      en: 'Organize products into categories for better management',
      vi: 'Tổ chức sản phẩm thành các danh mục để quản lý tốt hơn',
    },
    breadcrumbs: { en: ['Master Data', 'Product Categories'], vi: ['Dữ Liệu Chính', 'Danh Mục Sản Phẩm'] },
    category: 'master-data',
  },

  // Master Data - Areas
  {
    path: '/area',
    title: { en: 'Area List', vi: 'Danh Sách Khu Vực' },
    description: {
      en: 'Manage factory areas and zones for better space organization',
      vi: 'Quản lý các khu vực và vùng nhà máy để tổ chức không gian tốt hơn',
    },
    breadcrumbs: { en: ['Master Data', 'Areas'], vi: ['Dữ Liệu Chính', 'Khu Vực'] },
    category: 'master-data',
    keywords: ['zones', 'location', 'space'],
  },
  {
    path: '/area/create',
    title: { en: 'Create Area', vi: 'Tạo Khu Vực Mới' },
    description: {
      en: 'Add a new area to organize machines and production lines',
      vi: 'Thêm khu vực mới để tổ chức máy móc và dây chuyền sản xuất',
    },
    breadcrumbs: { en: ['Master Data', 'Areas', 'Create'], vi: ['Dữ Liệu Chính', 'Khu Vực', 'Tạo Mới'] },
    category: 'master-data',
  },

  // Master Data - Working Parameters
  {
    path: '/working-parameter',
    title: { en: 'Working Parameters', vi: 'Thông Số Làm Việc' },
    description: {
      en: 'Configure machine and product working parameters for production',
      vi: 'Cấu hình các thông số làm việc của máy và sản phẩm cho sản xuất',
    },
    breadcrumbs: { en: ['Master Data', 'Working Parameters'], vi: ['Dữ Liệu Chính', 'Thông Số Làm Việc'] },
    category: 'master-data',
    keywords: ['settings', 'configuration', 'parameters'],
  },

  // Master Data - Defect Reasons
  {
    path: '/defect-reasons',
    title: { en: 'Defect Reasons', vi: 'Lý Do Lỗi' },
    description: {
      en: 'Define and manage defect reasons for quality tracking',
      vi: 'Xác định và quản lý các lý do lỗi để theo dõi chất lượng',
    },
    breadcrumbs: { en: ['Master Data', 'Defect Reasons'], vi: ['Dữ Liệu Chính', 'Lý Do Lỗi'] },
    category: 'master-data',
    keywords: ['quality', 'issues', 'problems'],
  },
  {
    path: '/defect-reason-group',
    title: { en: 'Defect Reason Groups', vi: 'Nhóm Lý Do Lỗi' },
    description: {
      en: 'Group defect reasons into categories for better analysis',
      vi: 'Nhóm các lý do lỗi thành các danh mục để phân tích tốt hơn',
    },
    breadcrumbs: { en: ['Master Data', 'Defect Reason Groups'], vi: ['Dữ Liệu Chính', 'Nhóm Lý Do Lỗi'] },
    category: 'master-data',
  },

  // Master Data - Stop Machine Reasons
  {
    path: '/stop-machine-reason',
    title: { en: 'Stop Machine Reasons', vi: 'Lý Do Dừng Máy' },
    description: {
      en: 'Define reasons for machine stoppages and downtime',
      vi: 'Xác định các lý do dừng máy và ngừng hoạt động',
    },
    breadcrumbs: { en: ['Master Data', 'Stop Machine Reasons'], vi: ['Dữ Liệu Chính', 'Lý Do Dừng Máy'] },
    category: 'master-data',
    keywords: ['downtime', 'stoppage', 'maintenance'],
  },
  {
    path: '/stop-machine-reason-group',
    title: { en: 'Stop Machine Reason Groups', vi: 'Nhóm Lý Do Dừng Máy' },
    description: {
      en: 'Organize stop machine reasons into groups for reporting',
      vi: 'Tổ chức các lý do dừng máy thành nhóm để báo cáo',
    },
    breadcrumbs: { en: ['Master Data', 'Stop Machine Reason Groups'], vi: ['Dữ Liệu Chính', 'Nhóm Lý Do Dừng Máy'] },
    category: 'master-data',
  },

  // Master Data - Calendars & Shifts
  {
    path: '/calendars',
    title: { en: 'Calendar List', vi: 'Danh Sách Lịch' },
    description: {
      en: 'Manage production calendars, working days, and holidays',
      vi: 'Quản lý lịch sản xuất, ngày làm việc và ngày nghỉ',
    },
    breadcrumbs: { en: ['Master Data', 'Calendars'], vi: ['Dữ Liệu Chính', 'Lịch'] },
    category: 'master-data',
    keywords: ['schedule', 'working days', 'holidays'],
  },
  {
    path: '/shift-templates',
    title: { en: 'Shift Templates', vi: 'Mẫu Ca Làm Việc' },
    description: {
      en: 'Define shift templates with time blocks and working hours',
      vi: 'Xác định mẫu ca làm việc với các khối thời gian và giờ làm việc',
    },
    breadcrumbs: { en: ['Master Data', 'Shift Templates'], vi: ['Dữ Liệu Chính', 'Mẫu Ca Làm Việc'] },
    category: 'master-data',
    keywords: ['shifts', 'schedule', 'roster'],
  },

  // User Management
  {
    path: '/users',
    title: { en: 'User List', vi: 'Danh Sách Người Dùng' },
    description: {
      en: 'Manage system users, roles, and permissions',
      vi: 'Quản lý người dùng hệ thống, vai trò và quyền hạn',
    },
    breadcrumbs: { en: ['User Management', 'Users'], vi: ['Quản Lý Người Dùng', 'Người Dùng'] },
    category: 'user-management',
    keywords: ['accounts', 'staff', 'employees'],
  },
  {
    path: '/users/create',
    title: { en: 'Create User', vi: 'Tạo Người Dùng Mới' },
    description: {
      en: 'Add a new user account with roles and permissions',
      vi: 'Thêm tài khoản người dùng mới với vai trò và quyền hạn',
    },
    breadcrumbs: { en: ['User Management', 'Users', 'Create'], vi: ['Quản Lý Người Dùng', 'Người Dùng', 'Tạo Mới'] },
    category: 'user-management',
  },
  {
    path: '/roles',
    title: { en: 'Role List', vi: 'Danh Sách Vai Trò' },
    description: {
      en: 'Define and manage user roles with specific permissions',
      vi: 'Xác định và quản lý các vai trò người dùng với quyền hạn cụ thể',
    },
    breadcrumbs: { en: ['User Management', 'Roles'], vi: ['Quản Lý Người Dùng', 'Vai Trò'] },
    category: 'user-management',
    keywords: ['permissions', 'access control', 'security'],
  },

  // Device Management
  {
    path: '/iot-devices',
    title: { en: 'IoT Device List', vi: 'Danh Sách Thiết Bị IoT' },
    description: {
      en: 'Manage IoT devices connected to machines and systems',
      vi: 'Quản lý các thiết bị IoT kết nối với máy móc và hệ thống',
    },
    breadcrumbs: { en: ['Device Management', 'IoT Devices'], vi: ['Quản Lý Thiết Bị', 'Thiết Bị IoT'] },
    category: 'device-management',
    keywords: ['sensors', 'hardware', 'monitoring'],
  },
  {
    path: '/iot-sensors',
    title: { en: 'IoT Sensor List', vi: 'Danh Sách Cảm Biến IoT' },
    description: {
      en: 'Configure and monitor IoT sensors for data collection',
      vi: 'Cấu hình và giám sát các cảm biến IoT để thu thập dữ liệu',
    },
    breadcrumbs: { en: ['Device Management', 'IoT Sensors'], vi: ['Quản Lý Thiết Bị', 'Cảm Biến IoT'] },
    category: 'device-management',
  },

  // MMS - Reports
  {
    path: '/downtime-report',
    title: { en: 'Downtime Report', vi: 'Báo Cáo Thời Gian Ngừng' },
    description: {
      en: 'Analyze machine downtime and identify improvement opportunities',
      vi: 'Phân tích thời gian ngừng máy và xác định cơ hội cải thiện',
    },
    breadcrumbs: { en: ['MMS', 'Downtime Report'], vi: ['MMS', 'Báo Cáo Thời Gian Ngừng'] },
    category: 'mms',
    keywords: ['stoppage', 'analysis', 'performance'],
  },
  {
    path: '/oee-summary-report',
    title: { en: 'OEE Summary Report', vi: 'Báo Cáo Tổng Hợp OEE' },
    description: {
      en: 'View overall equipment effectiveness metrics and trends',
      vi: 'Xem các chỉ số hiệu quả tổng thể của thiết bị và xu hướng',
    },
    breadcrumbs: { en: ['MMS', 'OEE Summary'], vi: ['MMS', 'Tổng Hợp OEE'] },
    category: 'mms',
    keywords: ['efficiency', 'performance', 'metrics'],
  },

  // OI - Operation Interface
  {
    path: '/oi/select-machine',
    title: { en: 'Select Machine', vi: 'Chọn Máy' },
    description: {
      en: 'Select a machine to monitor and operate',
      vi: 'Chọn máy để giám sát và vận hành',
    },
    breadcrumbs: { en: ['Operation Interface', 'Select Machine'], vi: ['Giao Diện Vận Hành', 'Chọn Máy'] },
    category: 'oi',
  },
  {
    path: '/oi/operation',
    title: { en: 'Machine Operation', vi: 'Vận Hành Máy' },
    description: {
      en: 'Monitor and control machine operation in real-time',
      vi: 'Giám sát và điều khiển hoạt động của máy theo thời gian thực',
    },
    breadcrumbs: { en: ['Operation Interface', 'Operation'], vi: ['Giao Diện Vận Hành', 'Vận Hành'] },
    category: 'oi',
  },
  {
    path: '/oi/dashboard',
    title: { en: 'Operator Dashboard', vi: 'Bảng Điều Khiển Vận Hành' },
    description: {
      en: 'Real-time dashboard for machine operators with OEE and status',
      vi: 'Bảng điều khiển thời gian thực cho người vận hành máy với OEE và trạng thái',
    },
    breadcrumbs: { en: ['Operation Interface', 'Dashboard'], vi: ['Giao Diện Vận Hành', 'Bảng Điều Khiển'] },
    category: 'oi',
  },

  // Settings
  {
    path: '/settings/units',
    title: { en: 'Unit List', vi: 'Danh Sách Đơn Vị' },
    description: {
      en: 'Manage measurement units for quantities and conversions',
      vi: 'Quản lý các đơn vị đo lường cho số lượng và chuyển đổi',
    },
    breadcrumbs: { en: ['Settings', 'Units'], vi: ['Cài Đặt', 'Đơn Vị'] },
    category: 'settings',
    keywords: ['measurement', 'conversion', 'uom'],
  },
  {
    path: '/settings/unit-groups',
    title: { en: 'Unit Groups', vi: 'Nhóm Đơn Vị' },
    description: {
      en: 'Group related measurement units together',
      vi: 'Nhóm các đơn vị đo lường liên quan lại với nhau',
    },
    breadcrumbs: { en: ['Settings', 'Unit Groups'], vi: ['Cài Đặt', 'Nhóm Đơn Vị'] },
    category: 'settings',
  },
  {
    path: '/settings/unit-conversions',
    title: { en: 'Unit Conversions', vi: 'Chuyển Đổi Đơn Vị' },
    description: {
      en: 'Define conversion rates between different units',
      vi: 'Xác định tỷ lệ chuyển đổi giữa các đơn vị khác nhau',
    },
    breadcrumbs: { en: ['Settings', 'Unit Conversions'], vi: ['Cài Đặt', 'Chuyển Đổi Đơn Vị'] },
    category: 'settings',
  },
  {
    path: '/settings/time-block-names',
    title: { en: 'Time Block Names', vi: 'Tên Khối Thời Gian' },
    description: {
      en: 'Define names for time blocks in shift schedules',
      vi: 'Xác định tên cho các khối thời gian trong lịch trình ca làm việc',
    },
    breadcrumbs: { en: ['Settings', 'Time Block Names'], vi: ['Cài Đặt', 'Tên Khối Thời Gian'] },
    category: 'settings',
  },
  {
    path: '/settings/key-value-store',
    title: { en: 'Key-Value Store', vi: 'Kho Khóa-Giá Trị' },
    description: {
      en: 'Manage system configuration key-value pairs',
      vi: 'Quản lý các cặp khóa-giá trị cấu hình hệ thống',
    },
    breadcrumbs: { en: ['Settings', 'Key-Value Store'], vi: ['Cài Đặt', 'Kho Khóa-Giá Trị'] },
    category: 'settings',
    keywords: ['config', 'configuration', 'system'],
  },

  // Other
  {
    path: '/factory-layout',
    title: { en: 'Factory Layout', vi: 'Bố Trí Nhà Máy' },
    description: {
      en: 'Visualize and manage factory floor layout with machines and areas',
      vi: 'Hình dung và quản lý bố trí sàn nhà máy với máy móc và khu vực',
    },
    breadcrumbs: { en: ['Other', 'Factory Layout'], vi: ['Khác', 'Bố Trí Nhà Máy'] },
    category: 'other',
    keywords: ['floor plan', '2d', 'visualization'],
  },
  {
    path: '/report',
    title: { en: 'Report Builder', vi: 'Trình Tạo Báo Cáo' },
    description: {
      en: 'Create custom reports with filters and data visualization',
      vi: 'Tạo báo cáo tùy chỉnh với bộ lọc và trực quan hóa dữ liệu',
    },
    breadcrumbs: { en: ['Reports', 'Builder'], vi: ['Báo Cáo', 'Trình Tạo'] },
    category: 'other',
  },
];

/**
 * Get page metadata by path
 */
export function getPageMetadata(path: string): PageMetadata | undefined {
  // Exact match first
  const exactMatch = pageMetadata.find((page) => page.path === path);
  if (exactMatch) return exactMatch;

  // Try to match path with dynamic segments (e.g., /machines/:id/edit)
  return pageMetadata.find((page) => {
    const pagePathSegments = page.path.split('/').filter(Boolean);
    const pathSegments = path.split('/').filter(Boolean);

    if (pagePathSegments.length !== pathSegments.length) return false;

    return pagePathSegments.every((segment, index) =>
      // Match dynamic segments or exact segments
      segment.startsWith(':') || segment === pathSegments[index]
    );
  });
}

/**
 * Search pages by query
 */
export function searchPages(query: string, language: 'en' | 'vi' = 'en'): PageMetadata[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();

  return pageMetadata.filter((page) => {
    const title = page.title[language].toLowerCase();
    const description = page.description[language].toLowerCase();
    const breadcrumbs = page.breadcrumbs[language].join(' ').toLowerCase();
    const keywords = (page.keywords || []).join(' ').toLowerCase();
    const sections = (page.sections || [])
      .map((s) => `${s.title[language]} ${s.description?.[language] || ''}`)
      .join(' ')
      .toLowerCase();

    const searchableText = `${title} ${description} ${breadcrumbs} ${keywords} ${sections}`;
    return searchableText.includes(searchTerm);
  });
}

/**
 * Get pages by category
 */
export function getPagesByCategory(
  category: PageMetadata['category']
): PageMetadata[] {
  return pageMetadata.filter((page) => page.category === category);
}

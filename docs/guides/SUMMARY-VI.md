# Hướng dẫn Phát triển UI - Tóm tắt

Tài liệu này là bản tóm tắt các hướng dẫn phát triển UI cho dự án DemoUiVite.

## 📋 Danh sách Tài liệu Mới

### 1. Tạo Trang Mới ([creating-new-pages.md](./creating-new-pages.md))

**Nội dung:**
- Checklist đầy đủ cho việc tạo trang mới
- Hướng dẫn từng bước với ví dụ code
- Đăng ký route và navigation
- Cấu hình translation keys
- Các pattern thường dùng (List/Create/Edit)

**Khi nào dùng:** Mỗi khi cần thêm trang mới vào ứng dụng

**Các bước cơ bản:**
1. Tạo file page trong `src/pages/`
2. Tạo view component trong `src/sections/`
3. Đăng ký route trong `src/routes/sections.tsx`
4. Thêm menu item trong `src/layouts/nav-config-dashboard.tsx`
5. Thêm translation keys trong `src/locales/langs/*.json`

### 2. Pattern Navigation Menu ([navigation-patterns.md](./navigation-patterns.md))

**Nội dung:**
- Dashboard Layout (có navigation đầy đủ)
- Auth Layout (không có navigation)
- Minimal Layout (không có navigation và header)
- Navigation menu có điều kiện
- Navigation responsive (mobile/desktop)

**Khi nào dùng:**
- Khi cần ẩn/hiện navigation cho trang cụ thể
- Khi cần thêm navigation items có điều kiện (theo role, feature flag)
- Khi tùy chỉnh navigation menu structure

**Các layout có sẵn:**
- `DashboardLayout` - Trang chính với navigation đầy đủ
- `AuthLayout` - Trang đăng nhập, không có sidebar
- Không layout - Trang lỗi 404, 500

### 3. Pattern App Bar/Header ([appbar-patterns.md](./appbar-patterns.md))

**Nội dung:**
- Full app bar (header đầy đủ chức năng)
- Minimal app bar (header đơn giản)
- No app bar (không có header)
- Tùy chỉnh header elements
- Header responsive
- Thêm custom buttons, alerts vào header

**Khi nào dùng:**
- Khi cần thay đổi header cho trang cụ thể
- Khi cần ẩn/hiện các element trong header
- Khi cần thêm custom actions vào header

**Các phần của header:**
- `leftArea` - Logo, menu button, breadcrumbs
- `rightArea` - Search, theme toggle, language, notifications, account
- `topArea` - Alerts, banners

### 4. Tích hợp Component Bên Ngoài ([component-integration.md](./component-integration.md))

**Nội dung:**
- Cách sử dụng component từ uiverse.io
- Convert CSS sang MUI sx syntax
- Tích hợp thư viện React components
- Sử dụng icon libraries (Iconify)
- Best practices và security

**Khi nào dùng:**
- Khi muốn dùng component từ uiverse.io
- Khi cần tích hợp thư viện UI mới
- Khi muốn thêm custom animations
- Khi cần icon từ các nguồn khác

**Các bước tích hợp component từ uiverse.io:**
1. Tìm component trên uiverse.io
2. Copy HTML và CSS
3. Convert sang React component
4. Chuyển CSS sang MUI sx syntax
5. Tích hợp với theme system
6. Export và sử dụng

### 5. External Resources ([external-resource.md](./external-resource.md))

**Nội dung:**
- Icon libraries (Iconify, Material Icons, Font Awesome, etc.)
- Component sources (uiverse.io, MUI templates)
- Animation libraries
- Design tools và resources
- Learning resources

**Khi nào dùng:**
- Khi cần tìm icon
- Khi cần component inspiration
- Khi cần design tools
- Khi muốn học thêm về React, MUI, TypeScript

### 6. Documentation Index ([README.md](./README.md))

**Nội dung:**
- Tổng quan toàn bộ documentation
- Quick reference guide
- Common tasks
- Development commands
- Project structure

**Khi nào dùng:** Điểm bắt đầu để tìm tài liệu phù hợp

## 🎯 Các Tác Vụ Thường Gặp

### Thêm Trang Mới

```bash
# Xem hướng dẫn chi tiết
docs/guides/creating-new-pages.md
```

**Checklist nhanh:**
- [ ] Tạo `src/pages/my-page.tsx`
- [ ] Tạo `src/sections/my-page/view/my-page-view.tsx`
- [ ] Đăng ký route trong `src/routes/sections.tsx`
- [ ] Thêm menu item trong `src/layouts/nav-config-dashboard.tsx`
- [ ] Thêm translation trong `src/locales/langs/*.json`
- [ ] Test và build

### Thêm Icon Mới

```tsx
import { Icon } from '@iconify/react';

// Tìm icon tại: https://icon-sets.iconify.design/
<Icon icon="mdi:home" width={24} />
```

### Ẩn Navigation Cho Trang Cụ Thể

```tsx
// Trong src/routes/sections.tsx
{
  path: 'my-standalone-page',
  element: <MyStandalonePage />, // Không wrap với DashboardLayout
}
```

### Tùy Chỉnh Header Cho Trang

Xem chi tiết trong `docs/guides/appbar-patterns.md`

## 🎨 Nguyên Tắc Quan Trọng

### 1. Theme System (BẮT BUỘC)

**LUÔN sử dụng theme tokens** - KHÔNG BAO GIỜ dùng giá trị màu hardcoded

```tsx
// ❌ SAI
<Box sx={{ bgcolor: '#1C252E' }} />
<Box sx={{ bgcolor: 'grey.800' }} />

// ✅ ĐÚNG
<Box sx={{ bgcolor: 'background.paper' }} />
<Box sx={{ bgcolor: 'background.default' }} />
<Box sx={{ color: 'text.primary' }} />
```

### 2. File Naming

- Pages: kebab-case (`user-profile.tsx`)
- Components: kebab-case files, PascalCase exports
- Directories: kebab-case (`user-profile/`)

### 3. Code Organization

```
src/
├── pages/          # Page components (1 file = 1 route)
├── sections/       # View components (logic và UI)
├── layouts/        # Layout components
├── components/     # Reusable components
└── routes/         # Route configuration
```

### 4. Translation

LUÔN dùng i18n, không hardcode text:

```tsx
// ❌ SAI
<Typography>Dashboard</Typography>

// ✅ ĐÚNG
const { t } = useTranslation();
<Typography>{t('nav.dashboard')}</Typography>
```

## 🔗 Liên Kết Nhanh

### Tài Liệu Chính

- [Documentation Index](./README.md) - Tổng quan tài liệu
- [Creating New Pages](./creating-new-pages.md) - Tạo trang mới
- [Navigation Patterns](./navigation-patterns.md) - Pattern navigation
- [App Bar Patterns](./appbar-patterns.md) - Pattern header
- [Component Integration](./component-integration.md) - Tích hợp component
- [External Resources](./external-resource.md) - Tài nguyên bên ngoài

### Tài Liệu Hiện Có

- [Quickstart Guide](./quickstart.md) - Hướng dẫn bắt đầu
- [i18n Guide](./i18n.md) - Đa ngôn ngữ
- [API Usage](./api-usage.md) - Sử dụng API
- [Shift Templates](./shift-templates.md) - Shift template feature

### External Links

- [Icon Search](https://icon-sets.iconify.design/) - Tìm icon
- [uiverse.io](https://uiverse.io/) - UI components
- [MUI Docs](https://mui.com/) - MUI documentation
- [React Docs](https://react.dev/) - React documentation

## 💡 Tips

1. **Đọc documentation trước khi code** - Tiết kiệm thời gian và tránh lỗi
2. **Follow existing patterns** - Xem code hiện có để học pattern
3. **Test cả light và dark mode** - Đảm bảo UI hoạt động ở cả 2 theme
4. **Sử dụng theme tokens** - Đảm bảo tính nhất quán
5. **Add translation keys** - Hỗ trợ đa ngôn ngữ ngay từ đầu

## 🚀 Development Commands

```bash
# Khởi động dev server
npm run dev

# Build production
npm run build

# Lint code
npm run lint

# Fix linting và formatting
npm run fix:all

# Generate API services
npm run generate:api

# Type checking (watch mode)
npm run tsc:watch
```

## 📞 Cần Trợ Giúp?

1. Xem tài liệu phù hợp trong `docs/guides/`
2. Xem code example trong `src/`
3. Đọc official docs của thư viện (MUI, React, etc.)
4. Hỏi trong issues hoặc discussions

---

**Cập nhật:** Tháng 12, 2024

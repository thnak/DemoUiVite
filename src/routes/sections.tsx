import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { SvgColor } from '../components/svg-color';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const UserCreatePage = lazy(() => import('src/pages/user-create'));
export const UserProfilePage = lazy(() => import('src/pages/user-profile'));
export const AreaPage = lazy(() => import('src/pages/area'));
export const AreaCreatePage = lazy(() => import('src/pages/area-create'));
export const AreaEditPage = lazy(() => import('src/pages/area-edit'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProductListPage = lazy(() => import('src/pages/product-list'));
export const ProductCreatePage = lazy(() => import('src/pages/product-create'));
export const ProductEditPage = lazy(() => import('src/pages/product-edit'));
export const WorkingParameterListPage = lazy(() => import('src/pages/working-parameter-list'));
export const StopMachineReasonListPage = lazy(() => import('src/pages/stop-machine-reason-list'));
export const ProductGroupListPage = lazy(() => import('src/pages/product-group-list'));
export const MachineListPage = lazy(() => import('src/pages/machine-list'));
export const MachineOEEPage = lazy(() => import('src/pages/machine-oee'));
export const DemoDashboardPage = lazy(() => import('src/pages/demo/dashboard'));
export const FileDashboardPage = lazy(() => import('src/pages/demo/file-dashboard'));
export const DowntimeReportPage = lazy(() => import('src/pages/downtime-report'));
export const ShiftTemplatesPage = lazy(() => import('src/pages/shift-templates'));
export const ShiftTemplateCreatePage = lazy(() => import('src/pages/shift-template-create'));
export const ShiftTemplateEditPage = lazy(() => import('src/pages/shift-template-edit'));
export const DashboardBuilderPage = lazy(() => import('src/pages/dashboard-builder'));
export const DashboardBuilderEditPage = lazy(() => import('src/pages/dashboard-builder-edit'));
export const DefectReasonGroupListPage = lazy(() => import('src/pages/defect-reason-group-list'));
export const DefectReasonGroupCreatePage = lazy(() => import('src/pages/defect-reason-group-create'));
export const DefectReasonGroupEditPage = lazy(() => import('src/pages/defect-reason-group-edit'));
export const DefectReasonPage = lazy(() => import('src/pages/defect-reason'));
export const DefectReasonCreatePage = lazy(() => import('src/pages/defect-reason-create'));
export const DefectReasonEditPage = lazy(() => import('src/pages/defect-reason-edit'));
export const CalendarListPage = lazy(() => import('src/pages/calendar-list'));
export const CalendarCreatePage = lazy(() => import('src/pages/calendar-create'));
export const CalendarEditPage = lazy(() => import('src/pages/calendar-edit'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <SvgColor src="/assets/icons/load-bubble.svg"/>
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'user/create', element: <UserCreatePage /> },
      { path: 'user/profile', element: <UserProfilePage /> },
      { path: 'area', element: <AreaPage /> },
      { path: 'area/create', element: <AreaCreatePage /> },
      { path: 'area/:id/edit', element: <AreaEditPage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/create', element: <ProductCreatePage /> },
      { path: 'products/:id/edit', element: <ProductEditPage /> },
      { path: 'working-parameter', element: <WorkingParameterListPage /> },
      { path: 'stop-machine-reason', element: <StopMachineReasonListPage /> },
      { path: 'product-groups', element: <ProductGroupListPage /> },
      { path: 'machines', element: <MachineListPage /> },
      { path: 'machines/:id/oee', element: <MachineOEEPage /> },
      { path: 'downtime-report', element: <DowntimeReportPage /> },
      { path: 'shift-templates', element: <ShiftTemplatesPage /> },
      { path: 'shift-templates/create', element: <ShiftTemplateCreatePage /> },
      { path: 'shift-templates/:id/edit', element: <ShiftTemplateEditPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'demo/dashboard', element: <DemoDashboardPage /> },
      { path: 'demo/file-dashboard', element: <FileDashboardPage /> },
      { path: 'dashboard-builder', element: <DashboardBuilderPage /> },
      { path: 'dashboard-builder/new', element: <DashboardBuilderEditPage /> },
      { path: 'dashboard-builder/:id', element: <DashboardBuilderEditPage /> },
      { path: 'defect-reason-group', element: <DefectReasonGroupListPage /> },
      { path: 'defect-reason-group/create', element: <DefectReasonGroupCreatePage /> },
      { path: 'defect-reason-group/:id/edit', element: <DefectReasonGroupEditPage /> },
      { path: 'defect-reasons', element: <DefectReasonPage /> },
      { path: 'defect-reasons/create', element: <DefectReasonCreatePage /> },
      { path: 'defect-reasons/:id/edit', element: <DefectReasonEditPage /> },
      { path: 'calendars', element: <CalendarListPage /> },
      { path: 'calendars/create', element: <CalendarCreatePage /> },
      { path: 'calendars/:id/edit', element: <CalendarEditPage /> },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];

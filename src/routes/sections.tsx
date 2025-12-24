import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { MachineSelectorProvider } from 'src/sections/oi/context/machine-selector-context';

import { SvgColor } from '../components/svg-color';

// ----------------------------------------------------------------------

export const IndexPage = lazy(() => import('src/pages/index'));
export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/users'));
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
export const WorkingParameterCreatePage = lazy(() => import('src/pages/working-parameter-create'));
export const WorkingParameterEditPage = lazy(() => import('src/pages/working-parameter-edit'));
export const StopMachineReasonListPage = lazy(() => import('src/pages/stop-machine-reason-list'));
export const ProductGroupListPage = lazy(() => import('src/pages/product-group-list'));
export const MachineListPage = lazy(() => import('src/pages/machine-list'));
export const MachineCreatePage = lazy(() => import('src/pages/machine-create'));
export const MachineEditPage = lazy(() => import('src/pages/machine-edit'));
export const MachineOEEPage = lazy(() => import('src/pages/machine-oee'));
export const MachineTrackingPage = lazy(() => import('src/pages/machine-tracking'));
export const DemoDashboardPage = lazy(() => import('src/pages/demo/dashboard'));
export const FileDashboardPage = lazy(() => import('src/pages/demo/file-dashboard'));
export const DowntimeReportPage = lazy(() => import('src/pages/downtime-report'));
export const OEESummaryReportPage = lazy(() => import('src/pages/oee-summary-report'));
export const ShiftTemplatesPage = lazy(() => import('src/pages/shift-templates'));
export const ShiftTemplateCreatePage = lazy(() => import('src/pages/shift-template-create'));
export const ShiftTemplateEditPage = lazy(() => import('src/pages/shift-template-edit'));
export const DashboardBuilderPage = lazy(() => import('src/pages/dashboard-builder'));
export const DashboardBuilderEditPage = lazy(() => import('src/pages/dashboard-builder-edit'));
export const DefectReasonGroupListPage = lazy(() => import('src/pages/defect-reason-group-list'));
export const DefectReasonGroupCreatePage = lazy(
  () => import('src/pages/defect-reason-group-create')
);
export const DefectReasonGroupEditPage = lazy(() => import('src/pages/defect-reason-group-edit'));
export const DefectReasonPage = lazy(() => import('src/pages/defect-reason'));
export const DefectReasonCreatePage = lazy(() => import('src/pages/defect-reason-create'));
export const DefectReasonEditPage = lazy(() => import('src/pages/defect-reason-edit'));
export const CalendarListPage = lazy(() => import('src/pages/calendar-list'));
export const CalendarCreatePage = lazy(() => import('src/pages/calendar-create'));
export const CalendarEditPage = lazy(() => import('src/pages/calendar-edit'));
export const IoTDeviceListPage = lazy(() => import('src/pages/iot-device-list'));
export const IoTDeviceCreatePage = lazy(() => import('src/pages/iot-device-create'));
export const IoTDeviceEditPage = lazy(() => import('src/pages/iot-device-edit'));
export const IoTDeviceTrackingPage = lazy(() => import('src/pages/iot-device-tracking'));
export const MachineTypeListPage = lazy(() => import('src/pages/machine-type-list'));
export const MachineTypeCreatePage = lazy(() => import('src/pages/machine-type-create'));
export const MachineTypeEditPage = lazy(() => import('src/pages/machine-type-edit'));
export const UnitListPage = lazy(() => import('src/pages/unit-list'));
export const UnitCreatePage = lazy(() => import('src/pages/unit-create'));
export const UnitEditPage = lazy(() => import('src/pages/unit-edit'));
export const UnitGroupListPage = lazy(() => import('src/pages/unit-group-list'));
export const UnitGroupCreatePage = lazy(() => import('src/pages/unit-group-create'));
export const UnitGroupEditPage = lazy(() => import('src/pages/unit-group-edit'));
export const UnitConversionListPage = lazy(() => import('src/pages/unit-conversion-list'));
export const UnitConversionCreatePage = lazy(() => import('src/pages/unit-conversion-create'));
export const UnitConversionEditPage = lazy(() => import('src/pages/unit-conversion-edit'));
export const IoTSensorListPage = lazy(() => import('src/pages/iot-sensor-list'));
export const IoTSensorCreatePage = lazy(() => import('src/pages/iot-sensor-create'));
export const IoTSensorEditPage = lazy(() => import('src/pages/iot-sensor-edit'));
export const OperatorDashboardPage = lazy(() => import('src/pages/oi/operator-dashboard'));
export const ChangeProductPage = lazy(() => import('src/pages/oi/change-product'));
export const DefectInputPage = lazy(() => import('src/pages/oi/defect-input'));
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
    <SvgColor src="/assets/icons/load-bubble.svg" />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={renderFallback()}>
        <IndexPage />
      </Suspense>
    ),
  },
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: 'analytics', element: <DashboardPage /> },
      { path: 'users', element: <UserPage /> },
      { path: 'users/create', element: <UserCreatePage /> },
      { path: 'users/profile', element: <UserProfilePage /> },
      { path: 'area', element: <AreaPage /> },
      { path: 'area/create', element: <AreaCreatePage /> },
      { path: 'area/:id/edit', element: <AreaEditPage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/create', element: <ProductCreatePage /> },
      { path: 'products/:id/edit', element: <ProductEditPage /> },
      { path: 'working-parameter', element: <WorkingParameterListPage /> },
      { path: 'working-parameter/create', element: <WorkingParameterCreatePage /> },
      { path: 'working-parameter/edit/:id', element: <WorkingParameterEditPage /> },
      { path: 'stop-machine-reason', element: <StopMachineReasonListPage /> },
      { path: 'product-groups', element: <ProductGroupListPage /> },
      { path: 'machines', element: <MachineListPage /> },
      { path: 'machines/create', element: <MachineCreatePage /> },
      { path: 'machines/:id/edit', element: <MachineEditPage /> },
      { path: 'machines/:id/oee', element: <MachineOEEPage /> },
      { path: 'machines/:id/tracking', element: <MachineTrackingPage /> },
      { path: 'downtime-report', element: <DowntimeReportPage /> },
      { path: 'oee-summary-report', element: <OEESummaryReportPage /> },
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
      { path: 'iot-devices', element: <IoTDeviceListPage /> },
      { path: 'iot-devices/create', element: <IoTDeviceCreatePage /> },
      { path: 'iot-devices/:id/edit', element: <IoTDeviceEditPage /> },
      { path: 'iot-devices/:id/tracking', element: <IoTDeviceTrackingPage /> },
      { path: 'iot-sensors', element: <IoTSensorListPage /> },
      { path: 'iot-sensors/create', element: <IoTSensorCreatePage /> },
      { path: 'iot-sensors/:id/edit', element: <IoTSensorEditPage /> },
      { path: 'machine-types', element: <MachineTypeListPage /> },
      { path: 'machine-types/create', element: <MachineTypeCreatePage /> },
      { path: 'machine-types/:id/edit', element: <MachineTypeEditPage /> },
      { path: 'settings/units', element: <UnitListPage /> },
      { path: 'settings/units/create', element: <UnitCreatePage /> },
      { path: 'settings/units/:id/edit', element: <UnitEditPage /> },
      { path: 'settings/unit-groups', element: <UnitGroupListPage /> },
      { path: 'settings/unit-groups/create', element: <UnitGroupCreatePage /> },
      { path: 'settings/unit-groups/:id/edit', element: <UnitGroupEditPage /> },
      { path: 'settings/unit-conversions', element: <UnitConversionListPage /> },
      { path: 'settings/unit-conversions/create', element: <UnitConversionCreatePage /> },
      { path: 'settings/unit-conversions/:id/edit', element: <UnitConversionEditPage /> },
      {
        path: 'oi',
        element: (
          <MachineSelectorProvider>
            <Outlet />
          </MachineSelectorProvider>
        ),
        children: [
          { path: 'dashboard', element: <OperatorDashboardPage /> },
          { path: 'change-product', element: <ChangeProductPage /> },
          { path: 'defect-input', element: <DefectInputPage /> },
        ],
      },
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

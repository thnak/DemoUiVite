import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const UserCreatePage = lazy(() => import('src/pages/user-create'));
export const AreaPage = lazy(() => import('src/pages/area'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProductListPage = lazy(() => import('src/pages/product-list'));
export const ProductCreatePage = lazy(() => import('src/pages/product-create'));
export const ProductEditPage = lazy(() => import('src/pages/product-edit'));
export const WorkingParameterListPage = lazy(() => import('src/pages/working-parameter-list'));
export const StopMachineReasonListPage = lazy(
  () => import('src/pages/stop-machine-reason-list')
);
export const ProductGroupListPage = lazy(() => import('src/pages/product-group-list'));
export const MachineListPage = lazy(() => import('src/pages/machine-list'));
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
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
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
      { path: 'area', element: <AreaPage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/create', element: <ProductCreatePage /> },
      { path: 'products/:id/edit', element: <ProductEditPage /> },
      { path: 'working-parameter', element: <WorkingParameterListPage /> },
      { path: 'stop-machine-reason', element: <StopMachineReasonListPage /> },
      { path: 'product-groups', element: <ProductGroupListPage /> },
      { path: 'machines', element: <MachineListPage /> },
      { path: 'blog', element: <BlogPage /> },
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

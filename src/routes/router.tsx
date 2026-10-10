import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import RootLayout from '@/components/layout/RootLayout'
import AdminRootWrapper from '@/admin/layout/AdminRootWrapper'
import AdminProtectedRoute from '@/admin/auth/AdminProtectedRoute'
import AdminLayout from '@/admin/layout/AdminLayout'
import { ROUTES } from './paths'

/** Code-splits a page: each route loads its own chunk on first visit. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  // Admin Portal
  {
    path: '/admin',
    element: <AdminRootWrapper />,
    children: [
      { path: 'login', lazy: page(() => import('@/admin/pages/AdminLogin')) },
      {
        element: <AdminProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, lazy: page(() => import('@/admin/pages/AdminDashboard')) },
              { path: 'applications', lazy: page(() => import('@/admin/pages/AdminApplications')) },
              { path: 'applications/:id', lazy: page(() => import('@/admin/pages/AdminApplicationDetail')) },
              { path: 'messages', lazy: page(() => import('@/admin/pages/AdminMessages')) },
              { path: 'messages/:id', lazy: page(() => import('@/admin/pages/AdminMessageDetail')) },
              { path: 'videos', lazy: page(() => import('@/admin/pages/AdminVideos')) },
              { path: 'videos/new', lazy: page(() => import('@/admin/pages/AdminVideoNew')) },
              { path: 'videos/:id/edit', lazy: page(() => import('@/admin/pages/AdminVideoEdit')) },
            ],
          },
        ],
      },
    ],
  },
  // Public Website
  {
    element: <RootLayout />,
    // Pages are lazy, so the first paint waits for one chunk; show the bare
    // page background rather than a loading screen the design does not have.
    HydrateFallback: () => null,
    children: [
      { path: ROUTES.home, lazy: page(() => import('@/pages/Home')) },
      { path: ROUTES.services, lazy: page(() => import('@/pages/Services')) },
      { path: ROUTES.serviceDetail, lazy: page(() => import('@/pages/ServiceDetail')) },
      { path: ROUTES.knowledgeCentre, lazy: page(() => import('@/pages/KnowledgeCentre')) },
      { path: ROUTES.articleDetail, lazy: page(() => import('@/pages/ArticleDetail')) },
      { path: ROUTES.careers, lazy: page(() => import('@/pages/Careers')) },
      { path: ROUTES.company, lazy: page(() => import('@/pages/Company')) },
      { path: ROUTES.contact, lazy: page(() => import('@/pages/Contact')) },
      { path: ROUTES.privacyPolicy, lazy: page(() => import('@/pages/PrivacyPolicy')) },
      { path: ROUTES.termsOfService, lazy: page(() => import('@/pages/TermsOfService')) },
      { path: ROUTES.securityDisclosure, lazy: page(() => import('@/pages/SecurityDisclosure')) },
      // Development-only component gallery; never part of a production build.
      ...(import.meta.env.DEV
        ? [{ path: '/dev/components', lazy: page(() => import('@/pages/DevComponents')) }]
        : []),
      { path: '*', lazy: page(() => import('@/pages/NotFound')) },
    ],
  },
])

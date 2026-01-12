// src/routes/adminRoutes.tsx - Fixed import paths
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import CriticManagement from '@/pages/admin/CriticManagement';

// Import existing admin pages if they exist, otherwise create placeholder components
const ContentManagement = React.lazy(() => 
  import('@/pages/admin/ContentManagement').catch(() => ({
    default: () => (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Content Management</h1>
        <p className="text-muted-foreground">Content management features coming soon...</p>
      </div>
    )
  }))
);

const QuizManagement = React.lazy(() => 
  import('@/pages/admin/QuizManagement').catch(() => ({
    default: () => (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Quiz Management</h1>
        <p className="text-muted-foreground">Quiz management features coming soon...</p>
      </div>
    )
  }))
);

const AdminNotifications = React.lazy(() => 
  import('@/pages/admin/AdminNotifications').catch(() => ({
    default: () => (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>
        <p className="text-muted-foreground">Notification management features coming soon...</p>
      </div>
    )
  }))
);

const AdminSettings = React.lazy(() => 
  import('@/pages/admin/AdminSettings').catch(() => ({
    default: () => (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="text-muted-foreground">Admin settings features coming soon...</p>
      </div>
    )
  }))
);

// Admin route protection wrapper
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const adminUser = localStorage.getItem('adminUser');
  
  if (!adminUser) {
    return <AdminLogin />;
  }
  
  return <>{children}</>;
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-lg">Loading...</div>
  </div>
);

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    children: [
      {
        index: true,
        element: <AdminLogin />
      },
      {
        path: 'login',
        element: <AdminLogin />
      },
      {
        path: 'dashboard',
        element: (
          <AdminProtectedRoute>
            <AdminLayout>
              <React.Suspense fallback={<LoadingFallback />}>
                <AdminDashboard />
              </React.Suspense>
            </AdminLayout>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'users',
        element: (
          <AdminProtectedRoute>
            <AdminLayout>
              <React.Suspense fallback={<LoadingFallback />}>
                <UserManagement />
              </React.Suspense>
            </AdminLayout>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'critics',
        element: (
          <AdminProtectedRoute>
            <AdminLayout>
              <React.Suspense fallback={<LoadingFallback />}>
                <CriticManagement />
              </React.Suspense>
            </AdminLayout>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'content',
        element: (
          <AdminProtectedRoute>
            <AdminLayout>
              <React.Suspense fallback={<LoadingFallback />}>
                <ContentManagement />
              </React.Suspense>
            </AdminLayout>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'quizzes',
        element: (
          <AdminProtectedRoute>
            <AdminLayout>
              <React.Suspense fallback={<LoadingFallback />}>
                <QuizManagement />
              </React.Suspense>
            </AdminLayout>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'notifications',
        element: (
          <AdminProtectedRoute>
            <AdminLayout>
              <React.Suspense fallback={<LoadingFallback />}>
                <AdminNotifications />
              </React.Suspense>
            </AdminLayout>
          </AdminProtectedRoute>
        )
      },
      {
        path: 'settings',
        element: (
          <AdminProtectedRoute>
            <AdminLayout>
              <React.Suspense fallback={<LoadingFallback />}>
                <AdminSettings />
              </React.Suspense>
            </AdminLayout>
          </AdminProtectedRoute>
        )
      }
    ]
  }
];

// Enhanced route configuration with metadata
export const adminRouteConfig = {
  routes: [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      description: 'Overview and analytics',
      permissions: ['admin'],
      icon: 'LayoutDashboard',
      component: 'AdminDashboard'
    },
    {
      path: '/admin/users',
      name: 'User Management',
      description: 'Manage user accounts and subscriptions',
      permissions: ['admin'],
      icon: 'Users',
      component: 'UserManagement'
    },
    {
      path: '/admin/critics',
      name: 'Critic Management', 
      description: 'Manage critics and review submissions',
      permissions: ['admin'],
      icon: 'UserCheck',
      component: 'CriticManagement'
    },
    {
      path: '/admin/content',
      name: 'Content Management',
      description: 'Manage anime and manga content',
      permissions: ['admin'],
      icon: 'FileText',
      component: 'ContentManagement'
    },
    {
      path: '/admin/quizzes',
      name: 'Quiz Management',
      description: 'Manage quizzes and questions',
      permissions: ['admin'],
      icon: 'Brain',
      component: 'QuizManagement'
    },
    {
      path: '/admin/notifications',
      name: 'Notifications',
      description: 'System notifications and alerts',
      permissions: ['admin'],
      icon: 'Bell',
      component: 'AdminNotifications'
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      description: 'System configuration and preferences',
      permissions: ['admin'],
      icon: 'Settings',
      component: 'AdminSettings'
    }
  ],
  
  // Helper function to get route by path
  getRouteByPath: (path: string) => {
    return adminRouteConfig.routes.find(route => route.path === path);
  },
  
  // Helper function to get all routes for a permission level
  getRoutesByPermission: (permission: string) => {
    return adminRouteConfig.routes.filter(route => 
      route.permissions.includes(permission)
    );
  },
  
  // Helper function to check if user has access to route
  hasAccess: (path: string, userPermissions: string[]) => {
    const route = adminRouteConfig.getRouteByPath(path);
    if (!route) return false;
    
    return route.permissions.some(permission => 
      userPermissions.includes(permission)
    );
  }
};

// Export route paths as constants for easy reference
export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  CRITICS: '/admin/critics',
  CONTENT: '/admin/content',
  QUIZZES: '/admin/quizzes',
  NOTIFICATIONS: '/admin/notifications',
  SETTINGS: '/admin/settings'
} as const;

// Type for admin route paths
export type AdminRoutePath = typeof ADMIN_ROUTES[keyof typeof ADMIN_ROUTES];

// Navigation configuration for components
export const adminNavigation = [
  {
    name: 'Dashboard',
    href: ADMIN_ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
    description: 'Overview & Analytics'
  },
  {
    name: 'User Management',
    href: ADMIN_ROUTES.USERS,
    icon: 'Users', 
    description: 'Manage user accounts'
  },
  {
    name: 'Critic Management',
    href: ADMIN_ROUTES.CRITICS,
    icon: 'UserCheck',
    description: 'Manage critics & submissions'
  },
  {
    name: 'Content Management',
    href: ADMIN_ROUTES.CONTENT,
    icon: 'FileText',
    description: 'Manage anime & manga content'
  },
  {
    name: 'Quiz Management', 
    href: ADMIN_ROUTES.QUIZZES,
    icon: 'Brain',
    description: 'Manage quizzes & questions'
  },
  {
    name: 'Notifications',
    href: ADMIN_ROUTES.NOTIFICATIONS,
    icon: 'Bell',
    description: 'System notifications'
  },
  {
    name: 'Settings',
    href: ADMIN_ROUTES.SETTINGS,
    icon: 'Settings',
    description: 'System settings'
  }
];

// Default export for easy importing
export default adminRoutes;
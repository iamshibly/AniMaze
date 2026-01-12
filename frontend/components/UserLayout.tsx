// src/components/UserLayout.tsx - Optional user layout wrapper
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, BarChart3, Heart, Bookmark, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect to auth if not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  const navigationItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/user/profile', label: 'Profile Settings', icon: Settings },
    { path: '/user/watchlist', label: 'Watchlist', icon: Heart },
    { path: '/user/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { path: '/user/notifications', label: 'Notifications', icon: Bell }
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="container mx-auto p-6">
      {/* Quick Navigation - Optional */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={isActivePath(item.path) ? "default" : "ghost"} 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
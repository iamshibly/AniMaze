// src/components/AdminLayout.tsx - FIXED: True non-overlapping sidebar with proper spacing
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Brain, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  UserCheck,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Desktop sidebar expanded/collapsed
  const [adminUser, setAdminUser] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Debounced navigation to prevent throttling
  const debouncedNavigate = useCallback((path: string) => {
    const timeoutId = setTimeout(() => {
      navigate(path);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  // Single auth check with proper state management
  useEffect(() => {
    let isMounted = true;

    const checkAdminAuth = async () => {
      try {
        const stored = localStorage.getItem('adminUser');
        
        if (!stored && isMounted) {
          setAuthChecked(true);
          if (location.pathname !== '/admin/login') {
            debouncedNavigate('/admin/login');
          }
          return;
        }

        if (stored && isMounted) {
          setAdminUser(JSON.parse(stored));
          setNotificationCount(3);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        if (isMounted) {
          setAuthChecked(true);
          if (location.pathname !== '/admin/login') {
            debouncedNavigate('/admin/login');
          }
        }
      }
    };

    checkAdminAuth();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, debouncedNavigate]);

  // Load saved sidebar state
  useEffect(() => {
    const savedState = localStorage.getItem('adminSidebarExpanded');
    if (savedState !== null) {
      setSidebarExpanded(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state
  const toggleSidebar = useCallback(() => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem('adminSidebarExpanded', JSON.stringify(newState));
  }, [sidebarExpanded]);

  // Debounced logout function
  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    setAuthChecked(false);
    
    setTimeout(() => {
      navigate('/admin/login', { replace: true });
    }, 100);
  }, [navigate]);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    { 
      name: 'User Management', 
      href: '/admin/users', 
      icon: Users,
      description: 'Manage user accounts'
    },
    { 
      name: 'Critic Management', 
      href: '/admin/critics', 
      icon: UserCheck,
      description: 'Manage critics & submissions'
    },
    { 
      name: 'Content Management', 
      href: '/admin/content', 
      icon: FileText,
      description: 'Manage anime & manga content'
    },
    { 
      name: 'Quiz Management', 
      href: '/admin/quizzes', 
      icon: Brain,
      description: 'Manage quizzes & questions'
    },
    { 
      name: 'Notifications', 
      href: '/admin/notifications', 
      icon: Bell,
      description: 'System notifications',
      badge: notificationCount > 0 ? notificationCount : undefined
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings,
      description: 'System settings'
    },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Return null instead of redirecting if no admin user
  if (!adminUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Takes up actual space in layout, doesn't overlay */}
      <aside className={`
        relative z-50 bg-card border-r transition-all duration-300 ease-in-out
        ${sidebarExpanded ? 'w-72' : 'w-20'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className={`flex items-center transition-all duration-300 ${sidebarExpanded ? 'space-x-3' : 'justify-center w-full'}`}>
            <Shield className="w-8 h-8 text-primary flex-shrink-0" />
            <div className={`transition-all duration-300 overflow-hidden ${sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              <h1 className="text-xl font-bold whitespace-nowrap">Admin Panel</h1>
              <p className="text-xs text-muted-foreground whitespace-nowrap">Bangla Anime Verse</p>
            </div>
          </div>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
          
          {/* Desktop collapse/expand button */}
          <Button
            variant="ghost"
            size="sm"
            className={`hidden lg:flex transition-all duration-300 ${!sidebarExpanded && 'absolute right-2'}`}
            onClick={toggleSidebar}
          >
            {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        {/* Admin Info Section */}
        <div className={`px-6 py-5 border-b bg-accent/50 transition-all duration-300 ${!sidebarExpanded && 'px-3'}`}>
          <div className={`flex items-center ${sidebarExpanded ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className={`transition-all duration-300 overflow-hidden ${sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              <p className="font-semibold text-sm whitespace-nowrap">{adminUser?.role || 'Administrator'}</p>
              <p className="text-xs text-muted-foreground whitespace-nowrap truncate max-w-[180px]">{adminUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className={`space-y-2 transition-all duration-300 ${sidebarExpanded ? 'px-4' : 'px-2'}`}>
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      group flex items-center rounded-lg text-sm font-medium transition-all duration-200
                      ${sidebarExpanded ? 'px-4 py-3' : 'p-3 justify-center'}
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:scale-[1.02]'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                    title={!sidebarExpanded ? item.name : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${sidebarExpanded ? 'mr-4' : ''} ${isActive ? 'text-primary-foreground' : 'group-hover:scale-110'} transition-transform`} />
                    <span className={`flex-1 transition-all duration-300 overflow-hidden ${sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </span>
                    {item.badge && sidebarExpanded && (
                      <Badge variant={isActive ? "secondary" : "outline"} className="ml-auto text-xs px-2 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                    {item.badge && !sidebarExpanded && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border-2 border-card"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <Separator className="mx-4" />

        {/* Logout Button */}
        <div className={`p-4 transition-all duration-300 ${!sidebarExpanded && 'px-2'}`}>
          <Button
            variant="outline"
            size={sidebarExpanded ? "default" : "icon"}
            className={`
              transition-all duration-300 group hover:bg-destructive hover:text-destructive-foreground hover:border-destructive
              ${sidebarExpanded ? 'w-full justify-start' : 'w-16 h-12'}
            `}
            onClick={handleLogout}
            title={!sidebarExpanded ? 'Logout' : undefined}
          >
            <LogOut className={`w-4 h-4 ${sidebarExpanded ? 'mr-3' : ''} group-hover:scale-110 transition-transform`} />
            <span className={`transition-all duration-300 overflow-hidden ${sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              <span className="whitespace-nowrap">Logout</span>
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area - Always positioned beside sidebar, never behind it */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">Admin Panel</h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </header>

        {/* Desktop Header Bar */}
        <header className="hidden lg:flex bg-card border-b px-6 py-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              Super Administrator • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {notificationCount > 0 && (
                <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs min-w-[18px] h-[18px] flex items-center justify-center">
                  {notificationCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </header>

        {/* Page Content - Scrollable main area */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6 lg:p-8 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
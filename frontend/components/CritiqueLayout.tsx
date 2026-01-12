// src/components/CritiqueLayout.tsx - Proper Layout Component
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  FileText, 
  Plus, 
  User, 
  LogOut,
  BarChart3,
  Eye,
  Settings,
  Bell,
  ChevronDown
} from 'lucide-react';

interface CritiqueLayoutProps {
  children: React.ReactNode;
}

const CritiqueLayout: React.FC<CritiqueLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const critiqueNavItems = [
    {
      name: 'Dashboard',
      href: '/critique',
      icon: BarChart3,
      current: location.pathname === '/critique'
    },
    {
      name: 'Submit Content',
      href: '/critique/submit',
      icon: Plus,
      current: location.pathname === '/critique/submit'
    },
    {
      name: 'My Submissions',
      href: '/critique/submissions',
      icon: FileText,
      current: location.pathname === '/critique/submissions'
    },
    {
      name: 'Profile Settings',
      href: '/critique/profile',
      icon: Settings,
      current: location.pathname === '/critique/profile'
    },
    {
      name: 'Public Reviews',
      href: '/reviews',
      icon: Eye,
      current: location.pathname === '/reviews'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/critique" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Critic Studio</h1>
                  <p className="text-xs text-gray-500 -mt-1">Content Management</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {critiqueNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 pl-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatar_url} alt={user?.name} />
                      <AvatarFallback className="text-sm">
                        {user?.name?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || 'Content Creator'}
                      </p>
                      <p className="text-xs text-gray-500">Critic</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || 'Content Creator'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/critique/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/critique" className="cursor-pointer">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Main Site
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4 border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {critiqueNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      item.current
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <IconComponent className="w-3 h-3 mr-1" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <span>© 2024 Anime Quiz Platform</span>
              <Badge variant="outline" className="text-xs">
                Critic Dashboard v2.1
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/help" className="hover:text-purple-600">Help</Link>
              <Link to="/privacy" className="hover:text-purple-600">Privacy</Link>
              <Link to="/terms" className="hover:text-purple-600">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CritiqueLayout;
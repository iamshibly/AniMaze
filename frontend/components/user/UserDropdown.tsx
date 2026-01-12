// src/components/user/UserDropdown.tsx - Enhanced user dropdown menu
import { getAvatarById } from '@/lib/avatars';
import React from 'react';
import { Link } from 'react-router-dom';
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
  User, 
  Settings,
  BarChart3,
  Heart,
  Bookmark,
  Bell,
  LogOut,
  Crown,
  Star,
  FileText,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserDropdownProps {
  unreadNotifications?: number;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ unreadNotifications = 0 }) => {
  const { user, signOut, isAdmin, isCritique, isPremium } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getUserInitials = () => {
    const name = user?.name || user?.email || 'User';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 p-2 h-auto">
          <Avatar className="h-8 w-8">
  <AvatarImage src={user?.avatar_id ? getAvatarById(user.avatar_id) : undefined} alt={user.name || ''} />
  <AvatarFallback className="text-sm">{getUserInitials()}</AvatarFallback>
</Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium">{user.name}</span>
            <div className="flex items-center gap-1">
              {isPremium && (
                <Crown className="h-3 w-3 text-yellow-500" />
              )}
              <span className="text-xs text-muted-foreground">
                Level {user.level || 1}
              </span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64">
        {/* User Info Header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-10 w-10">
  <AvatarImage src={user?.avatar_id ? getAvatarById(user.avatar_id) : undefined} alt={user.name || ''} />
  <AvatarFallback>{getUserInitials()}</AvatarFallback>
</Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </div>
            
            {/* User Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPremium && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  Level {user.level || 1}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">XP</div>
                <div className="text-sm font-medium">{user.xp || 0}</div>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Main Menu Items */}
        <DropdownMenuItem asChild>
          <Link to="/user/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/user/dashboard" className="cursor-pointer">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Content Lists */}
        <DropdownMenuItem asChild>
          <Link to="/user/watchlist" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Watchlist
            <Badge variant="secondary" className="ml-auto text-xs">
              Anime
            </Badge>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/user/bookmarks" className="cursor-pointer">
            <Bookmark className="mr-2 h-4 w-4" />
            Bookmarks
            <Badge variant="secondary" className="ml-auto text-xs">
              Manga
            </Badge>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Notifications */}
        <DropdownMenuItem asChild>
          <Link to="/user/notifications" className="cursor-pointer">
            <div className="flex items-center w-full">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-auto text-xs">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </Badge>
              )}
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Role-specific items */}
        {isCritique && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/critique/profile" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Critic Settings
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/critique/submissions" className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                My Submissions
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/critique/submit" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Submit Content
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Sign Out */}
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
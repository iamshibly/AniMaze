// src/components/Layout.tsx - COMPLETE VERSION with Subscription in Navigation
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Menu, 
  X, 
  Play, 
  Book, 
  Trophy, 
  User, 
  Settings,
  Home,
  Sun,
  Moon,
  Globe,
  LogOut,
  Sparkles,
  Newspaper,
  Bell,
  FileText,
  BarChart3,
  Plus,
  Heart,
  Bookmark,
  Eye,
  Crown,
  CreditCard,
  Info  // ADD THIS IMPORT FOR SUBSCRIPTION ICON
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAvatarById } from '@/lib/avatars';
import NotificationDropdown from '@/components/user/NotificationDropdown';
import { UserNotificationService } from '@/lib/userServices';
import SubscriptionIcon from './subscription/SubscriptionIcon';

interface LayoutProps {
  children: React.ReactNode;
}

// Enhanced notifications hook
const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      try {
        const userNotifications = UserNotificationService.getUserNotifications();
        const count = UserNotificationService.getUnreadCount();
        
        setNotifications(userNotifications.slice(0, 5));
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const markAsRead = (id: string) => {
    try {
      UserNotificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAllAsRead = () => {
    try {
      UserNotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
};

export default function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  
  // FIXED: Using signOut instead of logout, matching AuthContext interface
  const { user, signOut, isCritique, isPremium, isAdmin } = useAuth();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // FIXED: Proper async signOut with error handling
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "See you again soon!",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // 🔥 UPDATED NAVIGATION WITH SUBSCRIPTION 🔥
  const navigation = [
  { name: t('nav_home', 'Home', 'হোম'), href: '/', icon: Home },
  { name: t('nav_anime', 'Anime', 'অ্যানিমে'), href: '/anime', icon: Play },
  { name: t('nav_manga', 'Manga', 'মাঙ্গা'), href: '/manga', icon: Book },
  { name: t('nav_pdf_manga', 'PDF Manga', 'পিডিএফ মাঙ্গা'), href: '/pdf-manga', icon: FileText },
  { name: t('nav_quiz', 'Quiz', 'কুইজ'), href: '/quiz', icon: Trophy },
  { name: t('nav_news', 'News', 'সংবাদ'), href: '/news', icon: Newspaper },
  { name: t('nav_about', 'About', 'সম্পর্কে'), href: '/about', icon: Info },
  { name: t('nav_subscription', 'Subscription', 'সাবস্ক্রিপশন'), href: '/subscription', icon: CreditCard, authRequired: true },
];

  // FIXED: Using direct User properties (avatar_id, name) not user_metadata
  const userAvatarUrl = user?.avatar_id ? getAvatarById(user.avatar_id) : null;
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';

  // User level calculation
  const userLevel = user?.level || 1;
  const userXP = user?.xp || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          
          <div className="mr-4 hidden md:flex">
<Link to="/" className="mr-6 flex items-center space-x-2">
  <img 
    src="/mainlogo (1).png" 
    alt="AniMaze" 
    className="h-8 w-8 object-contain"
    onError={(e) => {
      // Fallback to icon if image fails to load
      const target = e.currentTarget as HTMLImageElement;
      target.style.display = 'none';
      const fallbackIcon = target.nextElementSibling as HTMLElement;
      if (fallbackIcon) {
        fallbackIcon.classList.remove('hidden');
      }
    }}
  />
  <Sparkles className="h-6 w-6 text-primary hidden fallback-icon" />
  <span className="hidden font-bold sm:inline-block">
    AniMaze
  </span>
</Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navigation.map((item) => {
                // Skip subscription if user not authenticated
                if (item.authRequired && !user) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`transition-colors hover:text-foreground/80 ${
                      location.pathname === item.href
                        ? 'text-foreground'
                        : 'text-foreground/60'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pl-1 pr-0">
              <div className="px-7">
                <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span className="font-bold">Bangla Anime Verse</span>
                </Link>
              </div>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-2">
                  {navigation.map((item) => {
                    // Skip subscription if user not authenticated
                    if (item.authRequired && !user) return null;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${
                          location.pathname === item.href
                            ? 'text-foreground'
                            : 'text-foreground/60'
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                  
                  {/* Mobile user menu items */}
                  {user && (
                    <>
                      <div className="my-4 border-t pt-4">
                        <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          User Menu
                        </p>
                      </div>
                      <Link
                        to="/user/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/user/watchlist"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Watchlist
                      </Link>
                      <Link
                        to="/user/bookmarks"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        Bookmarks
                      </Link>
                      {isCritique && (
                        <Link
                          to="/critique"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Critique Dashboard
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {/* Search */}
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search anime, manga..."
                  className="pl-8 md:w-[300px] lg:w-[400px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* User menu */}
            <nav className="flex items-center space-x-2">
              {user ? (
                <>
                  {/* Notifications */}
                  <NotificationDropdown
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                  />
                  
                  {/* 🔥 SUBSCRIPTION ICON (kept for quick access) 🔥 */}
                  <SubscriptionIcon 
                    variant="header" 
                    className="mr-1" 
                  />
                  
                  {/* User dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userAvatarUrl || undefined} alt={user.name || ''} />
                          <AvatarFallback>
                            {userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isPremium && (
                          <div className="absolute -top-1 -right-1">
                            <Crown className="h-3 w-3 text-yellow-500" />
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium leading-none">
                              {userName}
                            </p>
                            {isPremium && (
                              <Badge variant="secondary" className="text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs leading-none text-muted-foreground">
                            {userEmail}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <span>Level {userLevel}</span>
                            <span>•</span>
                            <span>{userXP} XP</span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {/* User menu items */}
                      <DropdownMenuItem asChild>
                        <Link to="/user/dashboard" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link to="/user/watchlist" className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          Watchlist
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link to="/user/bookmarks" className="cursor-pointer">
                          <Bookmark className="mr-2 h-4 w-4" />
                          Bookmarks
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link to="/user/notifications" className="cursor-pointer">
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-auto text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      
                      {/* Critique role specific items */}
                      {isCritique && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/critique" className="cursor-pointer">
                              <FileText className="mr-2 h-4 w-4" />
                              Critique Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/critique/submit" className="cursor-pointer">
                              <Plus className="mr-2 h-4 w-4" />
                              Submit Content
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/critique/submissions" className="cursor-pointer">
                              <FileText className="mr-2 h-4 w-4" />
                              My Submissions
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {/* Admin role specific items */}
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/admin/dashboard" className="cursor-pointer">
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/user/profile" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Profile Settings
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
  <Link to="/login">
    <Button variant="ghost">{t('sign_in', 'Sign In', 'সাইন ইন')}</Button>
  </Link>
  <Link to="/signup">
    <Button>{t('sign_up', 'Sign Up', 'সাইন আপ')}</Button>
  </Link>
</div>
              )}
              
              {/* ADD THESE LINES HERE */}
              <ThemeToggle />
              <LanguageToggle />
            </nav>
          </div>
        </div>
      </header>
      

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
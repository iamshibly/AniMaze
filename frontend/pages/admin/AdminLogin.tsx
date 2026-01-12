// src/pages/admin/AdminLogin.tsx - FIXED: Complete working version
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, LogIn, Crown, Sparkles, Star, Zap, Eye, EyeOff, User, ArrowLeft, Lock } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    
    // FIXED: Don't redirect if coming from logout
    const isFromLogout = location.state?.fromLogout;
    if (isFromLogout) {
      // Clear the state to prevent issues on refresh
      window.history.replaceState({}, '', '/admin/login');
      return;
    }
    
    // Check if already logged in as admin
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate, location.state]);

  // Demo admin credentials
  const demoAdmins = [
    { email: 'admin@banglaanimeverse.com', password: 'admin123', name: 'Super Admin' },
    { email: 'content@banglaanimeverse.com', password: 'content123', name: 'Content Manager' },
    { email: 'mod@banglaanimeverse.com', password: 'mod123', name: 'Moderator' }
  ];

  // FIXED: Complete ensureDemoAdminsExist function
  const ensureDemoAdminsExist = async () => {
    for (const adminData of demoAdmins) {
      try {
        // Check if admin already exists
        const allUsers = AuthService.getAllUsers();
        const existingAdmin = allUsers.find(user => user.email === adminData.email);
        
        if (!existingAdmin) {
          // Create admin account in the main auth system
          const { user, error } = await AuthService.signUp({
            name: adminData.name,
            email: adminData.email,
            password: adminData.password,
            role: 'user', // Will be updated to admin below
            avatar_id: 1
          });

          if (user && !error) {
            // FIXED: Manually update the user to admin role and approved status
            // Since the auth system creates users as 'user' by default
            const users = JSON.parse(localStorage.getItem('anime_quiz_users') || '[]');
            const userIndex = users.findIndex((u: any) => u.id === user.id);
            
            if (userIndex !== -1) {
              users[userIndex] = {
                ...users[userIndex],
                role: 'admin',
                account_status: 'approved',
                approval_date: new Date().toISOString(),
                is_premium: true,
                premium_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                xp: 10000,
                level: 50
              };
              localStorage.setItem('anime_quiz_users', JSON.stringify(users));
              console.log(`✅ Demo admin created: ${adminData.email}`);
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to create demo admin ${adminData.email}:`, error);
      }
    }
  };

  // FIXED: Added missing mockAdmins variable
  const mockAdmins = {
    'admin@banglaanimeverse.com': { 
      password: 'admin123', 
      role: 'Super Administrator',
      name: 'Admin User'
    },
    'content@banglaanimeverse.com': { 
      password: 'content123', 
      role: 'Content Manager',
      name: 'Content Manager'
    },
    'mod@banglaanimeverse.com': { 
      password: 'mod123', 
      role: 'Moderator',
      name: 'Moderator'
    }
  };

  // FIXED: Admin-only login - NO regular user sessions for admins
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // FIXED: For admin login, we only use demo accounts - NO AuthService.signIn() calls
      // This prevents admin accounts from appearing as regular users
      await ensureDemoAdminsExist();
      
      // Check demo accounts first (admin-only login path)
      const admin = mockAdmins[credentials.email as keyof typeof mockAdmins];
      
      if (admin && admin.password === credentials.password) {
        // Store ONLY admin session (no regular user session)
        localStorage.setItem('adminUser', JSON.stringify({
          email: credentials.email,
          role: admin.role,
          loginTime: new Date().toISOString(),
          isDemoAccount: true
        }));

        toast({
          title: "Admin Login Successful",
          description: `Welcome, ${admin.role}!`,
        });

        navigate('/admin/dashboard', { replace: true });
        return;
      }
      
      // FIXED: Only check AuthService for non-admin demo emails
      // This ensures admin demo accounts never create regular user sessions
      if (!credentials.email.includes('@banglaanimeverse.com')) {
        const { user, session, error: authError } = await AuthService.signIn(credentials.email, credentials.password);
        
        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }
        
        if (user && user.role === 'admin') {
          // Store admin session for real admin users
          localStorage.setItem('adminUser', JSON.stringify({
            email: credentials.email,
            role: 'Administrator',
            loginTime: new Date().toISOString()
          }));

          toast({
            title: "Admin Login Successful",
            description: `Welcome back, ${user.name}!`,
          });

          navigate('/admin/dashboard', { replace: true });
          return;
        }
      }
      
      // If we get here, credentials are invalid
      setError('Invalid admin credentials. Please check your email and password.');
      
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (email: string, password: string) => {
    setCredentials({ email, password });
    setError('');
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.6) contrast(1.1)' }}
      >
        <source src="/F.mp4" type="video/mp4" />
      </video>
      
      {/* Enhanced Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-yellow-900/20 to-black/80 z-10"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-yellow-300 opacity-40 animate-twinkle"
            size={16}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Admin Crown Symbols */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(8)].map((_, i) => (
          <Crown
            key={i}
            className="absolute text-yellow-400 opacity-20 animate-slowFloat"
            size={24}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-30 min-h-screen flex items-center justify-center p-4">
        {/* Back to Home Button */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="absolute top-6 left-6 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-yellow-500/20 rounded-3xl animate-slideUp">
          <CardHeader className="text-center space-y-4 pb-8">
            {/* Admin Crown Avatar */}
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30 animate-pulse">
              <Crown className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-white/80 flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span>Secure Administrative Access</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20 backdrop-blur-sm">
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-white/90 font-medium">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-yellow-400 focus:ring-yellow-400/50 transition-all duration-300 hover:bg-white/15 hover:border-white/40 rounded-xl h-12 focus:shadow-lg focus:shadow-yellow-400/30"
                  placeholder="Enter admin email"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-white/90 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-yellow-400 focus:ring-yellow-400/50 pr-12 transition-all duration-300 hover:bg-white/15 hover:border-white/40 rounded-xl h-12 focus:shadow-lg focus:shadow-yellow-400/30"
                    placeholder="Enter password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Admin Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                {loading ? (
                  <span className="flex items-center justify-center relative z-10">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center relative z-10">
                    <Lock className="mr-2 w-5 h-5" />
                    Admin Login
                    <Crown className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            {/* Demo Admin Accounts */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-white/60">Demo Accounts</span>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">Super Admin</p>
                      <p className="text-white/70 text-xs">admin@banglaanimeverse.com</p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => fillDemoCredentials('admin@banglaanimeverse.com', 'admin123')}
                      disabled={loading}
                      size="sm"
                      className="bg-yellow-600/80 hover:bg-yellow-700/80 text-white text-xs h-8 rounded-lg backdrop-blur-sm"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Use
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">Content Manager</p>
                      <p className="text-white/70 text-xs">content@banglaanimeverse.com</p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => fillDemoCredentials('content@banglaanimeverse.com', 'content123')}
                      disabled={loading}
                      size="sm"
                      className="bg-blue-600/80 hover:bg-blue-700/80 text-white text-xs h-8 rounded-lg backdrop-blur-sm"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Use
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">Moderator</p>
                      <p className="text-white/70 text-xs">mod@banglaanimeverse.com</p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => fillDemoCredentials('mod@banglaanimeverse.com', 'mod123')}
                      disabled={loading}
                      size="sm"
                      className="bg-green-600/80 hover:bg-green-700/80 text-white text-xs h-8 rounded-lg backdrop-blur-sm"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Use
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-6 border-t border-white/20">
              <p className="text-white/80">
                Not an admin?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold hover:from-purple-300 hover:to-pink-300 transition-all duration-300 bg-transparent border-none cursor-pointer relative group"
                  disabled={loading}
                >
                  User Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slowFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        
        @keyframes slideUp {
          0% { 
            opacity: 0; 
            transform: translateY(50px) scale(0.95); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0px) scale(1); 
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-slowFloat {
          animation: slowFloat linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
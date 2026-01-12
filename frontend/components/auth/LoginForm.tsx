// src/components/auth/LoginForm.tsx - Enhanced with Demo Account Options
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowRight, Sparkles, User, FileText, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [mounted, setMounted] = useState(false);
 
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  useEffect(() => {
    setMounted(true);
    
    // Check if already logged in
    if (AuthService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  // Validation rules
  const validateField = (field: keyof FormData, value: string): string => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleBlur = (field: keyof FormData) => {
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');

    try {
      const { user, session, error } = await AuthService.signIn(formData.email, formData.password);
      
      if (error) {
        throw new Error(error.message);
      }

      if (user) {
        toast({
          title: `Welcome back! 🎉`,
          description: `Good to see you again, ${user.name}!`,
        });

        // Small delay to show the success message
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error: any) {
      console.error('💥 Unexpected login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('invalid') || error.message.includes('password')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Demo account helpers
  const fillRegularUserCredentials = () => {
    setFormData({ email: 'user@test.com', password: 'password123' });
    setErrors({});
    setSubmitError('');
  };

  const fillCritiqueCredentials = () => {
    setFormData({ email: 'critic@test.com', password: 'password123' });
    setErrors({});
    setSubmitError('');
  };

  const fillAdminCredentials = () => {
    setFormData({ email: 'admin@banglaanimeverse.com', password: 'admin123' });
    setErrors({});
    setSubmitError('');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 5;
          const duration = 3 + Math.random() * 4;
          
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-float"
              style={{
                '--left': `${left}%`,
                '--top': `${top}%`,
                '--delay': `${delay}s`,
                '--duration': `${duration}s`,
                left: 'var(--left)',
                top: 'var(--top)',
                animationDelay: 'var(--delay)',
                animationDuration: 'var(--duration)'
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 3;
          
          return (
            <Sparkles
              key={i}
              className="absolute text-yellow-300 opacity-30 animate-twinkle"
              size={12}
              style={{
                '--left': `${left}%`,
                '--top': `${top}%`,
                '--delay': `${delay}s`,
                left: 'var(--left)',
                top: 'var(--top)',
                animationDelay: 'var(--delay)'
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-purple-500/20 rounded-3xl animate-slideUp">
        <CardHeader className="text-center space-y-4 pb-8">
          {/* Avatar Placeholder */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-white/80">
            Sign in to your anime universe
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success/Error Alerts */}
          {submitError && (
            <Alert className="bg-red-500/10 border-red-500/20 backdrop-blur-sm">
              <AlertDescription className="text-red-300">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 hover:bg-white/15 hover:border-white/40 rounded-xl h-12 ${
                  errors.email ? 'border-red-400 focus:border-red-400 shadow-red-400/20' : 'focus:shadow-purple-400/30'
                } focus:shadow-lg`}
                placeholder="Enter your email"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 animate-fadeIn">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 pr-12 transition-all duration-300 hover:bg-white/15 hover:border-white/40 rounded-xl h-12 ${
                    errors.password ? 'border-red-400 focus:border-red-400 shadow-red-400/20' : 'focus:shadow-purple-400/30'
                  } focus:shadow-lg`}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 animate-fadeIn">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              {loading ? (
                <span className="flex items-center justify-center relative z-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center relative z-10">
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Social Buttons */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white/60">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl h-11 transition-all duration-300 hover:border-white/40"
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl h-11 transition-all duration-300 hover:border-white/40"
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </Button>
            </div>
          </div>

          {/* Switch to Sign Up */}
          <div className="text-center mt-6 pt-6 border-t border-white/20">
            <p className="text-white/80">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold hover:from-purple-300 hover:to-pink-300 transition-all duration-300 bg-transparent border-none cursor-pointer relative group"
                disabled={loading}
              >
                Create Account
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </p>
          </div>

          {/* Admin Login Link */}
          <div className="text-center pt-4 border-t border-white/20">
            <p className="text-white/80">
              Admin access?{' '}
              <button
                onClick={() => navigate('/admin/login')}
                className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-semibold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 bg-transparent border-none cursor-pointer relative group"
                disabled={loading}
              >
                Admin Portal
                <Crown className="inline ml-1 w-4 h-4 text-yellow-400" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </p>
          </div>

          {/* Development Helper - Demo Accounts */}
          {import.meta.env.NODE_ENV === 'development' && (
            <div className="space-y-4">
              <div className="text-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                <p className="text-blue-300 text-xs mb-3">
                  🔧 Development Mode: Quick Login Options
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    type="button"
                    onClick={fillRegularUserCredentials}
                    disabled={loading}
                    size="sm"
                    className="bg-blue-600/80 hover:bg-blue-700/80 text-white text-xs h-8 rounded-lg backdrop-blur-sm"
                  >
                    <User className="w-3 h-3 mr-1" />
                    Fill Regular User
                  </Button>
                  <Button
                    type="button"
                    onClick={fillCritiqueCredentials}
                    disabled={loading}
                    size="sm"
                    className="bg-green-600/80 hover:bg-green-700/80 text-white text-xs h-8 rounded-lg backdrop-blur-sm"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Fill Critique User
                  </Button>
                  <Button
                    type="button"
                    onClick={fillAdminCredentials}
                    disabled={loading}
                    size="sm"
                    className="bg-yellow-600/80 hover:bg-yellow-700/80 text-white text-xs h-8 rounded-lg backdrop-blur-sm"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    Fill Admin User
                  </Button>
                </div>
              </div>
              
              {/* Show registered users count */}
              <div className="text-center text-white/60 text-xs">
                Registered users: {AuthService.getAllUsers().length}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
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
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
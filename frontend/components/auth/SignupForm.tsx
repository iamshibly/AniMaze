// src/components/auth/SignupForm.tsx - Complete Clean Version
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, FileText, ArrowRight, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AuthService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { avatars } from '@/lib/avatars';
import { 
  // your existing imports...
  Clock,           // ADD THIS
  AlertTriangle,   // ADD THIS
} from 'lucide-react';
type SignupUserRole = 'user' | 'critique';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: SignupUserRole;
  avatar_id: number;
}

interface SignupFormErrors {
  [key: string]: string;
}

// Role options for signup
const signupRoleOptions = [
  {
    value: 'user' as SignupUserRole,
    title: 'Regular User',
    description: 'Take quizzes and explore content',
    emoji: '🎮',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    value: 'critique' as SignupUserRole,
    title: 'Content Critique',
    description: 'Submit reviews and vlogs for approval',
    emoji: '📝',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    badge: 'REVIEWER'
  }
];

export function SignupForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [mounted, setMounted] = useState(false);
 
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    avatar_id: 1
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Validation rules
  const validateField = (field: keyof SignupFormData, value: string | number): string => {
    switch (field) {
      case 'name':
        if (!String(value).trim()) return 'Name is required';
        if (String(value).trim().length < 2) return 'Name must be at least 2 characters';
        return '';
     
      case 'email':
        if (!String(value).trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) return 'Please enter a valid email';
        return '';
     
      case 'password':
        if (!value) return 'Password is required';
        if (String(value).length < 6) return 'Password must be at least 6 characters';
        return '';
     
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
     
      case 'avatar_id':
        if (!value) return 'Please select an avatar';
        return '';
     
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof SignupFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
   
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: keyof SignupFormData) => {
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: SignupFormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof SignupFormData>).forEach(field => {
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
      const { user, session, error } = await AuthService.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar_id: formData.avatar_id
      });

      if (error) {
        throw new Error(error.message);
      }

      if (user) {
  // Show success message about pending approval instead of redirecting
  setRegistrationSuccess(true);
  
  toast({
    title: "Registration Submitted!",
    description: "Your account is pending admin approval. You'll be notified when approved.",
    duration: 5000,
  });
}
    } catch (error: any) {
      console.error('Registration error:', error);
      setSubmitError(error.message || 'Registration failed. Please try again.');
      
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Demo account creation helpers
  const createDemoRegularUser = () => {
    setFormData({
      name: 'Demo User',
      email: 'demo@user.com',
      password: 'Demo123!',
      confirmPassword: 'Demo123!',
      role: 'user',
      avatar_id: 2
    });
    setErrors({});
    setSubmitError('');
  };

  const createDemoCritiqueUser = () => {
    setFormData({
      name: 'Demo Critique',
      email: 'critique@demo.com',
      password: 'Critique123!',
      confirmPassword: 'Critique123!',
      role: 'critique',
      avatar_id: 3
    });
    setErrors({});
    setSubmitError('');
  };

 if (!mounted) return null;

// Show success state when registration is pending approval
if (registrationSuccess) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Account Pending Approval
          </CardTitle>
          <CardDescription className="text-white/80">
            Your registration has been submitted successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50/20 border border-yellow-200/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-100">
                <p className="font-medium mb-1">Awaiting Admin Review</p>
                <p>Your account requires admin approval before you can log in.</p>
              </div>
            </div>
          </div>
          <div className="text-center space-y-3">
            <Button
              onClick={() => {
                setRegistrationSuccess(false);
                // Reset form data if you want
              }}
              variant="outline"
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Register Another Account
            </Button>
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

return (
  <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      {/* Cherry Blossom Petals */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-20 animate-petal"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-yellow-300 opacity-35 animate-twinkle"
            size={14}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-purple-500/20 rounded-3xl animate-slideUp">
        <CardHeader className="text-center space-y-4 pb-6">
       

{/* Avatar Selection - Complete Grid Display */}
<div className="space-y-4">
  <Label className="text-white/90 font-medium text-center block">
    Choose Your Avatar ({avatars.length} available)
  </Label>
  
  {/* Avatar Grid - Shows all 30 avatars */}
  <div className="max-h-48 overflow-y-auto rounded-xl bg-white/5 p-4 border border-white/20">
    <div className="grid grid-cols-6 gap-3">
      {avatars.map((avatar) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => handleInputChange('avatar_id', avatar.id)}
          className={`relative w-12 h-12 rounded-full transition-all duration-300 ${
            formData.avatar_id === avatar.id
              ? 'ring-4 ring-purple-400 scale-110 shadow-lg shadow-purple-400/50 z-10'
              : 'hover:scale-105 opacity-70 hover:opacity-100'
          }`}
          disabled={loading}
          title={avatar.name}
        >
          <img
            src={avatar.image}
            alt={avatar.name}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              // Smart fallback for your specific file naming
              const target = e.currentTarget as HTMLImageElement;
              const avatarId = avatar.id;
              const avatarNames = ['a', 'ab', 'ac', 'ad', 'ae', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
              const avatarName = avatarNames[avatarId - 1];
              
              if (!target.dataset.fallbackUsed && avatarName) {
                target.dataset.fallbackUsed = 'true';
                // Try .jpeg first
                target.src = `/avatars/${avatarName}.jpeg`;
              } else if (!target.dataset.fallback2Used && avatarName) {
                target.dataset.fallback2Used = 'true';
                // Try .jpg next
                target.src = `/avatars/${avatarName}.jpg`;
              } else if (!target.dataset.fallback3Used) {
                target.dataset.fallback3Used = 'true';
                // Final fallback to default
                target.src = '/avatars/a.jpeg'; // Use first avatar as fallback
              }
            }}
          />
          
          {/* Selection indicator */}
          {formData.avatar_id === avatar.id && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  </div>
  
  {/* Selected Avatar Info */}
  {formData.avatar_id && (
    <div className="text-center text-white/80 text-sm">
      Selected: <span className="text-purple-400 font-medium">
        {avatars.find(a => a.id === formData.avatar_id)?.name || `Avatar ${formData.avatar_id}`}
      </span>
    </div>
  )}
</div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Join the Universe
          </CardTitle>
          <CardDescription className="text-white/80">
            Create your account and start your anime journey
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
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/90 font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 hover:bg-white/15 hover:border-white/40 rounded-xl h-12 ${
                  errors.name ? 'border-red-400 focus:border-red-400 shadow-red-400/20' : 'focus:shadow-purple-400/30'
                } focus:shadow-lg`}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1 animate-fadeIn">{errors.name}</p>
              )}
            </div>

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
                  placeholder="Create a strong password"
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/90 font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 pr-12 transition-all duration-300 hover:bg-white/15 hover:border-white/40 rounded-xl h-12 ${
                    errors.confirmPassword ? 'border-red-400 focus:border-red-400 shadow-red-400/20' : 'focus:shadow-purple-400/30'
                  } focus:shadow-lg`}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 animate-fadeIn">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-white/90 font-medium">Account Type</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value: SignupUserRole) => handleInputChange('role', value)}
                className="space-y-3"
                disabled={loading}
              >
                {signupRoleOptions.map((option) => (
                  <div key={option.value} className="relative">
                    <label
                      htmlFor={option.value}
                      className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                        formData.role === option.value
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 shadow-lg shadow-purple-400/20'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="border-white/30 text-purple-400 focus:ring-purple-400"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center text-white text-lg font-bold`}>
                          {option.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">{option.title}</h3>
                            {option.badge && (
                              <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs px-2 py-1">
                                {option.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-white/70">{option.description}</p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              {loading ? (
                <span className="flex items-center justify-center relative z-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center relative z-10">
                  Create Account
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
                <span className="bg-transparent px-2 text-white/60">Or sign up with</span>
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

          {/* Switch to Login */}
          <div className="text-center mt-6 pt-6 border-t border-white/20">
            <p className="text-white/80">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold hover:from-purple-300 hover:to-pink-300 transition-all duration-300 bg-transparent border-none cursor-pointer relative group"
                disabled={loading}
              >
                Sign In
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
                  🔧 Development Mode: Quick Options
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    type="button"
                    onClick={createDemoRegularUser}
                    disabled={loading}
                    size="sm"
                    className="bg-blue-600/80 hover:bg-blue-700/80 text-white text-xs h-8 rounded-lg backdrop-blur-sm"
                  >
                    <User className="w-3 h-3 mr-1" />
                    Fill Demo User
                  </Button>
                  <Button
                    type="button"
                    onClick={createDemoCritiqueUser}
                    disabled={loading}
                    size="sm"
                    className="bg-green-600/80 hover:bg-green-700/80 text-white text-xs h-8 rounded-lg backdrop-blur-sm"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Fill Demo Critique
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        
        @keyframes petal {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(10px) rotate(180deg); opacity: 0.6; }
          100% { transform: translateY(30px) rotate(360deg); opacity: 0.1; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        
        @keyframes slideUp {
          0% { 
            opacity: 0; 
            transform: translateY(60px) scale(0.95); 
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
        
        .animate-petal {
          animation: petal linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 0.9s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
// src/pages/CombinedAuthPage.tsx - Enhanced with URL-based routing
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Sparkles } from 'lucide-react';

export default function CombinedAuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);

  // Determine initial view based on URL
  useEffect(() => {
    if (location.pathname === '/signup') {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleSwitchToSignup = () => {
      console.log('🔄 Switching to signup form'); // ADD THIS DEBUG LINE
      setShowLogin(false);
      navigate('/signup', { replace: true });
    };
    
    const handleSwitchToLogin = () => {
      console.log('🔐 Switching to login form'); // ADD THIS DEBUG LINE
      setShowLogin(true);
      navigate('/login', { replace: true });
    };

    window.addEventListener('switchToSignup', handleSwitchToSignup);
    window.addEventListener('switchToLogin', handleSwitchToLogin);

    return () => {
      window.removeEventListener('switchToSignup', handleSwitchToSignup);
      window.removeEventListener('switchToLogin', handleSwitchToLogin);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.7) contrast(1.1)' }}
      >
        <source src="/F.mp4" type="video/mp4" />
      </video>
      
      {/* Enhanced Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-black/70 z-10"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-15">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-float"
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
      <div className="absolute inset-0 pointer-events-none z-15">
        {[...Array(15)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-yellow-300 opacity-30 animate-twinkle"
            size={12}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-20">
        {showLogin ? <LoginForm /> : <SignupForm />}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
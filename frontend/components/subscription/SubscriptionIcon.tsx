// src/components/subscription/SubscriptionIcon.tsx - SIMPLE VERSION
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionIconProps {
  variant?: 'header' | 'mobile';
  className?: string;
}

export const SubscriptionIcon: React.FC<SubscriptionIconProps> = ({ 
  variant = 'header',
  className = '' 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) return null;

  if (variant === 'mobile') {
    return (
      <Link to="/subscription" className={`block ${className}`}>
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-card border hover:shadow-md transition-all">
          <div className="p-2 rounded-full bg-primary/10">
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Subscription</p>
            <p className="text-xs text-muted-foreground">Manage your badges</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to="/subscription">
      <Button
        variant="ghost"
        size="sm"
        className={`relative p-2 h-auto ${className}`}
        title="Manage Subscription"
      >
        <div className="relative">
          <div className="p-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </Button>
    </Link>
  );
};

export default SubscriptionIcon;
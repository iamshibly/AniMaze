// src/types/subscription.ts - Updated with Card Payment Types
export type BadgeType = 'free' | 'trial' | 'bronze' | 'silver' | 'gold' | 'diamond';

// Updated to include card payment types
export type PaymentGateway = 'bkash' | 'nagad' | 'upay' | 'rocket' | 'visa' | 'mastercard' | 'amex';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export interface BadgePlan {
  id: BadgeType;
  name: string;
  duration: number; // in days
  price: number; // in BDT
  xpThreshold?: number; // XP required for redemption
  features: string[];
  color: string;
  gradient: string;
  icon: string;
  popular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  badgeType: BadgeType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  isTrialUser: boolean;
  redemptionMethod: 'payment' | 'xp_redemption';
  paymentMethod?: PaymentGateway;
  transactionId?: string;
  xpSpent?: number;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: 'BDT';
  gateway: PaymentGateway;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  mobileNumber?: string; // Optional for card payments
  cardType?: 'debit' | 'credit'; // New field for card payments
  cardLastFour?: string; // New field for card payments
  badgeType: BadgeType;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface XPRedemption {
  id: string;
  userId: string;
  subscriptionId: string;
  badgeType: BadgeType;
  xpSpent: number;
  xpBalanceBefore: number;
  xpBalanceAfter: number;
  createdAt: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
  revenueByGateway: Record<PaymentGateway, number>;
  subscriptionsByBadge: Record<BadgeType, number>;
  trialConversions: number;
  xpRedemptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
}

export interface NotificationTemplate {
  type: 'subscription_activated' | 'subscription_expired' | 'trial_started' | 'trial_ending' | 'xp_redemption_available' | 'payment_received';
  title: string;
  message: string;
}

// Badge Plans Configuration
export const BADGE_PLANS: Record<BadgeType, BadgePlan> = {
  free: {
    id: 'free',
    name: 'Free User',
    duration: 0,
    price: 0,
    features: ['Basic anime streaming', 'Limited manga access', 'Quiz participation'],
    color: 'gray',
    gradient: 'from-gray-400 to-gray-600',
    icon: '👤'
  },
  trial: {
    id: 'trial',
    name: 'New User Trial',
    duration: 7,
    price: 0,
    features: ['Full access for 7 days', 'All premium features', 'Trial badge'],
    color: 'blue',
    gradient: 'from-blue-400 to-blue-600',
    icon: '🆕'
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    duration: 30,
    price: 200,
    xpThreshold: 7000,
    features: ['Ad-free streaming', 'Full manga access', 'Resume features', 'Bronze badge'],
    color: 'amber',
    gradient: 'from-amber-600 to-amber-800',
    icon: '🥉'
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    duration: 90,
    price: 500,
    xpThreshold: 12500,
    features: ['All Bronze features', 'Priority support', 'Exclusive content', 'Silver badge'],
    color: 'gray',
    gradient: 'from-gray-300 to-gray-500',
    icon: '🥈',
    popular: true
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    duration: 180,
    price: 1000,
    xpThreshold: 25000,
    features: ['All Silver features', 'Early access', 'Custom themes', 'Gold badge'],
    color: 'yellow',
    gradient: 'from-yellow-400 to-yellow-600',
    icon: '🥇'
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    duration: 365,
    price: 1500,
    features: ['All Gold features', 'VIP support', 'Exclusive events', 'Diamond badge'],
    color: 'cyan',
    gradient: 'from-cyan-400 to-blue-600',
    icon: '💎'
  }
};

// Updated Payment Gateway Configuration with Card Options
export const PAYMENT_GATEWAYS: Record<PaymentGateway, {
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  fees: number; // percentage
  type: 'mfs' | 'card'; // New field to categorize payment methods
}> = {
  // Mobile Financial Services
  bkash: {
    name: 'bKash',
    icon: '📱',
    color: 'pink',
    enabled: true,
    fees: 1.85,
    type: 'mfs'
  },
  nagad: {
    name: 'Nagad',
    icon: '💳',
    color: 'orange',
    enabled: true,
    fees: 1.99,
    type: 'mfs'
  },
  upay: {
    name: 'Upay',
    icon: '🏦',
    color: 'red',
    enabled: true,
    fees: 1.5,
    type: 'mfs'
  },
  rocket: {
    name: 'Rocket',
    icon: '🚀',
    color: 'purple',
    enabled: true,
    fees: 1.75,
    type: 'mfs'
  },
  // Card Payments
  visa: {
    name: 'Visa',
    icon: '💳',
    color: 'blue',
    enabled: true,
    fees: 2.5,
    type: 'card'
  },
  mastercard: {
    name: 'Mastercard',
    icon: '💳',
    color: 'red',
    enabled: true,
    fees: 2.5,
    type: 'card'
  },
  amex: {
    name: 'American Express',
    icon: '💳',
    color: 'green',
    enabled: true,
    fees: 3.0,
    type: 'card'
  }
};

// Notification Templates
export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  subscription_activated: {
    type: 'subscription_activated',
    title: '🎉 Subscription Activated!',
    message: 'Your {{badgeType}} subscription is now active. Enjoy all premium features!'
  },
  subscription_expired: {
    type: 'subscription_expired',
    title: '⚠️ Subscription Expired',
    message: 'Your {{badgeType}} subscription has expired. Renew to continue enjoying premium features.'
  },
  trial_started: {
    type: 'trial_started',
    title: '🆕 Welcome! Trial Started',
    message: 'Welcome to Bangla Anime Verse! Your 7-day trial is now active. Explore all features!'
  },
  trial_ending: {
    type: 'trial_ending',
    title: '⏰ Trial Ending Soon',
    message: 'Your trial expires in {{days}} days. Upgrade to continue enjoying premium features!'
  },
  xp_redemption_available: {
    type: 'xp_redemption_available',
    title: '✨ Badge Available for XP!',
    message: 'You can now redeem a {{badgeType}} badge using your XP! Check the subscription page.'
  },
  payment_received: {
    type: 'payment_received',
    title: '💳 Payment Received',
    message: 'Payment of ৳{{amount}} received via {{gateway}}. Your subscription is being activated.'
  }
};
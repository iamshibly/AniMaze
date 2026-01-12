// src/lib/subscriptionService.ts
import { 
  BadgeType, 
  UserSubscription, 
  PaymentTransaction, 
  XPRedemption, 
  SubscriptionStats,
  PaymentGateway,
  PaymentStatus,
  BADGE_PLANS,
  PAYMENT_GATEWAYS,
  NOTIFICATION_TEMPLATES
} from '@/types/subscription';

// Storage Keys
const SUBSCRIPTIONS_KEY = 'anime_subscriptions';
const TRANSACTIONS_KEY = 'anime_transactions';  
const XP_REDEMPTIONS_KEY = 'anime_xp_redemptions';
const USER_TRIALS_KEY = 'anime_user_trials';

class SubscriptionService {
  // Helper methods
  private generateId(): string {
    return 'sub_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  private saveToStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }

  // User Subscription Management
  getUserSubscription(userId: string): UserSubscription | null {
    const subscriptions = this.getFromStorage<UserSubscription[]>(SUBSCRIPTIONS_KEY, []);
    const userSub = subscriptions
      .filter(sub => sub.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    
    if (userSub) {
      // Check if subscription has expired
      const now = new Date();
      const endDate = new Date(userSub.endDate);
      
      if (now > endDate && userSub.status === 'active') {
        userSub.status = 'expired';
        this.updateSubscription(userSub);
        this.sendNotification(userId, 'subscription_expired', { badgeType: userSub.badgeType });
      }
    }
    
    return userSub || null;
  }

  getCurrentBadge(userId: string): BadgeType {
    const subscription = this.getUserSubscription(userId);
    
    if (!subscription || subscription.status === 'expired') {
      return 'free';
    }
    
    return subscription.badgeType;
  }

  // Trial Management
  checkAndActivateTrial(userId: string): boolean {
    const trials = this.getFromStorage<string[]>(USER_TRIALS_KEY, []);
    
    if (trials.includes(userId)) {
      return false; // User already had trial
    }
    
    // Create trial subscription
    const trialSub: UserSubscription = {
      id: this.generateId(),
      userId,
      badgeType: 'trial',
      status: 'trial',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      isTrialUser: true,
      redemptionMethod: 'payment',
      autoRenew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const subscriptions = this.getFromStorage<UserSubscription[]>(SUBSCRIPTIONS_KEY, []);
    subscriptions.push(trialSub);
    this.saveToStorage(SUBSCRIPTIONS_KEY, subscriptions);
    
    // Mark user as having trial
    trials.push(userId);
    this.saveToStorage(USER_TRIALS_KEY, trials);
    
    this.sendNotification(userId, 'trial_started', {});
    
    return true;
  }

  // XP Redemption
  canRedeemBadge(userId: string, badgeType: BadgeType, userXP: number): boolean {
    const plan = BADGE_PLANS[badgeType];
    return !!(plan.xpThreshold && userXP >= plan.xpThreshold);
  }

  redeemBadgeWithXP(userId: string, badgeType: BadgeType, userXP: number): { success: boolean; error?: string } {
    const plan = BADGE_PLANS[badgeType];
    
    if (!plan.xpThreshold) {
      return { success: false, error: 'This badge cannot be redeemed with XP' };
    }
    
    if (userXP < plan.xpThreshold) {
      return { success: false, error: `Insufficient XP. Required: ${plan.xpThreshold}, Available: ${userXP}` };
    }
    
    // Create subscription
    const subscription: UserSubscription = {
      id: this.generateId(),
      userId,
      badgeType,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
      isTrialUser: false,
      redemptionMethod: 'xp_redemption',
      xpSpent: plan.xpThreshold,
      autoRenew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const subscriptions = this.getFromStorage<UserSubscription[]>(SUBSCRIPTIONS_KEY, []);
    subscriptions.push(subscription);
    this.saveToStorage(SUBSCRIPTIONS_KEY, subscriptions);
    
    // Record XP redemption
    const redemption: XPRedemption = {
      id: this.generateId(),
      userId,
      subscriptionId: subscription.id,
      badgeType,
      xpSpent: plan.xpThreshold,
      xpBalanceBefore: userXP,
      xpBalanceAfter: userXP - plan.xpThreshold,
      createdAt: new Date().toISOString()
    };
    
    const redemptions = this.getFromStorage<XPRedemption[]>(XP_REDEMPTIONS_KEY, []);
    redemptions.push(redemption);
    this.saveToStorage(XP_REDEMPTIONS_KEY, redemptions);
    
    this.sendNotification(userId, 'subscription_activated', { badgeType });
    
    return { success: true };
  }

  // Payment Processing
  initiatePayment(userId: string, badgeType: BadgeType, gateway: PaymentGateway, mobileNumber: string): PaymentTransaction {
    const plan = BADGE_PLANS[badgeType];
    
    const transaction: PaymentTransaction = {
      id: this.generateId(),
      userId,
      subscriptionId: '', // Will be set after payment confirmation
      amount: plan.price,
      currency: 'BDT',
      gateway,
      status: 'pending',
      mobileNumber,
      badgeType,
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const transactions = this.getFromStorage<PaymentTransaction[]>(TRANSACTIONS_KEY, []);
    transactions.push(transaction);
    this.saveToStorage(TRANSACTIONS_KEY, transactions);
    
    return transaction;
  }

  confirmPayment(transactionId: string, gatewayTransactionId?: string): { success: boolean; error?: string } {
    const transactions = this.getFromStorage<PaymentTransaction[]>(TRANSACTIONS_KEY, []);
    const transactionIndex = transactions.findIndex(t => t.id === transactionId);
    
    if (transactionIndex === -1) {
      return { success: false, error: 'Transaction not found' };
    }
    
    const transaction = transactions[transactionIndex];
    
    // Create subscription
    const subscription: UserSubscription = {
      id: this.generateId(),
      userId: transaction.userId,
      badgeType: transaction.badgeType,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + BADGE_PLANS[transaction.badgeType].duration * 24 * 60 * 60 * 1000).toISOString(),
      isTrialUser: false,
      redemptionMethod: 'payment',
      paymentMethod: transaction.gateway,
      transactionId: transaction.id,
      autoRenew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const subscriptions = this.getFromStorage<UserSubscription[]>(SUBSCRIPTIONS_KEY, []);
    subscriptions.push(subscription);
    this.saveToStorage(SUBSCRIPTIONS_KEY, subscriptions);
    
    // Update transaction
    transaction.status = 'completed';
    transaction.subscriptionId = subscription.id;
    transaction.gatewayTransactionId = gatewayTransactionId;
    transaction.updatedAt = new Date().toISOString();
    transactions[transactionIndex] = transaction;
    this.saveToStorage(TRANSACTIONS_KEY, transactions);
    
    this.sendNotification(transaction.userId, 'subscription_activated', { badgeType: transaction.badgeType });
    this.sendNotification(transaction.userId, 'payment_received', { 
      amount: transaction.amount, 
      gateway: PAYMENT_GATEWAYS[transaction.gateway].name 
    });
    
    return { success: true };
  }

  // Transaction History
  getUserTransactions(userId: string, limit: number = 10): PaymentTransaction[] {
    const transactions = this.getFromStorage<PaymentTransaction[]>(TRANSACTIONS_KEY, []);
    return transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  getUserRedemptions(userId: string): XPRedemption[] {
    const redemptions = this.getFromStorage<XPRedemption[]>(XP_REDEMPTIONS_KEY, []);
    return redemptions
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Admin Analytics
  getSubscriptionStats(): SubscriptionStats {
    const subscriptions = this.getFromStorage<UserSubscription[]>(SUBSCRIPTIONS_KEY, []);
    const transactions = this.getFromStorage<PaymentTransaction[]>(TRANSACTIONS_KEY, []);
    const redemptions = this.getFromStorage<XPRedemption[]>(XP_REDEMPTIONS_KEY, []);
    
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const revenueByGateway = completedTransactions.reduce((acc, t) => {
      acc[t.gateway] = (acc[t.gateway] || 0) + t.amount;
      return acc;
    }, {} as Record<PaymentGateway, number>);
    
    const subscriptionsByBadge = activeSubscriptions.reduce((acc, s) => {
      acc[s.badgeType] = (acc[s.badgeType] || 0) + 1;
      return acc;
    }, {} as Record<BadgeType, number>);
    
    const trialUsers = subscriptions.filter(s => s.isTrialUser).length;
    const paidUsers = subscriptions.filter(s => !s.isTrialUser && s.redemptionMethod === 'payment').length;
    
    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      totalRevenue,
      revenueByGateway,
      subscriptionsByBadge,
      trialConversions: trialUsers > 0 ? Math.round((paidUsers / trialUsers) * 100) : 0,
      xpRedemptions: redemptions.length,
      churnRate: 0, // Simplified - would need more complex calculation
      averageRevenuePerUser: paidUsers > 0 ? Math.round(totalRevenue / paidUsers) : 0
    };
  }

  // Utility methods
  private updateSubscription(subscription: UserSubscription): void {
    const subscriptions = this.getFromStorage<UserSubscription[]>(SUBSCRIPTIONS_KEY, []);
    const index = subscriptions.findIndex(s => s.id === subscription.id);
    if (index !== -1) {
      subscription.updatedAt = new Date().toISOString();
      subscriptions[index] = subscription;
      this.saveToStorage(SUBSCRIPTIONS_KEY, subscriptions);
    }
  }

  private sendNotification(userId: string, type: string, variables: Record<string, any>): void {
    const template = NOTIFICATION_TEMPLATES[type];
    if (!template) return;
    
    // Replace variables in message
    let message = template.message;
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(`{{${key}}}`, value);
    });
    
    // In a real app, this would integrate with your notification system
    console.log(`Notification for ${userId}:`, { title: template.title, message });
    
    // Store notification in localStorage for demo
    const notifications = this.getFromStorage<any[]>('user_notifications', []);
    notifications.unshift({
      id: this.generateId(),
      userId,
      type: template.type,
      title: template.title,
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    });
    this.saveToStorage('user_notifications', notifications.slice(0, 50)); // Keep last 50
  }

  // Check for expiring subscriptions (would run daily in production)
  checkExpiringSubscriptions(): void {
    const subscriptions = this.getFromStorage<UserSubscription[]>(SUBSCRIPTIONS_KEY, []);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    subscriptions.forEach(sub => {
      if (sub.status === 'active') {
        const endDate = new Date(sub.endDate);
        
        // Notify 1 day before expiry for trials
        if (sub.badgeType === 'trial' && endDate > now && endDate <= tomorrow) {
          const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          this.sendNotification(sub.userId, 'trial_ending', { days: daysLeft });
        }
      }
    });
  }
}

export const subscriptionService = new SubscriptionService();
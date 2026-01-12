// src/__tests__/subscription.test.ts
import { subscriptionService } from '../lib/subscriptionService';
import { paymentGatewayService } from '../lib/paymentGateways';
import { BadgeType, PaymentGateway } from '../types/subscription';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Subscription Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Trial Management', () => {
    test('should activate trial for new user', () => {
      const userId = 'test_user_1';
      const result = subscriptionService.checkAndActivateTrial(userId);
      
      expect(result).toBe(true);
      
      const subscription = subscriptionService.getUserSubscription(userId);
      expect(subscription).not.toBeNull();
      expect(subscription?.badgeType).toBe('trial');
      expect(subscription?.status).toBe('trial');
      expect(subscription?.isTrialUser).toBe(true);
    });

    test('should not activate trial for existing trial user', () => {
      const userId = 'test_user_2';
      
      // First activation
      subscriptionService.checkAndActivateTrial(userId);
      
      // Second attempt
      const result = subscriptionService.checkAndActivateTrial(userId);
      expect(result).toBe(false);
    });

    test('should get correct badge for trial user', () => {
      const userId = 'test_user_3';
      subscriptionService.checkAndActivateTrial(userId);
      
      const badge = subscriptionService.getCurrentBadge(userId);
      expect(badge).toBe('trial');
    });
  });

  describe('XP Redemption', () => {
    test('should check XP redemption eligibility correctly', () => {
      const userId = 'test_user_4';
      
      // User with insufficient XP
      expect(subscriptionService.canRedeemBadge(userId, 'bronze', 5000)).toBe(false);
      
      // User with sufficient XP
      expect(subscriptionService.canRedeemBadge(userId, 'bronze', 8000)).toBe(true);
      
      // Badge without XP threshold
      expect(subscriptionService.canRedeemBadge(userId, 'diamond', 50000)).toBe(false);
    });

    test('should successfully redeem badge with XP', () => {
      const userId = 'test_user_5';
      const userXP = 10000;
      
      const result = subscriptionService.redeemBadgeWithXP(userId, 'bronze', userXP);
      
      expect(result.success).toBe(true);
      
      const subscription = subscriptionService.getUserSubscription(userId);
      expect(subscription).not.toBeNull();
      expect(subscription?.badgeType).toBe('bronze');
      expect(subscription?.redemptionMethod).toBe('xp_redemption');
      expect(subscription?.xpSpent).toBe(7000);
    });

    test('should fail XP redemption with insufficient XP', () => {
      const userId = 'test_user_6';
      const userXP = 5000;
      
      const result = subscriptionService.redeemBadgeWithXP(userId, 'bronze', userXP);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient XP');
    });

    test('should record XP redemption history', () => {
      const userId = 'test_user_7';
      const userXP = 15000;
      
      subscriptionService.redeemBadgeWithXP(userId, 'silver', userXP);
      
      const redemptions = subscriptionService.getUserRedemptions(userId);
      expect(redemptions).toHaveLength(1);
      expect(redemptions[0].badgeType).toBe('silver');
      expect(redemptions[0].xpSpent).toBe(12500);
      expect(redemptions[0].xpBalanceBefore).toBe(15000);
      expect(redemptions[0].xpBalanceAfter).toBe(2500);
    });
  });

  describe('Payment Processing', () => {
    test('should initiate payment transaction', () => {
      const userId = 'test_user_8';
      const badgeType: BadgeType = 'gold';
      const gateway: PaymentGateway = 'bkash';
      const mobileNumber = '01700000000';
      
      const transaction = subscriptionService.initiatePayment(
        userId,
        badgeType,
        gateway,
        mobileNumber
      );
      
      expect(transaction).toBeDefined();
      expect(transaction.userId).toBe(userId);
      expect(transaction.badgeType).toBe(badgeType);
      expect(transaction.gateway).toBe(gateway);
      expect(transaction.mobileNumber).toBe(mobileNumber);
      expect(transaction.amount).toBe(1000); // Gold badge price
      expect(transaction.status).toBe('pending');
    });

    test('should confirm payment successfully', () => {
      const userId = 'test_user_9';
      
      const transaction = subscriptionService.initiatePayment(
        userId,
        'silver',
        'nagad',
        '01800000000'
      );
      
      const result = subscriptionService.confirmPayment(
        transaction.id,
        'gateway_txn_123'
      );
      
      expect(result.success).toBe(true);
      
      const subscription = subscriptionService.getUserSubscription(userId);
      expect(subscription).not.toBeNull();
      expect(subscription?.badgeType).toBe('silver');
      expect(subscription?.status).toBe('active');
      expect(subscription?.redemptionMethod).toBe('payment');
      expect(subscription?.paymentMethod).toBe('nagad');
    });

    test('should handle invalid transaction confirmation', () => {
      const result = subscriptionService.confirmPayment(
        'invalid_transaction_id',
        'gateway_txn_456'
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Transaction not found');
    });
  });

  describe('Subscription Status', () => {
    test('should return free badge for user without subscription', () => {
      const userId = 'test_user_10';
      const badge = subscriptionService.getCurrentBadge(userId);
      
      expect(badge).toBe('free');
    });

    test('should handle expired subscription', () => {
      const userId = 'test_user_11';
      
      // Create expired subscription manually
      const subscriptions = [{
        id: 'sub_expired',
        userId,
        badgeType: 'bronze' as BadgeType,
        status: 'active' as const,
        startDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
        endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        isTrialUser: false,
        redemptionMethod: 'payment' as const,
        autoRenew: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
      
      localStorage.setItem('anime_subscriptions', JSON.stringify(subscriptions));
      
      const badge = subscriptionService.getCurrentBadge(userId);
      expect(badge).toBe('free'); // Should be free after expiry check
    });

    test('should get transaction history', () => {
      const userId = 'test_user_12';
      
      // Create multiple transactions
      subscriptionService.initiatePayment(userId, 'bronze', 'bkash', '01700000001');
      subscriptionService.initiatePayment(userId, 'silver', 'nagad', '01800000001');
      
      const transactions = subscriptionService.getUserTransactions(userId, 5);
      expect(transactions).toHaveLength(2);
      expect(transactions[0].userId).toBe(userId);
    });
  });

  describe('Analytics', () => {
    test('should generate subscription statistics', () => {
      const userId1 = 'stats_user_1';
      const userId2 = 'stats_user_2';
      
      // Create some test data
      const txn1 = subscriptionService.initiatePayment(userId1, 'bronze', 'bkash', '01700000001');
      const txn2 = subscriptionService.initiatePayment(userId2, 'silver', 'nagad', '01800000002');
      
      subscriptionService.confirmPayment(txn1.id, 'gateway_1');
      subscriptionService.confirmPayment(txn2.id, 'gateway_2');
      
      subscriptionService.redeemBadgeWithXP(userId1, 'gold', 30000);
      
      const stats = subscriptionService.getSubscriptionStats();
      
      expect(stats.totalSubscriptions).toBeGreaterThan(0);
      expect(stats.activeSubscriptions).toBeGreaterThan(0);
      expect(stats.totalRevenue).toBe(700); // 200 + 500
      expect(stats.xpRedemptions).toBeGreaterThan(0);
      expect(stats.revenueByGateway).toHaveProperty('bkash');
      expect(stats.revenueByGateway).toHaveProperty('nagad');
    });
  });
});

describe('Payment Gateway Service', () => {
  beforeEach(() => {
    // Mock window.location for testing
    delete (window as any).location;
    window.location = { ...window.location, origin: 'https://test.com' };
  });

  test('should initiate bKash payment', async () => {
    const transaction = {
      id: 'txn_test_bkash',
      userId: 'user_test',
      subscriptionId: '',
      amount: 200,
      currency: 'BDT' as const,
      gateway: 'bkash' as PaymentGateway,
      status: 'pending' as const,
      mobileNumber: '01700000000',
      badgeType: 'bronze' as BadgeType,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const redirectData = await paymentGatewayService.initiatePayment(transaction);
    
    expect(redirectData.method).toBe('GET');
    expect(redirectData.url).toContain('bka.sh');
    expect(redirectData.params).toHaveProperty('amount', '200');
    expect(redirectData.params).toHaveProperty('merchantInvoiceNumber', transaction.id);
  });

  test('should initiate Nagad payment', async () => {
    const transaction = {
      id: 'txn_test_nagad',
      userId: 'user_test',
      subscriptionId: '',
      amount: 500,
      currency: 'BDT' as const,
      gateway: 'nagad' as PaymentGateway,
      status: 'pending' as const,
      mobileNumber: '01800000000',
      badgeType: 'silver' as BadgeType,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const redirectData = await paymentGatewayService.initiatePayment(transaction);
    
    expect(redirectData.method).toBe('POST');
    expect(redirectData.url).toContain('mynagad.com');
    expect(redirectData.params).toHaveProperty('amount', '500');
    expect(redirectData.params).toHaveProperty('orderId', transaction.id);
  });

  test('should verify payment successfully', async () => {
    const result = await paymentGatewayService.verifyPayment(
      'test_txn_id',
      'bkash',
      'gateway_txn_123'
    );
    
    // In demo mode, verification always returns true
    expect(result).toBe(true);
  });

  test('should process bKash webhook', async () => {
    const webhookData = {
      transactionStatus: 'Completed',
      merchantInvoiceNumber: 'txn_webhook_test',
      paymentID: 'bkash_payment_123'
    };
    
    const result = await paymentGatewayService.processWebhook('bkash', webhookData);
    
    expect(result.success).toBe(true);
    expect(result.transactionId).toBe('txn_webhook_test');
    expect(result.gatewayTransactionId).toBe('bkash_payment_123');
  });

  test('should process Nagad webhook', async () => {
    const webhookData = {
      status: 'Success',
      orderId: 'txn_nagad_webhook',
      payment_ref_id: 'nagad_ref_456'
    };
    
    const result = await paymentGatewayService.processWebhook('nagad', webhookData);
    
    expect(result.success).toBe(true);
    expect(result.transactionId).toBe('txn_nagad_webhook');
    expect(result.gatewayTransactionId).toBe('nagad_ref_456');
  });

  test('should handle unsupported gateway', async () => {
    const transaction = {
      id: 'txn_unsupported',
      userId: 'user_test',
      subscriptionId: '',
      amount: 100,
      currency: 'BDT' as const,
      gateway: 'unsupported' as any,
      status: 'pending' as const,
      mobileNumber: '01900000000',
      badgeType: 'bronze' as BadgeType,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await expect(paymentGatewayService.initiatePayment(transaction))
      .rejects
      .toThrow('Unsupported payment gateway');
  });
});

// Integration Tests
describe('Subscription Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should complete full payment flow', async () => {
    const userId = 'integration_user_1';
    
    // 1. Initiate payment
    const transaction = subscriptionService.initiatePayment(
      userId,
      'gold',
      'bkash',
      '01700000000'
    );
    
    expect(transaction.status).toBe('pending');
    
    // 2. Process payment through gateway (simulated)
    const redirectData = await paymentGatewayService.initiatePayment(transaction);
    expect(redirectData.url).toBeDefined();
    
    // 3. Simulate webhook callback
    const webhookData = {
      transactionStatus: 'Completed',
      merchantInvoiceNumber: transaction.id,
      paymentID: 'integration_test_payment'
    };
    
    const webhookResult = await paymentGatewayService.processWebhook('bkash', webhookData);
    expect(webhookResult.success).toBe(true);
    
    // 4. Confirm payment
    const confirmResult = subscriptionService.confirmPayment(
      transaction.id,
      webhookResult.gatewayTransactionId!
    );
    
    expect(confirmResult.success).toBe(true);
    
    // 5. Verify subscription is active
    const subscription = subscriptionService.getUserSubscription(userId);
    expect(subscription).not.toBeNull();
    expect(subscription?.badgeType).toBe('gold');
    expect(subscription?.status).toBe('active');
    
    // 6. Verify current badge
    const currentBadge = subscriptionService.getCurrentBadge(userId);
    expect(currentBadge).toBe('gold');
  });

  test('should complete full XP redemption flow', () => {
    const userId = 'integration_user_2';
    const userXP = 30000;
    
    // 1. Check eligibility
    const canRedeem = subscriptionService.canRedeemBadge(userId, 'gold', userXP);
    expect(canRedeem).toBe(true);
    
    // 2. Redeem badge
    const redemptionResult = subscriptionService.redeemBadgeWithXP(userId, 'gold', userXP);
    expect(redemptionResult.success).toBe(true);
    
    // 3. Verify subscription
    const subscription = subscriptionService.getUserSubscription(userId);
    expect(subscription?.badgeType).toBe('gold');
    expect(subscription?.redemptionMethod).toBe('xp_redemption');
    
    // 4. Verify redemption history
    const redemptions = subscriptionService.getUserRedemptions(userId);
    expect(redemptions).toHaveLength(1);
    expect(redemptions[0].xpSpent).toBe(25000);
    
    // 5. Verify current badge
    const currentBadge = subscriptionService.getCurrentBadge(userId);
    expect(currentBadge).toBe('gold');
  });
});
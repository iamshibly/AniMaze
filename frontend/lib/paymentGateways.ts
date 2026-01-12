// src/lib/paymentGateways.ts
import { PaymentGateway, PaymentTransaction } from '@/types/subscription';

export interface PaymentRedirectData {
  url: string;
  method: 'GET' | 'POST';
  params: Record<string, string>;
}

export interface GatewayConfig {
  baseUrl: string;
  merchantId: string;
  secretKey: string;
  successUrl: string;
  failureUrl: string;
  cancelUrl: string;
}

// Demo configuration - In production, these would be environment variables
const GATEWAY_CONFIGS: Record<PaymentGateway, GatewayConfig> = {
  bkash: {
    baseUrl: 'https://tokenized.pay.bka.sh/v1.2.0-beta',
    merchantId: 'demo_bkash_merchant',
    secretKey: 'demo_bkash_secret',
    successUrl: `${window.location.origin}/subscription/payment/success`,
    failureUrl: `${window.location.origin}/subscription/payment/failure`,
    cancelUrl: `${window.location.origin}/subscription/payment/cancel`
  },
  nagad: {
    baseUrl: 'https://api.mynagad.com/api/dfs',
    merchantId: 'demo_nagad_merchant',
    secretKey: 'demo_nagad_secret',
    successUrl: `${window.location.origin}/subscription/payment/success`,
    failureUrl: `${window.location.origin}/subscription/payment/failure`,
    cancelUrl: `${window.location.origin}/subscription/payment/cancel`
  },
  upay: {
    baseUrl: 'https://secure.upaybd.com',
    merchantId: 'demo_upay_merchant',
    secretKey: 'demo_upay_secret',
    successUrl: `${window.location.origin}/subscription/payment/success`,
    failureUrl: `${window.location.origin}/subscription/payment/failure`,
    cancelUrl: `${window.location.origin}/subscription/payment/cancel`
  },
  rocket: {
    baseUrl: 'https://api.rocket.com.bd',
    merchantId: 'demo_rocket_merchant',
    secretKey: 'demo_rocket_secret',
    successUrl: `${window.location.origin}/subscription/payment/success`,
    failureUrl: `${window.location.origin}/subscription/payment/failure`,
    cancelUrl: `${window.location.origin}/subscription/payment/cancel`
  },
  tap: {
    baseUrl: 'https://api.tap.company/v2',
    merchantId: 'demo_tap_merchant',
    secretKey: 'demo_tap_secret',
    successUrl: `${window.location.origin}/subscription/payment/success`,
    failureUrl: `${window.location.origin}/subscription/payment/failure`,
    cancelUrl: `${window.location.origin}/subscription/payment/cancel`
  }
};

class PaymentGatewayService {
  // Main payment initiation
  async initiatePayment(transaction: PaymentTransaction): Promise<PaymentRedirectData> {
    const config = GATEWAY_CONFIGS[transaction.gateway];
    
    switch (transaction.gateway) {
      case 'bkash':
        return this.initiateBkashPayment(transaction, config);
      case 'nagad':
        return this.initiateNagadPayment(transaction, config);
      case 'upay':
        return this.initiateUpayPayment(transaction, config);
      case 'rocket':
        return this.initiateRocketPayment(transaction, config);
      case 'tap':
        return this.initiateTapPayment(transaction, config);
      default:
        throw new Error(`Unsupported payment gateway: ${transaction.gateway}`);
    }
  }

  // bKash Integration
  private async initiateBkashPayment(transaction: PaymentTransaction, config: GatewayConfig): Promise<PaymentRedirectData> {
    // In production, this would make actual API calls to bKash
    console.log('Initiating bKash payment:', transaction);
    
    // Simulate bKash payment URL generation
    const paymentData = {
      merchantId: config.merchantId,
      amount: transaction.amount.toString(),
      currency: transaction.currency,
      intent: 'sale',
      merchantInvoiceNumber: transaction.id,
      merchantAssociationInfo: JSON.stringify({
        badgeType: transaction.badgeType,
        userId: transaction.userId
      })
    };
    
    // Demo URL - would be actual bKash URL in production
    const demoUrl = `${config.baseUrl}/checkout/create?${this.buildQueryString(paymentData)}`;
    
    return {
      url: demoUrl,
      method: 'GET',
      params: paymentData
    };
  }

  // Nagad Integration
  private async initiateNagadPayment(transaction: PaymentTransaction, config: GatewayConfig): Promise<PaymentRedirectData> {
    console.log('Initiating Nagad payment:', transaction);
    
    const timestamp = Date.now().toString();
    const paymentData = {
      merchantId: config.merchantId,
      orderId: transaction.id,
      amount: transaction.amount.toString(),
      currencyCode: '050', // BDT currency code
      challenge: this.generateChallenge(),
      timestamp,
      signature: this.generateSignature(transaction.id + transaction.amount + timestamp, config.secretKey)
    };
    
    return {
      url: `${config.baseUrl}/check-out/initialize/${config.merchantId}/${transaction.id}`,
      method: 'POST',
      params: paymentData
    };
  }

  // Upay Integration
  private async initiateUpayPayment(transaction: PaymentTransaction, config: GatewayConfig): Promise<PaymentRedirectData> {
    console.log('Initiating Upay payment:', transaction);
    
    const paymentData = {
      merchant_id: config.merchantId,
      invoice_no: transaction.id,
      amount: transaction.amount.toString(),
      currency: transaction.currency,
      success_url: config.successUrl,
      fail_url: config.failureUrl,
      cancel_url: config.cancelUrl,
      desc: `Badge: ${transaction.badgeType}`,
      cus_name: 'Customer',
      cus_email: 'customer@example.com',
      cus_phone: transaction.mobileNumber,
      signature: this.generateSignature(transaction.id + transaction.amount, config.secretKey)
    };
    
    return {
      url: `${config.baseUrl}/payment/request`,
      method: 'POST',
      params: paymentData
    };
  }

  // Rocket Integration
  private async initiateRocketPayment(transaction: PaymentTransaction, config: GatewayConfig): Promise<PaymentRedirectData> {
    console.log('Initiating Rocket payment:', transaction);
    
    const paymentData = {
      merchant_number: config.merchantId,
      transaction_id: transaction.id,
      amount: transaction.amount.toString(),
      callback_url: config.successUrl,
      mobile_number: transaction.mobileNumber,
      store_id: 'anime_store',
      description: `${transaction.badgeType} Badge Subscription`
    };
    
    return {
      url: `${config.baseUrl}/payment/request`,
      method: 'POST',
      params: paymentData
    };
  }

  // Tap Integration (International)
  private async initiateTapPayment(transaction: PaymentTransaction, config: GatewayConfig): Promise<PaymentRedirectData> {
    console.log('Initiating Tap payment:', transaction);
    
    const paymentData = {
      amount: transaction.amount,
      currency: 'BDT',
      threeDSecure: true,
      save_card: false,
      description: `${transaction.badgeType} Badge - Bangla Anime Verse`,
      statement_descriptor: 'BANGLA_ANIME',
      reference: {
        transaction: transaction.id,
        order: transaction.id
      },
      customer: {
        phone: {
          country_code: '+880',
          number: transaction.mobileNumber
        }
      },
      redirect: {
        url: config.successUrl
      }
    };
    
    return {
      url: `${config.baseUrl}/charges`,
      method: 'POST',
      params: paymentData
    };
  }

  // Verification methods
  async verifyPayment(transactionId: string, gateway: PaymentGateway, gatewayTransactionId: string): Promise<boolean> {
    const config = GATEWAY_CONFIGS[gateway];
    
    try {
      switch (gateway) {
        case 'bkash':
          return this.verifyBkashPayment(transactionId, gatewayTransactionId, config);
        case 'nagad':
          return this.verifyNagadPayment(transactionId, gatewayTransactionId, config);
        case 'upay':
          return this.verifyUpayPayment(transactionId, gatewayTransactionId, config);
        case 'rocket':
          return this.verifyRocketPayment(transactionId, gatewayTransactionId, config);
        case 'tap':
          return this.verifyTapPayment(transactionId, gatewayTransactionId, config);
        default:
          return false;
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  private async verifyBkashPayment(transactionId: string, gatewayTxnId: string, config: GatewayConfig): Promise<boolean> {
    // In production: Make API call to bKash verification endpoint
    console.log('Verifying bKash payment:', { transactionId, gatewayTxnId });
    
    // Demo verification - always returns true for demo
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  private async verifyNagadPayment(transactionId: string, gatewayTxnId: string, config: GatewayConfig): Promise<boolean> {
    console.log('Verifying Nagad payment:', { transactionId, gatewayTxnId });
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  private async verifyUpayPayment(transactionId: string, gatewayTxnId: string, config: GatewayConfig): Promise<boolean> {
    console.log('Verifying Upay payment:', { transactionId, gatewayTxnId });
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  private async verifyRocketPayment(transactionId: string, gatewayTxnId: string, config: GatewayConfig): Promise<boolean> {
    console.log('Verifying Rocket payment:', { transactionId, gatewayTxnId });
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  private async verifyTapPayment(transactionId: string, gatewayTxnId: string, config: GatewayConfig): Promise<boolean> {
    console.log('Verifying Tap payment:', { transactionId, gatewayTxnId });
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  // Utility methods
  private buildQueryString(params: Record<string, string>): string {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  private generateSignature(data: string, secret: string): string {
    // Simple demo signature - in production use proper HMAC-SHA256
    return btoa(data + secret).replace(/=/g, '');
  }

  private generateChallenge(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Process webhook callbacks
  async processWebhook(gateway: PaymentGateway, webhookData: any): Promise<{
    success: boolean;
    transactionId?: string;
    gatewayTransactionId?: string;
    error?: string;
  }> {
    try {
      switch (gateway) {
        case 'bkash':
          return this.processBkashWebhook(webhookData);
        case 'nagad':
          return this.processNagadWebhook(webhookData);
        case 'upay':
          return this.processUpayWebhook(webhookData);
        case 'rocket':
          return this.processRocketWebhook(webhookData);
        case 'tap':
          return this.processTapWebhook(webhookData);
        default:
          return { success: false, error: 'Unsupported gateway' };
      }
    } catch (error) {
      console.error('Webhook processing failed:', error);
      return { success: false, error: 'Webhook processing failed' };
    }
  }

  private processBkashWebhook(data: any) {
    // Process bKash webhook
    return {
      success: data.transactionStatus === 'Completed',
      transactionId: data.merchantInvoiceNumber,
      gatewayTransactionId: data.paymentID
    };
  }

  private processNagadWebhook(data: any) {
    return {
      success: data.status === 'Success',
      transactionId: data.orderId,
      gatewayTransactionId: data.payment_ref_id
    };
  }

  private processUpayWebhook(data: any) {
    return {
      success: data.status === 'SUCCESSFUL',
      transactionId: data.invoice_no,
      gatewayTransactionId: data.transaction_id
    };
  }

  private processRocketWebhook(data: any) {
    return {
      success: data.status === 'SUCCESS',
      transactionId: data.transaction_id,
      gatewayTransactionId: data.rocket_transaction_id
    };
  }

  private processTapWebhook(data: any) {
    return {
      success: data.status === 'CAPTURED',
      transactionId: data.reference.transaction,
      gatewayTransactionId: data.id
    };
  }
}

export const paymentGatewayService = new PaymentGatewayService();
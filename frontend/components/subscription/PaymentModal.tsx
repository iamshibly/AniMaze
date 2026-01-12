// src/components/subscription/PaymentModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Shield,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Wallet,
  Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BadgeType, BADGE_PLANS } from '@/types/subscription';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeType: BadgeType;
  onSuccess: () => void;
}

type PaymentMethod = 'mfs' | 'card';
type PaymentStep = 'select_method' | 'select_gateway' | 'enter_details' | 'success';

// Enhanced payment options for Bangladesh
const PAYMENT_OPTIONS = {
  mfs: {
    name: 'Mobile Financial Services',
    subtitle: 'Most Popular',
    icon: Phone,
    color: 'from-pink-500 to-rose-600',
    gateways: [
      {
        id: 'bkash',
        name: 'bKash',
        icon: '📱',
        description: 'Most popular - Works for e-commerce, subscriptions, bill payments',
        color: 'bg-pink-500',
        fees: 1.85
      },
      {
        id: 'nagad',
        name: 'Nagad',
        icon: '💳',
        description: 'Fast-growing - Lower charges than bKash in some cases',
        color: 'bg-orange-500',
        fees: 1.99
      },
      {
        id: 'rocket',
        name: 'Rocket (DBBL)',
        icon: '🚀',
        description: 'DBBL Mobile Banking - Older but still in use',
        color: 'bg-purple-500',
        fees: 1.75
      },
      {
        id: 'upay',
        name: 'Upay',
        icon: '🏦',
        description: 'United Commercial Bank\'s mobile wallet',
        color: 'bg-red-500',
        fees: 1.5
      }
    ]
  },
  card: {
    name: 'Debit & Credit Cards',
    subtitle: 'Secure Payment',
    icon: CreditCard,
    color: 'from-blue-500 to-indigo-600',
    gateways: [
      {
        id: 'visa',
        name: 'Visa',
        icon: '💳',
        description: 'Issued by local banks - Works locally and internationally',
        color: 'bg-blue-600',
        fees: 2.5
      },
      {
        id: 'mastercard',
        name: 'Mastercard',
        icon: '💳',
        description: 'From Brac Bank, City Bank, Eastern Bank, etc.',
        color: 'bg-red-600',
        fees: 2.5
      },
      {
        id: 'amex',
        name: 'American Express',
        icon: '💳',
        description: 'Premium card option with international support',
        color: 'bg-green-600',
        fees: 3.0
      }
    ]
  }
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  badgeType,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<PaymentStep>('select_method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mfs');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = BADGE_PLANS[badgeType];

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('select_gateway');
  };

  const handleGatewaySelect = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
    setStep('enter_details');
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      
      toast({
        title: "Payment Method Selected! 🎉",
        description: `You've selected ${PAYMENT_OPTIONS[selectedMethod].gateways.find(g => g.id === selectedGateway)?.name} for your ${plan.name} subscription.`,
      });
      
      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset modal state
        setStep('select_method');
        setSelectedMethod('mfs');
        setSelectedGateway('');
        setMobileNumber('');
      }, 2000);
    }, 1500);
  };

  const resetModal = () => {
    setStep('select_method');
    setSelectedMethod('mfs');
    setSelectedGateway('');
    setMobileNumber('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    if (!isProcessing) {
      resetModal();
      onClose();
    }
  };

  const selectedGatewayDetails = selectedGateway ? 
    PAYMENT_OPTIONS[selectedMethod].gateways.find(g => g.id === selectedGateway) : null;

  const totalAmount = selectedGatewayDetails ? 
    plan.price + Math.round(plan.price * (selectedGatewayDetails.fees / 100)) : plan.price;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>Choose Payment Method</span>
          </DialogTitle>
          <DialogDescription>
            Select your preferred payment method for {plan.name} subscription (৳{plan.price})
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'select_method' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(PAYMENT_OPTIONS).map(([key, method]) => {
                  const IconComponent = method.icon;
                  return (
                    <Card
                      key={key}
                      className="cursor-pointer border-2 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                      onClick={() => handleMethodSelect(key as PaymentMethod)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} text-white`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold">{method.name}</h3>
                              {key === 'mfs' && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  {method.subtitle}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {key === 'mfs' 
                                ? 'bKash, Nagad, Rocket, Upay - Quick and convenient'
                                : 'Visa, Mastercard, Amex - Local and international cards'
                              }
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 'select_gateway' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setStep('select_method')}
                  className="p-0 h-auto text-blue-600"
                >
                  Payment Methods
                </Button>
                <span>/</span>
                <span className="font-medium">{PAYMENT_OPTIONS[selectedMethod].name}</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_OPTIONS[selectedMethod].gateways.map((gateway) => (
                  <Card
                    key={gateway.id}
                    className="cursor-pointer border-2 hover:border-blue-500 hover:shadow-md transition-all duration-300"
                    onClick={() => handleGatewaySelect(gateway.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${gateway.color} text-white text-lg`}>
                          {gateway.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{gateway.name}</h4>
                            <span className="text-xs text-gray-500">
                              +{gateway.fees}% fee
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{gateway.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'enter_details' && selectedGatewayDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setStep('select_method')}
                  className="p-0 h-auto text-blue-600"
                >
                  Payment Methods
                </Button>
                <span>/</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setStep('select_gateway')}
                  className="p-0 h-auto text-blue-600"
                >
                  {PAYMENT_OPTIONS[selectedMethod].name}
                </Button>
                <span>/</span>
                <span className="font-medium">{selectedGatewayDetails.name}</span>
              </div>

              {/* Order Summary */}
              <Card className="bg-gray-50">
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{plan.name} Subscription</span>
                      <span>৳{plan.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Fee ({selectedGatewayDetails.fees}%)</span>
                      <span>৳{Math.round(plan.price * (selectedGatewayDetails.fees / 100))}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>৳{totalAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details Form */}
              {selectedMethod === 'mfs' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      placeholder="01XXXXXXXXX"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your {selectedGatewayDetails.name} registered mobile number
                    </p>
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-info">Card Information</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedGatewayDetails.description}
                    </p>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        💡 For international use, ensure your card is activated for online transactions
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('select_gateway')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || (selectedMethod === 'mfs' && !mobileNumber.trim())}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue with {selectedGatewayDetails.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold">Payment Method Selected!</h3>
              <p className="text-gray-600">
                You have chosen {selectedGatewayDetails?.name} for your {plan.name} subscription.
                <br />
                <span className="text-sm">This is a demo - no actual payment will be processed.</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
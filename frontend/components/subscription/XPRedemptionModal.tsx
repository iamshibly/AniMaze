// src/components/subscription/XPRedemptionModal.tsx
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
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Coins,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Gift,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { subscriptionService } from '@/lib/subscriptionService';
import { BadgeType, BADGE_PLANS } from '@/types/subscription';

interface XPRedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeType: BadgeType;
  userXP: number;
  onSuccess: (xpSpent: number) => void;
}

type RedemptionStep = 'confirm' | 'processing' | 'success' | 'error';

const XPRedemptionModal: React.FC<XPRedemptionModalProps> = ({
  isOpen,
  onClose,
  badgeType,
  userXP,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<RedemptionStep>('confirm');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const plan = BADGE_PLANS[badgeType];
  const xpRequired = plan.xpThreshold || 0;
  const xpRemaining = userXP - xpRequired;
  const canRedeem = userXP >= xpRequired;

  const handleRedemption = async () => {
    if (!user || !canRedeem) return;

    setIsProcessing(true);
    setError('');
    setStep('processing');

    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = subscriptionService.redeemBadgeWithXP(user.id, badgeType, userXP);
      
      if (result.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess(xpRequired);
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Redemption failed');
        setStep('error');
      }
    } catch (err: any) {
      console.error('Redemption error:', err);
      setError(err.message || 'Something went wrong');
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setStep('confirm');
    setError('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className={`p-2 rounded-full bg-gradient-to-r ${plan.gradient}`}>
              <span className="text-white text-lg">{plan.icon}</span>
            </div>
            <span>Redeem {plan.name} Badge</span>
          </DialogTitle>
          <DialogDescription>
            Use your XP to unlock premium features without payment
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Confirmation */}
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* XP Status Card */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-900">Your XP Balance</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {userXP.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Required for {plan.name}</span>
                      <span className="font-medium">{xpRequired.toLocaleString()} XP</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (userXP / xpRequired) * 100)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {canRedeem ? '✅ Sufficient XP' : `${(xpRequired - userXP).toLocaleString()} XP needed`}
                      </span>
                      <span>{Math.min(100, Math.round((userXP / xpRequired) * 100))}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badge Benefits */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Gift className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Badge Benefits</span>
                  </div>
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700">
                    <strong>Duration:</strong> {plan.duration} days of premium access
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Summary */}
              <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Current XP</span>
                    <span className="font-mono">{userXP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>XP Cost</span>
                    <span className="font-mono text-red-600">-{xpRequired.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Remaining XP</span>
                    <span className="font-mono">
                      {canRedeem ? xpRemaining.toLocaleString() : 'Insufficient'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Warning for Low XP */}
              {canRedeem && xpRemaining < 1000 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Low XP Warning</p>
                        <p>You'll have only {xpRemaining.toLocaleString()} XP remaining. Consider earning more XP before redeeming.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {canRedeem ? (
                  <Button 
                    onClick={handleRedemption} 
                    className="w-full" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Redeem {plan.name} Badge
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button disabled className="w-full" size="lg">
                      Insufficient XP
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                      Earn {(xpRequired - userXP).toLocaleString()} more XP to redeem this badge
                    </p>
                  </div>
                )}
                
                <Button variant="outline" onClick={onClose} className="w-full">
                  Cancel
                </Button>
              </div>

              {/* XP Earning Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Earn More XP</span>
                  </div>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>• Complete anime/manga: +500 XP</p>
                    <p>• Take quizzes: +100-300 XP</p>
                    <p>• Daily login streak: +50 XP/day</p>
                    <p>• Write reviews: +200 XP</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Processing */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity }
                }}
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-medium">Processing Redemption</h3>
                <p className="text-muted-foreground">
                  Converting your XP to {plan.name} badge...
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Please wait</span>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center text-white text-lg`}>
                    {plan.icon}
                  </div>
                </motion.div>
              </motion.div>
              
              <div>
                <h3 className="text-lg font-medium text-green-600">Badge Redeemed!</h3>
                <p className="text-muted-foreground">
                  Your {plan.name} badge is now active for {plan.duration} days
                </p>
              </div>
              
              <Card className="bg-green-50 border-green-200 text-left">
                <CardContent className="p-3">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>XP Spent:</span>
                      <span className="font-mono text-green-700">-{xpRequired.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining XP:</span>
                      <span className="font-mono">{(userXP - xpRequired).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-sm text-muted-foreground">
                Taking you back to subscription page...
              </div>
            </motion.div>
          )}

          {/* Step 4: Error */}
          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-600">Redemption Failed</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={() => setStep('confirm')} variant="outline">
                  Try Again
                </Button>
                <Button onClick={onClose} variant="ghost">
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default XPRedemptionModal;
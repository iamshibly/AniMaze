// src/pages/Subscription.tsx - Updated with Payment Modal Integration
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Crown,
  Gem,
  Shield,
  Award,
  Star,
  CreditCard,
  Sparkles,
  CheckCircle,
  Timer,
  ArrowRight,
  Coins,
  Rocket,
  Users,
  TrendingUp,
  Gift,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BADGE_PLANS, BadgeType } from '@/types/subscription';
import PaymentModal from '@/components/subscription/PaymentModal';
import XPRedemptionModal from '@/components/subscription/XPRedemptionModal';

const Subscription: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<BadgeType>('bronze');
  const [xpModalOpen, setXpModalOpen] = useState(false);
  const [selectedXpPlan, setSelectedXpPlan] = useState<BadgeType>('bronze');

  // Mock user data - replace with actual user service calls
  const userXP = 15000;
  const userLevel = Math.floor(userXP / 1000);

  // Badge plans with dynamic pricing based on billing cycle
  const badgePlans = [
    {
      id: 'bronze',
      name: 'Bronze Guardian',
      tagline: 'Start your journey',
      duration: isYearly ? 365 : 30,
      price: isYearly ? 2000 : 200,
      originalPrice: isYearly ? 2400 : 240,
      xpThreshold: 7000,
      features: [
        'Ad-free streaming',
        'Full manga library',
        'Offline downloads',
        'Bronze badge & status',
        'Priority notifications',
        'HD audio quality'
      ],
      color: 'from-amber-400 via-orange-500 to-amber-600',
      bgPattern: 'bg-gradient-to-br from-amber-50 to-orange-100',
      borderColor: 'border-amber-300',
      icon: Shield,
      savings: isYearly ? 17 : 0
    },
    {
      id: 'silver',
      name: 'Silver Champion',
      tagline: 'Most popular choice',
      duration: isYearly ? 365 : 90,
      price: isYearly ? 4800 : 500,
      originalPrice: isYearly ? 6000 : 600,
      xpThreshold: 12500,
      features: [
        'All Bronze features',
        'Priority support',
        'Exclusive content early access',
        'Community perks',
        'Custom profile themes',
        'Silver badge & VIP status',
        'Monthly bonus XP'
      ],
      color: 'from-gray-300 via-slate-400 to-gray-500',
      bgPattern: 'bg-gradient-to-br from-slate-50 to-gray-100',
      borderColor: 'border-slate-300',
      icon: Award,
      popular: true,
      savings: isYearly ? 20 : 0
    },
    {
      id: 'gold',
      name: 'Gold Master',
      tagline: 'For serious otaku',
      duration: isYearly ? 365 : 180,
      price: isYearly ? 9600 : 1000,
      originalPrice: isYearly ? 12000 : 1200,
      xpThreshold: 25000,
      features: [
        'All Silver features',
        '4K streaming quality',
        'Beta features access',
        'Advanced analytics',
        'Gaming integration',
        'Gold badge & Elite status',
        'Double XP events',
        'Creator support perks'
      ],
      color: 'from-yellow-400 via-yellow-500 to-amber-500',
      bgPattern: 'bg-gradient-to-br from-yellow-50 to-amber-100',
      borderColor: 'border-yellow-400',
      icon: Crown,
      savings: isYearly ? 20 : 0
    },
    {
      id: 'diamond',
      name: 'Diamond Legend',
      tagline: 'Ultimate experience',
      duration: isYearly ? 365 : 365,
      price: isYearly ? 14400 : 1500,
      originalPrice: isYearly ? 18000 : 1800,
      features: [
        'All Gold features',
        'VIP-only events',
        'Direct creator contact',
        'Exclusive merchandise',
        'Custom animations',
        'Diamond badge & Legendary status',
        'Personal account manager',
        'Early feature previews'
      ],
      color: 'from-cyan-400 via-blue-500 to-indigo-600',
      bgPattern: 'bg-gradient-to-br from-cyan-50 to-blue-100',
      borderColor: 'border-cyan-400',
      icon: Gem,
      exclusive: true,
      savings: isYearly ? 20 : 0
    }
  ];

  // Get current level progress
  const getXPProgress = () => {
    const nextLevelXP = (userLevel + 1) * 1000;
    const currentLevelXP = userLevel * 1000;
    const progress = ((userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Premium Subscription Plans</span>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-4">
              Unlock Your
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Anime </span>
              Journey
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Choose your path to premium features, exclusive content, and legendary status in the anime community
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm p-1 rounded-full">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isYearly ? 'bg-white text-gray-900' : 'text-white/80 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
                  isYearly ? 'bg-white text-gray-900' : 'text-white/80 hover:text-white'
                }`}
              >
                Yearly
                {isYearly && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white text-xs px-2 py-0">Save 20%</Badge>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* User Stats */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/20 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <BarChart3 className="w-6 h-6 text-blue-400" />
                      <span className="text-2xl font-bold">Level {userLevel}</span>
                    </div>
                    <p className="text-white/70 text-sm mb-2">Current Level</p>
                    <Progress value={getXPProgress()} className="h-2 bg-white/20" />
                  </div>

                  <div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      <span className={`text-2xl font-bold transition-all duration-300 ${
                        userXP > 10000 ? 'scale-110' : ''
                      }`}>
                        {userXP.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-2">Total XP Earned</p>
                    <Progress value={getXPProgress()} className="h-2 bg-white/20" />
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Timer className="w-6 h-6 text-orange-400" />
                      <span className="text-2xl font-bold">Free User</span>
                    </div>
                    <p className="text-white/70 text-sm">Current Status</p>
                    <Button size="sm" variant="outline" className="mt-2 hover:bg-white/10">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {badgePlans.map((plan) => {
            const IconComponent = plan.icon;
            const canRedeemWithXP = plan.xpThreshold && userXP >= plan.xpThreshold;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <Card 
                key={plan.id}
                className={`
                  relative overflow-hidden transition-all duration-300 cursor-pointer group
                  hover:shadow-2xl hover:scale-105 ${plan.bgPattern}
                  ${isSelected ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : ''}
                  ${plan.popular ? 'ring-2 ring-purple-500' : ''}
                  ${plan.exclusive ? 'ring-2 ring-gradient-to-r from-cyan-500 to-blue-500' : ''}
                `}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Plan badges */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {plan.exclusive && (
                  <div className="absolute -top-3 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP
                    </Badge>
                  </div>
                )}

                {plan.savings > 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Save {plan.savings}%
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">{plan.tagline}</CardDescription>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold">৳{plan.price}</span>
                      <div className="text-left">
                        <div className="text-sm text-gray-500 line-through">৳{plan.originalPrice}</div>
                        <div className="text-sm text-gray-600">/{isYearly ? 'year' : plan.duration > 30 ? `${Math.floor(plan.duration / 30)} months` : 'month'}</div>
                      </div>
                    </div>
                    
                    {plan.savings > 0 && (
                      <div className="text-green-600 text-sm font-medium">
                        Save ৳{plan.originalPrice - plan.price} with this plan!
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="p-1 rounded-lg bg-gray-100">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium flex-1">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* XP Redemption */}
                  {plan.xpThreshold && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center">
                          <Coins className="w-4 h-4 mr-1 text-purple-600" />
                          XP Redemption
                        </span>
                        <span className="font-bold text-purple-600">{plan.xpThreshold.toLocaleString()} XP</span>
                      </div>
                      
                      <Progress 
                        value={Math.min(100, (userXP / plan.xpThreshold) * 100)} 
                        className="h-2 mb-2 bg-purple-200" 
                      />
                      
                      {canRedeemWithXP ? (
                        <Badge className="bg-green-500 text-white w-full justify-center">
                          <Gift className="w-3 h-3 mr-1" />
                          Ready to Redeem!
                        </Badge>
                      ) : (
                        <div className="text-xs text-gray-600 text-center">
                          Need {(plan.xpThreshold - userXP).toLocaleString()} more XP
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className={`w-full h-12 font-semibold transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                          : plan.exclusive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      }`}
                      onClick={() => {
                        setSelectedPaymentPlan(plan.id as BadgeType);
                        setPaymentModalOpen(true);
                      }}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Choose {plan.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {canRedeemWithXP && (
                      <Button 
                        variant="outline" 
                        className="w-full h-10 border-purple-200 text-purple-600 hover:bg-purple-50"
                        onClick={() => {
                          setSelectedXpPlan(plan.id as BadgeType);
                          setXpModalOpen(true);
                        }}
                      >
                        <Coins className="w-4 h-4 mr-2" />
                        Redeem with XP
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Premium?</h2>
            <p className="text-xl text-gray-600">Unlock the full potential of your anime experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Experience blazing fast streaming with 4K quality and zero buffering</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Exclusive Access</h3>
              <p className="text-gray-600">Get early access to new releases and exclusive premium content</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">VIP Community</h3>
              <p className="text-gray-600">Join an elite community of anime enthusiasts with exclusive perks</p>
            </div>
          </div>
        </div>
      </div>

      {/* XP Earning Guide */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Earn XP & Redeem Badges</h2>
            <p className="text-xl text-gray-600 mb-8">Build your XP and unlock premium badges without payment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Complete Quizzes</h3>
              <p className="text-sm text-gray-600 mb-2">+50-100 XP per quiz</p>
              <Badge variant="secondary">Active</Badge>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Community Engagement</h3>
              <p className="text-sm text-gray-600 mb-2">+25-50 XP per action</p>
              <Badge variant="secondary">Coming Soon</Badge>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">Daily Activities</h3>
              <p className="text-sm text-gray-600 mb-2">+10-30 XP daily</p>
              <Badge variant="secondary">Active</Badge>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">Special Events</h3>
              <p className="text-sm text-gray-600 mb-2">+100-500 XP bonus</p>
              <Badge variant="secondary">Seasonal</Badge>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        badgeType={selectedPaymentPlan}
        onSuccess={() => {
          // Handle successful payment selection
          toast({
            title: "Payment Method Selected! 🎉",
            description: `Ready to upgrade to ${BADGE_PLANS[selectedPaymentPlan].name}!`,
          });
        }}
      />

      {/* XP Redemption Modal */}
      <XPRedemptionModal
        isOpen={xpModalOpen}
        onClose={() => setXpModalOpen(false)}
        badgeType={selectedXpPlan}
        userXP={userXP}
        onSuccess={(xpSpent: number) => {
          // Handle successful XP redemption
          toast({
            title: "Badge Redeemed! ✨",
            description: `You've redeemed ${BADGE_PLANS[selectedXpPlan].name} for ${xpSpent} XP!`,
          });
          // You might want to refresh user data here
        }}
      />
    </div>
  );
};

export default Subscription;
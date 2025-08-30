import { useState } from 'react';
import { CreditCard, DollarSign, Crown, Zap, Check, Star, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PayPalButton from './PayPalButton';
import CryptoDonation from './CryptoDonation';
import GroupSubscription from './GroupSubscription';

interface PaymentSystemProps {
  onUpgrade: () => void;
}

export function PaymentSystem({ onUpgrade }: PaymentSystemProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'premium' | 'group' | 'donate'>('premium');

  const plans = {
    monthly: {
      price: 15,
      period: 'month',
      savings: 0,
      total: 15
    },
    yearly: {
      price: 120,
      period: 'year',
      savings: 60,
      total: 120
    }
  };

  const premiumFeatures = [
    'Unlimited AI prophecy analysis',
    'Priority crisis response alerts',
    'Advanced prophet verification scores',
    'Custom prophecy timeline exports',
    'Live prophet session recordings',
    'Premium prediction market access',
    'Ad-free experience',
    'Enhanced social sharing tools',
    'Early access to new features',
    'Direct support channel'
  ];

  const handlePayPalPayment = () => {
    // PayPal payment will be handled by PayPalButton component
    setProcessingPayment(false);
    setShowPaymentModal(false);
    onUpgrade();
  };

  const getPlanValue = () => {
    const plan = plans[selectedPlan];
    const monthlyValue = plan.price / (selectedPlan === 'yearly' ? 12 : 1);
    return monthlyValue.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Subscription & Support Options</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your spiritual journey or support our ministry
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'premium' | 'group' | 'donate')} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="premium" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Premium
          </TabsTrigger>
          <TabsTrigger value="group" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="donate" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Donate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="premium" className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Premium Individual Plan</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get unlimited access to AI-powered prophecy analysis, priority crisis alerts, and exclusive prediction markets.
            </p>
          </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg">
          <Button
            variant={selectedPlan === 'monthly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedPlan('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={selectedPlan === 'yearly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedPlan('yearly')}
            className="relative"
          >
            Yearly
            {plans.yearly.savings > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                Save ${plans.yearly.savings}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Premium Plan Card */}
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Premium Plan</CardTitle>
            <div className="space-y-2">
              <div className="text-4xl font-bold">
                ${getPlanValue()}
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              {selectedPlan === 'yearly' && (
                <p className="text-sm text-green-600 font-medium">
                  Billed ${plans.yearly.price} yearly - Save ${plans.yearly.savings}!
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              size="lg"
              onClick={() => setShowPaymentModal(true)}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              30-day money-back guarantee • Cancel anytime
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Instant Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Get priority notifications when global events match prophetic patterns
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Star className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Expert Analysis</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered insights from verified prophetic voices and scholars
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Prediction Markets</h3>
            <p className="text-sm text-muted-foreground">
              Access exclusive prophetic prediction markets and earn rewards
            </p>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="group" className="space-y-6">
          <GroupSubscription onSubscriptionComplete={(groupName, memberCount) => {
            console.log(`Group subscription: ${groupName} with ${memberCount} members`);
            onUpgrade();
          }} />
        </TabsContent>

        <TabsContent value="donate" className="space-y-6">
          <CryptoDonation onDonationComplete={(amount, currency) => {
            console.log(`Donation: ${amount} ${currency}`);
          }} />
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Upgrade</DialogTitle>
            <DialogDescription>
              Secure payment processing for your Premium subscription
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Premium Plan ({selectedPlan})</span>
                <span className="font-bold">${plans[selectedPlan].price}</span>
              </div>
              {selectedPlan === 'yearly' && (
                <div className="text-sm text-green-600 mt-1">
                  Save ${plans.yearly.savings} vs monthly billing
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Secure payment processing with PayPal
                </p>
              </div>
              
              <div className="flex justify-center">
                <PayPalButton
                  amount={plans[selectedPlan].price.toString()}
                  currency="USD"
                  intent="capture"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
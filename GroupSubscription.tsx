import { useState } from 'react';
import { Users, Church, BookOpen, Crown, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PayPalButton from './PayPalButton';

interface GroupSubscriptionProps {
  onSubscriptionComplete?: (groupName: string, memberCount: number) => void;
}

export default function GroupSubscription({ onSubscriptionComplete }: GroupSubscriptionProps) {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'family' | 'ministry' | 'enterprise'>('family');
  const [groupName, setGroupName] = useState('');
  const [memberCount, setMemberCount] = useState('5');
  const [contactInfo, setContactInfo] = useState('');

  const groupPlans = {
    family: {
      name: 'Family Plan',
      icon: Users,
      memberLimit: 6,
      price: 19.99,
      originalPrice: 59.94, // 6 x $9.99
      savings: 39.95,
      features: [
        'Up to 6 family members',
        'Shared prophecy timeline',
        'Family prayer requests',
        'Parental content controls',
        'All premium features included',
        'Priority family crisis alerts'
      ],
      description: 'Perfect for Christian families wanting to stay spiritually connected'
    },
    ministry: {
      name: 'Ministry Plan',
      icon: Church,
      memberLimit: 25,
      price: 49.99,
      originalPrice: 249.75, // 25 x $9.99
      savings: 199.76,
      features: [
        'Up to 25 ministry members',
        'Ministry dashboard & analytics',
        'Bulk prophecy sharing tools',
        'Prayer chain coordination',
        'Custom ministry branding',
        'Dedicated ministry support',
        'Event planning integration',
        'Sermon planning assistance'
      ],
      description: 'Designed for churches, Bible study groups, and ministry teams'
    },
    enterprise: {
      name: 'Enterprise Plan',
      icon: BookOpen,
      memberLimit: 100,
      price: 149.99,
      originalPrice: 999.00, // 100 x $9.99
      savings: 849.01,
      features: [
        'Up to 100 organization members',
        'Advanced admin controls',
        'White-label customization',
        'API access for integration',
        'Dedicated account manager',
        'Custom training sessions',
        'Priority technical support',
        'Advanced analytics & reporting',
        'Multi-location support'
      ],
      description: 'For large organizations, seminaries, and multi-site ministries'
    }
  };

  const handleGroupSubscription = () => {
    const plan = groupPlans[selectedPlan];
    onSubscriptionComplete?.(groupName, plan.memberLimit);
    setShowGroupModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Group & Ministry Plans</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Bring your entire family, Bible study group, or ministry team together with significant savings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupPlans).map(([key, plan]) => {
          const IconComponent = plan.icon;
          const isPopular = key === 'ministry';
          
          return (
            <Card key={key} className={`relative ${isPopular ? 'border-2 border-primary' : ''}`}>
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className={`p-3 rounded-full ${
                    key === 'family' ? 'bg-blue-100 dark:bg-blue-900' :
                    key === 'ministry' ? 'bg-purple-100 dark:bg-purple-900' :
                    'bg-orange-100 dark:bg-orange-900'
                  }`}>
                    <IconComponent className={`h-8 w-8 ${
                      key === 'family' ? 'text-blue-600' :
                      key === 'ministry' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground line-through">
                      Individual plans: ${plan.originalPrice}/month
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      Save ${plan.savings} per month!
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full ${
                    key === 'family' ? 'bg-blue-500 hover:bg-blue-600' :
                    key === 'ministry' ? 'bg-purple-500 hover:bg-purple-600' :
                    'bg-orange-500 hover:bg-orange-600'
                  }`}
                  onClick={() => {
                    setSelectedPlan(key as 'family' | 'ministry' | 'enterprise');
                    setShowGroupModal(true);
                  }}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  Get {plan.name}
                </Button>
                
                <div className="text-center text-xs text-muted-foreground">
                  Up to {plan.memberLimit} members • Cancel anytime
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Group Setup Modal */}
      <Dialog open={showGroupModal} onOpenChange={setShowGroupModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Up Your {groupPlans[selectedPlan].name}</DialogTitle>
            <DialogDescription>
              Configure your group subscription details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{groupPlans[selectedPlan].name}</span>
                <span className="font-bold">${groupPlans[selectedPlan].price}/month</span>
              </div>
              <div className="text-sm text-green-600 mt-1">
                Save ${groupPlans[selectedPlan].savings} vs individual plans
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">
                  {selectedPlan === 'family' ? 'Family Name' : 
                   selectedPlan === 'ministry' ? 'Ministry/Church Name' : 
                   'Organization Name'}
                </Label>
                <Input
                  id="group-name"
                  placeholder={
                    selectedPlan === 'family' ? 'The Smith Family' :
                    selectedPlan === 'ministry' ? 'Grace Community Church' :
                    'Covenant Seminary'
                  }
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-count">Expected Number of Members</Label>
                <Input
                  id="member-count"
                  type="number"
                  min="2"
                  max={groupPlans[selectedPlan].memberLimit}
                  value={memberCount}
                  onChange={(e) => setMemberCount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Up to {groupPlans[selectedPlan].memberLimit} members included
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-info">Contact Information</Label>
                <Textarea
                  id="contact-info"
                  placeholder="Primary contact email and phone number"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">
                Secure payment processing with PayPal
              </p>
            </div>
            
            <div className="flex justify-center">
              <PayPalButton
                amount={groupPlans[selectedPlan].price.toString()}
                currency="USD"
                intent="capture"
              />
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowGroupModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Why Choose Group Plans?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Save up to 85% vs individual subscriptions</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Shared prophecy insights and prayer chains</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-500" />
              <span>Priority support and advanced features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
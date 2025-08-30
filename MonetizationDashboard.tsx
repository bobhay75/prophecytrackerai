import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Crown, Target, Zap, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RevenueMetrics {
  dailyRevenue: number;
  monthlyRevenue: number;
  yearlyProjection: number;
  premiumSubscribers: number;
  conversionRate: number;
  predictionMarketVolume: number;
  liveSessionRevenue: number;
  donationRevenue: number;
}

interface SubscriptionTier {
  name: string;
  price: number;
  users: number;
  revenue: number;
  growthRate: number;
}

export function MonetizationDashboard() {
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
    dailyRevenue: 7890,
    monthlyRevenue: 228420,
    yearlyProjection: 2741040,
    premiumSubscribers: 8947,
    conversionRate: 12.3,
    predictionMarketVolume: 52800,
    liveSessionRevenue: 1850,
    donationRevenue: 3200
  });

  const subscriptionTiers: SubscriptionTier[] = [
    {
      name: 'Premium Monthly',
      price: 15,
      users: 6847,
      revenue: 102705,
      growthRate: 18.5
    },
    {
      name: 'Premium Yearly',
      price: 120,
      users: 2100,
      revenue: 252000,
      growthRate: 24.2
    },
    {
      name: 'Prophet Pro',
      price: 45,
      users: 342,
      revenue: 15390,
      growthRate: 31.7
    }
  ];

  const revenueStreams = [
    {
      name: 'Premium Subscriptions',
      revenue: 370095,
      percentage: 85.2,
      trend: '+23.4%',
      icon: Crown,
      color: 'text-purple-600'
    },
    {
      name: 'Prediction Markets',
      revenue: 52800,
      percentage: 12.2,
      trend: '+67.8%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      name: 'Live Prophet Sessions',
      revenue: 7400,
      percentage: 1.7,
      trend: '+45.2%',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      name: 'Crisis Donations',
      revenue: 3900,
      percentage: 0.9,
      trend: '+112.5%',
      icon: Zap,
      color: 'text-red-600'
    }
  ];

  const goalMetrics = [
    {
      name: 'Monthly Revenue Goal',
      current: 228420,
      target: 250000,
      percentage: 91.4
    },
    {
      name: 'Subscriber Target',
      current: 8947,
      target: 10000,
      percentage: 89.5
    },
    {
      name: 'Conversion Rate Goal',
      current: 12.3,
      target: 15.0,
      percentage: 82.0
    }
  ];

  useEffect(() => {
    // Simulate real-time revenue updates
    const interval = setInterval(() => {
      setRevenueMetrics(prev => ({
        ...prev,
        dailyRevenue: prev.dailyRevenue + Math.floor(Math.random() * 200),
        predictionMarketVolume: prev.predictionMarketVolume + Math.floor(Math.random() * 500)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Revenue Dashboard</h2>
        <p className="text-muted-foreground">Real-time monetization tracking and growth metrics</p>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700 dark:text-green-300">Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              ${revenueMetrics.dailyRevenue.toLocaleString()}
            </div>
            <Badge className="bg-green-500 text-white mt-1">+12.4% vs yesterday</Badge>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700 dark:text-blue-300">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              ${revenueMetrics.monthlyRevenue.toLocaleString()}
            </div>
            <Badge className="bg-blue-500 text-white mt-1">+34.7% vs last month</Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700 dark:text-purple-300">Premium Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {revenueMetrics.premiumSubscribers.toLocaleString()}
            </div>
            <Badge className="bg-purple-500 text-white mt-1">+18.5% growth</Badge>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-700 dark:text-orange-300">Yearly Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              ${(revenueMetrics.yearlyProjection / 1000000).toFixed(2)}M
            </div>
            <Badge className="bg-orange-500 text-white mt-1">On track for $3M+</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="streams" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          <TabsTrigger value="analytics">Live Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="streams" className="space-y-4">
          <div className="grid gap-4">
            {revenueStreams.map((stream, index) => {
              const Icon = stream.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-6 w-6 ${stream.color}`} />
                        <div>
                          <h3 className="font-semibold">{stream.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {stream.percentage}% of total revenue
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          ${stream.revenue.toLocaleString()}
                        </div>
                        <Badge className="bg-green-500 text-white">
                          {stream.trend}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={stream.percentage} className="mt-3" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="grid gap-4">
            {subscriptionTiers.map((tier, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${tier.price}/month • {tier.users.toLocaleString()} subscribers
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        ${tier.revenue.toLocaleString()}
                      </div>
                      <Badge className="bg-blue-500 text-white">
                        +{tier.growthRate}% growth
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Revenue</span>
                      <span>${tier.revenue.toLocaleString()}</span>
                    </div>
                    <Progress value={(tier.revenue / 400000) * 100} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4">
            {goalMetrics.map((goal, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{goal.name}</h3>
                    <Badge variant={goal.percentage >= 90 ? "default" : "secondary"}>
                      {goal.percentage.toFixed(1)}% Complete
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {goal.current.toLocaleString()}</span>
                      <span>Target: {goal.target.toLocaleString()}</span>
                    </div>
                    <Progress value={goal.percentage} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Live Prediction Market</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${revenueMetrics.predictionMarketVolume.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">24h trading volume</p>
                <Button className="w-full mt-3" variant="outline">
                  View Active Markets
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Conversion Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {revenueMetrics.conversionRate}%
                </div>
                <p className="text-sm text-muted-foreground">Free to Premium conversion</p>
                <Button className="w-full mt-3" variant="outline">
                  Optimize Funnel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Prophet Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  ${revenueMetrics.liveSessionRevenue.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Weekly session revenue</p>
                <Button className="w-full mt-3" variant="outline">
                  Schedule Sessions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Crisis Donations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${revenueMetrics.donationRevenue.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Emergency response fund</p>
                <Button className="w-full mt-3" variant="outline">
                  Active Crises
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Center */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Revenue Optimization Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
              Launch Premium Campaign
            </Button>
            <Button variant="outline">
              Create Viral Crisis Alert
            </Button>
            <Button variant="outline">
              Start Prophet Verification Drive
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Projected monthly revenue increase: $45,000 - $75,000
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
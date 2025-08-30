import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Users, DollarSign, Target, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';

interface ProphecyMarket {
  id: number;
  title: string;
  description: string;
  category: 'biblical' | 'current-events' | 'economic' | 'natural';
  timeframe: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  participants: number;
  confidence: number;
  scripture?: string;
  deadline: Date;
  trending: boolean;
}

interface UserPosition {
  marketId: number;
  position: 'yes' | 'no';
  amount: number;
  price: number;
  potentialReturn: number;
}

interface BlockchainStatus {
  isInitialized: boolean;
  walletAddress: string | null;
  network: string;
  features: {
    prophecyBetting: boolean;
    smartContracts: boolean;
    tokenStaking: boolean;
  };
}

export function PredictionMarkets() {
  const [activeTab, setActiveTab] = useState('trending');
  const [betAmount, setBetAmount] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  
  // Check blockchain status
  const { data: blockchainStatus } = useQuery<BlockchainStatus>({
    queryKey: ['/api/blockchain/status'],
    refetchInterval: 30000 // Check every 30 seconds
  });

  const markets: ProphecyMarket[] = [
    {
      id: 1,
      title: "Major Economic Collapse by End of 2025",
      description: "Will there be a significant global economic recession matching biblical end-times prophecies?",
      category: 'economic',
      timeframe: "End of 2025",
      yesPrice: 0.34,
      noPrice: 0.66,
      volume: 128500,
      participants: 2847,
      confidence: 78,
      scripture: "Revelation 18:17 - 'In one hour such great riches came to nothing'",
      deadline: new Date('2025-12-31'),
      trending: true
    },
    {
      id: 2,
      title: "Third Temple Construction Begins",
      description: "Will construction of the Third Temple in Jerusalem officially commence?",
      category: 'biblical',
      timeframe: "Next 3 years",
      yesPrice: 0.23,
      noPrice: 0.77,
      volume: 95200,
      participants: 1923,
      confidence: 85,
      scripture: "2 Thessalonians 2:4 - 'He will oppose and exalt himself'",
      deadline: new Date('2027-12-31'),
      trending: true
    },
    {
      id: 3,
      title: "Major Volcanic Eruption Affects Global Climate",
      description: "Will a volcanic eruption cause widespread atmospheric changes?",
      category: 'natural',
      timeframe: "Next 2 years",
      yesPrice: 0.45,
      noPrice: 0.55,
      volume: 67800,
      participants: 1456,
      confidence: 62,
      scripture: "Revelation 8:8 - 'Something like a huge mountain, all ablaze, was thrown into the sea'",
      deadline: new Date('2026-12-31'),
      trending: false
    },
    {
      id: 4,
      title: "Middle East Peace Treaty Signed",
      description: "Will a comprehensive peace agreement be signed involving Israel and multiple Arab nations?",
      category: 'current-events',
      timeframe: "Next 18 months",
      yesPrice: 0.67,
      noPrice: 0.33,
      volume: 145600,
      participants: 3421,
      confidence: 73,
      scripture: "Daniel 9:27 - 'He will confirm a covenant with many for one week'",
      deadline: new Date('2026-06-30'),
      trending: true
    }
  ];

  const userPositions: UserPosition[] = [
    {
      marketId: 1,
      position: 'yes',
      amount: 250,
      price: 0.32,
      potentialReturn: 531.25
    },
    {
      marketId: 4,
      position: 'yes',
      amount: 100,
      price: 0.65,
      potentialReturn: 153.85
    }
  ];

  const getCategoryColor = (category: ProphecyMarket['category']) => {
    switch (category) {
      case 'biblical': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'economic': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'natural': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'current-events': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const calculateTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Expired';
  };

  const handlePlaceBet = (marketId: number, position: 'yes' | 'no') => {
    // Validate bet amount
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid bet amount');
      return;
    }
    
    // Process the bet
    console.log(`Placing bet: Market ${marketId}, Position: ${position}, Amount: $${betAmount}`);
    
    // Show success message
    const market = markets.find(m => m.id === marketId);
    if (market) {
      const price = position === 'yes' ? market.yesPrice : market.noPrice;
      const potentialReturn = amount / price;
      alert(`Bet placed successfully!\n\nMarket: ${market.title}\nPosition: ${position.toUpperCase()}\nAmount: $${amount.toFixed(2)}\nPotential Return: $${potentialReturn.toFixed(2)}`);
    }
    
    // Reset form
    setSelectedMarket(null);
    setBetAmount('');
  };

  const trendingMarkets = markets.filter(m => m.trending);
  const allMarkets = markets;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Prophecy Prediction Markets</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Bet on prophetic events and test your discernment. Earn rewards for accurate predictions about biblical end-times events.
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full">
            💰 $2.4M Total Volume
          </div>
          <div className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">
            👥 12,847 Active Traders
          </div>
          <div className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full">
            📈 76% Average Accuracy
          </div>
          {blockchainStatus?.isInitialized && (
            <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full flex items-center gap-1">
              <Wallet className="w-3 h-3" />
              MetaMask Connected
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">🔥 Trending</TabsTrigger>
          <TabsTrigger value="all">📊 All Markets</TabsTrigger>
          <TabsTrigger value="portfolio">💼 My Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid gap-4">
            {trendingMarkets.map((market) => (
              <Card key={market.id} className="border border-border/50 hover:border-border transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-semibold">{market.title}</CardTitle>
                        {market.trending && (
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <Badge className={getCategoryColor(market.category)}>
                        {market.category.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {calculateTimeRemaining(market.deadline)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {market.participants.toLocaleString()} traders
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{market.description}</p>
                  {market.scripture && (
                    <div className="bg-muted/50 p-3 rounded-lg border border-border/30">
                      <p className="text-sm italic text-foreground">"{market.scripture}"</p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">YES PRICE</div>
                      <div className="text-2xl font-bold text-green-500">${market.yesPrice.toFixed(2)}</div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-xs text-muted-foreground">NO PRICE</div>
                      <div className="text-2xl font-bold text-red-500">${market.noPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Community Confidence</span>
                      <span>{market.confidence}%</span>
                    </div>
                    <Progress value={market.confidence} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${market.volume.toLocaleString()} volume
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {market.timeframe}
                    </div>
                  </div>

                  {selectedMarket === market.id ? (
                    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Bet amount ($)"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            className="flex-1"
                            min="1"
                            step="1"
                          />
                        </div>
                        {betAmount && (
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex justify-between">
                              <span>Potential YES Return:</span>
                              <span className="text-green-500 font-semibold">
                                ${(parseFloat(betAmount) / market.yesPrice || 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Potential NO Return:</span>
                              <span className="text-red-500 font-semibold">
                                ${(parseFloat(betAmount) / market.noPrice || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handlePlaceBet(market.id, 'yes')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={!betAmount}
                        >
                          Bet YES (${market.yesPrice.toFixed(2)})
                        </Button>
                        <Button 
                          onClick={() => handlePlaceBet(market.id, 'no')}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          disabled={!betAmount}
                        >
                          Bet NO (${market.noPrice.toFixed(2)})
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedMarket(null)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setSelectedMarket(market.id)}
                      className="w-full"
                      variant="outline"
                    >
                      Place Bet
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {allMarkets.map((market) => (
              <Card key={market.id} className="border border-border/50 hover:border-border transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg font-semibold">{market.title}</CardTitle>
                      <Badge className={getCategoryColor(market.category)}>
                        {market.category.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-muted-foreground">{calculateTimeRemaining(market.deadline)}</div>
                      <div className="text-sm text-muted-foreground">{market.participants.toLocaleString()} traders</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{market.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">${market.yesPrice.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">YES</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-500">${market.noPrice.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">NO</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Active Positions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userPositions.map((position) => {
                const market = markets.find(m => m.id === position.marketId);
                if (!market) return null;
                
                return (
                  <div key={position.marketId} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{market.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Position: <span className={position.position === 'yes' ? 'text-green-500' : 'text-red-500'}>
                          {position.position.toUpperCase()}
                        </span> • ${position.amount} at ${position.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-500">${position.potentialReturn.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Potential Return</div>
                    </div>
                  </div>
                );
              })}
              {userPositions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No active positions. Start betting on prophecy markets to build your portfolio!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
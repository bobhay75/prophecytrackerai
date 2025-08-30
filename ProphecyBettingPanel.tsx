import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMetaMask } from '@/components/MetaMaskProvider';
import { BettingStats } from '@/components/BettingStats';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users,
  Shield,
  Zap,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface ProphecyBet {
  id: string;
  prophecyText: string;
  prediction: string;
  odds: number;
  totalPool: number;
  yesStake: number;
  noStake: number;
  deadline: string;
  category: 'earthquake' | 'conflict' | 'economic' | 'space' | 'plague';
  confidence: number;
}

export const ProphecyBettingPanel: React.FC = () => {
  const { isConnected, account, sendTransaction } = useMetaMask();
  const [selectedBet, setSelectedBet] = useState<ProphecyBet | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [betSide, setBetSide] = useState<'yes' | 'no'>('yes');
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const activeBets: ProphecyBet[] = [
    {
      id: 'bet-001',
      prophecyText: 'And there shall be earthquakes in diverse places',
      prediction: 'Major earthquake (7.0+) in Turkey within 30 days',
      odds: 2.3,
      totalPool: 45.7,
      yesStake: 28.4,
      noStake: 17.3,
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'earthquake',
      confidence: 78
    },
    {
      id: 'bet-002',
      prophecyText: 'Wars and rumours of wars... nation shall rise against nation',
      prediction: 'Israel-Iran conflict escalation within 14 days',
      odds: 1.8,
      totalPool: 67.2,
      yesStake: 42.1,
      noStake: 25.1,
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'conflict',
      confidence: 85
    },
    {
      id: 'bet-003',
      prophecyText: 'There shall be signs in the sun, and in the moon, and in the stars',
      prediction: 'Solar storm disrupts satellites within 7 days',
      odds: 4.2,
      totalPool: 23.8,
      yesStake: 8.7,
      noStake: 15.1,
      deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'space',
      confidence: 45
    }
  ];

  const getCategoryIcon = (category: ProphecyBet['category']) => {
    switch (category) {
      case 'earthquake': return '🌋';
      case 'conflict': return '⚔️';
      case 'economic': return '💰';
      case 'space': return '🌟';
      case 'plague': return '🦠';
      default: return '📜';
    }
  };

  const getCategoryColor = (category: ProphecyBet['category']) => {
    switch (category) {
      case 'earthquake': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'conflict': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'economic': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'space': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'plague': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const handlePlaceBet = async () => {
    if (!isConnected || !selectedBet || !betAmount) return;

    setIsPlacingBet(true);
    try {
      // Convert ETH to wei for transaction
      const weiAmount = (parseFloat(betAmount) * 1e18).toString();
      
      // Prophecy smart contract address (mainnet deployment)
      const contractAddress = '0x742d35Cc6634C0532925a3b8D3C4A8bc8C6e0000';
      
      const txHash = await sendTransaction(contractAddress, weiAmount);
      
      // Store bet in backend
      const response = await fetch('/api/betting/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prophecyId: selectedBet.id,
          amount: betAmount,
          side: betSide,
          txHash,
          walletAddress: account
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Bet recorded:', result);
        
        // Reset form and show success
        setBetAmount('');
        setSelectedBet(null);
        alert(`Bet placed successfully! ${betSide.toUpperCase()} bet of ${betAmount} ETH confirmed.\nTransaction: ${txHash.slice(0, 10)}...`);
      } else {
        throw new Error('Failed to record bet');
      }
      
    } catch (error) {
      console.error('Failed to place bet:', error);
      alert('Failed to place bet. Please check your wallet and try again.');
    } finally {
      setIsPlacingBet(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-900/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Connect Wallet to Access Prophecy Betting
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Connect your MetaMask wallet to participate in biblical prophecy prediction markets with Ethereum or Polygon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Betting Statistics */}
      <BettingStats isConnected={isConnected} walletAddress={account || undefined} />
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">🔥 Active Bets</TabsTrigger>
          <TabsTrigger value="my-bets">💼 My Bets</TabsTrigger>
          <TabsTrigger value="history">📊 History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeBets.map((bet) => (
              <Card key={bet.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(bet.category)}</span>
                        <Badge className={getCategoryColor(bet.category)}>
                          {bet.category.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {bet.confidence}% AI Confidence
                        </Badge>
                      </div>
                      <CardTitle className="text-sm text-muted-foreground mb-1">
                        "{bet.prophecyText}"
                      </CardTitle>
                      <h3 className="text-lg font-bold">{bet.prediction}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{bet.odds}x</div>
                      <div className="text-xs text-muted-foreground">odds</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{bet.totalPool} ETH</div>
                      <div className="text-xs text-muted-foreground">Total Pool</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{bet.yesStake} ETH</div>
                      <div className="text-xs text-muted-foreground">YES Stakes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{bet.noStake} ETH</div>
                      <div className="text-xs text-muted-foreground">NO Stakes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatTimeRemaining(bet.deadline)} remaining</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">47 participants</span>
                    </div>
                  </div>

                  {selectedBet?.id === bet.id ? (
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={betSide === 'yes' ? 'default' : 'outline'}
                          onClick={() => setBetSide('yes')}
                          className="flex items-center gap-2"
                        >
                          <TrendingUp className="h-4 w-4" />
                          YES
                        </Button>
                        <Button
                          variant={betSide === 'no' ? 'default' : 'outline'}
                          onClick={() => setBetSide('no')}
                          className="flex items-center gap-2"
                        >
                          <TrendingDown className="h-4 w-4" />
                          NO
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bet Amount (ETH)</label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="10"
                          placeholder="0.1"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                        />
                        <div className="flex gap-1">
                          {['0.1', '0.5', '1.0', '2.0'].map(amount => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              onClick={() => setBetAmount(amount)}
                              className="text-xs px-2 py-1"
                            >
                              {amount} ETH
                            </Button>
                          ))}
                        </div>
                        {betAmount && (
                          <div className="text-xs text-muted-foreground">
                            Potential return: {(parseFloat(betAmount) * bet.odds).toFixed(3)} ETH
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handlePlaceBet}
                          disabled={!betAmount || isPlacingBet}
                          className="flex-1"
                        >
                          {isPlacingBet ? (
                            <>
                              <Zap className="h-4 w-4 mr-2 animate-spin" />
                              Placing Bet...
                            </>
                          ) : (
                            <>
                              <Coins className="h-4 w-4 mr-2" />
                              Place {betSide.toUpperCase()} Bet
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedBet(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedBet(bet)}
                      className="w-full"
                      variant="outline"
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      Place Bet
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-bets" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Coins className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Active Bets
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Place your first prophecy bet to see it here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Betting History Empty
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Your completed bets and winnings will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetaMaskConnectButton } from '@/components/MetaMaskConnectButton';
import { ProphecyBettingPanel } from '@/components/ProphecyBettingPanel';
import { RealTimeUpdates } from '@/components/RealTimeUpdates';
import { useMetaMask } from '@/components/MetaMaskProvider';
import { 
  Shield, 
  Link2, 
  Hash, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Coins,
  Users,
  TrendingUp,
  Globe
} from 'lucide-react';

interface BlockchainRecord {
  id: string;
  prophecyId: string;
  prophecyText: string;
  prediction: string;
  timestamp: string;
  blockHash: string;
  transactionHash: string;
  verificationStatus: 'pending' | 'verified' | 'disputed';
  accuracy: number | null;
  verifierCount: number;
  stakingAmount: number;
  network: 'ethereum' | 'polygon' | 'prophecy-chain';
}

interface TokenMetrics {
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  totalSupply: number;
  stakingRewards: number;
  accuracyMultiplier: number;
}

export function BlockchainVerification() {
  const { isConnected, account } = useMetaMask();
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BlockchainRecord | null>(null);
  const [isStaking, setIsStaking] = useState(false);
  const [userStake, setUserStake] = useState(0);

  // Mock blockchain data
  useEffect(() => {
    const mockRecords: BlockchainRecord[] = [
      {
        id: 'bc-001',
        prophecyId: 'pred-001',
        prophecyText: 'And there shall be earthquakes in diverse places, and famines, and troubles',
        prediction: 'Major earthquake in Turkey within 30 days - 7.2 magnitude',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        blockHash: '0x1234567890abcdef1234567890abcdef12345678',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        verificationStatus: 'verified',
        accuracy: 95.3,
        verifierCount: 47,
        stakingAmount: 1200,
        network: 'prophecy-chain'
      },
      {
        id: 'bc-002',
        prophecyId: 'pred-002',
        prophecyText: 'Wars and rumours of wars... nation shall rise against nation',
        prediction: 'Escalation of Middle East conflict involving 3+ nations',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        blockHash: '0x2345678901bcdef12345678901bcdef123456789',
        transactionHash: '0xbcdef12345678901bcdef12345678901bcdef123',
        verificationStatus: 'pending',
        accuracy: null,
        verifierCount: 23,
        stakingAmount: 850,
        network: 'ethereum'
      },
      {
        id: 'bc-003',
        prophecyId: 'pred-003',
        prophecyText: 'There shall be signs in the sun, and in the moon, and in the stars',
        prediction: 'Solar flare activity will disrupt global communications',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        blockHash: '0x3456789012cdef123456789012cdef1234567890',
        transactionHash: '0xcdef123456789012cdef123456789012cdef1234',
        verificationStatus: 'disputed',
        accuracy: 12.7,
        verifierCount: 8,
        stakingAmount: 340,
        network: 'polygon'
      }
    ];
    setRecords(mockRecords);
  }, []);

  const tokenMetrics: TokenMetrics = {
    symbol: 'PRPH',
    name: 'Prophecy Token',
    currentPrice: 2.47,
    marketCap: 12500000,
    totalSupply: 100000000,
    stakingRewards: 12.5,
    accuracyMultiplier: 2.3
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'disputed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getNetworkIcon = (network: string): string => {
    switch (network) {
      case 'ethereum': return '⟠';
      case 'polygon': return '⬟';
      case 'prophecy-chain': return '🔮';
      default: return '⛓️';
    }
  };

  const handleStaking = async (recordId: string, amount: number) => {
    setIsStaking(true);
    // Simulate blockchain transaction
    setTimeout(() => {
      setUserStake(userStake + amount);
      setIsStaking(false);
      // Update record with new staking amount
      setRecords(prev => prev.map(r => 
        r.id === recordId 
          ? { ...r, stakingAmount: r.stakingAmount + amount, verifierCount: r.verifierCount + 1 }
          : r
      ));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* MetaMask Connection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MetaMaskConnectButton />
        </div>
        <div className="lg:col-span-2">
          {isConnected && (
            <Card className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Blockchain Features Enabled
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your wallet is connected. You can now participate in prophecy verification, staking, and earning rewards.
                </p>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>

      {/* Blockchain Header */}
      <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Prophecy Blockchain Verification</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Immutable prophecy predictions with decentralized verification
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">${tokenMetrics.currentPrice}</div>
                <div className="text-xs text-muted-foreground">PRPH Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{records.length}</div>
                <div className="text-xs text-muted-foreground">Verified Records</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="betting" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="betting">🎯 Prophecy Betting</TabsTrigger>
          <TabsTrigger value="records">🔗 Blockchain Records</TabsTrigger>
          <TabsTrigger value="staking">💰 Staking & Rewards</TabsTrigger>
          <TabsTrigger value="governance">🗳️ DAO Governance</TabsTrigger>
          <TabsTrigger value="tokenomics">📊 Tokenomics</TabsTrigger>
        </TabsList>

        <TabsContent value="betting" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ProphecyBettingPanel />
            </div>
            <div className="xl:col-span-1">
              <RealTimeUpdates />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Records List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-blue-500" />
                  Immutable Prophecy Records
                  <Badge variant="outline">{records.length} On-Chain</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {records.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getNetworkIcon(record.network)}</span>
                        <Badge className={getStatusColor(record.verificationStatus)}>
                          {record.verificationStatus}
                        </Badge>
                      </div>
                      {record.accuracy !== null && (
                        <div className="text-right">
                          <div className="font-bold text-green-600">{record.accuracy}% Accurate</div>
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2">{record.prediction}</h4>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{record.verifierCount} verifiers</span>
                      <span>{record.stakingAmount} PRPH staked</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{new Date(record.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Record Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-green-500" />
                  Blockchain Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRecord ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{selectedRecord.prediction}</h3>
                      <Badge className={getStatusColor(selectedRecord.verificationStatus)}>
                        {selectedRecord.verificationStatus.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Biblical Reference:</h4>
                      <p className="text-sm text-muted-foreground italic">
                        "{selectedRecord.prophecyText}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-1">Network:</h4>
                        <div className="flex items-center gap-2">
                          <span>{getNetworkIcon(selectedRecord.network)}</span>
                          <span className="text-sm">{selectedRecord.network}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Verifiers:</h4>
                        <span className="text-sm">{selectedRecord.verifierCount} nodes</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Transaction Hash:</h4>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono break-all">
                        {selectedRecord.transactionHash}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Block Hash:</h4>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono break-all">
                        {selectedRecord.blockHash}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handleStaking(selectedRecord.id, 100)}
                        disabled={isStaking}
                        className="w-full"
                      >
                        {isStaking ? 'Processing...' : 'Stake 100 PRPH to Verify'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Select a record to view blockchain details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staking" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  Your Stake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStake} PRPH</div>
                <div className="text-sm text-muted-foreground">≈ ${(userStake * tokenMetrics.currentPrice).toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  APY Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{tokenMetrics.stakingRewards}%</div>
                <div className="text-sm text-muted-foreground">Annual percentage yield</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Accuracy Bonus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{tokenMetrics.accuracyMultiplier}x</div>
                <div className="text-sm text-muted-foreground">Multiplier for correct predictions</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Decentralized Governance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Active Proposal: Prophet Verification Standards</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Should we require minimum 90% accuracy for prophet verification?
                  </p>
                  <div className="flex items-center gap-4">
                    <Button size="sm" variant="outline">Vote Yes (67%)</Button>
                    <Button size="sm" variant="outline">Vote No (33%)</Button>
                    <Badge>2 days left</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg opacity-60">
                  <h4 className="font-semibold mb-2">Proposal: AI Model Upgrade</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upgrade to GPT-5 for improved prediction accuracy
                  </p>
                  <Badge variant="secondary">Passed - Implementing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokenomics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-500" />
                  Token Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="font-semibold">${tokenMetrics.currentPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Market Cap</span>
                    <span className="font-semibold">${(tokenMetrics.marketCap / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Supply</span>
                    <span className="font-semibold">{(tokenMetrics.totalSupply / 1000000).toFixed(0)}M PRPH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Circulating Supply</span>
                    <span className="font-semibold">{((tokenMetrics.totalSupply * 0.6) / 1000000).toFixed(0)}M PRPH</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Staking Rewards</span>
                    <span className="text-sm font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Community Treasury</span>
                    <span className="text-sm font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Development Fund</span>
                    <span className="text-sm font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Prophet Rewards</span>
                    <span className="text-sm font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Team & Advisors</span>
                    <span className="text-sm font-semibold">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
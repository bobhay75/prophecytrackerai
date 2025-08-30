import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Coins, Target, Clock, Zap } from 'lucide-react';

interface BettingStatsProps {
  isConnected: boolean;
  walletAddress?: string;
}

export const BettingStats: React.FC<BettingStatsProps> = ({ isConnected, walletAddress }) => {
  const globalStats = {
    totalVolume: 247.8,
    activeBets: 12,
    totalUsers: 1247,
    successRate: 76.4,
    avgOdds: 2.77,
    largestWin: 15.6
  };

  const userStats = {
    totalBets: 8,
    winRate: 62.5,
    totalStaked: 4.2,
    totalWon: 6.8,
    netProfit: 2.6,
    rank: 47
  };

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Prophecy Betting Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{globalStats.totalVolume} ETH</div>
              <div className="text-xs text-muted-foreground">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{globalStats.activeBets}</div>
              <div className="text-xs text-muted-foreground">Active Markets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{globalStats.totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
          </div>
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Connect wallet to see your personal statistics
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Global Stats */}
      <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Global Betting Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{globalStats.totalVolume} ETH</div>
              <div className="text-xs text-muted-foreground">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{globalStats.activeBets}</div>
              <div className="text-xs text-muted-foreground">Active Markets</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{globalStats.totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{globalStats.successRate}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm">Avg Odds: {globalStats.avgOdds}x</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Largest Win: {globalStats.largestWin} ETH</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      <Card className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Your Betting Performance
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Rank #{userStats.rank}
            </Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{userStats.totalBets}</div>
              <div className="text-xs text-muted-foreground">Total Bets</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{userStats.winRate}%</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{userStats.totalStaked} ETH</div>
              <div className="text-xs text-muted-foreground">Total Staked</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-600">+{userStats.netProfit} ETH</div>
              <div className="text-xs text-muted-foreground">Net Profit</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Won: {userStats.totalWon} ETH</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Member since Dec 2024</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
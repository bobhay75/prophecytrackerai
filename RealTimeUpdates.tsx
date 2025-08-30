import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, Users, Zap, Clock } from 'lucide-react';

interface BettingUpdate {
  id: string;
  type: 'bet_placed' | 'odds_changed' | 'deadline_approaching' | 'prophecy_resolved';
  message: string;
  prophecyId: string;
  timestamp: string;
  amount?: number;
  walletAddress?: string;
}

export const RealTimeUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<BettingUpdate[]>([]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newUpdate: BettingUpdate = {
        id: `update-${Date.now()}`,
        type: ['bet_placed', 'odds_changed', 'deadline_approaching'][Math.floor(Math.random() * 3)] as any,
        message: generateRandomUpdate(),
        prophecyId: `bet-00${Math.floor(Math.random() * 3) + 1}`,
        timestamp: new Date().toISOString(),
        amount: Math.random() > 0.5 ? parseFloat((Math.random() * 2).toFixed(2)) : undefined,
        walletAddress: Math.random() > 0.5 ? `0x${Math.random().toString(16).substr(2, 8)}...` : undefined
      };

      setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep last 10 updates
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const generateRandomUpdate = () => {
    const updates = [
      "New 1.2 ETH bet placed on Turkey earthquake prediction",
      "Odds shifted to 2.5x for Israel-Iran conflict escalation",
      "Solar storm prediction deadline in 24 hours",
      "0x742d...91c2 won 3.4 ETH on earthquake prediction",
      "Turkey earthquake prophecy odds now 2.1x (was 2.3x)",
      "42 new participants joined prophecy betting this hour",
      "Major bet: 5.7 ETH placed on solar storm disruption",
      "Conflict escalation prediction deadline extended 6 hours"
    ];
    return updates[Math.floor(Math.random() * updates.length)];
  };

  const getUpdateIcon = (type: BettingUpdate['type']) => {
    switch (type) {
      case 'bet_placed': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'odds_changed': return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'deadline_approaching': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'prophecy_resolved': return <Users className="h-4 w-4 text-blue-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUpdateColor = (type: BettingUpdate['type']) => {
    switch (type) {
      case 'bet_placed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'odds_changed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'deadline_approaching': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'prophecy_resolved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-600" />
          Live Betting Activity
          <Badge variant="outline" className="ml-auto">
            {updates.length} recent
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {updates.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Waiting for live updates...</p>
            </div>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-900/50">
                <div className="mt-0.5">
                  {getUpdateIcon(update.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-relaxed">
                      {update.message}
                    </p>
                    <div className="text-right">
                      <Badge className={getUpdateColor(update.type)} variant="outline">
                        {update.type.replace('_', ' ')}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatTime(update.timestamp)}
                      </div>
                    </div>
                  </div>
                  {update.amount && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {update.amount} ETH
                    </div>
                  )}
                  {update.walletAddress && (
                    <div className="text-xs text-muted-foreground">
                      {update.walletAddress}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
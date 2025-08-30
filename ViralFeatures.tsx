import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Volume2, 
  Trophy, 
  Calendar, 
  Sparkles, 
  Share2, 
  TrendingUp,
  Crown,
  Zap,
  Bell,
  User,
  Award,
  Target,
  BookOpen,
  Hash
} from 'lucide-react';

interface ProphetLeaderboard {
  id: string;
  name: string;
  avatar: string;
  predictions: number;
  accuracy: number;
  fulfilled: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

interface TodayInRevelation {
  verse: string;
  reference: string;
  correlation: string;
  confidence: number;
  event: string;
}

interface PropheticNFT {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owner?: string;
  price?: string;
}

export function ViralFeatures() {
  const [trumpetPlaying, setTrumpetPlaying] = useState(false);
  const [todayVerse, setTodayVerse] = useState<TodayInRevelation | null>(null);
  const [leaderboard, setLeaderboard] = useState<ProphetLeaderboard[]>([]);
  const [nfts, setNfts] = useState<PropheticNFT[]>([]);

  useEffect(() => {
    loadTodayInRevelation();
    loadProphetLeaderboard();
    loadPropheticNFTs();
  }, []);

  const loadTodayInRevelation = () => {
    // This would normally fetch from API
    setTodayVerse({
      verse: "And there were voices, and thunders, and lightnings; and there was a great earthquake, such as was not since men were upon the earth, so mighty an earthquake, and so great.",
      reference: "Revelation 16:18",
      correlation: "Kamchatka Peninsula 8.8 Magnitude Earthquake",
      confidence: 94,
      event: "2025 Kamchatka Peninsula, Russia Earthquake"
    });
  };

  const loadProphetLeaderboard = () => {
    setLeaderboard([
      {
        id: '1',
        name: 'Prophet Daniel',
        avatar: '👑',
        predictions: 47,
        accuracy: 94.2,
        fulfilled: 44,
        rank: 1,
        trend: 'up'
      },
      {
        id: '2',
        name: 'EndTimes Watcher',
        avatar: '🔮',
        predictions: 52,
        accuracy: 89.1,
        fulfilled: 46,
        rank: 2,
        trend: 'stable'
      },
      {
        id: '3',
        name: 'Biblical Scholar',
        avatar: '📖',
        predictions: 38,
        accuracy: 86.8,
        fulfilled: 33,
        rank: 3,
        trend: 'up'
      },
      {
        id: '4',
        name: 'Prophecy Hunter',
        avatar: '🎯',
        predictions: 41,
        accuracy: 85.4,
        fulfilled: 35,
        rank: 4,
        trend: 'down'
      }
    ]);
  };

  const loadPropheticNFTs = () => {
    setNfts([
      {
        id: '1',
        title: 'Great Earthquake of Kamchatka',
        date: '2025-08-03',
        description: 'Magnitude 8.8 earthquake matching Revelation 16:18',
        image: '🌍',
        rarity: 'legendary',
        owner: 'Prophet Daniel',
        price: '0.15 ETH'
      },
      {
        id: '2',
        title: 'Signs in the Heavens',
        date: '2025-08-02',
        description: 'Wormwood candidate asteroid approaching Earth',
        image: '☄️',
        rarity: 'epic',
        price: '0.08 ETH'
      },
      {
        id: '3',
        title: 'Wars and Rumors of Wars',
        date: '2025-08-01',
        description: 'Middle East tensions escalating per Matthew 24:6',
        image: '⚔️',
        rarity: 'rare',
        owner: 'EndTimes Watcher',
        price: '0.05 ETH'
      }
    ]);
  };

  const playTrumpetAlert = () => {
    setTrumpetPlaying(true);
    // In a real app, this would play an actual trumpet sound
    console.log('🎺 TRUMPET ALERT: Prophetic event detected!');
    
    // Show dramatic alert
    const audio = new Audio('/trumpet-alert.mp3'); // Would need actual audio file
    // audio.play().catch(() => console.log('Audio play failed'));
    
    setTimeout(() => setTrumpetPlaying(false), 3000);
  };

  const shareToSocial = (platform: string, content: string) => {
    const encodedContent = encodeURIComponent(content);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedContent}&hashtags=EndTimes,Prophecy,Biblical`,
      telegram: `https://t.me/share/url?url=${window.location.href}&text=${encodedContent}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodedContent}`
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Last Trump Alert */}
      <Card className={`border-2 ${trumpetPlaying ? 'border-yellow-500 animate-pulse' : 'border-border'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Volume2 className={`h-5 w-5 ${trumpetPlaying ? 'text-yellow-500 animate-bounce' : 'text-muted-foreground'}`} />
            Last Trump Alert
            {trumpetPlaying && <Badge variant="destructive" className="animate-pulse">ACTIVE</Badge>}
          </CardTitle>
          <CardDescription>
            Sound the trumpet when prophetic events occur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trumpetPlaying && (
            <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <Bell className="h-4 w-4" />
              <AlertDescription className="font-bold">
                🎺 PROPHETIC ALERT: Major earthquake detected! This event shows 94% correlation with Revelation 16:18!
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={playTrumpetAlert} 
              disabled={trumpetPlaying}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {trumpetPlaying ? (
                <>🎺 Sounding...</>
              ) : (
                <>🎺 Sound the Trumpet</>
              )}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Last triggered: 2 minutes ago (Kamchatka Earthquake)
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="today">Today's Verse</TabsTrigger>
          <TabsTrigger value="nfts">Prophetic NFTs</TabsTrigger>
          <TabsTrigger value="social">Social Hub</TabsTrigger>
        </TabsList>

        {/* Prophecy Match Leaderboards */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Prophet Accuracy Leaderboard
              </CardTitle>
              <CardDescription>
                See which prophets' predictions came true
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((prophet, index) => (
                <div key={prophet.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                      index === 0 ? 'bg-yellow-100 dark:bg-yellow-900' : 
                      index === 1 ? 'bg-gray-100 dark:bg-gray-800' :
                      index === 2 ? 'bg-orange-100 dark:bg-orange-900' : 'bg-muted'
                    }`}>
                      {index < 3 ? (
                        <Crown className={`h-4 w-4 ${
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-600' :
                          'text-orange-600'
                        }`} />
                      ) : (
                        <span>#{prophet.rank}</span>
                      )}
                    </div>
                    <div className="text-2xl">{prophet.avatar}</div>
                    <div>
                      <div className="font-semibold">{prophet.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {prophet.fulfilled}/{prophet.predictions} predictions fulfilled
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-auto flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-lg">{prophet.accuracy}%</div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                    </div>
                    {getTrendIcon(prophet.trend)}
                  </div>
                </div>
              ))}
              
              <Button className="w-full mt-4" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Join the Leaderboard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Today in Revelation Widget */}
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                Today in Revelation
              </CardTitle>
              <CardDescription>
                Daily event matched with the Book of Revelation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayVerse && (
                <>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="font-semibold text-lg mb-2">{todayVerse.reference}</div>
                    <blockquote className="italic text-muted-foreground mb-4">
                      "{todayVerse.verse}"
                    </blockquote>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Current Event:</span>
                        <Badge variant="outline">{todayVerse.event}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Correlation:</span>
                        <Badge variant="secondary">{todayVerse.correlation}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Confidence:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={todayVerse.confidence} className="w-20" />
                          <span className="font-bold text-green-600">{todayVerse.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => shareToSocial('twitter', `📖 Today in Revelation: ${todayVerse.reference} correlates with ${todayVerse.event} at ${todayVerse.confidence}% confidence! #EndTimes #Prophecy`)}
                      size="sm"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share on X
                    </Button>
                    <Button 
                      onClick={() => shareToSocial('telegram', `🔔 Prophetic Alert: ${todayVerse.reference} matches today's events!`)}
                      variant="outline" 
                      size="sm"
                    >
                      Share on Telegram
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prophetic NFT Bookmarks */}
        <TabsContent value="nfts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-pink-500" />
                Prophetic NFT Bookmarks
              </CardTitle>
              <CardDescription>
                Mint significant prophetic events as collectible NFTs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {nfts.map(nft => (
                  <div key={nft.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${getRarityColor(nft.rarity)}`}>
                        {nft.image}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{nft.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={`capitalize ${
                              nft.rarity === 'legendary' ? 'border-yellow-500 text-yellow-600' :
                              nft.rarity === 'epic' ? 'border-purple-500 text-purple-600' :
                              nft.rarity === 'rare' ? 'border-blue-500 text-blue-600' :
                              'border-gray-500 text-gray-600'
                            }`}
                          >
                            {nft.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{nft.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{nft.date}</span>
                          <div className="flex items-center gap-4">
                            {nft.owner && (
                              <span className="text-muted-foreground">Owned by {nft.owner}</span>
                            )}
                            {nft.price && (
                              <Badge variant="secondary">{nft.price}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button size="sm" variant={nft.owner ? "outline" : "default"}>
                        {nft.owner ? "View" : "Mint"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  🔥 New prophetic events are automatically available for minting within 24 hours of detection!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Integration */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-500" />
                Telegram & X Bot Integration
              </CardTitle>
              <CardDescription>
                Auto-post new fulfillments to your followers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Share2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">X (Twitter) Bot</h3>
                      <p className="text-sm text-muted-foreground">@EndTimesTrackerBot</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">Coming Soon</Badge>
                  </div>
                  <p className="text-sm mb-3">
                    Automatically tweet when new prophetic correlations are detected with high confidence scores.
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Connect Twitter
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Telegram Channel</h3>
                      <p className="text-sm text-muted-foreground">@prophecytrackerwatch</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">Coming Soon</Badge>
                  </div>
                  <p className="text-sm mb-3">
                    Join our Telegram channel for instant prophetic alerts and community discussions.
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Join Channel
                  </Button>
                </div>
              </div>
              
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  🚀 Social features launching next week! Be among the first to get auto-posting capabilities.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ViralFeatures;
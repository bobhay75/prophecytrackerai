import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Heart,
  BookOpen,
  Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

interface ProphecyPrediction {
  id: string;
  title: string;
  description: string;
  category: 'earthquake' | 'conflict' | 'economic' | 'political' | 'spiritual';
  endDate: string;
  totalWatchers: number;
  yesVotes: number;
  noVotes: number;
  participants: number;
  status: 'active' | 'closed' | 'resolved';
  resolution?: 'yes' | 'no' | null;
  biblicalReference: string;
  creator: string;
  prayerCount: number;
  watchlistCount: number;
}

interface UserVote {
  predictionId: string;
  vote: 'yes' | 'no' | 'watching';
  confidence: number;
  notes: string;
  prayerAdded: boolean;
  createdAt: string;
}

interface ProphecyStats {
  totalPredictionsActive: number;
  totalWatchersToday: number;
  averageAccuracy: number;
  topWatchers: number;
  totalPrayers: number;
}

export function PredictionMarketplace() {
  const [selectedPrediction, setSelectedPrediction] = useState<ProphecyPrediction | null>(null);
  const [userVote, setUserVote] = useState<'yes' | 'no' | 'watching'>('watching');
  const [confidence, setConfidence] = useState(50);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [prayerNotes, setPrayerNotes] = useState('');

  const prophecyPredictions: ProphecyPrediction[] = [
    {
      id: 'turkey-earthquake-2025',
      title: 'Major Earthquake in Turkey by March 2025',
      description: 'A magnitude 7.0+ earthquake will strike Turkey before March 31, 2025, as prophesied in biblical end times scriptures.',
      category: 'earthquake',
      endDate: '2025-03-31T23:59:59Z',
      totalWatchers: 2475,
      yesVotes: 1803,
      noVotes: 672,
      participants: 1847,
      status: 'active',
      biblicalReference: 'Matthew 24:7 - "There will be earthquakes in various places"',
      creator: 'ProphetAnalyst47',
      prayerCount: 892,
      watchlistCount: 1456
    },
    {
      id: 'middle-east-war-2025',
      title: 'Israel-Iran Direct Military Conflict in 2025',
      description: 'Direct military engagement between Israel and Iran forces will occur before end of 2025, marking biblical "wars and rumors of wars".',
      category: 'conflict',
      endDate: '2025-12-31T23:59:59Z',
      totalVolume: 892300,
      yesProbability: 84,
      noProbability: 16,
      yesPrice: 0.84,
      noPrice: 0.16,
      participants: 3421,
      status: 'active',
      biblicalReference: 'Matthew 24:6 - "You will hear of wars and rumors of wars"',
      creator: 'EndTimesWatcher',
      minimumBet: 25,
      maximumBet: 25000
    },
    {
      id: 'economic-collapse-2025',
      title: 'Global Economic Crisis by Summer 2025',
      description: 'Major global economic downturn affecting 3+ major economies by July 2025, fulfilling biblical warnings about end times economics.',
      category: 'economic',
      endDate: '2025-07-31T23:59:59Z',
      totalVolume: 156800,
      yesProbability: 61,
      noProbability: 39,
      yesPrice: 0.61,
      noPrice: 0.39,
      participants: 987,
      status: 'active',
      biblicalReference: 'Revelation 6:5-6 - Economic hardship and scarcity',
      creator: 'BiblicalEconomist',
      minimumBet: 50,
      maximumBet: 5000
    },
    {
      id: 'temple-announcement-2025',
      title: 'Third Temple Construction Announcement in 2025',
      description: 'Official announcement of Third Temple construction project in Jerusalem will be made in 2025.',
      category: 'spiritual',
      endDate: '2025-12-31T23:59:59Z',
      totalVolume: 78900,
      yesProbability: 42,
      noProbability: 58,
      yesPrice: 0.42,
      noPrice: 0.58,
      participants: 654,
      status: 'active',
      biblicalReference: 'Daniel 9:27 - Temple prophecies',
      creator: 'TempleWatcher',
      minimumBet: 20,
      maximumBet: 2000
    },
    {
      id: 'rapture-signs-2024',
      title: 'Increased Rapture Signs in 2024',
      description: 'Significant increase in prophetic signs indicating nearness of rapture will manifest in 2024.',
      category: 'spiritual',
      endDate: '2024-12-31T23:59:59Z',
      totalVolume: 342100,
      yesProbability: 88,
      noProbability: 12,
      yesPrice: 0.88,
      noPrice: 0.12,
      participants: 2156,
      status: 'resolved',
      resolution: 'yes',
      biblicalReference: '1 Thessalonians 4:16-17 - The Rapture',
      creator: 'RaptureReady',
      minimumBet: 15,
      maximumBet: 3000
    }
  ];

  const prophecyStats: ProphecyStats = {
    totalPredictionsActive: prophecyPredictions.filter(p => p.status === 'active').length,
    totalWatchersToday: 472,
    averageAccuracy: 76.8,
    topWatchers: 156,
    totalPrayers: 2835
  };

  // Mock user votes
  useEffect(() => {
    const mockVotes: UserVote[] = [
      {
        predictionId: 'turkey-earthquake-2025',
        vote: 'yes',
        confidence: 75,
        notes: 'Biblical signs align with current seismic activity patterns',
        prayerAdded: true,
        createdAt: '2024-12-15T10:30:00Z'
      },
      {
        predictionId: 'middle-east-war-2025',
        vote: 'watching',
        confidence: 0,
        notes: 'Monitoring developments closely through prayer',
        prayerAdded: true,
        createdAt: '2024-12-10T14:20:00Z'
      }
    ];
    setUserVotes(mockVotes);
  }, []);

  const castVote = (prediction: ProphecyPrediction, vote: 'yes' | 'no' | 'watching') => {
    const newVote: UserVote = {
      predictionId: prediction.id,
      vote: vote,
      confidence: vote === 'watching' ? 0 : confidence,
      notes: prayerNotes,
      prayerAdded: prayerNotes.length > 0,
      createdAt: new Date().toISOString()
    };

    setUserVotes(prev => [...prev.filter(v => v.predictionId !== prediction.id), newVote]);
    
    // Update prediction stats (in real app this would be server-side)
    if (vote === 'yes') {
      prediction.yesVotes += 1;
    } else if (vote === 'no') {
      prediction.noVotes += 1;
    }
    
    if (prayerNotes.length > 0) {
      prediction.prayerCount += 1;
    }
    
    prediction.watchlistCount += 1;
    
    setPrayerNotes('');
    setConfidence(50);
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'earthquake': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'conflict': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'economic': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'political': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'spiritual': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string, resolution?: string | null): string => {
    if (status === 'resolved') {
      return resolution === 'yes' 
        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
    return status === 'active' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Prophecy Tracker Header */}
      <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <CardTitle className="text-2xl">Prophecy Fulfillment Tracker</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track biblical prophecy fulfillments through faith and prayer
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{prophecyStats.totalPrayers.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Prayers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{prophecyStats.totalWatchersToday.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Watchers Today</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User Prayer Dashboard */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Prophecies Watching</p>
                <p className="text-2xl font-bold text-purple-600">{userVotes.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prayers Offered</p>
                <p className="text-2xl font-bold text-blue-600">{userVotes.filter(v => v.prayerAdded).length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faith Level</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(userVotes.reduce((sum, v) => sum + v.confidence, 0) / Math.max(userVotes.length, 1))}%
                </p>
              </div>
            </div>
            <Button>
              <Heart className="h-4 w-4 mr-2" />
              Prayer Journal
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">🎯 Active Prophecies</TabsTrigger>
          <TabsTrigger value="votes">📊 My Votes</TabsTrigger>
          <TabsTrigger value="faithful">🏆 Faithful Watchers</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prophecies List */}
            <div className="space-y-4">
              {prophecyPredictions.map((prediction) => (
                <Card 
                  key={prediction.id} 
                  className={`cursor-pointer transition-all ${
                    selectedPrediction?.id === prediction.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedPrediction(prediction)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(prediction.category)}>
                        {prediction.category}
                      </Badge>
                      <Badge className={getStatusColor(prediction.status, prediction.resolution)}>
                        {prediction.status === 'resolved' ? `Resolved: ${prediction.resolution}` : prediction.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{prediction.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{prediction.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center p-2 border rounded bg-green-50 dark:bg-green-900/20">
                        <div className="text-lg font-bold text-green-600">{prediction.yesVotes}</div>
                        <div className="text-xs text-muted-foreground">YES Votes</div>
                      </div>
                      <div className="text-center p-2 border rounded bg-red-50 dark:bg-red-900/20">
                        <div className="text-lg font-bold text-red-600">{prediction.noVotes}</div>
                        <div className="text-xs text-muted-foreground">NO Votes</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{prediction.participants}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{prediction.prayerCount} prayers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(prediction.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs italic text-muted-foreground">
                      📖 {prediction.biblicalReference}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Voting Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-500" />
                  Cast Your Vote & Prayer
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPrediction ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{selectedPrediction.title}</h3>
                      <Badge className={getCategoryColor(selectedPrediction.category)}>
                        {selectedPrediction.category}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Choose Your Response:</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={userVote === 'yes' ? 'default' : 'outline'}
                          onClick={() => setUserVote('yes')}
                          className="flex-col h-auto py-3"
                        >
                          <TrendingUp className="h-4 w-4 mb-1 text-green-600" />
                          <span className="font-bold text-xs">YES</span>
                          <span className="text-xs">{selectedPrediction.yesVotes} votes</span>
                        </Button>
                        <Button
                          variant={userVote === 'no' ? 'default' : 'outline'}
                          onClick={() => setUserVote('no')}
                          className="flex-col h-auto py-3"
                        >
                          <TrendingDown className="h-4 w-4 mb-1 text-red-600" />
                          <span className="font-bold text-xs">NO</span>
                          <span className="text-xs">{selectedPrediction.noVotes} votes</span>
                        </Button>
                        <Button
                          variant={userVote === 'watching' ? 'default' : 'outline'}
                          onClick={() => setUserVote('watching')}
                          className="flex-col h-auto py-3"
                        >
                          <BookOpen className="h-4 w-4 mb-1 text-blue-600" />
                          <span className="font-bold text-xs">WATCH</span>
                          <span className="text-xs">{selectedPrediction.watchlistCount} watchers</span>
                        </Button>
                      </div>
                    </div>

                    {userVote !== 'watching' && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Confidence Level: {confidence}%</p>
                        <Slider
                          value={[confidence]}
                          onValueChange={(value) => setConfidence(value[0])}
                          max={100}
                          min={0}
                          step={5}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0% - Uncertain</span>
                          <span>100% - Very Confident</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Prayer Notes (Optional):</p>
                      <Textarea
                        placeholder="Add your prayers or thoughts about this prophecy..."
                        value={prayerNotes}
                        onChange={(e) => setPrayerNotes(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                      <h4 className="font-semibold mb-2">Vote Summary:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Your Response:</span>
                          <span className={
                            userVote === 'yes' ? 'text-green-600' : 
                            userVote === 'no' ? 'text-red-600' : 'text-blue-600'
                          }>
                            {userVote.toUpperCase()}
                          </span>
                        </div>
                        {userVote !== 'watching' && (
                          <div className="flex justify-between">
                            <span>Confidence:</span>
                            <span>{confidence}%</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Prayer Added:</span>
                          <span>{prayerNotes.length > 0 ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      📖 Biblical Reference: {selectedPrediction.biblicalReference}
                    </div>

                    <Button 
                      onClick={() => castVote(selectedPrediction, userVote)}
                      disabled={selectedPrediction.status !== 'active'}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {selectedPrediction.status !== 'active' ? 'Prophecy Closed' : `Cast ${userVote.toUpperCase()} Vote`}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Select a prophecy to cast your vote</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="votes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userVotes.map((vote, index) => {
              const prediction = prophecyPredictions.find(p => p.id === vote.predictionId);
              return (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{prediction?.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Your Vote</span>
                        <Badge variant={
                          vote.vote === 'yes' ? 'default' : 
                          vote.vote === 'no' ? 'destructive' : 'secondary'
                        }>
                          {vote.vote.toUpperCase()}
                        </Badge>
                      </div>
                      {vote.vote !== 'watching' && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Confidence</span>
                          <span className="font-semibold">{vote.confidence}%</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Prayer Added</span>
                        <span className="font-semibold">{vote.prayerAdded ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date</span>
                        <span className="font-semibold">{new Date(vote.createdAt).toLocaleDateString()}</span>
                      </div>
                      {vote.notes && (
                        <div>
                          <span className="text-sm text-muted-foreground">Notes:</span>
                          <p className="text-xs mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">{vote.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {userVotes.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No votes cast yet. Start by selecting a prophecy above.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="faithful" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Most Faithful Watchers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'ProphetWatcher47', prayers: 124, accuracy: 89, votes: 156 },
                  { rank: 2, name: 'EndTimesBeliever', prayers: 98, accuracy: 84, votes: 142 },
                  { rank: 3, name: 'BiblicalStudent', prayers: 83, accuracy: 91, votes: 98 },
                  { rank: 4, name: 'RaptureReady', prayers: 72, accuracy: 76, votes: 203 },
                  { rank: 5, name: 'ProphecySeeker', prayers: 68, accuracy: 82, votes: 167 }
                ].map((watcher) => (
                  <div key={watcher.rank} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <span className="font-bold text-purple-600">#{watcher.rank}</span>
                      </div>
                      <span className="font-semibold">{watcher.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-purple-600">{watcher.prayers}</div>
                        <div className="text-xs text-muted-foreground">Prayers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{watcher.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{watcher.votes}</div>
                        <div className="text-xs text-muted-foreground">Votes</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Prophecies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prophecyStats.totalPredictionsActive}</div>
                <div className="text-sm text-muted-foreground">Being watched</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Prayers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{prophecyStats.totalPrayers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Community prayers</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Prediction Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{prophecyStats.averageAccuracy}%</div>
                <div className="text-sm text-muted-foreground">Community average</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Watchers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prophecyStats.topWatchers}</div>
                <div className="text-sm text-muted-foreground">Watching today</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
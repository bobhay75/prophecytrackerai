import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Globe2,
  Eye,
  Cpu,
  Waves,
  Target,
  Clock,
  Mic,
  PlayCircle,
  Bitcoin,
  Users,
  Rocket,
  Activity,
  Lock
} from 'lucide-react';

interface Prediction {
  id: string;
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  region: string;
  category: string;
  biblicalReferences: string[];
  confidenceScore: number;
  dataPoints: string[];
  generatedAt: string;
}

interface GlobalAlert {
  id: string;
  title: string;
  message: string;
  level: {
    id: number;
    name: string;
    color: string;
  };
  category: string;
  regions: string[];
  timestamp: string;
  actionItems: string[];
  isActive: boolean;
}

interface SentimentMetrics {
  platform: string;
  sentiment: string;
  volume: number;
  trending_keywords: string[];
  geographic_focus: string[];
  change_24h: number;
}

export function NextGenDashboard() {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [voiceNarrationActive, setVoiceNarrationActive] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(false);

  // Admin logout function
  const handleAdminLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/';
  };

  // Fetch AI predictions
  const { data: predictions = [], isLoading: predictionsLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions'],
    refetchInterval: realTimeMode ? 30000 : 300000, // 30s in real-time mode, 5min normal
  });

  // Fetch global alerts
  const { data: alerts = [] } = useQuery<GlobalAlert[]>({
    queryKey: ['/api/alerts'],
    refetchInterval: 10000, // Check alerts every 10 seconds
  });

  // Fetch sentiment analysis
  const { data: sentimentData = [] } = useQuery<SentimentMetrics[]>({
    queryKey: ['/api/sentiment-analysis'],
    refetchInterval: 60000, // Update every minute
  });

  // Fetch model performance metrics
  const { data: modelMetrics = {} } = useQuery({
    queryKey: ['/api/prediction-accuracy'],
    refetchInterval: 3600000, // Update every hour
  });

  const criticalAlerts = alerts.filter(alert => alert.level.id >= 3);
  const activePredictions = predictions.filter((p: Prediction) => p.probability > 50);

  const startVoiceNarration = async (prediction: Prediction) => {
    setVoiceNarrationActive(true);
    
    try {
      // Generate voice narration script
      const response = await fetch('/api/generate-narration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId: prediction.id })
      });
      
      const { script } = await response.json();
      
      // Use Web Speech API for voice synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(script);
        utterance.rate = 0.9;
        utterance.pitch = 0.8;
        utterance.volume = 0.8;
        
        utterance.onend = () => setVoiceNarrationActive(false);
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Voice narration failed:', error);
      setVoiceNarrationActive(false);
    }
  };

  const getProbabilityColor = (probability: number): string => {
    if (probability >= 80) return 'text-red-600 dark:text-red-400';
    if (probability >= 60) return 'text-orange-600 dark:text-orange-400';
    if (probability >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getSentimentEmoji = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😰';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-full">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-400">ADMIN MODE</h2>
              <p className="text-sm text-red-300">NextGen Dashboard - Authorized Access Only</p>
            </div>
          </div>
          <Button 
            onClick={handleAdminLogout}
            variant="outline"
            size="sm"
            className="border-red-500 text-red-400 hover:bg-red-900/50"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Next-Gen Header with Real-Time Toggle */}
      <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <CardTitle className="text-2xl">AI-Powered Prophecy Engine</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Next-generation predictive analytics with biblical correlation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant={realTimeMode ? "default" : "outline"}
                onClick={() => setRealTimeMode(!realTimeMode)}
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                {realTimeMode ? "Real-Time ON" : "Real-Time OFF"}
              </Button>
              <Badge variant="destructive" className="animate-pulse">
                {criticalAlerts.length} CRITICAL ALERTS
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="predictions">🔮 AI Predictions</TabsTrigger>
          <TabsTrigger value="alerts">🚨 Global Alerts</TabsTrigger>
          <TabsTrigger value="sentiment">📊 Sentiment AI</TabsTrigger>
          <TabsTrigger value="models">🧠 Model Performance</TabsTrigger>
          <TabsTrigger value="monetization">💰 Revenue Engine</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Predictions List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-500" />
                  Live AI Predictions
                  <Badge variant="outline">{activePredictions.length} Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {predictionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-muted-foreground">AI engines analyzing global data...</p>
                  </div>
                ) : (
                  activePredictions.map((prediction: Prediction) => (
                    <div
                      key={prediction.id}
                      onClick={() => setSelectedPrediction(prediction)}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{prediction.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getProbabilityColor(prediction.probability)}`}>
                            {prediction.probability}%
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              startVoiceNarration(prediction);
                            }}
                            disabled={voiceNarrationActive}
                          >
                            {voiceNarrationActive ? <Waves className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{prediction.region} • {prediction.timeframe}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {prediction.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Confidence: {Math.round(prediction.confidenceScore * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Prediction Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-500" />
                  Prediction Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPrediction ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{selectedPrediction.title}</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`text-2xl font-bold ${getProbabilityColor(selectedPrediction.probability)}`}>
                          {selectedPrediction.probability}%
                        </span>
                        <Badge variant="outline">{selectedPrediction.timeframe}</Badge>
                        <Badge variant="secondary">{selectedPrediction.region}</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">AI Analysis:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedPrediction.description}
                      </p>
                    </div>

                    {selectedPrediction.biblicalReferences && selectedPrediction.biblicalReferences.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Biblical References:</h4>
                        <div className="space-y-1">
                          {selectedPrediction.biblicalReferences.map((ref, idx) => (
                            <Badge key={idx} variant="outline" className="mr-2">
                              {ref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">Data Points:</h4>
                      <ul className="text-sm space-y-1">
                        {selectedPrediction.dataPoints && selectedPrediction.dataPoints.map((point, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-blue-500" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Generated: {new Date(selectedPrediction.generatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Select a prediction to view detailed analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {criticalAlerts.length > 0 && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Global Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {criticalAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-red-600 dark:text-red-400">{alert.title}</h4>
                      <Badge style={{ backgroundColor: alert.level.color }} className="text-white">
                        {alert.level.name}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Regions: {alert.regions && alert.regions.length > 0 ? alert.regions.join(', ') : 'Global'}</span>
                      <span>Category: {alert.category}</span>
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="mt-3">
                      <h5 className="font-semibold text-xs mb-1">Recommended Actions:</h5>
                      <ul className="text-xs space-y-1">
                        {alert.actionItems && alert.actionItems.map((action, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sentimentData.map((data) => (
              <Card key={data.platform}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getSentimentEmoji(data.sentiment)}
                    {data.platform.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Volume</span>
                      <span className="font-semibold">{data.volume.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Sentiment</span>
                      <Badge variant={data.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                        {data.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">24h Change</span>
                      <span className={data.change_24h > 0 ? 'text-red-500' : 'text-green-500'}>
                        {data.change_24h > 0 ? '+' : ''}{data.change_24h}%
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Trending:</p>
                      <div className="flex flex-wrap gap-1">
                        {data.trending_keywords && data.trending_keywords.slice(0, 3).map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {modelMetrics && Object.keys(modelMetrics).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(modelMetrics).map(([modelId, accuracy]) => (
                      <div key={modelId} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {modelId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${typeof accuracy === 'number' ? accuracy * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold">
                            {typeof accuracy === 'number' ? Math.round(accuracy * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Loading model performance data...</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-purple-500" />
                  Next-Gen Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Voice AI Narration</span>
                    <Badge variant="default">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Real-time Prediction</span>
                    <Badge variant={realTimeMode ? "default" : "secondary"}>
                      {realTimeMode ? "ON" : "OFF"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Global Alert System</span>
                    <Badge variant="default">MONITORING</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Sentiment Analysis</span>
                    <Badge variant="default">LIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Blockchain Integration</span>
                    <Badge variant="outline">COMING SOON</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">AR/VR Experience</span>
                    <Badge variant="outline">DEVELOPMENT</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monetization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Bitcoin className="h-5 w-5" />
                  Prediction Markets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Users bet on prophecy fulfillment outcomes
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Volume</span>
                    <span className="font-bold">$47,230</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee (5%)</span>
                    <span className="font-bold text-green-600">$2,361</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Users className="h-5 w-5" />
                  Premium Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced AI predictions and real-time alerts
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Subscribers</span>
                    <span className="font-bold">2,847</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Revenue</span>
                    <span className="font-bold text-blue-600">$28,470</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Globe2 className="h-5 w-5" />
                  API Licensing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Data feeds to media and government agencies
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enterprise Clients</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Revenue</span>
                    <span className="font-bold text-purple-600">$84,000</span>
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
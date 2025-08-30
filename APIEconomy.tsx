import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Code2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  Globe,
  BarChart3,
  Key,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react';

interface APIEndpoint {
  id: string;
  name: string;
  description: string;
  category: 'predictions' | 'news' | 'analytics' | 'alerts' | 'prophecy-data';
  pricing: {
    free: number;
    premium: number;
    enterprise: number;
  };
  rateLimit: string;
  documentation: string;
  sampleResponse: any;
}

interface APIClient {
  id: string;
  name: string;
  type: 'media' | 'government' | 'research' | 'enterprise' | 'individual';
  monthlyUsage: number;
  plan: 'free' | 'premium' | 'enterprise';
  totalRevenue: number;
  joinDate: string;
}

interface APIMetrics {
  totalRequests: number;
  monthlyRevenue: number;
  activeClients: number;
  averageResponseTime: number;
  uptime: number;
  popularEndpoints: string[];
}

export function APIEconomy() {
  const [apiKey, setApiKey] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [requestResponse, setRequestResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiEndpoints: APIEndpoint[] = [
    {
      id: 'global-predictions',
      name: 'Global Predictions API',
      description: 'AI-powered prophecy predictions with confidence scores and timeframes',
      category: 'predictions',
      pricing: { free: 100, premium: 10000, enterprise: 0 },
      rateLimit: '60 requests/minute',
      documentation: '/docs/predictions',
      sampleResponse: {
        predictions: [
          {
            id: 'pred-001',
            title: 'Economic collapse in emerging markets',
            probability: 78,
            timeframe: '6-12 months',
            region: 'South America',
            confidence: 0.84
          }
        ]
      }
    },
    {
      id: 'real-time-alerts',
      name: 'Global Alert System API',
      description: 'Real-time emergency alerts and prophetic warnings',
      category: 'alerts',
      pricing: { free: 50, premium: 5000, enterprise: 0 },
      rateLimit: '30 requests/minute',
      documentation: '/docs/alerts',
      sampleResponse: {
        alerts: [
          {
            id: 'alert-001',
            level: 'critical',
            title: 'Major earthquake predicted',
            regions: ['Turkey', 'Syria'],
            timestamp: '2025-01-13T12:00:00Z'
          }
        ]
      }
    },
    {
      id: 'sentiment-analysis',
      name: 'Social Sentiment API',
      description: 'Multi-platform sentiment analysis with keyword tracking',
      category: 'analytics',
      pricing: { free: 200, premium: 20000, enterprise: 0 },
      rateLimit: '120 requests/minute',
      documentation: '/docs/sentiment',
      sampleResponse: {
        platforms: [
          {
            platform: 'twitter',
            sentiment: 'negative',
            volume: 125847,
            trending_keywords: ['prophecy', 'crisis', 'endtimes']
          }
        ]
      }
    },
    {
      id: 'prophecy-correlations',
      name: 'Prophecy Correlation API',
      description: 'Biblical prophecy matching with current events',
      category: 'prophecy-data',
      pricing: { free: 25, premium: 2500, enterprise: 0 },
      rateLimit: '15 requests/minute',
      documentation: '/docs/prophecy',
      sampleResponse: {
        matches: [
          {
            scripture: 'Matthew 24:7',
            correlation: 0.89,
            events: ['Turkey earthquake', 'Israel conflict'],
            analysis: 'Nation rising against nation...'
          }
        ]
      }
    },
    {
      id: 'global-news-feed',
      name: 'Curated News API',
      description: 'AI-filtered global news with prophetic significance scoring',
      category: 'news',
      pricing: { free: 500, premium: 50000, enterprise: 0 },
      rateLimit: '240 requests/minute',
      documentation: '/docs/news',
      sampleResponse: {
        news: [
          {
            id: 'news-001',
            title: 'Major earthquake strikes Turkey',
            source: 'Reuters',
            prophecy_score: 8.5,
            category: 'natural-disaster'
          }
        ]
      }
    }
  ];

  const apiClients: APIClient[] = [
    {
      id: 'cnn-media',
      name: 'CNN International',
      type: 'media',
      monthlyUsage: 2500000,
      plan: 'enterprise',
      totalRevenue: 25000,
      joinDate: '2024-11-15'
    },
    {
      id: 'uk-emergency',
      name: 'UK Emergency Services',
      type: 'government',
      monthlyUsage: 890000,
      plan: 'enterprise',
      totalRevenue: 15000,
      joinDate: '2024-12-01'
    },
    {
      id: 'princeton-research',
      name: 'Princeton Theological Seminary',
      type: 'research',
      monthlyUsage: 45000,
      plan: 'premium',
      totalRevenue: 2400,
      joinDate: '2024-10-20'
    },
    {
      id: 'prophecy-app',
      name: 'Prophecy Watch Mobile App',
      type: 'enterprise',
      monthlyUsage: 1200000,
      plan: 'enterprise',
      totalRevenue: 18000,
      joinDate: '2024-09-30'
    }
  ];

  const metrics: APIMetrics = {
    totalRequests: 15847293,
    monthlyRevenue: 127500,
    activeClients: 1247,
    averageResponseTime: 89,
    uptime: 99.97,
    popularEndpoints: ['global-predictions', 'real-time-alerts', 'sentiment-analysis']
  };

  useEffect(() => {
    // Generate API key for demonstration
    const demoKey = 'pk_live_' + Math.random().toString(36).substr(2, 32);
    setApiKey(demoKey);
  }, []);

  const testAPIEndpoint = async (endpoint: APIEndpoint) => {
    setIsLoading(true);
    setSelectedEndpoint(endpoint);
    
    // Simulate API call
    setTimeout(() => {
      setRequestResponse(endpoint.sampleResponse);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getPlanColor = (plan: string): string => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'premium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientTypeIcon = (type: string): string => {
    switch (type) {
      case 'media': return '📺';
      case 'government': return '🏛️';
      case 'research': return '🎓';
      case 'enterprise': return '🏢';
      case 'individual': return '👤';
      default: return '🔧';
    }
  };

  return (
    <div className="space-y-6">
      {/* API Economy Header */}
      <Card className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-green-200 dark:border-green-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-2xl">Prophecy Data API Economy</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade APIs serving global media, governments, and research institutions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${(metrics.monthlyRevenue / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground">Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.activeClients}</div>
                <div className="text-xs text-muted-foreground">Active Clients</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="endpoints">🔌 API Endpoints</TabsTrigger>
          <TabsTrigger value="clients">👥 Enterprise Clients</TabsTrigger>
          <TabsTrigger value="analytics">📊 Usage Analytics</TabsTrigger>
          <TabsTrigger value="documentation">📚 Documentation</TabsTrigger>
          <TabsTrigger value="revenue">💰 Revenue Streams</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Endpoints List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Available Endpoints
                  <Badge variant="outline">{apiEndpoints.length} APIs</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {apiEndpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
                    onClick={() => setSelectedEndpoint(endpoint)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{endpoint.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {endpoint.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{endpoint.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Rate limit:</span>
                        <span className="text-xs font-medium">{endpoint.rateLimit}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          testAPIEndpoint(endpoint);
                        }}
                        disabled={isLoading}
                      >
                        Test API
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* API Testing Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-500" />
                  API Testing Console
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEndpoint ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{selectedEndpoint.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{selectedEndpoint.category}</Badge>
                        <Badge variant="secondary">{selectedEndpoint.rateLimit}</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">API Key:</h4>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={apiKey} 
                          readOnly 
                          className="font-mono text-xs"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(apiKey)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Endpoint URL:</h4>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
                        https://api.endtimestracker.com/v1/{selectedEndpoint.id}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Sample Response:</h4>
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono max-h-48 overflow-y-auto">
                        {isLoading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <span>Testing API endpoint...</span>
                          </div>
                        ) : requestResponse ? (
                          <pre>{JSON.stringify(requestResponse, null, 2)}</pre>
                        ) : (
                          <pre>{JSON.stringify(selectedEndpoint.sampleResponse, null, 2)}</pre>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Pricing (requests/month):</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 border rounded">
                          <div className="text-sm font-semibold">Free</div>
                          <div className="text-xs text-muted-foreground">{selectedEndpoint.pricing.free.toLocaleString()}</div>
                        </div>
                        <div className="text-center p-2 border rounded">
                          <div className="text-sm font-semibold">Premium</div>
                          <div className="text-xs text-muted-foreground">{selectedEndpoint.pricing.premium.toLocaleString()}</div>
                        </div>
                        <div className="text-center p-2 border rounded">
                          <div className="text-sm font-semibold">Enterprise</div>
                          <div className="text-xs text-muted-foreground">Unlimited</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(selectedEndpoint.documentation, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Documentation
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Select an endpoint to test the API</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiClients.map((client) => (
              <Card key={client.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className="text-lg">{getClientTypeIcon(client.type)}</span>
                    {client.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Plan</span>
                      <Badge className={getPlanColor(client.plan)}>
                        {client.plan}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Monthly Usage</span>
                      <span className="text-xs font-semibold">
                        {(client.monthlyUsage / 1000000).toFixed(1)}M calls
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total Revenue</span>
                      <span className="text-xs font-semibold text-green-600">
                        ${client.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Client Since</span>
                      <span className="text-xs">
                        {new Date(client.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics.totalRequests / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">All time</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${metrics.monthlyRevenue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">+23% from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
                <div className="text-sm text-muted-foreground">Average</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{metrics.uptime}%</div>
                <div className="text-sm text-muted-foreground">Last 30 days</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Popular Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.popularEndpoints.map((endpointId, index) => {
                  const endpoint = apiEndpoints.find(e => e.id === endpointId);
                  return (
                    <div key={endpointId} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        <span className="font-medium">{endpoint?.name}</span>
                      </div>
                      <Badge variant="outline">{endpoint?.category}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-indigo-500" />
                API Documentation & SDKs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Documentation</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Interactive API Documentation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      OpenAPI Specification
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Getting Started Guide
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Official SDKs</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Code2 className="h-4 w-4 mr-2" />
                      JavaScript/Node.js SDK
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Code2 className="h-4 w-4 mr-2" />
                      Python SDK
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Code2 className="h-4 w-4 mr-2" />
                      PHP SDK
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Code2 className="h-4 w-4 mr-2" />
                      Java SDK
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h5 className="font-semibold mb-2">Quick Start Example (JavaScript)</h5>
                <pre className="text-xs font-mono overflow-x-auto">
{`const EndTimesAPI = require('@endtimes/api');

const client = new EndTimesAPI('${apiKey}');

// Get global predictions
const predictions = await client.predictions.getGlobal({
  region: 'global',
  timeframe: '30-days',
  minProbability: 60
});

console.log(predictions);`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <DollarSign className="h-5 w-5" />
                  API Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Enterprise Plans</span>
                    <span className="font-bold">$84,000/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Premium Plans</span>
                    <span className="font-bold">$28,500/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Usage Overages</span>
                    <span className="font-bold">$15,000/mo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Users className="h-5 w-5" />
                  Client Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Government (12)</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Media (23)</span>
                    <span className="font-bold">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Research (8)</span>
                    <span className="font-bold">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Enterprise (67)</span>
                    <span className="font-bold">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <TrendingUp className="h-5 w-5" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue Growth</span>
                    <span className="font-bold text-green-600">+23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">New Clients</span>
                    <span className="font-bold text-blue-600">+47/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">API Usage</span>
                    <span className="font-bold text-purple-600">+156%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Churn Rate</span>
                    <span className="font-bold text-gray-600">2.1%</span>
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
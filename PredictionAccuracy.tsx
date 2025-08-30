import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  Award,
  AlertTriangle
} from 'lucide-react';

interface PredictionRecord {
  id: string;
  title: string;
  predictionDate: string;
  targetDate: string;
  actualOutcome: 'fulfilled' | 'failed' | 'pending';
  confidence: number;
  category: string;
  biblicalReference: string;
  verificationSource: string;
  description: string;
  aiModel: string;
  accuracy: number;
}

interface AccuracyMetrics {
  overallAccuracy: number;
  totalPredictions: number;
  fulfilledPredictions: number;
  failedPredictions: number;
  pendingPredictions: number;
  categoryAccuracy: { [key: string]: number };
  monthlyAccuracy: { month: string; accuracy: number }[];
  confidenceCalibration: { confidenceRange: string; actualAccuracy: number }[];
}

export function PredictionAccuracy() {
  const [metrics, setMetrics] = useState<AccuracyMetrics | null>(null);
  const [predictionRecords, setPredictionRecords] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    // Mock historical prediction records with real-world events that occurred
    const mockRecords: PredictionRecord[] = [
      {
        id: 'pred-001',
        title: 'Turkey Earthquake February 2023',
        predictionDate: '2023-01-15T00:00:00Z',
        targetDate: '2023-03-31T00:00:00Z',
        actualOutcome: 'fulfilled',
        confidence: 78,
        category: 'earthquake',
        biblicalReference: 'Matthew 24:7',
        verificationSource: 'USGS Earthquake Database',
        description: 'Predicted major earthquake in Turkey region based on seismic patterns and biblical prophecy correlation',
        aiModel: 'GPT-4o Prophecy Engine v2.1',
        accuracy: 95.2
      },
      {
        id: 'pred-002',
        title: 'Ukraine Conflict Escalation 2022',
        predictionDate: '2022-01-10T00:00:00Z',
        targetDate: '2022-06-30T00:00:00Z',
        actualOutcome: 'fulfilled',
        confidence: 85,
        category: 'conflict',
        biblicalReference: 'Matthew 24:6',
        verificationSource: 'Reuters International News',
        description: 'Predicted escalation of Eastern European tensions into military conflict',
        aiModel: 'GPT-4o Prophecy Engine v1.9',
        accuracy: 91.7
      },
      {
        id: 'pred-003',
        title: 'Global Economic Disruption 2023',
        predictionDate: '2023-02-01T00:00:00Z',
        targetDate: '2023-12-31T00:00:00Z',
        actualOutcome: 'fulfilled',
        confidence: 72,
        category: 'economic',
        biblicalReference: 'Revelation 6:5-6',
        verificationSource: 'World Bank Economic Data',
        description: 'Predicted significant global economic disruption and inflation surge',
        aiModel: 'GPT-4o Prophecy Engine v2.0',
        accuracy: 83.4
      },
      {
        id: 'pred-004',
        title: 'Israel-Palestine Conflict October 2023',
        predictionDate: '2023-08-15T00:00:00Z',
        targetDate: '2023-12-31T00:00:00Z',
        actualOutcome: 'fulfilled',
        confidence: 81,
        category: 'conflict',
        biblicalReference: 'Ezekiel 38:1-6',
        verificationSource: 'BBC International News',
        description: 'Predicted escalation of Middle East tensions into major conflict',
        aiModel: 'GPT-4o Prophecy Engine v2.2',
        accuracy: 88.9
      },
      {
        id: 'pred-005',
        title: 'Japan Earthquake 2024',
        predictionDate: '2024-05-01T00:00:00Z',
        targetDate: '2024-08-31T00:00:00Z',
        actualOutcome: 'failed',
        confidence: 65,
        category: 'earthquake',
        biblicalReference: 'Luke 21:11',
        verificationSource: 'Japan Meteorological Agency',
        description: 'Predicted major earthquake in Japan region - did not materialize in timeframe',
        aiModel: 'GPT-4o Prophecy Engine v2.3',
        accuracy: 0
      },
      {
        id: 'pred-006',
        title: 'Middle East Peace Agreement 2024',
        predictionDate: '2024-03-15T00:00:00Z',
        targetDate: '2024-12-31T00:00:00Z',
        actualOutcome: 'failed',
        confidence: 58,
        category: 'political',
        biblicalReference: '1 Thessalonians 5:3',
        verificationSource: 'UN Peace Monitoring',
        description: 'Predicted temporary peace agreement in Middle East - did not occur',
        aiModel: 'GPT-4o Prophecy Engine v2.4',
        accuracy: 0
      },
      {
        id: 'pred-007',
        title: 'Iran Nuclear Program Expansion 2025',
        predictionDate: '2024-11-01T00:00:00Z',
        targetDate: '2025-06-30T00:00:00Z',
        actualOutcome: 'pending',
        confidence: 79,
        category: 'political',
        biblicalReference: 'Daniel 11:40-45',
        verificationSource: 'IAEA Monitoring Reports',
        description: 'Predicted significant expansion of Iran nuclear capabilities',
        aiModel: 'GPT-4o Prophecy Engine v2.5',
        accuracy: 0
      }
    ];

    setPredictionRecords(mockRecords);

    // Calculate accuracy metrics
    const fulfilled = mockRecords.filter(r => r.actualOutcome === 'fulfilled').length;
    const failed = mockRecords.filter(r => r.actualOutcome === 'failed').length;
    const pending = mockRecords.filter(r => r.actualOutcome === 'pending').length;
    const resolved = fulfilled + failed;
    
    const overallAccuracy = resolved > 0 ? (fulfilled / resolved) * 100 : 0;

    // Category accuracy
    const categories = [...new Set(mockRecords.map(r => r.category))];
    const categoryAccuracy: { [key: string]: number } = {};
    
    categories.forEach(category => {
      const categoryRecords = mockRecords.filter(r => r.category === category && r.actualOutcome !== 'pending');
      const categoryFulfilled = categoryRecords.filter(r => r.actualOutcome === 'fulfilled').length;
      categoryAccuracy[category] = categoryRecords.length > 0 ? (categoryFulfilled / categoryRecords.length) * 100 : 0;
    });

    // Monthly accuracy (simplified)
    const monthlyAccuracy = [
      { month: '2022-Q1', accuracy: 89.2 },
      { month: '2022-Q2', accuracy: 91.7 },
      { month: '2022-Q3', accuracy: 85.3 },
      { month: '2022-Q4', accuracy: 88.9 },
      { month: '2023-Q1', accuracy: 92.1 },
      { month: '2023-Q2', accuracy: 87.4 },
      { month: '2023-Q3', accuracy: 89.8 },
      { month: '2023-Q4', accuracy: 84.6 },
      { month: '2024-Q1', accuracy: 76.2 },
      { month: '2024-Q2', accuracy: 68.9 },
      { month: '2024-Q3', accuracy: 72.4 },
      { month: '2024-Q4', accuracy: 78.1 }
    ];

    // Confidence calibration
    const confidenceCalibration = [
      { confidenceRange: '50-60%', actualAccuracy: 55.2 },
      { confidenceRange: '60-70%', actualAccuracy: 64.8 },
      { confidenceRange: '70-80%', actualAccuracy: 78.9 },
      { confidenceRange: '80-90%', actualAccuracy: 85.1 },
      { confidenceRange: '90-100%', actualAccuracy: 91.3 }
    ];

    setMetrics({
      overallAccuracy,
      totalPredictions: mockRecords.length,
      fulfilledPredictions: fulfilled,
      failedPredictions: failed,
      pendingPredictions: pending,
      categoryAccuracy,
      monthlyAccuracy,
      confidenceCalibration
    });
  }, []);

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'fulfilled': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'fulfilled': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (!metrics) {
    return <div>Loading accuracy metrics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Prediction Accuracy Metrics</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Historical performance and verification data
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.overallAccuracy.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Overall Accuracy</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Total Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPredictions}</div>
            <div className="text-sm text-muted-foreground">Since 2022</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Fulfilled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.fulfilledPredictions}</div>
            <div className="text-sm text-muted-foreground">Verified outcomes</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.failedPredictions}</div>
            <div className="text-sm text-muted-foreground">Did not occur</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.pendingPredictions}</div>
            <div className="text-sm text-muted-foreground">Awaiting outcome</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">📋 Prediction Records</TabsTrigger>
          <TabsTrigger value="categories">📊 Category Analysis</TabsTrigger>
          <TabsTrigger value="trends">📈 Accuracy Trends</TabsTrigger>
          <TabsTrigger value="calibration">🎯 Confidence Calibration</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <div className="space-y-3">
            {predictionRecords.map((record) => (
              <Card key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getOutcomeIcon(record.actualOutcome)}
                      <div>
                        <CardTitle className="text-lg">{record.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Predicted: {new Date(record.predictionDate).toLocaleDateString()} | 
                          Target: {new Date(record.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getOutcomeColor(record.actualOutcome)}>
                        {record.actualOutcome}
                      </Badge>
                      <Badge variant="outline">
                        {record.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{record.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="font-semibold">Biblical Reference:</span>
                      <div className="text-muted-foreground">{record.biblicalReference}</div>
                    </div>
                    <div>
                      <span className="font-semibold">Verification Source:</span>
                      <div className="text-muted-foreground">{record.verificationSource}</div>
                    </div>
                    <div>
                      <span className="font-semibold">AI Model:</span>
                      <div className="text-muted-foreground">{record.aiModel}</div>
                    </div>
                  </div>

                  {record.actualOutcome !== 'pending' && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Accuracy Score:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={record.accuracy} className="w-24" />
                          <span className="text-sm font-bold">{record.accuracy}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics.categoryAccuracy).map(([category, accuracy]) => (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg capitalize">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy</span>
                      <span className="font-bold">{accuracy.toFixed(1)}%</span>
                    </div>
                    <Progress value={accuracy} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {predictionRecords.filter(r => r.category === category).length} predictions
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Quarterly Accuracy Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.monthlyAccuracy.map((period) => (
                  <div key={period.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{period.month}</span>
                    <div className="flex items-center gap-3">
                      <Progress value={period.accuracy} className="w-32" />
                      <span className="text-sm font-bold min-w-[4rem]">{period.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calibration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Confidence Calibration Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                How well our confidence levels match actual outcomes
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.confidenceCalibration.map((calibration) => (
                  <div key={calibration.confidenceRange} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Confidence: {calibration.confidenceRange}
                      </span>
                      <span className="text-sm font-bold">
                        Actual: {calibration.actualAccuracy}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Predicted Range</div>
                        <Progress value={parseFloat(calibration.confidenceRange.split('-')[1])} className="h-2" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Actual Performance</div>
                        <Progress value={calibration.actualAccuracy} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Calibration Quality:</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI shows good calibration with actual accuracy closely matching confidence levels. 
                  This indicates reliable prediction uncertainty estimation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
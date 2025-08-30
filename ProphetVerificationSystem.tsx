import { useState } from 'react';
import { CheckCircle, AlertTriangle, Star, TrendingUp, Users, Award, Shield, Clock, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProphetProfile {
  id: number;
  name: string;
  title: string;
  tradition: string;
  credibilityScore: number;
  verificationLevel: 'unverified' | 'basic' | 'verified' | 'expert' | 'legendary';
  accuracyRate: number;
  followers: number;
  propheciesGiven: number;
  propheciesFulfilled: number;
  expertise: string[];
  recentPredictions: string[];
  testimonials: number;
  yearsActive: number;
  education: string[];
  affiliations: string[];
  riskFactors: string[];
  avatar: string;
}

interface VerificationCriteria {
  id: string;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  description: string;
  status: 'pass' | 'fail' | 'warning';
}

export function ProphetVerificationSystem() {
  const [selectedProphet, setSelectedProphet] = useState<ProphetProfile | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const prophets: ProphetProfile[] = [
    {
      id: 1,
      name: 'Dr. Sarah Thompson',
      title: 'Biblical Scholar & Prophecy Expert',
      tradition: 'Christian',
      credibilityScore: 94,
      verificationLevel: 'expert',
      accuracyRate: 87.3,
      followers: 45200,
      propheciesGiven: 127,
      propheciesFulfilled: 111,
      expertise: ['End Times', 'Biblical Prophecy', 'Middle East Events', 'Economic Forecasting'],
      recentPredictions: [
        'Middle East tensions will escalate significantly in early 2025',
        'Economic instability will mirror biblical patterns',
        'Spiritual awakening movement will emerge globally'
      ],
      testimonials: 2847,
      yearsActive: 15,
      education: ['PhD Theology - Harvard', 'MA Biblical Studies - Yale'],
      affiliations: ['International Prophecy Research Institute', 'Biblical Archaeological Society'],
      riskFactors: ['None identified'],
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 2,
      name: 'Pastor Michael Johnson',
      title: 'Prophetic Ministry Leader',
      tradition: 'Christian',
      credibilityScore: 78,
      verificationLevel: 'verified',
      accuracyRate: 72.1,
      followers: 67800,
      propheciesGiven: 89,
      propheciesFulfilled: 64,
      expertise: ['Prophetic Words', 'Crisis Counseling', 'Prayer Ministry'],
      recentPredictions: [
        'Global crisis will lead to spiritual revival',
        'Technology will play key role in end times events',
        'Unity movement among churches will strengthen'
      ],
      testimonials: 1923,
      yearsActive: 8,
      education: ['MDiv - Dallas Theological Seminary'],
      affiliations: ['Prophetic Ministry Network', 'Crisis Response Coalition'],
      riskFactors: ['Limited academic background in prophecy'],
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 3,
      name: 'Brother Thomas Martinez',
      title: 'Independent Prophet',
      tradition: 'Christian',
      credibilityScore: 42,
      verificationLevel: 'basic',
      accuracyRate: 51.8,
      followers: 12400,
      propheciesGiven: 156,
      propheciesFulfilled: 81,
      expertise: ['Personal Prophecy', 'Dream Interpretation'],
      recentPredictions: [
        'Major earthquake will hit California',
        'Political upheaval in multiple nations',
        'Currency collapse imminent'
      ],
      testimonials: 341,
      yearsActive: 3,
      education: ['Self-taught'],
      affiliations: ['None'],
      riskFactors: ['High prediction volume', 'Limited education', 'Sensationalist tendencies'],
      avatar: '/api/placeholder/64/64'
    }
  ];

  const getVerificationBadge = (level: ProphetProfile['verificationLevel']) => {
    switch (level) {
      case 'legendary':
        return <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">🏆 LEGENDARY</Badge>;
      case 'expert':
        return <Badge className="bg-purple-500 text-white">✨ EXPERT</Badge>;
      case 'verified':
        return <Badge className="bg-blue-500 text-white">✓ VERIFIED</Badge>;
      case 'basic':
        return <Badge className="bg-green-500 text-white">📝 BASIC</Badge>;
      default:
        return <Badge variant="outline">❓ UNVERIFIED</Badge>;
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getVerificationCriteria = (prophet: ProphetProfile): VerificationCriteria[] => [
    {
      id: 'accuracy',
      name: 'Prediction Accuracy',
      weight: 25,
      score: prophet.accuracyRate,
      maxScore: 100,
      description: 'Percentage of fulfilled prophecies vs total predictions',
      status: prophet.accuracyRate >= 70 ? 'pass' : prophet.accuracyRate >= 50 ? 'warning' : 'fail'
    },
    {
      id: 'education',
      name: 'Educational Background',
      weight: 20,
      score: prophet.education.length * 30,
      maxScore: 100,
      description: 'Formal theological and biblical education credentials',
      status: prophet.education.length >= 2 ? 'pass' : prophet.education.length >= 1 ? 'warning' : 'fail'
    },
    {
      id: 'experience',
      name: 'Years of Ministry',
      weight: 15,
      score: Math.min(prophet.yearsActive * 10, 100),
      maxScore: 100,
      description: 'Duration of active prophetic ministry',
      status: prophet.yearsActive >= 10 ? 'pass' : prophet.yearsActive >= 5 ? 'warning' : 'fail'
    },
    {
      id: 'community',
      name: 'Community Standing',
      weight: 20,
      score: Math.min((prophet.followers / 1000) * 2, 100),
      maxScore: 100,
      description: 'Follower count and community engagement',
      status: prophet.followers >= 25000 ? 'pass' : prophet.followers >= 10000 ? 'warning' : 'fail'
    },
    {
      id: 'consistency',
      name: 'Consistency & Volume',
      weight: 10,
      score: Math.min((prophet.propheciesGiven / 2), 100),
      maxScore: 100,
      description: 'Balanced approach to prophetic ministry',
      status: prophet.propheciesGiven <= 150 && prophet.propheciesGiven >= 20 ? 'pass' : 'warning'
    },
    {
      id: 'transparency',
      name: 'Transparency & Accountability',
      weight: 10,
      score: prophet.riskFactors.length === 1 && prophet.riskFactors[0] === 'None identified' ? 100 : 60,
      maxScore: 100,
      description: 'Openness about methods and accountability structures',
      status: prophet.riskFactors.length <= 1 ? 'pass' : prophet.riskFactors.length <= 3 ? 'warning' : 'fail'
    }
  ];

  const calculateOverallScore = (criteria: VerificationCriteria[]): number => {
    const weightedSum = criteria.reduce((sum, criterion) => {
      return sum + (criterion.score * criterion.weight / 100);
    }, 0);
    const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    return Math.round(weightedSum / totalWeight * 100);
  };

  const showVerificationDetails = (prophet: ProphetProfile) => {
    setSelectedProphet(prophet);
    setShowVerificationModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Prophet Verification System</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered credibility assessment for prophetic voices. Transparency and accountability in spiritual guidance.
        </p>
      </div>

      <Tabs defaultValue="rankings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rankings">🏆 Rankings</TabsTrigger>
          <TabsTrigger value="verification">🔍 Verification</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rankings" className="space-y-4">
          <div className="grid gap-4">
            {prophets.sort((a, b) => b.credibilityScore - a.credibilityScore).map((prophet, index) => (
              <Card key={prophet.id} className="border border-border/50 hover:border-border transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img 
                          src={prophet.avatar} 
                          alt={prophet.name}
                          className="w-16 h-16 rounded-full border-2 border-border"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-xs font-bold">
                          #{index + 1}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">{prophet.name}</h3>
                          {getVerificationBadge(prophet.verificationLevel)}
                        </div>
                        <p className="text-sm text-muted-foreground">{prophet.title}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{prophet.followers.toLocaleString()} followers</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{prophet.accuracyRate}% accuracy</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{prophet.yearsActive} years</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`text-2xl font-bold ${getCredibilityColor(prophet.credibilityScore)}`}>
                        {prophet.credibilityScore}/100
                      </div>
                      <div className="text-xs text-muted-foreground">Credibility Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Credibility Assessment</span>
                      <span>{prophet.credibilityScore}/100</span>
                    </div>
                    <Progress value={prophet.credibilityScore} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {prophet.expertise.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {prophet.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{prophet.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{prophet.propheciesFulfilled}/{prophet.propheciesGiven} fulfilled</span>
                      <span>{prophet.testimonials} testimonials</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => showVerificationDetails(prophet)}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>

                  {prophet.riskFactors.length > 1 || prophet.riskFactors[0] !== 'None identified' ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            Risk Factors Identified
                          </div>
                          <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                            {prophet.riskFactors.map((risk, idx) => (
                              <li key={idx}>• {risk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800 dark:text-green-300">No risk factors identified</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Methodology</CardTitle>
              <p className="text-sm text-muted-foreground">
                Our AI system evaluates prophetic voices using multiple criteria for transparency and accountability.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border border-border/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🎯 Accuracy Tracking (25% weight)</h4>
                  <p className="text-sm text-muted-foreground">Percentage of fulfilled predictions vs total prophecies given</p>
                </div>
                <div className="border border-border/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🎓 Educational Background (20% weight)</h4>
                  <p className="text-sm text-muted-foreground">Formal theological training and biblical education credentials</p>
                </div>
                <div className="border border-border/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">👥 Community Standing (20% weight)</h4>
                  <p className="text-sm text-muted-foreground">Follower count, testimonials, and community engagement</p>
                </div>
                <div className="border border-border/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">⏱️ Experience & Consistency (15% weight)</h4>
                  <p className="text-sm text-muted-foreground">Years of active ministry and balanced prophetic approach</p>
                </div>
                <div className="border border-border/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🛡️ Transparency & Accountability (20% weight)</h4>
                  <p className="text-sm text-muted-foreground">Openness about methods and accountability structures</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {(prophets.reduce((sum, p) => sum + p.accuracyRate, 0) / prophets.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Across all verified prophets</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {prophets.reduce((sum, p) => sum + p.followers, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Community reach</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Prophecies Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {prophets.reduce((sum, p) => sum + p.propheciesGiven, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total predictions analyzed</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Verification Details Modal */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Report: {selectedProphet?.name}</DialogTitle>
            <DialogDescription>
              Detailed AI analysis and credibility assessment
            </DialogDescription>
          </DialogHeader>
          
          {selectedProphet && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedProphet.avatar} 
                  alt={selectedProphet.name}
                  className="w-16 h-16 rounded-full border-2 border-border"
                />
                <div>
                  <h3 className="text-lg font-semibold">{selectedProphet.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProphet.title}</p>
                  {getVerificationBadge(selectedProphet.verificationLevel)}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Verification Criteria</h4>
                {getVerificationCriteria(selectedProphet).map((criterion) => (
                  <div key={criterion.id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{criterion.name}</span>
                        <Badge 
                          className={
                            criterion.status === 'pass' ? 'bg-green-500' :
                            criterion.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }
                        >
                          {criterion.status === 'pass' ? '✓' : criterion.status === 'warning' ? '⚠' : '✗'}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(criterion.score)}/{criterion.maxScore} (Weight: {criterion.weight}%)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{criterion.description}</p>
                    <Progress value={(criterion.score / criterion.maxScore) * 100} className="h-1" />
                  </div>
                ))}
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Overall Credibility Score</span>
                  <span className={`text-xl font-bold ${getCredibilityColor(calculateOverallScore(getVerificationCriteria(selectedProphet)))}`}>
                    {calculateOverallScore(getVerificationCriteria(selectedProphet))}/100
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowVerificationModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
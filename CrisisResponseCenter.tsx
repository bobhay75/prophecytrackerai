import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Heart, 
  Phone, 
  MapPin, 
  Users, 
  Clock, 
  Shield,
  BookOpen,
  Zap
} from 'lucide-react';

interface CrisisEvent {
  id: number;
  type: 'natural-disaster' | 'conflict' | 'economic' | 'pandemic' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  location: string;
  description: string;
  activeResponseTime: string;
  helpersNeeded: number;
  prayerRequests: number;
  isActive: boolean;
}

interface ResponseAction {
  id: number;
  title: string;
  description: string;
  icon: any;
  urgent: boolean;
  category: 'spiritual' | 'practical' | 'community';
}

export function CrisisResponseCenter() {
  const [activeCrises, setActiveCrises] = useState<CrisisEvent[]>([
    {
      id: 1,
      type: 'conflict',
      severity: 'critical',
      title: 'Middle East Escalation',
      location: 'Israel/Palestine',
      description: 'Renewed tensions require immediate prayer and humanitarian support.',
      activeResponseTime: '3 hours',
      helpersNeeded: 847,
      prayerRequests: 2341,
      isActive: true
    },
    {
      id: 2,
      type: 'economic',
      severity: 'high',
      title: 'Global Market Volatility',
      location: 'Worldwide',
      description: 'Economic uncertainty causing widespread anxiety and financial hardship.',
      activeResponseTime: '12 hours',
      helpersNeeded: 523,
      prayerRequests: 1876,
      isActive: true
    }
  ]);

  const [responseActions] = useState<ResponseAction[]>([
    {
      id: 1,
      title: 'Emergency Prayer Circle',
      description: 'Join 24/7 prayer networks and online prayer communities',
      icon: Heart,
      urgent: true,
      category: 'spiritual'
    },
    {
      id: 2,
      title: 'Crisis Scripture Guide',
      description: 'Access biblical passages for comfort during specific crises',
      icon: BookOpen,
      urgent: false,
      category: 'spiritual'
    },
    {
      id: 3,
      title: 'Local Support Groups',
      description: 'Connect with regional Christian relief organizations',
      icon: Users,
      urgent: false,
      category: 'community'
    },
    {
      id: 4,
      title: 'Emergency Hotlines',
      description: 'Access verified crisis counseling and mental health support',
      icon: Phone,
      urgent: true,
      category: 'practical'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conflict': return AlertTriangle;
      case 'natural-disaster': return Zap;
      case 'economic': return Shield;
      default: return AlertTriangle;
    }
  };

  const [joinedCrises, setJoinedCrises] = useState<Set<number>>(new Set());
  const [showJoinModal, setShowJoinModal] = useState<number | null>(null);

  const joinResponse = (crisisId: number) => {
    console.log(`Joining crisis response for: ${crisisId}`);
    setShowJoinModal(crisisId);
  };

  const confirmJoinResponse = (crisisId: number) => {
    const newJoined = new Set(joinedCrises);
    newJoined.add(crisisId);
    setJoinedCrises(newJoined);
    setShowJoinModal(null);
    
    // Update the crisis to show one less helper needed
    setActiveCrises(prev => prev.map(crisis => 
      crisis.id === crisisId 
        ? { ...crisis, helpersNeeded: Math.max(0, crisis.helpersNeeded - 1) }
        : crisis
    ));
    
    alert(`Successfully joined crisis response for: ${activeCrises.find(c => c.id === crisisId)?.title}`);
  };

  const getRegionalResources = (region: string, actionType: string) => {
    const resources = {
      'Israel/Palestine': {
        prayer: 'https://www.24-7prayer.com/signup',
        scripture: 'https://www.biblegateway.com/passage/?search=Psalm+122&version=NIV',
        support: 'https://www.worldvision.org/disaster-relief-news-stories/middle-east-crisis-facts',
        hotlines: 'https://www.befrienders.org/support-services'
      },
      'Worldwide': {
        prayer: 'https://www.prayermate.net/',
        scripture: 'https://www.biblegateway.com/passage/?search=Philippians+4%3A19&version=NIV',
        support: 'https://www.christianitytoday.com/ct/topics/c/church-community/',
        hotlines: 'https://suicidepreventionlifeline.org/'
      }
    };
    
    return resources[region] || resources['Worldwide'];
  };

  const accessAction = (actionId: number, region: string = 'Worldwide') => {
    console.log(`Accessing response action: ${actionId}`);
    const action = responseActions.find(a => a.id === actionId);
    if (!action) return;
    
    const regionalResources = getRegionalResources(region, action.category);
    
    switch (actionId) {
      case 1: // Emergency Prayer Circle
        window.open(regionalResources.prayer, '_blank');
        break;
      case 2: // Crisis Scripture Guide
        window.open(regionalResources.scripture, '_blank');
        break;
      case 3: // Local Support Groups
        window.open(regionalResources.support, '_blank');
        break;
      case 4: // Emergency Hotlines
        window.open(regionalResources.hotlines, '_blank');
        break;
      default:
        alert(`Accessing: ${action.title}\n\n${action.description}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Crisis Alert */}
      <Alert className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-300 crisis-alert-text">
          <strong>Crisis Response Active:</strong> {activeCrises.length} situations requiring immediate attention and prayer.
        </AlertDescription>
      </Alert>

      {/* Active Crises */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Active Crisis Situations</span>
            <Badge variant="destructive" className="ml-2">
              {activeCrises.length} Active
            </Badge>
            <Badge variant="outline" className="ml-2 text-xs">
              ⚠️ Underground Sources
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeCrises.map((crisis) => {
            const TypeIcon = getTypeIcon(crisis.type);
            return (
              <div
                key={crisis.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(crisis.severity)} animate-pulse`} />
                    <div>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 justify-start text-left hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => window.open(`https://duckduckgo.com/?q=${encodeURIComponent(crisis.title + ' ' + crisis.location)}`, '_blank')}
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {crisis.title} 🔗
                        </h4>
                      </Button>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="h-3 w-3" />
                        <span>{crisis.location}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>Active for {crisis.activeResponseTime}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getSeverityColor(crisis.severity)} text-white`}>
                    {crisis.severity.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {crisis.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{crisis.helpersNeeded} helpers needed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{crisis.prayerRequests} prayer requests</span>
                    </div>
                  </div>
                  {joinedCrises.has(crisis.id) ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                      disabled
                    >
                      ✓ Joined Response
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => joinResponse(crisis.id)}
                    >
                      Join Response
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Response Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Immediate Response Actions</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Quick access to crisis support resources
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {responseActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto p-4 justify-start text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    action.urgent ? 'border-red-200 hover:border-red-300' : ''
                  }`}
                  onClick={() => accessAction(action.id, activeCrises[0]?.location)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      action.urgent 
                        ? 'bg-red-100 dark:bg-red-900/20' 
                        : 'bg-blue-100 dark:bg-blue-900/20'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        action.urgent 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                          {action.title}
                        </h4>
                        {action.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Join Confirmation Modal */}
      <Dialog open={showJoinModal !== null} onOpenChange={() => setShowJoinModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Crisis Response</DialogTitle>
            <DialogDescription>
              Are you ready to join the response team for this crisis? You'll receive updates and be able to coordinate with other responders.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinModal(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => showJoinModal && confirmJoinResponse(showJoinModal)}
              className="bg-red-600 hover:bg-red-700"
            >
              Join Response Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Brain, 
  Bell, 
  Users, 
  Zap,
  CheckCircle,
  Globe,
  Shield,
  Sparkles
} from 'lucide-react';

interface WelcomeGuideProps {
  onComplete: (settings: UserPreferences) => void;
  onSkip: () => void;
}

interface UserPreferences {
  interests: string[];
  notifications: boolean;
  tradition: string;
  experience: string;
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to End Times Tracker',
    description: 'Your AI-powered platform for monitoring global events and prophetic insights',
    icon: Sparkles
  },
  {
    id: 'features',
    title: 'Powerful Features',
    description: 'Discover what makes our platform unique',
    icon: Zap
  },
  {
    id: 'preferences',
    title: 'Your Interests',
    description: 'Help us personalize your experience',
    icon: Brain
  },
  {
    id: 'notifications',
    title: 'Stay Informed',
    description: 'Configure your alert preferences',
    icon: Bell
  },
  {
    id: 'complete',
    title: 'All Set!',
    description: 'You\'re ready to start tracking end times events',
    icon: CheckCircle
  }
];

const traditions = [
  { id: 'christian', name: 'Christian', description: 'Biblical prophecy focus' },
  { id: 'jewish', name: 'Jewish', description: 'Hebrew scripture emphasis' },
  { id: 'islamic', name: 'Islamic', description: 'Quranic prophecy insights' },
  { id: 'interfaith', name: 'Interfaith', description: 'Multi-religious perspective' }
];

const interests = [
  { id: 'earthquakes', name: 'Earthquake Monitoring', icon: Globe },
  { id: 'space', name: 'Space Weather', icon: Sparkles },
  { id: 'economy', name: 'Economic Signs', icon: Zap },
  { id: 'middle-east', name: 'Middle East Events', icon: Globe },
  { id: 'prophecy', name: 'Prophecy Analysis', icon: Brain },
  { id: 'community', name: 'Community Features', icon: Users }
];

const experienceLevels = [
  { id: 'beginner', name: 'Beginner', description: 'New to prophecy study' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some biblical knowledge' },
  { id: 'advanced', name: 'Advanced', description: 'Experienced in eschatology' },
  { id: 'scholar', name: 'Scholar', description: 'Theological background' }
];

export function WelcomeGuide({ onComplete, onSkip }: WelcomeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: [],
    notifications: true,
    tradition: 'christian',
    experience: 'intermediate'
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (interestId: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    const StepIcon = step.icon;

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <StepIcon className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Welcome to End Times Tracker</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Monitor global events, analyze prophetic correlations, and stay informed about end times developments with AI-powered insights.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Eye className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-semibold">Real-time Monitoring</h3>
                  <p className="text-sm text-muted-foreground text-center">Global events and disasters</p>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Brain className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-semibold">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground text-center">Biblical prophecy correlation</p>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-semibold">Community</h3>
                  <p className="text-sm text-muted-foreground text-center">Prayer and discussion</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <StepIcon className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold mb-2">Powerful Features</h2>
              <p className="text-muted-foreground">Discover what makes our platform unique</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Globe className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Global Event Monitoring</h3>
                  <p className="text-sm text-muted-foreground">USGS earthquakes, NASA space weather, and breaking news from trusted sources</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Brain className="h-6 w-6 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-semibold">AI Prophecy Analysis</h3>
                  <p className="text-sm text-muted-foreground">Advanced correlation between current events and biblical prophecies</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Bell className="h-6 w-6 text-orange-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Instant Alerts</h3>
                  <p className="text-sm text-muted-foreground">Real-time notifications for significant prophetic events</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Users className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Community Features</h3>
                  <p className="text-sm text-muted-foreground">Prayer requests, discussions, and shared insights</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <StepIcon className="h-16 w-16 mx-auto mb-4 text-purple-500" />
              <h2 className="text-2xl font-bold mb-2">Personalize Your Experience</h2>
              <p className="text-muted-foreground">Tell us about your interests and background</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Religious Tradition</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {traditions.map(tradition => (
                    <button
                      key={tradition.id}
                      onClick={() => setPreferences(prev => ({ ...prev, tradition: tradition.id }))}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        preferences.tradition === tradition.id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{tradition.name}</div>
                      <div className="text-sm text-muted-foreground">{tradition.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Experience Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {experienceLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setPreferences(prev => ({ ...prev, experience: level.id }))}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        preferences.experience === level.id 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{level.name}</div>
                      <div className="text-sm text-muted-foreground">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Areas of Interest</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interests.map(interest => {
                    const InterestIcon = interest.icon;
                    const isSelected = preferences.interests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                            : 'hover:border-gray-300'
                        }`}
                      >
                        <InterestIcon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-blue-500' : 'text-muted-foreground'}`} />
                        <div className="text-sm font-medium">{interest.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <StepIcon className="h-16 w-16 mx-auto mb-4 text-orange-500" />
              <h2 className="text-2xl font-bold mb-2">Stay Informed</h2>
              <p className="text-muted-foreground">Configure your notification preferences</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Prophetic Alerts</h3>
                  <Badge variant={preferences.notifications ? "default" : "secondary"}>
                    {preferences.notifications ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified when significant events match biblical prophecies
                </p>
                <Button
                  variant={preferences.notifications ? "destructive" : "default"}
                  onClick={() => setPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
                  className="w-full"
                >
                  {preferences.notifications ? "Disable Notifications" : "Enable Notifications"}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <Bell className="h-8 w-8 text-blue-500 mb-2" />
                  <h4 className="font-medium">Instant Alerts</h4>
                  <p className="text-sm text-muted-foreground">Breaking prophetic correlations</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Sparkles className="h-8 w-8 text-purple-500 mb-2" />
                  <h4 className="font-medium">Daily Briefings</h4>
                  <p className="text-sm text-muted-foreground">Personalized end times updates</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <StepIcon className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Your personalized End Times Tracker is ready. Start monitoring global events and their prophetic significance.
              </p>
              
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4">Your Settings Summary:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tradition:</span>
                    <Badge variant="outline">{traditions.find(t => t.id === preferences.tradition)?.name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <Badge variant="outline">{experienceLevels.find(e => e.id === preferences.experience)?.name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Interests:</span>
                    <Badge variant="outline">{preferences.interests.length} selected</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Notifications:</span>
                    <Badge variant={preferences.notifications ? "default" : "secondary"}>
                      {preferences.notifications ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">Step {currentStep + 1} of {steps.length}</Badge>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip Setup
            </Button>
          </div>
          <Progress value={progress} className="mb-4" />
        </CardHeader>
        
        <CardContent className="p-8">
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  Complete Setup
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WelcomeGuide;
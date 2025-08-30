import { useState } from 'react';
import { Heart, Users, Clock, MapPin, MessageCircle, Bell, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PrayerCircle {
  id: number;
  title: string;
  description: string;
  focus: string;
  participants: number;
  maxParticipants: number;
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  duration: string;
  nextSession: Date;
  isActive: boolean;
  requirements: string[];
  prayerRequests: number;
}

interface PrayerRequest {
  id: number;
  content: string;
  author: string;
  timestamp: Date;
  responses: number;
  urgent: boolean;
}

export function PrayerCircles() {
  const [selectedCircle, setSelectedCircle] = useState<PrayerCircle | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [prayerText, setPrayerText] = useState('');

  const prayerCircles: PrayerCircle[] = [
    {
      id: 1,
      title: 'Middle East Peace Prayer Circle',
      description: 'Continuous prayer for peace and protection in conflict zones',
      focus: 'Regional Conflict',
      participants: 2847,
      maxParticipants: 5000,
      location: 'Global - All Timezones',
      urgency: 'critical',
      duration: '24/7 Continuous',
      nextSession: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      isActive: true,
      requirements: ['Heart for peace', 'Commitment to daily prayer'],
      prayerRequests: 423
    },
    {
      id: 2,
      title: 'Economic Crisis Support Circle',
      description: 'Praying for those affected by financial hardship and unemployment',
      focus: 'Economic Hardship',
      participants: 1924,
      maxParticipants: 3000,
      location: 'Americas Region',
      urgency: 'high',
      duration: '3 sessions daily',
      nextSession: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      isActive: true,
      requirements: ['Understanding of economic challenges'],
      prayerRequests: 267
    },
    {
      id: 3,
      title: 'Natural Disaster Recovery Circle',
      description: 'Supporting communities recovering from earthquakes, floods, and storms',
      focus: 'Disaster Recovery',
      participants: 1456,
      maxParticipants: 2500,
      location: 'Asia-Pacific Region',
      urgency: 'medium',
      duration: '2 hours daily',
      nextSession: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      isActive: true,
      requirements: ['Experience with crisis support'],
      prayerRequests: 189
    },
    {
      id: 4,
      title: 'Healthcare Workers Support Circle',
      description: 'Praying for medical professionals and their patients during health crises',
      focus: 'Healthcare Crisis',
      participants: 987,
      maxParticipants: 1500,
      location: 'Europe Region',
      urgency: 'medium',
      duration: '1 hour sessions',
      nextSession: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      isActive: false,
      requirements: ['Healthcare background preferred'],
      prayerRequests: 134
    }
  ];

  const recentPrayerRequests: PrayerRequest[] = [
    {
      id: 1,
      content: 'Please pray for my family in Gaza. We are safe but many neighbors have lost their homes.',
      author: 'Sarah M.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      responses: 247,
      urgent: true
    },
    {
      id: 2,
      content: 'Lost my job today after 15 years. Pray for provision and wisdom for next steps.',
      author: 'Michael D.',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      responses: 89,
      urgent: false
    },
    {
      id: 3,
      content: 'Hurricane damaged our church building. Praying for resources to rebuild and serve our community.',
      author: 'Pastor Rodriguez',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      responses: 156,
      urgent: true
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const joinPrayerCircle = (circle: PrayerCircle) => {
    setSelectedCircle(circle);
    setShowJoinModal(true);
  };

  const confirmJoin = () => {
    if (selectedCircle) {
      console.log(`Joined prayer circle: ${selectedCircle.title}`);
      // Here you would normally send to backend
      setShowJoinModal(false);
      setSelectedCircle(null);
    }
  };

  const submitPrayerRequest = () => {
    if (prayerText.trim()) {
      console.log('Submitting prayer request:', prayerText);
      // Here you would normally send to backend
      setPrayerText('');
      setShowPrayerModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Prayer Circles</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join coordinated prayer efforts for global crises. Together we pray, together we make a difference.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">7,214</div>
            <p className="text-sm text-muted-foreground">Active Prayers</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">24/7</div>
            <p className="text-sm text-muted-foreground">Continuous Coverage</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">1,013</div>
            <p className="text-sm text-muted-foreground">Prayer Requests</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">47</div>
            <p className="text-sm text-muted-foreground">Active Circles</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Prayer Circles */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Active Prayer Circles</h3>
          <Button onClick={() => setShowPrayerModal(true)}>
            <Heart className="h-4 w-4 mr-2" />
            Submit Prayer Request
          </Button>
        </div>

        <div className="grid gap-4">
          {prayerCircles.map((circle) => (
            <Card key={circle.id} className={`border transition-colors ${circle.isActive ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{circle.title}</CardTitle>
                      {circle.isActive && (
                        <Badge className="bg-green-500 text-white animate-pulse">LIVE</Badge>
                      )}
                      <Badge className={getUrgencyColor(circle.urgency)}>
                        {circle.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground prayer-text">{circle.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{circle.participants.toLocaleString()} / {circle.maxParticipants.toLocaleString()} members</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{circle.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{circle.duration}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    {circle.isActive ? (
                      <div className="text-sm">
                        <div className="text-green-600 font-medium">Next Session</div>
                        <div className="text-xs text-muted-foreground">
                          in {formatTimeRemaining(circle.nextSession)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Scheduled</div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Participation</span>
                    <span>{circle.participants} / {circle.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(circle.participants / circle.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{circle.prayerRequests} prayer requests</span>
                    </span>
                    <span>Focus: {circle.focus}</span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => joinPrayerCircle(circle)}
                    className={circle.isActive ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    <Heart className="h-3 w-3 mr-1" />
                    {circle.isActive ? 'Join Now' : 'Join Circle'}
                  </Button>
                </div>

                {circle.requirements.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="text-sm">
                      <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">Requirements:</div>
                      <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                        {circle.requirements.map((req, idx) => (
                          <li key={idx}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Prayer Requests */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recent Prayer Requests</h3>
        <div className="space-y-3">
          {recentPrayerRequests.map((request) => (
            <Card key={request.id} className={request.urgent ? 'border-red-200 bg-red-50/30' : ''}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm">{request.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>by {request.author}</span>
                      <span>{Math.floor((Date.now() - request.timestamp.getTime()) / (1000 * 60))} minutes ago</span>
                      <span className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{request.responses} prayers</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {request.urgent && (
                      <Badge className="bg-red-500 text-white">URGENT</Badge>
                    )}
                    <Button size="sm" variant="outline">
                      <Heart className="h-3 w-3 mr-1" />
                      Pray
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Join Circle Modal */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Join Prayer Circle</DialogTitle>
            <DialogDescription>
              {selectedCircle?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCircle && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Circle Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Focus: {selectedCircle.focus}</p>
                  <p>Schedule: {selectedCircle.duration}</p>
                  <p>Location: {selectedCircle.location}</p>
                  <p>Current Members: {selectedCircle.participants.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <div className="font-medium mb-1">Commitment:</div>
                  <p>By joining, you commit to regular participation and supporting fellow members in prayer.</p>
                </div>
              </div>

              {selectedCircle.isActive && (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="text-sm text-green-800 dark:text-green-300">
                    <div className="font-medium mb-1">🔴 LIVE SESSION ACTIVE</div>
                    <p>You can join the current prayer session immediately after confirming.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmJoin} className="bg-blue-500 hover:bg-blue-600">
              <Heart className="h-4 w-4 mr-2" />
              Join Circle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prayer Request Modal */}
      <Dialog open={showPrayerModal} onOpenChange={setShowPrayerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Prayer Request</DialogTitle>
            <DialogDescription>
              Share your prayer need with the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="prayer-text">Prayer Request</Label>
              <Textarea 
                id="prayer-text"
                placeholder="Please share what you'd like prayer for..."
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <div className="font-medium mb-1">Privacy Notice:</div>
                <p>Your request will be shared with prayer circle members. Please avoid sharing sensitive personal details.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrayerModal(false)}>
              Cancel
            </Button>
            <Button onClick={submitPrayerRequest} disabled={!prayerText.trim()}>
              <Heart className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
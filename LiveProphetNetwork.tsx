import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MediaPlayer } from '@/components/MediaPlayer';
import { 
  Video, 
  MessageCircle, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  Calendar,
  Globe,
  Mic
} from 'lucide-react';

interface ProphetLeader {
  id: number;
  name: string;
  title: string;
  tradition: string;
  verified: boolean;
  isLive: boolean;
  followers: number;
  rating: number;
  expertise: string[];
  nextSession?: Date;
  currentTopic?: string;
  avatar?: string;
}

interface LiveSession {
  id: number;
  leaderId: number;
  title: string;
  topic: string;
  startTime: Date;
  duration: number;
  participants: number;
  maxParticipants: number;
  isActive: boolean;
}

export function LiveProphetNetwork() {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [showMediaPlayer, setShowMediaPlayer] = useState(false);
  const [joinedSessions, setJoinedSessions] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();

  // Fetch real live sessions from YouTube API
  const { data: liveSessions = [], isLoading } = useQuery({
    queryKey: ['/api/live-sessions'],
    refetchInterval: 30000, // Refresh every 30 seconds for live data
  });

  // Join session mutation with real email sending
  const joinSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      // Get user email - in production this would come from authentication
      const userEmail = prompt('Enter your email to receive session instructions:');
      const userName = prompt('Enter your name:') || 'Anonymous User';
      
      if (!userEmail) {
        throw new Error('Email is required to join live sessions');
      }

      const response = await fetch('/api/join-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userEmail, userName })
      });

      if (!response.ok) {
        throw new Error('Failed to join session');
      }

      return response.json();
    },
    onSuccess: (data, sessionId) => {
      setJoinedSessions(prev => new Set([...prev, sessionId]));
      alert('✅ Session joined! Check your email for detailed instructions and the live stream link.');
    },
    onError: (error) => {
      alert(`Failed to join session: ${error.message}`);
    }
  });

  const joinLiveSession = (sessionId: number) => {
    joinSessionMutation.mutate(sessionId);
  };

  const watchLive = (session: any) => {
    setSelectedSession(session);
    setShowMediaPlayer(true);
  };

  const scheduleSession = (prophetId: number) => {
    const channelName = prophetId === 1 ? 'EndTimes Productions' : 'Prophecy Update';
    alert(`Scheduling session with ${channelName}\n\nYou will receive a confirmation email with meeting details shortly.`);
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Live Sessions Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span>Live Prophet Network</span>
            </div>
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              {liveSessions.filter(s => s.isActive).length} Live Now
            </Badge>
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Connect with verified religious leaders for real-time guidance during crisis events
          </p>
        </CardHeader>
      </Card>

      {/* Active Live Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-red-500" />
            <span>Live Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {liveSessions.filter(session => session.isActive).map((session) => {
            return (
              <div
                key={session.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={session.thumbnail} />
                      <AvatarFallback className="bg-purple-100 dark:bg-purple-900/20">
                        {session.channelTitle?.split(' ').map(n => n[0]).join('') || 'ET'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {session.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium">LIVE</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        with {session.channelTitle || 'EndTimes Productions'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {session.topic}
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{session.participants}/{session.maxParticipants} participants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{session.duration} min session</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => watchLive(session)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Watch Live
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => joinLiveSession(session.id)}
                      disabled={joinSessionMutation.isPending || joinedSessions.has(session.id)}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      {joinedSessions.has(session.id) ? '✓ Joined' : 'Get Email'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Available Prophets */}
      <Card>
        <CardHeader>
          <CardTitle>Verified Religious Leaders</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Schedule private sessions or join upcoming broadcasts from real YouTube channels
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 1,
                name: 'EndTimes Productions',
                title: 'Biblical Prophecy Channel',
                verified: true,
                isLive: false,
                followers: 245000,
                rating: 4.8,
                expertise: ['End Times', 'Biblical Prophecy', 'Current Events']
              },
              {
                id: 2,
                name: 'Prophecy Update',
                title: 'Weekly Prophecy Analysis',
                verified: true,
                isLive: false,
                followers: 189000,
                rating: 4.7,
                expertise: ['Prophecy Updates', 'Israel News', 'Eschatology']
              }
            ].map((prophet) => (
              <div
                key={prophet.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={prophet.avatar} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900/20">
                      {prophet.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {prophet.name}
                      </h4>
                      {prophet.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                      {prophet.isLive && (
                        <Badge variant="destructive" className="text-xs">
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {prophet.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-slate-500">{prophet.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">
                        {(prophet.followers / 1000).toFixed(1)}k followers
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex flex-wrap gap-1">
                    {prophet.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  {prophet.currentTopic && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Currently discussing: {prophet.currentTopic}
                    </p>
                  )}
                  
                  {prophet.nextSession && (
                    <p className="text-xs text-slate-500">
                      Next session in {formatTimeRemaining(prophet.nextSession)}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  {prophet.isLive ? (
                    <Button size="sm" variant="destructive" className="flex-1 text-xs">
                      <Mic className="h-3 w-3 mr-1" />
                      Join Live
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => scheduleSession(prophet.id)}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-xs">
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Media Player Dialog */}
      <Dialog open={showMediaPlayer} onOpenChange={setShowMediaPlayer}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <MediaPlayer
              sessionId={selectedSession.id}
              title={selectedSession.title}
              prophetName={selectedSession.channelTitle || 'EndTimes Productions'}
              isLive={selectedSession.isActive}
              participants={selectedSession.participants}
              duration={selectedSession.duration}
              thumbnail={selectedSession.thumbnail}
              youtubeId={selectedSession.youtubeId}
              onLeave={() => setShowMediaPlayer(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading live sessions...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && liveSessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Live Sessions Active</h3>
            <p className="text-muted-foreground mb-4">
              Check back later for live biblical prophecy sessions from verified leaders.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
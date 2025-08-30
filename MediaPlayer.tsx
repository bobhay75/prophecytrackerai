import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Users, MessageCircle, Heart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface MediaPlayerProps {
  sessionId: number;
  title: string;
  prophetName: string;
  isLive: boolean;
  participants: number;
  duration?: number;
  thumbnail?: string;
  youtubeId?: string;
  onLeave?: () => void;
}

interface ChatMessage {
  id: number;
  author: string;
  message: string;
  timestamp: Date;
  isSuper: boolean;
}

export function MediaPlayer({ 
  sessionId, 
  title, 
  prophetName, 
  isLive, 
  participants, 
  duration = 60,
  thumbnail,
  youtubeId,
  onLeave 
}: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      author: 'Sarah_M',
      message: 'Thank you for this powerful message about end times preparation!',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isSuper: false
    },
    {
      id: 2,
      author: 'ProphecySeeker',
      message: 'Can you explain more about the timeline for these events?',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      isSuper: true
    },
    {
      id: 3,
      author: 'FaithfulWatcher',
      message: 'This aligns with what I\'ve been seeing in current events',
      timestamp: new Date(Date.now() - 30 * 1000),
      isSuper: false
    }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate live streaming progress
    if (isLive && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLive, isPlaying]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Simulate incoming chat messages during live sessions
    if (isLive) {
      const interval = setInterval(() => {
        const randomMessages = [
          'Amen to that!',
          'Praying for wisdom and discernment',
          'This is exactly what we need to hear right now',
          'Can you pray for my family?',
          'Thank you for your faithful teaching',
          'The signs are all around us',
          'God bless this ministry'
        ];
        
        const authors = ['BelieverJohn', 'PrayerWarrior', 'TruthSeeker99', 'FaithfulMom', 'Watchman23'];
        
        if (Math.random() > 0.7) { // 30% chance every 5 seconds
          const newMessage: ChatMessage = {
            id: Date.now(),
            author: authors[Math.floor(Math.random() * authors.length)],
            message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
            timestamp: new Date(),
            isSuper: Math.random() > 0.8
          };
          
          setChatMessages(prev => [...prev.slice(-20), newMessage]); // Keep last 20 messages
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol / 100;
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        author: 'You',
        message: chatMessage,
        timestamp: new Date(),
        isSuper: false
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="relative">
        {/* Video Player */}
        <div className="relative bg-gray-900 aspect-video">
          {youtubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
              title={title}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full bg-black"
              style={{ border: 'none' }}
            />
          ) : isLive ? (
            <div className="w-full h-full bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    {isPlaying ? (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      </div>
                    ) : (
                      <Play className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>
                <div className="text-white">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm opacity-75">with {prophetName}</p>
                  {isLive && (
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-400 text-sm font-medium">LIVE</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={thumbnail}
            />
          )}

          {/* Live Indicators */}
          {isLive && (
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Badge className="bg-red-600 text-white animate-pulse">
                🔴 LIVE
              </Badge>
              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                <Users className="h-3 w-3 mr-1" />
                {participants.toLocaleString()} watching
              </Badge>
            </div>
          )}

          {/* Player Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="space-y-3">
              {/* Progress Bar */}
              {!isLive && (
                <Slider
                  value={[currentTime]}
                  max={duration * 60}
                  step={1}
                  className="w-full"
                  onValueChange={(value) => setCurrentTime(value[0])}
                />
              )}
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="w-20">
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="text-white text-sm">
                    {isLive ? (
                      `Live • ${formatTime(currentTime)}`
                    ) : (
                      `${formatTime(currentTime)} / ${formatTime(duration * 60)}`
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowChat(!showChat)}
                    className="text-white hover:bg-white/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="bg-gray-900 border-t border-gray-700">
            <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Live Chat</h4>
                <Badge variant="outline" className="text-white border-gray-600">
                  {chatMessages.length} messages
                </Badge>
              </div>
              
              {/* Chat Messages */}
              <div className="space-y-2 text-sm">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 ${msg.author === 'You' ? 'justify-end' : ''}`}
                  >
                    <div className={`rounded-lg p-2 max-w-xs ${
                      msg.author === 'You' 
                        ? 'bg-blue-600 text-white ml-auto' 
                        : msg.isSuper
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}>
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="font-medium text-xs">{msg.author}</span>
                        {msg.isSuper && <Crown className="h-3 w-3 text-yellow-300" />}
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              {/* Chat Input */}
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white resize-none"
                  rows={1}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendChatMessage}
                  size="sm"
                  disabled={!chatMessage.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-gray-800 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="outline" className="text-white border-gray-600">
              <Heart className="h-4 w-4 mr-1" />
              Prayer Request
            </Button>
            <Button size="sm" variant="outline" className="text-white border-gray-600">
              <Users className="h-4 w-4 mr-1" />
              Invite Friends
            </Button>
          </div>
          
          {onLeave && (
            <Button
              size="sm"
              variant="destructive"
              onClick={onLeave}
            >
              Leave Session
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Crown icon component for super chat
function Crown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 4a1 1 0 00-.894 1.447L5 7.618V8a1 1 0 001 1h8a1 1 0 001-1v-.382l.894-2.171A1 1 0 0015 4H5z" />
      <path d="M4 10a1 1 0 00-1 1v3a1 1 0 001 1h12a1 1 0 001-1v-3a1 1 0 00-1-1H4z" />
    </svg>
  );
}
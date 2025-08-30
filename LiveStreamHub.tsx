import { useState, useEffect } from 'react';
import { Youtube, Twitch, Users, Calendar, Clock, Eye, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LiveStream {
  id: string;
  title: string;
  host: string;
  platform: 'youtube' | 'twitch';
  url: string;
  thumbnail: string;
  viewers: number;
  isLive: boolean;
  scheduledTime?: Date;
  category: 'prophecy' | 'bible-study' | 'prayer' | 'news-analysis';
  description: string;
}

export default function LiveStreamHub() {
  const [activeStreams, setActiveStreams] = useState<LiveStream[]>([]);
  const [upcomingStreams, setUpcomingStreams] = useState<LiveStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);

  useEffect(() => {
    // Mock data - in production, this would come from API
    setActiveStreams([
      {
        id: '1',
        title: 'LIVE: End Times Prophecy Watch - Breaking Middle East Updates',
        host: 'Prophet Michael',
        platform: 'youtube',
        url: 'https://youtube.com/watch?v=live1',
        thumbnail: '/api/placeholder/400/225',
        viewers: 1847,
        isLive: true,
        category: 'prophecy',
        description: 'Real-time analysis of current events through prophetic scripture'
      },
      {
        id: '2',
        title: 'Revelation Study Group - Chapter 16: The Seven Bowls',
        host: 'Pastor Sarah',
        platform: 'youtube',
        url: 'https://youtube.com/watch?v=live2',
        thumbnail: '/api/placeholder/400/225',
        viewers: 543,
        isLive: true,
        category: 'bible-study',
        description: 'Deep dive into Revelation with community discussion'
      },
      {
        id: '3',
        title: 'Crisis Prayer Chain - Gaza Conflict Coverage',
        host: 'Prayer Warriors Network',
        platform: 'twitch',
        url: 'https://twitch.tv/prayerwarriors',
        thumbnail: '/api/placeholder/400/225',
        viewers: 289,
        isLive: true,
        category: 'prayer',
        description: '24/7 prayer coverage for global crisis events'
      }
    ]);

    setUpcomingStreams([
      {
        id: '4',
        title: 'Blood Moon Prophecy Analysis - December 2024',
        host: 'Dr. Jonathan',
        platform: 'youtube',
        url: 'https://youtube.com/watch?v=upcoming1',
        thumbnail: '/api/placeholder/400/225',
        viewers: 0,
        isLive: false,
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        category: 'prophecy',
        description: 'Scientific and biblical analysis of the upcoming blood moon'
      },
      {
        id: '5',
        title: 'Daniel 9:27 Covenant Study',
        host: 'Bible Prophecy Institute',
        platform: 'youtube',
        url: 'https://youtube.com/watch?v=upcoming2',
        thumbnail: '/api/placeholder/400/225',
        viewers: 0,
        isLive: false,
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        category: 'bible-study',
        description: 'Understanding the final covenant and its prophetic implications'
      }
    ]);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prophecy': return '🔮';
      case 'bible-study': return '📖';
      case 'prayer': return '🙏';
      case 'news-analysis': return '📺';
      default: return '🎥';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prophecy': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'bible-study': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'prayer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'news-analysis': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const openStream = (stream: LiveStream) => {
    window.open(stream.url, '_blank');
  };

  const shareStream = (stream: LiveStream) => {
    if (navigator.share) {
      navigator.share({
        title: stream.title,
        text: `Join me watching: ${stream.title}`,
        url: stream.url
      });
    } else {
      navigator.clipboard.writeText(stream.url);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Prophetic Watch Parties</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join live streams from prophetic voices, Bible study groups, and prayer communities worldwide
        </p>
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Now ({activeStreams.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingStreams.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStreams.map((stream) => (
              <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={stream.thumbnail} 
                    alt={stream.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 text-white">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatViewers(stream.viewers)}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    {stream.platform === 'youtube' ? (
                      <Youtube className="h-5 w-5 text-red-500" />
                    ) : (
                      <Twitch className="h-5 w-5 text-purple-500" />
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Badge className={getCategoryColor(stream.category)}>
                        {getCategoryIcon(stream.category)} {stream.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-sm line-clamp-2">{stream.title}</h3>
                    
                    <p className="text-xs text-muted-foreground">
                      by {stream.host}
                    </p>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {stream.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => openStream(stream)}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Join Watch Party
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareStream(stream)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingStreams.map((stream) => (
              <Card key={stream.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={stream.thumbnail} 
                    alt={stream.title}
                    className="w-full h-48 object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        {stream.scheduledTime?.toLocaleDateString()}
                      </p>
                      <p className="text-xs">
                        {stream.scheduledTime?.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    {stream.platform === 'youtube' ? (
                      <Youtube className="h-5 w-5 text-red-500" />
                    ) : (
                      <Twitch className="h-5 w-5 text-purple-500" />
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Badge className={getCategoryColor(stream.category)}>
                        {getCategoryIcon(stream.category)} {stream.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-sm line-clamp-2">{stream.title}</h3>
                    
                    <p className="text-xs text-muted-foreground">
                      by {stream.host}
                    </p>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {stream.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          // Set reminder functionality
                          alert(`Reminder set for ${stream.title}`);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Set Reminder
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareStream(stream)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Community Features */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Start Your Own Watch Party</h3>
            <p className="text-muted-foreground">
              Share your prophetic insights with the community through live streaming
            </p>
            <div className="flex justify-center gap-4">
              <Button className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                Stream on YouTube
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Twitch className="h-4 w-4" />
                Stream on Twitch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
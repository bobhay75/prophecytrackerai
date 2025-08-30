import { useState, useEffect } from 'react';
import { Play, Eye, Calendar, ExternalLink, Bell, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { youtubeService } from '@/services/youtubeService';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  isLive: boolean;
  channelTitle: string;
}

export function YouTubeIntegration() {
  const [liveStreams, setLiveStreams] = useState<YouTubeVideo[]>([]);
  const [recentVideos, setRecentVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadYouTubeContent();
  }, []);

  const loadYouTubeContent = async () => {
    setLoading(true);
    try {
      const [live, recent] = await Promise.all([
        youtubeService.getLiveStreams(),
        youtubeService.searchEndTimesContent('end times prophecy 2024')
      ]);
      
      setLiveStreams(live);
      setRecentVideos(recent);
    } catch (error) {
      console.error('Error loading YouTube content:', error);
    } finally {
      setLoading(false);
    }
  };

  const playVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setShowPlayer(true);
  };

  const formatDuration = (duration: string) => {
    if (duration === 'LIVE') return 'LIVE';
    return duration;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading EndTimes Productions content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">EndTimes Productions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Authentic biblical prophecy content from trusted YouTube channels. Live streams and latest updates on end times events.
        </p>
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">🔴 Live Streams</TabsTrigger>
          <TabsTrigger value="recent">📺 Recent Videos</TabsTrigger>
          <TabsTrigger value="channels">📺 Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {liveStreams.length > 0 ? (
            <div className="space-y-4">
              {liveStreams.map((video) => (
                <Card key={video.id} className="border-red-200 bg-red-50/30 dark:bg-red-900/10">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-32 h-20 rounded-lg object-cover"
                        />
                        <div className="absolute top-1 left-1">
                          <Badge className="bg-red-600 text-white animate-pulse text-xs">
                            🔴 LIVE
                          </Badge>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            size="sm"
                            className="bg-black/60 hover:bg-black/80"
                            onClick={() => playVideo(video)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{formatViewCount(video.viewCount)} watching</span>
                          </span>
                          <span>{video.channelTitle}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => playVideo(video)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Watch Live
                          </Button>
                          <Button size="sm" variant="outline">
                            <Bell className="h-3 w-3 mr-1" />
                            Notify
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart className="h-3 w-3 mr-1" />
                            Prayer Request
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <div className="space-y-2">
                  <div className="text-muted-foreground">No live streams currently active</div>
                  <Button onClick={loadYouTubeContent} variant="outline">
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentVideos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      {formatDuration(video.duration)}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-t-lg">
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/40"
                      onClick={() => playVideo(video)}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold line-clamp-2 text-sm">{video.title}</h3>
                  <p className="text-xs text-muted-foreground">{video.channelTitle}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatViewCount(video.viewCount)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(video.publishedAt)}</span>
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => playVideo(video)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'EndTimes Productions',
                handle: '@endtimesproductions',
                subscribers: '245K',
                description: 'Biblical prophecy analysis and end times events coverage',
                verified: true
              },
              {
                name: 'Prophecy Update',
                handle: '@prophecyupdate',
                subscribers: '189K',
                description: 'Weekly updates on prophetic significance of current events',
                verified: true
              },
              {
                name: 'Biblical Prophecy Today',
                handle: '@biblicalprophecytoday',
                subscribers: '156K',
                description: 'In-depth biblical prophecy studies and teachings',
                verified: false
              }
            ].map((channel, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {channel.name.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{channel.name}</h3>
                        {channel.verified && (
                          <Badge variant="secondary" className="text-xs">✓ Verified</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{channel.handle}</p>
                      <p className="text-xs text-muted-foreground">{channel.subscribers} subscribers</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{channel.description}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Channel
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bell className="h-3 w-3 mr-1" />
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Player Modal */}
      <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <DialogDescription>{selectedVideo?.channelTitle}</DialogDescription>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="rounded-b-lg"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                onError={(e) => {
                  console.error('YouTube iframe failed to load:', e);
                  // Fallback to direct YouTube link
                  window.open(`https://www.youtube.com/watch?v=${selectedVideo.id}`, '_blank');
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
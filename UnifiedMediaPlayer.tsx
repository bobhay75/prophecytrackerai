import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
}

export function UnifiedMediaPlayer() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [videoQueue, setVideoQueue] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);

  // YouTube search terms for end times content
  const searchTerms = [
    'end times prophecy 2025',
    'biblical prophecy current events',
    'prophetic news today',
    'revelation prophecy happening now',
    'end times signs current events',
    'bible prophecy news update'
  ];

  useEffect(() => {
    loadLatestVideos();
    // Refresh videos every 30 minutes
    const interval = setInterval(loadLatestVideos, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadLatestVideos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Randomly select a search term for variety
      const searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchTerm)}&maxResults=10`);
      
      if (!response.ok) {
        throw new Error('Failed to load videos');
      }
      
      const videos = await response.json();
      
      if (videos.length > 0) {
        setVideoQueue(videos);
        setCurrentVideo(videos[0]);
        setCurrentIndex(0);
      } else {
        setError('No videos found. Please check your YouTube API configuration.');
      }
    } catch (err) {
      console.error('Error loading videos:', err);
      setError('Unable to load videos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const playNext = () => {
    if (currentIndex < videoQueue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentVideo(videoQueue[nextIndex]);
    } else {
      // Loop back to first video
      setCurrentIndex(0);
      setCurrentVideo(videoQueue[0]);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentVideo(videoQueue[prevIndex]);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
            <p className="text-sm text-muted-foreground">Loading latest prophecy updates...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !currentVideo) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
            <p className="text-sm text-muted-foreground">{error || 'No videos available'}</p>
            <Button onClick={loadLatestVideos} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Latest Prophecy & Current Events</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              LIVE UPDATES
            </Badge>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={loadLatestVideos}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video" ref={playerRef}>
          <iframe
            key={currentVideo.id}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`}
            title={currentVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Video Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{currentVideo.title}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{currentVideo.channelTitle}</span>
            <span>{formatViewCount(currentVideo.viewCount)} views</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={playPrevious}
              disabled={currentIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={playNext}
              disabled={videoQueue.length <= 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleMute}
              className="h-8 w-8 p-0"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {videoQueue.length}
            </span>
          </div>
        </div>

        {/* Up Next */}
        {videoQueue.length > 1 && currentIndex < videoQueue.length - 1 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Up Next:</p>
            <div className="text-sm text-muted-foreground">
              {videoQueue[currentIndex + 1].title}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
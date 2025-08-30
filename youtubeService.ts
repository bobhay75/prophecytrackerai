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

interface YouTubeChannel {
  id: string;
  name: string;
  description: string;
  subscriberCount: number;
  videoCount: number;
  thumbnail: string;
}

export class YouTubeService {
  private apiKey: string | null = null;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';
  
  // EndTimes Productions and related channels
  private endTimesChannels = [
    {
      id: 'UCYGRkrVGzJSLNPCJHI_xwdw', // EndTimes Productions (example ID)
      name: 'EndTimes Productions',
      handle: '@endtimesproductions'
    },
    {
      id: 'UCBNhpQnZKetNEbATVgTmtaA', // Prophecy Update (example)
      name: 'Prophecy Update',
      handle: '@prophecyupdate'
    },
    {
      id: 'UCjzCwqG7ZIWbqq7J0Q1nqzw', // Biblical Prophecy Today (example)
      name: 'Biblical Prophecy Today',
      handle: '@biblicalprophecytoday'
    }
  ];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }

  async searchEndTimesContent(query: string = 'end times prophecy'): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      // Return sample data structure for development
      return this.getMockEndTimesVideos();
    }

    try {
      const searchUrl = `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=20&key=${this.apiKey}`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      return data.items?.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        duration: '',
        viewCount: 0,
        isLive: item.snippet.liveBroadcastContent === 'live',
        channelTitle: item.snippet.channelTitle
      })) || [];
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getMockEndTimesVideos();
    }
  }

  async getChannelVideos(channelId: string): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      return this.getMockChannelVideos(channelId);
    }

    try {
      const searchUrl = `${this.baseUrl}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=10&key=${this.apiKey}`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      return data.items?.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        duration: '',
        viewCount: 0,
        isLive: item.snippet.liveBroadcastContent === 'live',
        channelTitle: item.snippet.channelTitle
      })) || [];
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getMockChannelVideos(channelId);
    }
  }

  async getLiveStreams(): Promise<YouTubeVideo[]> {
    const liveVideos: YouTubeVideo[] = [];
    
    for (const channel of this.endTimesChannels) {
      try {
        if (!this.apiKey) {
          // Return mock live streams
          liveVideos.push(...this.getMockLiveStreams());
          break;
        }

        const searchUrl = `${this.baseUrl}/search?part=snippet&channelId=${channel.id}&type=video&eventType=live&key=${this.apiKey}`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        const channelLive = data.items?.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.snippet.publishedAt,
          duration: '',
          viewCount: 0,
          isLive: true,
          channelTitle: channel.name
        })) || [];
        
        liveVideos.push(...channelLive);
      } catch (error) {
        console.error(`Error fetching live streams for ${channel.name}:`, error);
      }
    }
    
    return liveVideos;
  }

  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
  }

  getVideoUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  // Mock data for development/demo
  private getMockEndTimesVideos(): YouTubeVideo[] {
    return [
      {
        id: 'dQw4w9WgXcQ',
        title: 'The Final Warning: Signs of the End Times in 2024',
        description: 'Examining biblical prophecies and current world events that point to the approaching end times.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        publishedAt: '2024-01-15T10:00:00Z',
        duration: '45:32',
        viewCount: 125000,
        isLive: false,
        channelTitle: 'EndTimes Productions'
      },
      {
        id: 'abc123def456',
        title: 'LIVE: Middle East Crisis and Biblical Prophecy Update',
        description: 'Live discussion on current Middle East events and their prophetic significance.',
        thumbnail: 'https://img.youtube.com/vi/abc123def456/mqdefault.jpg',
        publishedAt: '2024-01-20T18:00:00Z',
        duration: 'LIVE',
        viewCount: 8420,
        isLive: true,
        channelTitle: 'EndTimes Productions'
      },
      {
        id: 'xyz789ghi012',
        title: 'The Rapture: Timing and Biblical Evidence',
        description: 'Comprehensive study on the rapture of the church and its timing in end times prophecy.',
        thumbnail: 'https://img.youtube.com/vi/xyz789ghi012/mqdefault.jpg',
        publishedAt: '2024-01-10T14:30:00Z',
        duration: '1:12:45',
        viewCount: 89000,
        isLive: false,
        channelTitle: 'Prophecy Update'
      },
      {
        id: 'def456ghi789',
        title: 'Economic Collapse and the Mark of the Beast',
        description: 'How current economic trends align with biblical prophecies about the end times financial system.',
        thumbnail: 'https://img.youtube.com/vi/def456ghi789/mqdefault.jpg',
        publishedAt: '2024-01-12T16:00:00Z',
        duration: '38:15',
        viewCount: 67000,
        isLive: false,
        channelTitle: 'Biblical Prophecy Today'
      }
    ];
  }

  private getMockChannelVideos(channelId: string): YouTubeVideo[] {
    const channelName = this.endTimesChannels.find(c => c.id === channelId)?.name || 'EndTimes Productions';
    
    return [
      {
        id: 'channel1vid1',
        title: `${channelName}: Weekly Prophecy Update`,
        description: 'This week\'s analysis of prophetic events unfolding globally.',
        thumbnail: 'https://img.youtube.com/vi/channel1vid1/mqdefault.jpg',
        publishedAt: '2024-01-18T12:00:00Z',
        duration: '32:15',
        viewCount: 45000,
        isLive: false,
        channelTitle: channelName
      },
      {
        id: 'channel1vid2',
        title: `${channelName}: Israel and End Times Prophecy`,
        description: 'The role of Israel in biblical end times prophecy and current events.',
        thumbnail: 'https://img.youtube.com/vi/channel1vid2/mqdefault.jpg',
        publishedAt: '2024-01-16T15:30:00Z',
        duration: '48:22',
        viewCount: 78000,
        isLive: false,
        channelTitle: channelName
      }
    ];
  }

  private getMockLiveStreams(): YouTubeVideo[] {
    return [
      {
        id: 'live123stream',
        title: 'LIVE: End Times Emergency Broadcast - Critical Prophetic Alert',
        description: 'Breaking news analysis through the lens of biblical prophecy.',
        thumbnail: 'https://img.youtube.com/vi/live123stream/mqdefault.jpg',
        publishedAt: new Date().toISOString(),
        duration: 'LIVE',
        viewCount: 3240,
        isLive: true,
        channelTitle: 'EndTimes Productions'
      }
    ];
  }
}

export const youtubeService = new YouTubeService();
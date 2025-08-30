import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { NewsItem } from '@/lib/types';
import { 
  ExternalLink, 
  Shield, 
  Eye, 
  AlertTriangle, 
  Clock, 
  Globe,
  Lock,
  Unlock,
  Search
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ViralGraphicsGenerator from './ViralGraphicsGenerator';

export function UndergroundNewsHub() {
  const [activeTab, setActiveTab] = useState('underground');
  
  const { data: allNews, isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
    refetchInterval: 30000,
  });

  const { data: undergroundNews } = useQuery<NewsItem[]>({
    queryKey: ['/api/news', { category: 'underground' }],
    refetchInterval: 30000,
  });

  const { data: mainstreamNews } = useQuery<NewsItem[]>({
    queryKey: ['/api/news', { category: 'world' }],
    refetchInterval: 30000,
  });

  const getSourceBadge = (source: string, category?: string) => {
    if (category === 'underground') {
      return (
        <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          <Unlock className="h-3 w-3 mr-1" />
          Underground Truth
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
        <Lock className="h-3 w-3 mr-1" />
        Mainstream
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
    }
  };

  const openSourceVerification = (title: string, source: string) => {
    const searchQuery = encodeURIComponent(`"${title}" ${source} verification fact check`);
    window.open(`https://duckduckgo.com/?q=${searchQuery}`, '_blank');
  };

  const renderNewsGrid = (newsItems: NewsItem[] | undefined) => {
    if (!newsItems || newsItems.length === 0) {
      return (
        <div className="text-center py-8">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No news items available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                {getSourceBadge(item.source, item.category)}
                <Badge variant="outline" className={getPriorityColor(item.priority)}>
                  {item.priority === 'high' ? '🔥 Breaking' : 
                   item.priority === 'medium' ? '⚠️ Important' : '📰 News'}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                className="h-auto p-0 justify-start text-left w-full hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={() => window.open(item.url || '#', '_blank')}
              >
                <CardTitle className="text-sm font-semibold hover:text-purple-600 dark:hover:text-purple-400 transition-colors leading-tight">
                  {item.title} 🔗
                </CardTitle>
              </Button>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
                </div>
                <span className="font-medium">{item.source}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => openSourceVerification(item.title, item.source)}
                >
                  <Search className="h-3 w-3 mr-1" />
                  Verify Source
                </Button>
                
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                  onClick={() => window.open(item.url || '#', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Read Full Story
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span>Truth Behind the Scenes Hub</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">Loading underground news sources...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Truth Hub Header */}
      <Card className="bg-gradient-to-r from-purple-600/10 to-red-600/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <CardTitle className="text-2xl">Truth Behind the Scenes Hub</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Underground sources revealing what mainstream media won't tell you
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{undergroundNews?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Underground Sources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{mainstreamNews?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Mainstream Sources</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* News Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="underground">🔓 Underground Truth</TabsTrigger>
          <TabsTrigger value="mainstream">🔒 Mainstream Media</TabsTrigger>
          <TabsTrigger value="comparison">⚖️ Side by Side</TabsTrigger>
        </TabsList>

        <TabsContent value="underground" className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-semibold text-red-800 dark:text-red-300">Independent Journalism Alert</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-400">
              These sources operate independently and may present perspectives not covered by mainstream media. 
              Always verify information through multiple sources.
            </p>
          </div>
          {renderNewsGrid(undergroundNews)}
        </TabsContent>

        <TabsContent value="mainstream" className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-800 dark:text-blue-300">Mainstream Coverage</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Traditional news outlets with editorial oversight and corporate backing. 
              Consider what might be missing from these narratives.
            </p>
          </div>
          {renderNewsGrid(mainstreamNews)}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Unlock className="h-5 w-5 mr-2 text-red-600" />
                Underground Perspective
              </h3>
              {renderNewsGrid(undergroundNews?.slice(0, 3))}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-600" />
                Mainstream Narrative
              </h3>
              {renderNewsGrid(mainstreamNews?.slice(0, 3))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
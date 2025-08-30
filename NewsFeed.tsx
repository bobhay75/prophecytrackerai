import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { NewsItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

export function NewsFeed() {
  const [showAll, setShowAll] = useState(false);
  const { data: news, isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
    refetchInterval: 30000,
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conflict':
        return 'border-red-500';
      case 'economic':
        return 'border-amber-500';
      case 'disaster':
        return 'border-orange-500';
      case 'religious':
        return 'border-blue-500';
      default:
        return 'border-slate-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Live News Feed</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">Curated global events</p>
            </div>
            <div className="live-indicator">
              <div className="live-dot" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Live</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-l-4 border-slate-300 pl-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Live News Feed</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Curated global events</p>
          </div>
          <div className="live-indicator">
            <div className="live-dot" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Live</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {news && news.length > 0 ? (
          <>
            {(showAll ? news : news.slice(0, 4)).map((item) => (
              <article
                key={item.id}
                className={`border-l-4 ${getCategoryColor(item.category)} pl-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 justify-start text-left w-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => window.open(item.url || '#', '_blank')}
                    >
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm leading-snug mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item.title} 🔗
                      </h4>
                    </Button>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-3">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority === 'high' ? 'High Priority' : 
                           item.priority === 'medium' ? 'Medium' : 'Low'}
                        </Badge>
                        {item.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(item.url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            
            {news.length > 4 && (
              <Button
                variant="ghost"
                className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium py-2 transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Toggling news view: ${showAll ? 'Show Less' : 'Show All'}`);
                  setShowAll(!showAll);
                }}
              >
                {showAll ? '← Show Less' : `View All ${news.length} News Items →`}
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-slate-600 dark:text-slate-400">No news items available.</div>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              News aggregation is in progress.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

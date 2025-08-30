import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Share2, Bookmark, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { Tradition } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ProphecyTimelineEvent {
  id: number;
  date: Date;
  title: string;
  description: string;
  significance: 'low' | 'medium' | 'high' | 'critical';
  fulfilled: boolean;
  confidence: number;
  tradition: Tradition;
  shareCount: number;
}

interface PersonalProphecyTimelineProps {
  tradition: Tradition;
}

export function PersonalProphecyTimeline({ tradition }: PersonalProphecyTimelineProps) {
  const [timelineEvents] = useState<ProphecyTimelineEvent[]>([
    {
      id: 1,
      date: new Date('2024-12-15'),
      title: 'Middle East Peace Talks Begin',
      description: 'Unprecedented peace negotiations align with Daniel 9:27 prophecy about covenant with many.',
      significance: 'high',
      fulfilled: true,
      confidence: 89,
      tradition: 'christian',
      shareCount: 1247
    },
    {
      id: 2,
      date: new Date('2025-01-03'),
      title: 'Economic Reset Announcement',
      description: 'Global financial restructuring matches Revelation 18 prophecies about Babylon\'s economic system.',
      significance: 'critical',
      fulfilled: false,
      confidence: 76,
      tradition: 'christian',
      shareCount: 892
    },
    {
      id: 3,
      date: new Date('2025-02-14'),
      title: 'Temple Mount Development',
      description: 'New archaeological discoveries pointing toward third temple preparations.',
      significance: 'high',
      fulfilled: false,
      confidence: 82,
      tradition: 'christian',
      shareCount: 634
    }
  ]);

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const shareEvent = (event: ProphecyTimelineEvent) => {
    console.log(`Sharing prophecy event: ${event.title}`);
    // Integration with social media sharing
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Your Prophecy Timeline</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Personalized prophetic insights for {tradition} tradition
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Timeline
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
          
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-4 pb-8">
              {/* Timeline dot */}
              <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${
                event.fulfilled 
                  ? 'bg-green-500' 
                  : event.significance === 'critical' 
                    ? 'bg-red-500' 
                    : 'bg-primary-500'
              }`}>
                {event.fulfilled ? (
                  <TrendingUp className="h-5 w-5 text-white" />
                ) : (
                  <Clock className="h-5 w-5 text-white" />
                )}
              </div>

              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {event.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {event.significance === 'critical' && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <Badge className={getSignificanceColor(event.significance)}>
                        {event.significance}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-slate-500">
                          {formatDistanceToNow(event.date, { addSuffix: true })}
                        </span>
                      </div>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {event.confidence}% confidence
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={() => shareEvent(event)}
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        {event.shareCount}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Bookmark className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Button variant="outline" className="w-full">
            View Complete Timeline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
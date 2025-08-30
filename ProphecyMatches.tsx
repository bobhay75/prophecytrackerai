import { useState } from 'react';
import { ScrollText, Brain, ChevronDown, ChevronUp, Calendar, Globe, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useQuery } from '@tanstack/react-query';
import { ProphecyMatch, Tradition } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ProphecyMatchesProps {
  tradition: Tradition;
}

export function ProphecyMatches({ tradition }: ProphecyMatchesProps) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  
  const { data: matches, isLoading } = useQuery<ProphecyMatch[]>({
    queryKey: ['/api/prophecy-matches', tradition],
    refetchInterval: 60000,
  });

  const toggleCard = (id: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getIconColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
    return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">AI Prophecy Analysis</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">Recent event correlations</p>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-700 dark:text-purple-300">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
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
            <CardTitle className="text-lg font-semibold">AI Prophecy Analysis</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Recent event correlations</p>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-700 dark:text-purple-300">
            <Brain className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {matches && matches.length > 0 ? (
          <>
            {matches.slice(0, 3).map((match) => (
              <Collapsible key={match.id} open={expandedCards.has(match.id)}>
                <div className="prophecy-match border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <CollapsibleTrigger asChild>
                    <div 
                      className="flex items-start space-x-3 cursor-pointer w-full transition-all duration-200 hover:scale-[0.99] active:scale-[0.98]"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(`Toggling prophecy card: ${match.id}`);
                        toggleCard(match.id);
                      }}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${getIconColor(match.confidence)}`}>
                        <ScrollText className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                            Current Events → {match.scripture}
                          </h4>
                          {expandedCards.has(match.id) ? (
                            <ChevronUp className="h-4 w-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 prophecy-text">
                          {match.analysis}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs font-medium ${getConfidenceColor(match.confidence)}`}>
                            {match.confidence}% Match
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="pt-4">
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <div className="grid gap-4">
                        {/* Scripture Text */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <ScrollText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <h5 className="font-semibold text-blue-900 dark:text-blue-100">Scripture Reference</h5>
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-200 italic prophecy-text">
                            "{match.prophecyText}"
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                            — {match.scripture}
                          </p>
                        </div>

                        {/* Current Events Connection */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <h5 className="font-semibold text-amber-900 dark:text-amber-100">Current Events Analysis</h5>
                          </div>
                          <p className="text-sm text-amber-800 dark:text-amber-200 prophecy-text">
                            {match.analysis}
                          </p>
                        </div>

                        {/* Prophetic Significance */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <h5 className="font-semibold text-purple-900 dark:text-purple-100">Prophetic Significance</h5>
                          </div>
                          <div className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                            <p>• This correlation suggests alignment with biblical end-times prophecy</p>
                            <p>• Confidence level: {match.confidence}% based on AI analysis of current events</p>
                            <p>• Watch for escalating patterns that further fulfill this prophecy</p>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            <h5 className="font-semibold text-slate-900 dark:text-slate-100">Timeline</h5>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 prophecy-text">
                            Analysis generated {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })} 
                            from recent global events matching prophetic patterns.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
            
            <Button
              variant="ghost"
              className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium py-2"
            >
              View All Prophecy Matches →
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <ScrollText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No prophecy matches found yet.</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              AI analysis is processing recent events.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

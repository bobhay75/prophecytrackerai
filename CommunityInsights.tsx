import { useState } from 'react';
import { Users, MessageCircle, Heart, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Discussion, PrayerRequest } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function CommunityInsights() {
  const [newPrayerRequest, setNewPrayerRequest] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: discussions, isLoading: discussionsLoading } = useQuery<Discussion[]>({
    queryKey: ['/api/discussions'],
    refetchInterval: 60000,
  });

  const { data: prayerRequests, isLoading: prayersLoading } = useQuery<PrayerRequest[]>({
    queryKey: ['/api/prayer-requests'],
    refetchInterval: 60000,
  });

  const prayMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiRequest('POST', `/api/prayer-requests/${requestId}/pray`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-requests'] });
      toast({ title: 'Prayer added', description: 'Thank you for your prayer.' });
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to add prayer. Please try again.',
        variant: 'destructive'
      });
    },
  });

  const createPrayerMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest('POST', '/api/prayer-requests', { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-requests'] });
      setNewPrayerRequest('');
      toast({ title: 'Prayer request submitted', description: 'Your request has been added to the community.' });
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to submit prayer request. Please try again.',
        variant: 'destructive'
      });
    },
  });

  const handlePray = (requestId: number) => {
    prayMutation.mutate(requestId);
  };

  const handleSubmitPrayer = () => {
    if (newPrayerRequest.trim()) {
      createPrayerMutation.mutate(newPrayerRequest.trim());
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Community Insights</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Discussion highlights and prayer requests
            </p>
          </div>
          <Button variant="ghost" className="text-sm text-primary-600 dark:text-primary-400">
            Join Discussion →
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Discussions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Recent Discussions</h4>
            
            {discussionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {discussions && discussions.length > 0 ? (
                  discussions.slice(0, 2).map((discussion) => (
                    <div
                      key={discussion.id}
                      className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm">
                          <Users className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {discussion.author}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {discussion.content}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                          <MessageCircle className="h-3 w-3" />
                          <span>{discussion.replies} replies</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                    No discussions yet. Be the first to start a conversation!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Prayer Requests */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Prayer Requests</h4>
            
            {prayersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-6 w-16 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {prayerRequests && prayerRequests.length > 0 ? (
                  prayerRequests.slice(0, 2).map((request) => (
                    <div
                      key={request.id}
                      className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                          <Heart className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 dark:text-white prayer-text">
                            {request.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">- {request.author}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium h-6 px-2 transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log(`Praying for request: ${request.id}`);
                                handlePray(request.id);
                              }}
                              disabled={prayMutation.isPending}
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              {prayMutation.isPending ? 'Praying...' : `Pray (${request.prayerCount})`}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                    No prayer requests yet.
                  </p>
                )}

                {/* Submit Prayer Request */}
                <div className="space-y-2">
                  <textarea
                    value={newPrayerRequest}
                    onChange={(e) => setNewPrayerRequest(e.target.value)}
                    placeholder="Share a prayer request with the community..."
                    className="w-full text-sm p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={2}
                    maxLength={500}
                  />
                  <Button
                    onClick={handleSubmitPrayer}
                    disabled={!newPrayerRequest.trim() || createPrayerMutation.isPending}
                    className="w-full text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/30 font-medium"
                    variant="ghost"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Prayer Request
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

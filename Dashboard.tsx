import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { StatsCards } from '@/components/StatsCards';
import { WorldMap } from '@/components/WorldMap';
import { ProphecyMatches } from '@/components/ProphecyMatches';
import { NewsFeed } from '@/components/NewsFeed';
import { CommunityInsights } from '@/components/CommunityInsights';
import { PremiumModal } from '@/components/PremiumModal';
import { PersonalProphecyTimeline } from '@/components/PersonalProphecyTimeline';
import { CrisisResponseCenter } from '@/components/CrisisResponseCenter';
import { LiveProphetNetwork } from '@/components/LiveProphetNetwork';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Tradition } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Dashboard() {
  const [selectedTradition, setSelectedTradition] = useState<Tradition>('christian');
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [briefingModalOpen, setBriefingModalOpen] = useState(false);
  const [dailyBriefing, setDailyBriefing] = useState('');
  const { toast } = useToast();

  const briefingMutation = useMutation({
    mutationFn: async (tradition: Tradition) => {
      const response = await apiRequest('POST', '/api/daily-briefing', { tradition });
      return response.json();
    },
    onSuccess: (data) => {
      setDailyBriefing(data.briefing);
      setBriefingModalOpen(true);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to generate daily briefing. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleGenerateBriefing = () => {
    briefingMutation.mutate(selectedTradition);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header onPremiumClick={() => setPremiumModalOpen(true)} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Sidebar
              selectedTradition={selectedTradition}
              onTraditionChange={setSelectedTradition}
              onGenerateBriefing={handleGenerateBriefing}
            />
            
            <div className="lg:col-span-9 space-y-6">
              {/* Dashboard Stats */}
              <StatsCards />

              {/* Interactive World Map */}
              <WorldMap />

              {/* Crisis Response Center - High Priority */}
              <CrisisResponseCenter />

              {/* Live Prophet Network */}
              <LiveProphetNetwork />

              {/* Prophecy Correlations & Personal Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProphecyMatches tradition={selectedTradition} />
                <PersonalProphecyTimeline tradition={selectedTradition} />
              </div>

              {/* News Feed & Community Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NewsFeed />
                <CommunityInsights />
              </div>
            </div>
          </div>
        </div>

        {/* Premium Modal */}
        <PremiumModal
          open={premiumModalOpen}
          onClose={() => setPremiumModalOpen(false)}
        />

        {/* Daily Briefing Modal */}
        <Dialog open={briefingModalOpen} onOpenChange={setBriefingModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Daily End Times Briefing
              </DialogTitle>
            </DialogHeader>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {briefingMutation.isPending ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Generating your personalized briefing...
                  </p>
                </div>
              ) : briefingMutation.isError ? (
                <div className="text-center py-8">
                  <p className="text-red-600 dark:text-red-400 mb-4">
                    Failed to generate briefing
                  </p>
                  <button 
                    onClick={() => briefingMutation.mutate(selectedTradition)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : dailyBriefing ? (
                <div 
                  className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: dailyBriefing.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400">
                    No briefing content available
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

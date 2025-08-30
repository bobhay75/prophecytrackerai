import { ProphecyMatches } from '@/components/ProphecyMatches';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useState } from 'react';
import { PremiumModal } from '@/components/PremiumModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';

export default function AIInsights() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [, setLocation] = useLocation();

  const generateBriefingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/daily-briefing', { tradition: 'christian' });
      return response.json();
    },
    onError: (error) => {
      console.error('Failed to generate briefing:', error);
    }
  });

  // Remove unused query that causes errors
  const briefing = generateBriefingMutation.data;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header onPremiumClick={() => setShowPremiumModal(true)} />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              AI Insights
              <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                Pro
              </Badge>
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Advanced AI analysis of prophetic correlations and daily spiritual insights
            </p>
          </div>
          
          <Button 
            onClick={() => generateBriefingMutation.mutate()}
            disabled={generateBriefingMutation.isPending}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {generateBriefingMutation.isPending ? 'Generating...' : 'Generate Daily Briefing'}
          </Button>
        </div>

        {briefing && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Today's Spiritual Briefing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                  {briefing?.briefing || briefing || ''}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Prophecy Correlations</CardTitle>
            </CardHeader>
            <CardContent>
              <ProphecyMatches tradition="christian" />
            </CardContent>
          </Card>
        </div>
      </main>

      <PremiumModal 
        open={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
      />
      </div>
    </ThemeProvider>
  );
}
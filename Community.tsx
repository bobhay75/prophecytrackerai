import { CommunityInsights } from '@/components/CommunityInsights';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useState } from 'react';
import { PremiumModal } from '@/components/PremiumModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Community() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [, setLocation] = useLocation();

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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Community
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Connect with others, share discussions, and submit prayer requests
            </p>
          </div>

          <CommunityInsights />
        </main>

        <PremiumModal 
          open={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)} 
        />
      </div>
    </ThemeProvider>
  );
}
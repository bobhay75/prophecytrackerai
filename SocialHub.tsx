import { SocialShareHub } from '@/components/SocialShareHub';
import { Header } from '@/components/Header';
import { useState } from 'react';
import { PremiumModal } from '@/components/PremiumModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function SocialHub() {
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
          <SocialShareHub />
        </main>
        <PremiumModal 
          open={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)} 
        />
      </div>
    </ThemeProvider>
  );
}
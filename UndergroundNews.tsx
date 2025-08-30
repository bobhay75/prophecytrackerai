import { Header } from '@/components/Header';
import { UndergroundNewsHub } from '@/components/UndergroundNewsHub';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { PremiumModal } from '@/components/PremiumModal';

export default function UndergroundNewsPage() {
  const [, setLocation] = useLocation();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header onPremiumClick={() => setShowPremiumModal(true)} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Underground Truth Hub
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Revealing what mainstream media won't tell you - Behind the scenes truth
              </p>
            </div>
          </div>

          <UndergroundNewsHub />
        </div>

        <PremiumModal 
          open={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)} 
        />
      </div>
    </ThemeProvider>
  );
}
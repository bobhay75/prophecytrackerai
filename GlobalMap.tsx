import { RealTimeGlobalMap } from '@/components/RealTimeGlobalMap';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useState } from 'react';
import { PremiumModal } from '@/components/PremiumModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function GlobalMap() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header onPremiumClick={() => setShowPremiumModal(true)} />
        
        <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Real-Time Global Conflict Monitor
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Live tracking of global conflicts with hourly updates from Middle East, Ukraine, North Korea, China, US, Canada, and Mexico
            </p>
          </div>

          <RealTimeGlobalMap />
        </main>

        <PremiumModal 
          open={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)} 
        />
      </div>
    </ThemeProvider>
  );
}
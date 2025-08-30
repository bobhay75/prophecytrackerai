import { Header } from '@/components/Header';
import { EarthquakeMonitor } from '@/components/EarthquakeMonitor';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { PremiumModal } from '@/components/PremiumModal';

export default function EarthquakeWatchPage() {
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
                🌍 Earthquake Watch - USGS Real-Time Data
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                Monitoring seismic activity as prophesied in Revelation
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-blue-700 dark:text-blue-400 italic">
                  "Creation groans for the Sons of God to return" - Romans 8:22
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                  Tracking unprecedented earthquake activity as described in Revelation 16:18
                </p>
              </div>
            </div>
          </div>

          <EarthquakeMonitor />
        </div>

        <PremiumModal 
          open={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)} 
        />
      </div>
    </ThemeProvider>
  );
}
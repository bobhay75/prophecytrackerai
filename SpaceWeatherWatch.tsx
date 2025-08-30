import { Header } from '@/components/Header';
import { SpaceWeatherMonitor } from '@/components/SpaceWeatherMonitor';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { PremiumModal } from '@/components/PremiumModal';

export default function SpaceWeatherWatchPage() {
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
              {/* Cool Space Graphics Background */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8 mb-6">
                {/* Animated Stars */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                  <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <div className="absolute top-3/4 left-1/2 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
                </div>
                
                {/* Central Wormwood Comet Animation */}
                <div className="absolute top-4 right-8">
                  <div className="relative">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full animate-bounce"></div>
                    <div className="absolute -top-1 -left-2 w-8 h-2 bg-gradient-to-r from-orange-500/60 to-transparent rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Central Content */}
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                    🌟 Space Weather Watch
                  </h1>
                  <p className="text-xl text-blue-200 mb-4 drop-shadow">
                    NASA Real-Time Data - Monitoring for Wormwood
                  </p>
                  <div className="bg-black/30 backdrop-blur border border-purple-500/30 rounded-lg p-4 max-w-2xl mx-auto">
                    <p className="text-purple-200 italic mb-2">
                      "And the name of the star is called Wormwood" - Revelation 8:11
                    </p>
                    <p className="text-sm text-blue-300">
                      Tracking near-Earth objects and solar activity for prophetic significance
                    </p>
                  </div>
                </div>
                
                {/* Orbital Rings Animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border border-blue-500/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
                  <div className="absolute w-48 h-48 border border-purple-500/20 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
                  <div className="absolute w-32 h-32 border border-yellow-500/20 rounded-full animate-spin" style={{animationDuration: '10s'}}></div>
                </div>
                
                {/* Solar Flare Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent animate-pulse" style={{animationDuration: '3s'}}></div>
                
                {/* Nebula Effect */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
                
                {/* Space Dust Animation */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/3 left-1/5 w-px h-px bg-white animate-ping" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute top-2/3 right-1/3 w-px h-px bg-blue-200 animate-ping" style={{animationDelay: '0.8s'}}></div>
                  <div className="absolute bottom-1/4 left-2/3 w-px h-px bg-yellow-200 animate-ping" style={{animationDelay: '1.4s'}}></div>
                </div>
              </div>
              
              {/* Space Graphics Upload Section */}
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  🎬 Custom Space Graphics
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                  To add your custom space weather visualizations:
                </p>
                <ol className="text-xs text-slate-500 dark:text-slate-500 space-y-1 list-decimal list-inside">
                  <li>Save your Runway-generated space video/image in the attached_assets folder</li>
                  <li>The video will automatically appear as a background on this page</li>
                  <li>Supported formats: MP4, WebM, GIF, PNG, JPG</li>
                </ol>
              </div>
            </div>
          </div>

          <SpaceWeatherMonitor />
        </div>

        <PremiumModal 
          open={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)} 
        />
      </div>
    </ThemeProvider>
  );
}
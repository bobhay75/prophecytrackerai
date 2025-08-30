import { Header } from '@/components/Header';
import { CrisisResponseCenter } from '@/components/CrisisResponseCenter';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function CrisisResponse() {
  const [, setLocation] = useLocation();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header onPremiumClick={() => {}} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                Crisis Response Center
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Immediate spiritual guidance and community support during global crises
              </p>
            </div>
          </div>

          <CrisisResponseCenter />
        </div>
      </div>
    </ThemeProvider>
  );
}
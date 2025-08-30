import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ProphecyWidget } from '@/components/ProphecyWidget';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function WidgetBuilder() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Sidebar
              selectedTradition="christian"
              onTraditionChange={() => {}}
              onGenerateBriefing={() => {}}
            />
            
            <div className="lg:col-span-9">
              <ProphecyWidget />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
import { Globe, Moon, Sun, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useThemeContext } from './ThemeProvider';
import { useQuery } from '@tanstack/react-query';
import { AppStats } from '@/lib/types';

interface HeaderProps {
  onPremiumClick: () => void;
}

export function Header({ onPremiumClick }: HeaderProps) {
  const { theme, toggleTheme } = useThemeContext();

  const { data: stats } = useQuery<AppStats>({
    queryKey: ['/api/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary-600 dark:text-primary-500" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Prophecy Tracker
              </h1>
            </div>
            <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              Live Monitoring
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="live-dot" />
                <span className="text-slate-600 dark:text-slate-400">Live</span>
              </div>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600 dark:text-slate-400">
                {stats?.activeConflicts || 0} Active Events
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                console.log(`Theme toggle clicked: ${theme} -> ${theme === 'dark' ? 'light' : 'dark'}`);
                toggleTheme();
              }}
              className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              onClick={(e) => {
                e.preventDefault();
                console.log('Premium button clicked');
                onPremiumClick();
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
            >
              <Crown className="h-4 w-4 mr-2" />
              Premium
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

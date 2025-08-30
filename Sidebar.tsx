import { useState } from 'react';
import { BarChart3, Map, ScrollText, Newspaper, Users, Brain, Layers, AlertTriangle, Video, TrendingUp, Shield, Share, Activity, Telescope, BookOpen, Rocket, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tradition } from '@/lib/types';
import { useLocation } from 'wouter';

interface SidebarProps {
  selectedTradition: Tradition;
  onTraditionChange: (tradition: Tradition) => void;
  onGenerateBriefing: () => void;
}

export function Sidebar({ selectedTradition, onTraditionChange, onGenerateBriefing }: SidebarProps) {
  const [location, setLocation] = useLocation();
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/' },
    { id: 'crisis', label: 'Crisis Response', icon: AlertTriangle, href: '/crisis-response', priority: true },
    { id: 'prophets', label: 'Live Prophets', icon: Video, href: '/live-prophets', live: true },
    { id: 'predictions', label: 'Prediction Markets', icon: TrendingUp, href: '/prediction-markets', viral: true },
    { id: 'verification', label: 'Prophet Verification', icon: Shield, href: '/prophet-verification' },
    { id: 'social', label: 'Viral Social Hub', icon: Share, href: '/social-hub' },
    { id: 'map', label: 'Global Map', icon: Map, href: '/global-map' },
    { id: 'prophecies', label: 'Prophecy Matches', icon: ScrollText, href: '/prophecy-matches' },
    { id: 'news', label: 'News Feed', icon: Newspaper, href: '/news-feed' },
    { id: 'earthquake', label: '🌍 Earthquake Watch', icon: Activity, href: '/earthquake-watch', prophetic: true },
    { id: 'space', label: '🌟 Space Weather', icon: Telescope, href: '/space-weather', prophetic: true },
    { id: 'underground', label: '🔓 Underground News', icon: Shield, href: '/underground-news', truth: true },
    { id: 'library', label: '📖 Prophetic Library', icon: BookOpen, href: '/prophetic-library', educational: true },
    { id: 'widget', label: '🔧 Widget Builder', icon: Layers, href: '/widget-builder', viral: true },
    { id: 'community', label: 'Community', icon: Users, href: '/community' },
    { id: 'insights', label: 'AI Insights', icon: Brain, href: '/ai-insights', premium: true },
  ];

  return (
    <div className="lg:col-span-3">
      <Card className="sticky top-24">
        <CardContent className="p-6">
          <nav className="space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Navigating to: ${item.href}`);
                    setLocation(item.href);
                  }}
                  disabled={false}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-[0.98] active:scale-95 ${
                    location === item.href
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.premium && (
                    <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs">
                      Pro
                    </Badge>
                  )}
                  {item.prophetic && (
                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs">
                      Biblical
                    </Badge>
                  )}
                  {item.truth && (
                    <Badge variant="secondary" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs">
                      Truth
                    </Badge>
                  )}
                  {item.educational && (
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
                      Study
                    </Badge>
                  )}

                  {item.viral && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                      HOT
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Tradition Focus
            </h3>
            <Select value={selectedTradition} onValueChange={onTraditionChange}>
              <SelectTrigger className="tradition-selector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="christian">Christian</SelectItem>
                <SelectItem value="jewish">Jewish</SelectItem>
                <SelectItem value="islamic">Islamic</SelectItem>
                <SelectItem value="buddhist">Buddhist</SelectItem>
                <SelectItem value="all">All Traditions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6">
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Daily Briefing
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Get your personalized end-times update
              </p>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Generate Daily Briefing clicked');
                  onGenerateBriefing();
                }}
                className="w-full bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-600 font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                variant="ghost"
              >
                <Layers className="h-4 w-4 mr-2" />
                Generate Today's Brief
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

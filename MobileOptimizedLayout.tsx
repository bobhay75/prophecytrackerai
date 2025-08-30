import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Home, 
  Globe, 
  Brain, 
  MessageSquare, 
  Settings,
  TrendingUp,
  AlertTriangle,
  Zap,
  Calendar,
  Share2
} from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  activeAlerts?: number;
  prophecyMatches?: number;
  userName?: string;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
  { id: 'global-map', label: 'Global Map', icon: Globe, path: '/global-map' },
  { id: 'prophecy', label: 'Prophecy', icon: Brain, path: '/prophecy-matches' },
  { id: 'community', label: 'Community', icon: MessageSquare, path: '/community' },
  { id: 'alerts', label: 'Alerts', icon: Bell, path: '/alerts' }
];

export function MobileOptimizedLayout({ 
  children, 
  activeAlerts = 0, 
  prophecyMatches = 0,
  userName = 'Prophet Seeker'
}: MobileLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // In a real app, this would trigger navigation
    console.log(`Navigate to: ${value}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    End Times Tracker
                  </SheetTitle>
                  <SheetDescription>
                    AI-powered prophetic insights
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* User Profile */}
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{userName}</div>
                      <div className="text-sm text-muted-foreground">Premium Member</div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-orange-600">{activeAlerts}</div>
                        <div className="text-xs text-muted-foreground">Active Alerts</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">{prophecyMatches}</div>
                        <div className="text-xs text-muted-foreground">Prophecy Matches</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Navigation */}
                  <div className="space-y-2">
                    {navigationItems.map(item => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant={activeTab === item.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => {
                            handleTabChange(item.id);
                            setIsMenuOpen(false);
                          }}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          {item.label}
                          {item.id === 'alerts' && activeAlerts > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {activeAlerts}
                            </Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">Quick Actions</h3>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      Search Events
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Insight
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div>
              <h1 className="font-bold text-lg">End Times Tracker</h1>
              <p className="text-xs text-muted-foreground">Prophecy Monitor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {activeAlerts > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                  {activeAlerts}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-card border-r">
          <div className="flex items-center gap-3 p-6 border-b">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">End Times Tracker</h1>
              <p className="text-sm text-muted-foreground">AI Prophecy Monitor</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col p-4 space-y-4">
            {/* User Profile */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{userName}</div>
                    <div className="text-sm text-muted-foreground">Premium Member</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-orange-600">{activeAlerts}</div>
                  <div className="text-xs text-muted-foreground">Active Alerts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">{prophecyMatches}</div>
                  <div className="text-xs text-muted-foreground">Prophecy Matches</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Navigation */}
            <div className="space-y-1">
              {navigationItems.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange(item.id)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                    {item.id === 'alerts' && activeAlerts > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {activeAlerts}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="flex-1">
          {/* Mobile Stats Bar */}
          <div className="lg:hidden bg-muted/50 border-b">
            <div className="flex items-center justify-around p-2 text-center">
              <div className="flex-1">
                <div className="text-lg font-bold text-orange-600">{activeAlerts}</div>
                <div className="text-xs text-muted-foreground">Alerts</div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-purple-600">{prophecyMatches}</div>
                <div className="text-xs text-muted-foreground">Matches</div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-green-600">87%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-blue-600">24/7</div>
                <div className="text-xs text-muted-foreground">Monitor</div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-16 bg-transparent">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex-col gap-1 data-[state=active]:bg-primary/10"
                >
                  <div className="relative">
                    <Icon className="h-4 w-4" />
                    {item.id === 'alerts' && activeAlerts > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 text-xs p-0 flex items-center justify-center">
                        {activeAlerts > 9 ? '9+' : activeAlerts}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Add padding to prevent content from being hidden behind bottom nav on mobile */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}

export default MobileOptimizedLayout;
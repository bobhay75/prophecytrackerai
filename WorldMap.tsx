import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { GlobalEvent } from '@/lib/types';
import { Globe, TrendingUp, AlertTriangle, MapPin, Calendar, Heart, BookOpen, X, Flame, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function WorldMap() {
  const [filter, setFilter] = useState<string>('all');
  const [heatmapIntensity, setHeatmapIntensity] = useState<{ [key: string]: number }>({});
  const [selectedEvent, setSelectedEvent] = useState<GlobalEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  const { data: events } = useQuery<GlobalEvent[]>({
    queryKey: ['/api/global-events'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Calculate heatmap intensity based on event data
  useEffect(() => {
    if (events) {
      const intensity: { [key: string]: number } = {};
      events.forEach(event => {
        const region = event.location || 'global';
        const severityWeight = event.severity === 'high' ? 3 : event.severity === 'medium' ? 2 : 1;
        intensity[region] = (intensity[region] || 0) + severityWeight;
      });
      setHeatmapIntensity(intensity);
    }
  }, [events]);

  const filterOptions = [
    { id: 'all', label: 'All Events' },
    { id: 'conflict', label: 'Conflicts' },
    { id: 'disaster', label: 'Disasters' },
    { id: 'economic', label: 'Economic' },
  ];

  const filteredEvents = events?.filter(event => 
    filter === 'all' || event.eventType === filter
  ) || [];

  const handleEventClick = (event: GlobalEvent) => {
    console.log('Event clicked:', event.title);
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'conflict': return AlertTriangle;
      case 'disaster': return Flame;
      case 'economic': return TrendingDown;
      default: return Globe;
    }
  };

  const getEventAnalysis = (event: GlobalEvent) => {
    const analyses = {
      conflict: {
        context: "Global conflicts and wars have been prophesied throughout scripture as signs of the end times.",
        significance: "Jesus spoke of 'wars and rumors of wars' as indicators of His return (Matthew 24:6).",
        prayer: "Pray for peace, protection of civilians, and that leaders would seek peaceful resolution.",
        response: "Stay informed, support humanitarian efforts, and trust in God's sovereignty over nations."
      },
      disaster: {
        context: "Natural disasters are increasing in frequency and intensity worldwide.",
        significance: "Scripture speaks of earthquakes, famines, and natural calamities in the last days (Luke 21:11).",
        prayer: "Pray for those affected, relief efforts, and for God's mercy during these challenging times.",
        response: "Support disaster relief organizations, prepare your own household, and help your community."
      },
      economic: {
        context: "Economic instability and global financial systems are key end-times indicators.",
        significance: "The Bible warns of economic upheaval and the eventual global economic system (Revelation 13:16-17).",
        prayer: "Pray for wisdom for leaders, provision for those in need, and trust in God's sovereignty.",
        response: "Practice wise stewardship, avoid debt, and build community relationships for mutual support."
      }
    };
    
    return analyses[event.eventType.toLowerCase() as keyof typeof analyses] || analyses.conflict;
  };

  const getMarkerStyle = (event: GlobalEvent) => {
    const baseSize = event.severity === 'high' ? 16 : event.severity === 'medium' ? 12 : 8;
    const opacity = event.isActive ? 1 : 0.6;
    
    let color = '#ef4444'; // red for conflicts
    if (event.eventType === 'economic') color = '#f59e0b'; // amber
    if (event.eventType === 'disaster') color = '#ea580c'; // orange
    
    return {
      width: `${baseSize}px`,
      height: `${baseSize}px`,
      backgroundColor: color,
      opacity,
      boxShadow: event.isActive ? `0 0 ${baseSize}px ${color}` : 'none',
    };
  };

  const getHeatmapRegions = () => {
    return Object.entries(heatmapIntensity).map(([region, intensity]) => ({
      region,
      intensity,
      opacity: Math.min(intensity * 0.2, 0.8)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Global Conflict Heatmap</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Real-time monitoring of global events and conflicts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {filterOptions.map((option) => {
              const count = option.id === 'all' 
                ? events?.length || 0 
                : events?.filter(e => e.eventType === option.id).length || 0;
              
              return (
                <Button
                  key={option.id}
                  variant={filter === option.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    console.log(`Filter changed to: ${option.id}`);
                    setFilter(option.id);
                  }}
                  className={`text-xs flex items-center gap-1 hover:scale-105 transition-all duration-200 ${
                    filter === option.id 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {option.label}
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 text-xs ${
                      filter === option.id 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative h-96 bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 overflow-hidden cursor-pointer">
          {/* Heat map regions */}
          {getHeatmapRegions().map((region, index) => (
            <div
              key={region.region}
              className="absolute rounded-lg pointer-events-none"
              style={{
                top: `${20 + (index * 15)}%`,
                left: `${30 + (index * 20)}%`,
                width: '80px',
                height: '60px',
                backgroundColor: '#ef4444',
                opacity: region.opacity,
                filter: 'blur(8px)',
              }}
            />
          ))}

          {/* Event markers based on filtered data */}
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="absolute rounded-full cursor-pointer animate-pulse hover:scale-125 hover:shadow-lg transition-all duration-200 border-2 border-white dark:border-slate-800 shadow-md"
              style={{
                ...getMarkerStyle(event),
                top: `${25 + (index * 12)}%`,
                left: `${20 + (index * 15)}%`,
                zIndex: 10,
                minWidth: '16px',
                minHeight: '16px',
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`WorldMap event clicked: ${event.title} (${event.eventType})`);
                handleEventClick(event);
              }}
              title={`Click for details: ${event.title} - ${event.eventType} (${event.severity})`}
            />
          ))}

          {/* Center map icon and info */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <Globe className="h-16 w-16 text-slate-600 dark:text-slate-400 mb-4 mx-auto opacity-50" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">Global Heat Map</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                {filteredEvents.length} {filter === 'all' ? 'events' : filter} tracked
              </p>
            </div>
          </div>

          {/* Map Legend with live data */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-900 dark:text-white mb-2">
                Active Filter: {filter === 'all' ? 'All Events' : filterOptions.find(f => f.id === filter)?.label}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                  <span className="text-slate-700 dark:text-slate-300">Conflicts</span>
                </div>
                <span className="text-slate-500">
                  {events?.filter(e => e.eventType === 'conflict').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-slate-700 dark:text-slate-300">Economic</span>
                </div>
                <span className="text-slate-500">
                  {events?.filter(e => e.eventType === 'economic').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-slate-700 dark:text-slate-300">Disasters</span>
                </div>
                <span className="text-slate-500">
                  {events?.filter(e => e.eventType === 'disaster').length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Live indicator */}
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
              <div className="live-dot mr-1" />
              Live Data
            </Badge>
          </div>
        </div>
      </CardContent>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent && (() => {
                const Icon = getEventIcon(selectedEvent.eventType);
                return <Icon className="h-5 w-5" />;
              })()}
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              {/* Event Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedEvent.location}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium">Timeline</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {formatDistanceToNow(new Date(selectedEvent.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Event Severity */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="font-medium">Severity Level</span>
                <Badge variant={selectedEvent.severity === 'high' ? 'destructive' : 'secondary'}>
                  {selectedEvent.severity.toUpperCase()}
                </Badge>
              </div>

              {/* Event Description */}
              <div className="space-y-2">
                <h4 className="font-semibold">What's Happening</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Biblical Context */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Biblical Context</h4>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {getEventAnalysis(selectedEvent).context}
                </p>
                <div className="border-l-2 border-blue-300 dark:border-blue-600 pl-3">
                  <p className="text-sm italic text-blue-700 dark:text-blue-300">
                    {getEventAnalysis(selectedEvent).significance}
                  </p>
                </div>
              </div>

              {/* Prayer Guide */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">How to Pray</h4>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  {getEventAnalysis(selectedEvent).prayer}
                </p>
              </div>

              {/* Response Guide */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">How to Respond</h4>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {getEventAnalysis(selectedEvent).response}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowEventDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    // Could add share functionality here
                    navigator.clipboard.writeText(`Praying for ${selectedEvent.title} in ${selectedEvent.location}`);
                  }}
                >
                  Share Prayer Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

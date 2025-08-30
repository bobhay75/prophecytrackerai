import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Globe, 
  ExternalLink,
  BookOpen,
  TrendingUp,
  Zap,
  Heart
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
    depth: number;
  };
  timestamp: Date;
  url: string;
  significance: number;
  alert: string;
  tsunami: boolean;
  felt: number;
  isSignificant: boolean;
  isUnprecedented: boolean;
  biblicalSignificance: {
    level: 'low' | 'medium' | 'high' | 'prophetic';
    description: string;
    scripture?: string;
  };
  source: string;
  lastUpdated: Date;
}

export function EarthquakeMonitor() {
  const [activeTab, setActiveTab] = useState('recent');
  
  const { data: earthquakes, isLoading } = useQuery<Earthquake[]>({
    queryKey: ['/api/earthquakes'],
    refetchInterval: 60000, // Update every minute
  });

  const { data: earthquakeStats } = useQuery<{
    total: number;
    significant: number;
    unprecedented: number;
    holyLandQuakes: number;
    largestMagnitude: number;
    lastUpdate: Date;
  }>({
    queryKey: ['/api/earthquake-stats'],
    refetchInterval: 60000,
  });

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 8.5) return 'bg-red-600 text-white';
    if (magnitude >= 7.0) return 'bg-red-500 text-white';
    if (magnitude >= 6.0) return 'bg-orange-500 text-white';
    if (magnitude >= 5.0) return 'bg-yellow-500 text-black';
    return 'bg-green-500 text-white';
  };

  const getSignificanceColor = (level: string) => {
    switch (level) {
      case 'prophetic': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-300';
      case 'high': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/20 dark:text-amber-300';
      default: return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  const openUSGSDetails = (url: string) => {
    window.open(url, '_blank');
  };

  const renderEarthquakeList = (earthquakeList: Earthquake[] | undefined, title: string) => {
    if (!earthquakeList || earthquakeList.length === 0) {
      return (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No {title.toLowerCase()} earthquakes</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {earthquakeList.map((quake) => (
          <Card key={quake.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge className={getMagnitudeColor(quake.magnitude)}>
                    M{quake.magnitude}
                  </Badge>
                  <Badge variant="outline" className={getSignificanceColor(quake.biblicalSignificance.level)}>
                    {quake.biblicalSignificance.level === 'prophetic' ? '⚡ Prophetic' :
                     quake.biblicalSignificance.level === 'high' ? '🔥 High' :
                     quake.biblicalSignificance.level === 'medium' ? '⚠️ Medium' : '📍 Normal'}
                  </Badge>
                  {quake.tsunami && (
                    <Badge variant="destructive">
                      🌊 Tsunami
                    </Badge>
                  )}
                </div>
                {quake.alert !== 'none' && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {quake.alert.toUpperCase()}
                  </Badge>
                )}
              </div>
              
              <Button
                variant="ghost"
                className="h-auto p-0 justify-start text-left w-full hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => openUSGSDetails(quake.url)}
              >
                <CardTitle className="text-sm font-semibold hover:text-red-600 dark:hover:text-red-400 transition-colors leading-tight">
                  {quake.location} 🔗
                </CardTitle>
              </Button>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(quake.timestamp), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>Depth: {quake.coordinates.depth.toFixed(1)}km</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-3 w-3" />
                  <span>{quake.coordinates.latitude.toFixed(2)}°, {quake.coordinates.longitude.toFixed(2)}°</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{quake.felt} felt reports</span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded p-3 mb-3">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Biblical Significance:
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {quake.biblicalSignificance.description}
                </p>
                {quake.biblicalSignificance.scripture && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded px-2 py-1">
                    <p className="text-xs text-blue-700 dark:text-blue-300 italic">
                      {quake.biblicalSignificance.scripture}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Source: {quake.source}</span>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs"
                  onClick={() => openUSGSDetails(quake.url)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  USGS Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-red-600" />
              <span>Earthquake Monitor - USGS Real-Time Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">Loading earthquake data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unprecedentedQuakes = earthquakes?.filter(q => q.isUnprecedented) || [];
  const significantQuakes = earthquakes?.filter(q => q.isSignificant) || [];
  const holyLandQuakes = earthquakes?.filter(q => 
    ['israel', 'palestine', 'jerusalem', 'middle east', 'turkey', 'syria', 'lebanon']
      .some(keyword => q.location.toLowerCase().includes(keyword))
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <Card className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-red-600" />
              <div>
                <CardTitle className="text-2xl">Earthquake Monitor</CardTitle>
                <p className="text-sm text-muted-foreground overlay-text bg-transparent">
                  Real-time seismic activity - "Creation groans for the Sons of God to return"
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{earthquakeStats?.total || 0}</div>
                <div className="text-xs text-muted-foreground">Total (30 days)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{earthquakeStats?.significant || 0}</div>
                <div className="text-xs text-muted-foreground">Significant (6.0+)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{unprecedentedQuakes.length}</div>
                <div className="text-xs text-muted-foreground">Unprecedented (8.5+)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{holyLandQuakes.length}</div>
                <div className="text-xs text-muted-foreground">Holy Land</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Prophetic Alert */}
      {unprecedentedQuakes.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-600/20 to-red-600/20 border-purple-500 border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
              <Zap className="h-6 w-6" />
              <span>⚡ PROPHETIC ALERT: Unprecedented Earthquake Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-800 dark:text-purple-300">Revelation 16:18</span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-400 italic mb-3">
                "And there were voices, and thunders, and lightnings; and there was a great earthquake, 
                such as was not since men were upon the earth, so mighty an earthquake, and so great."
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {unprecedentedQuakes.length} earthquake(s) of magnitude 8.5+ detected in the last 30 days.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earthquake Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recent">🌍 Recent (All)</TabsTrigger>
          <TabsTrigger value="significant">🔥 Significant (6.0+)</TabsTrigger>
          <TabsTrigger value="unprecedented">⚡ Unprecedented (8.5+)</TabsTrigger>
          <TabsTrigger value="holy-land">📍 Holy Land</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {renderEarthquakeList(earthquakes, 'Recent')}
        </TabsContent>

        <TabsContent value="significant" className="space-y-4">
          {renderEarthquakeList(significantQuakes, 'Significant')}
        </TabsContent>

        <TabsContent value="unprecedented" className="space-y-4">
          {unprecedentedQuakes.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-red-800 dark:text-red-300">Prophetic Significance</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-400">
                  These earthquakes may be fulfilling biblical prophecy about unprecedented seismic activity in the last days.
                </p>
              </div>
              {renderEarthquakeList(unprecedentedQuakes, 'Unprecedented')}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No unprecedented earthquakes currently detected</p>
              <p className="text-xs text-muted-foreground mt-2">
                Monitoring for magnitude 8.5+ earthquakes as prophesied in Revelation
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="holy-land" className="space-y-4">
          {holyLandQuakes.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-800 dark:text-blue-300">Biblical Region Activity</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Earthquake activity in biblical regions - watching for prophetic significance.
                </p>
              </div>
              {renderEarthquakeList(holyLandQuakes, 'Holy Land')}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No recent earthquakes in biblical regions</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
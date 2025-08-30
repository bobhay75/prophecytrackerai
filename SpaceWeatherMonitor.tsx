import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Telescope, AlertTriangle, Star, Activity } from 'lucide-react';

interface SpaceObject {
  id: string;
  name: string;
  date: Date;
  size: number;
  velocity: number;
  distance: number;
  isPotentiallyHazardous: boolean;
  biblicalSignificance: {
    level: 'low' | 'medium' | 'high' | 'wormwood';
    description: string;
    scripture: string;
    prophecyMatch: string;
  };
  lastUpdated: Date;
}

interface SpaceWeatherStats {
  totalObjects: number;
  potentiallyHazardous: number;
  wormwoodCandidates: number;
  largestObject: number;
  solarEvents: number;
  lastUpdate: Date;
}

export function SpaceWeatherMonitor() {
  const [selectedTab, setSelectedTab] = useState('objects');

  const { data: spaceObjects, isLoading: objectsLoading } = useQuery<SpaceObject[]>({
    queryKey: ['/api/space-objects'],
    refetchInterval: 4 * 60 * 60 * 1000, // 4 hours
  });

  const { data: spaceStats } = useQuery<SpaceWeatherStats>({
    queryKey: ['/api/space-weather-stats'],
    refetchInterval: 4 * 60 * 60 * 1000,
  });

  const getSignificanceBadge = (level: string) => {
    switch (level) {
      case 'wormwood':
        return <Badge className="bg-red-600 text-white">🌟 WORMWOOD</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 text-white">⚠️ HIGH</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white">📊 MEDIUM</Badge>;
      default:
        return <Badge variant="secondary">🔵 LOW</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (objectsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Telescope className="h-5 w-5" />
            <span>Space Weather Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading NASA space data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const wormwoodCandidates = spaceObjects?.filter(obj => obj.biblicalSignificance.level === 'wormwood') || [];
  const highSignificance = spaceObjects?.filter(obj => obj.biblicalSignificance.level === 'high') || [];
  const potentiallyHazardous = spaceObjects?.filter(obj => obj.isPotentiallyHazardous) || [];

  return (
    <div className="space-y-6">
      {/* Wormwood Alert */}
      {wormwoodCandidates.length > 0 && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>🌟 WORMWOOD CANDIDATES DETECTED:</strong> {wormwoodCandidates.length} objects match Revelation 8:10-11 prophecy characteristics
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Telescope className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Objects</p>
                <p className="text-xl font-bold">{spaceStats?.totalObjects || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Potentially Hazardous</p>
                <p className="text-xl font-bold text-orange-600">{spaceStats?.potentiallyHazardous || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Wormwood Candidates</p>
                <p className="text-xl font-bold text-red-600">{spaceStats?.wormwoodCandidates || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Solar Events</p>
                <p className="text-xl font-bold text-purple-600">{spaceStats?.solarEvents || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Telescope className="h-5 w-5" />
              <span>Space Weather Monitor - NASA Real-Time Data</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Updated: {spaceStats?.lastUpdate && formatDate(spaceStats.lastUpdate)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="objects">Near Earth Objects</TabsTrigger>
              <TabsTrigger value="wormwood">🌟 Wormwood Watch</TabsTrigger>
              <TabsTrigger value="hazardous">⚠️ Potentially Hazardous</TabsTrigger>
              <TabsTrigger value="prophecy">📜 Biblical Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="objects" className="space-y-4 mt-6">
              <div className="text-center mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monitoring near-Earth objects for prophetic significance
                </p>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {spaceObjects?.map((obj) => (
                  <Card key={obj.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{obj.name}</h4>
                            {getSignificanceBadge(obj.biblicalSignificance.level)}
                            {obj.isPotentiallyHazardous && (
                              <Badge variant="destructive" className="text-xs">HAZARDOUS</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <div>Size: {obj.size.toFixed(2)} km</div>
                            <div>Velocity: {obj.velocity.toFixed(1)} km/s</div>
                            <div>Distance: {obj.distance.toFixed(3)} AU</div>
                            <div>Date: {formatDate(obj.date)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wormwood" className="space-y-4 mt-6">
              <div className="text-center mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                  "And the name of the star is called Wormwood" - Revelation 8:11
                </p>
              </div>
              
              {wormwoodCandidates.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No Wormwood candidates detected at this time</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wormwoodCandidates.map((obj) => (
                    <Card key={obj.id} className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-red-800 dark:text-red-200">{obj.name}</h4>
                              <Badge className="bg-red-600 text-white">🌟 WORMWOOD CANDIDATE</Badge>
                            </div>
                            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                              {obj.biblicalSignificance.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-red-600 dark:text-red-400">
                              <div>Size: {obj.size.toFixed(2)} km</div>
                              <div>Velocity: {obj.velocity.toFixed(1)} km/s</div>
                              <div>Distance: {obj.distance.toFixed(3)} AU</div>
                              <div>Date: {formatDate(obj.date)}</div>
                            </div>
                            <div className="mt-3 p-2 bg-white dark:bg-red-900 rounded text-xs">
                              <strong className="text-red-800 dark:text-red-200">{obj.biblicalSignificance.scripture}:</strong>
                              <p className="text-red-700 dark:text-red-300 mt-1">{obj.biblicalSignificance.prophecyMatch}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hazardous" className="space-y-4 mt-6">
              <div className="text-center mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Objects classified as potentially hazardous by NASA
                </p>
              </div>
              
              {potentiallyHazardous.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No potentially hazardous objects detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {potentiallyHazardous.map((obj) => (
                    <Card key={obj.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{obj.name}</h4>
                              <Badge variant="destructive">⚠️ POTENTIALLY HAZARDOUS</Badge>
                              {getSignificanceBadge(obj.biblicalSignificance.level)}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <div>Size: {obj.size.toFixed(2)} km</div>
                              <div>Velocity: {obj.velocity.toFixed(1)} km/s</div>
                              <div>Distance: {obj.distance.toFixed(3)} AU</div>
                              <div>Date: {formatDate(obj.date)}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="prophecy" className="space-y-4 mt-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Biblical Space Weather Analysis</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Correlating celestial events with prophetic scripture
                </p>
              </div>
              
              <div className="grid gap-4">
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">🌟 Revelation 8:10-11 - The Third Trumpet</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      "And the third angel sounded, and there fell a great star from heaven, burning as it were a lamp, and it fell upon the third part of the rivers, and upon the fountains of waters; And the name of the star is called Wormwood: and the third part of the waters became wormwood; and many men died of the waters, because they were made bitter."
                    </p>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      Currently monitoring: {wormwoodCandidates.length} potential Wormwood candidates
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">✨ Luke 21:25 - Signs in the Heavens</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      "And there shall be signs in the sun, and in the moon, and in the stars; and upon the earth distress of nations, with perplexity; the sea and the waves roaring"
                    </p>
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      Currently tracking: {spaceStats?.totalObjects || 0} celestial objects for prophetic signs
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">🌙 Matthew 24:29 - Cosmic Disturbances</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      "Immediately after the tribulation of those days shall the sun be darkened, and the moon shall not give her light, and the stars shall fall from heaven, and the powers of the heavens shall be shaken"
                    </p>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Solar activity monitoring: {spaceStats?.solarEvents || 0} events detected
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
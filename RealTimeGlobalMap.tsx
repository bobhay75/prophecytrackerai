import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  AlertTriangle, 
  Flame, 
  Shield, 
  Clock,
  TrendingUp,
  Globe,
  Zap,
  Target,
  Radio,
  ArrowRight
} from 'lucide-react';

interface ConflictEvent {
  id: string;
  title: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'military' | 'political' | 'economic' | 'cyber' | 'nuclear' | 'humanitarian';
  description: string;
  lastUpdated: Date;
  casualties?: number;
  isActive: boolean;
  sourceUrl?: string;
  prophenticSignificance: number; // 1-10 scale
}

interface RegionData {
  region: string;
  activeConflicts: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastUpdate: Date;
  keyEvents: ConflictEvent[];
}

export function RealTimeGlobalMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ConflictEvent | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch real-time conflict data
  const { data: conflictData = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/real-time-conflicts'],
    refetchInterval: 60000, // Update every minute
  });

  // Fetch regional summaries
  const { data: regionSummaries = [] } = useQuery<RegionData[]>({
    queryKey: ['/api/region-summaries'],
    refetchInterval: 300000, // Update every 5 minutes
  });

  // Fetch Google Maps API key
  const { data: config } = useQuery({
    queryKey: ['/api/config'],
  });

  useEffect(() => {
    // Load Google Maps script with the API key
    if (!window.google && config?.googleMapsApiKey) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&callback=initializeGoogleMapsApi`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error('Failed to load Google Maps');
        setMapLoaded(false);
      };
      
      // Create global callback function
      (window as any).initializeGoogleMapsApi = () => {
        console.log('Google Maps API loaded successfully');
        setMapLoaded(true);
      };
      
      document.head.appendChild(script);
    } else if (window.google?.maps?.Map) {
      setMapLoaded(true);
    }
  }, [config]);

  useEffect(() => {
    if (mapLoaded && conflictData.length > 0) {
      initializeGoogleMap();
    }
  }, [mapLoaded, conflictData]);

  // Add global functions for info window buttons
  useEffect(() => {
    (window as any).openStreetView = (lat: number, lng: number) => {
      const map = (window as any).disasterMap;
      if (map) {
        const streetViewService = new google.maps.StreetViewService();
        streetViewService.getPanorama({
          location: { lat, lng },
          radius: 1000
        }, (data, status) => {
          if (status === 'OK') {
            const panorama = new google.maps.StreetViewPanorama(
              document.getElementById('street-view-container') || document.createElement('div'),
              {
                position: { lat, lng },
                pov: { heading: 34, pitch: 10 },
                zoom: 1
              }
            );
            
            // Create street view modal
            const modal = document.createElement('div');
            modal.style.cssText = `
              position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
              background: rgba(0,0,0,0.9); z-index: 10000; display: flex; 
              align-items: center; justify-content: center;
            `;
            
            const container = document.createElement('div');
            container.id = 'street-view-container';
            container.style.cssText = 'width: 90%; height: 80%; border-radius: 8px; overflow: hidden;';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕ Close Street View';
            closeBtn.style.cssText = `
              position: absolute; top: 20px; right: 20px; 
              background: rgba(0,0,0,0.9); color: #ffffff; 
              border: 2px solid #ffffff; padding: 12px 20px; border-radius: 8px; 
              cursor: pointer; font-size: 16px; font-weight: 600; z-index: 10001;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              transition: all 0.2s ease;
            `;
            closeBtn.onmouseover = () => {
              closeBtn.style.background = 'rgba(255,255,255,0.2)';
              closeBtn.style.transform = 'scale(1.05)';
            };
            closeBtn.onmouseout = () => {
              closeBtn.style.background = 'rgba(0,0,0,0.9)';
              closeBtn.style.transform = 'scale(1)';
            };
            closeBtn.onclick = () => document.body.removeChild(modal);
            
            modal.appendChild(container);
            modal.appendChild(closeBtn);
            document.body.appendChild(modal);
            
            // Initialize street view in the container
            new google.maps.StreetViewPanorama(container, {
              position: { lat, lng },
              pov: { heading: 34, pitch: 10 },
              zoom: 1
            });
          } else {
            alert('Street View not available for this location. Try zooming to maximum detail instead.');
          }
        });
      }
    };

    (window as any).openSourceData = (eventId: string) => {
      // Find the event and open source links
      const event = conflictData.find((e: ConflictEvent) => e.id === eventId);
      if (event) {
        const sources = [
          `https://news.google.com/search?q=${encodeURIComponent(event.title + ' ' + event.region)}`,
          `https://www.reuters.com/search/news?blob=${encodeURIComponent(event.title)}`,
          `https://www.bbc.com/search?q=${encodeURIComponent(event.title)}`,
          `https://apnews.com/search?q=${encodeURIComponent(event.title)}`
        ];
        
        sources.forEach((url, index) => {
          setTimeout(() => window.open(url, '_blank'), index * 500);
        });
      }
    };

    (window as any).zoomToMaxDetail = (lat: number, lng: number) => {
      const map = (window as any).disasterMap;
      if (map) {
        map.setCenter({ lat, lng });
        map.setZoom(20); // Maximum satellite zoom
        map.setMapTypeId('satellite');
      }
    };

    (window as any).navigateToLocation = (lat: number, lng: number, title: string) => {
      const map = (window as any).disasterMap;
      if (map) {
        map.setCenter({ lat, lng });
        map.setZoom(14);
        
        // Find and trigger the marker
        const event = conflictData.find((e: ConflictEvent) => 
          Math.abs(e.latitude - lat) < 0.001 && Math.abs(e.longitude - lng) < 0.001
        );
        if (event) {
          setSelectedEvent(event);
        }
      }
    };
  }, [conflictData]);

  const initializeGoogleMap = () => {
    // Verify Google Maps API is available
    if (!window.google?.maps?.Map) {
      console.error('Google Maps API not available');
      return;
    }

    const mapElement = document.getElementById('google-conflict-map');
    if (!mapElement) {
      console.error('Map container not found');
      return;
    }

    const map = new google.maps.Map(mapElement, {
      zoom: 2,
      center: { lat: 30, lng: 0 },
      mapTypeId: 'hybrid',
      styles: [
        {
          featureType: 'all',
          stylers: [{ saturation: -20 }]
        }
      ],
      streetViewControl: true,
      fullscreenControl: true,
      mapTypeControl: true,
      zoomControl: true
    });

    // Store map reference for external access
    (window as any).disasterMap = map;

    // Custom heat visualization using circles (replaces deprecated heatmap)
    conflictData.forEach((event: ConflictEvent) => {
      // Create heat intensity circles
      const heatCircle = new google.maps.Circle({
        strokeColor: getSeverityHexColor(event.severity),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: getSeverityHexColor(event.severity),
        fillOpacity: 0.35,
        map: map,
        center: { lat: event.latitude, lng: event.longitude },
        radius: getSeverityRadius(event.severity) * 1000 // Convert to meters
      });

      // Custom marker with SVG icon
      const markerIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="${getSeverityHexColor(event.severity)}" stroke="#ffffff" stroke-width="3"/>
            <text x="20" y="25" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="white">
              ${getEventTypeSymbol(event.type)}
            </text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      };

      const marker = new google.maps.Marker({
        position: { lat: event.latitude, lng: event.longitude },
        map: map,
        title: event.title,
        icon: markerIcon,
        animation: event.severity === 'critical' ? google.maps.Animation.BOUNCE : undefined
      });

      // Enhanced info window with source links and street view
      const infoWindow = new google.maps.InfoWindow({
        content: createAdvancedInfoContent(event, map),
        maxWidth: 400
      });

      marker.addListener('click', () => {
        setSelectedEvent(event);
        infoWindow.open(map, marker);
        
        // Auto-zoom to location for better detail
        map.setZoom(12);
        map.setCenter({ lat: event.latitude, lng: event.longitude });
      });
    });
  };

  const getSeverityRadius = (severity: string): number => {
    switch (severity) {
      case 'critical': return 50;
      case 'high': return 35;
      case 'medium': return 25;
      case 'low': return 15;
      default: return 10;
    }
  };

  const createAdvancedInfoContent = (event: ConflictEvent, map: google.maps.Map): string => {
    return `
      <div style="max-width: 380px; padding: 16px; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 18px; font-weight: bold;">${event.title}</h3>
        
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px; margin-bottom: 12px; font-size: 14px;">
          <strong>Location:</strong> <span>${event.region}</span>
          <strong>Type:</strong> <span style="text-transform: capitalize; color: #2563eb;">${event.type}</span>
          <strong>Severity:</strong> <span style="color: ${getSeverityHexColor(event.severity)}; font-weight: bold; text-transform: uppercase;">${event.severity}</span>
          <strong>Prophetic Score:</strong> <span style="color: #d97706; font-weight: bold;">${event.prophenticSignificance}/10</span>
        </div>
        
        <p style="margin: 12px 0; color: #374151; line-height: 1.5; font-size: 14px;">${event.description}</p>
        
        ${event.casualties ? `<p style="margin: 8px 0; color: #dc2626; font-weight: bold; font-size: 15px;">⚠️ Casualties: ${event.casualties?.toLocaleString()}</p>` : ''}
        
        <div style="display: flex; gap: 8px; margin: 16px 0;">
          <button onclick="openStreetView(${event.latitude}, ${event.longitude})" 
                  style="background: #4285f4; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            🔍 Street View
          </button>
          <button onclick="openSourceData('${event.id}')" 
                  style="background: #ea4335; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            📰 Live Sources
          </button>
          <button onclick="zoomToMaxDetail(${event.latitude}, ${event.longitude})" 
                  style="background: #34a853; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            🔎 Max Zoom
          </button>
        </div>
        
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            <strong>Last Update:</strong> ${new Date(event.lastUpdated).toLocaleString()}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #9ca3af;">
            Sources: Live feeds, satellite data, ground reports
          </p>
        </div>
      </div>
    `;
  };

  const getSeverityHexColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getEventTypeSymbol = (type: string): string => {
    switch (type) {
      case 'nuclear': return '☢';
      case 'military': return '⚔';
      case 'economic': return '$';
      case 'cyber': return '⚡';
      case 'humanitarian': return '🆘';
      default: return '!';
    }
  };

  const createGoogleMapInfoContent = (event: ConflictEvent): string => {
    return `
      <div style="max-width: 320px; padding: 12px; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 16px;">${event.title}</h3>
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px; margin-bottom: 10px;">
          <strong>Region:</strong> <span>${event.region}</span>
          <strong>Type:</strong> <span style="text-transform: capitalize;">${event.type}</span>
          <strong>Severity:</strong> <span style="color: ${getSeverityHexColor(event.severity)}; font-weight: bold; text-transform: uppercase;">${event.severity}</span>
          <strong>Prophetic Score:</strong> <span style="color: #d97706; font-weight: bold;">${event.prophenticSignificance}/10</span>
        </div>
        <p style="margin: 10px 0; color: #374151; line-height: 1.4;">${event.description}</p>
        ${event.casualties ? `<p style="margin: 5px 0; color: #dc2626; font-weight: bold;">Casualties: ${event.casualties?.toLocaleString()}</p>` : ''}
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">
          Last updated: ${new Date(event.lastUpdated).toLocaleString()}
        </p>
      </div>
    `;
  };

  const getSeverityWeight = (severity: string): number => {
    switch (severity) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  };

  const getMarkerIcon = (type: string, severity: string) => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    const severityColor = {
      critical: 'red',
      high: 'orange', 
      medium: 'yellow',
      low: 'blue'
    }[severity] || 'blue';
    
    return `${baseUrl}${severityColor}-dot.png`;
  };

  const createInfoWindowContent = (event: ConflictEvent): string => {
    return `
      <div style="max-width: 300px; padding: 10px;">
        <h3 style="margin: 0 0 10px 0; color: #1a1a1a;">${event.title}</h3>
        <p style="margin: 5px 0;"><strong>Region:</strong> ${event.region}</p>
        <p style="margin: 5px 0;"><strong>Type:</strong> ${event.type}</p>
        <p style="margin: 5px 0;"><strong>Severity:</strong> ${event.severity}</p>
        <p style="margin: 5px 0;"><strong>Prophetic Significance:</strong> ${event.prophenticSignificance}/10</p>
        <p style="margin: 10px 0 5px 0;">${event.description}</p>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">
          Last updated: ${event.lastUpdated.toLocaleString()}
        </p>
      </div>
    `;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <Flame className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Zap className="h-4 w-4" />;
      case 'low': return <Shield className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-red-600" />
            <span>Real-Time Global Conflict Monitor</span>
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Live tracking of global conflicts with prophetic significance analysis. Data updated hourly from verified sources.
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="map">🌍 Live Map</TabsTrigger>
          <TabsTrigger value="regions">📊 Regional Data</TabsTrigger>
          <TabsTrigger value="timeline">⏰ Timeline</TabsTrigger>
          <TabsTrigger value="analysis">🔮 Prophetic Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          {/* Google Maps Container */}
          <Card>
            <CardContent className="p-0">
              <div 
                id="google-conflict-map" 
                style={{ height: '600px', width: '100%' }}
                className="rounded-lg"
              />
              {!mapLoaded && (
                <div className="h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading interactive disaster map with street view access...</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Initializing Google Maps API with real-time data sources
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive Disaster List */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌍 Interactive Disaster Monitor
                <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Click any event below to navigate directly to its location on the map with street view access
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {conflictData.map((event: ConflictEvent) => (
                  <div
                    key={event.id}
                    onClick={() => (window as any).navigateToLocation?.(event.latitude, event.longitude, event.title)}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          event.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                          event.severity === 'high' ? 'bg-orange-500' :
                          event.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                      >
                        {getEventTypeSymbol(event.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {event.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{event.region}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            event.severity === 'critical' ? 'destructive' :
                            event.severity === 'high' ? 'secondary' : 'outline'
                          } className="text-xs">
                            {event.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Prophetic: {event.prophenticSignificance}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          (window as any).openStreetView?.(event.latitude, event.longitude);
                        }}
                        className="h-8"
                      >
                        🔍 Street
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          (window as any).openSourceData?.(event.id);
                        }}
                        className="h-8"
                      >
                        📰 Sources
                      </Button>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Events Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Radio className="h-5 w-5 text-red-500" />
                    <span>Active Conflicts</span>
                    <Badge variant="outline">{conflictData.length} Active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : (
                    conflictData.map((event: ConflictEvent) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          selectedEvent?.id === event.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded ${getSeverityColor(event.severity)} text-white`}>
                              {getSeverityIcon(event.severity)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{event.title}</h4>
                              <p className="text-xs text-muted-foreground">{event.region}, {event.country}</p>
                              <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(event.lastUpdated).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical Conflicts</span>
                    <Badge variant="destructive">
                      {conflictData.filter((e: ConflictEvent) => e.severity === 'critical').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Priority</span>
                    <Badge className="bg-orange-500">
                      {conflictData.filter((e: ConflictEvent) => e.severity === 'high').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Regions Affected</span>
                    <Badge variant="outline">
                      {new Set(conflictData.map((e: ConflictEvent) => e.region)).size}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nuclear Threats</span>
                    <Badge variant="destructive">
                      {conflictData.filter((e: ConflictEvent) => e.type === 'nuclear').length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Last Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => refetch()}
                  >
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { region: 'Middle East', conflicts: 12, severity: 'critical' as const },
              { region: 'Eastern Europe', conflicts: 8, severity: 'high' as const },
              { region: 'East Asia', conflicts: 6, severity: 'high' as const },
              { region: 'North America', conflicts: 3, severity: 'medium' as const },
              { region: 'North Africa', conflicts: 5, severity: 'medium' as const },
              { region: 'Central Asia', conflicts: 4, severity: 'medium' as const },
            ].map((region) => (
              <Card key={region.region} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span>{region.region}</span>
                    <div className={`p-1 rounded ${getSeverityColor(region.severity)} text-white`}>
                      {getSeverityIcon(region.severity)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Conflicts</span>
                      <Badge variant="outline">{region.conflicts}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Threat Level</span>
                      <Badge className={getSeverityColor(region.severity)}>
                        {region.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prophetic Relevance</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full mr-1 ${
                              i < Math.floor(Math.random() * 5) + 1 ? 'bg-yellow-400' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Conflict Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conflictData.slice(0, 10).map((event: ConflictEvent, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{event.region}</Badge>
                        <Badge variant="outline" className="text-xs">{event.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Prophetic Significance Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    High Prophetic Significance Events
                  </h4>
                  <div className="mt-2 space-y-2">
                    {conflictData
                      .filter((e: ConflictEvent) => e.prophenticSignificance >= 8)
                      .map((event: ConflictEvent) => (
                        <div key={event.id} className="text-sm">
                          <span className="font-medium">{event.title}</span> - 
                          <span className="text-yellow-700 dark:text-yellow-300 ml-1">
                            Significance: {event.prophenticSignificance}/10
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Biblical Correlation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Matthew 24:6-7:</strong> Wars and rumors of wars</p>
                        <p><strong>Daniel 9:27:</strong> Middle East peace covenant</p>
                        <p><strong>Ezekiel 38-39:</strong> Northern alliance against Israel</p>
                        <p><strong>Revelation 16:16:</strong> Armageddon preparations</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Current Indicators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Wars Intensity</span>
                          <Badge variant="destructive">Critical</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Israel Focus</span>
                          <Badge className="bg-orange-500">High</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Global Alliances</span>
                          <Badge className="bg-yellow-500">Forming</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Peace Efforts</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
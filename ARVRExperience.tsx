import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Headphones, 
  Eye, 
  Globe, 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  RotateCw,
  Layers,
  Zap,
  Camera,
  Gamepad2
} from 'lucide-react';

interface ARExperience {
  id: string;
  title: string;
  description: string;
  type: 'prophecy-vision' | 'biblical-scene' | 'global-events' | 'temple-reconstruction';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnailUrl: string;
  immersionLevel: number;
  biblicalAccuracy: number;
}

interface VRSession {
  id: string;
  userId: string;
  experienceId: string;
  startTime: string;
  duration: number;
  immersionScore: number;
  revelationsUnlocked: string[];
  emotionalImpact: number;
}

export function ARVRExperience() {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<ARExperience | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });

  // Check for WebXR support
  useEffect(() => {
    if ('xr' in navigator) {
      // @ts-ignore - WebXR is still experimental
      navigator.xr?.isSessionSupported('immersive-vr').then(setIsVRSupported);
      // @ts-ignore - WebXR is still experimental  
      navigator.xr?.isSessionSupported('immersive-ar').then(setIsARSupported);
    }

    // Check for device orientation (mobile AR fallback)
    if ('DeviceOrientationEvent' in window) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        setDeviceOrientation({
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0
        });
      };

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  const experiences: ARExperience[] = [
    {
      id: 'ezekiel-temple',
      title: 'Ezekiel\'s Temple Vision',
      description: 'Walk through the prophetic temple described in Ezekiel 40-48 in stunning 3D detail',
      type: 'biblical-scene',
      duration: '12-15 min',
      difficulty: 'intermediate',
      thumbnailUrl: '/ar-temple.jpg',
      immersionLevel: 95,
      biblicalAccuracy: 98
    },
    {
      id: 'revelation-seven-seals',
      title: 'The Seven Seals of Revelation',
      description: 'Experience the opening of each seal with immersive visuals and prophetic symbolism',
      type: 'prophecy-vision',
      duration: '20-25 min',
      difficulty: 'advanced',
      thumbnailUrl: '/ar-seals.jpg',
      immersionLevel: 92,
      biblicalAccuracy: 96
    },
    {
      id: 'global-prophecy-map',
      title: 'Global Prophecy Fulfillment Map',
      description: 'See real-time prophecy fulfillments overlaid on a 3D earth in your living space',
      type: 'global-events',
      duration: 'Continuous',
      difficulty: 'beginner',
      thumbnailUrl: '/ar-globe.jpg',
      immersionLevel: 88,
      biblicalAccuracy: 94
    },
    {
      id: 'daniel-statue',
      title: 'Daniel\'s Dream of the Great Statue',
      description: 'Witness the rise and fall of world empires through Daniel\'s prophetic vision',
      type: 'prophecy-vision',
      duration: '8-10 min',
      difficulty: 'intermediate',
      thumbnailUrl: '/ar-statue.jpg',
      immersionLevel: 90,
      biblicalAccuracy: 97
    }
  ];

  const mockSessions: VRSession[] = [
    {
      id: 'session-001',
      userId: 'user-123',
      experienceId: 'ezekiel-temple',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      duration: 847, // seconds
      immersionScore: 94,
      revelationsUnlocked: ['Temple Measurements', 'Priestly Chambers', 'River of Life'],
      emotionalImpact: 88
    }
  ];

  const startARExperience = async (experience: ARExperience) => {
    setCurrentExperience(experience);
    setIsSessionActive(true);

    // Simulate session progress
    const progressInterval = setInterval(() => {
      setSessionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsSessionActive(false);
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

    // Initialize AR/VR session (mock implementation)
    if (isARSupported && experience.type === 'global-events') {
      // Request AR session
      try {
        // @ts-ignore - WebXR experimental
        const session = await navigator.xr?.requestSession('immersive-ar');
        console.log('AR session started:', session);
      } catch (error) {
        console.log('AR fallback to device orientation');
      }
    }
  };

  const stopExperience = () => {
    setIsSessionActive(false);
    setCurrentExperience(null);
    setSessionProgress(0);
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'prophecy-vision': return <Eye className="h-4 w-4" />;
      case 'biblical-scene': return <Layers className="h-4 w-4" />;
      case 'global-events': return <Globe className="h-4 w-4" />;
      case 'temple-reconstruction': return <Zap className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AR/VR Header */}
      <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Headphones className="h-8 w-8 text-purple-600" />
              <div>
                <CardTitle className="text-2xl">Immersive Prophecy Experience</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Step into biblical visions with AR/VR technology
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <Badge variant={isVRSupported ? "default" : "secondary"}>
                  VR {isVRSupported ? "Ready" : "Not Supported"}
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={isARSupported ? "default" : "secondary"}>
                  AR {isARSupported ? "Ready" : "Device Orientation"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="experiences" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="experiences">🎮 Experiences</TabsTrigger>
          <TabsTrigger value="live-session">📱 Live Session</TabsTrigger>
          <TabsTrigger value="analytics">📊 Session Analytics</TabsTrigger>
          <TabsTrigger value="coming-soon">🚀 Coming Soon</TabsTrigger>
        </TabsList>

        <TabsContent value="experiences" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((experience) => (
              <Card key={experience.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">{getTypeIcon(experience.type)}</div>
                    <div className="text-sm opacity-75">Preview Coming Soon</div>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{experience.title}</CardTitle>
                    <Badge className={getDifficultyColor(experience.difficulty)}>
                      {experience.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {experience.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{experience.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Immersion Level:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${experience.immersionLevel}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{experience.immersionLevel}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Biblical Accuracy:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${experience.biblicalAccuracy}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{experience.biblicalAccuracy}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t mt-4">
                    <Button 
                      onClick={() => startARExperience(experience)}
                      disabled={isSessionActive}
                      className="w-full"
                    >
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      {isSessionActive && currentExperience?.id === experience.id 
                        ? 'Experience Active' 
                        : 'Start Experience'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live-session" className="space-y-4">
          {isSessionActive && currentExperience ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-green-500" />
                    Live: {currentExperience.title}
                  </CardTitle>
                  <Button onClick={stopExperience} variant="destructive" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Session Progress</span>
                      <span className="text-sm font-medium">{sessionProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${sessionProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* AR Visualization Canvas */}
                  <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                    <canvas 
                      ref={canvasRef}
                      className="w-full h-full"
                      width={800}
                      height={450}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <RotateCw className="h-12 w-12 mx-auto mb-2 animate-spin" />
                        <div className="text-lg font-semibold">Rendering Biblical Vision...</div>
                        <div className="text-sm opacity-75">
                          {currentExperience.type === 'global-events' && (
                            <>Device Orientation: α{Math.round(deviceOrientation.alpha)}° β{Math.round(deviceOrientation.beta)}° γ{Math.round(deviceOrientation.gamma)}°</>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" size="sm">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Audio Guide
                    </Button>
                    <Button variant="outline" size="sm">
                      <Maximize className="h-4 w-4 mr-2" />
                      Fullscreen
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Screenshot
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Headphones className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Active Session</h3>
                <p className="text-muted-foreground">Start an experience to begin your immersive journey</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockSessions.length}</div>
                <div className="text-sm text-muted-foreground">This month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg. Immersion Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {mockSessions.reduce((acc, s) => acc + s.immersionScore, 0) / mockSessions.length}%
                </div>
                <div className="text-sm text-muted-foreground">Highly immersive</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Revelations Unlocked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {mockSessions.reduce((acc, s) => acc + s.revelationsUnlocked.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Biblical insights gained</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSessions.map((session) => {
                  const experience = experiences.find(e => e.id === session.experienceId);
                  return (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{experience?.title}</h4>
                        <Badge variant="outline">
                          {Math.floor(session.duration / 60)}min {session.duration % 60}s
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Immersion: </span>
                          <span className="font-medium">{session.immersionScore}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Impact: </span>
                          <span className="font-medium">{session.emotionalImpact}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Insights: </span>
                          <span className="font-medium">{session.revelationsUnlocked.length}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">
                          Revelations: {session.revelationsUnlocked.join(', ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coming-soon" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="opacity-75">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌊 Noah's Flood Simulation
                  <Badge variant="outline">Q2 2025</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Experience the great flood from multiple perspectives with realistic water physics
                </p>
              </CardContent>
            </Card>

            <Card className="opacity-75">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Mount Sinai Lightning
                  <Badge variant="outline">Q3 2025</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Witness the giving of the Ten Commandments with immersive audio-visual effects
                </p>
              </CardContent>
            </Card>

            <Card className="opacity-75">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏙️ New Jerusalem Tour
                  <Badge variant="outline">Q4 2025</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Walk through the prophetic city described in Revelation 21-22
                </p>
              </CardContent>
            </Card>

            <Card className="opacity-75">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌟 Second Coming Visualization
                  <Badge variant="outline">2026</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Artistic interpretation of Christ's return based on biblical descriptions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
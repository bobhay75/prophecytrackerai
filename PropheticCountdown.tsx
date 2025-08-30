import { useState, useEffect } from 'react';
import { Calendar, Clock, Moon, Star, AlertTriangle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PropheticEvent {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  category: 'blood-moon' | 'solar-eclipse' | 'feast-day' | 'prophecy-date' | 'cosmic-event';
  significance: 'low' | 'medium' | 'high' | 'critical';
  scriptureRef?: string;
  location?: string;
  isRepeating?: boolean;
}

export default function PropheticCountdown() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [events] = useState<PropheticEvent[]>([
    {
      id: '1',
      title: 'Total Lunar Eclipse (Blood Moon)',
      description: 'The moon will appear red, fulfilling Joel 2:31 prophecy about the moon turning to blood before the great and terrible day of the Lord.',
      targetDate: new Date('2025-03-14T07:00:00Z'),
      category: 'blood-moon',
      significance: 'critical',
      scriptureRef: 'Joel 2:31, Revelation 6:12',
      location: 'Visible from Americas, Europe, Africa'
    },
    {
      id: '2',
      title: 'Feast of Trumpets (Rosh Hashanah)',
      description: 'The biblical new year and prophetically significant time for the rapture and Second Coming according to many scholars.',
      targetDate: new Date('2025-09-15T18:00:00Z'),
      category: 'feast-day',
      significance: 'high',
      scriptureRef: '1 Thessalonians 4:16-17, 1 Corinthians 15:52',
      isRepeating: true
    },
    {
      id: '3',
      title: 'Day of Atonement (Yom Kippur)',
      description: 'The holiest day in Judaism, prophetically connected to Israel\'s national repentance and recognition of Messiah.',
      targetDate: new Date('2025-09-24T18:00:00Z'),
      category: 'feast-day',
      significance: 'high',
      scriptureRef: 'Zechariah 12:10, Romans 11:26'
    },
    {
      id: '4',
      title: 'Spring Equinox Alignment',
      description: 'Astronomical alignment with potential prophetic significance for Israel and the nations.',
      targetDate: new Date('2025-03-20T09:01:00Z'),
      category: 'cosmic-event',
      significance: 'medium',
      scriptureRef: 'Genesis 1:14, Luke 21:25'
    },
    {
      id: '5',
      title: 'Daniel\'s 70th Week Calculation',
      description: 'Based on certain prophetic interpretations of Daniel 9:24-27, this represents a key prophetic milestone.',
      targetDate: new Date('2027-09-23T00:00:00Z'),
      category: 'prophecy-date',
      significance: 'critical',
      scriptureRef: 'Daniel 9:24-27, Matthew 24:15'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeRemaining = (targetDate: Date) => {
    const now = currentTime.getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'blood-moon': return <Moon className="h-5 w-5 text-red-500" />;
      case 'solar-eclipse': return <Star className="h-5 w-5 text-yellow-500" />;
      case 'feast-day': return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'prophecy-date': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'cosmic-event': return <Zap className="h-5 w-5 text-blue-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSignificanceBadge = (significance: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    
    return colors[significance as keyof typeof colors] || colors.low;
  };

  const getProgressPercentage = (targetDate: Date) => {
    const now = currentTime.getTime();
    const target = targetDate.getTime();
    const start = new Date('2025-01-01').getTime(); // Year start as reference
    
    const totalTime = target - start;
    const elapsed = now - start;
    
    return Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
  };

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Prophetic Event Countdowns</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track biblical feast days, blood moons, and prophetically significant dates based on scripture
        </p>
      </div>

      <div className="grid gap-6">
        {sortedEvents.map((event) => {
          const timeRemaining = calculateTimeRemaining(event.targetDate);
          const progress = getProgressPercentage(event.targetDate);
          
          return (
            <Card key={event.id} className={`overflow-hidden ${timeRemaining.isExpired ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(event.category)}
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {event.targetDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZoneName: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSignificanceBadge(event.significance)}>
                    {event.significance.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-sm leading-relaxed">{event.description}</p>
                
                {event.scriptureRef && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      📖 {event.scriptureRef}
                    </Badge>
                  </div>
                )}

                {event.location && (
                  <p className="text-xs text-muted-foreground">
                    📍 {event.location}
                  </p>
                )}

                {!timeRemaining.isExpired ? (
                  <div className="space-y-4">
                    {/* Countdown Display */}
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-2xl font-bold text-foreground">
                          {timeRemaining.days}
                        </div>
                        <div className="text-xs text-muted-foreground">Days</div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-2xl font-bold text-foreground">
                          {timeRemaining.hours}
                        </div>
                        <div className="text-xs text-muted-foreground">Hours</div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-2xl font-bold text-foreground">
                          {timeRemaining.minutes}
                        </div>
                        <div className="text-xs text-muted-foreground">Minutes</div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-2xl font-bold text-foreground">
                          {timeRemaining.seconds}
                        </div>
                        <div className="text-xs text-muted-foreground">Seconds</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress through 2025</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-green-600 mb-2">EVENT OCCURRED</div>
                    <p className="text-sm text-muted-foreground">
                      This prophetic event has passed. Watch for its fulfillment!
                    </p>
                  </div>
                )}

                {event.isRepeating && (
                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      🔄 Annual Event
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Educational Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Understanding Prophetic Timing</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              "He said to them: 'It is not for you to know the times or dates the Father has set by his own authority.'" - Acts 1:7
            </p>
            <p className="text-sm text-muted-foreground">
              These countdowns are for awareness and preparation, not date-setting. 
              Stay watchful and ready, for only the Father knows the exact timing of His plans.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
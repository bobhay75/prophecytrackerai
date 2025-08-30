import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Smartphone, AlertTriangle, CheckCircle, Settings, Zap } from 'lucide-react';

interface NotificationSettings {
  prophecyAlerts: boolean;
  earthquakeAlerts: boolean;
  spaceWeatherAlerts: boolean;
  dailyBriefings: boolean;
  communityUpdates: boolean;
}

interface PWANotificationsProps {
  onSettingsChange: (settings: NotificationSettings) => void;
}

export function PWANotifications({ onSettingsChange }: PWANotificationsProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isInstalled, setIsInstalled] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    prophecyAlerts: true,
    earthquakeAlerts: true,
    spaceWeatherAlerts: false,
    dailyBriefings: true,
    communityUpdates: false
  });

  useEffect(() => {
    checkNotificationSupport();
    checkPWAInstallation();
    loadSettings();
  }, []);

  const checkNotificationSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  };

  const checkPWAInstallation = () => {
    // Check if app is installed as PWA
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone ||
                       document.referrer.includes('android-app://');
    setIsInstalled(isInstalled);
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('notification-settings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      setSettings(parsedSettings);
      onSettingsChange(parsedSettings);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        // Send a test notification
        showTestNotification();
        // Register service worker for background notifications
        registerServiceWorker();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const showTestNotification = () => {
    if (permission === 'granted') {
      new Notification('End Times Tracker', {
        body: '🔔 Notifications are now enabled! You\'ll receive prophetic alerts and updates.',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'test-notification'
      });
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
    onSettingsChange(newSettings);
  };

  const sendSampleAlert = (type: string) => {
    if (permission !== 'granted') return;

    const notifications = {
      prophecy: {
        title: '🔥 Prophetic Alert',
        body: 'Major earthquake in Turkey aligns with Matthew 24:7 - "earthquakes in various places"',
        icon: '/icon-192x192.png'
      },
      earthquake: {
        title: '🌍 Earthquake Alert',
        body: 'Magnitude 7.2 earthquake detected in the Ring of Fire - Monitoring prophetic significance',
        icon: '/icon-192x192.png'
      },
      space: {
        title: '⭐ Space Weather Alert',
        body: 'Large asteroid approaching - Potential Wormwood candidate detected by NASA',
        icon: '/icon-192x192.png'
      },
      briefing: {
        title: '📖 Daily Briefing Ready',
        body: 'Your personalized End Times briefing is ready with today\'s prophetic insights',
        icon: '/icon-192x192.png'
      }
    };

    const notification = notifications[type as keyof typeof notifications];
    if (notification) {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon,
        badge: '/badge-72x72.png',
        tag: `sample-${type}`
      });
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please use a modern browser like Chrome, Firefox, or Safari to receive notifications.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
            <Badge variant={permission === 'granted' ? 'default' : 'secondary'}>
              {permission === 'granted' ? 'Enabled' : 'Disabled'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Stay informed about prophetic events and global developments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {permission === 'default' && (
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                Enable notifications to receive instant alerts when global events match biblical prophecies.
              </AlertDescription>
            </Alert>
          )}
          
          {permission === 'denied' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Notifications are blocked. Please enable them in your browser settings to receive prophetic alerts.
              </AlertDescription>
            </Alert>
          )}
          
          {permission === 'granted' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Notifications are enabled! You'll receive alerts about significant prophetic events.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center gap-4">
            {permission !== 'granted' && (
              <Button onClick={requestPermission}>
                <Bell className="mr-2 h-4 w-4" />
                Enable Notifications
              </Button>
            )}
            
            {permission === 'granted' && (
              <Button variant="outline" onClick={() => sendSampleAlert('prophecy')}>
                <Zap className="mr-2 h-4 w-4" />
                Test Alert
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PWA Installation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile App
            <Badge variant={isInstalled ? 'default' : 'secondary'}>
              {isInstalled ? 'Installed' : 'Available'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Install as a mobile app for the best experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isInstalled ? (
            <>
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  Install End Times Tracker as a mobile app for offline access and better notifications.
                </AlertDescription>
              </Alert>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Chrome/Edge:</strong> Click the install button in the address bar</p>
                <p><strong>Safari:</strong> Tap Share → Add to Home Screen</p>
                <p><strong>Firefox:</strong> Tap Menu → Install</p>
              </div>
            </>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                App is installed! You can access it from your home screen.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      {permission === 'granted' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Customize which alerts you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Prophetic Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Urgent notifications when events match biblical prophecies
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.prophecyAlerts}
                    onCheckedChange={(checked) => updateSetting('prophecyAlerts', checked)}
                  />
                  {settings.prophecyAlerts && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendSampleAlert('prophecy')}
                    >
                      Test
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Earthquake Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Significant seismic activity notifications
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.earthquakeAlerts}
                    onCheckedChange={(checked) => updateSetting('earthquakeAlerts', checked)}
                  />
                  {settings.earthquakeAlerts && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendSampleAlert('earthquake')}
                    >
                      Test
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Space Weather Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Asteroid and cosmic event notifications
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.spaceWeatherAlerts}
                    onCheckedChange={(checked) => updateSetting('spaceWeatherAlerts', checked)}
                  />
                  {settings.spaceWeatherAlerts && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendSampleAlert('space')}
                    >
                      Test
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Daily Briefings</div>
                  <div className="text-sm text-muted-foreground">
                    Personalized daily end times updates
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.dailyBriefings}
                    onCheckedChange={(checked) => updateSetting('dailyBriefings', checked)}
                  />
                  {settings.dailyBriefings && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendSampleAlert('briefing')}
                    >
                      Test
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Community Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Prayer requests and discussion notifications
                  </div>
                </div>
                <Switch
                  checked={settings.communityUpdates}
                  onCheckedChange={(checked) => updateSetting('communityUpdates', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PWANotifications;
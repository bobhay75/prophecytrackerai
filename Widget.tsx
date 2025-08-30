import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface WidgetData {
  alerts: Array<{
    id: string;
    title: string;
    message: string;
    level: string;
    category: string;
  }>;
  predictions: Array<{
    id: string;
    title: string;
    probability: number;
    biblicalReference?: string;
  }>;
}

export default function Widget() {
  const [config, setConfig] = useState<any>({
    title: 'Daily Prophecy Alerts',
    theme: 'auto',
    size: 'normal',
    showPredictions: true,
    showAlerts: true,
    showScripture: true,
    maxItems: 5,
    primaryColor: '#7c3aed',
    fontFamily: 'system-ui',
    language: 'en'
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Parse config from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');
    
    if (configParam) {
      try {
        const decodedConfig = JSON.parse(atob(configParam));
        setConfig({ ...config, ...decodedConfig });
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    }

    // Handle theme
    if (config.theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    } else {
      setTheme(config.theme);
    }

    // Notify parent that widget is ready
    window.parent.postMessage({ type: 'widget-ready' }, '*');

    // Listen for messages from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'theme-change') {
        setTheme(event.data.theme);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Fetch widget data
  const { data: widgetData } = useQuery<WidgetData>({
    queryKey: ['/api/widget/data'],
    refetchInterval: config.updateFrequency * 60 * 1000,
  });

  const handleClick = () => {
    window.parent.postMessage({ type: 'widget-click' }, '*');
  };

  const alerts = widgetData?.alerts.slice(0, config.maxItems) || [];
  const predictions = widgetData?.predictions.slice(0, config.maxItems) || [];

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen`}>
      <div className="bg-transparent p-4">
        <Card className="shadow-lg">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 
                className="font-semibold"
                style={{ 
                  color: config.primaryColor,
                  fontFamily: config.fontFamily 
                }}
              >
                {config.title}
              </h4>
              <Bell 
                className="h-4 w-4" 
                style={{ color: config.primaryColor }} 
              />
            </div>

            {config.showAlerts && alerts.length > 0 && (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-2">
                    <AlertCircle className={`h-4 w-4 mt-0.5 ${
                      alert.level === 'Critical' ? 'text-red-500' : 'text-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {config.showPredictions && predictions.length > 0 && (
              <div className="space-y-2">
                {predictions.map((prediction) => (
                  <div key={prediction.id} className="flex items-start gap-2">
                    <Badge 
                      className="text-xs"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      {prediction.probability}%
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{prediction.title}</p>
                      {config.showScripture && prediction.biblicalReference && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          {prediction.biblicalReference}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button 
              size="sm" 
              className="w-full"
              style={{ 
                backgroundColor: config.primaryColor,
                fontFamily: config.fontFamily
              }}
              onClick={handleClick}
            >
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
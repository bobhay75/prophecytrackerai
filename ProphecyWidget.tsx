import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Code2, 
  Smartphone, 
  Monitor, 
  Copy, 
  Check, 
  AlertCircle,
  Bell,
  Palette,
  Layout,
  Eye,
  Download
} from 'lucide-react';

interface WidgetConfig {
  title: string;
  theme: 'light' | 'dark' | 'auto';
  size: 'compact' | 'normal' | 'expanded';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  showPredictions: boolean;
  showAlerts: boolean;
  showScripture: boolean;
  updateFrequency: number;
  maxItems: number;
  primaryColor: string;
  fontFamily: string;
  language: string;
}

export function ProphecyWidget() {
  const [config, setConfig] = useState<WidgetConfig>({
    title: 'Daily Prophecy Alerts',
    theme: 'auto',
    size: 'normal',
    position: 'bottom-right',
    showPredictions: true,
    showAlerts: true,
    showScripture: true,
    updateFrequency: 30,
    maxItems: 5,
    primaryColor: '#7c3aed',
    fontFamily: 'system-ui',
    language: 'en'
  });

  const [embedCode, setEmbedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    generateEmbedCode();
  }, [config]);

  const generateEmbedCode = () => {
    const widgetUrl = `${window.location.origin}/widget`;
    const params = new URLSearchParams({
      title: config.title,
      theme: config.theme,
      size: config.size,
      position: config.position,
      predictions: config.showPredictions.toString(),
      alerts: config.showAlerts.toString(),
      scripture: config.showScripture.toString(),
      frequency: config.updateFrequency.toString(),
      items: config.maxItems.toString(),
      color: config.primaryColor.replace('#', ''),
      font: config.fontFamily,
      lang: config.language
    });

    const code = `<!-- End Times Tracker Widget -->
<div id="prophecy-widget-container"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${widgetUrl}/embed.js?${params.toString()}';
    script.async = true;
    script.onload = function() {
      window.ProphecyWidget.init({
        container: '#prophecy-widget-container',
        config: ${JSON.stringify(config, null, 2)}
      });
    };
    document.head.appendChild(script);
  })();
</script>
<!-- End of Widget -->`;

    setEmbedCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadWidgetCode = () => {
    const blob = new Blob([embedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prophecy-widget.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Prophecy Alert Widget Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="customize" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="customize">
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="embed">
                <Code2 className="h-4 w-4 mr-2" />
                Embed Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customize" className="space-y-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Widget Title</Label>
                  <Input
                    id="title"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    placeholder="Enter widget title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={config.theme}
                      onValueChange={(value) => setConfig({ ...config, theme: value as WidgetConfig['theme'] })}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select
                      value={config.size}
                      onValueChange={(value) => setConfig({ ...config, size: value as WidgetConfig['size'] })}
                    >
                      <SelectTrigger id="size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="expanded">Expanded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position (Mobile)</Label>
                  <Select
                    value={config.position}
                    onValueChange={(value) => setConfig({ ...config, position: value as WidgetConfig['position'] })}
                  >
                    <SelectTrigger id="position">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content Settings</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="predictions">Show Predictions</Label>
                    <Switch
                      id="predictions"
                      checked={config.showPredictions}
                      onCheckedChange={(checked) => setConfig({ ...config, showPredictions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="alerts">Show Global Alerts</Label>
                    <Switch
                      id="alerts"
                      checked={config.showAlerts}
                      onCheckedChange={(checked) => setConfig({ ...config, showAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="scripture">Show Scripture References</Label>
                    <Switch
                      id="scripture"
                      checked={config.showScripture}
                      onCheckedChange={(checked) => setConfig({ ...config, showScripture: checked })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Update Frequency (minutes)</Label>
                    <Input
                      id="frequency"
                      type="number"
                      min="5"
                      max="60"
                      value={config.updateFrequency}
                      onChange={(e) => setConfig({ ...config, updateFrequency: parseInt(e.target.value) || 30 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="items">Max Items to Show</Label>
                    <Input
                      id="items"
                      type="number"
                      min="1"
                      max="10"
                      value={config.maxItems}
                      onChange={(e) => setConfig({ ...config, maxItems: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                </div>
              </div>

              {/* Styling */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Styling</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color"
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        placeholder="#7c3aed"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font">Font Family</Label>
                    <Select
                      value={config.fontFamily}
                      onValueChange={(value) => setConfig({ ...config, fontFamily: value })}
                    >
                      <SelectTrigger id="font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system-ui">System Default</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Widget Preview</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile
                  </Button>
                </div>
              </div>

              <div className={`border rounded-lg bg-gray-50 dark:bg-gray-900 p-4 ${
                previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
              }`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold" style={{ color: config.primaryColor }}>
                      {config.title}
                    </h4>
                    <Bell className="h-4 w-4" style={{ color: config.primaryColor }} />
                  </div>

                  {config.showAlerts && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Critical: Earthquake Warning</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Turkey/Syria Border - Major activity detected
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {config.showPredictions && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge className="text-xs" style={{ backgroundColor: config.primaryColor }}>
                          78%
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm">Economic instability in emerging markets</p>
                          {config.showScripture && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                              Revelation 18:17
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    size="sm" 
                    className="w-full"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    View All Alerts
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="embed" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Embed Code</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadWidgetCode}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={embedCode}
                  readOnly
                  className="font-mono text-sm"
                  rows={15}
                />

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Installation Instructions
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li>Copy the embed code above</li>
                    <li>Paste it into your website's HTML where you want the widget to appear</li>
                    <li>The widget will automatically load and update based on your settings</li>
                    <li>For WordPress: Use a Custom HTML block or widget</li>
                    <li>For mobile apps: Use a WebView component with the widget URL</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Direct Widget URL</h4>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}/widget?${new URLSearchParams({
                        config: btoa(JSON.stringify(config))
                      }).toString()}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const url = `${window.location.origin}/widget?${new URLSearchParams({
                          config: btoa(JSON.stringify(config))
                        }).toString()}`;
                        window.open(url, '_blank');
                      }}
                    >
                      Test
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">WordPress Plugin</h4>
              <p className="text-sm text-muted-foreground">
                Download our WordPress plugin for easy integration
              </p>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Plugin
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">React Component</h4>
              <p className="text-sm text-muted-foreground">
                NPM package for React applications
              </p>
              <Button size="sm" variant="outline">
                <Code2 className="h-4 w-4 mr-2" />
                View on NPM
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">iOS Widget</h4>
              <p className="text-sm text-muted-foreground">
                Native iOS widget for iPhone and iPad
              </p>
              <Button size="sm" variant="outline">
                <Smartphone className="h-4 w-4 mr-2" />
                App Store
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Android Widget</h4>
              <p className="text-sm text-muted-foreground">
                Native Android widget for all devices
              </p>
              <Button size="sm" variant="outline">
                <Smartphone className="h-4 w-4 mr-2" />
                Google Play
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
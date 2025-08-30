import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Image as ImageIcon, Download, Share2, Sparkles, Zap } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
}

export function ViralGraphicsGenerator() {
  const [generatingGraphic, setGeneratingGraphic] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<{
    imageUrl: string;
    description: string;
    newsTitle: string;
  } | null>(null);

  const { data: news, isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
    refetchInterval: 30000,
  });

  const generateViralGraphic = async (newsItem: NewsItem) => {
    setGeneratingGraphic(true);
    try {
      console.log('Generating viral graphic for:', newsItem.title);
      
      const response = await fetch('/api/generate-viral-graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId: newsItem.id })
      });
      
      if (response.ok) {
        const graphic = await response.json();
        console.log('Graphic generated successfully:', graphic);
        
        setLastGenerated({
          imageUrl: graphic.imageUrl,
          description: graphic.description,
          newsTitle: newsItem.title
        });
        
        // Show success alert
        alert(`🔥 Viral graphic generated successfully!\n\nNews: ${newsItem.title}\n\nThe graphic is now displayed below and ready for download and sharing.`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate graphic');
      }
    } catch (error) {
      console.error('Error generating viral graphic:', error);
      alert(`Error generating viral graphic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGeneratingGraphic(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading latest news for graphic generation...</p>
        </CardContent>
      </Card>
    );
  }

  const latestNews = news?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Viral Graphics Generator
          </CardTitle>
          <CardDescription>
            Generate compelling social media graphics from breaking news using AI
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Generated Graphic Display */}
      {lastGenerated && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <ImageIcon className="h-5 w-5" />
              Generated Viral Graphic
            </CardTitle>
            <CardDescription>
              <strong>News:</strong> {lastGenerated.newsTitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <img 
                src={lastGenerated.imageUrl} 
                alt="Generated Viral Graphic"
                className="max-w-full h-auto rounded-lg border shadow-lg mx-auto"
                style={{ maxHeight: '500px' }}
              />
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => window.open(lastGenerated.imageUrl, '_blank')}
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
              <Button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'End Times Tracker - Viral Graphic',
                      text: lastGenerated.newsTitle,
                      url: lastGenerated.imageUrl
                    });
                  } else {
                    navigator.clipboard.writeText(lastGenerated.imageUrl);
                    alert('Image URL copied to clipboard!');
                  }
                }}
                variant="outline"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Pro tip:</strong> This graphic is optimized for social media sharing and will grab attention with its professional design and urgent messaging.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* News Items for Graphic Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Breaking News</CardTitle>
          <CardDescription>
            Select a news story to generate a viral graphic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {latestNews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No news items available for graphic generation
            </p>
          ) : (
            latestNews.map((newsItem) => (
              <div key={newsItem.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{newsItem.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {newsItem.summary}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{newsItem.source}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(newsItem.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => generateViralGraphic(newsItem)}
                  disabled={generatingGraphic}
                  className="shrink-0"
                >
                  {generatingGraphic ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Generate Graphic
                    </>
                  )}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <strong>How it works:</strong> Our AI creates dramatic, shareable graphics from news headlines. Each graphic includes bold typography, urgent colors, and professional branding perfect for social media engagement.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default ViralGraphicsGenerator;
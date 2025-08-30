import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Search, 
  Users, 
  Eye, 
  Globe, 
  BookOpen, 
  Target, 
  Zap,
  AlertTriangle,
  Clock,
  MessageSquare
} from 'lucide-react';

interface TransparencyIdea {
  id: number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'technology' | 'community' | 'verification' | 'distribution';
  icon: any;
  actionable: boolean;
}

export function TruthTransparencyIdeas() {
  const ideas: TransparencyIdea[] = [
    {
      id: 1,
      title: 'Real-Time Source Cross-Verification',
      description: 'Automatically cross-reference each story across multiple independent sources and show verification status',
      impact: 'high',
      difficulty: 'medium',
      category: 'verification',
      icon: Shield,
      actionable: true
    },
    {
      id: 2,
      title: 'Community Fact-Check Network',
      description: 'Allow users to submit evidence, sources, and verification for stories in real-time',
      impact: 'high',
      difficulty: 'easy',
      category: 'community',
      icon: Users,
      actionable: true
    },
    {
      id: 3,
      title: 'Underground News Aggregator',
      description: 'Systematically monitor independent journalists, whistleblowers, and alternative media',
      impact: 'high',
      difficulty: 'medium',
      category: 'distribution',
      icon: Globe,
      actionable: true
    },
    {
      id: 4,
      title: 'Anonymous Tip Submission Portal',
      description: 'Secure, encrypted portal for whistleblowers and insiders to submit information',
      impact: 'medium',
      difficulty: 'hard',
      category: 'technology',
      icon: Eye,
      actionable: false
    },
    {
      id: 5,
      title: 'AI-Powered Bias Detection',
      description: 'Use AI to analyze language patterns and detect potential bias or manipulation in news articles',
      impact: 'medium',
      difficulty: 'hard',
      category: 'technology',
      icon: Search,
      actionable: false
    },
    {
      id: 6,
      title: 'Timeline Contradiction Tracker',
      description: 'Track how stories change over time and highlight contradictions in official narratives',
      impact: 'high',
      difficulty: 'medium',
      category: 'verification',
      icon: Clock,
      actionable: true
    },
    {
      id: 7,
      title: 'Direct Source Video Integration',
      description: 'Embed raw footage, leaked documents, and primary sources directly in news stories',
      impact: 'high',
      difficulty: 'easy',
      category: 'distribution',
      icon: Target,
      actionable: true
    },
    {
      id: 8,
      title: 'Prediction Accuracy Tracking',
      description: 'Track which sources consistently report accurate information before mainstream adoption',
      impact: 'medium',
      difficulty: 'medium',
      category: 'verification',
      icon: Zap,
      actionable: true
    },
    {
      id: 9,
      title: 'Emergency Truth Alerts',
      description: 'Push notifications for breaking stories that contradict mainstream narratives',
      impact: 'high',
      difficulty: 'easy',
      category: 'distribution',
      icon: AlertTriangle,
      actionable: true
    },
    {
      id: 10,
      title: 'Local Citizen Journalist Network',
      description: 'Connect with on-ground reporters and citizen journalists for firsthand accounts',
      impact: 'medium',
      difficulty: 'medium',
      category: 'community',
      icon: MessageSquare,
      actionable: true
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  const [generatingGraphic, setGeneratingGraphic] = useState<number | null>(null);

  const implementIdea = async (idea: TransparencyIdea) => {
    if (idea.id === 9) { // Social Media Graphics
      await generateViralGraphics();
    } else if (idea.actionable) {
      alert(`Ready to implement: ${idea.title}\n\n${idea.description}\n\nThis feature can be built and deployed immediately!`);
    } else {
      alert(`Future Implementation: ${idea.title}\n\n${idea.description}\n\nThis requires additional planning and resources.`);
    }
  };

  const generateViralGraphics = async () => {
    setGeneratingGraphic(9);
    try {
      // Get latest news item for graphic generation
      const response = await fetch('/api/news?limit=1');
      const news = await response.json();
      
      if (news && news.length > 0) {
        const latestNews = news[0];
        
        // Generate viral graphic
        const graphicResponse = await fetch('/api/generate-viral-graphic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newsId: latestNews.id })
        });
        
        if (graphicResponse.ok) {
          const graphic = await graphicResponse.json();
          
          // Show the generated graphic in a new window
          const newWindow = window.open('', '_blank', 'width=800,height=900');
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head><title>Generated Viral Graphic - End Times Tracker</title></head>
                <body style="margin:0;padding:20px;background:#000;color:#fff;font-family:Arial,sans-serif;text-align:center;">
                  <h2>🔥 Viral Graphic Generated Successfully!</h2>
                  <p><strong>News:</strong> ${latestNews.title}</p>
                  <img src="${graphic.imageUrl}" style="max-width:100%;height:auto;border-radius:8px;margin:20px 0;" alt="Generated Viral Graphic"/>
                  <p><em>${graphic.description}</em></p>
                  <div style="margin-top:20px;">
                    <a href="${graphic.imageUrl}" download="viral-graphic.png" style="background:#0066cc;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Download Image</a>
                  </div>
                </body>
              </html>
            `);
          }
        } else {
          throw new Error('Failed to generate graphic');
        }
      } else {
        throw new Error('No news items available');
      }
    } catch (error) {
      console.error('Error generating viral graphic:', error);
      alert('Error generating viral graphic. Please try again.');
    } finally {
      setGeneratingGraphic(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span>Truth Transparency Enhancement Ideas</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Strategic approaches to keep people informed about behind-the-scenes happenings
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => {
          const IconComponent = idea.icon;
          return (
            <Card key={idea.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                  <div className="flex space-x-1">
                    <Badge variant="outline" className={getImpactColor(idea.impact)}>
                      {idea.impact} impact
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(idea.difficulty)}>
                      {idea.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-sm font-semibold leading-tight">
                  {idea.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-4 line-clamp-3">
                  {idea.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {idea.category}
                  </Badge>
                  
                  <Button
                    size="sm"
                    variant={idea.actionable ? "default" : "outline"}
                    className={idea.actionable ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                    onClick={() => implementIdea(idea)}
                  >
                    {idea.actionable ? "🚀 Ready" : "🔮 Future"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-green-600" />
            <span>Immediate Action Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Phase 1: Enhanced Underground Sources</h4>
                <p className="text-xs text-muted-foreground">Add more independent journalists and alternative news sources with real-time monitoring</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Phase 2: Source Verification System</h4>
                <p className="text-xs text-muted-foreground">Implement cross-referencing and verification badges for all news sources</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Phase 3: Community Truth Network</h4>
                <p className="text-xs text-muted-foreground">Enable user-contributed evidence and community-driven fact-checking</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
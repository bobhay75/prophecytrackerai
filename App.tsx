import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import GlobalMap from "@/pages/GlobalMap";
import ProphecyMatches from "@/pages/ProphecyMatches";
import NewsFeed from "@/pages/NewsFeed";
import Community from "@/pages/Community";
import AIInsights from "@/pages/AIInsights";
import CrisisResponse from "@/pages/CrisisResponse";
import LiveProphets from "@/pages/LiveProphets";
import PredictionMarkets from "@/pages/PredictionMarkets";
import ProphetVerification from "@/pages/ProphetVerification";
import SocialHub from "@/pages/SocialHub";
import { NextGenDashboard } from "@/components/NextGenDashboard";
import { BlockchainVerification } from "@/components/BlockchainVerification";

import { APIEconomy } from "@/components/APIEconomy";
import { RealHumanAIVideo } from "@/components/RealHumanAIVideo";
import { PredictionMarketplace } from "@/components/PredictionMarketplace";

import UndergroundNews from "@/pages/UndergroundNews";
import EarthquakeWatch from "@/pages/EarthquakeWatch";
import SpaceWeatherWatch from "@/pages/SpaceWeatherWatch";
import PropheticLibrary from "@/pages/PropheticLibrary";
import WidgetBuilder from "@/pages/WidgetBuilder";
import Widget from "@/pages/Widget";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MetaMaskProvider } from "@/components/MetaMaskProvider";
import { AdminRoute } from "@/components/AdminRoute";
import AIProphetChatPage from "@/pages/AIProphetChatPage";
import LiveStreamPage from "@/pages/LiveStreamPage";
import PropheticCountdownPage from "@/pages/PropheticCountdownPage";
import NotFound from "@/pages/not-found";
import Web3Login from "@/components/Web3Login";
import WelcomeGuide from "@/components/WelcomeGuide";
import ViralFeatures from "@/components/ViralFeatures";
import PWANotifications from "@/components/PWANotifications";
import ViralGraphicsGenerator from "@/components/ViralGraphicsGenerator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/crisis-response" component={CrisisResponse} />
      <Route path="/live-prophets" component={LiveProphets} />
      <Route path="/prediction-markets" component={PredictionMarkets} />
      <Route path="/prophet-verification" component={ProphetVerification} />
      <Route path="/social-hub" component={SocialHub} />
      <Route path="/global-map" component={GlobalMap} />
      <Route path="/prophecy-matches" component={ProphecyMatches} />
      <Route path="/news-feed" component={NewsFeed} />
      <Route path="/community" component={Community} />
      <Route path="/ai-insights" component={AIInsights} />
      <Route path="/ai-dashboard" component={NextGenDashboard} />

      <Route path="/blockchain" component={BlockchainVerification} />
      <Route path="/api-economy" component={APIEconomy} />
      <Route path="/ai-video" component={RealHumanAIVideo} />
      <Route path="/prediction-marketplace" component={PredictionMarketplace} />
      <Route path="/arvr" component={() => (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">AR/VR Biblical Experiences</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Virtual Temple Tours</h3>
                <p className="mb-4">Experience biblical temples in immersive 3D</p>
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">Launch Experience</button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Prophecy Visualizations</h3>
                <p className="mb-4">See prophetic visions come to life in AR</p>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Start Vision</button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Biblical Locations</h3>
                <p className="mb-4">Walk through ancient biblical sites</p>
                <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded">Explore Now</button>
              </div>
            </div>
          </div>
        </div>
      )} />
      <Route path="/underground-news" component={UndergroundNews} />
      <Route path="/earthquake-watch" component={EarthquakeWatch} />
      <Route path="/space-weather" component={SpaceWeatherWatch} />
      <Route path="/prophetic-library" component={PropheticLibrary} />
      <Route path="/widget-builder" component={WidgetBuilder} />
      <Route path="/widget" component={Widget} />
      <Route path="/ai-chat" component={() => <AIProphetChatPage />} />
      <Route path="/live-streams" component={() => <LiveStreamPage />} />
      <Route path="/prophetic-countdown" component={() => <PropheticCountdownPage />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MetaMaskProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </MetaMaskProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

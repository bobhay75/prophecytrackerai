export interface AppStats {
  id: number;
  activeConflicts: number;
  prophecyMatches: number;
  newsUpdates: number;
  communityUsers: number;
  updatedAt: Date;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content?: string;
  source: string;
  url?: string;
  category: string;
  priority: string;
  publishedAt: Date;
  createdAt: Date;
}

export interface ProphecyMatch {
  id: number;
  newsItemId?: number;
  prophecyText: string;
  scripture: string;
  confidence: number;
  analysis: string;
  tradition: string;
  createdAt: Date;
}

export interface GlobalEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude?: string;
  longitude?: string;
  eventType: string;
  severity: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Discussion {
  id: number;
  author: string;
  content: string;
  replies: number;
  createdAt: Date;
}

export interface PrayerRequest {
  id: number;
  content: string;
  author: string;
  prayerCount: number;
  createdAt: Date;
}

export type Tradition = "christian" | "jewish" | "islamic" | "buddhist" | "all";

export interface UserPreferences {
  tradition: Tradition;
  theme: "light" | "dark";
  notifications: boolean;
}

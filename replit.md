# End Times Tracker

## Overview

End Times Tracker is a full-stack web application that monitors global events, correlates them with religious prophecies using AI analysis, and presents findings through an interactive dashboard. Its purpose is to aggregate news, analyze prophetic significance, and offer features like real-time global event tracking, AI-powered prophecy matching, community interaction, and premium subscriptions. The project aims to be a definitive platform in the unique intersection of biblical prophecy, AI, and blockchain technology, with strong monetization potential through diverse revenue streams.

## User Preferences

Preferred communication style: Simple, everyday language.
Development focus: Solo founder managing both development and business operations.
Funding preference: Automated/templated applications to minimize time investment.
Priority: Complete ready-to-submit grant applications and partnership outreach.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS with CSS variables
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Theme**: Dark/light mode support

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API (JSON responses)
- **Middleware**: Custom logging, error handling
- **Development**: Hot module replacement with Vite

### Database
- **ORM**: Drizzle ORM (TypeScript-first)
- **Database**: PostgreSQL
- **Migration**: Drizzle Kit
- **Schema**: Centralized definitions

### Key Components & Features
- **Core Data Models**: Users, News Items, Prophecy Matches, Global Events, App Stats.
- **AI Integration**: OpenAI GPT-4o for prophecy analysis using a curated biblical prophecy database, automated news analysis, and confidence scoring.
- **News Aggregation**: RSS feeds (Reuters, BBC, NPR, Time, Washington Post) with real-time parsing, categorization, and priority scoring.
- **User Interface**: Dashboard, interactive World Map, News Feed, Prophecy Matches display, Community Features (forums, prayer requests), and Premium Modal.
- **Monetization**: Individual, group, and ministry subscriptions; cryptocurrency and PayPal donations; prophecy betting (Web3); API marketplace; widget licensing; AI video generation services.
- **Advanced Features**: AI Prophet Companion Chat (24/7 biblical Q&A), Live Stream Hub, Prophetic Countdown Timers, Voice Interaction, MetaMask crypto donations, customizable Widget Builder, NASA Space Weather Monitoring (Wormwood detection), NOAA/USGS Earthquake Monitoring, Prophetic Library, Underground Truth Hub (alternative news sources), and Prophecy Fulfillment Tracker (faith-based).

## External Dependencies

- **Database Connection**: @neondatabase/serverless
- **ORM**: drizzle-orm, drizzle-kit
- **AI**: OpenAI API
- **HTTP Client**: Axios
- **RSS Parsing**: rss-parser
- **Date Handling**: date-fns
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Styling**: Tailwind CSS, class-variance-authority
- **Forms**: React Hook Form, Zod
- **State Management**: TanStack React Query
- **Build**: Vite, React plugin, PostCSS, Autoprefixer
- **Development Utilities**: tsx, esbuild
- **Payment Processing**: Stripe
- **Cryptocurrency Integration**: MetaMask SDK
- **Mapping**: Google Maps API
- **Video Playback**: YouTube API
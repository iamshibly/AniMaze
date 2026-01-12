<div align="center">

![AniMaze Logo](public/mainlogo.png)

# AniMaze 🎌✨  
### Bangladesh's First AI-Powered Anime & Manga Platform  
**ANIME. MANGA. INNOVATION.** — *Built for otakus, by otakus.*  

[![Vite](https://img.shields.io/badge/Vite-React-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<p>
  <a href="#-the-problem-we-solve">Problem</a> •
  <a href="#-what-makes-animaze-different">What's Different</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-testing">Testing</a> •
  <a href="#-team">Team</a>
</p>

---

</div>
---

## Overview
**AniMaze** is a modern anime & manga platform designed for Bangladesh with:
- **English/Bangla UI**
- **Smart search** (typo correction + fuzzy matching)
- **AI-powered quizzes** (DeepSeek via OpenRouter) + leaderboard + XP
- **Role-based dashboards** (User / Admin / Critic)
- **Subscription + badges** (XP redemption + planned local payments)
- **PDF Manga library** (offline reading-ready)

> AniMaze is designed to integrate **metadata and content info via external APIs** and does not aim to illegally host copyrighted anime/manga.

---

## Features

### 🎬 Anime Discovery
- Browse trending & popular anime sections
- Multi-filter discovery (genre/year/studio/status)
- Anime details page

### 📚 Manga + PDF Library
- Manga browsing + details
- PDF manga collection inside `public/` for offline-style reading

### 🔎 Smart Search
- Typo correction + fuzzy matching + semantic/synonym expansions for anime & manga search.

### 🧠 AI Quiz + Gamification
- Quiz generation endpoint supports:
  - Difficulty: `easy | medium | hard`
  - Topic: `general` or a custom topic (e.g. “naruto”)
- XP gained from score + perfect-score bonus
- Leaderboard (ranked by score & XP)

### 🛡️ Role-Based Experience
- **User**: dashboard, watchlist, bookmarks, notifications, profile settings
- **Admin**: dashboard, user management, quizzes/content moderation
- **Critic**: submit content, track submissions, profile settings

### 🌗 Themes + 🌍 Language
- Themes: `light | dark | neon`
- Language toggle: `en | bn`

---

## Tech Stack

### Frontend
- **Vite + React + TypeScript**
- **TailwindCSS** + shadcn/ui + Radix UI
- **TanStack Query** for data fetching/caching
- React Router for routing
- Framer Motion for animations

### Backend (Anime Quiz API)
- **Node.js + Express**
- **SQLite** database (`quiz.db`)
- AI integration via **OpenRouter** (DeepSeek model)
- Security & stability middleware:
  - `helmet`, `compression`, `cors`
  - `express-rate-limit`
  - `express-validator`

---
## 🎯 The Problem We Solve

### Why AniMaze Exists

Bangladeshi anime fans face **four critical barriers** that AniMaze was built to eliminate:

#### 💸 **Affordability Crisis**
- **International subscriptions are unrealistic:** Crunchyroll Premium ($12/mo = ৳1,400), Netflix Anime ($17/mo = ৳2,000), Funimation ($8/mo = ৳950) — these prices don't work for most Bangladeshi students and fans
- **AniMaze solution:** Starting at **৳50/month** with the revolutionary option to **earn premium access through engagement** (quizzes, reviews, XP accumulation) — **60-80% cheaper** than competitors

#### 🔒 **Access Fragmentation**
- Fans juggle 5-10 different sites for anime, manga, news, and community — no unified experience
- **AniMaze solution:** Single hub for anime streaming, manga reading, PDF collections, AI quizzes, news aggregation, and community features

#### 🌐 **Localization Gap**
- Global platforms lack Bangla interfaces, local payment methods, and BDT pricing
- **AniMaze solution:** Full **Bangla/English UI**, integrated **bKash, Nagad, Rocket, Upay** payments, culturally relevant community features

#### 🏴‍☠️ **Piracy Pressure**
- When legal options are expensive and inconvenient, piracy becomes the default
- **AniMaze solution:** Provides a **legal, high-quality alternative** that's genuinely affordable and accessible, making piracy unnecessary

---

## 🌟 What Makes AniMaze Different

### 🇧🇩 **Bangladesh-First Design Philosophy**

AniMaze isn't a "global platform localized for Bangladesh" — it's **built from the ground up for Bangladeshi otakus**.

#### 🎮 **Hybrid Monetization Revolution**
```
Traditional Model:          AniMaze Model:
Pay ৳1,500/month    →      ৳50-1,500/month OR earn through engagement
No alternatives     →      Premium access via XP redemption
                           Quiz participation = Badge unlocking
                           Community engagement = Free premium
```

**Four Badge Tiers:**
- 🥉 **Bronze Guardian:** ৳200/month or 7,000 XP
- 🥈 **Silver Champion:** ৳500/3 months or 12,500 XP *(Most Popular)*
- 🥇 **Gold Master:** ৳1,000/6 months or 25,000 XP
- 💎 **Diamond Legend:** ৳1,500/year — Premium tier

#### 🤖 **AI-Powered Intelligence**

**DeepSeek R1 Integration** powers:
- **Dynamic Quiz Generation:** Real-time question creation across hundreds of anime/manga series
- **Adaptive Difficulty:** Questions adjust to user performance (Easy → Medium → Hard)
- **7 Question Types:** MCQ, True/False, Typing, Image Recognition, Fill-in-the-blank, Sequencing, Character Matching
- **Educational Approach:** Each answer includes detailed explanations
- **Quality Controls:** Prompt engineering + validation layers + user feedback loops

#### 📚 **Multi-API Content Aggregation**

**Zero copyright hosting** — all content pulled through licensed APIs:
- **AniList GraphQL** — Comprehensive anime metadata
- **MangaDex** — Manga chapters and reading progress
- **Jikan** — MyAnimeList data integration
- **Consumet** — Streaming links and episode tracking
- **Anime News Network + Crunchyroll News** — Industry updates

**Why this matters:** Legal compliance + broad catalog + automatic updates

#### 🔍 **Smart Discovery Engine**

**Typo-Tolerant Search:**
```javascript
Search: "narot"      →  Finds: "Naruto"
Search: "atack tita" →  Finds: "Attack on Titan"
Search: "one pice"   →  Finds: "One Piece"
```

**Powered by Fuse.js fuzzy logic** with multi-filter panels (genre, year, studio, author, status, rating)

#### 👥 **Three-Role Architecture**

| Role | Capabilities | Purpose |
|------|--------------|---------|
| **Viewer** | Watch anime, read manga, take quizzes, earn XP, manage watchlist/bookmarks | Core user experience |
| **Critic** | Submit reviews/vlogs with rich-text editor, track approval status, view engagement analytics | Community content creation |
| **Admin** | Moderate content, manage users, configure XP/badges, view revenue analytics, system oversight | Platform management |

---

## ✨ Features

### 🎬 **Anime Streaming**

<details>
<summary><b>Core Capabilities</b></summary>

- **Cinematic Hero Section** — Dynamic trending anime showcase with trailers
- **Smart Search + Filters** — Typo-tolerant discovery with genre/year/studio/status filters
- **Resume Playback** — Continue watching from last position across devices
- **Adaptive Quality** — 360p, 480p, 720p, 1080p streaming
- **Watchlist Management** — Save favorites, track episodes, rate content
- **Episode Tracking** — Automatic progress synchronization

</details>

### 📖 **Manga Reading**

<details>
<summary><b>Reading Experience</b></summary>

- **Featured Collage Hero** — Trending manga discovery
- **Semantic Search** — AI-powered search with typo tolerance
- **Multi-Filter Panel** — Author, type, genre, year filtering
- **Progress Tracker** — Automatic reading progress across devices
- **Chapter Bookmarking** — Save favorite pages and chapters
- **PDF Collection** — Offline manga library (Attack on Titan, Dragon Ball, Bleach)
  - 4 Total Titles | 627 Pages | 91.7 MB | ★8.6 Average Rating

</details>

### 🧠 **AI Quiz System**

<details>
<summary><b>Gamification Engine</b></summary>

**Quiz Generation:**
- **AI-Powered Questions** via DeepSeek R1 API
- **7 Question Types:** MCQ, True/False, Typing, Image-based, Fill-in-blank, Sequencing, Character Matching
- **Adaptive Difficulty:** Questions adjust to performance
- **Timed Challenges:** 30s (Easy), 45s (Medium), 60s (Hard) per question

**XP & Progression:**
- **Earn 20-200 XP** per quiz (difficulty-based)
- **Bonus XP:** +50 for perfect scores
- **Global Leaderboard** with medal rankings (🥉🥈🥇💎)
- **XP Redemption:** Convert XP to badge tiers

**Quality Features:**
- Detailed explanations for each answer
- Real-time feedback
- Performance analytics
- Quiz history tracking

</details>

### 💎 **Subscription System**

<details>
<summary><b>Monetization & Access</b></summary>

**Dual Redemption Paths:**
1. **XP Redemption** — Earn premium through engagement
2. **Direct Payment** — Local mobile payment gateways

**Payment Integration:**
- ✅ bKash
- ✅ Nagad
- ✅ Rocket
- ✅ Upay

**Badge Benefits (Progressive Unlock):**
- ✅ Ad-free streaming
- ✅ Full manga library
- ✅ Offline downloads
- ✅ Priority notifications
- ✅ Exclusive content access
- ✅ Custom themes

</details>

### 📰 **News Aggregation**

<details>
<summary><b>Industry Updates</b></summary>

- **Live News Feeds** from Anime News Network + Crunchyroll
- **Weekly Highlights** section
- **Critic Reviews & Vlogs** — Community editorial content
- **Card-based Layout** with featured stories
- **Search & Filter** by topic/date

</details>

### 🎨 **Critic Studio**

<details>
<summary><b>Content Creation Workflow</b></summary>

**Submission Types:**
1. **Anime Review** (300+ words)
2. **Manga Review** (300+ words)
3. **Episode Review** (200+ words)
4. **Video Content** (YouTube links with summaries)

**Dashboard Features:**
- Submission status tracking (Pending/Approved/Rejected)
- Engagement metrics (views, likes, comments)
- Performance analytics
- Approval notifications

**Admin Moderation:**
- Review submissions queue
- Approve/reject workflow
- Feedback to critics
- Content quality monitoring

</details>

### 🛡️ **Admin Control Center**

<details>
<summary><b>Platform Management</b></summary>

**Analytics Dashboard:**
- 📊 1,238 Total Users (+12.4%)
- 👥 5,456 Active Users
- 💰 ৳895K MTD Revenue (+18.4% YTD)
- 📈 ৳8,672 ARPU
- 📉 3.2% Churn Rate (-0.8%)
- ⏱️ 99.97% Uptime | 1.42s Load Time

**Management Tools:**
- User account oversight (suspend/delete)
- Critic content moderation
- XP threshold configuration
- Badge tier management
- Revenue logs & transaction history
- System health monitoring
- Platform-wide notifications

</details>

---

## 🏗️ Tech Stack

### **Frontend Architecture**
```
React 18 + TypeScript (Vite)
├── Styling: Tailwind CSS + shadcn/ui
├── Icons: Lucide React
├── Routing: React Router v6
├── State: React Context + Hooks
├── Forms: React Hook Form + Zod
├── API: Axios + TanStack Query
└── Themes: Light/Dark/Neon + Custom
```

### **Backend Infrastructure** *(Designed Architecture)*
```
Python Flask REST API
├── Database: MongoDB (NoSQL)
├── Caching: Redis
├── Authentication: JWT + Email OTP
├── File Storage: Cloud CDN
└── Real-time: WebSocket notifications
```

### **Current Implementation** *(Academic Project)*
```
Node.js Express Server (backend/server.js)
├── Database: SQLite (quiz.db)
├── AI: OpenRouter API (DeepSeek)
├── Security: Helmet + CORS + Rate Limiting
├── Validation: Express-validator
└── Compression: Response compression
```

### **External Integrations**

| Service | Purpose | Status |
|---------|---------|--------|
| **AniList GraphQL** | Anime metadata | ✅ Integrated |
| **MangaDex** | Manga chapters | ✅ Integrated |
| **Jikan** | MyAnimeList data | ✅ Integrated |
| **Consumet** | Streaming links | ✅ Integrated |
| **DeepSeek R1** | AI quiz generation | ✅ Integrated |
| **bKash/Nagad/Rocket/Upay** | Local payments | 🔄 Designed |
| **Anime News Network** | News feeds | 🔄 Designed |

---

## 🚀 Getting Started

### **Prerequisites**

```bash
Node.js 18+
npm or bun
Git
```

### **Quick Start**

#### **1. Clone Repository**
```bash
git clone https://github.com/your-username/animaze.git
cd animaze
```

#### **2. Install Dependencies**
```bash
# Install everything (frontend + backend)
npm run setup

# Or install separately:
npm install              # Frontend
cd backend && npm install # Backend
```

#### **3. Environment Configuration**

**Frontend** (`.env` in root):
```env
# Optional: If using Supabase authentication
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000
```

**Backend** (`backend/.env`):
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# AI Integration (Required for quiz generation)
OPENROUTER_API_KEY=your_openrouter_key_here
DEEPSEEK_MAX_TOKENS=2000
DEEPSEEK_TEMPERATURE=0.7

# Database
DB_PATH=./quiz.db

# Optional
HTTP_REFERER=http://localhost:5000
FRONTEND_URL=http://localhost:8080
```

**🔑 Get OpenRouter API Key:**
1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up for free account
3. Generate API key in dashboard
4. Add to `backend/.env`

#### **4. Run Development Server**

**Option A: Run Everything Together** *(Recommended)*
```bash
npm run full-dev
```
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

**Option B: Run Separately**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run backend:dev
```

#### **5. Access Application**

```
🌐 Application:  http://localhost:8080
🔌 API Endpoints: http://localhost:5000
📊 API Status:    http://localhost:5000/api/status
💚 Health Check:  http://localhost:5000/health
```

### **First-Time Setup Checklist**

- [ ] Install Node.js 18+
- [ ] Clone repository
- [ ] Run `npm run setup`
- [ ] Create `backend/.env` with OpenRouter API key
- [ ] Run `npm run full-dev`
- [ ] Open http://localhost:8080
- [ ] Create test account (sign up)
- [ ] Try quiz generation (requires API key)

---

## 📁 Project Structure

```
animaze/
├── backend/                      # Node.js Express API
│   ├── server.js                 # Main server with AI integration
│   ├── quiz.db                   # SQLite database
│   ├── package.json
│   └── .env                      # Backend configuration
│
├── public/                       # Static assets
│   ├── avatars/                  # User avatar images (a.jpeg - z.jpeg)
│   ├── pdf cover/                # Manga cover images
│   ├── Attack-on-Titan-CH-001.pdf
│   ├── Dragon-Ball-1.pdf
│   ├── Shinigamis-Hollows.pdf
│   ├── mainlogo.png
│   └── F.mp4                     # Hero video background
│
├── src/
│   ├── components/               # React components
│   │   ├── admin/                # Admin dashboard components
│   │   │   └── PendingApprovals.tsx
│   │   ├── anime/                # Anime browsing UI
│   │   │   ├── AnimeFilters.tsx
│   │   │   ├── PopularAnimeSection.tsx
│   │   │   └── SearchEngine.ts
│   │   ├── auth/                 # Authentication UI
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── manga/                # Manga reading UI
│   │   │   ├── MangaFilters.tsx
│   │   │   ├── MangaSearchEngine.ts
│   │   │   └── PopularMangaSection.tsx
│   │   ├── quiz/                 # Quiz system
│   │   │   ├── APIStatusIndicator.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── QuizGameplay.tsx
│   │   │   ├── QuizResults.tsx
│   │   │   └── XPTracker.tsx
│   │   ├── subscription/         # Payment & badges
│   │   │   ├── PaymentModal.tsx
│   │   │   ├── SubscriptionIcon.tsx
│   │   │   └── XPRedemptionModal.tsx
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (40+ components)
│   │   └── user/
│   │       ├── NotificationDropdown.tsx
│   │       └── UserDropdown.tsx
│   │
│   ├── contexts/                 # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useCritique.ts
│   │   ├── useQuiz.ts
│   │   └── useUserProgress.ts
│   │
│   ├── lib/                      # Core services & utilities
│   │   ├── adminServices.ts      # Admin operations
│   │   ├── anilist.ts            # AniList API integration
│   │   ├── auth.ts               # Authentication logic
│   │   ├── quizAPI.ts            # Quiz generation API
│   │   ├── subscriptionService.ts
│   │   └── utils.ts
│   │
│   ├── pages/                    # Route pages
│   │   ├── admin/                # Admin routes
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   └── ...
│   │   ├── critique/             # Critic routes
│   │   │   ├── CritiqueDashboard.tsx
│   │   │   ├── SubmitContent.tsx
│   │   │   └── ...
│   │   ├── user/                 # User routes
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Watchlist.tsx
│   │   │   └── ...
│   │   ├── About.tsx
│   │   ├── Anime.tsx
│   │   ├── Manga.tsx
│   │   ├── Quiz.tsx
│   │   └── Subscription.tsx
│   │
│   ├── services/                 # External API services
│   │   ├── mangadexApi.ts
│   │   └── quizAPI.ts
│   │
│   ├── styles/                   # Global styles
│   │   ├── animations.css
│   │   └── quiz.css
│   │
│   ├── types/                    # TypeScript definitions
│   │   ├── critique.ts
│   │   ├── news.ts
│   │   ├── quiz.ts
│   │   └── subscription.ts
│   │
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # React entry point
│
├── .env                          # Frontend environment variables
├── .gitignore
├── package.json                  # Dependencies & scripts
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite bundler config
└── README.md
```

### **Key Directories**

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `backend/` | Express API server | `server.js`, `quiz.db` |
| `src/components/` | React UI components | Role-specific UI modules |
| `src/pages/` | Route pages | Admin/Critic/User dashboards |
| `src/lib/` | Core services | API integrations, auth logic |
| `public/` | Static assets | Avatars, PDFs, videos |

---

## 🌐 Application Routes

### **Public Routes**
```
/                    → Homepage with hero section
/anime               → Anime browsing & search
/anime/:id           → Anime details page
/manga               → Manga discovery
/manga/:id           → Manga reader
/pdf-manga           → PDF manga collection
/quiz                → Quiz difficulty selection
/quiz/:id            → Active quiz gameplay
/quiz/:id/results    → Quiz results & XP earned
/leaderboard         → Global rankings
/news                → Anime news feed
/news/:id            → Full news article
/about               → Platform information
/reviews             → Community reviews
/subscription        → Badge tiers & pricing
/login               → User authentication
/signup              → Account registration
```

### **User Routes** *(Requires Authentication)*
```
/user/dashboard      → Personal analytics
/user/profile        → Profile management
/user/watchlist      → Saved anime
/user/bookmarks      → Saved manga
/user/notifications  → User alerts
```

### **Admin Routes** *(Admin Only)*
```
/admin/login         → Admin authentication
/admin/dashboard     → Platform analytics
/admin/users         → User management
/admin/critics       → Critic oversight
/admin/content       → Content moderation
/admin/quizzes       → Quiz management
/admin/review-submissions → Pending approvals
```

### **Critic Routes** *(Critic Role)*
```
/critique            → Critic dashboard
/critique/submit     → Submit review/vlog
/critique/submissions → Submission history
/critique/profile    → Critic profile
```

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:5000
```

### **Endpoints**

#### **Health & Status**

<details>
<summary><code>GET /health</code> - System health check</summary>

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-13T10:30:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": 52428800,
    "heapTotal": 20971520,
    "heapUsed": 15728640
  },
  "database": "connected"
}
```
</details>

<details>
<summary><code>GET /api/status</code> - API feature status</summary>

**Response:**
```json
{
  "service": "Anime Quiz API",
  "version": "1.0.0",
  "status": "operational",
  "features": {
    "ai_integration": true,
    "database": true,
    "caching": true
  },
  "endpoints": {
    "quiz_generation": "/api/quiz",
    "submission": "/api/quiz/submit",
    "leaderboard": "/api/leaderboard",
    "user_stats": "/api/user/:id/stats"
  }
}
```
</details>

#### **Quiz Generation**

<details>
<summary><code>POST /api/quiz</code> - Generate AI quiz</summary>

**Request:**
```json
{
  "difficulty": "medium",
  "questionType": "multiple-choice",
  "topic": "naruto"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "quiz-medium-1705141800000",
    "difficulty": "medium",
    "questions": [
      {
        "id": "1",
        "question": "What is Naruto's signature technique?",
        "options": [
          "Rasengan",
          "Chidori",
          "Amaterasu",
          "Kamui"
        ],
        "correct": 0,
        "explanation": "The Rasengan is Naruto's signature jutsu, taught to him by Jiraiya."
      }
    ],
    "timeLimit": 300,
    "createdAt": "2025-01-13T10:30:00.000Z"
  },
  "metadata": {
    "generated_at": "2025-01-13T10:30:00.000Z",
    "ai_powered": true,
    "cached": false
  }
}
```

**Rate Limit:** 10 requests / 5 minutes

**Cache:** 1 hour per difficulty/topic combination
</details>

#### **Quiz Submission**

<details>
<summary><code>POST /api/quiz/submit</code> - Submit quiz results</summary>

**Request:**
```json
{
  "userId": "user_abc123",
  "quizId": "quiz-medium-1705141800000",
  "score": 4,
  "totalQuestions": 5,
  "timeTaken": 52,
  "difficulty": "medium",
  "correctAnswers": [1, 0, 2, 3, 1]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submissionId": 42,
    "xpGained": 90,
    "message": "Quiz results submitted successfully"
  }
}
```

**XP Calculation:**
```javascript
xp = score * 10 + (score === totalQuestions ? 50 : 0)
// 4 correct = 40 XP
// Perfect score bonus = +50 XP
```

**Rate Limit:** 5 requests / 1 minute
</details>

#### **Leaderboard**

<details>
<summary><code>GET /api/leaderboard</code> - Global rankings</summary>

**Parameters:**
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Example:** `/api/leaderboard?limit=10&offset=0`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "userId": "user_xyz789",
      "username": "User_xyz789",
      "totalScore": 450,
      "quizzesTaken": 45,
      "xp": 4500,
      "lastActive": "2025-01-13T09:15:00.000Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 10
  }
}
```
</details>

#### **User Statistics**

<details>
<summary><code>GET /api/user/:id/stats</code> - User performance data</summary>

**Example:** `/api/user/user_abc123/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "user_abc123",
      "username": "User_abc123",
      "total_score": 180,
      "quizzes_taken": 18,
      "xp": 1800,
      "last_active": "2025-01-13T10:30:00.000Z"
    },
    "recentSubmissions": [
      {
        "id": 25,
        "difficulty": "medium",
        "score": 4,
        "totalQuestions": 5,
        "timeTaken": 52,
        "submittedAt": "2025-01-13T10:00:00.000Z"
      }
    ],
    "averageScore": 80,
    "bestScore": 100
  }
}
```
</details>

#### **Admin Endpoints**

<details>
<summary><code>GET /api/stats</code> - Platform analytics (Admin)</summary>

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz_stats": {
      "total_submissions": 1250,
      "avg_score_percentage": 0.78,
      "unique_users": 342
    },
    "api_usage": [
      {
        "endpoint": "/quiz",
        "total_calls": 1580,
        "avg_response_time": 450,
        "successful_calls": 1542
      }
    ],
    "system": {
      "uptime": 86400,
      "memory": { /* memory stats */ },
      "ai_enabled": true,
      "cache_enabled": true
    }
  }
}
```

**🔒 Note:** This endpoint should be protected with admin authentication before production deployment.
</details>

<details>
<summary><code>POST /api/admin/clear-cache</code> - Clear expired cache</summary>

**Response:**
```json
{
  "success": true,
  "message": "Cleared 15 expired cache entries"
}
```

**🔒 Note:** Restrict to admin users only.
</details>

### **Rate Limits**

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 15 minutes |
| Quiz Generation | 10 requests | 5 minutes |
| Quiz Submission | 5 requests | 1 minute |

### **Error Responses**

```json
{
  "success": false,
  "error": "Error description",
  "details": [/* validation errors */],
  "timestamp": "2025-01-13T10:30:00.000Z"
}
```

**Common Status Codes:**
- `200` — Success
- `400` — Bad request / validation error
- `404` — Endpoint not found
- `429` — Rate limit exceeded
- `500` — Internal server error

---

## 🧪 Testing

### **Comprehensive Test Coverage**

The project includes extensive testing across all major modules to ensure reliability and functionality.

#### **Test Execution**

```bash
# Frontend tests
npm test

# Backend API tests
npm run test:api

# Full test suite
npm run test:full
```

### **Test Modules**

<details>
<summary><b>1. Authentication Module</b></summary>

| Test Case | Input | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Valid User Signup | Email, Password, Role, Avatar | Signup successful | ✅ OK |
| Invalid Email | `wrongmail@` | Signup unsuccessful | ❌ NOT OK |
| Weak Password | `12345` | Signup unsuccessful | ❌ NOT OK |

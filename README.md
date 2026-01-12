<div align="center">

# AniMaze 🎌✨  
### Next-Gen Anime & Manga Platform for Bangladesh 🇧🇩  
**ANIME. MANGA. INNOVATION.** — *Built for otakus, by otakus.*  

<p>
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#modules">Modules</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-report">Project Report</a>
</p>

<!-- Replace these later if you deploy -->
<!-- 🌐 Live Demo: https://your-demo-link -->
<!-- 🎥 Preview Video: https://your-video-link -->

![Vite](https://img.shields.io/badge/Vite-React-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-TBD-green)

</div>

---

## Overview
**AniMaze** is a role-based anime & manga platform designed to make anime culture **affordable, accessible, and localized for Bangladesh**—with **Bangla/English UI**, **smart search**, **AI-generated quizzes**, **XP progression**, **badges**, and **subscription options using local payment methods**.  

The platform supports three roles:
- **Viewer**: watches anime, reads manga, takes quizzes, earns XP, manages watchlist/bookmarks  
- **Critic**: submits reviews/vlogs with approval workflow  
- **Admin**: manages users, moderation, XP thresholds, badges, analytics, and revenue logs  

> The system is designed to integrate content through external APIs rather than hosting copyrighted material directly.  

---

## Features
### 🎬 Anime + 📚 Manga
- Trending hero sections + responsive browsing UI  
- Multi-filter discovery (genre/year/studio/status, etc.)
- Watchlist & favorites
- Manga reading + bookmarking + progress tracking  
- **PDF Manga Collection** for offline reading

### 🔎 Smart Discovery
- Typo-tolerant **fuzzy search** and filtering for anime/manga browsing  
- Optimized browsing experience for fast discovery  

### 🧠 AI Quiz + Gamification
- Multiple quiz types (MCQ, True/False, typing, image-based)
- **AI-generated questions** (DeepSeek R1 design)
- XP rewards + leaderboard + medal ranks
- XP can be used to unlock badge tiers  

### 💎 Subscription + Badges
- Tiered badges: **Bronze / Silver / Gold / Diamond**
- Unlock via **XP redemption** or **local mobile payments** *(bKash, Nagad, Rocket, Upay)*  

### 🛡️ Role-Based Dashboards
- Admin analytics + moderation console  
- Critic submission tracker + engagement metrics  
- Viewer XP stats + progress  

---

## Tech Stack
### Frontend
- **React 18 + TypeScript (Vite)**
- **Tailwind CSS** + **shadcn/ui** + **Lucide icons**
- Responsive UI + themed UI (Light/Dark/Neon support)

### Backend (Designed Architecture)
- **Python (Flask)** REST API
- **MongoDB** (data storage), **Redis** (caching)
- Notifications + XP + quizzes + subscriptions + moderation

### External Integrations (Planned/Used)
- Anime/Manga sources: **AniList**, **MangaDex**, **Jikan**, **Consumet**
- News feeds: Anime News Network + Crunchyroll News (as designed)
- AI quizzes: **DeepSeek R1** (as designed)

---

## Modules
- **Authentication**: email-based signup + OTP verification, role selection
- **User Module**: profiles, avatars, XP progression, trial system
- **Anime Module**: browse, filters, hero trailer section, watchlist
- **Manga Module**: manga discovery, progress tracking, PDF library
- **Quiz Module**: AI quiz generation, timed quizzes, XP + leaderboard
- **Subscription Module**: badge tiers, XP redemption, payment gateway flow
- **News Module**: anime news aggregation + highlights
- **Critic Module**: submit reviews/vlogs + approval workflow
- **Admin Module**: analytics, moderation, user management, revenue logs

---

## UI Preview (from the report)
The PDF report contains screenshots of:
- About page
- Admin dashboard + analytics
- Anime browsing UI
- Quiz difficulty selection + results
- Manga collection + PDF manga section
- News module
- Critic dashboard + submission workflow
- Subscription tiers and badge system

(See **Project Report** section below.)

---

## Getting Started

### Requirements
- Node.js 18+ recommended  
- npm (or bun)

### Install
```bash
npm install
```

## Project Structure

<details>
<summary>Click to expand</summary>

```text
bangla-anime-verse-main-xxx/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── quiz.db
│   └── server.js
├── public/
│   ├── avatars/
│   │   ├── a.jpeg
│   │   ├── ab.jpeg
│   │   ├── ...
│   │   └── z.jpeg
│   ├── pdf cover/
│   │   ├── attack on titan 2013.jpeg
│   │   ├── b.jpeg
│   │   ├── d ball.jpg
│   │   └── gma.jpeg
│   ├── Attack-on-Titan-CH-001.pdf
│   ├── Dragon-Ball-1.pdf
│   ├── F.mp4
│   ├── favicon.ico
│   ├── mainlogo.png
│   ├── placeholder.svg
│   ├── robots.txt
│   └── Shinigamis-Hollows.pdf
├── src/
│   ├── __tests__/
│   │   └── subscription.test.ts
│   ├── components/
│   │   ├── admin/
│   │   │   └── PendingApprovals.tsx
│   │   ├── anime/
│   │   │   ├── AnimeFilters.tsx
│   │   │   ├── PopularAnimeSection.tsx
│   │   │   └── SearchEngine.ts
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── manga/
│   │   │   ├── MangaFilters.tsx
│   │   │   ├── MangaSearchEngine.ts
│   │   │   └── PopularMangaSection.tsx
│   │   ├── providers/
│   │   │   └── ThemeProvider.tsx
│   │   ├── quiz/
│   │   │   ├── APIStatusIndicator.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── QuizGameplay.tsx
│   │   │   ├── QuizResults.tsx
│   │   │   ├── QuizSearchEngine.ts
│   │   │   └── XPTracker.tsx
│   │   ├── subscription/
│   │   │   ├── PaymentModal.tsx
│   │   │   ├── SubscriptionIcon.tsx
│   │   │   └── XPRedemptionModal.tsx
│   │   ├── ui/
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── ...
│   │   │   └── use-toast.ts
│   │   ├── user/
│   │   │   ├── NotificationDropdown.tsx
│   │   │   └── UserDropdown.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── CritiqueLayout.tsx
│   │   ├── DebugTest.tsx
│   │   ├── LanguageContext.tsx
│   │   ├── Layout.tsx
│   │   ├── UserLayout.tsx
│   │   └── VideoSection.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── data/
│   │   ├── mockNews.ts
│   │   └── mockQuizzes.ts
│   ├── hooks/
│   │   ├── useCritique.ts
│   │   ├── use-mobile.tsx
│   │   ├── useQuiz.ts
│   │   ├── use-toast.ts
│   │   └── useUserProgress.ts
│   ├── lib/
│   │   ├── utils/
│   │   │   └── crypto.ts
│   │   ├── adminServices.ts
│   │   ├── anilist.ts
│   │   ├── auth.ts
│   │   ├── authInitialization.ts
│   │   ├── avatars.ts
│   │   ├── critiqueServices.ts
│   │   ├── localStorage.ts
│   │   ├── mockData.ts
│   │   ├── paymentGateways.ts
│   │   ├── quizAPI.ts
│   │   ├── QuizTaking.tsx
│   │   ├── realtimeService.ts
│   │   ├── subscriptionService.ts
│   │   ├── userServices.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── ...
│   │   │   └── UserManagement.tsx
│   │   ├── critique/
│   │   │   ├── CritiqueDashboard.tsx
│   │   │   ├── index.ts
│   │   │   ├── ...
│   │   │   └── SubmitContent.tsx
│   │   ├── user/
│   │   │   ├── Bookmarks.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ...
│   │   │   └── Watchlist.tsx
│   │   ├── About.tsx
│   │   ├── Anime.tsx
│   │   ├── ...
│   │   └── Subscription.tsx
│   ├── routes/
│   │   └── adminRoutes.tsx
│   ├── services/
│   │   ├── critiqueServices.ts
│   │   ├── mangadxApi.ts
│   │   └── quizAPI.ts
│   ├── styles/
│   │   ├── animations.css
│   │   └── quiz.css
│   ├── types/
│   │   ├── critique.ts
│   │   ├── news.ts
│   │   ├── quiz.ts
│   │   └── subscription.ts
│   ├── utils/
│   │   └── imageUtils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

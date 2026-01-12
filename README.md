<div align="center">

# AniMaze 🎌✨  
### Next-Gen Anime & Manga Platform for Bangladesh 🇧🇩  
**ANIME. MANGA. INNOVATION.** — *Built for otakus, by otakus.*

<p>
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#backend-api">Backend API</a> •
  <a href="#architecture">Architecture</a>
</p>

<!-- Add later if deployed -->
<!-- 🌐 Live Demo: https://your-demo-link -->
<!-- 🎥 Preview Video: https://your-video-link -->

![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-DB-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-TBD-green)

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
│   ├── pdf cover/
│   ├── Attack-on-Titan-CH-001.pdf
│   ├── Dragon-Ball-1.pdf
│   ├── F.mp4
│   └── ...
├── src/
│   ├── __tests__/subscription.test.ts
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── package.json
└── vite.config.ts
</details>
Frontend Routes
These are wired in src/App.tsx:

Public
/ Home

/anime + /anime/:id

/manga + /manga/:id

/pdf-manga

/quiz + /quiz/:id + /quiz/:id/results

/leaderboard

/news + /news/:id

/about

/reviews

/subscription

Auth
/login

/signup

User
/user/dashboard

/user/profile

/user/watchlist

/user/bookmarks

/user/notifications

Admin
/admin/login

/admin + /admin/dashboard

/admin/users

/admin/critics

/admin/content

/admin/quizzes

/admin/review-submissions

Critic
/critique

/critique/submit

/critique/submissions

/critique/profile

Getting Started
Requirements
Node.js 18+ recommended

npm (or bun)

Install Everything (Frontend + Backend)
bash
Copy code
npm run setup
This installs root deps + backend deps. 
package


Run Frontend + Backend Together
bash
Copy code
npm run full-dev
Frontend (Vite): http://localhost:8080/

Backend API: http://localhost:5000/ 
package


Run Separately
Frontend
bash
Copy code
npm run dev
Backend
bash
Copy code
npm run backend:dev
Environment Variables
✅ Recommended: Separate env files
Frontend env at project root: .env

Backend env inside backend/: backend/.env

Backend .env.example
env
Copy code
# Server
PORT=5000
NODE_ENV=development

# OpenRouter / DeepSeek
OPENROUTER_API_KEY=your_openrouter_key_here
DEEPSEEK_MAX_TOKENS=2000
DEEPSEEK_TEMPERATURE=0.7

# Database
DB_PATH=./quiz.db

# Optional (OpenRouter headers)
HTTP_REFERER=http://localhost:5000

# Production CORS (used only in production mode)
FRONTEND_URL=http://localhost:8080
Frontend .env.example (only if you use Supabase/Auth in UI)
env
Copy code
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:5000
Important:

The backend currently allows dev CORS origins for localhost:3000 and localhost:5173. If your frontend runs on 8080, add it to backend CORS allowlist (see Troubleshooting below).

Do not commit .env. Add .env and backend/.env to .gitignore.

Backend API
Base URL: http://localhost:5000

Health & Status
GET /health
Returns uptime, memory, and DB connection status.

GET /api/status
Returns features (AI enabled, DB enabled, caching enabled) and endpoint map.

Quiz Generation (AI + Cache + Fallback)
POST /api/quiz
Generates a quiz using DeepSeek via OpenRouter.

Checks SQLite cache first (1-hour cache)

If no API key exists or AI fails → returns enhanced mock quiz (so your app never breaks)

Body

json
Copy code
{
  "difficulty": "easy",
  "questionType": "multiple-choice",
  "topic": "general"
}
Example

bash
Copy code
curl -X POST http://localhost:5000/api/quiz \
  -H "Content-Type: application/json" \
  -d '{"difficulty":"easy","questionType":"multiple-choice","topic":"naruto"}'
Submit Results + XP
POST /api/quiz/submit
Stores submission + updates leaderboard.

Body

json
Copy code
{
  "userId": "u123",
  "quizId": "quiz-xyz",
  "score": 4,
  "totalQuestions": 5,
  "timeTaken": 52,
  "difficulty": "medium",
  "correctAnswers": [1, 0, 2, 3, 1]
}
XP Logic

xp = score * 10

+50 bonus if score === totalQuestions

Leaderboard
GET /api/leaderboard?limit=50&offset=0
Returns ranked players sorted by total_score then xp.

User Stats
GET /api/user/:id/stats
Returns:

leaderboard row for the user

last 10 submissions

average score % and best score %

System Stats (Admin-style)
GET /api/stats
Returns:

total submissions, avg score %, unique users

API usage (last 24h)

server uptime/memory + AI enabled flag

🔒 Recommended: protect this route before production.

Cache Maintenance (Admin utility)
POST /api/admin/clear-cache
Clears expired cached quizzes.

🔒 Recommended: restrict to admin only.

Architecture
High-Level Flow
Frontend requests quiz → POST /api/quiz

Backend checks SQLite cache (quiz_cache)

If cache miss → call OpenRouter (DeepSeek)

Parse JSON safely → cache quiz → return to frontend

Frontend submits results → POST /api/quiz/submit

Backend stores submission + updates leaderboard + returns XP gained

Backend Internals
Security headers via Helmet (CSP enabled)

Compression for performance

Rate limiting

General: 100 req / 15 min

Quiz: 10 req / 5 min

Submit: 5 req / 1 min

Validation

Express-validator enforces required fields & limits

Data Storage (SQLite)
Tables:

quiz_submissions (history)

leaderboard (rankings + xp)

api_usage (monitoring)

quiz_cache (1-hour cache)

Scripts (Root)
bash
Copy code
npm run dev            # frontend (Vite)
npm run build
npm run preview
npm run backend:setup  # install backend deps
npm run backend:dev    # nodemon backend
npm run backend:start  # node backend
npm run full-dev       # runs frontend + backend together
npm run test:api       # backend API key test (if present)
Troubleshooting
CORS Error (very common)
Your frontend runs on http://localhost:8080, but backend dev CORS allowlist doesn’t include 8080 by default.

Fix (recommended):

Edit backend/server.js CORS dev origins and add:

http://localhost:8080

Example:

js
Copy code
: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
Port Already In Use
Frontend: change Vite port in vite.config.ts

Backend: change PORT in backend/.env

Security Notes
✅ Use .env.example in GitHub, keep real .env private.

🔄 If any keys were leaked, rotate them immediately.

Protect admin endpoints (/api/stats, /api/admin/*) before deployment.

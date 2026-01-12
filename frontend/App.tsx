// src/App.tsx - FIXED: Added missing user routes
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Anime from "./pages/Anime";
import AnimeDetail from "./pages/AnimeDetail";
import Manga from "./pages/Manga";
import MangaDetail from "./pages/MangaDetail";
import PDFMangaPage from './pages/PDFManga';
import Quiz from "./pages/Quiz";
import QuizTaking from "./pages/QuizTaking";
import QuizResults from "./pages/QuizResults";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import News from "./pages/News";
import CombinedAuthPage from "./pages/CombinedAuthPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ContentManagement from "./pages/admin/ContentManagement";
import QuizManagement from "./pages/admin/QuizManagement";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./components/AdminLayout";
import CriticManagement from "./pages/admin/CriticManagement";
import ReviewSubmissions from "./pages/admin/ReviewSubmissions";
import UserNotifications from "./pages/user/Notifications";
import Bookmarks from "./pages/user/Bookmarks";
import PublicReviews from "./pages/PublicReviews";
import NewsDetail from "./pages/NewsDetail";
import About from "./pages/About";
// FIXED: Import the layout component with the correct understanding
import CritiqueDashboard from "./pages/critique/CritiqueDashboard";
import SubmitContent from "./pages/critique/SubmitContent";
import MySubmissions from "./pages/critique/MySubmissions";
import ProfileSettings from "./pages/critique/ProfileSettings";

// FIXED: Import user components - These already exist in your project
import UserDashboard from "./pages/user/Dashboard";
import UserProfileSettings from "./pages/user/ProfileSettings";
import UserWatchlist from "./pages/user/Watchlist";

// Add this import at the top with other imports:

import Subscription from "./pages/Subscription";

// Add these 2 import lines to your existing imports
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./components/providers/ThemeProvider";


// Simple Component for Critique Dashboard (Wrapper)
const SimpleCritiqueDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Critique Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your critique content and submissions</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Submit New Content</h3>
          <p className="text-sm text-muted-foreground mb-4">Create and submit your anime/manga reviews</p>
          <a href="/critique/submit" className="text-sm text-primary hover:underline">Get Started →</a>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">My Submissions</h3>
          <p className="text-sm text-muted-foreground mb-4">View and manage your submitted content</p>
          <a href="/critique/submissions" className="text-sm text-primary hover:underline">View All →</a>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">Update your critique profile and preferences</p>
          <a href="/critique/profile" className="text-sm text-primary hover:underline">Edit Profile →</a>
        </div>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Fix React Router warnings about future flags
    console.log('🚀 App initialized');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        themes={['light', 'dark', 'neon']}
        disableTransitionOnChange
      >
        <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/anime" element={<Layout><Anime /></Layout>} />
                <Route path="/anime/:id" element={<Layout><AnimeDetail /></Layout>} />
                <Route path="/manga" element={<Layout><Manga /></Layout>} />
                <Route path="/manga/:id" element={<Layout><MangaDetail /></Layout>} />
                // Add this route
                <Route path="/pdf-manga" element={<Layout><PDFMangaPage /></Layout>} />
                <Route path="/quiz" element={<Layout><Quiz /></Layout>} />
                <Route path="/quiz/:id" element={<Layout><QuizTaking /></Layout>} />
                <Route path="/quiz/:id/results" element={<Layout><QuizResults /></Layout>} />
                <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
                <Route path="/news" element={<Layout><News /></Layout>} />
                <Route path="/news/:id" element={<Layout><NewsDetail /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/reviews" element={<PublicReviews />} />
                <Route path="/subscription" element={<Layout><Subscription /></Layout>} />
                


                

                {/* Auth Routes */}
                <Route path="/login" element={<CombinedAuthPage />} />
                <Route path="/signup" element={<CombinedAuthPage />} />

                {/* FIXED: User Routes - These were missing and causing 404 errors */}
                <Route path="/user/profile" element={<Layout><UserProfileSettings /></Layout>} />
                <Route path="/user/dashboard" element={<Layout><UserDashboard /></Layout>} />
                <Route path="/user/watchlist" element={<Layout><UserWatchlist /></Layout>} />
                
                {/* Existing User Routes */}
                <Route path="/user/notifications" element={<Layout><UserNotifications /></Layout>} />
                <Route path="/user/bookmarks" element={<Layout><Bookmarks /></Layout>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
                <Route path="/admin/critics" element={<AdminLayout><CriticManagement /></AdminLayout>} />
                <Route path="/admin/content" element={<AdminLayout><ContentManagement /></AdminLayout>} />
                <Route path="/admin/quizzes" element={<AdminLayout><QuizManagement /></AdminLayout>} />
                <Route path="/admin/review-submissions" element={<AdminLayout><ReviewSubmissions /></AdminLayout>} />
                {/* FIXED: Critique Routes - Use your actual critique components */}
                <Route path="/critique" element={<CritiqueDashboard />} />
                <Route path="/critique/submit" element={<SubmitContent />} />
                <Route path="/critique/submissions" element={<MySubmissions />} />
                <Route path="/critique/profile" element={<ProfileSettings />} />

                {/* 404 Route */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

// src/pages/Quiz.tsx - Complete integrated quiz page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Target, 
  Settings, 
  Users, 
  Play,
  Trophy,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  TrendingUp,
  Award,
  Sparkles,
  GamepadIcon,
  Timer,
  Medal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Quiz-specific components
import { QuizGameplay } from '@/components/quiz/QuizGameplay';
import { QuizResults } from '@/components/quiz/QuizResults';
import { Leaderboard } from '@/components/quiz/Leaderboard';
import { XPTracker } from '@/components/quiz/XPTracker';
import { APIStatusIndicator } from '@/components/quiz/APIStatusIndicator';

// Import the quiz hook
import { useQuiz } from '@/hooks/useQuiz';

// Import quiz styles
import '@/styles/quiz.css';

export default function Quiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentView, setCurrentView] = useState<'menu' | 'quiz' | 'results'>('menu');
  
  const {
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    isQuizActive,
    timeRemaining,
    setTimeRemaining,
    quizResult,
    isLoading,
    startQuiz,
    submitAnswer,
    timeUp,
    resetQuiz
  } = useQuiz();

  const handleStartQuiz = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to take quizzes and track your progress.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setSelectedDifficulty(difficulty);
    setCurrentView('quiz');
    await startQuiz(difficulty);
  };

  const handleQuizComplete = () => {
    setCurrentView('results');
  };

  const handleRetry = () => {
    resetQuiz();
    setCurrentView('menu');
  };

  const handleBackToMenu = () => {
    resetQuiz();
    setCurrentView('menu');
  };

  const handleNewQuiz = (difficulty: 'easy' | 'medium' | 'hard') => {
    resetQuiz();
    handleStartQuiz(difficulty);
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          color: 'from-green-500 to-green-600',
          icon: '🟢',
          emoji: '🌱',
          description: 'Perfect for beginners',
          questions: '5 questions',
          time: '30s per question',
          bgColor: 'bg-green-50 dark:bg-green-950/50',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-600',
          hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/50'
        };
      case 'medium':
        return {
          color: 'from-yellow-500 to-orange-500',
          icon: '🟡',
          emoji: '⚡',
          description: 'Good challenge for fans',
          questions: '5 questions',
          time: '30s per question',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/50',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-600',
          hoverColor: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
        };
      case 'hard':
        return {
          color: 'from-red-500 to-red-600',
          icon: '🔴',
          emoji: '🔥',
          description: 'For true anime experts',
          questions: '5 questions',
          time: '45s per question',
          bgColor: 'bg-red-50 dark:bg-red-950/50',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-600',
          hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/50'
        };
      default:
        return {
          color: 'from-blue-500 to-purple-600',
          icon: '❓',
          emoji: '🎯',
          description: 'Unknown difficulty',
          questions: '5 questions',
          time: '30s per question',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-600',
          hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/50'
        };
    }
  };

  // Quiz gameplay view
  if (currentView === 'quiz' && currentQuiz && currentQuestion) {
    return (
      <QuizGameplay
        currentQuiz={currentQuiz}
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        isQuizActive={isQuizActive}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        onAnswer={submitAnswer}
        onTimeUp={timeUp}
        onComplete={handleQuizComplete}
        onBackToMenu={handleBackToMenu}
        difficulty={selectedDifficulty}
      />
    );
  }

  // Quiz results view
  if (currentView === 'results' && quizResult && currentQuiz) {
    return (
      <QuizResults
        result={quizResult}
        quiz={currentQuiz}
        onRetry={handleRetry}
        onNewQuiz={handleNewQuiz}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // Main quiz menu
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-float">🎌</div>
          <div className="absolute top-20 right-20 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>⚔️</div>
          <div className="absolute bottom-20 left-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>🏮</div>
          <div className="absolute bottom-10 right-10 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>🍜</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm animate-pulse-glow">
              <Brain className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Anime & Manga Quiz
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Test your otaku knowledge with AI-powered questions covering your favorite anime and manga series! 
            <span className="block mt-2 text-lg text-blue-200">
              Earn XP, level up, and compete with fellow anime fans worldwide! 🌟
            </span>
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-blue-200">Questions</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">7</div>
              <div className="text-sm text-blue-200">Question Types</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-blue-200">Difficulties</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">200</div>
              <div className="text-sm text-blue-200">Max XP</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Welcome Card */}
            {user && (
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl">Welcome back, {user.username || user.email?.split('@')[0]}! 👋</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                        Ready to test your anime knowledge and earn some XP?
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            )}

            {/* Authentication prompt for non-logged users */}
            {!user && (
              <Alert className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 dark:border-orange-800 dark:from-orange-950/50 dark:to-yellow-950/50">
                <Users className="h-5 w-5 text-orange-600" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                        🎯 Unlock the Full Experience!
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">
                        Log in to track your progress, earn XP, compete on leaderboards, and unlock achievements!
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/login')} 
                      size="sm"
                      className="ml-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                    >
                      Log In
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Difficulty Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl">Choose Your Challenge</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                      Select the difficulty level that matches your anime expertise
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
                    const config = getDifficultyConfig(difficulty);
                    const isSelected = selectedDifficulty === difficulty;
                    const isCurrentlyLoading = isLoading && selectedDifficulty === difficulty;
                    
                    return (
                      <Card
                        key={difficulty}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                          isSelected
                            ? `ring-4 ring-blue-500 ${config.bgColor} border-2 ${config.borderColor}`
                            : `hover:shadow-lg ${config.hoverColor} border-2 border-gray-200 dark:border-gray-700`
                        } ${isCurrentlyLoading ? 'pointer-events-none' : ''}`}
                        onClick={() => !isLoading && setSelectedDifficulty(difficulty)}
                      >
                        <CardContent className="p-6 text-center relative">
                          {/* Loading Overlay */}
                          {isCurrentlyLoading && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-white text-sm font-medium">Generating Quiz...</span>
                                <span className="text-white text-xs">Please wait</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Difficulty Icon */}
                          <div className="text-6xl mb-4 animate-float">
                            {config.emoji}
                          </div>
                          
                          {/* Title and Badge */}
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <h3 className="text-2xl font-bold capitalize">{difficulty}</h3>
                            <Badge className={`${config.textColor} bg-white/80 border-0`}>
                              {config.icon}
                            </Badge>
                          </div>
                          
                          {/* Description */}
                          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm font-medium">
                            {config.description}
                          </p>
                          
                          {/* Stats */}
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center justify-center gap-2 text-sm">
                              <FileText className="w-4 h-4" />
                              <span className="font-medium">{config.questions}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm">
                              <Timer className="w-4 h-4" />
                              <span className="font-medium">{config.time}</span>
                            </div>
                          </div>
                          
                          {/* XP Rewards */}
                          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 mb-4">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Potential XP</div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-bold text-yellow-600">20-200 XP</span>
                            </div>
                          </div>
                          
                          {/* Start Button */}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartQuiz(difficulty);
                            }}
                            disabled={isLoading}
                            className={`w-full transition-all duration-300 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
                                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                            }`}
                            size="lg"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            {isCurrentlyLoading ? 'Starting...' : 'Start Quiz'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Quick Start Options */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-purple-700 dark:text-purple-300">Quick Start</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStartQuiz('easy')}
                      disabled={isLoading}
                      className="text-left justify-start"
                    >
                      🌱 Beginner Friendly
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStartQuiz('medium')}
                      disabled={isLoading}
                      className="text-left justify-start"
                    >
                      ⚡ Balanced Challenge
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStartQuiz('hard')}
                      disabled={isLoading}
                      className="text-left justify-start"
                    >
                      🔥 Expert Mode
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Showcase */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl">Amazing Features</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                      Discover what makes our quiz system special
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-2 text-blue-700 dark:text-blue-300">AI-Generated Questions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Fresh, dynamic questions powered by advanced AI, covering hundreds of anime and manga series with varying difficulty levels.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <GamepadIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-2 text-purple-700 dark:text-purple-300">7 Question Types</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Multiple choice, true/false, fill-in-blanks, multiple select, ranking, number input, and image-based questions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-2 text-green-700 dark:text-green-300">Timed Challenges</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Race against time with dynamic timers, auto-submit functionality, and visual countdown indicators.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-2 text-yellow-700 dark:text-yellow-300">XP & Progression</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Earn XP based on performance, level up from Anime Newbie to Anime Legend, and compete globally.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Features */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 border border-indigo-200 dark:border-indigo-800">
                  <h4 className="font-bold mb-3 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Additional Features
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Detailed explanations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Global leaderboards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Offline mode support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Status */}
            <APIStatusIndicator />
            
            {/* User Progress (only if logged in) */}
            {user && <XPTracker />}
            
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Top Quiz Masters
                </CardTitle>
                <CardDescription>
                  See how you stack up against the competition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  variant="outline"
                  className="w-full mb-4"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
                </Button>
                {showLeaderboard && <Leaderboard />}
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Medal className="w-5 h-5 text-blue-500" />
                  Quiz Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Popular Series:</span>
                    <span className="font-medium text-sm">One Piece, Naruto, AOT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Question Types:</span>
                    <span className="font-medium text-sm">7 different types</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty Levels:</span>
                    <span className="font-medium text-sm">Easy, Medium, Hard</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Max XP per quiz:</span>
                    <span className="font-medium text-blue-600">200 XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average completion:</span>
                    <span className="font-medium text-green-600">2-3 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Progress Preview (only if logged in) */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                        <div className="text-xl font-bold text-blue-600">12</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Quizzes Taken</div>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                        <div className="text-xl font-bold text-green-600">87%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Average Score</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleStartQuiz('medium')}
                      disabled={isLoading}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
               </CardContent>
             </Card>
           )}

           {/* Tips for New Users */}
           {!user && (
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                   <HelpCircle className="w-5 h-5 text-green-500" />
                   Getting Started
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-3 text-sm">
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                     <div>
                       <div className="font-medium">Choose difficulty</div>
                       <div className="text-gray-600 dark:text-gray-400">Start with Easy if you're new to anime</div>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                     <div>
                       <div className="font-medium">Answer quickly</div>
                       <div className="text-gray-600 dark:text-gray-400">Each question has a time limit</div>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                     <div>
                       <div className="font-medium">Learn from results</div>
                       <div className="text-gray-600 dark:text-gray-400">Check explanations after each quiz</div>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                     <div>
                       <div className="font-medium">Create account</div>
                       <div className="text-gray-600 dark:text-gray-400">Track progress and compete globally</div>
                     </div>
                   </div>
                 </div>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="w-full mt-4"
                   onClick={() => navigate('/signup')}
                 >
                   Create Free Account
                 </Button>
               </CardContent>
             </Card>
           )}

           {/* Latest Updates */}
           <Card>
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-yellow-500" />
                 What's New
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-3 text-sm">
                 <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                     <span className="font-medium text-green-700 dark:text-green-300">New Feature</span>
                   </div>
                   <div className="text-green-600 dark:text-green-400">AI-powered question generation with DeepSeek</div>
                 </div>
                 <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                     <span className="font-medium text-blue-700 dark:text-blue-300">Improvement</span>
                   </div>
                   <div className="text-blue-600 dark:text-blue-400">Enhanced XP system with better rewards</div>
                 </div>
                 <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800">
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                     <span className="font-medium text-purple-700 dark:text-purple-300">Added</span>
                   </div>
                   <div className="text-purple-600 dark:text-purple-400">7 different question types for variety</div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
       </div>

       {/* Bottom CTA Section */}
       <div className="mt-12 text-center">
         <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
           <CardContent className="p-8">
             <div className="max-w-2xl mx-auto">
               <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                 Ready to Begin Your Journey?
               </h3>
               <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                 Join thousands of anime fans testing their knowledge and earning achievements. 
                 Start with any difficulty level and watch your expertise grow!
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button
                   onClick={() => handleStartQuiz('easy')}
                   disabled={isLoading}
                   size="lg"
                   className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8"
                 >
                   <Play className="w-5 h-5 mr-2" />
                   Start Easy Quiz
                 </Button>
                 <Button
                   onClick={() => handleStartQuiz('medium')}
                   disabled={isLoading}
                   size="lg"
                   className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8"
                 >
                   <Zap className="w-5 h-5 mr-2" />
                   Try Medium Quiz
                 </Button>
                 <Button
                   onClick={() => handleStartQuiz('hard')}
                   disabled={isLoading}
                   size="lg"
                   variant="outline"
                   className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-8"
                 >
                   <Target className="w-5 h-5 mr-2" />
                   Challenge Hard Mode
                 </Button>
               </div>
               {!user && (
                 <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                   💡 <span className="font-medium">Pro tip:</span> Create an account to save your progress and unlock the full experience!
                 </p>
               )}
             </div>
           </CardContent>
         </Card>
       </div>

       {/* Fun Facts Section */}
       <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="text-center border-2 border-blue-200 dark:border-blue-800">
           <CardContent className="p-6">
             <div className="text-4xl mb-3">🎯</div>
             <div className="text-2xl font-bold text-blue-600 mb-2">95%</div>
             <div className="text-sm text-gray-600 dark:text-gray-400">
               Average user satisfaction with question quality
             </div>
           </CardContent>
         </Card>
         <Card className="text-center border-2 border-green-200 dark:border-green-800">
           <CardContent className="p-6">
             <div className="text-4xl mb-3">⚡</div>
             <div className="text-2xl font-bold text-green-600 mb-2">2.5min</div>
             <div className="text-sm text-gray-600 dark:text-gray-400">
               Average time to complete a 5-question quiz
             </div>
           </CardContent>
         </Card>
         <Card className="text-center border-2 border-purple-200 dark:border-purple-800">
           <CardContent className="p-6">
             <div className="text-4xl mb-3">🏆</div>
             <div className="text-2xl font-bold text-purple-600 mb-2">1000+</div>
             <div className="text-sm text-gray-600 dark:text-gray-400">
               Active quiz masters competing globally
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   </div>
 );
}
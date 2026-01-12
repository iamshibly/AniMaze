import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Trophy, Star, Clock, CheckCircle, XCircle, Share2, RotateCcw, Home, Target, Award } from 'lucide-react';
import { getQuizById, mockQuizzes, type Quiz } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function QuizResults() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [nextQuiz, setNextQuiz] = useState<Quiz | null>(null);
  const [showNewBadge, setShowNewBadge] = useState(false);
  
  const results = location.state || {};
  const { score, total, percentage, earnedXP, answers, timeUsed } = results;

  useEffect(() => {
    if (id) {
      const foundQuiz = getQuizById(id);
      setQuiz(foundQuiz || null);
      
      // Get a random next quiz
      const otherQuizzes = mockQuizzes.filter(q => q.id !== id);
      if (otherQuizzes.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherQuizzes.length);
        setNextQuiz(otherQuizzes[randomIndex]);
      }
    }
  }, [id]);

  useEffect(() => {
    // Check if user earned a new badge
    if (percentage >= 90) {
      setShowNewBadge(true);
      setTimeout(() => setShowNewBadge(false), 3000);
    }
  }, [percentage]);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! 🌟", color: "text-yellow-500", badge: "Expert" };
    if (percentage >= 75) return { message: "Excellent! 🎉", color: "text-green-500", badge: "Great" };
    if (percentage >= 60) return { message: "Good Job! 👏", color: "text-blue-500", badge: "Good" };
    if (percentage >= 40) return { message: "Keep Trying! 💪", color: "text-orange-500", badge: "Fair" };
    return { message: "Practice More! 📚", color: "text-red-500", badge: "Needs Work" };
  };

  const performance = getPerformanceMessage();

  const shareResults = () => {
    const shareText = `I just scored ${percentage.toFixed(0)}% on "${quiz?.title}" quiz and earned ${earnedXP} XP! 🎯`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Results',
        text: shareText,
        url: window.location.origin + `/quiz/${id}`
      });
    } else {
      navigator.clipboard.writeText(shareText + ` - ${window.location.origin}/quiz/${id}`);
      toast({
        title: "Copied to clipboard!",
        description: "Share your results with friends",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!quiz || results.score === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Results not found</h1>
          <Button onClick={() => navigate('/quiz')}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Main Results Card */}
        <Card className="mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <CardHeader className="text-center relative">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl mb-2">Quiz Completed!</CardTitle>
            <h2 className={`text-xl font-bold ${performance.color}`}>
              {performance.message}
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gradient mb-2">
                {percentage.toFixed(0)}%
              </div>
              <p className="text-muted-foreground">
                {score} out of {total} questions correct
              </p>
            </div>

            {/* Progress Bar */}
            <div>
              <Progress value={percentage} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>0%</span>
                <Badge variant={percentage >= 75 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'}>
                  {performance.badge}
                </Badge>
                <span>100%</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="font-bold text-lg">+{earnedXP}</div>
                <div className="text-sm text-muted-foreground">XP Earned</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="font-bold text-lg">{formatTime(timeUsed)}</div>
                <div className="text-sm text-muted-foreground">Time Used</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Answer Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[index];
              const correctAnswer = question.options ? question.options[question.correctAnswer] : 
                                 question.correctAnswer === 1 ? 'true' : 'false';
              const isCorrect = userAnswer === correctAnswer;
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium flex-1">{question.question}</p>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 ml-2" />
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {userAnswer || 'No answer'}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-600">
                        Correct answer: {correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button onClick={shareResults} variant="outline" className="h-12">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Link to={`/quiz/${id}`}>
            <Button variant="outline" className="w-full h-12">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </Link>
        </div>

        {/* Next Quiz Suggestion */}
        {nextQuiz && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-primary" />
                Continue Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{nextQuiz.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {nextQuiz.description}
                  </p>
                  <div className="flex gap-2">
                    <Badge variant={nextQuiz.difficulty === 'easy' ? 'default' : nextQuiz.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                      {nextQuiz.difficulty}
                    </Badge>
                    <Badge variant="outline">+{nextQuiz.xpReward} XP</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Link to={`/quiz/${nextQuiz.id}`}>
                    <Button size="sm" className="bg-gradient-primary">
                      Take Next Quiz
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <Link to="/quiz">
            <Button variant="ghost" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Quiz Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* New Badge Notification */}
      {showNewBadge && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <CardContent className="p-4 flex items-center space-x-3">
              <Award className="w-6 h-6" />
              <div>
                <p className="font-semibold">New Badge Earned!</p>
                <p className="text-sm opacity-90">Quiz Expert</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
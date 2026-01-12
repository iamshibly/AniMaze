import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trophy, Clock, CheckCircle, XCircle, Star, ArrowRight, Brain, Zap, AlertCircle } from 'lucide-react';
import { getQuizById, type Quiz, type Question } from '@/lib/mockData';
import { quizAPI, getQuizWithFallback, type Quiz as APIQuiz } from '@/lib/quizAPI';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function QuizTaking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | APIQuiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedTime, setSelectedTime] = useState(60);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingAI, setUsingAI] = useState(false);
  
  // Load quiz data (AI or fallback)
  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) {
        navigate('/quiz');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // First try to get quiz from your existing mock data
        const mockQuiz = getQuizById(id);
        if (mockQuiz) {
          setQuiz(mockQuiz);
          setTimeLeft(selectedTime);
          setLoading(false);
          return;
        }

        // If no mock quiz found, try to generate with AI
        console.log('🤖 Generating AI quiz for difficulty:', id);
        const aiQuiz = await getQuizWithFallback(id);
        setQuiz(aiQuiz);
        setUsingAI(true);
        setTimeLeft(selectedTime);
        
        toast({
          title: "AI Quiz Generated! 🤖",
          description: "Fresh questions powered by AI",
        });

      } catch (err) {
        console.error('Failed to load quiz:', err);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id, selectedTime, navigate, toast]);

  // Timer countdown
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowTimeoutDialog(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft]);

  const startQuiz = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to take quizzes",
        variant: "destructive"
      });
      navigate('/auth/login');
      return;
    }
    setQuizStarted(true);
    setTimeLeft(selectedTime);
  };

  const handleAnswer = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    
    if (!quiz || !user) return;
    
    try {
      // Calculate score
      const score = quiz.questions.reduce((acc, question, index) => {
        const userAnswer = answers[index];
        const correctAnswer = question.options ? question.options[question.correctAnswer] : 
                              question.correctAnswer === 1 ? 'true' : 'false';
        return acc + (userAnswer === correctAnswer ? 1 : 0);
      }, 0);
      
      const quizData = {
        userId: parseInt(user.id || '1'),
        quizId: quiz.id,
        score,
        totalQuestions: quiz.questions.length,
        difficulty: quiz.difficulty || id || 'Medium',
        answers: Object.values(answers),
        timeUsed: selectedTime - timeLeft
      };

      // Try to submit to backend
      let result;
      try {
        const response = await quizAPI.submitQuizResult(quizData);
        result = response.result;
        
        toast({
          title: "Quiz Submitted! 🎉",
          description: `You earned ${result.xpEarned} XP!`,
        });
      } catch (apiError) {
        console.warn('Backend submission failed, calculating locally:', apiError);
        
        // Fallback: calculate locally
        const percentage = score / quiz.questions.length;
        let xpEarned = 20; // Base XP
        let position = Math.floor(Math.random() * 50) + 1;
        
        if (percentage >= 0.9) {
          xpEarned = 200;
          position = 1;
        } else if (percentage >= 0.7) {
          xpEarned = 100;
          position = 2;
        } else if (percentage >= 0.5) {
          xpEarned = 50;
          position = 3;
        }
        
        result = {
          score,
          totalQuestions: quiz.questions.length,
          xpEarned,
          position,
          percentage: Math.round(percentage * 100),
          difficulty: quiz.difficulty || 'Medium',
          timeUsed: selectedTime - timeLeft
        };
      }
      
      // Navigate to results
      setTimeout(() => {
        navigate(`/quiz/${id}/results`, { 
          state: { 
            ...result,
            answers,
            usingAI
          } 
        });
      }, 1000);
      
    } catch (error) {
      console.error('Quiz submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {usingAI ? 'Generating AI quiz...' : 'Loading quiz...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-red-600">Quiz Load Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/quiz')}>
            Back to Quiz List
          </Button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
          <Button onClick={() => navigate('/quiz')}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                {usingAI ? <Brain className="w-8 h-8 text-white" /> : <Trophy className="w-8 h-8 text-white" />}
              </div>
              <CardTitle className="text-2xl mb-2">
                {quiz.title || `${quiz.difficulty || 'Quiz'} Challenge`}
              </CardTitle>
              <p className="text-muted-foreground">
                {quiz.description || 'Test your anime and manga knowledge!'}
              </p>
              {usingAI && (
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generated
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant={quiz.difficulty === 'Easy' ? 'default' : quiz.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                  {quiz.difficulty || 'Medium'}
                </Badge>
                <Badge variant="outline">
                  {quiz.questions.length} Questions
                </Badge>
                <Badge variant="outline">
                  +200 XP Possible
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Choose Time Limit:</h3>
                <div className="flex gap-2 justify-center">
                  {[30, 60, 120].map(time => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => setSelectedTime(time)}
                      className="flex-1"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {time < 60 ? `${time}s` : `${time/60}m`}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Rules:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Answer all questions within the time limit</li>
                  <li>• Quiz will auto-submit when time expires</li>
                  <li>• You cannot go back to previous questions</li>
                  <li>• Earn XP based on your performance</li>
                  {usingAI && <li>• Fresh AI-generated questions each time!</li>}
                </ul>
              </div>

              <Button onClick={startQuiz} className="w-full" size="lg">
                <Zap className="w-4 h-4 mr-2" />
                Start {usingAI ? 'AI ' : ''}Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Question {currentQuestion + 1} of {quiz.questions.length}</h1>
              <p className="text-sm text-muted-foreground">
                {quiz.title || `${quiz.difficulty} Quiz`}
                {usingAI && (
                  <Badge className="ml-2 bg-blue-500">
                    <Brain className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-destructive" />
              <span className={`font-mono font-bold ${timeLeft < 30 ? 'text-destructive' : 'text-foreground'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
            {currentQ.image && (
              <div className="mt-4">
                <img 
                  src={currentQ.image} 
                  alt="Question" 
                  className="max-w-full h-64 object-contain mx-auto rounded-lg"
                />
              </div>
            )}
            {currentQ.imageDescription && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground italic">
                  Image: {currentQ.imageDescription}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Multiple Choice */}
            {currentQ.type === 'MCQ' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={answers[currentQuestion] === option ? 'default' : 'outline'}
                    onClick={() => handleAnswer(currentQuestion, option)}
                    className="w-full text-left justify-start h-auto p-4"
                  >
                    <span className="mr-3 font-bold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* True/False */}
            {currentQ.type === 'TRUE_FALSE' && (
              <div className="flex gap-4">
                <Button
                  variant={answers[currentQuestion] === 'True' ? 'default' : 'outline'}
                  onClick={() => handleAnswer(currentQuestion, 'True')}
                  className="flex-1"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  True
                </Button>
                <Button
                  variant={answers[currentQuestion] === 'False' ? 'default' : 'outline'}
                  onClick={() => handleAnswer(currentQuestion, 'False')}
                  className="flex-1"
                  size="lg"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  False
                </Button>
              </div>
            )}

            {/* Fill in the Blank */}
            {currentQ.type === 'FILL_BLANK' && (
              <Input
                type="text"
                placeholder="Type your answer here..."
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
                className="text-center text-lg"
              />
            )}

            {/* Image-based */}
            {currentQ.type === 'IMAGE' && (
              <Input
                type="text"
                placeholder="What do you see in this image?"
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
                className="text-center text-lg"
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  onClick={submitQuiz}
                  disabled={!answers[currentQuestion] || isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Submit Quiz
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={!answers[currentQuestion]}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeout Dialog */}
      <AlertDialog open={showTimeoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-destructive" />
              Time's Up!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your time limit has expired. The quiz will be automatically submitted with your current answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={submitQuiz}>
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
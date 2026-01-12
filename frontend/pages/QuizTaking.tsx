import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trophy, Clock, CheckCircle, XCircle, Star, ArrowRight } from 'lucide-react';
import { getQuizById, type Quiz, type Question } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function QuizTaking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedTime, setSelectedTime] = useState(60); // 1 minute default
  
  // Load quiz data
  useEffect(() => {
    if (id) {
      const foundQuiz = getQuizById(id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setTimeLeft(selectedTime);
      } else {
        navigate('/quiz');
      }
    }
  }, [id, selectedTime, navigate]);

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

  const submitQuiz = () => {
    setIsSubmitting(true);
    
    if (!quiz || !user) return;
    
    // Calculate score
    const score = quiz.questions.reduce((acc, question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.options ? question.options[question.correctAnswer] : 
                          question.correctAnswer === 1 ? 'true' : 'false';
      return acc + (userAnswer === correctAnswer ? 1 : 0);
    }, 0);
    
    const percentage = (score / quiz.questions.length) * 100;
    
    // Calculate XP based on performance
    let earnedXP = 50; // Base XP for participation
    if (percentage >= 80) earnedXP += 200; // 1st place
    else if (percentage >= 60) earnedXP += 150; // 2nd place  
    else if (percentage >= 40) earnedXP += 100; // 3rd place
    
    // Navigate to results
    setTimeout(() => {
      navigate(`/quiz/${id}/results`, { 
        state: { 
          score, 
          total: quiz.questions.length, 
          percentage,
          earnedXP,
          answers,
          timeUsed: selectedTime - timeLeft
        } 
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
              <p className="text-muted-foreground">{quiz.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant={quiz.difficulty === 'easy' ? 'default' : quiz.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </Badge>
                <Badge variant="outline">
                  {quiz.questions.length} Questions
                </Badge>
                <Badge variant="outline">
                  +{quiz.xpReward} XP Reward
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
                </ul>
              </div>

              <Button onClick={startQuiz} className="w-full" size="lg">
                <Trophy className="w-4 h-4 mr-2" />
                Start Quiz
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
              <p className="text-sm text-muted-foreground">{quiz.title}</p>
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
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Multiple Choice */}
            {(quiz.type === 'multiple-choice' || quiz.type === 'image-based') && currentQ.options && (
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
            {quiz.type === 'true-false' && (
              <div className="flex gap-4">
                <Button
                  variant={answers[currentQuestion] === 'true' ? 'default' : 'outline'}
                  onClick={() => handleAnswer(currentQuestion, 'true')}
                  className="flex-1"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  True
                </Button>
                <Button
                  variant={answers[currentQuestion] === 'false' ? 'default' : 'outline'}
                  onClick={() => handleAnswer(currentQuestion, 'false')}
                  className="flex-1"
                  size="lg"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  False
                </Button>
              </div>
            )}

            {/* Fill in the Blank */}
            {quiz.type === 'fill-in-blank' && (
              <Input
                type="text"
                placeholder="Type your answer here..."
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
                  className="bg-gradient-primary"
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
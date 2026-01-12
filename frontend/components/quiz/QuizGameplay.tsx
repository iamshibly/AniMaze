// src/components/quiz/QuizGameplay.tsx
import { useState, useEffect } from 'react';
import { Question, Quiz } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Home,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface QuizGameplayProps {
  currentQuiz: Quiz;
  currentQuestion: Question;
  currentQuestionIndex: number;
  isQuizActive: boolean;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  onAnswer: (answer: string | number | number[]) => void;
  onTimeUp: () => void;
  onComplete: () => void;
  onBackToMenu: () => void;
  difficulty: string;
}

export const QuizGameplay = ({
  currentQuiz,
  currentQuestion,
  currentQuestionIndex,
  isQuizActive,
  timeRemaining,
  setTimeRemaining,
  onAnswer,
  onTimeUp,
  onComplete,
  onBackToMenu,
  difficulty
}: QuizGameplayProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | number[]>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isQuizActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
      
      if (timeRemaining <= 1) {
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isQuizActive, setTimeRemaining, onTimeUp]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setHasSubmitted(false);
  }, [currentQuestion.id]);

  const handleSubmit = () => {
    if (selectedAnswer !== '' && !hasSubmitted) {
      setHasSubmitted(true);
      onAnswer(selectedAnswer);
      
      // Auto-advance to next question after a short delay
      setTimeout(() => {
        if (currentQuestionIndex >= currentQuiz.questions.length - 1) {
          onComplete();
        }
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-red-500 animate-pulse';
    if (timeRemaining <= 30) return 'text-yellow-500';
    return 'text-blue-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq': return '📝';
      case 'true-false': return '✅';
      case 'fill-blank': return '📝';
      case 'image-based': return '🖼️';
      case 'multiple-select': return '☑️';
      case 'ranking': return '📊';
      case 'number': return '🔢';
      default: return '❓';
    }
  };

  const renderMCQOptions = () => {
    return currentQuestion.options?.map((option, index) => {
      const isSelected = selectedAnswer === index;
      
      return (
        <Button
          key={index}
          variant={isSelected ? "default" : "outline"}
          className={`w-full p-4 h-auto text-left justify-start ${
            isSelected ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => !hasSubmitted && setSelectedAnswer(index)}
          disabled={hasSubmitted}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-left flex-1">{option}</span>
            {isSelected && <CheckCircle className="w-5 h-5 ml-2" />}
          </div>
        </Button>
      );
    });
  };

  const renderTrueFalse = () => {
    const options = ['False', 'True'];
    return options.map((option, index) => {
      const isSelected = selectedAnswer === index;
      
      return (
        <Button
          key={index}
          variant={isSelected ? "default" : "outline"}
          className={`w-full p-4 h-auto ${
            isSelected ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => !hasSubmitted && setSelectedAnswer(index)}
          disabled={hasSubmitted}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xl">{option === 'True' ? '✅' : '❌'}</span>
            <span className="font-medium">{option}</span>
            {isSelected && <CheckCircle className="w-5 h-5 ml-2" />}
          </div>
        </Button>
      );
    });
  };

  const renderFillInBlank = () => {
    return (
      <div className="space-y-4">
        <input
          type="text"
          className="w-full p-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="Type your answer here..."
          value={selectedAnswer as string}
          onChange={(e) => !hasSubmitted && setSelectedAnswer(e.target.value)}
          disabled={hasSubmitted}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
    );
  };

  const renderMultipleSelect = () => {
    const selectedArray = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    
    return currentQuestion.options?.map((option, index) => {
      const isSelected = selectedArray.includes(index);
      
      return (
        <Button
          key={index}
          variant="outline"
          className={`w-full p-4 h-auto text-left justify-start ${
            isSelected ? 'bg-blue-50 border-blue-500' : ''
          }`}
          onClick={() => {
            if (!hasSubmitted) {
              const newSelected = [...selectedArray];
              if (newSelected.includes(index)) {
                newSelected.splice(newSelected.indexOf(index), 1);
              } else {
                newSelected.push(index);
              }
              setSelectedAnswer(newSelected);
            }
          }}
          disabled={hasSubmitted}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
              }`}>
                {isSelected && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-left flex-1">{option}</span>
            </div>
          </div>
        </Button>
      );
    });
  };

  const renderNumber = () => {
    return (
      <div className="space-y-4">
        <input
          type="number"
          className="w-full p-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="Enter your answer..."
          value={selectedAnswer as number || ''}
          onChange={(e) => !hasSubmitted && setSelectedAnswer(parseInt(e.target.value) || 0)}
          disabled={hasSubmitted}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold capitalize">
              {difficulty} Quiz
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </p>
          </div>
          <Button
            onClick={onBackToMenu}
            variant="ghost"
            size="sm"
          >
            <Home className="w-4 h-4 mr-2" />
            Exit Quiz
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium">
              {Math.round(((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100)}%
            </span>
          </div>
          <Progress 
            value={((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100} 
            className="h-2"
          />
        </div>

        {/* Timer */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${getTimerColor()}`} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Time Remaining
                </span>
              </div>
              <div className={`text-2xl font-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="mt-2">
              <Progress 
                value={(timeRemaining / currentQuestion.timeLimit) * 100} 
                className="h-1"
              />
            </div>
            {timeRemaining <= 10 && (
              <Alert className="mt-2">
                <AlertDescription className="text-red-600 font-medium">
                  ⚠️ Hurry up! Time is running out!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(currentQuestion.type)}</span>
                <div>
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                      {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {currentQuestion.timeLimit}s
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Question Text */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 leading-relaxed">
                {currentQuestion.question}
              </h2>
              {currentQuestion.imageUrl && (
                <img 
                  src={currentQuestion.imageUrl} 
                  alt="Question image" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.type === 'mcq' && renderMCQOptions()}
              {currentQuestion.type === 'true-false' && renderTrueFalse()}
              {currentQuestion.type === 'fill-blank' && renderFillInBlank()}
              {currentQuestion.type === 'multiple-select' && renderMultipleSelect()}
              {currentQuestion.type === 'number' && renderNumber()}
            </div>

            {/* Submit Button */}
            {!hasSubmitted && (
              <Button
                onClick={handleSubmit}
                disabled={
                  selectedAnswer === '' || 
                  (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
                }
                className="w-full"
                size="lg"
              >
                Submit Answer
              </Button>
            )}

            {/* Submitted State */}
            {hasSubmitted && (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-600 font-medium">Answer submitted!</p>
                {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                  <p className="text-sm text-gray-600 mt-1">Moving to next question...</p>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">Finishing quiz...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
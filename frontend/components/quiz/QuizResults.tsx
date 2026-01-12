// src/components/quiz/QuizResults.tsx
import { QuizResult, Quiz } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, RotateCcw, ArrowRight, Home } from 'lucide-react';

interface QuizResultsProps {
  result: QuizResult;
  quiz: Quiz;
  onRetry: () => void;
  onNewQuiz: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onBackToMenu: () => void;
}

export const QuizResults = ({ result, quiz, onRetry, onNewQuiz, onBackToMenu }: QuizResultsProps) => {
  const scorePercentage = (result.score / result.totalQuestions) * 100;

  const getScoreMessage = () => {
    if (scorePercentage >= 90) return 'Outstanding! 🎉';
    if (scorePercentage >= 80) return 'Great job! 👏';
    if (scorePercentage >= 70) return 'Good work! 👍';
    if (scorePercentage >= 50) return 'Not bad! 📚';
    return 'Keep practicing! 💪';
  };

  const getXPEarned = () => {
    if (scorePercentage >= 90) return 200;
    if (scorePercentage >= 80) return 100;
    if (scorePercentage >= 70) return 50;
    return 20;
  };

  const getGrade = () => {
    if (scorePercentage >= 90) return 'A+';
    if (scorePercentage >= 85) return 'A';
    if (scorePercentage >= 80) return 'B+';
    if (scorePercentage >= 75) return 'B';
    if (scorePercentage >= 70) return 'C+';
    if (scorePercentage >= 65) return 'C';
    if (scorePercentage >= 60) return 'D+';
    if (scorePercentage >= 50) return 'D';
    return 'F';
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Results Card */}
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="text-6xl mb-4 animate-bounce">
                    {scorePercentage >= 90 ? '🏆' : scorePercentage >= 70 ? '🌟' : scorePercentage >= 50 ? '📚' : '💪'}
                  </div>
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quiz Complete!
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400">{getScoreMessage()}</p>
                </div>

                {/* Score Display Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/50 border-2 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {result.score}/{result.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Questions Correct</div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(result.score / result.totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-purple-50 dark:bg-purple-900/50 border-2 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform">
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(scorePercentage)}`}>
                      {scorePercentage.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Accuracy</div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                          scorePercentage >= 90 ? 'bg-green-500' : 
                          scorePercentage >= 70 ? 'bg-blue-500' : 
                          scorePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${scorePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/50 border-2 border-green-200 dark:border-green-800 hover:scale-105 transition-transform">
                    <div className={`text-4xl font-bold mb-2 border-2 rounded-lg px-3 py-1 ${getGradeColor(getGrade())}`}>
                      {getGrade()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Final Grade</div>
                    <div className="mt-2 text-xs text-gray-500">
                      {scorePercentage >= 90 ? 'Excellent!' : 
                       scorePercentage >= 80 ? 'Very Good!' : 
                       scorePercentage >= 70 ? 'Good!' : 
                       scorePercentage >= 50 ? 'Fair' : 'Needs Improvement'}
                    </div>
                  </div>
                </div>

                {/* XP Earned Banner */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 border-2 border-yellow-200 dark:border-yellow-800 mb-6">
                  <div className="flex items-center justify-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-600 animate-pulse" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                        +{getXPEarned()} XP Earned!
                      </div>
                      <div className="text-sm text-yellow-600 dark:text-yellow-400">
                        {scorePercentage >= 90 ? 'Perfect Score Bonus!' : 
                         scorePercentage >= 80 ? 'Excellent Performance!' : 
                         scorePercentage >= 70 ? 'Good Job!' : 'Keep Learning!'}
                      </div>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-600 animate-pulse" />
                  </div>
                </div>

                {/* Quiz Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2 justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Target className="w-4 h-4 text-gray-600" />
                    <span>Difficulty: <span className="font-bold capitalize">{quiz.difficulty}</span></span>
                  </div>
                  <div className="flex items-center gap-2 justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span>Total Time: <span className="font-bold">{Math.floor(quiz.timeLimit / 60)}m {quiz.timeLimit % 60}s</span></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={onBackToMenu}
                    variant="outline"
                    className="flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Home className="w-4 h-4" />
                    Back to Menu
                  </Button>
                  <Button
                    onClick={onRetry}
                    variant="outline"
                    className="flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </Button>
                  <Button
                    onClick={() => onNewQuiz('medium')}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                    New Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Question Review */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📝 Question Review
                  <Badge variant="outline">{quiz.questions.length} Questions</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quiz.questions.map((question, index) => {
                    const userAnswer = result.answers[index];
                    const isCorrect = userAnswer?.isCorrect;
                    
                    return (
                      <div 
                        key={question.id}
                        className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                          isCorrect 
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/50' 
                            : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Question Number */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                            isCorrect ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {index + 1}
                          </div>
                          
                          {/* Question Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <p className="font-bold text-lg leading-relaxed">{question.question}</p>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge variant="outline" className="text-xs">
                                  {question.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {question.type}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Answer Comparison */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border">
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Answer:</div>
                                <div className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  {question.type === 'mcq' 
                                    ? question.options?.[userAnswer?.userAnswer as number] || 'No answer'
                                    : question.type === 'true-false'
                                      ? (userAnswer?.userAnswer === 1 ? 'True' : userAnswer?.userAnswer === 0 ? 'False' : 'No answer')
                                      : question.type === 'multiple-select'
                                        ? Array.isArray(userAnswer?.userAnswer) 
                                          ? (userAnswer.userAnswer as number[]).map(idx => question.options?.[idx]).join(', ') || 'No answer'
                                          : 'No answer'
                                      : userAnswer?.userAnswer?.toString() || 'No answer'
                                  }
                                </div>
                              </div>
                              
                              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Correct Answer:</div>
                                <div className="text-green-600 font-medium">
                                  {question.type === 'mcq' 
                                    ? question.options?.[question.correctAnswer as number]
                                    : question.type === 'true-false'
                                      ? (question.correctAnswer === 1 ? 'True' : 'False')
                                      : question.type === 'multiple-select'
                                        ? Array.isArray(question.correctAnswer)
                                          ? (question.correctAnswer as number[]).map(idx => question.options?.[idx]).join(', ')
                                          : question.correctAnswer?.toString()
                                        : question.correctAnswer?.toString()
                                  }
                                </div>
                              </div>
                            </div>

                            {/* Explanation */}
                            {question.explanation && (
                              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-2">
                                  <div className="text-blue-600 font-medium text-sm">💡 Explanation:</div>
                                </div>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                                  {question.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Status Icon */}
                          <div className={`text-3xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            {isCorrect ? '✅' : '❌'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Questions Correct:</span>
                    <span className="font-bold text-green-600">{result.score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Questions Incorrect:</span>
                    <span className="font-bold text-red-600">{result.totalQuestions - result.score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate:</span>
                    <span className={`font-bold ${getScoreColor(scorePercentage)}`}>
                      {scorePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grade:</span>
                    <span className={`font-bold px-2 py-1 rounded ${getGradeColor(getGrade())}`}>
                      {getGrade()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* XP Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⭐ XP Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base Completion:</span>
                    <span className="font-medium">+20 XP</span>
                  </div>
                  {scorePercentage >= 70 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Good Performance (70%+):</span>
                      <span className="font-medium text-yellow-600">+30 XP</span>
                    </div>
                  )}
                  {scorePercentage >= 80 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Great Performance (80%+):</span>
                      <span className="font-medium text-blue-600">+50 XP</span>
                    </div>
                  )}
                  {scorePercentage >= 90 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Perfect Performance (90%+):</span>
                      <span className="font-medium text-green-600">+100 XP</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total XP Earned:</span>
                    <span className="text-yellow-600">+{getXPEarned()} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scorePercentage < 70 && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        💪 Try the same difficulty again to improve your score!
                      </p>
                    </div>
                  )}
                  {scorePercentage >= 80 && quiz.difficulty !== 'hard' && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        🚀 Ready for a harder challenge? Try the next difficulty level!
                      </p>
                    </div>
                  )}
                  {scorePercentage >= 90 && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        🏆 Excellent work! You're becoming a true anime expert!
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={() => onNewQuiz(quiz.difficulty === 'easy' ? 'medium' : quiz.difficulty === 'medium' ? 'hard' : 'easy')}
                    variant="outline"
                    className="w-full"
                  >
                    Try {quiz.difficulty === 'easy' ? 'Medium' : quiz.difficulty === 'medium' ? 'Hard' : 'Easy'} Difficulty
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
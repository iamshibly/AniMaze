import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Brain,
  Wand2,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Trophy,
  Users,
  Save,
  Eye,
  BarChart3
} from 'lucide-react';
import { mockQuizzes } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function QuizManagement() {
  const [quizList, setQuizList] = useState(mockQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
  const { toast } = useToast();

  const filteredQuizzes = quizList.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDifficulty === 'all' || quiz.difficulty === filterDifficulty)
  );

  // Mock AI quiz generation
  const generateAIQuiz = async () => {
    setAiGenerating(true);
    
    // Simulate AI API call
    setTimeout(() => {
      const mockQuiz = {
        title: "Attack on Titan Character Quiz",
        description: "Test your knowledge about Attack on Titan characters",
        difficulty: "medium",
        category: "anime",
        timeLimit: 15,
        questions: [
          {
            question: "Who is the main protagonist of Attack on Titan?",
            options: ["Eren Yeager", "Mikasa Ackerman", "Armin Arlert", "Levi Ackerman"],
            correct: 0
          },
          {
            question: "What is the name of Eren's titan form?",
            options: ["Colossal Titan", "Armored Titan", "Attack Titan", "Beast Titan"],
            correct: 2
          },
          {
            question: "Which district was first attacked by titans?",
            options: ["Wall Maria", "Wall Rose", "Wall Sina", "Shiganshina"],
            correct: 3
          }
        ]
      };
      setGeneratedQuiz(mockQuiz);
      setAiGenerating(false);
    }, 2000);
  };

  const handleSaveQuiz = (quizData: any) => {
    if (editingQuiz) {
      // Update existing quiz
      setQuizList(prev => prev.map(q => q.id === editingQuiz.id ? { ...q, ...quizData } : q));
      toast({
        title: "Success",
        description: "Quiz updated successfully",
      });
    } else {
      // Create new quiz
      const newQuiz = {
        id: Date.now().toString(),
        ...quizData,
        createdAt: new Date(), // Fixed: use createdAt instead of created_at
        status: 'published',
        type: quizData.category
      };
      setQuizList(prev => [...prev, newQuiz]);
      toast({
        title: "Success",
        description: "Quiz created successfully",
      });
    }
    
    setIsCreating(false);
    setEditingQuiz(null);
    setGeneratedQuiz(null);
  };

  const handleEditQuiz = (quiz: any) => {
    setEditingQuiz(quiz);
    setIsCreating(true);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizList(prev => prev.filter(q => q.id !== quizId));
    toast({
      title: "Success",
      description: "Quiz deleted successfully",
    });
  };

  const QuizForm = ({ quiz = null }: { quiz?: any }) => {
    const [formData, setFormData] = useState({
      title: quiz?.title || generatedQuiz?.title || '',
      description: quiz?.description || generatedQuiz?.description || '',
      difficulty: quiz?.difficulty || generatedQuiz?.difficulty || 'easy',
      category: quiz?.category || generatedQuiz?.category || 'anime',
      timeLimit: quiz?.timeLimit || generatedQuiz?.timeLimit || 10
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.title.trim() || !formData.description.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      handleSaveQuiz(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Quiz Title *</Label>
            <Input 
              id="quiz-title" 
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter quiz title"
              title="Enter a descriptive title for your quiz"
              required
              aria-describedby="quiz-title-help"
            />
            <p id="quiz-title-help" className="text-xs text-muted-foreground">
              Choose a clear and engaging title for your quiz
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiz-difficulty">Difficulty Level *</Label>
            <Select 
              value={formData.difficulty} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
            >
              <SelectTrigger id="quiz-difficulty" title="Select difficulty level for this quiz">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quiz-description">Description *</Label>
          <Textarea 
            id="quiz-description" 
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            placeholder="Describe what this quiz covers"
            title="Provide a detailed description of the quiz content"
            required
            aria-describedby="quiz-description-help"
          />
          <p id="quiz-description-help" className="text-xs text-muted-foreground">
            Explain what topics this quiz covers and what users can expect
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-category">Category *</Label>
            <Select 
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger id="quiz-category" title="Select the main category for this quiz">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="manga">Manga</SelectItem>
                <SelectItem value="characters">Characters</SelectItem>
                <SelectItem value="general">General Knowledge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiz-time-limit">Time Limit (minutes)</Label>
            <Input 
              id="quiz-time-limit" 
              type="number" 
              min="1"
              max="60"
              value={formData.timeLimit}
              onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 10 }))}
              placeholder="10"
              title="Set time limit for quiz completion in minutes"
              aria-describedby="quiz-time-help"
            />
            <p id="quiz-time-help" className="text-xs text-muted-foreground">
              Optional: Set a time limit for completing the quiz
            </p>
          </div>
        </div>

        {/* Questions Section */}
        {generatedQuiz?.questions && (
          <div className="space-y-4">
            <Label>Generated Questions</Label>
            <div className="space-y-3">
              {generatedQuiz.questions.map((question: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <Label className="font-medium">Question {index + 1}</Label>
                    <p className="text-sm">{question.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {question.options.map((option: string, optIndex: number) => (
                        <div key={optIndex} className={`p-2 rounded text-xs ${optIndex === question.correct ? 'bg-green-100 border border-green-300' : 'bg-gray-100'}`}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {optIndex === question.correct && <span className="text-green-600 ml-2">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {editingQuiz ? 'Update Quiz' : 'Save Quiz'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setIsCreating(false);
              setEditingQuiz(null);
              setGeneratedQuiz(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quiz Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage quizzes for the platform
          </p>
        </div>
        
        {!isCreating && (
          <div className="flex gap-2">
            <Button onClick={generateAIQuiz} disabled={aiGenerating} variant="outline">
              <Wand2 className="h-4 w-4 mr-2" />
              {aiGenerating ? 'Generating...' : 'AI Generate'}
            </Button>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        )}
      </div>

      {/* AI Generation Status */}
      {aiGenerating && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            AI is generating a quiz based on popular anime content. This may take a moment...
          </AlertDescription>
        </Alert>
      )}

      {/* Generated Quiz Preview */}
      {generatedQuiz && !isCreating && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">AI Generated Quiz Ready!</CardTitle>
            <CardDescription className="text-green-700">
              Review the generated quiz and customize it if needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold">{generatedQuiz.title}</h3>
              <p className="text-sm text-muted-foreground">{generatedQuiz.description}</p>
              <div className="flex gap-2">
                <Badge>{generatedQuiz.difficulty}</Badge>
                <Badge variant="outline">{generatedQuiz.questions.length} questions</Badge>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setIsCreating(true)}>
                Edit & Customize
              </Button>
              <Button variant="outline" onClick={() => setGeneratedQuiz(null)}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizForm quiz={editingQuiz} />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search and Filters - Fixed version with proper labels */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="quiz-search" className="sr-only">
                    Search quizzes
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="quiz-search"
                      placeholder="Search quizzes..."
                      title="Search through available quizzes"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      aria-label="Search quizzes by title or description"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="difficulty-filter" className="sr-only">
                    Filter by difficulty
                  </Label>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger id="difficulty-filter" className="w-[180px]" title="Filter quizzes by difficulty level">
                      <SelectValue placeholder="Filter by difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="published" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="published">
              <Card>
                <CardHeader>
                  <CardTitle>Published Quizzes</CardTitle>
                  <CardDescription>Live quizzes available to users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Success Rate</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuizzes.map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{quiz.title}</p>
                              <p className="text-sm text-muted-foreground">{quiz.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{quiz.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={quiz.difficulty === 'hard' ? 'destructive' : 
                                     quiz.difficulty === 'medium' ? 'default' : 'secondary'}
                            >
                              {quiz.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell>{quiz.questions?.length || 0}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {Math.floor(Math.random() * 1000)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              {Math.floor(Math.random() * 40 + 60)}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Edit quiz"
                                onClick={() => handleEditQuiz(quiz)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="View quiz"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Delete quiz"
                                onClick={() => handleDeleteQuiz(quiz.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approval</CardTitle>
                  <CardDescription>Quizzes waiting for review and approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No quizzes pending approval</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{quizList.length}</div>
                    <p className="text-xs text-muted-foreground">
                      +2 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,543</div>
                    <p className="text-xs text-muted-foreground">
                      +15.2% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Success Rate</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">74.2%</div>
                    <p className="text-xs text-muted-foreground">
                      +5.1% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics Table */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Detailed Quiz Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quiz Title</TableHead>
                        <TableHead>Total Attempts</TableHead>
                        <TableHead>Completion Rate</TableHead>
                        <TableHead>Average Score</TableHead>
                        <TableHead>Best Score</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuizzes.slice(0, 5).map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell className="font-medium">{quiz.title}</TableCell>
                          <TableCell>{Math.floor(Math.random() * 500) + 100}</TableCell>
                          <TableCell>{Math.floor(Math.random() * 30 + 70)}%</TableCell>
                          <TableCell>{Math.floor(Math.random() * 40 + 60)}%</TableCell>
                          <TableCell>{Math.floor(Math.random() * 20 + 80)}%</TableCell>
                          <TableCell>{new Date(quiz.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
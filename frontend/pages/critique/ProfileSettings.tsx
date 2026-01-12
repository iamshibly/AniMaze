// src/pages/critique/ProfileSettings.tsx - Complete Profile Management
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Camera,
  Save,
  Bell,
  Shield,
  Eye,
  Globe,
  Lock,
  Mail,
  Smartphone,
  Star,
  Award,
  TrendingUp,
  Calendar,
  Edit3,
  CheckCircle,
  AlertCircle,
  Settings,
  Heart,
  BookOpen,
  Video,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CritiqueLayout from '@/components/CritiqueLayout';

// Profile Settings Content Component
const ProfileSettingsContent = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    website: '',
    location: '',
    favoriteGenres: [] as string[],
    socialLinks: {
      twitter: '',
      youtube: '',
      instagram: '',
      mal: ''
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showStats: true,
      allowMessages: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      submissionUpdates: true,
      communityUpdates: false,
      marketingEmails: false
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Available genres
  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural',
    'Thriller', 'Historical', 'Musical', 'Psychological'
  ];

  // Profile stats (dummy + real data)
  const profileStats = {
    reviewsPublished: 47,
    totalViews: 18420,
    averageRating: 8.4,
    followers: 234,
    profileViews: 1520,
    joinDate: 'March 2024',
    verificationLevel: 'Verified Critic',
    expertiseAreas: ['Shonen', 'Seinen', 'Psychological Thriller']
  };

  useEffect(() => {
    // Load user profile data when component mounts
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev] as any,
        [field]: value
      }
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-lg text-gray-600">Manage your critic profile and preferences</p>
        </div>
        <Badge variant="outline" className="mt-4 lg:mt-0">
          <CheckCircle className="w-3 h-3 mr-1" />
          {profileStats.verificationLevel}
        </Badge>
      </div>

      {/* Profile Overview Card */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {user?.name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full p-2">
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Critic Name'}</h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {profileStats.expertiseAreas.map((area, index) => (
                  <Badge key={index} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{profileStats.reviewsPublished}</div>
                  <div className="text-xs text-gray-600">Reviews</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{profileStats.totalViews.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{profileStats.averageRating}</div>
                  <div className="text-xs text-gray-600">Avg Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{profileStats.followers}</div>
                  <div className="text-xs text-gray-600">Followers</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>Update your public profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell others about yourself and your anime/manga interests..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Your location (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://your-website.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Social Links
                </CardTitle>
                <CardDescription>Connect your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'twitter', e.target.value)}
                    placeholder="@yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'youtube', e.target.value)}
                    placeholder="YouTube channel URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'instagram', e.target.value)}
                    placeholder="@yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mal">MyAnimeList</Label>
                  <Input
                    id="mal"
                    value={formData.socialLinks.mal}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'mal', e.target.value)}
                    placeholder="MAL profile URL"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Favorite Genres */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Favorite Genres
              </CardTitle>
              <CardDescription>Select your favorite anime and manga genres (up to 8)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={formData.favoriteGenres.includes(genre) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      formData.favoriteGenres.includes(genre)
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Selected: {formData.favoriteGenres.length}/8
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={loading} className="px-8">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Content Preferences
              </CardTitle>
              <CardDescription>Customize your content creation experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-save drafts</Label>
                  <p className="text-sm text-gray-600">Automatically save your work as you type</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Rich text editor</Label>
                  <p className="text-sm text-gray-600">Use advanced formatting tools</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Default content visibility</Label>
                <Select defaultValue="public">
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Preferred content language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="bn">Bengali</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={formData.notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('notifications', 'emailNotifications', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Push Notifications
                  </Label>
                  <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                </div>
                <Switch
                  checked={formData.notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('notifications', 'pushNotifications', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submission Updates
                  </Label>
                  <p className="text-sm text-gray-600">Notifications about your submission status</p>
                </div>
                <Switch
                  checked={formData.notifications.submissionUpdates}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('notifications', 'submissionUpdates', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Community Updates
                  </Label>
                  <p className="text-sm text-gray-600">Updates about community features and events</p>
                </div>
                <Switch
                  checked={formData.notifications.communityUpdates}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('notifications', 'communityUpdates', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Marketing Emails
                  </Label>
                  <p className="text-sm text-gray-600">Promotional content and feature updates</p>
                </div>
                <Switch
                  checked={formData.notifications.marketingEmails}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('notifications', 'marketingEmails', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications} disabled={loading} className="px-8">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control your privacy and profile visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Public Profile
                  </Label>
                  <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                </div>
                <Switch
                  checked={formData.privacy.profileVisible}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('privacy', 'profileVisible', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Show Email
                  </Label>
                  <p className="text-sm text-gray-600">Display your email address on your profile</p>
                </div>
                <Switch
                  checked={formData.privacy.showEmail}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('privacy', 'showEmail', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                     📊 Show Statistics
                    </Label>
                  <p className="text-sm text-gray-600">Display your review statistics publicly</p>
                </div>
                <Switch
                  checked={formData.privacy.showStats}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('privacy', 'showStats', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Allow Messages
                  </Label>
                  <p className="text-sm text-gray-600">Allow other users to send you messages</p>
                </div>
                <Switch
                  checked={formData.privacy.allowMessages}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('privacy', 'allowMessages', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Account Security
              </CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Two-Factor Authentication
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Download My Data
              </Button>

              <Separator />

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Account Deletion:</strong> If you want to delete your account, please contact our support team. This action cannot be undone.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main ProfileSettings Component with Layout
const ProfileSettings = () => {
  return (
    <CritiqueLayout>
      <ProfileSettingsContent />
    </CritiqueLayout>
  );
};

export default ProfileSettings;
// src/pages/user/ProfileSettings.tsx - COMPLETE FUNCTIONAL VERSION
// Replace your ENTIRE ProfileSettings.tsx file with this version

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Bell, 
  Save, 
  CheckCircle,
  AlertCircle,
  Shield,
  Crown,
  Eye,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Available genres for selection
const GENRE_OPTIONS = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 
  'Supernatural', 'Thriller', 'Historical', 'Mecha', 'Shounen',
  'Shoujo', 'Seinen', 'Josei', 'Isekai'
];

export default function ProfileSettings() {
  const { user, updateProfile, isPremium } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    favorite_genres: [] as string[],
    notification_preferences: {
      email: true,
      push: true,
      in_app: true,
      anime_updates: true,
      manga_updates: true,
      quiz_notifications: true
    },
    privacy_settings: {
      profile_visibility: 'public',
      show_activity: true,
      show_watchlist: true
    }
  });

  useEffect(() => {
    if (user) {
      // Load saved profile data from localStorage
      const savedProfile = localStorage.getItem(`user_profile_${user.id}`);
      let savedData = { bio: '', favorite_genres: [] };
      
      if (savedProfile) {
        try {
          savedData = JSON.parse(savedProfile);
        } catch (error) {
          console.error('Error parsing saved profile:', error);
        }
      }

      setFormData({
        name: user.name || '',
        bio: savedData.bio || '',
        favorite_genres: savedData.favorite_genres || [],
        notification_preferences: {
          email: true,
          push: true,
          in_app: true,
          anime_updates: true,
          manga_updates: true,
          quiz_notifications: true
        },
        privacy_settings: {
          profile_visibility: 'public',
          show_activity: true,
          show_watchlist: true
        }
      });
    }
  }, [user]);

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      favorite_genres: prev.favorite_genres.includes(genre)
        ? prev.favorite_genres.filter(g => g !== genre)
        : [...prev.favorite_genres, genre]
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      privacy_settings: {
        ...prev.privacy_settings,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Update the user's name through the auth system
      const { error } = await updateProfile({
        name: formData.name
      });

      if (error) {
        throw new Error(error);
      }

      // Save bio and favorite genres to localStorage since they're not in the User interface
      const userProfileData = {
        userId: user?.id,
        bio: formData.bio,
        favorite_genres: formData.favorite_genres,
        notification_preferences: formData.notification_preferences,
        privacy_settings: formData.privacy_settings,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(`user_profile_${user?.id}`, JSON.stringify(userProfileData));

      setMessage('Profile updated successfully!');
      toast({
        title: "Profile updated",
        description: "Your profile, bio, and favorite genres have been saved",
      });
    } catch (error: any) {
      setMessage('Failed to update profile');
      toast({
        title: "Update failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    const name = user?.name || user?.email || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
          Profile Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account information, preferences, and privacy settings
        </p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.includes('successfully') ? 'border-green-500' : 'border-red-500'}`}>
          {message.includes('successfully') ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Overview Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={user?.avatar_url} alt={user?.name || ''} />
                <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-purple-600 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {user?.name || 'User'}
                </h3>
                
                <div className="flex justify-center mb-3">
                  {user?.role === 'critique' ? (
                    <Badge className="bg-purple-100 text-purple-700">
                      <Shield className="w-3 h-3 mr-1" />
                      Content Creator
                    </Badge>
                  ) : user?.role === 'admin' ? (
                    <Badge className="bg-red-100 text-red-700">
                      <Shield className="w-3 h-3 mr-1" />
                      Administrator
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-700">
                      <User className="w-3 h-3 mr-1" />
                      Member
                    </Badge>
                  )}
                </div>

                {isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-3">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                
                <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
                
                <div className="text-sm space-y-2 bg-muted/30 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium">{user?.level || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">XP:</span>
                    <span className="font-medium">{user?.xp || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your display name"
                      className="transition-colors focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed from this page
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself, your favorite anime, what got you into anime/manga..."
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Share your anime journey and interests with the community
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Favorite Genres */}
            <Card>
              <CardHeader>
                <CardTitle>Favorite Genres</CardTitle>
                <CardDescription>
                  Select your favorite anime and manga genres for personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {GENRE_OPTIONS.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={genre}
                        checked={formData.favorite_genres.includes(genre)}
                        onCheckedChange={() => handleGenreToggle(genre)}
                      />
                      <Label 
                        htmlFor={genre} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {genre}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.favorite_genres.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Selected genres ({formData.favorite_genres.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.favorite_genres.map((genre) => (
                        <Badge 
                          key={genre} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  Your preferences help us recommend content you'll love
                </p>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={formData.notification_preferences.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={formData.notification_preferences.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="anime-updates">Anime Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        New episodes and anime announcements
                      </p>
                    </div>
                    <Switch
                      id="anime-updates"
                      checked={formData.notification_preferences.anime_updates}
                      onCheckedChange={(checked) => handleNotificationChange('anime_updates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="manga-updates">Manga Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        New chapters and manga announcements
                      </p>
                    </div>
                    <Switch
                      id="manga-updates"
                      checked={formData.notification_preferences.manga_updates}
                      onCheckedChange={(checked) => handleNotificationChange('manga_updates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="quiz-notifications">Quiz & Achievement Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        New quizzes, badges, and achievements
                      </p>
                    </div>
                    <Switch
                      id="quiz-notifications"
                      checked={formData.notification_preferences.quiz_notifications}
                      onCheckedChange={(checked) => handleNotificationChange('quiz_notifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your profile and activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-activity">Show Activity</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your recent activity
                      </p>
                    </div>
                    <Switch
                      id="show-activity"
                      checked={formData.privacy_settings.show_activity}
                      onCheckedChange={(checked) => handlePrivacyChange('show_activity', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-watchlist">Public Watchlist</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your watchlist visible to other users
                      </p>
                    </div>
                    <Switch
                      id="show-watchlist"
                      checked={formData.privacy_settings.show_watchlist}
                      onCheckedChange={(checked) => handlePrivacyChange('show_watchlist', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading}
                className="px-8"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
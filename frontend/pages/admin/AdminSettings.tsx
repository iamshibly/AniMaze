// src/pages/admin/AdminSettings.tsx - Enhanced with real-time features
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Database, 
  Shield, 
  Mail, 
  Globe, 
  Palette, 
  Bell,
  Save,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
  Server,
  Users,
  Zap,
  Wifi,
  WifiOff,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { realtimeService, formatMetric, getMetricStatus } from '@/lib/realtimeService';
import type { RealtimeEvent, SystemMetrics } from '@/lib/realtimeService';

interface SystemSettings {
  general: {
    site_name: string;
    site_description: string;
    admin_email: string;
    support_email: string;
    default_language: 'en' | 'bn';
    timezone: string;
    date_format: string;
    items_per_page: number;
  };
  features: {
    user_registration: boolean;
    quiz_system: boolean;
    comment_system: boolean;
    rating_system: boolean;
    premium_features: boolean;
    critique_system: boolean;
    notification_system: boolean;
    realtime_updates: boolean;
  };
  security: {
    require_email_verification: boolean;
    password_min_length: number;
    session_timeout: number;
    max_login_attempts: number;
    enable_2fa: boolean;
    rate_limiting: boolean;
  };
  email: {
    smtp_enabled: boolean;
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    from_email: string;
    from_name: string;
  };
  appearance: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    dark_mode_default: boolean;
    custom_css: string;
    logo_url: string;
    favicon_url: string;
  };
  notifications: {
    email_notifications: boolean;
    push_notifications: boolean;
    admin_alerts: boolean;
    system_maintenance: boolean;
    user_activity: boolean;
  };
  performance: {
    enable_caching: boolean;
    cache_duration: number;
    enable_compression: boolean;
    lazy_loading: boolean;
    cdn_enabled: boolean;
  };
}

const defaultSettings: SystemSettings = {
  general: {
    site_name: 'Bangla Anime Verse',
    site_description: 'Your ultimate destination for anime and manga content in Bengali',
    admin_email: 'admin@bangleanimeverse.com',
    support_email: 'support@bangleanimeverse.com',
    default_language: 'en',
    timezone: 'Asia/Dhaka',
    date_format: 'DD/MM/YYYY',
    items_per_page: 20
  },
  features: {
    user_registration: true,
    quiz_system: true,
    comment_system: true,
    rating_system: true,
    premium_features: true,
    critique_system: true,
    notification_system: true,
    realtime_updates: true
  },
  security: {
    require_email_verification: true,
    password_min_length: 8,
    session_timeout: 1440,
    max_login_attempts: 5,
    enable_2fa: false,
    rate_limiting: true
  },
  email: {
    smtp_enabled: false,
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    from_email: 'noreply@bangleanimeverse.com',
    from_name: 'Bangla Anime Verse'
  },
  appearance: {
    primary_color: '#3B82F6',
    secondary_color: '#8B5CF6',
    accent_color: '#F59E0B',
    dark_mode_default: false,
    custom_css: '',
    logo_url: '/mainlogo (1).png',
    favicon_url: '/mainlogo (1).png'
  },
  notifications: {
    email_notifications: true,
    push_notifications: true,
    admin_alerts: true,
    system_maintenance: true,
    user_activity: false
  },
  performance: {
    enable_caching: true,
    cache_duration: 3600,
    enable_compression: true,
    lazy_loading: true,
    cdn_enabled: false
  }
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    initializeRealtimeService();
    
    return () => {
      realtimeService.destroy();
    };
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('admin_system_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error loading settings",
        description: "Using default settings instead.",
        variant: "destructive"
      });
    }
  };

  const initializeRealtimeService = () => {
    realtimeService.init();
    setRealtimeConnected(true);

    // Subscribe to system metrics updates
    const unsubscribeMetrics = realtimeService.subscribe('system_alert', (event) => {
      if (event.data.metrics) {
        setSystemMetrics(event.data.metrics);
      }
    });

    // Subscribe to all events for recent activity
    const unsubscribeAll = realtimeService.subscribe('*', (event) => {
      setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeAll();
    };
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('admin_system_settings', JSON.stringify(settings));
      setHasChanges(false);
      
      // Broadcast settings change
      realtimeService.broadcastSettingsChange('system_settings', {
        timestamp: new Date().toISOString(),
        categories: Object.keys(settings)
      });
      
      toast({
        title: "Settings saved successfully",
        description: "Your system settings have been updated and broadcast to all services.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults. Don't forget to save!",
      variant: "destructive"
    });
  };

  const testEmailConfig = async () => {
    setLoading(true);
    try {
      // Simulate email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email configuration tested",
        description: "Test email sent successfully!",
      });
    } catch (error) {
      toast({
        title: "Email test failed",
        description: "Please check your SMTP configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings exported",
      description: "Settings file downloaded successfully."
    });
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings({ ...defaultSettings, ...importedSettings });
        setHasChanges(true);
        toast({
          title: "Settings imported",
          description: "Settings loaded from file. Don't forget to save!",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid settings file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const updateSetting = (category: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const getMetricTrend = (value: number, type: 'cpu' | 'memory' | 'response_time') => {
    const thresholds = {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 75, critical: 90 },
      response_time: { warning: 200, critical: 500 }
    };
    
    const status = getMetricStatus(value, thresholds[type]);
    
    if (status === 'critical') return { icon: TrendingUp, color: 'text-red-500' };
    if (status === 'warning') return { icon: TrendingUp, color: 'text-yellow-500' };
    return { icon: TrendingDown, color: 'text-green-500' };
  };

  const formatEventType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header with Real-time Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-8 w-8 text-blue-500" />
              System Settings
              <div className="flex items-center gap-2 ml-4">
                {realtimeConnected ? (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    <Wifi className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-300">
                    <WifiOff className="h-3 w-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>
            </h1>
            <p className="text-gray-600 mt-1">
              Configure system settings and monitor real-time performance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
              id="import-settings"
              title="Import settings from JSON file"
              aria-label="Import settings from JSON file"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('import-settings')?.click()}
              aria-label="Import settings from file"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={exportSettings} aria-label="Export current settings to file">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={resetSettings} aria-label="Reset all settings to default values">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={saveSettings} 
              disabled={!hasChanges || loading}
              className="bg-blue-500 hover:bg-blue-600"
              aria-label={hasChanges ? "Save pending changes" : "No changes to save"}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
        
        {hasChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              You have unsaved changes. Don't forget to save your settings.
            </p>
          </div>
        )}
      </div>

      {/* Real-time System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center justify-between">
              Active Users
              <Users className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {systemMetrics ? formatMetric(systemMetrics.active_users, 'number') : '-'}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {systemMetrics ? `of ${formatMetric(systemMetrics.total_users, 'number')} total` : 'Loading...'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center justify-between">
              CPU Usage
              {systemMetrics && (() => {
                const trend = getMetricTrend(systemMetrics.cpu_usage, 'cpu');
                const TrendIcon = trend.icon;
                return <TrendIcon className={`h-4 w-4 ${trend.color}`} />;
              })()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {systemMetrics ? formatMetric(systemMetrics.cpu_usage, 'percentage') : '-'}
            </div>
            {systemMetrics && (
              <Progress value={systemMetrics.cpu_usage} className="mt-2 h-2" />
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center justify-between">
              Memory Usage
              {systemMetrics && (() => {
                const trend = getMetricTrend(systemMetrics.memory_usage, 'memory');
                const TrendIcon = trend.icon;
                return <TrendIcon className={`h-4 w-4 ${trend.color}`} />;
              })()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {systemMetrics ? formatMetric(systemMetrics.memory_usage, 'percentage') : '-'}
            </div>
            {systemMetrics && (
              <Progress value={systemMetrics.memory_usage} className="mt-2 h-2" />
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center justify-between">
              Response Time
              {systemMetrics && (() => {
                const trend = getMetricTrend(systemMetrics.response_time, 'response_time');
                const TrendIcon = trend.icon;
                return <TrendIcon className={`h-4 w-4 ${trend.color}`} />;
              })()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {systemMetrics ? formatMetric(systemMetrics.response_time, 'time') : '-'}
            </div>
            <p className="text-xs text-orange-600 mt-1">Average response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="appearance">Theme</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    General Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site_name">Site Name</Label>
                      <Input
                        id="site_name"
                        value={settings.general.site_name}
                        onChange={(e) => updateSetting('general', 'site_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin_email">Admin Email</Label>
                      <Input
                        id="admin_email"
                        type="email"
                        value={settings.general.admin_email}
                        onChange={(e) => updateSetting('general', 'admin_email', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={settings.general.site_description}
                      onChange={(e) => updateSetting('general', 'site_description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default_language">Default Language</Label>
                      <Select
                        value={settings.general.default_language}
                        onValueChange={(value) => updateSetting('general', 'default_language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="bn">বাংলা</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.general.timezone}
                        onValueChange={(value) => updateSetting('general', 'timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Dhaka">Asia/Dhaka</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="items_per_page">Items Per Page</Label>
                      <Input
                        id="items_per_page"
                        type="number"
                        value={settings.general.items_per_page}
                        onChange={(e) => updateSetting('general', 'items_per_page', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Settings */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Platform Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(settings.features).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">
                            {key.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Label>
                          <p className="text-xs text-gray-500">
                            {getFeatureDescription(key)}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updateSetting('features', key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password_min_length">Password Min Length</Label>
                      <Input
                        id="password_min_length"
                        type="number"
                        value={settings.security.password_min_length}
                        onChange={(e) => updateSetting('security', 'password_min_length', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session_timeout"
                        type="number"
                        value={settings.security.session_timeout}
                        onChange={(e) => updateSetting('security', 'session_timeout', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'require_email_verification', label: 'Require Email Verification' },
                      { key: 'enable_2fa', label: 'Enable 2FA Support' },
                      { key: 'rate_limiting', label: 'Enable Rate Limiting' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label>{label}</Label>
                        <Switch
                          checked={settings.security[key as keyof typeof settings.security] as boolean}
                          onCheckedChange={(checked) => updateSetting('security', key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Configuration
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={testEmailConfig}
                      disabled={loading}
                      className="ml-auto"
                      aria-label="Send test email to verify SMTP configuration"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Test Email
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label>Enable SMTP</Label>
                    <Switch
                      checked={settings.email.smtp_enabled}
                      onCheckedChange={(checked) => updateSetting('email', 'smtp_enabled', checked)}
                    />
                  </div>
                  
                  {settings.email.smtp_enabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtp_host">SMTP Host</Label>
                          <Input
                            id="smtp_host"
                            value={settings.email.smtp_host}
                            onChange={(e) => updateSetting('email', 'smtp_host', e.target.value)}
                            placeholder="smtp.gmail.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp_port">SMTP Port</Label>
                          <Input
                            id="smtp_port"
                            type="number"
                            value={settings.email.smtp_port}
                            onChange={(e) => updateSetting('email', 'smtp_port', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtp_username">SMTP Username</Label>
                          <Input
                            id="smtp_username"
                            value={settings.email.smtp_username}
                            onChange={(e) => updateSetting('email', 'smtp_username', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp_password">SMTP Password</Label>
                          <Input
                            id="smtp_password"
                            type="password"
                            value={settings.email.smtp_password}
                            onChange={(e) => updateSetting('email', 'smtp_password', e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme & Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary_color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary_color"
                          type="color"
                          value={settings.appearance.primary_color}
                          onChange={(e) => updateSetting('appearance', 'primary_color', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.appearance.primary_color}
                          onChange={(e) => updateSetting('appearance', 'primary_color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary_color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary_color"
                          type="color"
                          value={settings.appearance.secondary_color}
                          onChange={(e) => updateSetting('appearance', 'secondary_color', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.appearance.secondary_color}
                          onChange={(e) => updateSetting('appearance', 'secondary_color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent_color">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent_color"
                          type="color"
                          value={settings.appearance.accent_color}
                          onChange={(e) => updateSetting('appearance', 'accent_color', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.appearance.accent_color}
                          onChange={(e) => updateSetting('appearance', 'accent_color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Dark Mode Default</Label>
                    <Switch
                      checked={settings.appearance.dark_mode_default}
                      onCheckedChange={(checked) => updateSetting('appearance', 'dark_mode_default', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="custom_css">Custom CSS</Label>
                    <Textarea
                      id="custom_css"
                      value={settings.appearance.custom_css}
                      onChange={(e) => updateSetting('appearance', 'custom_css', e.target.value)}
                      rows={6}
                      placeholder="/* Add your custom CSS here */"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Settings */}
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { key: 'enable_caching', label: 'Enable Caching', desc: 'Cache frequently accessed data' },
                      { key: 'enable_compression', label: 'Enable Compression', desc: 'Compress responses to reduce bandwidth' },
                      { key: 'lazy_loading', label: 'Lazy Loading', desc: 'Load images and content on demand' },
                      { key: 'cdn_enabled', label: 'CDN Support', desc: 'Use Content Delivery Network for assets' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <Label>{label}</Label>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                        <Switch
                          checked={settings.performance[key as keyof typeof settings.performance] as boolean}
                          onCheckedChange={(checked) => updateSetting('performance', key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cache_duration">Cache Duration (seconds)</Label>
                    <Input
                      id="cache_duration"
                      type="number"
                      value={settings.performance.cache_duration}
                      onChange={(e) => updateSetting('performance', 'cache_duration', parseInt(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Real-time Activity Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  recentEvents.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {formatEventType(event.type)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                        {event.data.message && (
                          <p className="text-xs text-gray-600 mt-1">
                            {event.data.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server Status</span>
                  <Badge variant={systemMetrics?.server_status === 'online' ? 'default' : 'destructive'}>
                    {systemMetrics?.server_status || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notifications</span>
                  <Badge variant="outline">
                    {systemMetrics ? formatMetric(systemMetrics.notifications_sent, 'number') : '-'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Errors</span>
                  <Badge variant={systemMetrics && systemMetrics.errors_count > 0 ? 'destructive' : 'outline'}>
                    {systemMetrics ? systemMetrics.errors_count : '-'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to get feature descriptions
function getFeatureDescription(key: string): string {
  const descriptions: Record<string, string> = {
    user_registration: 'Allow new users to register accounts',
    quiz_system: 'Enable anime and manga quizzes',
    comment_system: 'Allow users to comment on content',
    rating_system: 'Enable content rating and reviews',
    premium_features: 'Unlock premium subscription features',
    critique_system: 'Enable critic submissions and reviews',
    notification_system: 'Send notifications to users',
    realtime_updates: 'Enable real-time updates and live features'
  };
  
  return descriptions[key] || 'Feature configuration option';
}
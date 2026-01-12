// src/components/quiz/APIStatusIndicator.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Wifi, WifiOff } from 'lucide-react';

interface APIStatus {
  isOnline: boolean;
  lastChecked: Date | null;
  responseTime: number | null;
  error: string | null;
}

export const APIStatusIndicator = () => {
  const [status, setStatus] = useState<APIStatus>({
    isOnline: false,
    lastChecked: null,
    responseTime: null,
    error: null
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkAPIStatus = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        setStatus({
          isOnline: true,
          lastChecked: new Date(),
          responseTime,
          error: null
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log('API health check failed:', error);
      setStatus({
        isOnline: false,
        lastChecked: new Date(),
        responseTime: null,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAPIStatus();
    const interval = setInterval(checkAPIStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isChecking) return 'text-yellow-500';
    return status.isOnline ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = () => {
    if (isChecking) return <Clock className="w-4 h-4 animate-spin" />;
    if (status.isOnline) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking...';
    if (status.isOnline) {
      return `Online ${status.responseTime ? `(${status.responseTime}ms)` : ''}`;
    }
    return 'Offline - Using mock data';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">🌐 API Status</CardTitle>
          <Button
            onClick={checkAPIStatus}
            disabled={isChecking}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <div className={getStatusColor()}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            {status.lastChecked && (
              <div className="text-xs text-gray-500">
                Last checked: {status.lastChecked.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Backend:</span>
            <span className={status.isOnline ? 'text-green-600' : 'text-red-600'}>
              {status.isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Quiz Mode:</span>
            <span className={status.isOnline ? 'text-blue-600' : 'text-yellow-600'}>
              {status.isOnline ? 'AI Generated' : 'Mock Data'}
            </span>
          </div>
        </div>

        {!status.isOnline && (
          <div className="mt-3 p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              💡 Start the backend server to enable AI-generated quizzes!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
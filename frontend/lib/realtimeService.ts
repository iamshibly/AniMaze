// src/lib/realtimeService.ts - Real-time updates simulation service
import { getFromStorage, saveToStorage, generateId } from './localStorage';

// =====================================
// REAL-TIME EVENT TYPES
// =====================================

export type EventType = 'notification_sent' | 'user_online' | 'system_alert' | 'settings_changed' | 'new_user' | 'quiz_completed';

export interface RealtimeEvent {
  id: string;
  type: EventType;
  data: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SystemMetrics {
  active_users: number;
  total_users: number;
  server_status: 'online' | 'maintenance' | 'error';
  cpu_usage: number;
  memory_usage: number;
  response_time: number;
  notifications_sent: number;
  errors_count: number;
  last_updated: string;
}

export interface LiveNotificationStatus {
  id: string;
  title: string;
  status: 'sending' | 'sent' | 'failed';
  sent_count: number;
  total_recipients: number;
  progress: number;
  started_at: string;
  completed_at?: string;
}

// =====================================
// REAL-TIME SERVICE
// =====================================

class RealtimeService {
  private listeners: Map<string, ((event: RealtimeEvent) => void)[]> = new Map();
  private systemMetricsInterval: NodeJS.Timeout | null = null;
  private isConnected = false;
  private eventHistory: RealtimeEvent[] = [];

  // Initialize the service
  init() {
    if (this.isConnected) return;
    
    this.isConnected = true;
    this.startSystemMetricsUpdates();
    this.simulateRealtimeEvents();
    
    console.log('🔴 Real-time service initialized');
  }

  // Clean up resources
  destroy() {
    if (this.systemMetricsInterval) {
      clearInterval(this.systemMetricsInterval);
    }
    this.listeners.clear();
    this.isConnected = false;
    
    console.log('⚫ Real-time service destroyed');
  }

  // Subscribe to events
  subscribe(eventType: EventType | '*', callback: (event: RealtimeEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // Emit event to subscribers
  private emit(event: RealtimeEvent) {
    // Add to history
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(0, 100);
    }

    // Notify subscribers
    const callbacks = this.listeners.get(event.type) || [];
    const allCallbacks = this.listeners.get('*') || [];
    
    [...callbacks, ...allCallbacks].forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in realtime callback:', error);
      }
    });
  }

  // Get current system metrics
  getSystemMetrics(): SystemMetrics {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate realistic metrics based on time of day
    const baseActiveUsers = 50;
    const peakMultiplier = (hour >= 18 && hour <= 22) ? 3 : 
                          (hour >= 12 && hour <= 14) ? 2 : 1;
    
    return {
      active_users: Math.floor(baseActiveUsers * peakMultiplier + Math.random() * 20),
      total_users: 1247 + Math.floor(Math.random() * 5),
      server_status: Math.random() > 0.95 ? 'maintenance' : 'online',
      cpu_usage: Math.floor(30 + Math.random() * 40),
      memory_usage: Math.floor(45 + Math.random() * 30),
      response_time: Math.floor(50 + Math.random() * 100),
      notifications_sent: Math.floor(Math.random() * 1000),
      errors_count: Math.floor(Math.random() * 5),
      last_updated: now.toISOString()
    };
  }

  // Start periodic system metrics updates
  private startSystemMetricsUpdates() {
    this.systemMetricsInterval = setInterval(() => {
      const metrics = this.getSystemMetrics();
      
      this.emit({
        id: generateId(),
        type: 'system_alert',
        data: { metrics },
        timestamp: new Date().toISOString(),
        priority: 'low'
      });
    }, 3000); // Update every 3 seconds
  }

  // Simulate various real-time events
  private simulateRealtimeEvents() {
    const eventTypes: Array<{
      type: EventType;
      probability: number;
      priority: 'low' | 'medium' | 'high' | 'critical';
    }> = [
      { type: 'new_user', probability: 0.1, priority: 'medium' },
      { type: 'quiz_completed', probability: 0.3, priority: 'low' },
      { type: 'user_online', probability: 0.2, priority: 'low' },
    ];

    setInterval(() => {
      eventTypes.forEach(eventType => {
        if (Math.random() < eventType.probability) {
          this.emit({
            id: generateId(),
            type: eventType.type,
            data: this.generateEventData(eventType.type),
            timestamp: new Date().toISOString(),
            priority: eventType.priority
          });
        }
      });
    }, 5000); // Check every 5 seconds
  }

  // Generate sample data for different event types
  private generateEventData(type: EventType) {
    switch (type) {
      case 'new_user':
        return {
          username: `user${Math.floor(Math.random() * 10000)}`,
          location: ['Bangladesh', 'India', 'Pakistan', 'Nepal'][Math.floor(Math.random() * 4)]
        };
      
      case 'quiz_completed':
        return {
          quiz_name: ['Naruto Quiz', 'One Piece Trivia', 'Attack on Titan'][Math.floor(Math.random() * 3)],
          score: Math.floor(Math.random() * 100),
          username: `user${Math.floor(Math.random() * 1000)}`
        };
      
      case 'user_online':
        return {
          count: Math.floor(50 + Math.random() * 200)
        };
      
      default:
        return {};
    }
  }

  // Send notification with real-time progress tracking
  async sendNotificationWithProgress(notification: any): Promise<LiveNotificationStatus> {
    const status: LiveNotificationStatus = {
      id: notification.id,
      title: notification.title,
      status: 'sending',
      sent_count: 0,
      total_recipients: notification.total_recipients || 100,
      progress: 0,
      started_at: new Date().toISOString()
    };

    // Emit initial status
    this.emit({
      id: generateId(),
      type: 'notification_sent',
      data: { status },
      timestamp: new Date().toISOString(),
      priority: 'medium'
    });

    // Simulate sending progress
    const totalRecipients = status.total_recipients;
    const batchSize = Math.ceil(totalRecipients / 10); // Send in 10 batches
    
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      status.sent_count = Math.min(totalRecipients, status.sent_count + batchSize);
      status.progress = Math.round((status.sent_count / totalRecipients) * 100);
      
      if (status.sent_count >= totalRecipients) {
        status.status = 'sent';
        status.completed_at = new Date().toISOString();
      }

      // Emit progress update
      this.emit({
        id: generateId(),
        type: 'notification_sent',
        data: { status: { ...status } },
        timestamp: new Date().toISOString(),
        priority: 'medium'
      });
    }

    return status;
  }

  // Get recent events
  getRecentEvents(limit: number = 20): RealtimeEvent[] {
    return this.eventHistory.slice(0, limit);
  }

  // Broadcast system alert
  broadcastSystemAlert(message: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
    this.emit({
      id: generateId(),
      type: 'system_alert',
      data: { 
        message, 
        alert_type: 'manual',
        severity: priority 
      },
      timestamp: new Date().toISOString(),
      priority
    });
  }

  // Broadcast settings change
  broadcastSettingsChange(settingsType: string, changes: any) {
    this.emit({
      id: generateId(),
      type: 'settings_changed',
      data: { 
        settings_type: settingsType,
        changes,
        changed_by: 'admin'
      },
      timestamp: new Date().toISOString(),
      priority: 'medium'
    });
  }
}

// Create singleton instance
export const realtimeService = new RealtimeService();

// =====================================
// UTILITY FUNCTIONS
// =====================================

// Format metrics for display
export const formatMetric = (value: number, type: 'percentage' | 'number' | 'time') => {
  switch (type) {
    case 'percentage':
      return `${value}%`;
    case 'time':
      return `${value}ms`;
    case 'number':
    default:
      return value.toLocaleString();
  }
};

// Get status color based on metric value
export const getMetricStatus = (value: number, thresholds: { warning: number; critical: number }) => {
  if (value >= thresholds.critical) return 'critical';
  if (value >= thresholds.warning) return 'warning';
  return 'normal';
};

// Default export for easy importing
export default realtimeService;
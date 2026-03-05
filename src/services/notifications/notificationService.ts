// Notification Service for PWA
export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
}

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    if (this.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission;
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Check if permission is granted
   */
  hasPermission(): boolean {
    return this.permission === 'granted';
  }

  /**
   * Show a notification
   */
  async showNotification(options: NotificationOptions): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported');
      return;
    }

    if (this.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return;
      }
    }

    // Check if service worker is ready
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/pwa-192x192.png',
          badge: options.badge || '/pwa-192x192.png',
          tag: options.tag,
          data: options.data,
          requireInteraction: options.requireInteraction || false,
          actions: options.actions || [],
          vibrate: [200, 100, 200],
        });
      } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to browser notification if service worker fails
        new Notification(options.title, {
          body: options.body,
          icon: options.icon,
        });
      }
    } else {
      // Fallback to browser notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon,
      });
    }
  }

  /**
   * Close a notification by tag
   */
  async closeNotification(tag: string): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications({ tag });
      notifications.forEach(notification => notification.close());
    }
  }

  /**
   * Close all notifications
   */
  async closeAllNotifications(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications();
      notifications.forEach(notification => notification.close());
    }
  }
}

export const notificationService = new NotificationService();

// Explicit type export for better module resolution
export type { NotificationOptions };


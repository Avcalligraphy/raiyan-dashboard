import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notifications/notificationService';
import type { NotificationOptions } from '../services/notifications/notificationService';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    setPermission(notificationService.hasPermission() ? 'granted' : Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    const result = await notificationService.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const showNotification = useCallback(async (options: NotificationOptions) => {
    await notificationService.showNotification(options);
  }, []);

  const closeNotification = useCallback(async (tag: string) => {
    await notificationService.closeNotification(tag);
  }, []);

  const closeAllNotifications = useCallback(async () => {
    await notificationService.closeAllNotifications();
  }, []);

  return {
    permission,
    isSupported,
    hasPermission: permission === 'granted',
    requestPermission,
    showNotification,
    closeNotification,
    closeAllNotifications,
  };
};


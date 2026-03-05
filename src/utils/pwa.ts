// PWA Utilities
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Check if the app can be installed
 */
export const canInstallPWA = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Check if the app is installed (running as PWA)
 */
export const isPWAInstalled = (): boolean => {
  // Check if running in standalone mode (iOS)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Check if running in standalone mode (Android)
  if ((window.navigator as any).standalone === true) {
    return true;
  }
  
  // Check if app is installed via beforeinstallprompt
  return document.referrer.includes('android-app://');
};

/**
 * Get the install prompt event
 */
export const getInstallPrompt = (): BeforeInstallPromptEvent | null => {
  return (window as any).deferredPrompt || null;
};

/**
 * Show install prompt
 */
export const showInstallPrompt = async (): Promise<boolean> => {
  const prompt = getInstallPrompt();
  if (!prompt) {
    return false;
  }

  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  
  // Clear the prompt
  (window as any).deferredPrompt = null;
  
  return outcome === 'accepted';
};

/**
 * Register service worker for PWA
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};


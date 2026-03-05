import { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { getInstallPrompt, showInstallPrompt, isPWAInstalled } from '../../utils/pwa';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { requestPermission, hasPermission } = useNotifications();

  useEffect(() => {
    // Check if already installed
    setIsInstalled(isPWAInstalled());

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if prompt is already available
    if (getInstallPrompt()) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    const installed = await showInstallPrompt();
    if (installed) {
      setShowPrompt(false);
      setIsInstalled(true);
    }
  };

  const handleEnableNotifications = async () => {
    await requestPermission();
  };

  if (isInstalled) {
    return null;
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Install App
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Install this app on your device for a better experience and to receive notifications.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Install Now
            </button>
            {!hasPermission && (
              <button
                onClick={handleEnableNotifications}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Enable Notifications
              </button>
            )}
            <button
              onClick={() => setShowPrompt(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;


# PWA Setup Guide

This project is configured as a Progressive Web App (PWA) with the following features:

## Features

- ✅ Installable on mobile and desktop devices
- ✅ Push notifications support
- ✅ Offline support with service worker
- ✅ App-like experience

## Required Icons

You need to create the following icon files in the `public` folder:

1. **pwa-192x192.png** - 192x192 pixels (required)
2. **pwa-512x512.png** - 512x512 pixels (required)
3. **apple-touch-icon.png** - 180x180 pixels (for iOS)
4. **mask-icon.svg** - SVG icon for iOS (optional)

### Quick Icon Generation

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Or create them manually using any image editor.

## Testing PWA Features

### 1. Install the App

- **Desktop (Chrome/Edge)**: Look for the install icon in the address bar
- **Mobile (Android)**: A prompt will appear, or use "Add to Home Screen" from the browser menu
- **iOS (Safari)**: Use "Add to Home Screen" from the share menu

### 2. Test Notifications

1. Click the "Enable Notifications" button in the app
2. Grant permission when prompted
3. Use the notification service to send test notifications

### 3. Development Mode

The PWA plugin is enabled in development mode. To test:
1. Run `pnpm dev`
2. Open DevTools > Application > Service Workers
3. Check that the service worker is registered

## Push Notifications Setup

To enable push notifications from a server, you'll need to:

1. **Get VAPID keys** (for web push):
   ```bash
   npm install -g web-push
   web-push generate-vapid-keys
   ```

2. **Subscribe to push notifications** in your app:
   ```typescript
   const registration = await navigator.serviceWorker.ready;
   const subscription = await registration.pushManager.subscribe({
     userVisibleOnly: true,
     applicationServerKey: YOUR_VAPID_PUBLIC_KEY
   });
   ```

3. **Send push notifications** from your backend using the subscription.

## Usage Examples

### Show a Notification

```typescript
import { useNotifications } from './hooks/useNotifications';

const MyComponent = () => {
  const { showNotification, hasPermission, requestPermission } = useNotifications();

  const handleNotify = async () => {
    if (!hasPermission) {
      await requestPermission();
    }
    
    await showNotification({
      title: 'New Charging Session',
      body: 'Station #123 has started a new session',
      icon: '/pwa-192x192.png',
      tag: 'charging-session',
    });
  };

  return <button onClick={handleNotify}>Notify</button>;
};
```

### Check Install Status

```typescript
import { isPWAInstalled, showInstallPrompt } from './utils/pwa';

if (!isPWAInstalled()) {
  // Show install prompt
  await showInstallPrompt();
}
```

## Configuration

PWA settings are configured in `vite.config.ts`. You can customize:
- App name and description
- Theme colors
- Icons
- Service worker caching strategies

## Browser Support

- ✅ Chrome/Edge (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Safari (iOS 11.3+)
- ⚠️ Safari (macOS) - Limited support

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure you're using HTTPS (or localhost for development)
- Clear browser cache and reload

### Notifications Not Working
- Check notification permissions in browser settings
- Ensure service worker is active
- Test in a supported browser

### Install Prompt Not Showing
- Clear browser cache
- Try in incognito mode
- Check that the app meets PWA criteria (HTTPS, manifest, service worker)


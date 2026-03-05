import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
// Perfect Scrollbar CSS
import 'react-perfect-scrollbar/dist/css/styles.css'
import App from './App.tsx'
import { registerServiceWorker } from './utils/pwa'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerServiceWorker();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Attempt to unregister any existing service workers and clear caches
// This helps clients that may be stuck with an old SW serving cached assets
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(reg => {
        try { reg.unregister(); } catch (e) { /* ignore */ }
      });
    }).catch(() => {});

    // also try to clear caches
    if ('caches' in window) {
      caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {});
    }
  } catch (err) {
    // ignore errors during unregister
  }
}

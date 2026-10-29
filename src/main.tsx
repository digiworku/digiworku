import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const root = document.getElementById('root')!;

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

requestAnimationFrame(() => {
  document.querySelectorAll('.app-loader').forEach((loader) => loader.remove());
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('[PWA] Service worker registration ignored in this environment:', err);
    });
  });
}


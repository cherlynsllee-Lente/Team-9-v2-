import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

// Intercept cross-origin script errors (such as third-party embeds/Disqus in iframes)
window.addEventListener(
  'error',
  (event) => {
    if (
      event.message === 'Script error.' ||
      !event.filename ||
      (typeof event.filename === 'string' &&
        (event.filename.includes('disqus') || event.filename.includes('dsq')))
    ) {
      event.preventDefault();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
      if (event.stopPropagation) event.stopPropagation();
      return true;
    }
  },
  true
);

window.addEventListener(
  'unhandledrejection',
  (event) => {
    if (
      event.reason &&
      (String(event.reason).includes('disqus') ||
        String(event.reason).includes('Script error'))
    ) {
      event.preventDefault();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    }
  },
  true
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    sa_page?: (url?: string) => void;
  }
}

/**
 * Sends a page view to Simple Analytics on every route change (SPA).
 * The script in index.html only sees the first load; this tracks /, /quiz, /journal, etc.
 */
export function TrackPageView() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window.sa_page === 'function') {
      window.sa_page(pathname || window.location.pathname);
    }
  }, [pathname]);

  return null;
}

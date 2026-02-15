declare global {
  interface Window {
    sa_event?: (name: string, metadata?: Record<string, string | number | boolean>) => void;
  }
}

export function trackEvent(name: string, metadata?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && typeof window.sa_event === 'function') {
    window.sa_event(name, metadata);
  }
}

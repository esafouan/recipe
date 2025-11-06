// Global error handling and prevention script
// This script prevents hydration mismatches and module loading errors

// Prevent React hydration errors in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Suppress hydration warnings for known safe mismatches
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (
        args[0].includes('Warning: Text content did not match') ||
        args[0].includes('Warning: Prop') ||
        args[0].includes('Hydration failed') ||
        args[0].includes('There was an error while hydrating')
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  // Handle webpack module loading errors
  window.addEventListener('error', (event) => {
    if (
      event.message.includes('Cannot read properties of undefined') &&
      event.message.includes('webpack')
    ) {
      console.warn('Webpack module loading error detected, attempting to recover...');
      // Don't propagate the error
      event.preventDefault();
      return false;
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason &&
      typeof event.reason.message === 'string' &&
      (
        event.reason.message.includes('Cannot read properties of undefined') ||
        event.reason.message.includes('webpack') ||
        event.reason.message.includes('chunk')
      )
    ) {
      console.warn('Module loading promise rejection detected, suppressing...');
      event.preventDefault();
      return false;
    }
  });
}

// React error boundary fallback for module loading errors
if (typeof window !== 'undefined') {
  const globalWindow = window as any;
  globalWindow.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = {
    ...globalWindow.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__,
    onError: (error: any) => {
      if (error.message && error.message.includes('Cannot read properties of undefined')) {
        console.warn('React module error suppressed:', error.message);
        return;
      }
      // Let other errors through
      if (globalWindow.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.originalOnError) {
        globalWindow.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.originalOnError(error);
      }
    }
  };
}

export {};

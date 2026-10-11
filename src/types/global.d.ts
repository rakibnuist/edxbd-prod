// Global type declarations for window properties
declare global {
  interface Window {
    pageViewEventId?: string;
    fbq?: (action: string, event?: string, parameters?: Record<string, unknown>, options?: Record<string, unknown>) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __metaPixelLoaded?: boolean;
    __metaPixelId?: string;
    __metaPixelLastPath?: string;
    FB?: {
      init: (params: Record<string, unknown>) => void;
      getLoginStatus: (callback: (response: unknown) => void) => void;
      [key: string]: unknown;
    };
  }
}

export { };

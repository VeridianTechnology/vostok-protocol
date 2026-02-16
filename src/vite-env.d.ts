/// <reference types="vite/client" />

interface TikTokQueue {
  track: (event: string, payload?: Record<string, unknown>) => void;
  page?: () => void;
}

declare global {
  interface Window {
    ttq?: TikTokQueue;
  }
}

interface Window {
  rdt?: (...args: unknown[]) => void;
}

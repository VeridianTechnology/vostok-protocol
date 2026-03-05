/// <reference types="vite/client" />

interface Window {
  chatbaseConfig?: {
    chatbotId: string;
    host?: string;
  };
  chatbase?: {
    (method: string, ...args: unknown[]): unknown;
    q?: unknown[];
  };
}

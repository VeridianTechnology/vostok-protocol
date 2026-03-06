import { track } from "@vercel/analytics";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

const oncePrefix = "vostok_analytics_once_";

export const trackSafe = (event: string, props?: TrackProps) => {
  try {
    track(event, props);
  } catch {
    // Ignore analytics failures.
  }
};

export const trackOnce = (event: string, props?: TrackProps) => {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) {
      track(event, props);
      return;
    }
    const key = `${oncePrefix}${event}`;
    if (window.sessionStorage.getItem(key)) {
      return;
    }
    window.sessionStorage.setItem(key, "1");
    track(event, props);
  } catch {
    // Ignore analytics failures.
  }
};

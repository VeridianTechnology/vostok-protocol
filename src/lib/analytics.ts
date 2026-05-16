import { track } from "@vercel/analytics";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

const oncePrefix = "vostok_analytics_once_";
const OWNER_KEY = "vostok_owner";
export const BOUGHT_KEY = "vostok_bought";
export const CAT_KEY = "vostok_cat";

export const isOwner = (): boolean => {
  try {
    return localStorage.getItem(OWNER_KEY) === "1";
  } catch {
    return false;
  }
};

export const checkAndSetOwnerParam = (): void => {
  try {
    if (new URLSearchParams(window.location.search).get("preview") === "1") {
      localStorage.setItem(OWNER_KEY, "1");
    }
  } catch {
    // ignore
  }
};

export const trackSafe = (event: string, props?: TrackProps) => {
  if (isOwner()) return;
  try {
    track(event, props);
  } catch {
    // Ignore analytics failures.
  }
};

export const trackOnce = (event: string, props?: TrackProps) => {
  if (isOwner()) return;
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

export const markBuyClicked = (): void => {
  try {
    sessionStorage.setItem(BOUGHT_KEY, "1");
  } catch {
    // ignore
  }
};

export const hasBuyClicked = (): boolean => {
  try {
    return sessionStorage.getItem(BOUGHT_KEY) === "1";
  } catch {
    return false;
  }
};

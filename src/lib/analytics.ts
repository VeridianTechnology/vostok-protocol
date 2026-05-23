import { track } from "@vercel/analytics";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

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

export const trackBeacon = (event: string, props?: TrackProps) => {
  if (isOwner()) return;
  try {
    navigator.sendBeacon("/api/beacon", JSON.stringify({ event, props }));
  } catch {
    // ignore
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

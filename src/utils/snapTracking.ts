type SnapTrackOptions = {
  payload?: Record<string, unknown>;
};

const getSessionStorage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const trackSnapEvent = (eventName: string, options: SnapTrackOptions = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.snaptr === "function") {
    window.snaptr("track", eventName, options.payload ?? {});
  }
};

export const trackSnapEventOnce = (eventName: string, sessionKey: string, options: SnapTrackOptions = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const storage = getSessionStorage();
  if (storage?.getItem(sessionKey)) {
    return;
  }

  trackSnapEvent(eventName, options);
  if (storage) {
    storage.setItem(sessionKey, "1");
  }
};

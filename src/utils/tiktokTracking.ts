type TikTokTrackOptions = {
  payload?: Record<string, unknown>;
};

const getSessionStorage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const trackTiktokEvent = (eventName: string, options: TikTokTrackOptions = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  if (window.ttq?.track) {
    window.ttq.track(eventName, options.payload ?? {});
  }
};

export const trackTiktokEventOnce = (eventName: string, sessionKey: string, options: TikTokTrackOptions = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const storage = getSessionStorage();
  if (storage?.getItem(sessionKey)) {
    return;
  }

  trackTiktokEvent(eventName, options);
  if (storage) {
    storage.setItem(sessionKey, "1");
  }
};

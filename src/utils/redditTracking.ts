type RedditTrackOptions = {
  email?: string;
  eventId?: string;
  payload?: Record<string, unknown>;
};

const DEBUG_PARAM = "debug";

const isDebugEnabled = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return new URLSearchParams(window.location.search).get(DEBUG_PARAM) === "1";
};

const getSessionStorage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const generateEventId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `rdt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const sendCapiEvent = async (eventName: string, eventId: string, email?: string) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const payload: Record<string, unknown> = {
      event_name: eventName,
      event_id: eventId,
      user_agent: window.navigator.userAgent,
    };

    if (email) {
      payload.email = email;
    }

    await fetch("/api/reddit-conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (isDebugEnabled()) {
      console.warn("[reddit] capi error", error);
    }
  }
};

export const trackRedditEvent = (eventName: string, options: RedditTrackOptions = {}) => {
  if (typeof window === "undefined") {
    return null;
  }

  const eventId = options.eventId ?? generateEventId();
  const payload = {
    event_id: eventId,
    eventId,
    ...(options.payload ?? {}),
  };

  if (typeof window.rdt === "function") {
    window.rdt("track", eventName, payload);
  }

  if (isDebugEnabled()) {
    console.info("[reddit]", eventName, eventId);
  }

  void sendCapiEvent(eventName, eventId, options.email);
  return eventId;
};

export const trackRedditEventOnce = (eventName: string, sessionKey: string, options: RedditTrackOptions = {}) => {
  if (typeof window === "undefined") {
    return null;
  }

  const storage = getSessionStorage();
  if (storage?.getItem(sessionKey)) {
    return null;
  }

  const eventId = trackRedditEvent(eventName, options);
  if (eventId && storage) {
    storage.setItem(sessionKey, eventId);
  }
  return eventId;
};

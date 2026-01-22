const VIDEO_GATE_STORAGE_KEY = 'videoAllowed';
const PING_URL = '/ping.txt';
const PING_SIZE_BYTES = 3072;
const SLOW_KBPS_THRESHOLD = 800;
const SLOW_TIME_THRESHOLD_MS = 400;

export const getCachedVideoDecision = () => {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }

  try {
    const cached = sessionStorage.getItem(VIDEO_GATE_STORAGE_KEY);
    if (cached === 'true') {
      return true;
    }
    if (cached === 'false') {
      return false;
    }
  } catch {
    return null;
  }

  return null;
};

const cacheDecision = (allowed: boolean) => {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(VIDEO_GATE_STORAGE_KEY, allowed ? 'true' : 'false');
  } catch {
    // Ignore storage failures.
  }
};

export const shouldLoadVideo = async (): Promise<boolean> => {
  const cached = getCachedVideoDecision();
  if (cached !== null) {
    return cached;
  }

  if (typeof navigator === 'undefined') {
    cacheDecision(false);
    return false;
  }

  const connection = (navigator as Navigator & {
    connection?: {
      effectiveType?: string;
      saveData?: boolean;
      downlink?: number;
    };
  }).connection;

  if (connection) {
    const effectiveType = connection.effectiveType ?? '';
    const downlink = connection.downlink ?? Number.POSITIVE_INFINITY;
    const isSlowType = ['slow-2g', '2g', '3g'].includes(effectiveType);
    const isSlow = Boolean(connection.saveData) || isSlowType || downlink < 1.5;
    const allowed = !isSlow;
    cacheDecision(allowed);
    return allowed;
  }

  const start = performance.now();
  try {
    const response = await fetch(PING_URL, { cache: 'no-store' });
    const buffer = await response.arrayBuffer();
    const bytes = buffer.byteLength || PING_SIZE_BYTES;
    const elapsedMs = performance.now() - start;
    const kbps = (bytes * 8) / (elapsedMs / 1000) / 1000;
    const isSlow = kbps < SLOW_KBPS_THRESHOLD || elapsedMs > SLOW_TIME_THRESHOLD_MS;
    const allowed = !isSlow;
    cacheDecision(allowed);
    return allowed;
  } catch {
    cacheDecision(false);
    return false;
  }
};

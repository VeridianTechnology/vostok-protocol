import { useEffect, useState } from "react";

export type ConnectionScore = {
  downlinkMbps: number | null;
  rttMs: number | null;
  score: "fast" | "medium" | "slow";
  loading: boolean;
};

const SPEED_TEST_URL = "/ping.txt";
const RTT_TEST_URL = "/favicon.ico";

const getDownlink = () => {
  if (typeof navigator === "undefined") {
    return null;
  }

  const connection = (navigator as Navigator & {
    connection?: { downlink?: number };
  }).connection;

  return typeof connection?.downlink === "number" ? connection.downlink : null;
};

const measureRtt = async () => {
  const start = performance.now();
  const response = await fetch(RTT_TEST_URL, { cache: "no-store" });
  await response.arrayBuffer();
  return Math.round(performance.now() - start);
};

const measureSpeed = async () => {
  const start = performance.now();
  const response = await fetch(SPEED_TEST_URL, { cache: "no-store" });
  const buffer = await response.arrayBuffer();
  const elapsedMs = performance.now() - start;
  const bytes = buffer.byteLength || 1;
  const kbps = (bytes * 8) / (elapsedMs / 1000) / 1000;
  return kbps;
};

export const useConnectionQuality = (): ConnectionScore => {
  const [state, setState] = useState<ConnectionScore>({
    downlinkMbps: null,
    rttMs: null,
    score: "slow",
    loading: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let cancelled = false;

    const run = async () => {
      const downlink = getDownlink();
      let rtt: number | null = null;

      try {
        rtt = await measureRtt();
        await measureSpeed();
      } catch {
        if (!cancelled) {
          setState({
            downlinkMbps: downlink,
            rttMs: rtt,
            score: "slow",
            loading: false,
          });
        }
        return;
      }

      const score: ConnectionScore["score"] =
        (downlink !== null && downlink >= 5) || (rtt !== null && rtt <= 100)
          ? "fast"
          : (downlink !== null && downlink >= 2) || (rtt !== null && rtt <= 300)
          ? "medium"
          : "slow";

      if (!cancelled) {
        setState({
          downlinkMbps: downlink,
          rttMs: rtt,
          score,
          loading: false,
        });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};

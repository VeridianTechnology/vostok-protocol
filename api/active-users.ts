import type { VercelRequest, VercelResponse } from "@vercel/node";

const ANALYTICS_BASE = "https://vercel.com/api/analytics";

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const sumFromArray = (items: unknown[]) => {
  return items.reduce((total, item) => {
    if (typeof item !== "object" || item === null) {
      return total;
    }
    const record = item as Record<string, unknown>;
    const value =
      toNumber(record.visitors) ??
      toNumber(record.visitor) ??
      toNumber(record.value) ??
      toNumber(record.count);
    return value === null ? total : total + value;
  }, 0);
};

const extractActive = (payload: Record<string, unknown>) => {
  return (
    toNumber(payload.active) ??
    toNumber(payload.current) ??
    toNumber((payload.realtime as Record<string, unknown> | undefined)?.active) ??
    toNumber((payload.data as Record<string, unknown> | undefined)?.active)
  );
};

const extractToday = (payload: Record<string, unknown>) => {
  const direct =
    toNumber(payload.today) ??
    toNumber(payload.visitors) ??
    toNumber(payload.total) ??
    toNumber(payload.count);
  if (direct !== null) {
    return direct;
  }
  const data = payload.data;
  if (Array.isArray(data)) {
    return sumFromArray(data);
  }
  return null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId || !teamId) {
    res.status(500).json({ error: "Missing Vercel analytics env vars." });
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const realtimeUrl = `${ANALYTICS_BASE}/realtime?projectId=${projectId}&teamId=${teamId}`;
  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const summaryUrl = `${ANALYTICS_BASE}/summary?projectId=${projectId}&teamId=${teamId}&from=${from}&to=${from}`;

  let active: number | null = null;
  let totalToday: number | null = null;

  try {
    const realtimeRes = await fetch(realtimeUrl, { headers });
    if (realtimeRes.ok) {
      const realtimeJson = (await realtimeRes.json()) as Record<string, unknown>;
      active = extractActive(realtimeJson);
      totalToday = extractToday(realtimeJson);
    }
  } catch {
    // Intentionally empty: fallback attempts below.
  }

  try {
    const summaryRes = await fetch(summaryUrl, { headers });
    if (summaryRes.ok) {
      const summaryJson = (await summaryRes.json()) as Record<string, unknown>;
      const summaryToday = extractToday(summaryJson);
      if (summaryToday !== null) {
        totalToday = summaryToday;
      }
    }
  } catch {
    // Intentionally empty: keep best available data.
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).json({
    active,
    today: totalToday,
    updatedAt: new Date().toISOString(),
  });
}

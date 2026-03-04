import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "redis";
import { randomUUID } from "crypto";

const MAX_REASON_LENGTH = 300;
const REDIS_LIST_KEY = "redis-cinnabar-dog:survey_answers";

const cleanText = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, MAX_REASON_LENGTH);
};

let redisClient: ReturnType<typeof createClient> | null = null;
const getRedisClient = async () => {
  if (!redisClient) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error("Missing REDIS_URL env var.");
    }
    redisClient = createClient({ url });
    await redisClient.connect();
  }
  return redisClient;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const payload = req.body ?? {};
  const source = payload.source === "footer" ? "footer" : "hero";
  const buyChoice = payload.buyChoice === "not_buy" ? "not_buy" : "buy";
  const siteLike = payload.siteLike === "no" ? "no" : "yes";
  const looksInterest = payload.looksInterest === "no" ? "no" : "yes";

  const record = {
    id: randomUUID(),
    source,
    buyChoice,
    buyReason: cleanText(payload.buyReason),
    siteLike,
    siteReason: cleanText(payload.siteReason),
    looksInterest,
    looksReason: cleanText(payload.looksReason),
    createdAt: new Date().toISOString(),
  };

  try {
    const client = await getRedisClient();
    await client.lPush(REDIS_LIST_KEY, JSON.stringify(record));
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Redis error" });
    return;
  }

  res.status(200).json({ ok: true });
}

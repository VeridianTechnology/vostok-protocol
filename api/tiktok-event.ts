import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";

const TIKTOK_EVENTS_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const pixelCode = process.env.TIKTOK_PIXEL_CODE;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!pixelCode || !accessToken) {
    res.status(500).json({ error: "TikTok credentials not configured" });
    return;
  }

  const { userAgent, ip, url } = req.body ?? {};

  const payload: Record<string, unknown> = {
    pixel_code: pixelCode,
    data: [
      {
        event: "InitiateCheckout",
        event_time: Math.floor(Date.now() / 1000),
        event_id: randomUUID(),
        user: {
          ip: typeof ip === "string" ? ip : (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? "",
          user_agent: typeof userAgent === "string" ? userAgent : "",
        },
        page: {
          url: typeof url === "string" ? url : "https://vostokmethod.com",
        },
      },
    ],
  };

  const testCode = process.env.TIKTOK_TEST_EVENT_CODE;
  if (testCode) {
    payload.test_event_code = testCode;
  }

  try {
    const response = await fetch(TIKTOK_EVENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(200).json({ ok: true, tiktok: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "TikTok API error" });
  }
}

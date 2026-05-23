import { track } from "@vercel/analytics/server";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response(null, { status: 204 });
  try {
    const { event, props } = await req.json();
    if (typeof event === "string") {
      await track(event, props ?? {}, { request: req });
    }
  } catch {
    // ignore malformed payloads
  }
  return new Response(null, { status: 204 });
}

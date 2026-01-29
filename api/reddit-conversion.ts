import type { VercelRequest, VercelResponse } from '@vercel/node';

const getAccessToken = async () => {
  if (process.env.REDDIT_ACCESS_TOKEN) {
    return process.env.REDDIT_ACCESS_TOKEN;
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const refreshToken = process.env.REDDIT_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { event_name, event_id, email, user_agent } = req.body ?? {};

  if (!event_name || !event_id) {
    res.status(400).json({ error: 'Missing event_name or event_id' });
    return;
  }

  const conversionsUrl = process.env.REDDIT_CONVERSIONS_API_URL;
  if (!conversionsUrl) {
    res.status(500).json({ error: 'Missing REDDIT_CONVERSIONS_API_URL' });
    return;
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    res.status(500).json({ error: 'Missing Reddit access token credentials' });
    return;
  }

  const payload: Record<string, unknown> = {
    events: [
      {
        event_name,
        event_id,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: req.headers.referer ?? undefined,
        pixel_id: process.env.REDDIT_PIXEL_ID,
        user: {
          user_agent: user_agent ?? req.headers['user-agent'],
          email,
        },
      },
    ],
  };

  const response = await fetch(conversionsUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  res.status(response.ok ? 200 : 502).json({
    ok: response.ok,
    status: response.status,
    body: responseText,
  });
}

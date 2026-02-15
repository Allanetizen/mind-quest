/**
 * Sender.net subscription – follows official Sender API docs.
 * POST https://api.sender.net/v2/subscribers
 * Body: { email, firstname?, groups: [group_id], trigger_automation?: boolean }
 *
 * Env (server):
 *   SENDER_API_TOKEN  – required. From Sender → Settings → API access tokens.
 *   SENDER_GROUP_ID   – optional. From Sender → Subscribers → Groups → open group, ID below name.
 */

const SENDER_SUBSCRIBERS_URL = 'https://api.sender.net/v2/subscribers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.SENDER_API_TOKEN;
  if (!token) {
    console.error('SENDER_API_TOKEN is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const email = body.email && String(body.email).trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  const firstname = body.firstname ? String(body.firstname).trim() : undefined;
  const groupId = process.env.SENDER_GROUP_ID || null;

  const data = {
    email,
    ...(firstname && { firstname }),
    ...(groupId && { groups: [groupId] }),
    trigger_automation: body.trigger_automation !== false,
  };

  try {
    const response = await fetch(SENDER_SUBSCRIBERS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Sender API error', response.status, result);
      return res.status(response.status >= 500 ? 502 : 400).json({
        error: result?.message || result?.error || 'Subscription failed',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe request failed', err);
    return res.status(502).json({ error: 'Subscription service unavailable' });
  }
}

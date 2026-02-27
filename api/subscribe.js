/**
 * MailerLite subscription – connect API.
 * POST https://connect.mailerlite.com/api/subscribers
 * Body: { email, status?: 'active', fields?: { name }, groups?: [group_id] }
 * status: 'active' so automations (e.g. welcome email on join group) run.
 *
 * Env (server):
 *   SUBSS                 – required. MailerLite API token (Bearer).
 *   MAILERLITE_GROUP_ID   – optional. Group ID to add subscribers to (default: 180587122481170115).
 */

const MAILERLITE_SUBSCRIBERS_URL = 'https://connect.mailerlite.com/api/subscribers';
const DEFAULT_GROUP_ID = '180587122481170115';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.SUBSS;
  if (!token) {
    console.error('SUBSS (MailerLite API token) is not set');
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
  const groupId = process.env.MAILERLITE_GROUP_ID || DEFAULT_GROUP_ID;

  const data = {
    email,
    status: 'active',
    ...(firstname && { fields: { name: firstname } }),
    groups: [groupId],
  };

  try {
    const response = await fetch(MAILERLITE_SUBSCRIBERS_URL, {
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
      console.error('MailerLite API error', response.status, result);
      return res.status(response.status >= 500 ? 502 : 400).json({
        error: result?.message || result?.errors?.[0]?.message || result?.error || 'Subscription failed',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe request failed', err);
    return res.status(502).json({ error: 'Subscription service unavailable' });
  }
}

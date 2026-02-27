/**
 * Local dev server for POST /api/subscribe (same logic as api/subscribe.js).
 * Run: npm run dev:api (in one terminal), then npm run dev (in another).
 * Requires .env with SUBSS (MailerLite API token).
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Load .env
try {
  const envPath = path.join(root, '.env');
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) {
      const val = m[2].trim().replace(/^["']|["']$/g, '');
      process.env[m[1].trim()] = val;
    }
  });
} catch {}

const MAILERLITE_SUBSCRIBERS_URL = 'https://connect.mailerlite.com/api/subscribers';
const DEFAULT_GROUP_ID = '180587122481170115';
const PORT = 3001;

async function handleSubscribe(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const token = process.env.SUBSS;
  if (!token) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Server configuration error' }));
    return;
  }

  let body;
  try {
    body = JSON.parse(req.body || '{}');
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  const email = body.email && String(body.email).trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Valid email is required' }));
    return;
  }

  const firstname = body.firstname ? String(body.firstname).trim() : undefined;
  const groupId = process.env.MAILERLITE_GROUP_ID || DEFAULT_GROUP_ID;
  const data = {
    email,
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
      const errMsg = result?.message || result?.errors?.[0]?.message || result?.error || 'Subscription failed';
      res.writeHead(response.status >= 500 ? 502 : 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: errMsg }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error('Subscribe request failed', err);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Subscription service unavailable' }));
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  if (url.pathname === '/api/subscribe') {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      req.body = data;
      handleSubscribe(req, res);
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Dev API running at http://localhost:${PORT} (POST /api/subscribe, MailerLite)`);
});

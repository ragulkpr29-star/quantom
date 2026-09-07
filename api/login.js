import { signToken, parseBody, checkRateLimit } from './_utils.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.writeHead(405).end();
  
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.writeHead(429).end(JSON.stringify({ error: "Too many attempts" }));
  }

  const body = await parseBody(req);
  const email = body.email;
  const password = body.password;
  
  const ADMIN_EMAIL = 'ragulkpr29@gmail.com';
  const ADMIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD;
  const AUTH_SECRET = process.env.AUTH_SECRET;

  if (!ADMIN_PASSWORD || !AUTH_SECRET) {
    console.error("Missing server environment variables.");
    return res.writeHead(500).end(JSON.stringify({ error: "Internal Server Error" }));
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const rawToken = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const signed = signToken(rawToken, AUTH_SECRET);
    const isSecure = req.headers['x-forwarded-proto'] === 'https' || req.headers['referer']?.startsWith('https');
    const cookie = `q27_session=${signed}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${isSecure ? '; Secure' : ''}`;
    
    res.setHeader('Set-Cookie', cookie);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: true }));
  } else {
    res.setHeader('Content-Type', 'application/json');
    return res.writeHead(401).end(JSON.stringify({ error: "Invalid email or password." }));
  }
}

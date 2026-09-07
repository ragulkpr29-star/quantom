import crypto from 'crypto';

export function signToken(token, secret) {
  return token + '.' + crypto.createHmac('sha256', secret).update(token).digest('hex');
}

export function verifyToken(signedToken, secret) {
  if (!signedToken || typeof signedToken !== 'string') return false;
  const parts = signedToken.split('.');
  if (parts.length !== 2) return false;
  try {
    const expectedSig = crypto.createHmac('sha256', secret).update(parts[0]).digest('hex');
    if (parts[1].length !== expectedSig.length) return false;
    return crypto.timingSafeEqual(Buffer.from(parts[1]), Buffer.from(expectedSig));
  } catch (e) {
    return false;
  }
}

export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const key = parts.shift()?.trim();
    if (key) {
      cookies[key] = decodeURIComponent(parts.join('=') || '');
    }
  });
  return cookies;
}

export async function parseBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
        try { return JSON.parse(req.body); } catch(e) { return {}; }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => body += chunk.toString());
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch(e) { resolve({}); }
    });
  });
}

// In-memory rate limiting (best effort)
const rateLimitMap = new Map();
export function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + 60000 };
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + 60000;
  } else {
    entry.count++;
  }
  rateLimitMap.set(ip, entry);
  return entry.count <= 10;
}

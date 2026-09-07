import { parseCookies, verifyToken } from './_utils.js';

export default function handler(req, res) {
  const AUTH_SECRET = process.env.AUTH_SECRET;
  if (!AUTH_SECRET) return res.writeHead(500).end();

  const cookies = parseCookies(req.headers.cookie);
  const isValid = verifyToken(cookies['q27_session'], AUTH_SECRET);

  res.setHeader('Content-Type', 'application/json');
  if (isValid) {
    res.end(JSON.stringify({ authenticated: true }));
  } else {
    res.writeHead(401).end(JSON.stringify({ authenticated: false }));
  }
}

export default function handler(req, res) {
  const isSecure = req.headers['x-forwarded-proto'] === 'https' || req.headers['referer']?.startsWith('https');
  const cookie = `q27_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${isSecure ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookie);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: true }));
}

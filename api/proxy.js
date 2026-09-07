import { parseCookies, verifyToken, parseBody } from './_utils.js';

const ALLOWED_ACTIONS = [
  "getRegistrations",
  "getEvaluations",
  "getCriteria",
  "getResults",
  "saveMarks",
  "generateReport",
  "generateToppers",
  "getAuditLogs",
  "getDashboardStats"
];

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyH6fDwqwdLLqBKu4_Gdr1elxQCDlCw7jyHgJJA5dGWsvyhMYLePT-BuOSgqbbmMe24/exec";

export default async function handler(req, res) {
  const AUTH_SECRET = process.env.AUTH_SECRET;

  if (!AUTH_SECRET) {
    return res
      .writeHead(500)
      .end(JSON.stringify({ error: "AUTH_SECRET is not configured" }));
  }

  // Check admin session
  const cookies = parseCookies(req.headers.cookie);

  if (!verifyToken(cookies["q27_session"], AUTH_SECRET)) {
    return res
      .writeHead(401)
      .end(JSON.stringify({ error: "Unauthorized" }));
  }

  let action = "";
  let payload = {};

  // GET request
  if (req.method === "GET") {
    const url = new URL(
      req.url,
      `http://${req.headers.host}`
    );

    action = url.searchParams.get("action") || "";

    payload = Object.fromEntries(
      url.searchParams.entries()
    );
  }

  // POST request
  else if (req.method === "POST") {
    payload = await parseBody(req);
    action = payload.action || "";
  }

  // Unsupported HTTP method
  else {
    return res
      .writeHead(405)
      .end(JSON.stringify({ error: "Method not allowed" }));
  }

  // Check allowed action
  if (!ALLOWED_ACTIONS.includes(action)) {
    return res
      .writeHead(403)
      .end(JSON.stringify({
        error: "Forbidden operation",
        action
      }));
  }

  try {
    let fetchRes;

    // Forward GET request to Google Apps Script
    if (req.method === "GET") {
      const qs = new URLSearchParams(payload).toString();

      fetchRes = await fetch(
        `${GOOGLE_APPS_SCRIPT_URL}?${qs}`
      );
    }

    // Forward POST request to Google Apps Script
    else {
      fetchRes = await fetch(
        GOOGLE_APPS_SCRIPT_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        }
      );
    }

    if (!fetchRes.ok) {
      const upstreamText = await fetchRes.text();

      return res
        .writeHead(502)
        .end(JSON.stringify({
          error: "Upstream error",
          status: fetchRes.status,
          details: upstreamText
        }));
    }

    const data = await fetchRes.text();

    res.setHeader(
      "Content-Type",
      "application/json"
    );

    return res.end(data);

  } catch (err) {
    console.error("Proxy error:", err);

    return res
      .writeHead(500)
      .end(JSON.stringify({
        error: "Internal server error"
      }));
  }
}
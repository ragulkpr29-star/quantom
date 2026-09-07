const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyH6fDwqwdLLqBKu4_Gdr1elxQCDlCw7jyHgJJA5dGWsvyhMYLePT-BuOSgqbbmMe24/exec";
const PROXY_URL = "/api/proxy";

// Public actions that do not require authentication
async function fetchPublicGet(params: Record<string, string>) {
  const urlParams = new URLSearchParams(params);
  const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${urlParams.toString()}`);
  if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
  return response.json();
}

async function fetchPublicPost(data: any) {
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
  return response.json();
}

// Protected actions routed through Vercel Serverless Function Proxy
async function fetchProxyGet(params: Record<string, string>) {
  const urlParams = new URLSearchParams(params);
  const response = await fetch(`${PROXY_URL}?${urlParams.toString()}`);
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error("Unauthorized");
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return response.json();
}

async function fetchProxyPost(data: any) {
  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error("Unauthorized");
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return response.json();
}

export const googleSheetsService = {
  // Public
  registerUser: async (data: any) => {
    return fetchPublicPost({ action: "register", ...data });
  },
  
  getEvents: async () => {
    const res = await fetchPublicGet({ action: "getEvents" });
    if (res.success === false) throw new Error(res.error || "Failed to load events");
    return res.events || res.data || [];
  },

  // Protected Admin / Root-OS actions
  getRegistrations: async (eventId: string) => {
    const res = await fetchProxyGet({ action: "getRegistrations", eventId });
    if (res.success === false) throw new Error(res.error || "Failed to load registrations");
    return res.data || [];
  },

  getEvaluations: async (eventId: string) => {
    const res = await fetchProxyGet({ action: "getEvaluations", eventId });
    if (res.success === false) throw new Error(res.error || "Failed to load evaluations");
    return res.data || [];
  },

  getCriteria: async (eventId: string) => {
    const res = await fetchProxyGet({ action: "getCriteria", eventId });
    if (res.success === false) throw new Error(res.error || "Failed to load criteria");
    return res.data || [];
  },

  getResults: async (eventId: string) => {
    const res = await fetchProxyGet({ action: "getResults", eventId });
    if (res.success === false) throw new Error(res.error || "Failed to load results");
    return res.data || [];
  },

  saveMarks: async (data: any) => {
    return fetchProxyPost({ action: "saveMarks", ...data });
  },

  generateReport: async (eventId: string) => {
    return fetchProxyPost({ action: "generateReport", eventId });
  },

  generateToppers: async () => {
    return fetchProxyPost({ action: "generateToppers" });
  },

  getAuditLogs: async () => {
    const res = await fetchProxyGet({ action: "getAuditLogs" });
    if (res.success === false) throw new Error(res.error || "Failed to load audit logs");
    return res.data || [];
  },

  getDashboardStats: async () => {
    const res = await fetchProxyGet({ action: "getDashboardStats" });
    if (res.success === false) throw new Error(res.error || "Failed to load dashboard stats");
    return res.data || null;
  }
};

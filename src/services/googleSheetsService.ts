const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyH6fDwqwdLLqBKu4_Gdr1elxQCDlCw7jyHgJJA5dGWsvyhMYLePT-BuOSgqbbmMe24/exec";

async function fetchGet(params: Record<string, string>) {
  const urlParams = new URLSearchParams(params);
  const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${urlParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return response.json();
}

async function fetchPost(data: any) {
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return response.json();
}

export const googleSheetsService = {
  registerUser: async (data: any) => {
    return fetchPost({ action: "register", ...data });
  },

  getRegistrations: async (eventId: string) => {
    const res = await fetchGet({ action: "getRegistrations", eventId });
    if (res.success === false) throw new Error(res.error || "Failed to load registrations");
    return res.data || [];
  },

  getEvaluations: async (eventId: string) => {
    const res = await fetchGet({ action: "getEvaluations", eventId });
    if (res.success === false) throw new Error(res.error || "Failed to load evaluations");
    return res.data || [];
  },

  getCriteria: async (eventId: string) => {
    const res = await fetchGet({ action: "getCriteria", eventId });
    if (res.success === false) throw new Error(res.error || "Failed to load criteria");
    return res.data || [];
  },

  getResults: async (eventId: string) => {
    const res = await fetchGet({ action: "getResults", eventId });
    if (res.success === false) throw new Error(res.error || "Failed to load results");
    return res.data || [];
  },

  saveMarks: async (data: any) => {
    return fetchPost({ action: "saveMarks", ...data });
  },

  generateReport: async (eventId: string) => {
    return fetchPost({ action: "generateReport", eventId });
  },

  generateToppers: async () => {
    return fetchPost({ action: "generateToppers" });
  },

  getEvents: async () => {
    const res = await fetchGet({ action: "getEvents" });
    if (res.success === false) throw new Error(res.error || "Failed to load events");
    return res.events || res.data || [];
  },

  getAuditLogs: async () => {
    const res = await fetchGet({ action: "getAuditLogs" });
    if (res.success === false) throw new Error(res.error || "Failed to load audit logs");
    return res.data || [];
  },

  getDashboardStats: async () => {
    const res = await fetchGet({ action: "getDashboardStats" });
    if (res.success === false) throw new Error(res.error || "Failed to load dashboard stats");
    return res.data || null;
  }
};

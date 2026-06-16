// ─── Base Config ────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Attach JWT token to every request automatically
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic request handler — throws on non-2xx so callers can catch
const request = async (method, path, body = null, isFormData = false) => {
  const headers = isFormData
    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
    : authHeaders();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Something went wrong");
  }

  // Some endpoints return plain text (download)
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/plain")) return res.text();

  return res.json();
};

// ─── Auth ────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => request("POST", "/auth/register", data),
  login: async (data) => {
    // FastAPI OAuth2 expects form data not JSON
    const form = new URLSearchParams();
    form.append("username", data.email);
    form.append("password", data.password);

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Login failed");
    }
    return res.json();
  },
};

// ─── Documents ──────────────────────────────────────────────────
export const documentsAPI = {
  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return request("POST", "/documents/upload", form, true);
  },
  getAll: () => request("GET", "/documents/"),
  getOne: (id) => request("GET", `/documents/${id}`),
  delete: (id) => request("DELETE", `/documents/${id}`),
  chat: (id, query) => request("POST", `/documents/${id}/chat`, { query }),
  search: (id, query) => request("POST", `/documents/${id}/search`, { query }),
  summary: (id) => request("POST", `/documents/${id}/summary`),
};

// ─── Chat History ───────────────────────────────────────────────
export const chatAPI = {
  getHistory: (docId) => request("GET", `/documents/${docId}/history`),
  clearHistory: (docId) => request("DELETE", `/documents/${docId}/history`),
  downloadHistory: async (docId) => {
    const res = await fetch(`${BASE_URL}/documents/${docId}/history/download`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Download failed");
    return res.blob();
  },
};

// ─── Library (Saved + Recent + Dashboard) ───────────────────────
export const libraryAPI = {
  save: (docId) => request("POST", `/library/save/${docId}`),
  unsave: (docId) => request("DELETE", `/library/save/${docId}`),
  getSaved: () => request("GET", "/library/saved"),
  getRecent: () => request("GET", "/library/recent"),
  getDashboard: () => request("GET", "/library/dashboard"),
};
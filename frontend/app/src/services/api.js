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
// const request = async (method, path, body = null, isFormData = false) => {
//   const headers = isFormData
//     ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
//     : authHeaders();

//   const res = await fetch(`${BASE_URL}${path}`, {
//     method,
//     headers,
//     body: isFormData ? body : body ? JSON.stringify(body) : null,
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({ detail: "Request failed" }));
//     throw new Error(err.detail || "Something went wrong");
//   }

//   // Some endpoints return plain text (download)
//   const contentType = res.headers.get("content-type") || "";
//   if (contentType.includes("text/plain")) return res.text();
const request = async (method, path, body = null, isFormData = false) => {
  const headers = isFormData
    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
    : authHeaders();

  const options = {
    method,
    headers,
  };

  if (isFormData) {
    options.body = body;
  } else if (body) {
    options.body = JSON.stringify(body);
  }

const res = await fetch(`${BASE_URL}${path}`, options);

const data = await res.json();

if (!res.ok) {
  console.log("Backend Error:", data);
  throw new Error(data.detail || "Request failed");
}

return data;
};

// ─── Auth ────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => request("POST", "/auth/register", data),
  login: (data) => request("POST", "/auth/login", data),

    
};

//─── Fetch me ──────────────────────────────────────────────────
export const userAPI = {
  me: () => request("GET", "/user/me"),
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
  compare: (documentIds, query) => request("POST", "/documents/compare", { document_ids: documentIds, query: query }),
  getShared: (token) => request("GET", `/shared/${token}`),
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

// ─── Profile ───────────────────────────────────────────────────
export const profileAPI = {
  get: () => request("GET", "/profile/"),

  update: (profileData) =>
    request("PUT", "/profile/", profileData),
};

// ─── Workspaces ───────────────────────────────────────────────────
export const workspacesAPI = {
  getAll: () => request("GET", "/workspaces/"),
  create: (workspaceData) =>
    request("POST", "/workspaces/", workspaceData),
  get: (id) =>
    request("GET", `/workspaces/${id}`),
  update: (id, workspaceData) =>
    request("PUT", `/workspaces/${id}`, workspaceData),
  delete: (id) =>
    request("DELETE", `/workspaces/${id}`),
  addDocument: (workspaceId, documentId) =>
    request("POST", `/workspaces/${workspaceId}/documents/${documentId}`),
  removeDocument: (workspaceId, documentId) =>
    request("DELETE", `/workspaces/${workspaceId}/documents/${documentId}`),
  getDocuments: (workspaceId) =>
    request("GET", `/workspaces/${workspaceId}/documents`),
};

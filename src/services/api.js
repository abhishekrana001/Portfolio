const rawEnv = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VIT_API_URL ||
  ""
).trim().replace(/\/+$/, "");

// Normalize API_BASE and SERVER_ORIGIN
export const API_BASE = rawEnv
  ? (rawEnv.endsWith("/api") ? rawEnv : `${rawEnv}/api`)
  : "/api";

export const SERVER_ORIGIN = rawEnv
  ? (rawEnv.endsWith("/api") ? rawEnv.slice(0, -4) : rawEnv)
  : "";

const BASE = API_BASE;

const request = async (url, options = {}) => {
  const pin = localStorage.getItem("adminPin") || localStorage.getItem("portfolio_admin_token");
  const headers = { ...options.headers };
  if (pin) headers["x-admin-pin"] = pin;

  const res = await fetch(`${BASE}${url}`, { ...options, headers });

  // Check karo response JSON hai ya HTML
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Server returned HTML instead of JSON (status: ${res.status}). Check backend is running.`);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const api = {
  // Public
  getProjects: () => request("/projects"),
  getSkills:   () => request("/skills"),
  sendMessage: (data) =>
    request("/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  getMessages: () => request("/messages"),
  deleteMessage: (id) =>
    request(`/messages/${id}`, { method: "DELETE" }),

  // Admin
  login: (pin) =>
    request("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    }),
  createProject: (formData) =>
    request("/projects", { method: "POST", body: formData }),
  updateProject: (id, formData) =>
    request(`/projects/${id}`, { method: "PUT", body: formData }),
  deleteProject: (id) =>
    request(`/projects/${id}`, { method: "DELETE" }),
};
const BASE = "/api";

const request = async (url, options = {}) => {
  const pin = localStorage.getItem("adminPin");
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
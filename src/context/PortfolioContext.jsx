import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { defaultPortfolioData } from "../data/defaultPortfolioData";
import { API_BASE } from "../services/api";

const PortfolioContext = createContext(null);

const STORAGE_KEY = "portfolio_local_data_v1";
const TOKEN_KEY = "portfolio_admin_token";

function sanitizeAndMergePortfolioData(incoming) {
  if (!incoming || typeof incoming !== "object") return defaultPortfolioData;

  // Helper: use incoming array if it's an actual array (even empty),
  // only fall back to default if the field is null/undefined (never saved)
  const resolveArray = (incomingArr, defaultArr) =>
    Array.isArray(incomingArr) ? incomingArr : defaultArr;

  return {
    home: { ...defaultPortfolioData.home, ...(incoming.home || {}) },
    about: {
      ...defaultPortfolioData.about,
      ...(incoming.about || {}),
      paragraphs: resolveArray(
        incoming.about?.paragraphs,
        defaultPortfolioData.about.paragraphs
      ),
      highlights: resolveArray(
        incoming.about?.highlights,
        defaultPortfolioData.about.highlights
      ),
      cards: resolveArray(
        incoming.about?.cards,
        defaultPortfolioData.about.cards
      ),
    },
    skills: {
      ...defaultPortfolioData.skills,
      ...(incoming.skills || {}),
      categories: resolveArray(
        incoming.skills?.categories,
        defaultPortfolioData.skills.categories
      ),
    },
    projects: {
      ...defaultPortfolioData.projects,
      ...(incoming.projects || {}),
      categories: resolveArray(
        incoming.projects?.categories,
        defaultPortfolioData.projects.categories
      ),
      items: Array.isArray(incoming.projects?.items)
        ? incoming.projects.items.map((p) => {
            if (!p) return {};
            let tags = [];
            if (Array.isArray(p.tags)) {
              tags = p.tags.filter(Boolean).map(String);
            } else if (typeof p.tags === "string") {
              tags = p.tags.split(/[,|]/).map((t) => t.trim()).filter(Boolean);
            }
            return {
              id: p.id || "p-" + Math.random().toString(36).substring(2, 9),
              name: p.name || "",
              category: p.category || "web",
              imageKey: p.imageKey || "",
              imageUrl: p.imageUrl || "",
              alt: p.alt || "",
              desc: p.desc || "",
              tags,
              repo: p.repo || "",
              demoUrl: p.demoUrl || "",
            };
          })
        : defaultPortfolioData.projects.items,
    },
    contact: { ...defaultPortfolioData.contact, ...(incoming.contact || {}) },
    footer: { ...defaultPortfolioData.footer, ...(incoming.footer || {}) },
    security: { ...defaultPortfolioData.security, ...(incoming.security || {}) },
  };
}

/* ─────────────────────────────────────────────────
   SAFE FETCH HELPER
   HTML response aane pe crash nahi karega
   ───────────────────────────────────────────────── */
async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);

  // HTML response detect karo (backend down hone pe aata hai)
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Server ne JSON nahi bheja (content-type: ${contentType || "unknown"}). Backend probably down hai.`
    );
  }

  if (!res.ok) {
    let errorMsg = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      errorMsg = errData.error || errData.message || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return sanitizeAndMergePortfolioData(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Could not read local portfolio cache", e);
    }
    return defaultPortfolioData;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  });

  /* ───────────────────────────────────────────────
     FETCH FROM SERVER — now with safe parsing
     ─────────────────────────────────────────────── */
  const fetchFromServer = useCallback(async () => {
    try {
      const serverData = await safeFetch(`${API_BASE}/portfolio`);

      if (serverData && typeof serverData === "object" && serverData.home) {
        const sanitized = sanitizeAndMergePortfolioData(serverData);
        setData(sanitized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      }
      setIsBackendConnected(true);
    } catch (err) {
      console.warn("⚠️ Backend not reached, using offline cached data:", err.message);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const serverData = await safeFetch(`${API_BASE}/portfolio`);
        if (!ignore && serverData && typeof serverData === "object" && serverData.home) {
          const sanitized = sanitizeAndMergePortfolioData(serverData);
          setData(sanitized);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
          setIsBackendConnected(true);
        }
      } catch (err) {
        if (!ignore) {
          console.warn("⚠️ Backend not reached, using offline cached data:", err.message);
          setIsBackendConnected(false);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

function compressImageIfNeeded(file, maxDimension = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith("image/")) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxDimension && height <= maxDimension && file.size < 500 * 1024) {
          return resolve(file);
        }

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const compressed = new File([blob], file.name, {
                type: blob.type || file.type,
                lastModified: Date.now(),
              });
              resolve(compressed);
            } else {
              resolve(file);
            }
          },
          file.type === "image/png" ? "image/png" : "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

  /* ───────────────────────────────────────────────
     SAVE PORTFOLIO
     ─────────────────────────────────────────────── */
  const savePortfolio = async (newData) => {
    setIsSaving(true);
    const sanitized = sanitizeAndMergePortfolioData(newData);
    setData(sanitized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch (storageErr) {
      console.warn("Could not write to localStorage cache (quota exceeded):", storageErr);
    }

    try {
      await safeFetch(`${API_BASE}/portfolio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitized),
      });

      setIsBackendConnected(true);
      setIsSaving(false);
      return { success: true, message: "Saved to server successfully!" };
    } catch (err) {
      console.warn("⚠️ Server unavailable, saved to localStorage:", err.message);
      setIsBackendConnected(false);
      setIsSaving(false);
      return {
        success: true,
        offline: true,
        message: "Saved locally (offline mode: server not connected)",
      };
    }
  };

  /* ───────────────────────────────────────────────
     UPDATE SECTION
     ─────────────────────────────────────────────── */
  const updateSection = async (sectionName, sectionData) => {
    const updated = {
      ...data,
      [sectionName]: sectionData,
    };
    return await savePortfolio(updated);
  };

  /* ───────────────────────────────────────────────
     RESET
     ─────────────────────────────────────────────── */
  const resetToDefaults = async () => {
    return await savePortfolio(defaultPortfolioData);
  };

  /* ───────────────────────────────────────────────
     UPLOAD FILE
     ─────────────────────────────────────────────── */
  const uploadFile = async (rawFile) => {
    const file = await compressImageIfNeeded(rawFile);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await safeFetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      return { success: true, url: result.url, filename: result.filename };
    } catch (err) {
      console.warn("Could not upload to server, falling back to base64:", err.message);
    }

    // Fallback: Convert to Base64 Data URL (saves locally)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          url: reader.result,
          filename: file.name,
          fallback: true,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  /* ───────────────────────────────────────────────
     LOGIN (PIN)
     ─────────────────────────────────────────────── */
  const login = async (enteredPin) => {
    try {
      const resData = await safeFetch(`${API_BASE}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: enteredPin }),
      });

      localStorage.setItem(TOKEN_KEY, resData.token || "admin-authenticated");
      localStorage.setItem("adminPin", enteredPin);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.warn("Server auth failed, trying offline check:", err.message);
    }

    // Offline fallback
    const currentPin = data?.security?.adminPin || "1234";
    if (enteredPin === currentPin) {
      localStorage.setItem(TOKEN_KEY, "admin-authenticated-offline");
      localStorage.setItem("adminPin", enteredPin);
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: "Invalid PIN code. Please try again." };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("adminPin");
    setIsAuthenticated(false);
  };

  /* ───────────────────────────────────────────────
     UPDATE PIN
     ─────────────────────────────────────────────── */
  const updatePin = async (oldPin, newPin) => {
    if (!oldPin || !newPin) {
      return { success: false, message: "Please enter both current and new PIN." };
    }
    if (newPin.trim().length < 4) {
      return { success: false, message: "New PIN must be at least 4 digits." };
    }

    // Try server endpoint first
    if (isBackendConnected) {
      try {
        const resData = await safeFetch(`${API_BASE}/auth/update-pin`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPin, newPin: newPin.trim() }),
        });
        if (resData?.success) {
          // Update local cache too
          const updatedData = {
            ...data,
            security: { ...data.security, adminPin: newPin.trim() },
          };
          setData(updatedData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
          localStorage.setItem("adminPin", newPin.trim());
          return { success: true, message: resData.message || "PIN updated successfully!" };
        }
        return { success: false, message: resData?.error || "Failed to update PIN." };
      } catch (err) {
        return { success: false, message: err.message || "Server error while updating PIN." };
      }
    }

    // Offline fallback — verify against local data
    const currentPin = data?.security?.adminPin || "1234";
    if (oldPin !== currentPin) {
      return { success: false, message: "Current PIN is incorrect." };
    }

    const updatedData = {
      ...data,
      security: { ...data.security, adminPin: newPin.trim() },
    };
    localStorage.setItem("adminPin", newPin.trim());
    return await savePortfolio(updatedData);
  };

  /* ───────────────────────────────────────────────
     EXPORT / IMPORT JSON
     ─────────────────────────────────────────────── */
  const exportDataJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJson = async (jsonContent) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed && parsed.home && parsed.projects) {
        return await savePortfolio(parsed);
      } else {
        return { success: false, message: "Invalid portfolio JSON format." };
      }
    } catch (e) {
      return { success: false, message: "Failed to parse JSON file: " + e.message };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        isBackendConnected,
        isAuthenticated,
        login,
        logout,
        savePortfolio,
        updateSection,
        resetToDefaults,
        uploadFile,
        updatePin,
        exportDataJson,
        importDataJson,
        refetch: fetchFromServer,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

PortfolioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
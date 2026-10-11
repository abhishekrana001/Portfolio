import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { defaultPortfolioData } from "../data/defaultPortfolioData";

const PortfolioContext = createContext(null);

const STORAGE_KEY = "portfolio_local_data_v1";
const TOKEN_KEY = "portfolio_admin_token";

function sanitizeAndMergePortfolioData(incoming) {
  if (!incoming || typeof incoming !== "object") return defaultPortfolioData;

  return {
    home: { ...defaultPortfolioData.home, ...(incoming.home || {}) },
    about: {
      ...defaultPortfolioData.about,
      ...(incoming.about || {}),
      paragraphs:
        Array.isArray(incoming.about?.paragraphs) && incoming.about.paragraphs.length > 0
          ? incoming.about.paragraphs
          : defaultPortfolioData.about.paragraphs,
      highlights:
        Array.isArray(incoming.about?.highlights) && incoming.about.highlights.length > 0
          ? incoming.about.highlights
          : defaultPortfolioData.about.highlights,
      cards:
        Array.isArray(incoming.about?.cards) && incoming.about.cards.length > 0
          ? incoming.about.cards
          : defaultPortfolioData.about.cards,
    },
    skills: {
      ...defaultPortfolioData.skills,
      ...(incoming.skills || {}),
      categories:
        Array.isArray(incoming.skills?.categories) && incoming.skills.categories.length > 0
          ? incoming.skills.categories
          : defaultPortfolioData.skills.categories,
    },
    projects: {
      ...defaultPortfolioData.projects,
      ...(incoming.projects || {}),
      categories:
        Array.isArray(incoming.projects?.categories) && incoming.projects.categories.length > 0
          ? incoming.projects.categories
          : defaultPortfolioData.projects.categories,
      items:
        Array.isArray(incoming.projects?.items) && incoming.projects.items.length > 0
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

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => {
    // Attempt local storage cache on initial render for instant load
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

  // Fetch from server on mount
  const fetchFromServer = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && typeof serverData === "object" && serverData.home) {
          const sanitized = sanitizeAndMergePortfolioData(serverData);
          setData(sanitized);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
          setIsBackendConnected(true);
        }
      } else {
        setIsBackendConnected(false);
      }
    } catch (err) {
      console.warn("Backend server not reached, using offline cached data:", err);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFromServer();
  }, [fetchFromServer]);

  // Save complete portfolio
  const savePortfolio = async (newData) => {
    setIsSaving(true);
    const sanitized = sanitizeAndMergePortfolioData(newData);
    setData(sanitized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitized),
      });

      if (res.ok) {
        setIsBackendConnected(true);
        setIsSaving(false);
        return { success: true, message: "Saved to server successfully!" };
      } else {
        setIsSaving(false);
        return {
          success: true,
          offline: true,
          message: "Saved locally (Server error: changes will persist in browser)",
        };
      }
    } catch (err) {
      console.warn("Server unavailable, changes saved to localStorage:", err);
      setIsBackendConnected(false);
      setIsSaving(false);
      return {
        success: true,
        offline: true,
        message: "Saved locally (Offline mode: server not connected)",
      };
    }
  };

  // Update specific section
  const updateSection = async (sectionName, sectionData) => {
    const updated = {
      ...data,
      [sectionName]: sectionData,
    };
    return await savePortfolio(updated);
  };

  // Reset to original defaults
  const resetToDefaults = async () => {
    return await savePortfolio(defaultPortfolioData);
  };

  // Upload file (images or documents)
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        return { success: true, url: result.url, filename: result.filename };
      }
    } catch (err) {
      console.warn("Could not upload to server, falling back to base64 DataURL:", err);
    }

    // Fallback: Convert to Base64 Data URL so it saves locally inside the JSON/localStorage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ success: true, url: reader.result, filename: file.name, fallback: true });
      };
      reader.readAsDataURL(file);
    });
  };

  // Verify PIN
  const login = async (enteredPin) => {
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: enteredPin }),
      });
      if (res.ok) {
        const resData = await res.json();
        localStorage.setItem(TOKEN_KEY, resData.token || "admin-authenticated");
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (err) {
      console.warn("Using offline auth check:", err);
    }

    // Local fallback check
    const currentPin = data?.security?.adminPin || "1234";
    if (enteredPin === currentPin) {
      localStorage.setItem(TOKEN_KEY, "admin-authenticated-offline");
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: "Invalid PIN code. Please try again." };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  };

  // Update PIN
  const updatePin = async (oldPin, newPin) => {
    const currentPin = data?.security?.adminPin || "1234";
    if (oldPin !== currentPin) {
      return { success: false, message: "Current PIN is incorrect." };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: "New PIN must be at least 4 digits." };
    }

    const updatedData = {
      ...data,
      security: {
        ...data.security,
        adminPin: newPin.trim(),
      },
    };

    return await savePortfolio(updatedData);
  };

  // Export JSON file
  const exportDataJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
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

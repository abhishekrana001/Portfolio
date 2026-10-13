import { useState, useEffect } from "react";
import { MessageSquare, Trash2, Mail, Calendar, RefreshCw } from "lucide-react";

function MessagesViewer() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const pin = localStorage.getItem("adminPin") || "1234";
      const res = await fetch("/api/messages", {
        headers: { "x-admin-pin": pin },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load messages from MongoDB");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const pin = localStorage.getItem("adminPin") || "1234";
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: { "x-admin-pin": pin },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="admin-editor-card">
      <div className="admin-editor-header">
        <div>
          <h2 className="admin-editor-title">Received Inquiries (MongoDB)</h2>
          <p className="admin-editor-subtitle">
            Messages sent via your portfolio contact section, stored in MongoDB.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchMessages}
          className="admin-btn-secondary compact"
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="admin-toast-inline error" style={{ background: "#fee2e2", color: "#b91c1c" }}>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
          Loading messages from MongoDB...
        </p>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
          <MessageSquare size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <p>No messages received yet. Messages sent through the contact form will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                background: "var(--bg-secondary, #1e293b)",
                border: "1px solid var(--border-subtle, #334155)",
                borderRadius: "8px",
                padding: "1.2rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-primary, #fff)" }}>
                    {msg.name}
                  </h4>
                  <a
                    href={`mailto:${msg.email}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.85rem",
                      color: "var(--accent-primary, #38bdf8)",
                      textDecoration: "none",
                    }}
                  >
                    <Mail size={12} />
                    <span>{msg.email}</span>
                  </a>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {msg.createdAt && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.75rem",
                        color: "#94a3b8",
                      }}
                    >
                      <Calendar size={12} />
                      <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(msg._id)}
                    className="admin-btn-action delete"
                    title="Delete inquiry"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#f87171",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {msg.subject && (
                <p style={{ margin: "0.4rem 0", fontWeight: "600", fontSize: "0.9rem", color: "#cbd5e1" }}>
                  Subject: {msg.subject}
                </p>
              )}

              <p
                style={{
                  margin: "0.4rem 0 0",
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.5",
                }}
              >
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessagesViewer;

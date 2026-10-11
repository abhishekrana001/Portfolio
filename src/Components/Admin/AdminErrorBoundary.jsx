import React from "react";
import PropTypes from "prop-types";
import { AlertTriangle, RotateCcw } from "lucide-react";

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin Section Error Boundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="admin-editor-card"
          style={{
            border: "1px solid rgba(239, 68, 68, 0.4)",
            background: "rgba(15, 23, 42, 0.95)",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "#f87171", marginBottom: "8px" }}>
            Section Failed to Display
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "20px" }}>
            {this.state.error?.message ||
              "An unexpected error occurred while loading this section."}
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              type="button"
              onClick={this.handleReset}
              className="admin-save-btn"
            >
              <RotateCcw size={16} />
              <span>Reload Section</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

AdminErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func,
};

export default AdminErrorBoundary;

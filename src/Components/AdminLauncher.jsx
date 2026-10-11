import { Link } from "react-router-dom";
import { SlidersHorizontal, ShieldCheck } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import "./AdminLauncher.css";

function AdminLauncher() {
  const { isAuthenticated, isBackendConnected } = usePortfolio();

  return (
    <div className="admin-launcher-container" title="Open Portfolio Control Panel">
      <Link to="/admin" className="admin-launcher-btn" aria-label="Open Control Panel">
        <span className="admin-launcher-icon-wrapper">
          {isAuthenticated ? (
            <ShieldCheck size={20} className="launcher-icon text-success" />
          ) : (
            <SlidersHorizontal size={20} className="launcher-icon" />
          )}
          <span
            className={`admin-status-indicator ${isBackendConnected ? "online" : "offline"}`}
            title={isBackendConnected ? "Backend Server Connected" : "Local Storage Mode"}
          />
        </span>
        <span className="admin-launcher-text">Dashboard</span>
      </Link>
    </div>
  );
}

export default AdminLauncher;

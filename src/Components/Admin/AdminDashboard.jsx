import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Home,
  User,
  Wrench,
  Briefcase,
  Mail,
  Sliders,
  ShieldAlert,
  ExternalLink,
  LogOut,
  Download,
  Menu,
  X,
  Radio,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import AdminLogin from "./AdminLogin";
import HeroEditor from "./HeroEditor";
import AboutEditor from "./AboutEditor";
import SkillsEditor from "./SkillsEditor";
import ProjectsEditor from "./ProjectsEditor";
import ContactEditor from "./ContactEditor";
import FooterEditor from "./FooterEditor";
import SettingsEditor from "./SettingsEditor";
import AdminErrorBoundary from "./AdminErrorBoundary";
import "./AdminDashboard.css";

const TABS = [
  { id: "hero", label: "Hero & Bio", icon: Home },
  { id: "about", label: "About Me", icon: User },
  { id: "skills", label: "Technical Skills", icon: Wrench },
  { id: "projects", label: "Projects Portfolio", icon: Briefcase },
  { id: "contact", label: "Contact Details", icon: Mail },
  { id: "footer", label: "Footer & Brand", icon: Sliders },
  { id: "settings", label: "Security & Backup", icon: ShieldAlert },
];

function AdminDashboard() {
  const {
    data,
    isLoading,
    isSaving,
    isBackendConnected,
    isAuthenticated,
    login,
    logout,
    updateSection,
    resetToDefaults,
    uploadFile,
    updatePin,
    exportDataJson,
    importDataJson,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <p className="admin-loading-text">Loading Portfolio Studio...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  const renderActiveEditor = () => {
    switch (activeTab) {
      case "hero":
        return (
          <HeroEditor
            initialData={data?.home}
            onSave={updateSection}
            onUploadFile={uploadFile}
            isSaving={isSaving}
          />
        );
      case "about":
        return (
          <AboutEditor
            initialData={data?.about}
            onSave={updateSection}
            isSaving={isSaving}
          />
        );
      case "skills":
        return (
          <SkillsEditor
            initialData={data?.skills}
            onSave={updateSection}
            isSaving={isSaving}
          />
        );
      case "projects":
        return (
          <ProjectsEditor
            key="projects-editor"
            initialData={data?.projects}
            onSave={updateSection}
            onUploadFile={uploadFile}
            isSaving={isSaving}
          />
        );
      case "contact":
        return (
          <ContactEditor
            initialData={data?.contact}
            onSave={updateSection}
            isSaving={isSaving}
          />
        );
      case "footer":
        return (
          <FooterEditor
            initialData={data?.footer}
            onSave={updateSection}
            isSaving={isSaving}
          />
        );
      case "settings":
        return (
          <SettingsEditor
            onUpdatePin={updatePin}
            onExportData={exportDataJson}
            onImportData={importDataJson}
            onResetDefaults={resetToDefaults}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard-root">
      {/* Top Navbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            type="button"
            className="admin-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="admin-brand-link">
            <span className="admin-brand-logo">
              Portfolio<span className="admin-brand-accent">Studio</span>
            </span>
          </Link>

          <div
            className={`admin-connection-status ${
              isBackendConnected ? "connected" : "standalone"
            }`}
          >
            <Radio size={14} className="pulse-icon" />
            <span>
              {isBackendConnected
                ? "Backend Connected (Port 5000)"
                : "Local Storage Mode"}
            </span>
          </div>
        </div>

        <div className="admin-topbar-right">
          <button
            type="button"
            onClick={exportDataJson}
            className="admin-topbar-btn backup"
            title="Export JSON Backup"
          >
            <Download size={16} />
            <span className="btn-label-desktop">Export Backup</span>
          </button>

          <Link to="/" className="admin-topbar-btn preview" title="View Portfolio">
            <span>View Live Site</span>
            <ExternalLink size={16} />
          </Link>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="admin-topbar-btn logout"
            title="Log out"
          >
            <LogOut size={16} />
            <span className="btn-label-desktop">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content Area */}
      <div className="admin-main-container">
        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}
        >
          <div className="admin-sidebar-section-title">SECTIONS & CONTROLS</div>
          <nav className="admin-sidebar-nav">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`admin-nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} className="nav-item-icon" />
                  <span className="nav-item-label">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-quick-tip">
              <Sparkles size={14} />
              <span>Edits save in real-time to your portfolio backend!</span>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileMenuOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Content Body */}
        <main className="admin-content-area">
          <div className="admin-content-wrapper">
            <AdminErrorBoundary key={activeTab} onReset={resetToDefaults}>
              {renderActiveEditor()}
            </AdminErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
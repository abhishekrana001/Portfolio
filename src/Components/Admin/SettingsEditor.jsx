import { useState } from "react";
import PropTypes from "prop-types";
import { Download, Upload, KeyRound, Check, AlertTriangle } from "lucide-react";

function SettingsEditor({ onUpdatePin, onExportData, onImportData, isSaving }) {
  const [pinForm, setPinForm] = useState({
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });
  const [pinStatus, setPinStatus] = useState(null);
  const [pinError, setPinError] = useState("");
  const [generalStatus, setGeneralStatus] = useState(null);

  const handlePinChange = (e) => {
    const { name, value } = e.target;
    setPinForm((prev) => ({ ...prev, [name]: value }));
    if (pinError) setPinError("");
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pinForm.oldPin || !pinForm.newPin) {
      setPinError("Please enter both current and new PIN.");
      return;
    }
    if (pinForm.newPin !== pinForm.confirmPin) {
      setPinError("New PIN and Confirm PIN do not match.");
      return;
    }
    if (pinForm.newPin.length < 4) {
      setPinError("New PIN must be at least 4 digits.");
      return;
    }

    const res = await onUpdatePin(pinForm.oldPin, pinForm.newPin);
    if (res?.success) {
      setPinStatus("PIN updated successfully! Remember your new PIN.");
      setPinForm({ oldPin: "", newPin: "", confirmPin: "" });
      setTimeout(() => setPinStatus(null), 4000);
    } else {
      setPinError(res?.message || "Failed to update PIN. Check current PIN.");
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const res = await onImportData(content);
        if (res?.success) {
          setGeneralStatus("Portfolio backup restored and saved successfully!");
          setTimeout(() => setGeneralStatus(null), 4000);
        } else {
          alert(res?.message || "Invalid JSON file.");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="admin-editor-card">
      <div className="admin-editor-header">
        <div>
          <h2 className="admin-editor-title">Security & Backup Settings</h2>
          <p className="admin-editor-subtitle">
            Manage your access PIN and download or restore full configuration backups.
          </p>
        </div>
      </div>

      {generalStatus && (
        <div className="admin-toast-inline success">
          <Check size={18} />
          <span>{generalStatus}</span>
        </div>
      )}

      {/* PIN Security Section */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Change Admin Security PIN</h3>
        <p className="admin-field-desc">
          Set a secure personal PIN required to unlock this dashboard.
        </p>

        {pinStatus && (
          <div className="admin-toast-inline success mb-3">
            <Check size={16} />
            <span>{pinStatus}</span>
          </div>
        )}

        {pinError && (
          <div className="admin-toast-inline error mb-3">
            <AlertTriangle size={16} />
            <span>{pinError}</span>
          </div>
        )}

        <form onSubmit={handlePinSubmit} className="pin-change-form">
          <div className="admin-grid-3">
            <div className="admin-form-group">
              <label className="admin-label">Current PIN</label>
              <input
                type="password"
                name="oldPin"
                value={pinForm.oldPin}
                onChange={handlePinChange}
                placeholder="Current PIN (e.g. 1234)"
                className="admin-input"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">New PIN (4+ digits)</label>
              <input
                type="password"
                name="newPin"
                value={pinForm.newPin}
                onChange={handlePinChange}
                placeholder="New PIN"
                className="admin-input"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Confirm New PIN</label>
              <input
                type="password"
                name="confirmPin"
                value={pinForm.confirmPin}
                onChange={handlePinChange}
                placeholder="Confirm New PIN"
                className="admin-input"
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <button type="submit" className="admin-btn-primary" disabled={isSaving}>
              <KeyRound size={16} />
              <span>Update PIN</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backup & Restore */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Backup & Portability</h3>
        <p className="admin-field-desc">
          Export your entire portfolio content as a standalone JSON file to back up your changes or transfer to another deployment.
        </p>

        <div className="backup-action-cards-grid">
          <div className="backup-card">
            <div className="backup-card-icon">
              <Download size={22} />
            </div>
            <div className="backup-card-info">
              <h4 className="backup-card-title">Export Backup (JSON)</h4>
              <p className="backup-card-desc">
                Download a complete snapshot of all sections, skills, and projects.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportData}
              className="admin-btn-secondary"
            >
              <Download size={16} />
              <span>Download JSON</span>
            </button>
          </div>

          <div className="backup-card">
            <div className="backup-card-icon">
              <Upload size={22} />
            </div>
            <div className="backup-card-info">
              <h4 className="backup-card-title">Import Backup (JSON)</h4>
              <p className="backup-card-desc">
                Restore previously exported portfolio data from a JSON file.
              </p>
            </div>
            <label className="admin-upload-btn">
              <Upload size={16} />
              <span>Choose File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

SettingsEditor.propTypes = {
  onUpdatePin: PropTypes.func.isRequired,
  onExportData: PropTypes.func.isRequired,
  onImportData: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

export default SettingsEditor;

import { useState } from "react";
import PropTypes from "prop-types";
import { Check } from "lucide-react";

function FooterEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    brandName: initialData?.brandName || "Abhishek",
    tagline:
      initialData?.tagline ||
      "Java Full Stack & Android Developer • Building high-impact software",
    copyrightNote:
      initialData?.copyrightNote ||
      "Abhishek Rana. All rights reserved. Built with React & Vite.",
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSave("footer", formData);
    setSaveStatus(result?.message || "Footer branding updated successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-editor-card">
      <div className="admin-editor-header">
        <div>
          <h2 className="admin-editor-title">Footer & Global Branding</h2>
          <p className="admin-editor-subtitle">
            Configure bottom-of-page branding, site tagline, and copyright disclaimers.
          </p>
        </div>
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Footer"}
        </button>
      </div>

      {saveStatus && (
        <div className="admin-toast-inline success">
          <Check size={18} />
          <span>{saveStatus}</span>
        </div>
      )}

      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Branding & Tagline</h3>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Brand Name (Logo)</label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              placeholder="Abhishek"
              className="admin-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Footer Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Java Full Stack & Android Developer • Building high-impact software"
              className="admin-input"
            />
          </div>
        </div>

        <div className="admin-form-group mt-3">
          <label className="admin-label">Copyright Notice Text</label>
          <input
            type="text"
            name="copyrightNote"
            value={formData.copyrightNote}
            onChange={handleChange}
            placeholder="Abhishek Rana. All rights reserved. Built with React & Vite."
            className="admin-input"
          />
          <small className="admin-helper-text">
            Tip: The current year is automatically injected before this note.
          </small>
        </div>
      </div>

      <div className="admin-editor-footer">
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Footer"}
        </button>
      </div>
    </form>
  );
}

FooterEditor.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

export default FooterEditor;

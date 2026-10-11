import { useState } from "react";
import PropTypes from "prop-types";
import { Upload, FileText, Check } from "lucide-react";
import defaultProfileImg from "../../assets/MyImg.webp";

function HeroEditor({ initialData, onSave, onUploadFile, isSaving }) {
  const [formData, setFormData] = useState({
    statusText: initialData?.statusText || "",
    greeting: initialData?.greeting || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    projectsButtonText: initialData?.projectsButtonText || "View Projects",
    resumeButtonText: initialData?.resumeButtonText || "Download Resume",
    resumeUrl: initialData?.resumeUrl || "",
    resumeFileName: initialData?.resumeFileName || "Abhishek_Rana_CV.pdf",
    customAvatarUrl: initialData?.customAvatarUrl || "",
    badgeTitle: initialData?.badgeTitle || "Specialization",
    badgeSubtitle: initialData?.badgeSubtitle || "Spring Boot & React",
    socials: {
      github: initialData?.socials?.github || "",
      linkedin: initialData?.socials?.linkedin || "",
      email: initialData?.socials?.email || "",
    },
  });

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [name]: value },
    }));
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const res = await onUploadFile(file);
    setAvatarUploading(false);
    if (res?.url) {
      setFormData((prev) => ({ ...prev, customAvatarUrl: res.url }));
    }
  };

  const handleResumeFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeUploading(true);
    const res = await onUploadFile(file);
    setResumeUploading(false);
    if (res?.url) {
      setFormData((prev) => ({
        ...prev,
        resumeUrl: res.url,
        resumeFileName: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSave("home", formData);
    setSaveStatus(result?.message || "Hero section updated successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const currentAvatar = formData.customAvatarUrl?.trim() || defaultProfileImg;

  return (
    <form onSubmit={handleSubmit} className="admin-editor-card">
      <div className="admin-editor-header">
        <div>
          <h2 className="admin-editor-title">Hero & Profile Settings</h2>
          <p className="admin-editor-subtitle">
            Configure your headline, profile image, introductory pitch, resume, and social profiles.
          </p>
        </div>
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Hero Section"}
        </button>
      </div>

      {saveStatus && (
        <div className="admin-toast-inline success">
          <Check size={18} />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Profile Image & Avatar */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Profile Picture & Visuals</h3>
        <div className="avatar-uploader-row">
          <div className="avatar-preview-box">
            <img src={currentAvatar} alt="Profile Preview" className="avatar-preview-img" />
          </div>
          <div className="avatar-controls">
            <div className="admin-form-group">
              <label className="admin-label">Custom Avatar Image URL</label>
              <input
                type="text"
                name="customAvatarUrl"
                value={formData.customAvatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/my-photo.jpg (or upload below)"
                className="admin-input"
              />
            </div>
            <div className="avatar-upload-actions">
              <label className="admin-upload-btn">
                <Upload size={16} />
                <span>{avatarUploading ? "Uploading..." : "Upload New Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  style={{ display: "none" }}
                  disabled={avatarUploading}
                />
              </label>
              {formData.customAvatarUrl && (
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setFormData((p) => ({ ...p, customAvatarUrl: "" }))}
                >
                  Reset to Default Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Name and Identity */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Identity & Role</h3>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Greeting Line</label>
            <input
              type="text"
              name="greeting"
              value={formData.greeting}
              onChange={handleChange}
              placeholder="Hi there, I am"
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Availability / Status Line</label>
            <input
              type="text"
              name="statusText"
              value={formData.statusText}
              onChange={handleChange}
              placeholder="Available for Full-time Roles & Projects"
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Abhishek"
              className="admin-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Last Name (Accent Highlight)</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Rana"
              className="admin-input"
              required
            />
          </div>
        </div>

        <div className="admin-form-group mt-3">
          <label className="admin-label">Professional Role / Headline</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Java Full Stack & Android Developer"
            className="admin-input"
            required
          />
        </div>

        <div className="admin-form-group mt-3">
          <label className="admin-label">Elevator Pitch / Bio Summary</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Brief introductory summary..."
            className="admin-textarea"
            required
          />
        </div>
      </div>

      {/* Floating Badge */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Hero Floating Badge</h3>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Badge Title</label>
            <input
              type="text"
              name="badgeTitle"
              value={formData.badgeTitle}
              onChange={handleChange}
              placeholder="Specialization"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Badge Subtitle</label>
            <input
              type="text"
              name="badgeSubtitle"
              value={formData.badgeSubtitle}
              onChange={handleChange}
              placeholder="Spring Boot & React"
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {/* Resume and Actions */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Resume & Action Buttons</h3>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Projects Button Text</label>
            <input
              type="text"
              name="projectsButtonText"
              value={formData.projectsButtonText}
              onChange={handleChange}
              placeholder="View Projects"
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Resume Button Text</label>
            <input
              type="text"
              name="resumeButtonText"
              value={formData.resumeButtonText}
              onChange={handleChange}
              placeholder="Download Resume"
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Download File Name</label>
            <input
              type="text"
              name="resumeFileName"
              value={formData.resumeFileName}
              onChange={handleChange}
              placeholder="Abhishek_Rana_CV.pdf"
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Custom Resume URL / File</label>
            <div className="file-input-inline">
              <input
                type="text"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                placeholder="Leave empty for bundled CV or upload ->"
                className="admin-input"
              />
              <label className="admin-upload-btn-compact" title="Upload PDF">
                <FileText size={16} />
                <span>{resumeUploading ? "..." : "Upload"}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeFile}
                  style={{ display: "none" }}
                  disabled={resumeUploading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Social & Contact Links</h3>
        <div className="admin-grid-3">
          <div className="admin-form-group">
            <label className="admin-label">GitHub URL</label>
            <input
              type="url"
              name="github"
              value={formData.socials.github}
              onChange={handleSocialChange}
              placeholder="https://github.com/..."
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              value={formData.socials.linkedin}
              onChange={handleSocialChange}
              placeholder="https://linkedin.com/in/..."
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.socials.email}
              onChange={handleSocialChange}
              placeholder="youremail@example.com"
              className="admin-input"
            />
          </div>
        </div>
      </div>

      <div className="admin-editor-footer">
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Hero Section"}
        </button>
      </div>
    </form>
  );
}

HeroEditor.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onUploadFile: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

export default HeroEditor;

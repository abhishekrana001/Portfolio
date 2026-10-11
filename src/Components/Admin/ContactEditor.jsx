import { useState } from "react";
import PropTypes from "prop-types";
import { Check } from "lucide-react";

function ContactEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    sectionTag: initialData?.sectionTag || "Get In Touch",
    sectionTitle: initialData?.sectionTitle || "Let's Connect & Collaborate",
    sectionSubtitle: initialData?.sectionSubtitle || "",
    introTitle: initialData?.introTitle || "Start a Conversation",
    introText: initialData?.introText || "",
    emailAddress: initialData?.emailAddress || "abhishekrana99813@gmail.com",
    linkedinHandle: initialData?.linkedinHandle || "in/abhishekrana99813",
    linkedinUrl: initialData?.linkedinUrl || "https://linkedin.com/in/abhishekrana99813",
    githubHandle: initialData?.githubHandle || "github.com/abhishekrana001",
    githubUrl: initialData?.githubUrl || "https://github.com/abhishekrana001",
    quickBadge: initialData?.quickBadge || "Open to Opportunities",
    quickHeading:
      initialData?.quickHeading || "Ready to discuss your next breakthrough project?",
    quickDesc: initialData?.quickDesc || "",
    responseTime: initialData?.responseTime || "Fast response time within 24 hours",
    locationStatus:
      initialData?.locationStatus || "Available for Remote, Hybrid & Relocation",
    emailSubject:
      initialData?.emailSubject || "Discussion regarding Developer Opportunity",
    emailBody:
      initialData?.emailBody ||
      "Hi Abhishek,\n\nI reviewed your portfolio and would like to connect with you.",
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSave("contact", formData);
    setSaveStatus(result?.message || "Contact details updated successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-editor-card">
      <div className="admin-editor-header">
        <div>
          <h2 className="admin-editor-title">Contact & Inquiries Settings</h2>
          <p className="admin-editor-subtitle">
            Configure contact information, professional channels, response availability, and direct mail templates.
          </p>
        </div>
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Contact Info"}
        </button>
      </div>

      {saveStatus && (
        <div className="admin-toast-inline success">
          <Check size={18} />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Section Headings */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Section Headings</h3>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Tag</label>
            <input
              type="text"
              name="sectionTag"
              value={formData.sectionTag}
              onChange={handleChange}
              placeholder="Get In Touch"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Title</label>
            <input
              type="text"
              name="sectionTitle"
              value={formData.sectionTitle}
              onChange={handleChange}
              placeholder="Let's Connect & Collaborate"
              className="admin-input"
            />
          </div>
        </div>

        <div className="admin-form-group mt-3">
          <label className="admin-label">Subtitle</label>
          <input
            type="text"
            name="sectionSubtitle"
            value={formData.sectionSubtitle}
            onChange={handleChange}
            placeholder="Whether you have an exciting job opportunity..."
            className="admin-input"
          />
        </div>
      </div>

      {/* Left Column: Intro & Direct Channels */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Direct Contact Channels</h3>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Intro Heading</label>
            <input
              type="text"
              name="introTitle"
              value={formData.introTitle}
              onChange={handleChange}
              placeholder="Start a Conversation"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Email Address (Primary)</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="abhishekrana99813@gmail.com"
              className="admin-input"
              required
            />
          </div>
        </div>

        <div className="admin-form-group mt-3">
          <label className="admin-label">Intro Message</label>
          <textarea
            name="introText"
            value={formData.introText}
            onChange={handleChange}
            rows={2}
            placeholder="I am actively seeking Full Stack..."
            className="admin-textarea"
          />
        </div>

        <div className="admin-grid-2 mt-3">
          <div className="admin-form-group">
            <label className="admin-label">LinkedIn Handle Label</label>
            <input
              type="text"
              name="linkedinHandle"
              value={formData.linkedinHandle}
              onChange={handleChange}
              placeholder="in/abhishekrana99813"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">LinkedIn URL</label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">GitHub Handle Label</label>
            <input
              type="text"
              name="githubHandle"
              value={formData.githubHandle}
              onChange={handleChange}
              placeholder="github.com/abhishekrana001"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Quick Proposal Box */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Collaboration Banner Card</h3>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Status Badge Text</label>
            <input
              type="text"
              name="quickBadge"
              value={formData.quickBadge}
              onChange={handleChange}
              placeholder="Open to Opportunities"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Card Heading</label>
            <input
              type="text"
              name="quickHeading"
              value={formData.quickHeading}
              onChange={handleChange}
              placeholder="Ready to discuss your next breakthrough project?"
              className="admin-input"
            />
          </div>
        </div>

        <div className="admin-form-group mt-3">
          <label className="admin-label">Description</label>
          <textarea
            name="quickDesc"
            value={formData.quickDesc}
            onChange={handleChange}
            rows={2}
            placeholder="I bring a strong work ethic..."
            className="admin-textarea"
          />
        </div>

        <div className="admin-grid-2 mt-3">
          <div className="admin-form-group">
            <label className="admin-label">Response Time Indicator</label>
            <input
              type="text"
              name="responseTime"
              value={formData.responseTime}
              onChange={handleChange}
              placeholder="Fast response time within 24 hours"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Location / Work Mode</label>
            <input
              type="text"
              name="locationStatus"
              value={formData.locationStatus}
              onChange={handleChange}
              placeholder="Available for Remote, Hybrid & Relocation"
              className="admin-input"
            />
          </div>
        </div>

        <div className="admin-grid-2 mt-3">
          <div className="admin-form-group">
            <label className="admin-label">Email Pre-filled Subject</label>
            <input
              type="text"
              name="emailSubject"
              value={formData.emailSubject}
              onChange={handleChange}
              placeholder="Discussion regarding Developer Opportunity"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Email Pre-filled Body Template</label>
            <textarea
              name="emailBody"
              value={formData.emailBody}
              onChange={handleChange}
              rows={2}
              placeholder="Hi Abhishek,\n\nI reviewed your portfolio..."
              className="admin-textarea"
            />
          </div>
        </div>
      </div>

      <div className="admin-editor-footer">
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Contact Info"}
        </button>
      </div>
    </form>
  );
}

ContactEditor.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

export default ContactEditor;

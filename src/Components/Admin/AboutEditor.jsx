import { useState } from "react";
import PropTypes from "prop-types";
import { Plus, Trash2, Check } from "lucide-react";
import { AVAILABLE_ICONS } from "../../data/assetRegistry.js";

function AboutEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    sectionTag: initialData?.sectionTag || "About Me",
    sectionTitle: initialData?.sectionTitle || "Background & Passion",
    sectionSubtitle: initialData?.sectionSubtitle || "",
    paragraphs: initialData?.paragraphs ? [...initialData.paragraphs] : [],
    highlights: initialData?.highlights ? [...initialData.highlights] : [],
    cards: initialData?.cards
      ? initialData.cards.map((c) => ({ ...c }))
      : [],
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Paragraphs
  const handleParagraphChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.paragraphs];
      updated[index] = value;
      return { ...prev, paragraphs: updated };
    });
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, "New paragraph..."],
    }));
  };

  const removeParagraph = (index) => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index),
    }));
  };

  // Highlights
  const handleHighlightChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.highlights];
      updated[index] = value;
      return { ...prev, highlights: updated };
    });
  };

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, "New key highlight bullet point"],
    }));
  };

  const removeHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  // Cards
  const handleCardChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.cards];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, cards: updated };
    });
  };

  const addCard = () => {
    setFormData((prev) => ({
      ...prev,
      cards: [
        ...prev.cards,
        {
          id: "card-" + Date.now(),
          icon: "GraduationCap",
          title: "New Focus Area",
          value: "Skill or Degree",
          desc: "Brief description of this achievement or specialty.",
        },
      ],
    }));
  };

  const removeCard = (index) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSave("about", formData);
    setSaveStatus(result?.message || "About section updated successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const iconOptions = Object.keys(AVAILABLE_ICONS);

  return (
    <form onSubmit={handleSubmit} className="admin-editor-card">
      <div className="admin-editor-header">
        <div>
          <h2 className="admin-editor-title">About Section Settings</h2>
          <p className="admin-editor-subtitle">
            Customize your biographical story, education/focus cards, and professional highlights.
          </p>
        </div>
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save About Section"}
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
            <label className="admin-label">Tag / Mini Header</label>
            <input
              type="text"
              name="sectionTag"
              value={formData.sectionTag}
              onChange={handleTextChange}
              placeholder="About Me"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Main Title</label>
            <input
              type="text"
              name="sectionTitle"
              value={formData.sectionTitle}
              onChange={handleTextChange}
              placeholder="Background & Passion"
              className="admin-input"
            />
          </div>
        </div>
        <div className="admin-form-group mt-3">
          <label className="admin-label">Subtitle Description</label>
          <input
            type="text"
            name="sectionSubtitle"
            value={formData.sectionSubtitle}
            onChange={handleTextChange}
            placeholder="Driven software engineer with a strong focus on backend scalability..."
            className="admin-input"
          />
        </div>
      </div>

      {/* Story Narrative Paragraphs */}
      <div className="admin-field-section">
        <div className="section-title-with-action">
          <h3 className="admin-field-section-title">Bio Narrative Paragraphs</h3>
          <button type="button" onClick={addParagraph} className="admin-btn-secondary compact">
            <Plus size={15} />
            <span>Add Paragraph</span>
          </button>
        </div>

        <div className="dynamic-items-list">
          {formData.paragraphs.map((p, i) => (
            <div className="dynamic-item-row" key={i}>
              <span className="item-order-badge">#{i + 1}</span>
              <textarea
                value={p}
                onChange={(e) => handleParagraphChange(i, e.target.value)}
                rows={3}
                className="admin-textarea flex-1"
                placeholder="Narrative paragraph content..."
              />
              <button
                type="button"
                onClick={() => removeParagraph(i)}
                className="admin-item-delete-btn"
                title="Delete paragraph"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights List */}
      <div className="admin-field-section">
        <div className="section-title-with-action">
          <h3 className="admin-field-section-title">Key Highlights & Bullet Points</h3>
          <button type="button" onClick={addHighlight} className="admin-btn-secondary compact">
            <Plus size={15} />
            <span>Add Bullet Point</span>
          </button>
        </div>

        <div className="dynamic-items-list">
          {formData.highlights.map((h, i) => (
            <div className="dynamic-item-row" key={i}>
              <span className="highlight-bullet-indicator">✓</span>
              <input
                type="text"
                value={h}
                onChange={(e) => handleHighlightChange(i, e.target.value)}
                className="admin-input flex-1"
                placeholder="Key bullet point statement..."
              />
              <button
                type="button"
                onClick={() => removeHighlight(i)}
                className="admin-item-delete-btn"
                title="Delete highlight"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="admin-field-section">
        <div className="section-title-with-action">
          <h3 className="admin-field-section-title">Focus & Education Feature Cards</h3>
          <button type="button" onClick={addCard} className="admin-btn-secondary compact">
            <Plus size={15} />
            <span>Add Card</span>
          </button>
        </div>

        <div className="admin-cards-editor-grid">
          {formData.cards.map((card, i) => (
            <div className="admin-card-item-box" key={card.id || i}>
              <div className="card-item-box-header">
                <span className="card-item-badge">Card #{i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCard(i)}
                  className="admin-item-delete-btn"
                  title="Delete Card"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Icon</label>
                  <select
                    value={card.icon || "GraduationCap"}
                    onChange={(e) => handleCardChange(i, "icon", e.target.value)}
                    className="admin-select"
                  >
                    {iconOptions.map((iconName) => (
                      <option key={iconName} value={iconName}>
                        {iconName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Tag / Label</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleCardChange(i, "title", e.target.value)}
                    placeholder="Education"
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group mt-2">
                <label className="admin-label">Card Heading / Value</label>
                <input
                  type="text"
                  value={card.value}
                  onChange={(e) => handleCardChange(i, "value", e.target.value)}
                  placeholder="B.Sc. in IT Graduate"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group mt-2">
                <label className="admin-label">Short Description</label>
                <textarea
                  value={card.desc}
                  onChange={(e) => handleCardChange(i, "desc", e.target.value)}
                  placeholder="Strong academic foundation in computer science..."
                  rows={2}
                  className="admin-textarea"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-editor-footer">
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save About Section"}
        </button>
      </div>
    </form>
  );
}

AboutEditor.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

export default AboutEditor;

import { useState } from "react";
import PropTypes from "prop-types";
import { Plus, Trash2, X, Check } from "lucide-react";
import { AVAILABLE_ICONS } from "../../data/assetRegistry.js";

function SkillsEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    sectionTag: initialData?.sectionTag || "Core Competencies",
    sectionTitle: initialData?.sectionTitle || "Technical Skills",
    sectionSubtitle: initialData?.sectionSubtitle || "",
    categories: initialData?.categories
      ? initialData.categories.map((c) => ({
          ...c,
          items: [...(c.items || [])],
        }))
      : [],
  });

  const [newSkillInput, setNewSkillInput] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryField = (catIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.categories];
      updated[catIndex] = { ...updated[catIndex], [field]: value };
      return { ...prev, categories: updated };
    });
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: "cat-" + Date.now(),
          name: "New Category",
          subtitle: "Category Description",
          icon: "Server",
          items: ["Sample Skill"],
        },
      ],
    }));
  };

  const removeCategory = (catIndex) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== catIndex),
    }));
  };

  // Add individual skill to category
  const handleAddSkill = (catIndex) => {
    const skillName = (newSkillInput[catIndex] || "").trim();
    if (!skillName) return;

    setFormData((prev) => {
      const updated = [...prev.categories];
      if (!updated[catIndex].items.includes(skillName)) {
        updated[catIndex].items = [...updated[catIndex].items, skillName];
      }
      return { ...prev, categories: updated };
    });

    setNewSkillInput((prev) => ({ ...prev, [catIndex]: "" }));
  };

  // Remove individual skill
  const handleRemoveSkill = (catIndex, skillIndex) => {
    setFormData((prev) => {
      const updated = [...prev.categories];
      updated[catIndex].items = updated[catIndex].items.filter((_, i) => i !== skillIndex);
      return { ...prev, categories: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSave("skills", formData);
    setSaveStatus(result?.message || "Skills section updated successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const iconOptions = Object.keys(AVAILABLE_ICONS);

  return (
    <form onSubmit={handleSubmit} className="admin-editor-card">
      <div className="admin-editor-header">
        <div>
          <h2 className="admin-editor-title">Skills & Tech Stack</h2>
          <p className="admin-editor-subtitle">
            Manage your skill categories, add or remove technologies, and select icons.
          </p>
        </div>
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Skills"}
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
              onChange={handleTextChange}
              placeholder="Core Competencies"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              name="sectionTitle"
              value={formData.sectionTitle}
              onChange={handleTextChange}
              placeholder="Technical Skills"
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
            onChange={handleTextChange}
            placeholder="A structured breakdown of languages..."
            className="admin-input"
          />
        </div>
      </div>

      {/* Categories Manager */}
      <div className="admin-field-section">
        <div className="section-title-with-action">
          <h3 className="admin-field-section-title">Skill Categories</h3>
          <button type="button" onClick={addCategory} className="admin-btn-secondary compact">
            <Plus size={15} />
            <span>Add Category</span>
          </button>
        </div>

        <div className="skills-categories-editor">
          {formData.categories.map((cat, catIdx) => (
            <div className="skill-cat-editor-box" key={cat.id || catIdx}>
              <div className="skill-cat-header-row">
                <div className="skill-cat-header-inputs">
                  <div className="admin-form-group flex-1">
                    <label className="admin-label">Category Name</label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => handleCategoryField(catIdx, "name", e.target.value)}
                      placeholder="Backend Architecture"
                      className="admin-input"
                      required
                    />
                  </div>

                  <div className="admin-form-group flex-1">
                    <label className="admin-label">Subtitle</label>
                    <input
                      type="text"
                      value={cat.subtitle}
                      onChange={(e) => handleCategoryField(catIdx, "subtitle", e.target.value)}
                      placeholder="Enterprise APIs & Scalable Logic"
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Icon</label>
                    <select
                      value={cat.icon || "Server"}
                      onChange={(e) => handleCategoryField(catIdx, "icon", e.target.value)}
                      className="admin-select"
                    >
                      {iconOptions.map((iconName) => (
                        <option key={iconName} value={iconName}>
                          {iconName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeCategory(catIdx)}
                  className="admin-item-delete-btn"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Skills Chips in Category */}
              <div className="skill-cat-items-area">
                <label className="admin-label">Skills & Technologies ({cat.items.length})</label>
                <div className="skill-chips-cloud">
                  {cat.items.map((skill, skillIdx) => (
                    <span className="skill-editor-chip" key={skillIdx}>
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(catIdx, skillIdx)}
                        className="skill-chip-delete-btn"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add new skill inline */}
                <div className="add-skill-inline-form">
                  <input
                    type="text"
                    value={newSkillInput[catIdx] || ""}
                    onChange={(e) =>
                      setNewSkillInput((p) => ({ ...p, [catIdx]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(catIdx);
                      }
                    }}
                    placeholder="Type skill name & press Enter (e.g. Docker, GraphQL)"
                    className="admin-input-compact"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(catIdx)}
                    className="admin-btn-secondary compact"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-editor-footer">
        <button type="submit" className="admin-save-btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Skills"}
        </button>
      </div>
    </form>
  );
}

SkillsEditor.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

export default SkillsEditor;

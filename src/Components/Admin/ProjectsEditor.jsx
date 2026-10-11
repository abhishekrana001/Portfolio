import { useState } from "react";
import PropTypes from "prop-types";
import {
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  X,
  Search,
  Globe,
  FolderGit2,
} from "lucide-react";
import { defaultPortfolioData } from "../../data/defaultPortfolioData";
import { PROJECT_IMAGES, resolveProjectImage } from "../../data/assetRegistry.js";

function ProjectsEditor({ initialData, onSave, onUploadFile, isSaving }) {
  const defaultProj = defaultPortfolioData.projects || {};

  const [formData, setFormData] = useState(() => {
    const src = initialData || defaultProj;
    const items =
      src?.items && Array.isArray(src.items) && src.items.length > 0
        ? src.items
        : (defaultProj.items || []);

    return {
      sectionTag: src?.sectionTag || defaultProj.sectionTag || "Featured Work",
      sectionTitle: src?.sectionTitle || defaultProj.sectionTitle || "Projects Portfolio",
      sectionSubtitle: src?.sectionSubtitle || defaultProj.sectionSubtitle || "",
      githubBase: src?.githubBase || defaultProj.githubBase || "https://github.com/abhishekrana001/",
      categories:
        src?.categories && Array.isArray(src.categories) && src.categories.length > 0
          ? src.categories.map((c) => ({ ...c }))
          : (defaultProj.categories || []).map((c) => ({ ...c })),
      items: items.map((p) => {
        if (!p) return {};
        let normTags = [];
        if (Array.isArray(p.tags)) {
          normTags = p.tags.filter(Boolean).map(String);
        } else if (typeof p.tags === "string") {
          normTags = p.tags.split(/[,|]/).map((t) => t.trim()).filter(Boolean);
        }
        return {
          id: p.id || "p-" + Math.random().toString(36).substring(2, 9),
          name: p.name || "",
          category: p.category || "web",
          imageKey: p.imageKey || "",
          imageUrl: p.imageUrl || "",
          alt: p.alt || "",
          desc: p.desc || "",
          tags: normTags,
          repo: p.repo || "",
          demoUrl: p.demoUrl || "",
        };
      }),
    };
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Start adding a new project
  const handleAddNewProject = () => {
    const defaultCat =
      (Array.isArray(formData.categories) &&
        formData.categories.find((c) => c && c.key && c.key !== "all")?.key) ||
      "web";
    const newProj = {
      id: "p-" + Date.now(),
      name: "",
      category: defaultCat,
      imageKey: "airbnb",
      imageUrl: "",
      alt: "",
      desc: "",
      tags: ["React", "JavaScript"],
      repo: "",
      demoUrl: "",
    };
    setProjectForm(newProj);
    setEditingProjectId("new");
    setTagInput("");
  };

  // Start editing existing project
  const handleEditProject = (project) => {
    if (!project) return;
    let normTags = [];
    if (Array.isArray(project.tags)) {
      normTags = project.tags.filter(Boolean).map(String);
    } else if (typeof project.tags === "string") {
      normTags = project.tags.split(/[,|]/).map((t) => t.trim()).filter(Boolean);
    }
    setProjectForm({
      id: project.id || "p-" + Date.now(),
      name: project.name || "",
      category: project.category || "web",
      imageKey: project.imageKey || "",
      imageUrl: project.imageUrl || "",
      alt: project.alt || "",
      desc: project.desc || "",
      tags: normTags,
      repo: project.repo || "",
      demoUrl: project.demoUrl || "",
    });
    setEditingProjectId(project.id);
    setTagInput("");
  };

  // Delete project and immediately auto-save
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const updatedItems = (formData.items || []).filter((p) => p.id !== projectId);
    const updatedFormData = { ...formData, items: updatedItems };
    setFormData(updatedFormData);
    if (editingProjectId === projectId) {
      setEditingProjectId(null);
      setProjectForm(null);
    }
    const res = await onSave("projects", updatedFormData);
    setSaveStatus(res?.message || "Project deleted and saved!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Move project up/down and immediately auto-save
  const moveProject = async (index, direction) => {
    const items = [...(formData.items || [])];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[newIndex];
    items[newIndex] = temp;

    const updatedFormData = { ...formData, items };
    setFormData(updatedFormData);
    await onSave("projects", updatedFormData);
    setSaveStatus("Projects reordered and saved!");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  // Save current project from modal/subform into items array and auto-save
  const handleSaveProjectForm = async (e) => {
    e.preventDefault();
    if (!projectForm || !projectForm.name || !projectForm.name.trim()) {
      alert("Project title is required");
      return;
    }

    const cleanProject = {
      ...projectForm,
      id: projectForm.id || "p-" + Date.now(),
      name: projectForm.name.trim(),
      category: projectForm.category || "web",
      imageKey: projectForm.imageKey || "",
      imageUrl: projectForm.imageUrl || "",
      alt: projectForm.alt || "",
      desc: projectForm.desc || "",
      tags: Array.isArray(projectForm.tags) ? projectForm.tags : [],
      repo: projectForm.repo || "",
      demoUrl: projectForm.demoUrl || "",
    };

    let updatedItems = [...(formData.items || [])];
    if (editingProjectId === "new") {
      updatedItems = [cleanProject, ...updatedItems];
    } else {
      updatedItems = updatedItems.map((p) =>
        p.id === editingProjectId ? cleanProject : p
      );
    }

    const updatedFormData = { ...formData, items: updatedItems };
    setFormData(updatedFormData);
    setEditingProjectId(null);
    setProjectForm(null);

    const res = await onSave("projects", updatedFormData);
    setSaveStatus(res?.message || "Project saved to portfolio!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Handle project image upload
  const handleProjectImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const res = await onUploadFile(file);
    setUploadingImage(false);
    if (res?.url) {
      setProjectForm((prev) => ({
        ...prev,
        imageUrl: res.url,
        imageKey: "",
      }));
    }
  };

  // Add tag to projectForm
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && projectForm && Array.isArray(projectForm.tags) && !projectForm.tags.includes(trimmed)) {
      setProjectForm((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
    }
    setTagInput("");
  };

  // Remove tag from projectForm
  const handleRemoveTag = (tagToRemove) => {
    if (!projectForm) return;
    setProjectForm((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tagToRemove),
    }));
  };

  // Save entire section settings (tag, title, subtitle, githubBase)
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const res = await onSave("projects", formData);
    setSaveStatus(res?.message || "Projects settings saved successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const presetImages = Object.keys(PROJECT_IMAGES);

  // Filter projects by search or category
  const displayedProjects = (formData.items || []).filter((p) => {
    if (!p) return false;
    const query = (searchQuery || "").trim().toLowerCase();
    const nameMatch = typeof p.name === "string" && p.name.toLowerCase().includes(query);
    const descMatch = typeof p.desc === "string" && p.desc.toLowerCase().includes(query);
    const tagsMatch =
      Array.isArray(p.tags) &&
      p.tags.some((t) => typeof t === "string" && t.toLowerCase().includes(query));

    const matchesSearch = !query || nameMatch || descMatch || tagsMatch;

    const cat = (filterCategory || "all").toLowerCase();
    const pCat = (p.category || "").toLowerCase();
    const matchesCategory = cat === "all" || pCat === cat;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-editor-card">
      <div className="admin-editor-header">
        <div>
          <h2 className="admin-editor-title">Projects Portfolio Studio</h2>
          <p className="admin-editor-subtitle">
            Add new projects, edit titles, descriptions, tech tags, upload screenshots, or reorder cards. All changes save live to your portfolio!
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="admin-save-btn"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {saveStatus && (
        <div className="admin-toast-inline success">
          <Check size={18} />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Section Headings & Global Settings */}
      <div className="admin-field-section">
        <h3 className="admin-field-section-title">Section Headings</h3>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Section Tag / Mini Badge</label>
            <input
              type="text"
              name="sectionTag"
              value={formData.sectionTag}
              onChange={handleTextChange}
              placeholder="Featured Work"
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Main Heading</label>
            <input
              type="text"
              name="sectionTitle"
              value={formData.sectionTitle}
              onChange={handleTextChange}
              placeholder="Projects Portfolio"
              className="admin-input"
            />
          </div>
        </div>

        <div className="admin-grid-2 mt-3">
          <div className="admin-form-group">
            <label className="admin-label">Subtitle Description</label>
            <input
              type="text"
              name="sectionSubtitle"
              value={formData.sectionSubtitle}
              onChange={handleTextChange}
              placeholder="A showcase of full stack web applications..."
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">GitHub Account Base URL</label>
            <input
              type="text"
              name="githubBase"
              value={formData.githubBase}
              onChange={handleTextChange}
              placeholder="https://github.com/abhishekrana001/"
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {/* Projects List & Manager */}
      <div className="admin-field-section">
        <div className="section-title-with-action">
          <div>
            <h3 className="admin-field-section-title">
              Project Cards ({formData.items.length} Total)
            </h3>
            <p className="admin-helper-text">
              Click &quot;Edit&quot; on any card to update its details, or use &quot;Add New Project&quot;.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNewProject}
            className="admin-save-btn"
          >
            <Plus size={16} />
            <span>Add New Project</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="admin-grid-2 mt-3 mb-3">
          <div className="admin-form-group">
            <div className="admin-pin-input-wrapper">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, tag or tech..."
                className="admin-input"
                style={{ paddingLeft: "38px" }}
              />
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "#64748b",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="admin-select"
            >
              <option value="all">Show All Categories</option>
              {Array.isArray(formData.categories) &&
                formData.categories
                  .filter((c) => c && c.key && c.key !== "all")
                  .map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      Filter: {cat.label || cat.key}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* Project Cards List */}
        <div className="admin-projects-grid">
          {displayedProjects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
              <FolderGit2 size={36} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p>No projects match your search or filter.</p>
            </div>
          ) : (
            displayedProjects.map((proj) => {
              const originalIndex = formData.items.findIndex(
                (item) => item.id === proj.id
              );
              const previewImg = resolveProjectImage(proj);

              return (
                <div className="admin-project-item-card" key={proj.id || proj.name}>
                  <div className="project-item-thumb-wrapper">
                    <img
                      src={previewImg}
                      alt={proj.name || "Preview"}
                      className="project-item-thumb"
                    />
                    <span className="project-item-category-pill">
                      {proj.category || "web"}
                    </span>
                  </div>

                  <div className="project-item-info">
                    <h4 className="project-item-title">{proj.name || "Untitled"}</h4>
                    <p className="project-item-desc">{proj.desc}</p>
                    <div className="project-item-tags">
                      {Array.isArray(proj.tags) &&
                        proj.tags.map((t, idx) => (
                          <span className="project-item-tag-pill" key={`${t}-${idx}`}>
                            {String(t)}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="project-item-actions">
                    <button
                      type="button"
                      onClick={() => handleEditProject(proj)}
                      className="admin-btn-action edit"
                      title="Edit Project"
                    >
                      <Edit2 size={15} />
                      <span>Edit</span>
                    </button>

                    <div className="project-reorder-buttons">
                      <button
                        type="button"
                        onClick={() => moveProject(originalIndex, "up")}
                        disabled={originalIndex === 0}
                        className="admin-btn-icon-sm"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(originalIndex, "down")}
                        disabled={originalIndex === formData.items.length - 1}
                        className="admin-btn-icon-sm"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="admin-btn-action delete"
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal / Overlay for Adding or Editing Project */}
      {projectForm && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingProjectId === "new"
                  ? "Add New Project"
                  : `Edit "${projectForm.name || "Project"}"`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setProjectForm(null);
                  setEditingProjectId(null);
                }}
                className="admin-modal-close"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProjectForm} className="admin-modal-form">
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Project Title *</label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Airbnb Clone, AI SaaS Dashboard"
                    className="admin-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className="admin-select"
                  >
                    <option value="web">Web & Full Stack</option>
                    <option value="android">Android Apps</option>
                    <option value="tools">Games & Utilities</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group mt-2">
                <label className="admin-label">Project Description</label>
                <textarea
                  value={projectForm.desc}
                  onChange={(e) =>
                    setProjectForm((p) => ({ ...p, desc: e.target.value }))
                  }
                  rows={3}
                  placeholder="Comprehensive description of features, database and architecture..."
                  className="admin-textarea"
                />
              </div>

              {/* Project Image Selection / Upload */}
              <div className="admin-form-group mt-2">
                <label className="admin-label">Project Screenshot / Image</label>
                <div className="project-image-selector-row">
                  <div className="project-image-preview-thumb">
                    <img
                      src={resolveProjectImage(projectForm)}
                      alt="Thumbnail Preview"
                      className="thumb-img"
                    />
                  </div>
                  <div className="project-image-inputs flex-1">
                    <div className="admin-grid-2">
                      <div>
                        <label className="admin-label-sm">Pick Preset Project Image</label>
                        <select
                          value={projectForm.imageKey || ""}
                          onChange={(e) =>
                            setProjectForm((p) => ({
                              ...p,
                              imageKey: e.target.value,
                              imageUrl: "",
                            }))
                          }
                          className="admin-select-sm"
                        >
                          <option value="">-- Custom Upload/URL --</option>
                          {presetImages.map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="admin-label-sm">Upload Screenshot</label>
                        <label className="admin-upload-btn-compact">
                          <Upload size={14} />
                          <span>{uploadingImage ? "Uploading..." : "Browse File..."}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProjectImageUpload}
                            style={{ display: "none" }}
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="admin-label-sm">Or Direct Image URL</label>
                      <input
                        type="text"
                        value={projectForm.imageUrl || ""}
                        onChange={(e) =>
                          setProjectForm((p) => ({
                            ...p,
                            imageUrl: e.target.value,
                            imageKey: "",
                          }))
                        }
                        placeholder="https://... (or uploaded image path)"
                        className="admin-input-compact"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="admin-form-group mt-2">
                <label className="admin-label">Technology Tags</label>
                <div className="skill-chips-cloud">
                  {Array.isArray(projectForm.tags) &&
                    projectForm.tags.map((t, idx) => (
                      <span className="skill-editor-chip" key={`${t}-${idx}`}>
                        <span>{String(t)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="skill-chip-delete-btn"
                          aria-label={`Remove tag ${t}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                </div>
                <div className="add-skill-inline-form mt-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type tech name (e.g. Next.js, Redux, MySQL) & press Enter"
                    className="admin-input-compact"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="admin-btn-secondary compact"
                  >
                    <Plus size={14} />
                    <span>Add Tag</span>
                  </button>
                </div>
              </div>

              {/* Repos and Links */}
              <div className="admin-grid-2 mt-2">
                <div className="admin-form-group">
                  <label className="admin-label">GitHub Repository Slug / URL</label>
                  <input
                    type="text"
                    value={projectForm.repo}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, repo: e.target.value }))
                    }
                    placeholder="Repo name (e.g. Airbnb or full GitHub URL)"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    value={projectForm.demoUrl || ""}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, demoUrl: e.target.value }))
                    }
                    placeholder="https://my-project-demo.com"
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setProjectForm(null);
                    setEditingProjectId(null);
                  }}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn">
                  {editingProjectId === "new" ? "Add to Portfolio" : "Update Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-editor-footer">
        <button
          type="button"
          onClick={handleSubmit}
          className="admin-save-btn"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}

ProjectsEditor.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onUploadFile: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

export default ProjectsEditor;

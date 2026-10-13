import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String }, // e.g. 'p1', 'p2'
    name: { type: String, required: true },
    title: { type: String }, // Alias for name
    category: { type: String, default: 'web' },
    desc: { type: String },
    description: { type: String }, // Alias for desc
    tags: [String],
    techStack: [String], // Alias for tags
    imageKey: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    alt: { type: String, default: '' },
    repo: { type: String, default: '' },
    githubLink: { type: String, default: '' },
    demoUrl: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to keep aliases synchronized
projectSchema.pre('save', function (next) {
  if (this.name && !this.title) this.title = this.name;
  if (this.title && !this.name) this.name = this.title;

  if (this.desc && !this.description) this.description = this.desc;
  if (this.description && !this.desc) this.desc = this.description;

  if (this.repo && !this.githubLink) this.githubLink = this.repo;
  if (this.githubLink && !this.repo) this.repo = this.githubLink;

  if (this.demoUrl && !this.liveLink) this.liveLink = this.demoUrl;
  if (this.liveLink && !this.demoUrl) this.demoUrl = this.liveLink;

  if (this.tags?.length && !this.techStack?.length) this.techStack = this.tags;
  if (this.techStack?.length && !this.tags?.length) this.tags = this.techStack;

  next();
});

export default mongoose.model('Project', projectSchema);
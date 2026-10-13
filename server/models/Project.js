import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Web, Android, Games
  techStack: [String],
  imageUrl: { type: String },   // /uploads/xyz.png
  liveLink: { type: String },
  githubLink: { type: String },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
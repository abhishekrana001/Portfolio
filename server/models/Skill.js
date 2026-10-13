import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // Frontend Development, Backend & APIs, etc.
    level: { type: Number, default: 85 }, // 0-100
    icon: { type: String, default: 'Server' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Skill', skillSchema);
import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // Frontend, Backend, DB, Mobile
    level: { type: Number, default: 80 },   // 0-100
    icon: { type: String },
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      default: 'main',
      unique: true,
      index: true,
    },
    home: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    about: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    skills: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    projects: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    contact: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    footer: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    security: {
      adminPin: { type: String, default: '1234' },
    },
  },
  {
    timestamps: true,
    minimize: false, // Preserves empty objects
  }
);

export default mongoose.model('Portfolio', portfolioSchema);

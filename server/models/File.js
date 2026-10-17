import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('File', fileSchema);

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
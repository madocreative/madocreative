import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
    page: { type: String, required: true, unique: true }, // e.g., 'home', 'services'
    title: { type: String, required: true },
    subtitle: { type: String },
    heroImage: { type: String },
    sections: { type: mongoose.Schema.Types.Mixed }, // Flexible JSON for varied page structures
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);

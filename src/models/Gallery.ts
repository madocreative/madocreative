import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String }, // e.g., 'Editorial', 'Campaign'
    featuredImage: { type: String, required: true },
    images: [{ type: String }], // Array of Cloudinary URLs
    layout: { type: String, enum: ['grid', 'masonry'], default: 'masonry' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

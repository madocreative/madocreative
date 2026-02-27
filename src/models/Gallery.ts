import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String },
    description: { type: String, default: '' },
    featuredImage: { type: String, required: true },
    images: [{ type: String }],
    layout: {
        type: String,
        enum: ['masonry', 'grid', 'slideshow', 'editorial', 'strip', 'spotlight'],
        default: 'masonry',
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

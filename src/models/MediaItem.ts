import mongoose from 'mongoose';

const MediaItemSchema = new mongoose.Schema({
    url:       { type: String, required: true, unique: true },
    publicId:  { type: String },
    filename:  { type: String },
    width:     { type: Number },
    height:    { type: Number },
    format:    { type: String },
    bytes:     { type: Number },
    folder:    { type: String, default: 'mado-creatives' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MediaItem || mongoose.model('MediaItem', MediaItemSchema);

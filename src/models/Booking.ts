import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    date: { type: String, required: true },
    package: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    projectDetails: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

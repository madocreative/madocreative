import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
    // Only one document — key: 'global'
    key: { type: String, required: true, unique: true, default: 'global' },

    // Identity
    siteName: { type: String, default: 'Mado Creatives' },
    tagline: { type: String, default: 'An independent creative studio based in Paris, serving luxury brands worldwide with premium imagery and creative direction.' },

    // Contact
    email: { type: String, default: 'hello@madocreatives.com' },
    phone: { type: String, default: '+33 (0) 1 23 45 67 89' },
    address: { type: String, default: '12 Rue de l\'Avenir, Paris' },
    locationLabel: { type: String, default: 'Paris HQ • Worldwide Travel' },

    // Social links
    instagramUrl: { type: String, default: '#' },
    twitterUrl: { type: String, default: '#' },
    youtubeUrl: { type: String, default: '#' },
    facebookUrl: { type: String, default: '#' },
    telegramUrl: { type: String, default: '#' },
    whatsappUrl: { type: String, default: '#' },

    // Appearance
    accentColor: { type: String, default: '#ffc000' },
    bookingCta: { type: String, default: 'Book a Session' },
    acceptingClients: { type: Boolean, default: true },

    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

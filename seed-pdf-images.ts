import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const contentSchema = new mongoose.Schema({
    page: String,
    title: String,
    subtitle: String,
    heroImage: String
});

const productSchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    price: Number,
    inStock: Boolean,
    images: [String],
    featured: Boolean,
    category: String,
});

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        // Update Home Pages
        await Content.findOneAndUpdate(
            { page: 'home' },
            {
                title: 'MADO CREATIVES.',
                subtitle: 'Creative Agency & Premium Electronics Store blending storytelling and innovation.<br/>Addis Ababa | Kigali | Nairobi | Dubai',
                heroImage: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg'
            },
            { upsert: true }
        );

        // Populate Products from the Shop PDF
        const products = [
            {
                name: "Premium Creator Camera",
                slug: "premium-creator-camera",
                category: "Cameras",
                price: 2499.00,
                description: "<p>Professional Camera. Work smarter. Create faster. <strong>Authentic & Verified Products</strong></p>",
                inStock: true,
                featured: true,
                images: ["https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971899/mado-creatives/elx1jzuiydmyntvisbwm.jpg"]
            },
            {
                name: "Professional Editing Laptop",
                slug: "professional-editing-laptop",
                category: "Laptops",
                price: 1899.00,
                description: "<p>Professional Editing Laptops. High performance business and student-friendly options. <strong>Fast Delivery</strong></p>",
                inStock: true,
                featured: true,
                images: ["https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971900/mado-creatives/mbjmpnxnjrmfre3ctxan.jpg"]
            },
            {
                name: "Latest Smartphone Pro Max",
                slug: "latest-smartphone-pro-max",
                category: "Smartphones",
                price: 1199.00,
                description: "<p>Latest models. Powerful performance. Premium design backed by Warranty Support.</p>",
                inStock: true,
                featured: true,
                images: ["https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971901/mado-creatives/nm1vvf8uukzdsq6ubiyq.jpg"]
            },
            {
                name: "Studio Headphones",
                slug: "studio-headphones",
                category: "Audio",
                price: 299.00,
                description: "<p>High fidelity audio devices and smart gadgets for content creators.</p>",
                inStock: true,
                featured: false,
                images: ["https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971902/mado-creatives/gwd4ikdny7f7ve03wxnl.jpg"]
            }
        ];

        for (const p of products) {
            await Product.findOneAndUpdate({ name: p.name }, p, { upsert: true });
        }

        console.log("Database successfully seeded with Cloudinary Images!");
        process.exit(0);
    } catch (e) {
        console.error("Error seeding", e);
        process.exit(1);
    }
}

seed();

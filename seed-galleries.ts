import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import Gallery from './src/models/Gallery';

dotenv.config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function seedGalleries() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");

        // Fetch up to 50 recent images uploaded to the "mado-creatives" folder directly bypassing the AdminUI manual step
        const result = await cloudinary.search
            .expression('folder:mado-creatives')
            .sort_by('created_at', 'desc')
            .max_results(30)
            .execute();

        const resources: any[] = result.resources || [];
        if (resources.length === 0) {
            console.log("No images found in Cloudinary folder 'mado-creatives'. Please upload first.");
            process.exit(0);
        }

        const imageUrls = resources.map(r => r.secure_url).filter(url => !url.includes('.pdf'));
        console.log(`Found ${imageUrls.length} image(s) in Cloudinary.`);

        // Ensure we have enough to group
        const chunks = [];
        const chunkSize = Math.max(1, Math.floor(imageUrls.length / 3));

        for (let i = 0; i < imageUrls.length; i += chunkSize) {
            chunks.push(imageUrls.slice(i, i + chunkSize));
        }

        const galleryDefs = [
            { title: "Editorial Portraits", category: "Editorial", slug: "editorial-portraits" },
            { title: "Lifestyle Campaigns", category: "Commercial", slug: "lifestyle-campaigns" },
            { title: "Cinematic Weddings", category: "Weddings", slug: "cinematic-weddings" },
            { title: "Brand Identity", category: "Branding", slug: "brand-identity" }
        ];

        let i = 0;
        for (const chunk of chunks) {
            if (chunk.length === 0 || i >= galleryDefs.length) break;

            const def = galleryDefs[i];
            const featuredImage = chunk[0];
            const remainingImages = chunk.slice(1);

            const updatedGallery = await Gallery.findOneAndUpdate(
                { slug: def.slug },
                {
                    title: def.title,
                    slug: def.slug,
                    category: def.category,
                    featuredImage: featuredImage,
                    images: remainingImages,
                    layout: 'masonry'
                },
                { upsert: true, new: true }
            );

            console.log(`[SEEDED] Gallery "${def.title}": 1 featured, ${remainingImages.length} images.`);
            i++;
        }

        console.log("Galleries seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding galleries:", error);
        process.exit(1);
    }
}

seedGalleries();

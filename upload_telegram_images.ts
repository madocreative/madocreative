import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImages() {
    const dir = 'C:\\Users\\HP\\Pictures\\madocreative\\mado-creatives-nextjs\\Telegram Desktop';
    // Pick the first 12 images to cover Team (6), Services (3), Home (1), Portfolio (2)
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).slice(0, 15);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
            const res = await cloudinary.uploader.upload(fullPath, { folder: 'mado-creatives' });
            console.log(`[UPLOADED] ${file} -> ${res.secure_url}`);
        } catch (e) {
            console.error(`Error uploading ${file}:`, e);
        }
    }
}

uploadImages().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

import Content from '@/models/Content';
import dbConnect from '@/lib/mongodb';

export type ServicePackage = {
  name: string;
  description: string;
  price: string;
  image?: string;
};

export const defaultServicePackages: ServicePackage[] = [
  {
    name: 'iPhone Monthly Shoot Package',
    description: 'One shoot every week with ideas, content strategy, professional editing, and consistent delivery for impact.',
    price: 'USD 500 / month',
    image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1784282227/pricing/iphone-monthly-shoot.png',
  },
  {
    name: 'Camera Monthly Shoot Package',
    description: 'One shoot every week with creative planning, professional post-production, and high-end camera equipment included.',
    price: 'USD 800 / month',
    image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1784282231/pricing/camera-monthly-shoot.png',
  },
  {
    name: 'Complete Production & Digital Marketing Package',
    description: 'Full production plus full digital marketing for businesses that want content creation and online growth handled together.',
    price: 'USD 1500 / month',
    image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1784282235/pricing/complete-production-digital-marketing.png',
  },
];

const cloudinaryPackageImages = {
  iphone: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1784282227/pricing/iphone-monthly-shoot.png',
  camera: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1784282231/pricing/camera-monthly-shoot.png',
  complete: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1784282235/pricing/complete-production-digital-marketing.png',
};

function packageImageFor(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes('iphone')) return cloudinaryPackageImages.iphone;
  if (normalized.includes('camera')) return cloudinaryPackageImages.camera;
  if (normalized.includes('complete') || normalized.includes('digital marketing')) {
    return cloudinaryPackageImages.complete;
  }
  return '';
}

function normalizePackageImage(image: string, name: string) {
  if (!image) return packageImageFor(name);
  if (image.includes('/pricing/iphone-monthly-shoot.png')) return cloudinaryPackageImages.iphone;
  if (image.includes('/pricing/camera-monthly-shoot.png')) return cloudinaryPackageImages.camera;
  if (image.includes('/pricing/complete-production-digital-marketing.png')) return cloudinaryPackageImages.complete;
  return image;
}

export async function getServicePackages(): Promise<ServicePackage[]> {
  try {
    await dbConnect();
    const content = await Content.findOne({ page: 'services' });
    const parsed = content ? JSON.parse(JSON.stringify(content)) : null;
    const packages = parsed?.sections?.packages;

    if (!Array.isArray(packages) || packages.length === 0) return defaultServicePackages;

    return packages
      .filter((item): item is Partial<ServicePackage> => item && typeof item === 'object')
      .map((item) => ({
        name: String(item.name || '').trim(),
        description: String(item.description || '').trim(),
        price: String(item.price || '').trim(),
        image: normalizePackageImage(String(item.image || '').trim(), String(item.name || '')),
      }))
      .filter((item) => item.name && item.price);
  } catch {
    return defaultServicePackages;
  }
}

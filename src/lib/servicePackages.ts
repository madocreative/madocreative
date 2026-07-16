import Content from '@/models/Content';
import dbConnect from '@/lib/mongodb';

export type ServicePackage = {
  name: string;
  description: string;
  price: string;
};

export const defaultServicePackages: ServicePackage[] = [
  {
    name: 'iPhone Monthly Shoot Package',
    description: 'One shoot every week with ideas, content strategy, professional editing, and consistent delivery for impact.',
    price: 'USD 500 / month',
  },
  {
    name: 'Camera Monthly Shoot Package',
    description: 'One shoot every week with creative planning, professional post-production, and high-end camera equipment included.',
    price: 'USD 800 / month',
  },
  {
    name: 'Complete Production & Digital Marketing Package',
    description: 'Full production plus full digital marketing for businesses that want content creation and online growth handled together.',
    price: 'USD 1500 / month',
  },
];

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
      }))
      .filter((item) => item.name && item.price);
  } catch {
    return defaultServicePackages;
  }
}

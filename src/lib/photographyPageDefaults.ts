export type PhotographyServiceItem = {
  title: string;
  description: string;
  tags: string;
  image: string;
};

export type PhotographyStat = {
  value: string;
  label: string;
};

export type PhotographyCollection = {
  title: string;
  href: string;
  description: string;
};

export type PhotographyProcessStep = {
  step: string;
  title: string;
  desc: string;
};

export type PhotographyPageData = {
  title: string;
  heroLabel: string;
  subtitle: string;
  heroImages: string[];
  stats: PhotographyStat[];
  services: PhotographyServiceItem[];
  collectionsLabel: string;
  collectionsTitle: string;
  collections: PhotographyCollection[];
  processLabel: string;
  processTitle: string;
  process: PhotographyProcessStep[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaLink: string;
  ctaSecondaryButton: string;
  ctaSecondaryLink: string;
};

export const photographyPageDefaults: PhotographyPageData = {
  title: 'Photography',
  heroLabel: 'Luxury Imagery',
  subtitle:
    'We create photography that feels composed, premium, and emotionally true. From intimate portraits to large-scale campaigns, every gallery is designed to look timeless across print, web, and social.',
  heroImages: [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/luhwozrxtp1u5oehdyej.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971901/mado-creatives/nm1vvf8uukzdsq6ubiyq.jpg',
  ],
  stats: [
    { value: '700+', label: 'Sessions Captured' },
    { value: '15+', label: 'Years Experience' },
    { value: '48h', label: 'Preview Delivery' },
    { value: '4', label: 'Countries Served' },
  ],
  services: [
    {
      title: 'Wedding Photography',
      description:
        'Elegant wedding coverage with a calm editorial eye. We capture the atmosphere, emotion, details, and portraits that turn your day into a timeless collection.',
      tags: 'Weddings, Editorial, Storytelling',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    },
    {
      title: 'Portrait Sessions',
      description:
        'Refined portrait sessions for individuals, couples, creatives, and personal brands. We shape every frame with lighting, direction, and styling that feels polished and confident.',
      tags: 'Portraits, Studio, Branding',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
    },
    {
      title: 'Commercial Campaigns',
      description:
        'Photography for products, campaigns, hospitality, and brand launches. Built to look premium across websites, social media, print, and advertising placements.',
      tags: 'Commercial, Products, Campaigns',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/luhwozrxtp1u5oehdyej.jpg',
    },
    {
      title: 'Events and Corporate Coverage',
      description:
        'Discreet, polished coverage for conferences, galas, launches, and private events. We document the important moments while keeping the visual language aligned with your brand.',
      tags: 'Events, Corporate, Coverage',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
    },
    {
      title: 'Creative Editorials',
      description:
        'Concept-driven imagery for fashion, campaigns, and storytelling projects. From mood to final retouching, every visual is shaped to feel distinctive and intentional.',
      tags: 'Editorial, Fashion, Creative Direction',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971901/mado-creatives/nm1vvf8uukzdsq6ubiyq.jpg',
    },
  ],
  collectionsLabel: 'Portfolio',
  collectionsTitle: 'Featured Collections',
  collections: [
    {
      title: 'Weddings',
      href: '/portfolio?category=Weddings#portfolio-collections',
      description: 'Love stories, ceremony details, portraits, and celebrations.',
    },
    {
      title: 'Portraits',
      href: '/portfolio?category=Portraits#portfolio-collections',
      description: 'Studio portraits, couples, and personal brand sessions.',
    },
    {
      title: 'Commercial',
      href: '/portfolio?category=Commercial#portfolio-collections',
      description: 'Products, campaigns, hospitality, and branded content.',
    },
    {
      title: 'Events',
      href: '/portfolio?category=Events#portfolio-collections',
      description: 'Corporate gatherings, launches, and private experiences.',
    },
  ],
  processLabel: 'Process',
  processTitle: 'How We Work',
  process: [
    {
      step: '01',
      title: 'Creative Direction',
      desc: 'We align on mood, wardrobe, location, schedule, and what the final imagery needs to achieve.',
    },
    {
      step: '02',
      title: 'Shoot Day',
      desc: 'We guide posing, light, composition, and pacing so the session feels smooth and elevated from start to finish.',
    },
    {
      step: '03',
      title: 'Selection and Retouching',
      desc: 'Your final images are curated and refined with careful color work, skin cleanup, and detail-led finishing.',
    },
    {
      step: '04',
      title: 'Delivery',
      desc: 'You receive polished images ready for print, web, campaigns, and social distribution.',
    },
  ],
  ctaTitle: 'Ready to Plan Your Shoot?',
  ctaSubtitle:
    'Book a portrait session, wedding coverage, editorial concept, or commercial shoot with Mado Creatives.',
  ctaButton: 'Book Photography',
  ctaLink: '/booking',
  ctaSecondaryButton: 'View Portfolio',
  ctaSecondaryLink: '/portfolio',
};

import type { CreativeServicePageData } from '@/lib/creativeServicePage';

export const videographyPageDefaults: CreativeServicePageData = {
  title: 'Videography',
  heroLabel: 'Cinematic Production',
  subtitle:
    "We don't just record moments - we craft cinematic stories. From concept to color grade, every frame is intentional, every cut purposeful, every film a lasting legacy.",
  heroImages: [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
  ],
  stats: [
    { value: '500+', label: 'Productions' },
    { value: '15+', label: 'Years Experience' },
    { value: '4K', label: 'Resolution Standard' },
    { value: '4', label: 'Countries' },
  ],
  services: [
    {
      title: 'Cinematic Wedding Films',
      description:
        'Timeless wedding films crafted with narrative depth and cinematic artistry. From intimate ceremonies to grand celebrations, we capture every emotion and transform it into a film you will cherish forever.',
      tags: 'Wedding, Ceremony, Storytelling',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    },
    {
      title: 'Commercial & Brand Films',
      description:
        'Compelling brand stories and commercial productions designed to elevate your business across digital, broadcast, and social platforms.',
      tags: 'Commercial, Brand, Digital',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
    },
    {
      title: 'Social Media Content',
      description:
        'Short-form cinematic content crafted for Reels, TikTok, YouTube Shorts, and beyond to build your audience and increase engagement.',
      tags: 'Reels, TikTok, Content',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    },
    {
      title: 'Music Videos & Creative Films',
      description:
        'Visually bold, concept-driven music videos and creative films for artists, labels, and ambitious brands.',
      tags: 'Music Video, Creative, Production',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
    },
    {
      title: 'Corporate & Event Coverage',
      description:
        'Professional video coverage for conferences, launches, galas, and private gatherings delivered with polished editorial quality.',
      tags: 'Corporate, Events, Coverage',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
    },
    {
      title: 'Color Grading & Post-Production',
      description:
        'Advanced color grading, sound design, motion graphics, and post-production services for a cinematic final product.',
      tags: 'Color Grading, Post-Production, Motion Graphics',
      image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
    },
  ],
  showcaseLabel: 'Selected Films',
  showcaseTitle: 'Recent Work on Film',
  showcaseSubtitle:
    'A closer look at the stories, events, and campaigns we have shaped through motion. Upload your own showcase videos anytime from the videography page editor.',
  showcaseVideos: [
    {
      title: 'Featured Wedding Highlight',
      description:
        'A sample cinematic highlight from a recent celebration, focused on atmosphere, pacing, and emotional storytelling.',
      videoUrl: '/videos/video_2026-03-17_16-54-10.mp4',
      posterImage: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    },
  ],
  videoGalleryLabel: 'Video Gallery',
  videoGalleryTitle: 'Past Work in Motion',
  videoGallerySubtitle:
    'Build a flexible gallery of past video projects and switch between grid, masonry, or film-strip layouts anytime from the videography editor.',
  videoGalleryLayout: 'masonry',
  videoGalleryVideos: [],
  collectionsLabel: 'Portfolio',
  collectionsTitle: 'Featured Work',
  collections: [],
  processLabel: 'Process',
  processTitle: 'How We Work',
  process: [],
  ctaTitle: "Let's Create Your Film",
  ctaSubtitle:
    "Whether it's a wedding, a brand campaign, or a creative vision - we bring it to life with cinematic excellence.",
  ctaButton: 'Start Your Project',
  ctaLink: '/booking',
  ctaSecondaryButton: '',
  ctaSecondaryLink: '',
};

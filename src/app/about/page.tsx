import AboutClient from './AboutClient';

export const metadata = {
  title: 'About | Mado Creatives',
  description: 'Learn about Mado Creatives — our story, mission, and the values that drive our creative work.',
};

const defaultData = {
  title: 'We Craft Visual Stories That Last',
  subtitle: 'A luxury creative studio dedicated to capturing the moments that define you.',
  storyTitle: 'Born from a passion for authentic storytelling',
  storyParagraph1:
    'Mado Creatives was founded on a simple belief — that every brand, every couple, every moment deserves imagery that is as unique and powerful as the story behind it. We are a team of visual artists who live at the intersection of art and commerce.',
  storyParagraph2:
    'From intimate editorial portraits to large-scale commercial campaigns, we bring the same level of intention, craft, and emotional intelligence to every project. Our clients span industries and continents, united by a shared desire for imagery that resonates.',
  stats: [
    { value: '15+', label: 'Years Experience' },
    { value: '500+', label: 'Projects Delivered' },
    { value: '4', label: 'Studio Locations' },
    { value: '98%', label: 'Client Satisfaction' },
  ],
  values: [
    {
      title: 'Authenticity',
      description:
        'We tell real stories with honesty and intention. Every frame is a deliberate choice that reflects the truth of the moment.',
    },
    {
      title: 'Craftsmanship',
      description:
        'Technical excellence is the foundation of our work. We obsess over light, composition, and post-production to deliver imagery that endures.',
    },
    {
      title: 'Collaboration',
      description:
        'Our best work emerges from deep creative partnerships. We listen, explore, and co-create with our clients to bring visions to life.',
    },
    {
      title: 'Discretion',
      description:
        'We understand the value of privacy. Our clients trust us with their most important moments, and that trust is sacred.',
    },
    {
      title: 'Innovation',
      description:
        'We stay at the forefront of visual language — embracing new techniques and ideas while staying grounded in timeless principles.',
    },
    {
      title: 'Excellence',
      description:
        'We hold ourselves to the highest standard in every detail, from the first consultation to the final delivery.',
    },
  ],
  heroImage:
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
  ctaTitle: 'Ready to create something extraordinary?',
  ctaSubtitle:
    'Whether you have a clear vision or just a feeling, we would love to hear about your project and explore how we can bring it to life.',
};

export default function AboutPage() {
  return <AboutClient data={defaultData} />;
}

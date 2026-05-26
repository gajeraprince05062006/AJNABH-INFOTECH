const mongoose = require('mongoose');
require('dotenv').config();
const Service = require('../models/Service');

const servicesData = [
  {
    title: 'Web Development',
    description: 'We build modern, scalable, and responsive websites with attractive UI, optimized performance, and complete backend integration.',
    features: ['Responsive Design', 'SEO Optimized', 'Admin Dashboard', 'API Integration', 'Fast Performance', 'Security'],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Next.js'],
    process: ['Requirement Analysis', 'UI/UX Design', 'Development', 'Testing', 'Deployment', 'Maintenance'],
    isActive: true,
    displayOrder: 1
  },
  {
    title: 'AI & Machine Learning Solutions',
    description: 'Develop intelligent AI solutions including automation systems, object detection, predictive models, and custom AI applications.',
    features: ['Predictive Analytics', 'Automation', 'Data Processing', 'AI Models', 'Computer Vision', 'Chatbots'],
    tech: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'Flask', 'FastAPI'],
    process: ['Data Collection', 'Model Training', 'Testing', 'Deployment', 'Optimization', 'Monitoring'],
    isActive: true,
    displayOrder: 2
  },
  {
    title: 'Mobile App Development',
    description: 'Build high-performance Android and iOS applications with modern UI and scalable architecture.',
    features: ['Cross Platform Apps', 'Responsive UI', 'API Integration', 'Push Notifications', 'Authentication'],
    tech: ['Flutter', 'React Native', 'Firebase', 'Node.js', 'MongoDB'],
    process: ['Planning', 'UI Design', 'Development', 'Testing', 'Launch', 'Support'],
    isActive: true,
    displayOrder: 3
  },
  {
    title: 'E-Commerce Development',
    description: 'Create complete e-commerce platforms with secure payments and advanced management systems.',
    features: ['Product Management', 'Payment Gateway', 'Cart System', 'Order Tracking', 'Admin Panel'],
    tech: ['MERN Stack', 'Stripe', 'MongoDB', 'Express.js', 'React.js'],
    process: ['Planning', 'UI Design', 'Development', 'Payment Integration', 'Testing', 'Deployment'],
    isActive: true,
    displayOrder: 4
  },
  {
    title: 'UI/UX Design',
    description: 'Design attractive and user-friendly interfaces that improve customer experience and engagement.',
    features: ['Wireframing', 'Prototyping', 'Responsive Design', 'User Research', 'Modern Interface'],
    tech: ['Figma', 'Adobe XD', 'Canva'],
    process: ['Research', 'Wireframe', 'Prototype', 'Design', 'Review', 'Finalization'],
    isActive: true,
    displayOrder: 5
  },
  {
    title: 'Digital Marketing Services',
    description: 'Grow businesses through SEO, social media campaigns, paid ads, and digital marketing strategies.',
    features: ['SEO Optimization', 'Social Media Marketing', 'Google Ads', 'Meta Ads', 'Lead Generation', 'Analytics'],
    tech: ['Google Analytics', 'Meta Business Suite', 'SEMrush', 'Ahrefs', 'Canva'],
    process: ['Research', 'Strategy Planning', 'Campaign Setup', 'Optimization', 'Reporting'],
    isActive: true,
    displayOrder: 6
  },
  {
    title: 'Logo Design & Branding',
    description: 'Create modern logos and complete brand identities for businesses and startups.',
    features: ['Custom Logo Design', 'Brand Identity', 'Business Branding', 'Social Media Kit', 'Rebranding'],
    tech: ['Adobe Illustrator', 'Photoshop', 'Canva', 'Figma'],
    process: ['Requirement Gathering', 'Concept Design', 'Revisions', 'Finalization', 'Delivery'],
    isActive: true,
    displayOrder: 7
  },
  {
    title: 'Graphic Design Services',
    description: 'Design creative marketing materials and branding assets for business promotion.',
    features: ['Poster Design', 'Banner Design', 'Business Cards', 'Brochures', 'Social Media Creatives'],
    tech: ['Canva', 'Photoshop', 'Illustrator', 'Figma'],
    process: ['Requirement Collection', 'Design Creation', 'Revisions', 'Final Delivery'],
    isActive: true,
    displayOrder: 8
  },
  {
    title: 'Social Media Management',
    description: 'Manage social media accounts with engaging content and branding strategies.',
    features: ['Post Design', 'Content Planning', 'Reels Creation', 'Campaign Management', 'Engagement Growth'],
    tech: ['Canva', 'Meta Business Suite', 'Buffer', 'Hootsuite'],
    process: ['Planning', 'Content Creation', 'Scheduling', 'Publishing', 'Monitoring'],
    isActive: true,
    displayOrder: 9
  },
  {
    title: 'Video Editing & Motion Graphics',
    description: 'Create promotional videos, animated logos, and engaging visual content.',
    features: ['Promotional Videos', 'Reels Editing', 'Logo Animation', 'Motion Graphics', 'Corporate Videos'],
    tech: ['Premiere Pro', 'After Effects', 'CapCut', 'Canva'],
    process: ['Planning', 'Editing', 'Animation', 'Review', 'Export'],
    isActive: true,
    displayOrder: 10
  },
  {
    title: 'Cloud & DevOps Services',
    description: 'Provide scalable cloud infrastructure and automated deployment solutions.',
    features: ['CI/CD', 'Cloud Hosting', 'Deployment Automation', 'Monitoring', 'Server Management'],
    tech: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Nginx'],
    process: ['Setup', 'Configuration', 'Deployment', 'Monitoring', 'Optimization'],
    isActive: true,
    displayOrder: 11
  },
  {
    title: 'Custom Software Development',
    description: 'Develop custom software solutions according to business requirements and workflows.',
    features: ['ERP Systems', 'CRM Solutions', 'Dashboard', 'Automation', 'Database Management'],
    tech: ['Python', 'MERN Stack', 'Flask', 'FastAPI', 'MySQL'],
    process: ['Requirement Gathering', 'Planning', 'Development', 'Testing', 'Deployment'],
    isActive: true,
    displayOrder: 12
  }
];

const seedServices = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment!');
    }
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services.');

    // Insert new services
    const result = await Service.insertMany(servicesData);
    console.log(`✅ Successfully seeded ${result.length} services.`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
};

seedServices();

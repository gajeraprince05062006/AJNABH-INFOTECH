require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Service = require('./models/Service');
const Project = require('./models/Project');
const Product = require('./models/Product');
const TeamMember = require('./models/TeamMember');
const Blog = require('./models/Blog');
const Testimonial = require('./models/Testimonial');

const MONGO_URI = process.env.MONGO_URI;

// --- Static Data ---

const services = [
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


const projects = [
  {
    title: "Smart Trolley System",
    description: "An automated retail checkout cart that detects scanned items in real-time, tallies the bill, and handles processing instantly.",
    techStack: ["OpenCV", "Python", "Raspberry Pi", "MongoDB"],
    link: "",
    imageUrl: "🛒"
  },
  {
    title: "AI Agent Platform",
    description: "A secure framework allowing businesses to deploy customized voice and text agents that execute administrative tasks natively.",
    techStack: ["Python", "FastAPI", "React", "OpenAI API"],
    link: "",
    imageUrl: "🤖"
  },
  {
    title: "School ERP",
    description: "An administrative platform for schools to manage student registration, fees collection, grades, and parent-teacher communication.",
    techStack: ["Node.js", "React", "PostgreSQL", "Tailwind CSS"],
    link: "",
    imageUrl: "🏫"
  },
  {
    title: "Business CRM",
    description: "A customer relationship management tool featuring sales pipelines, automated follow-ups, analytics dashboards, and billing.",
    techStack: ["React", "Express", "MySQL", "Chart.js"],
    link: "",
    imageUrl: "📈"
  },
  {
    title: "Inventory Management",
    description: "Real-time stock level tracker with automated alert thresholds, supplier ordering triggers, and detailed tax reporting modules.",
    techStack: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    link: "",
    imageUrl: "📦"
  },
  {
    title: "Cross Platform Logistics App",
    description: "A multi-platform application supporting real-time package tracking, automated routes calculation, and driver status updates.",
    techStack: ["Flutter", "Dart", "Firebase", "Google Maps API"],
    link: "",
    imageUrl: "🚚"
  }
];

const products = [
  {
    name: "AJNABH CRM System",
    overview: "A lightweight, secure customer relationship management software designed to manage client lifecycles, track deal values, and run outbound sales automatically.",
    features: ["Visual sales pipeline tracking", "Automated email/chat outreach triggers", "Analytics and revenue forecasts", "Custom quotes & invoicing creator"],
    benefits: ["Boost lead reply rates by 40%", "Save 10+ hours weekly on admin", "Centralized conversation histories"],
    price: "$49 / user / month",
    demoUrl: "Request Sandbox Demo",
    imageUrl: ""
  },
  {
    name: "AJNABH ERP Platform",
    overview: "An enterprise resource planning solution that connects finance, logistics, procurement, and staff actions under a single database.",
    features: ["Double-entry ledger accounting", "Supply chain & logistics module", "Department-wide reporting hubs", "Multi-role security permissions"],
    benefits: ["Eliminate duplicate reporting entries", "60% faster department reporting", "Complete operational visibility"],
    price: "Custom Enterprise Quote",
    demoUrl: "Schedule Live Demo",
    imageUrl: ""
  },
  {
    name: "AJNABH Inventory Management",
    overview: "Keep your warehouses synchronized. Tracks physical storage units, handles supplier triggers, and manages catalog changes.",
    features: ["Barcode & QR scanning support", "Low-stock trigger thresholds", "Supplier order generator", "Sales tax calculation exports"],
    benefits: ["Zero stockouts with smart alerts", "Reduces overhead by 15%", "Automate restocking flows"],
    price: "$99 / warehouse / month",
    demoUrl: "Request Inventory Sandbox",
    imageUrl: ""
  },
  {
    name: "AJNABH School Management (ERP)",
    overview: "Manage students, parents, staff, courses, fee structures, and grades in a highly secure academic environment.",
    features: ["Student & parent login portals", "Automated fee invoices & receipts", "Academic grades entry sheets", "Push alert notice board"],
    benefits: ["Streamline fee reconciliation", "Dramatically improves parent involvement", "Easy digital grades reporting"],
    price: "Annual Enrollment Pricing",
    demoUrl: "Request Demo Portal Access",
    imageUrl: ""
  },
  {
    name: "AJNABH AI Agent System",
    overview: "Deploy custom LLM workers that handle calls, answer customer support chats, and gather qualified sales leads 24/7.",
    features: ["Realistic human-like voice agents", "Intelligent context support chatbot", "CRM pipeline lead injection", "Multi-language chat translation"],
    benefits: ["Provide instant 24/7 client response", "Save 80% on standard support costs", "Scale output with zero headcount increase"],
    price: "Custom Task-Based Pricing",
    demoUrl: "Test AI Voice Agent",
    imageUrl: ""
  }
];

const teamMembers = [
  {
    name: "Abhinav Sharma",
    role: "CEO & Founder",
    skills: ["Strategic Leadership", "Enterprise Architectures", "Product Design"],
    experience: "10+ Years in Digital Transformation",
    socialLinks: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", github: "https://github.com" },
    imageUrl: "👨‍💼"
  },
  {
    name: "Vikram Rathore",
    role: "Project Manager",
    skills: ["Agile Management", "Sprint Planning", "Client Relations"],
    experience: "7+ Years in IT Delivery",
    socialLinks: { linkedin: "https://linkedin.com", twitter: "https://twitter.com" },
    imageUrl: "📅"
  },
  {
    name: "Dr. Kanishk Dubey",
    role: "Lead AI Engineer",
    skills: ["Deep Learning", "Computer Vision", "YOLO & OpenAI API"],
    experience: "5+ Years in Machine Learning research",
    socialLinks: { linkedin: "https://linkedin.com", github: "https://github.com" },
    imageUrl: "🧠"
  },
  {
    name: "Rajesh Kumar",
    role: "Senior Software Developer",
    skills: ["React", "Node.js", "PostgreSQL", "Cloud Deployments"],
    experience: "6+ Years in Fullstack Web Engineering",
    socialLinks: { linkedin: "https://linkedin.com", github: "https://github.com" },
    imageUrl: "💻"
  },
  {
    name: "Pooja Mehta",
    role: "UI / UX Designer",
    skills: ["Figma", "User Journeys", "Responsive Prototyping"],
    experience: "4+ Years in Visual Experience Design",
    socialLinks: { linkedin: "https://linkedin.com", twitter: "https://twitter.com" },
    imageUrl: "🎨"
  }
];

const blogs = [
  {
    title: "Future Of AI Agents",
    category: "AI",
    content: "An in-depth look at how autonomous LLM agents are transitioning from simple text generation into native system administrators executing workflow actions. (Content placeholder...)",
    author: "Dr. Kanishk Dubey",
    imageUrl: "🤖"
  },
  {
    title: "Flask vs FastAPI",
    category: "Web Development",
    content: "A technical evaluation of the performance, schema validation, and speed benchmarks of async FastAPI pipelines compared to traditional synchronous Flask controllers. (Content placeholder...)",
    author: "Rajesh Kumar",
    imageUrl: "⚡"
  },
  {
    title: "ERP Trends",
    category: "ERP",
    content: "How modern businesses utilize cloud ERP models and connected databases to align their logistics, finance, and CRM modules under a single interface. (Content placeholder...)",
    author: "Abhinav Sharma",
    imageUrl: "📈"
  },
  {
    title: "AI Automation Systems",
    category: "Technology",
    content: "Exploring the workflow automation stack: connecting third-party apps, running data gathering triggers, and integrating voice assistant bots. (Content placeholder...)",
    author: "Dr. Kanishk Dubey",
    imageUrl: "⚙️"
  },
  {
    title: "Automating Jaipur Academics: A Case Study",
    category: "Case Studies",
    content: "How AJNABH INFOTECH deployed school ERP systems to consolidate fee reconciliation, student registration, and parent notifications under a clean portal. (Content placeholder...)",
    author: "Vikram Rathore",
    imageUrl: "🏫"
  }
];

const testimonials = [
  {
    clientName: "Daniel Roy",
    company: "BrightStack",
    review: "They understood our workflow instantly. The AI integrations removed so much manual work and saved significant time.",
    rating: 5,
    imageUrl: "👨‍💻"
  },
  {
    clientName: "Rhea D’Souza",
    company: "Studio Rhea",
    review: "Very reliable and easy to work with. Their AI tools improved our daily tasks almost immediately and efficiently across all departments.",
    rating: 5,
    imageUrl: "👩‍🎨"
  },
  {
    clientName: "Michael Evans",
    company: "Nova",
    review: "The marketing automation has been a real game changer. Our outreach is now faster, more consistent, and far more effective.",
    rating: 5,
    imageUrl: "👨‍💼"
  },
  {
    clientName: "Priya Sharma",
    company: "Loop Studio",
    review: "AJNABH INFOTECH delivered AI solutions that fit our business perfectly. Great attention to detail. That help us streamline our operations.",
    rating: 5,
    imageUrl: "👩‍💼"
  },
  {
    clientName: "Arjun Mehta",
    company: "VerseMedia",
    review: "Their AI automation saved us hours every week and helped us scale easily without extra effort or a big budget investment.",
    rating: 5,
    imageUrl: "👨‍💻"
  }
];

async function seedDatabase() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined!");
    }
    console.log("Connecting to MongoDB:", MONGO_URI.replace(/:([^@]+)@/, ':****@')); // Hide password in logs
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    console.log("Clearing existing data...");
    await Promise.all([
      Service.deleteMany({}),
      Project.deleteMany({}),
      Product.deleteMany({}),
      TeamMember.deleteMany({}),
      Blog.deleteMany({}),
      Testimonial.deleteMany({})
    ]);

    console.log("Inserting static data...");
    await Promise.all([
      Service.insertMany(services),
      Project.insertMany(projects),
      Product.insertMany(products),
      TeamMember.insertMany(teamMembers),
      Blog.insertMany(blogs),
      Testimonial.insertMany(testimonials)
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    console.log("Connection closed.");
  }
}

seedDatabase();

import type { ServiceItem, TeamMember, ReviewItem, ProjectItem, CRMProject } from '../types';

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-finnext',
    title: 'FinNext Core — Enterprise Fintech Platform',
    category: 'Web Development',
    description: 'High-performance Next.js 14 & Supabase banking operations portal with sub-100ms API response latency, biometric authentication, and automated KYC pipelines.',
    tags: ['Next.js', 'PostgreSQL', 'TailwindCSS', 'TypeScript'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    clientName: 'FinNext Global Inc.',
    impactResult: '+310% Operational Efficiency'
  },
  {
    id: 'proj-zenora',
    title: 'Zenora Health — AI Diagnostic & Telehealth Platform',
    category: 'UI/UX Design',
    description: 'Comprehensive patient-doctor mobile & web design system with real-time biometric telemetry, tele-consultation UI, and WCAG AAA accessibility compliance.',
    tags: ['Figma UI Kit', 'Design System', 'Mobile App', 'Accessibility'],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    clientName: 'Zenora Health Ventures',
    impactResult: '98.4% User Satisfaction Rating'
  },
  {
    id: 'proj-cyberpulse',
    title: 'CyberPulse — Viral High-Converting 3D Tech Showcase',
    category: 'UGC Videos',
    description: 'High-energy 3D product visualization, motion graphics, and creator-led UGC campaign driving exponential social reach on Instagram Reels and YouTube Shorts.',
    tags: ['UGC Video', 'Motion Graphics', 'Blender 3D', 'After Effects'],
    imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    clientName: 'CyberPulse Audio',
    impactResult: '4.2M+ Organic Views & 18% CTR'
  },
  {
    id: 'proj-veloce',
    title: 'Veloce E-Commerce — Headless Omni-Channel Marketplace',
    category: 'Web Development',
    description: 'High-conversion headless e-commerce store with dynamic inventory management, automated Razorpay multi-currency checkout, and sub-second page loads.',
    tags: ['E-Commerce', 'Shopify Storefront', 'React', 'Node.js'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    clientName: 'Veloce Luxury Apparel',
    impactResult: '+145% Mobile Checkout Conversion'
  },
  {
    id: 'proj-aura',
    title: 'Aura Sound — Dynamic 3D Sound Brand Identity & Motion',
    category: 'Video Editing',
    description: 'Cinematic 4K commercial editing, sound engineering, color grading, and dynamic kinetic typography for international audio gear product launch.',
    tags: ['DaVinci Resolve', 'Color Grading', 'Sound Design', '4K Commercial'],
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    clientName: 'Aura Acoustics',
    impactResult: 'Featured in Global Design Awards'
  },
  {
    id: 'proj-automasys',
    title: 'AutomaSys — Autonomous AI Enterprise Agent System',
    category: 'AI & Automation',
    description: 'Multi-agent autonomous workflow pipeline integrating custom LLM models with internal CRM, automated customer support triage, and automated document synthesis.',
    tags: ['AI Agents', 'LangChain', 'Python FastApi', 'Automation'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    clientName: 'AutomaSys Logistics',
    impactResult: '78% Reduction in Manual Support Hours'
  }
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'svc-web-dev',
    title: 'Website Development',
    category: 'Development',
    price: '₹45,000',
    icon: 'Globe',
    description: 'Scalable, responsive, and high-performance web applications built with modern frameworks and robust security setups.',
    content: 'Full-stack web application development leveraging React, Next.js, TypeScript, and Node.js with secure database architecture and SEO optimization.',
    overview: 'In today’s digital-first world, your website is often the first interaction a potential customer has with your brand. At DigiWorku, we engineer digital experiences that drive growth, engage users, and scale seamlessly.',
    offerings: [
      { title: 'Business Websites', desc: 'Professional corporate presence.' },
      { title: 'Landing Pages', desc: 'High-converting campaign pages.' },
      { title: 'Web Applications', desc: 'Complex, interactive web apps.' },
      { title: 'Responsive Design', desc: 'Flawless across all devices.' },
      { title: 'API Integration', desc: 'Seamless third-party connections.' },
      { title: 'Performance Optimization', desc: 'Lightning-fast load times.' }
    ],
    process: [
      { step: 1, title: 'Requirement Discovery', desc: 'Understanding your business needs and technical requirements.' },
      { step: 2, title: 'Planning & Strategy', desc: 'Mapping out architecture, wireframes, and technology stack.' },
      { step: 3, title: 'UI/UX Design', desc: 'Crafting visually stunning and user-friendly interfaces.' },
      { step: 4, title: 'Development', desc: 'Writing clean, scalable, and secure code.' },
      { step: 5, title: 'Testing & QA', desc: 'Rigorous cross-browser and performance testing.' },
      { step: 6, title: 'Deployment', desc: 'Launching your product to the world.' }
    ],
    features: [
      { title: 'React & Next.js Ecosystem', desc: 'Built on the fastest and most modern frontend frameworks for unparalleled speed.' },
      { title: 'Robust Backend Architecture', desc: 'Secure APIs using Node.js, Express, and scalable databases like PostgreSQL.' },
      { title: 'SEO-Friendly Structure', desc: 'Pre-rendered pages and semantic HTML ensure maximum search engine visibility.' },
      { title: 'Enterprise-Grade Security', desc: 'Implementing best practices for data protection and secure user authentication.' }
    ],
    whyUs: [
      'Top-tier Engineering Team',
      'Transparent & Agile Process',
      'Focus on Conversion & ROI',
      'Modern Technology Stack',
      'Affordable Enterprise Quality',
      '30-Day Post-Launch Support'
    ],
    deliverables: [
      'Fully functional, responsive website',
      'Complete source code ownership',
      'Production deployment and DNS setup',
      'Basic On-page SEO optimization',
      'Technical documentation'
    ],
    faqs: [
      { q: 'How long does it take to build a website?', a: 'A standard business website typically takes 2 to 4 weeks, while complex web applications may take 6 to 10 weeks.' },
      { q: 'Will my website be mobile responsive?', a: 'Absolutely. Every website we build is 100% mobile-responsive and optimized for all screen sizes.' },
      { q: 'Do you offer maintenance support?', a: 'Yes, we include a 30-day warranty post-launch and ongoing support packages.' }
    ]
  },
  {
    id: 'svc-ui-ux',
    title: 'UI/UX & Graphic Design',
    category: 'Design & Branding',
    price: '₹8,000',
    icon: 'Palette',
    description: 'Human-centric UI/UX design, mobile app interfaces, and high-impact graphic marketing collateral.',
    content: 'Elevate your visual storytelling with bespoke Figma UI kits, brand style guides, marketing collateral, and intuitive user workflows.',
    overview: 'Design is not just what it looks like and feels like — design is how it works. We create captivating digital aesthetics that maximize user engagement and brand recognition.',
    offerings: [
      { title: 'UI/UX Design', desc: 'Figma prototypes and interfaces.' },
      { title: 'Marketing Creatives', desc: 'Social media and campaign assets.' },
      { title: 'Brand Kits', desc: 'Typography, palettes, and style guides.' }
    ],
    process: [
      { step: 1, title: 'Brand Discovery', desc: 'Auditing your identity and target demographic.' },
      { step: 2, title: 'Wireframing', desc: 'Structuring user journey and hierarchy.' },
      { step: 3, title: 'Visual Polish', desc: 'High-fidelity design components and prototypes.' }
    ],
    features: [
      { title: 'Figma Master Files', desc: 'Neatly organized auto-layout component libraries.' },
      { title: 'Vector Asset Delivery', desc: 'SVG, PDF, and high-res exports ready for production.' }
    ],
    whyUs: [
      'Pixel-perfect precision',
      'Modern glassmorphic and minimalist trends',
      'Rapid turnaround times'
    ],
    deliverables: [
      'Figma source files with design tokens',
      'Exported icon and graphic packs',
      'Clickable interactive prototype'
    ],
    faqs: [
      { q: 'What design tools do you use?', a: 'We primarily design in Figma, Adobe Illustrator, and Photoshop for optimal collaboration.' }
    ]
  },
  {
    id: 'svc-video-motion',
    title: 'Video Editing & Motion Graphics',
    category: 'Video Production',
    price: '₹12,500',
    icon: 'Film',
    description: 'Cinematic video post-production, YouTube long-form, viral short-form Reels, and 2D/3D motion graphics.',
    content: 'Transform raw camera footage into engaging, viral, and cinematic digital video content tailored for social growth and brand authority.',
    overview: 'Video is the most powerful communication medium today. We handle end-to-end post-production with sound design, color grading, dynamic subtitles, and motion graphics.',
    offerings: [
      { title: 'Shorts & Reels', desc: 'Fast-paced viral vertical content.' },
      { title: 'Long-Form YouTube', desc: 'Retention-focused narrative editing.' },
      { title: 'Motion Graphics', desc: 'Dynamic animated titles and explainers.' }
    ],
    process: [
      { step: 1, title: 'Footage Ingestion', desc: 'Organizing clips, transcripts, and assets.' },
      { step: 2, title: 'Rough Cut & Pacing', desc: 'Building high-retention storyline hooks.' },
      { step: 3, title: 'Audio & Color Master', desc: 'Professional sound effects, mix, and LUTs.' }
    ],
    features: [
      { title: '4K High-Bitrate Export', desc: 'Crystal clear uploads for all platforms.' },
      { title: 'Custom Subtitle Animations', desc: 'Captivating typographic animations.' }
    ],
    whyUs: [
      'Algorithms-friendly retention editing',
      'Licensed royalty-free music and SFX',
      'Fast 48-hour delivery on short-form'
    ],
    deliverables: [
      'Master 4K video exports',
      'Platform-optimized aspect ratio versions (16:9, 9:16, 1:1)',
      'Thumbnail graphics and title suggestions'
    ],
    faqs: [
      { q: 'How do I send my raw footage?', a: 'You can share via Google Drive, Dropbox, or WeTransfer links.' }
    ]
  },
  {
    id: 'svc-brand-identity',
    title: 'Brand Identity & Strategy',
    category: 'Design & Branding',
    price: '₹20,000',
    icon: 'Megaphone',
    description: 'Complete brand positioning, memorable logo design, corporate voice, and launch strategy kits.',
    content: 'Build an unforgettable brand presence with comprehensive corporate identity guidelines, logo design, stationery, and strategic brand positioning.',
    overview: 'A strong brand builds instant trust and market authority. We craft unique brand narratives that differentiate your company from competitors.',
    offerings: [
      { title: 'Logo System', desc: 'Primary, secondary, and submark emblems.' },
      { title: 'Brand Guidelines', desc: 'Usage rules, color tokens, and font licensing.' },
      { title: 'Brand Voice', desc: 'Messaging framework and mission statements.' }
    ],
    process: [
      { step: 1, title: 'Competitor Analysis', desc: 'Analyzing market landscape and positioning opportunities.' },
      { step: 2, title: 'Concept Exploration', desc: 'Developing 3 unique creative directions.' },
      { step: 3, title: 'Identity System Guidelines', desc: 'Assembling complete corporate style documentation.' }
    ],
    features: [
      { title: 'Vector Scalability', desc: 'Formats suitable from favicons to building billboards.' },
      { title: 'Trademark-Ready Assets', desc: '100% original custom geometric vector work.' }
    ],
    whyUs: [
      'Enduring timeless design philosophy',
      'Enterprise-grade presentation materials',
      'Full commercial IP transfer'
    ],
    deliverables: [
      'Vector logo package (AI, EPS, SVG, PNG, PDF)',
      'Comprehensive Brand Guidelines Book (PDF)',
      'Social media avatar and header templates'
    ],
    faqs: [
      { q: 'Do you provide trademark registration?', a: 'We provide full copyright assignment and trademark-ready vector files for your legal filing.' }
    ]
  }
];

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'team-priyanshu',
    name: 'Priyanshu Sharma',
    role: 'Lead Solutions Architect & Cloud Ops',
    avatarUrl: 'https://ui-avatars.com/api/?name=Priyanshu+Sharma&background=00c853&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false
  },
  {
    id: 'team-ananya',
    name: 'Ananya Verma',
    role: 'Senior UI/UX & Interaction Designer',
    avatarUrl: 'https://ui-avatars.com/api/?name=Ananya+Verma&background=3b82f6&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false
  },
  {
    id: 'team-vikram',
    name: 'Vikram Aditya',
    role: 'Principal Full-Stack Web Engineer',
    avatarUrl: 'https://ui-avatars.com/api/?name=Vikram+Aditya&background=8b5cf6&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false
  },
  {
    id: 'team-rohit',
    name: 'Rohit Nair',
    role: 'Creative Motion Director & Video Editor',
    avatarUrl: 'https://ui-avatars.com/api/?name=Rohit+Nair&background=f59e0b&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false
  },
  {
    id: 'team-sneha',
    name: 'Sneha Patel',
    role: 'AI Workflow & Automation Strategist',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=00c853&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false
  }
];

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-aarav',
    name: 'Aarav Malhotra',
    role: 'Founder, FinNext Core',
    rating: 5,
    text: 'DigiWorku delivered our Next.js fintech dashboard 10 days ahead of schedule. Flawless code quality, robust security, and responsive team communication throughout.',
    avatarInitials: 'AM',
    createdAt: '2 days ago'
  },
  {
    id: 'rev-meera',
    name: 'Meera Sengupta',
    role: 'Product Head, Zenora Health',
    rating: 5,
    text: 'The UI/UX design and brand system created by DigiWorku elevated our venture pitch. We closed our pre-seed round right after launching the new web platform.',
    avatarInitials: 'MS',
    createdAt: '5 days ago'
  },
  {
    id: 'rev-daniel',
    name: 'Daniel Vance',
    role: 'VP Engineering, CloudScale US',
    rating: 5,
    text: 'Exceptional engineering capability. Their dedicated developer integrated our real-time messaging pipeline effortlessly with enterprise-level security standards.',
    avatarInitials: 'DV',
    createdAt: '1 week ago'
  },
  {
    id: 'rev-neha',
    name: 'Neha Kapoor',
    role: 'Director, Nexa EdTech',
    rating: 5,
    text: 'Top-tier video production and interactive learning platform delivered with meticulous attention to detail. Our student engagement grew by 40% within the first month.',
    avatarInitials: 'NK',
    createdAt: '2 weeks ago'
  }
];

export const DEFAULT_CRM_PROJECTS: CRMProject[] = [
  {
    id: '#PJ-8421',
    name: 'FinNext Core Banking Portal Sprint',
    leadName: 'Aarav Malhotra',
    leadAvatar: 'https://ui-avatars.com/api/?name=Aarav+Malhotra&background=00c853&color=fff&bold=true&size=256',
    status: 'ON TRACK',
    healthScore: 98,
    budget: '₹4,50,000',
    description: 'Next.js 14 frontend engineering with Supabase realtime channels and automated KYC integration.',
    progress: 75,
    email: 'aarav@finnext.io'
  },
  {
    id: '#PJ-7319',
    name: 'Zenora Health Diagnostic App UI System',
    leadName: 'Meera Sengupta',
    leadAvatar: 'https://ui-avatars.com/api/?name=Meera+Sengupta&background=3b82f6&color=fff&bold=true&size=256',
    status: 'IN REVIEW',
    healthScore: 94,
    budget: '₹2,80,000',
    description: 'Figma component master library and responsive patient portal interactive prototyping.',
    progress: 90,
    email: 'meera@zenorahealth.com'
  },
  {
    id: '#PJ-6154',
    name: 'CyberPulse 3D Product Viral Campaign',
    leadName: 'Rohit Verma',
    leadAvatar: 'https://ui-avatars.com/api/?name=Rohit+Verma&background=f59e0b&color=fff&bold=true&size=256',
    status: 'STABLE',
    healthScore: 96,
    budget: '₹1,75,000',
    description: 'High-converting 3D Blender product animation sprint for Instagram Reels and TikTok ads.',
    progress: 60,
    email: 'rohit@cyberpulse.tech'
  },
  {
    id: '#PJ-5082',
    name: 'AutomaSys Enterprise Multi-Agent Pipeline',
    leadName: 'Daniel Vance',
    leadAvatar: 'https://ui-avatars.com/api/?name=Daniel+Vance&background=8b5cf6&color=fff&bold=true&size=256',
    status: 'ON TRACK',
    healthScore: 100,
    budget: '₹6,20,000',
    description: 'Autonomous customer support triage bot with vector database semantic search and ticketing dispatch.',
    progress: 40,
    email: 'daniel@cloudscale.us'
  }
];


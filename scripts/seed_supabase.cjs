const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rjxbdjgagizjmjwnlbxx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_v-Wt6Skez4RmaQOUq-faCA_zHG-H8Au';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SERVICES_DATA = [
  {
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
    why_us: [
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
    ],
    sort_order: 1
  },
  {
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
    why_us: [
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
    ],
    sort_order: 2
  },
  {
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
    why_us: [
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
    ],
    sort_order: 3
  },
  {
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
    why_us: [
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
    ],
    sort_order: 4
  }
];

const TEAM_DATA = [
  {
    name: 'Priyanshu Sharma',
    role: 'Lead Solutions Architect & Cloud Ops',
    avatar_url: 'https://ui-avatars.com/api/?name=Priyanshu+Sharma&background=00c853&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false,
    sort_order: 1
  },
  {
    name: 'Ananya Verma',
    role: 'Senior UI/UX & Interaction Designer',
    avatar_url: 'https://ui-avatars.com/api/?name=Ananya+Verma&background=3b82f6&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false,
    sort_order: 2
  },
  {
    name: 'Vikram Aditya',
    role: 'Principal Full-Stack Web Engineer',
    avatar_url: 'https://ui-avatars.com/api/?name=Vikram+Aditya&background=8b5cf6&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false,
    sort_order: 3
  },
  {
    name: 'Rohit Nair',
    role: 'Creative Motion Director & Video Editor',
    avatar_url: 'https://ui-avatars.com/api/?name=Rohit+Nair&background=f59e0b&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false,
    sort_order: 4
  },
  {
    name: 'Sneha Patel',
    role: 'AI Workflow & Automation Strategist',
    avatar_url: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=00c853&color=fff&bold=true&size=256',
    status: 'ONLINE',
    blocked: false,
    sort_order: 5
  }
];

const REVIEWS_DATA = [
  {
    name: 'Aarav Malhotra',
    role: 'Founder, FinNext Core',
    rating: 5,
    text: 'DigiWorku delivered our Next.js fintech dashboard 10 days ahead of schedule. Flawless code quality, robust security, and responsive team communication throughout.',
    avatar_initials: 'AM',
    approved: true
  },
  {
    name: 'Meera Sengupta',
    role: 'Product Head, Zenora Health',
    rating: 5,
    text: 'The UI/UX design and brand system created by DigiWorku elevated our venture pitch. We closed our pre-seed round right after launching the new web platform.',
    avatar_initials: 'MS',
    approved: true
  },
  {
    name: 'Daniel Vance',
    role: 'VP Engineering, CloudScale US',
    rating: 5,
    text: 'Exceptional engineering capability. Their dedicated developer integrated our real-time messaging pipeline effortlessly with enterprise-level security standards.',
    avatar_initials: 'DV',
    approved: true
  },
  {
    name: 'Neha Kapoor',
    role: 'Director, Nexa EdTech',
    rating: 5,
    text: 'Top-tier video production and interactive learning platform delivered with meticulous attention to detail. Our student engagement grew by 40% within the first month.',
    avatar_initials: 'NK',
    approved: true
  }
];

async function seed() {
  console.log('🚀 Starting Supabase Database Seeding...');

  // 1. Seed Services
  const { count: svcCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
  if (svcCount === 0) {
    console.log('Seeding services catalog...');
    const { error } = await supabase.from('services').insert(SERVICES_DATA);
    if (error) console.error('Services seed error:', error.message);
    else console.log(`✅ Seeded ${SERVICES_DATA.length} services!`);
  } else {
    console.log(`Services table already has ${svcCount} rows. Skipping.`);
  }

  // 2. Seed Team
  const { count: teamCount } = await supabase.from('team').select('*', { count: 'exact', head: true });
  if (teamCount === 0) {
    console.log('Seeding team directory...');
    const { error } = await supabase.from('team').insert(TEAM_DATA);
    if (error) console.error('Team seed error:', error.message);
    else console.log(`✅ Seeded ${TEAM_DATA.length} team members!`);
  } else {
    console.log(`Team table already has ${teamCount} rows. Skipping.`);
  }

  // 3. Seed Reviews
  const { count: revCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true });
  if (revCount === 0) {
    console.log('Seeding reviews...');
    const { error } = await supabase.from('reviews').insert(REVIEWS_DATA);
    if (error) console.error('Reviews seed error:', error.message);
    else console.log(`✅ Seeded ${REVIEWS_DATA.length} reviews!`);
  } else {
    console.log(`Reviews table already has ${revCount} rows. Skipping.`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

seed().catch(err => {
  console.error('Seed exception:', err);
  process.exit(1);
});

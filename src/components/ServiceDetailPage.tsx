import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Globe,
  Palette,
  Film,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  Shield,
  Layers,
  Smartphone,
  BarChart,
  Code,
  Layout,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServiceDetailProps {
  slug: string;
  darkMode: boolean;
  onBack: () => void;
  onRequestService: () => void;
}

// Data Dictionary for Services
const SERVICE_DATA: Record<string, any> = {
  'website-development': {
    title: 'Website Development',
    category: 'Development',
    price: '₹45,000',
    icon: Globe,
    intro: 'Scalable, responsive, and high-performance web applications built with modern frameworks and robust security setups.',
    overview: 'In today\'s digital-first world, your website is often the first interaction a potential customer has with your brand. At DigiWorku, we don\'t just build websites; we engineer digital experiences that drive growth, engage users, and scale seamlessly. Whether you need a corporate landing page or a complex web application, our expert team utilizes modern technology stacks to deliver high-performing, secure, and SEO-optimized solutions tailored to your business goals.',
    offerings: [
      { title: 'Business Websites', desc: 'Professional corporate presence.', icon: Globe },
      { title: 'Landing Pages', desc: 'High-converting campaign pages.', icon: Layout },
      { title: 'Web Applications', desc: 'Complex, interactive web apps.', icon: Code },
      { title: 'Responsive Design', desc: 'Flawless across all devices.', icon: Smartphone },
      { title: 'API Integration', desc: 'Seamless third-party connections.', icon: Zap },
      { title: 'Performance Optimization', desc: 'Lightning-fast load times.', icon: Zap }
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
      'Content Management System (CMS) access',
      'Technical documentation'
    ],
    faqs: [
      { q: 'How long does it take to build a website?', a: 'A standard business website typically takes 2 to 4 weeks from discovery to deployment, while complex web applications may take 6 to 10 weeks depending on the required features.' },
      { q: 'Will my website be mobile responsive?', a: 'Absolutely. Every website we build is 100% mobile-responsive and optimized for all screen sizes, from smartphones to large desktop monitors.' },
      { q: 'Is hosting and domain included?', a: 'We assist with the setup and configuration of your hosting and domain, but the actual purchasing and ownership remain directly with you for full control.' },
      { q: 'Do you offer maintenance support?', a: 'Yes, we include a 30-day warranty post-launch. We also offer affordable ongoing maintenance packages to keep your site updated and secure.' },
      { q: 'Can you redesign my existing website?', a: 'Yes, we specialize in modernizing legacy websites, improving their performance, design, and conversion rates.' },
      { q: 'What is the payment process?', a: 'We typically work on a milestone basis: 40% advance to commence work, 30% upon design approval, and 30% before final deployment.' }
    ]
  },
  'graphic-design': {
    title: 'Graphic Design',
    category: 'Design & Branding',
    price: '₹8,000',
    icon: Palette,
    intro: 'Stunning visual assets, from social media graphics to corporate presentations that captivate your target audience.',
    overview: 'Visual communication is the core of modern marketing. Our Graphic Design services provide you with premium, scroll-stopping visuals that perfectly align with your brand identity. From digital marketing creatives to print-ready materials, we craft designs that not only look beautiful but also communicate your message effectively and drive audience engagement.',
    offerings: [
      { title: 'Social Media Creatives', desc: 'Posts, stories, and carousels.', icon: Layout },
      { title: 'Marketing Banners', desc: 'High-converting ad visuals.', icon: Zap },
      { title: 'Presentation Decks', desc: 'Professional corporate slides.', icon: Layers },
      { title: 'Custom Illustrations', desc: 'Unique brand artwork.', icon: Palette },
      { title: 'Print Design', desc: 'Flyers, brochures, and cards.', icon: CheckCircle2 },
      { title: 'Infographics', desc: 'Data visualization.', icon: BarChart }
    ],
    process: [
      { step: 1, title: 'Creative Briefing', desc: 'Understanding your brand, campaign goals, and target audience.' },
      { step: 2, title: 'Concept Ideation', desc: 'Brainstorming visual styles and initial sketches.' },
      { step: 3, title: 'Drafting', desc: 'Creating the first iteration of the digital designs.' },
      { step: 4, title: 'Client Review', desc: 'Gathering feedback and making necessary revisions.' },
      { step: 5, title: 'Final Polish', desc: 'Refining details, colors, and typography.' },
      { step: 6, title: 'Asset Delivery', desc: 'Providing final files in all required formats.' }
    ],
    features: [
      { title: 'Platform-Optimized Formats', desc: 'Designs specifically tailored for Instagram, LinkedIn, Facebook, and Twitter specs.' },
      { title: 'Brand Consistency', desc: 'Strict adherence to your brand guidelines for a cohesive visual identity.' },
      { title: 'High-Resolution Assets', desc: 'Crisp, retina-ready graphics suitable for both digital and high-quality print.' },
      { title: 'Quick Turnaround', desc: 'Agile design processes ensuring you get your marketing assets on time.' }
    ],
    whyUs: [
      'Award-Winning Designers',
      'Unlimited Revisions on Concepts',
      'Trend-Aware Aesthetic',
      'Multi-format Exports',
      'Dedicated Design Manager',
      'No Hidden Licensing Fees'
    ],
    deliverables: [
      'High-resolution final designs (PNG/JPG)',
      'Vector source files (AI/EPS/SVG)',
      'Print-ready files with bleed (PDF)',
      'Web-optimized compressed assets',
      'Full commercial usage rights'
    ],
    faqs: [
      { q: 'What software do you use?', a: 'We primarily use industry-standard Adobe Creative Cloud tools including Illustrator, Photoshop, and InDesign, as well as Figma for digital/UI assets.' },
      { q: 'How many revisions are included?', a: 'We typically offer up to 2 or 3 rounds of revisions to ensure you are completely satisfied with the final design.' },
      { q: 'Can I get the source files?', a: 'Yes, all final packages include the editable vector source files at no extra cost.' },
      { q: 'How long does a design project take?', a: 'Standard social media batches or flyers take 2-4 days, while complex presentations or full campaigns may take 1-2 weeks.' },
      { q: 'Do you provide stock imagery?', a: 'Yes, we have licenses for premium stock photography and vector libraries which we can incorporate into your designs.' },
      { q: 'Can you match my existing brand style?', a: 'Absolutely. We will ask for your brand guidelines, past materials, and logo files to ensure 100% visual consistency.' }
    ]
  },
  'video-editing': {
    title: 'Video Editing',
    category: 'Video Production',
    price: '₹12,500',
    icon: Film,
    intro: 'Professional post-production for commercials, YouTube, and corporate videos with seamless transitions and motion graphics.',
    overview: 'Video is the most powerful medium for storytelling and engagement today. Our professional video editing services transform your raw footage into cinematic, highly engaging content. Whether you need fast-paced reels for social media, polished corporate interviews, or high-retention YouTube edits, our post-production experts add the perfect blend of pacing, color grading, and motion graphics to elevate your brand.',
    offerings: [
      { title: 'YouTube Videos', desc: 'High-retention, engaging edits.', icon: Film },
      { title: 'Social Media Reels', desc: 'Fast-paced vertical videos.', icon: Smartphone },
      { title: 'Corporate Videos', desc: 'Professional company profiles.', icon: CheckCircle2 },
      { title: 'Ads & Commercials', desc: 'High-converting promotional content.', icon: Zap },
      { title: 'Motion Graphics', desc: 'Animated text and visual elements.', icon: Layers },
      { title: 'Color Grading', desc: 'Cinematic color correction.', icon: Palette }
    ],
    process: [
      { step: 1, title: 'Footage Review', desc: 'Organizing and reviewing all raw materials and assets.' },
      { step: 2, title: 'Story Assembly', desc: 'Creating the rough cut and establishing the narrative flow.' },
      { step: 3, title: 'Pacing & Trimming', desc: 'Refining cuts to match the rhythm of the audio and keep viewer retention high.' },
      { step: 4, title: 'Visuals & Audio', desc: 'Adding motion graphics, lower thirds, sound effects, and background music.' },
      { step: 5, title: 'Color Grading', desc: 'Applying color correction and cinematic LUTs.' },
      { step: 6, title: 'Final Export', desc: 'Rendering in high resolution for various platforms.' }
    ],
    features: [
      { title: 'Cinematic Color Grading', desc: 'Transform flat footage into vibrant, professional-looking video.' },
      { title: 'Kinetic Typography', desc: 'Engaging on-screen captions optimized for silent social media viewing.' },
      { title: 'Advanced Sound Design', desc: 'Crisp dialogue cleaning paired with immersive background soundscapes.' },
      { title: 'Seamless Transitions', desc: 'Modern, smooth transitions that keep the viewer\'s attention locked.' }
    ],
    whyUs: [
      'Expert Video Editors',
      'Deep Understanding of Social Algorithms',
      'Fast Turnaround Times',
      'Access to Premium Music Libraries',
      'Multi-aspect Ratio Delivery',
      'Attention to Detail & Pacing'
    ],
    deliverables: [
      'Final rendered video in 4K or 1080p',
      'Optimized versions for different platforms (16:9, 9:16, 1:1)',
      'Clean audio mix track',
      'SRT subtitle files (if requested)',
      'Thumbnails (optional add-on)'
    ],
    faqs: [
      { q: 'How do I send you my raw footage?', a: 'You can upload your footage to our secure Google Drive or Dropbox links, or share files via platforms like WeTransfer or Frame.io.' },
      { q: 'Do you provide background music?', a: 'Yes, we have subscriptions to premium royalty-free music libraries like Artlist and Epidemic Sound, ensuring your videos won\'t get copyright strikes.' },
      { q: 'Can you add subtitles/captions?', a: 'Yes, we specialize in adding dynamic, animated captions similar to popular styles seen on TikTok and Instagram Reels.' },
      { q: 'How fast can you deliver?', a: 'Short-form content (Reels/Shorts) can be delivered within 24-48 hours. Longer YouTube or corporate videos typically take 3-5 days.' },
      { q: 'Do you edit 4K footage?', a: 'Yes, we have high-performance editing workstations fully capable of handling 4K and even 6K raw footage smoothly.' },
      { q: 'What if I need changes after delivery?', a: 'We include rounds of revisions in our packages. We use frame-accurate feedback tools to ensure your exact changes are made.' }
    ]
  },
  'branding': {
    title: 'Branding',
    category: 'Design & Branding',
    price: '₹30,000',
    icon: Sparkles,
    intro: 'Complete brand identity kits including logo design, typography, color palettes, guidelines, and localized brand positioning.',
    overview: 'A brand is much more than just a logo; it\'s the entire emotional and visual experience your customers have with your business. At DigiWorku, we build cohesive, memorable brand identities from the ground up. We craft strategic visual ecosystems that communicate trust, establish authority in your market, and ensure that every touchpoint—from your website to your business cards—feels premium and uniquely yours.',
    offerings: [
      { title: 'Logo Design', desc: 'Primary, secondary, and sub-marks.', icon: Palette },
      { title: 'Brand Guidelines', desc: 'Comprehensive rulebooks.', icon: CheckCircle2 },
      { title: 'Typography Systems', desc: 'Curated font pairings.', icon: Layers },
      { title: 'Color Psychology', desc: 'Strategic color palettes.', icon: Palette },
      { title: 'Stationery Design', desc: 'Business cards and letterheads.', icon: Layout },
      { title: 'Social Media Kits', desc: 'Profile branding and templates.', icon: Sparkles }
    ],
    process: [
      { step: 1, title: 'Brand Discovery', desc: 'In-depth questionnaire to understand your vision, mission, and audience.' },
      { step: 2, title: 'Market Research', desc: 'Analyzing competitors and industry trends for strategic positioning.' },
      { step: 3, title: 'Concept Development', desc: 'Creating initial logo concepts and mood boards.' },
      { step: 4, title: 'Refinement', desc: 'Iterating on the chosen concept based on your detailed feedback.' },
      { step: 5, title: 'System Building', desc: 'Developing the full visual ecosystem (colors, typography, patterns).' },
      { step: 6, title: 'Guidelines Creation', desc: 'Compiling the final Brand Book and exporting all assets.' }
    ],
    features: [
      { title: 'Strategic Approach', desc: 'Decisions driven by market psychology, not just aesthetics.' },
      { title: 'Comprehensive Ecosystems', desc: 'We don\'t just deliver a logo; we deliver a complete toolkit for your brand.' },
      { title: 'Scalable Assets', desc: 'Vector-first workflow ensures your brand looks perfect on a pen or a billboard.' },
      { title: 'Detailed Brand Book', desc: 'Clear guidelines ensuring anyone who works with your brand maintains consistency.' }
    ],
    whyUs: [
      'Holistic Brand Strategy',
      'Timeless & Modern Aesthetics',
      'Dedicated Art Director',
      'Full Copyright Transfer',
      'Thorough Competitor Analysis',
      'Ready-to-use Asset Library'
    ],
    deliverables: [
      'Primary Logo, Secondary Logo, and Icon/Favicon',
      'Complete Brand Guidelines PDF (20+ pages)',
      'Color Palette with HEX, RGB, and CMYK codes',
      'Typography licenses or links to free fonts',
      'Stationery Mockups and Print-Ready Files',
      'Social Media Profile and Cover Images'
    ],
    faqs: [
      { q: 'What is a Brand Guideline document?', a: 'It\'s a comprehensive manual (usually a PDF) that dictates how your brand should be presented. It includes rules for logo usage, clear space, color codes, typography, and tone of voice.' },
      { q: 'Will I own the copyright to the logo?', a: 'Yes. Upon final payment and delivery, full copyright and intellectual property ownership are transferred entirely to you.' },
      { q: 'How many logo options will I get to choose from?', a: 'We typically present 2 to 3 distinct, fully fleshed-out brand concepts during the initial presentation phase.' },
      { q: 'Can you just design a logo without the full branding package?', a: 'While we highly recommend the full package for a cohesive brand, we do offer standalone logo design services for startups on a tight budget.' },
      { q: 'How long does the branding process take?', a: 'A complete branding project, including strategy, logo design, and guidelines, usually takes 3 to 5 weeks depending on feedback cycles.' },
      { q: 'Do you help with naming the business?', a: 'Yes, brand naming and tagline creation can be added to your package as an additional strategic service.' }
    ]
  }
};

export const ServiceDetailPage: React.FC<ServiceDetailProps> = ({ slug, darkMode, onBack, onRequestService }) => {
  const service = SERVICE_DATA[slug] || SERVICE_DATA['website-development'];
  const Icon = service.icon;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#111111] text-slate-100' : 'bg-[#FFF7E6] text-[#00311F]'} pb-24 relative selection:bg-[#00c853]/30`}>
      
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none grid-mesh opacity-[0.03] dark:opacity-[0.06] z-0" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#00c853]/10 to-transparent pointer-events-none z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm font-medium mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={onBack} className="text-slate-500 dark:text-slate-300 hover:text-[#00c853] transition-colors flex items-center whitespace-nowrap">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Services
          </button>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="text-slate-500 dark:text-slate-300 whitespace-nowrap">{service.category}</span>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className={`whitespace-nowrap ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{service.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Content */}
          <div className="flex-1 w-full max-w-4xl">
            
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00c853]/10 text-[#00c853] text-sm font-bold uppercase tracking-wider mb-6">
                <Icon className="w-4 h-4" />
                {service.category}
              </div>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>
                {service.title}
              </h1>
              <p className={`text-lg sm:text-xl leading-relaxed max-w-3xl mb-8 ${darkMode ? 'text-slate-300' : 'text-[#00311F]/75'}`}>
                {service.intro}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={onRequestService}
                  className="bg-[#00c853] hover:bg-[#00b047] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-[#00c853]/25 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Request This Service
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className={`px-8 py-3.5 rounded-xl font-bold transition-all border ${darkMode ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}
                >
                  Learn More
                </button>
              </div>
              
              <div className="mt-10 flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-6">
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center border-2 border-white dark:border-[#1a1a1a]">
                    <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" alt="DigiWorku" className="w-full h-full object-cover" />
                  </div>
                  By DigiWorku Engineering Team
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-500"></span>
                <span>Premium Quality Guarantee</span>
              </div>
            </motion.div>

            {/* Overview */}
            <section id="overview" className="mb-16 scroll-mt-24">
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>
                <span className="w-8 h-1 rounded-full bg-[#00c853]"></span>
                Overview
              </h2>
              <p className={`leading-relaxed text-lg ${darkMode ? 'text-slate-300' : 'text-[#00311F]/75'}`}>
                {service.overview}
              </p>
            </section>

            {/* What We Offer */}
            <section id="offerings" className="mb-16 scroll-mt-24">
              <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>
                <span className="w-8 h-1 rounded-full bg-[#00c853]"></span>
                What We Offer
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.offerings.map((offer: any, i: number) => (
                  <div key={i} className={`p-6 rounded-2xl border transition-all hover:border-[#00c853]/50 group ${darkMode ? 'bg-[#1e1e1e] border-[#2e2e2e]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-lg bg-[#e8fcf0] dark:bg-emerald-950/60 text-[#00c853] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <offer.icon className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>{offer.title}</h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-[#00311F]/60'}`}>{offer.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Our Process */}
            <section id="process" className="mb-16 scroll-mt-24">
              <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>
                <span className="w-8 h-1 rounded-full bg-[#00c853]"></span>
                Our Process
              </h2>
              <div className="space-y-6">
                {service.process.map((step: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#00c853] text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-md">
                        {step.step}
                      </div>
                      {i !== service.process.length - 1 && (
                        <div className={`w-0.5 h-full my-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                      )}
                    </div>
                    <div className={`pb-6 pt-1 ${i === service.process.length - 1 ? 'pb-0' : ''}`}>
                      <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>{step.title}</h3>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-[#00311F]/60'}`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section id="features" className="mb-16 scroll-mt-24">
              <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>
                <span className="w-8 h-1 rounded-full bg-[#00c853]"></span>
                Key Capabilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.features.map((feat: any, i: number) => (
                  <div key={i} className={`p-6 rounded-2xl border border-transparent hover:border-[#00c853]/30 transition-all ${darkMode ? 'bg-[#1e1e1e]' : 'bg-[#FFF3D6]'}`}>
                    <CheckCircle2 className="w-6 h-6 text-[#00c853] mb-4" />
                    <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>{feat.title}</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-[#00311F]/65'}`}>{feat.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Choose Us */}
            <section id="why-us" className="mb-16 scroll-mt-24">
              <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>
                <span className="w-8 h-1 rounded-full bg-[#00c853]"></span>
                Why Choose DigiWorku
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.whyUs.map((reason: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-[#e8fcf0] dark:bg-emerald-950/60 text-[#00c853] flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-[#00311F]'}`}>{reason}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="mb-16 scroll-mt-24">
              <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>
                <span className="w-8 h-1 rounded-full bg-[#00c853]"></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {service.faqs.map((faq: any, i: number) => (
                  <div 
                    key={i} 
                    className={`rounded-xl border overflow-hidden transition-all duration-200 ${darkMode ? 'bg-[#1e1e1e] border-[#2e2e2e]' : 'bg-white border-slate-200 shadow-sm'}`}
                  >
                    <button
                      onClick={() => toggleFaq(i)}
                      className={`w-full text-left px-6 py-5 flex items-center justify-between font-semibold focus:outline-none ${darkMode ? 'text-white' : 'text-[#00311F]'}`}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`px-6 pb-5 pt-4 text-sm leading-relaxed border-t ${darkMode ? 'text-slate-400 border-[#2e2e2e]' : 'text-[#00311F]/70 border-slate-100'}`}>
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Sidebar (TOC & Pricing Card) */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              
              {/* Pricing & CTA Card */}
              <div className={`p-6 rounded-2xl border shadow-xl ${darkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-slate-200'}`}>
                <div className="text-center mb-6">
                  <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-[#00311F]/60'}`}>Starting From</p>
                  <h3 className="text-4xl font-extrabold text-[#00c853]">{service.price}</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  <h4 className={`font-bold text-sm border-b pb-2 ${darkMode ? 'text-white border-[#2e2e2e]' : 'text-[#00311F] border-slate-200'}`}>Deliverables Included:</h4>
                  <ul className="space-y-3">
                    {service.deliverables.slice(0, 4).map((item: string, i: number) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-[#00311F]/75'}`}>
                        <CheckCircle2 className="w-4 h-4 text-[#00c853] mt-0.5 shrink-0" />
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {service.deliverables.length > 4 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">+ more features included</p>
                  )}
                </div>

                <button 
                  onClick={onRequestService}
                  className="w-full bg-[#00c853] hover:bg-[#00b047] text-white px-4 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-[#00c853]/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Request Service
                </button>
                <p className="text-center text-xs text-slate-400 dark:text-slate-400 mt-4">
                  No credit card required. Free initial consultation.
                </p>
              </div>

              {/* Table of Contents */}
              <div className={`hidden lg:block p-6 rounded-2xl border ${darkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h4 className={`font-bold text-sm uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-300' : 'text-[#00311F]/60'}`}>On this page</h4>
                <nav className="space-y-3">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'offerings', label: 'What We Offer' },
                    { id: 'process', label: 'Our Process' },
                    { id: 'features', label: 'Key Capabilities' },
                    { id: 'why-us', label: 'Why Choose Us' },
                    { id: 'faq', label: 'FAQ' }
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left text-sm font-medium hover:text-[#00c853] transition-colors ${darkMode ? 'text-slate-400' : 'text-[#00311F]/70'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

            </div>
          </div>

        </div>

        {/* Final Bottom CTA */}
        <div className={`mt-24 mb-12 p-10 md:p-16 rounded-3xl text-center relative overflow-hidden border ${darkMode ? 'bg-[#161616] border-[#00c853]/20' : 'bg-white border-[#00c853]/20 shadow-2xl'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#00c853]/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto bg-[#e8fcf0] dark:bg-emerald-950/60 text-[#00c853] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Rocket className="w-8 h-8" />
            </div>
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>Ready to Build Your Digital Presence?</h2>
            <p className={`text-lg mb-10 ${darkMode ? 'text-slate-400' : 'text-[#00311F]/70'}`}>
              Partner with DigiWorku to elevate your brand. Let's discuss your project goals and how we can help you achieve them.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onRequestService}
                className="bg-[#00c853] hover:bg-[#00b047] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#00c853]/25 flex items-center justify-center gap-2 text-lg"
              >
                <Sparkles className="w-5 h-5" />
                Start Your Project
              </button>
              <button 
                onClick={onRequestService}
                className={`px-8 py-4 rounded-xl font-bold transition-all border text-lg flex items-center justify-center gap-2 ${darkMode ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}
              >
                <MessageSquare className="w-5 h-5" />
                Talk to Sales
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper for the icon missing above
const Rocket = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

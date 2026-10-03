import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const routes = [
  {
    path: '/services',
    title: 'Digital Services by DigiWorku India',
    description: 'Explore DigiWorku digital services: web development, UI/UX design, video editing, branding, and AI automation. Dedicated teams for every project.',
    h1: 'DigiWorku Digital Services',
    h2: 'Dedicated Teams for Every Digital Need',
    content: `DigiWorku provides dedicated engineering teams, web application development, custom UI/UX design, automated workflow engineering, and digital growth solutions for businesses across India and globally.

Our service portfolio covers web and mobile application development, brand identity design, professional video post-production, and custom AI system integration. Each service is delivered by a vetted, dedicated team that is committed to your timeline and quality standards.

We work with startups, mid-size businesses, and enterprise clients across fintech, healthcare, education, e-commerce, and SaaS verticals. Every engagement includes a dedicated project lead, weekly milestone reviews, and direct communication channels.

Our pricing is transparent and milestone-based, starting from ₹8,000 for design packages and ₹45,000 for full web development projects. We offer both one-time project delivery and long-term team subscription models to fit your business needs.`
  },
  {
    path: '/portfolio',
    title: 'Client Portfolio & Case Studies | DigiWorku',
    description: 'View live client projects, software deliverables, and high-impact case studies built by DigiWorku teams across India and globally.',
    h1: 'DigiWorku Client Work & Software Portfolio',
    h2: 'Real Projects, Real Results',
    content: `Browse DigiWorku's portfolio of delivered software projects, brand identities, video productions, and AI automation systems built for clients across multiple industries.

Our portfolio includes e-commerce platforms, SaaS dashboards, corporate websites, mobile applications, animated brand videos, complete brand identity kits, and custom AI chatbot integrations. Each project is documented with deliverables, client feedback, and measurable results.

DigiWorku has completed over 200 projects for clients in India, the UAE, the UK, and the United States. Our clients range from early-stage startups to established enterprises that depend on us for ongoing digital growth and product engineering.

Every case study in our portfolio reflects real measurable impact — including conversion rate improvements, load time optimizations, brand recognition growth, and revenue uplift directly attributed to our work.`
  },
  {
    path: '/team',
    title: 'Our Engineering & Creative Team | DigiWorku',
    description: 'Meet the expert engineers, UI/UX designers, video editors, and AI specialists at DigiWorku India. Top 1% digital talent for your project.',
    h1: 'DigiWorku Dedicated Engineering & Creative Workforce',
    h2: 'Top 1% Digital Talent Across Every Discipline',
    content: `DigiWorku's team includes senior software engineers, UI/UX designers, motion graphics artists, video editors, brand strategists, growth marketers, and AI automation specialists, all working as dedicated professionals for client projects.

Every team member at DigiWorku is carefully vetted through a multi-stage technical and creative assessment process. We evaluate portfolio quality, communication skills, deadline adherence, and domain expertise before onboarding any professional to the platform.

Our engineers work with modern technology stacks including React, Next.js, Node.js, TypeScript, Python, Flutter, and cloud infrastructure on AWS, GCP, and Vercel. Our designers are proficient in Figma, Adobe Creative Suite, and motion design tools including After Effects.

Team members are based across major Indian cities including Delhi, Bengaluru, Mumbai, Hyderabad, and Chennai, enabling us to support clients across all Indian time zones and most global time zones efficiently.`
  },
  {
    path: '/reviews',
    title: 'Client Reviews & Testimonials | DigiWorku',
    description: 'Read what startup founders and business owners say about working with DigiWorku digital teams. Verified client reviews and project testimonials.',
    h1: 'Verified Client Reviews & Founder Testimonials',
    h2: 'What Our Clients Say About DigiWorku',
    content: `DigiWorku has earned strong reviews from startup founders, marketing directors, product managers, and enterprise procurement teams who have engaged our dedicated digital services.

Clients consistently highlight our responsiveness, technical depth, creative quality, and transparent project management as key strengths. Our average client satisfaction rating is 4.8 out of 5 across all service categories, based on post-project feedback collected after every engagement.

Many clients return to DigiWorku for repeat projects across different service categories, with over 60% of our revenue coming from returning clients who have expanded their scope of work with us over time.

Our client base spans industries including healthtech, edtech, real estate, retail, logistics, media, and government sector digital initiatives. Verified review links, project screenshots, and client references are available upon request for qualified prospects.`
  },
  // Service Detail Pages
  {
    path: '/services/website-development',
    title: 'Website Development Services | DigiWorku',
    description: 'Custom web application development by DigiWorku India. React, Next.js, Node.js, and TypeScript. Fast, secure, and SEO-optimised websites from ₹45,000.',
    h1: 'Website & Web App Development',
    h2: 'Scalable, High-Performance Web Solutions',
    content: `DigiWorku builds custom web applications, corporate websites, SaaS platforms, and e-commerce stores using modern frameworks including React, Next.js, TypeScript, Node.js, and Tailwind CSS.

Our web development engagements include discovery and architecture mapping, iterative sprint-based development with live staging environments, cross-browser QA testing, security audits, and production deployment with 30-day post-launch support.

Every website we build is optimised for Google Lighthouse scores above 90, mobile-first responsive layouts, schema markup for SEO, and secure HTTPS with CSP headers. We integrate CMS solutions, payment gateways, Supabase, Firebase, or PostgreSQL databases based on your project requirements.

Pricing for web development projects starts from ₹45,000 for single-page marketing sites and scales based on feature complexity, number of integrations, and backend requirements. We offer fixed-price and time-and-materials engagement models.`
  },
  {
    path: '/services/graphic-design',
    title: 'Graphic Design Services | DigiWorku India',
    description: 'Professional graphic design by DigiWorku. Social media graphics, pitch decks, corporate presentations, and marketing materials from ₹8,000.',
    h1: 'Graphic Design & Visual Communication',
    h2: 'Premium Visual Assets for Every Brand',
    content: `DigiWorku's graphic design team creates stunning visual assets including social media graphics, Instagram carousel templates, corporate pitch decks, business presentations, marketing flyers, and digital advertising creatives.

Our designers work in Figma, Adobe Illustrator, Photoshop, and InDesign to produce pixel-perfect, print-ready, and screen-optimised assets for all major platforms and formats.

Every design engagement includes a brand questionnaire, initial concept options, unlimited revisions on the selected direction, and delivery of all source files in vector and raster formats including AI, EPS, SVG, PNG, and PDF.

Graphic design packages start from ₹8,000 for social media asset kits and scale based on volume, complexity, and turnaround speed. Rush delivery within 24 hours is available for standard design tasks.`
  },
  {
    path: '/services/video-editing',
    title: 'Video Editing Services | DigiWorku India',
    description: 'Professional video post-production by DigiWorku. YouTube, Instagram Reels, corporate films, and motion graphics. Delivered in 4K from ₹12,500.',
    h1: 'Video Editing & Post-Production',
    h2: 'Cinematic Video Content for Every Platform',
    content: `DigiWorku's video editing team delivers professional post-production services for YouTube content, Instagram Reels, corporate films, product launch videos, event recaps, and educational video series.

Our video workflow includes precise story-based cutting, colour grading with cinematic LUTs, motion graphic callouts, background music integration, sound design, and multi-format export optimised for each target platform including YouTube (16:9), Instagram (9:16 and 1:1), and LinkedIn.

We add animated kinetic typography captions, custom lower thirds, logo animations, and transitions that match your brand guidelines. Raw footage is accepted via Google Drive, WeTransfer, or direct upload for files under 4 GB.

Draft cuts are delivered within 72 hours for standard projects. Pricing starts from ₹12,500 and includes two rounds of revision feedback. Subtitles, voiceover, and music licensing can be included at an additional cost.`
  },
  {
    path: '/services/branding',
    title: 'Brand Identity Design Services | DigiWorku',
    description: 'Complete brand identity kits by DigiWorku. Logo design, brand guidelines, typography, and visual systems for startups and enterprises from ₹30,000.',
    h1: 'Brand Identity & Visual Branding',
    h2: 'Build a Brand That Stands Out',
    content: `DigiWorku creates comprehensive brand identity systems for startups, growing businesses, and enterprises that need a cohesive, professional, and memorable visual presence across all touchpoints.

Our branding engagements include logo design architecture with primary, secondary, and sub-mark variants, a comprehensive 25-page brand guidelines document covering logo usage rules, colour palette (HEX, RGB, CMYK, Pantone), and typography hierarchy.

We also develop tone of voice guidelines, brand messaging frameworks, stationery designs (business cards, letterheads), social media profile kits, and merchandise mockups. All deliverables come with full trademark assignment rights and 100% original custom artwork.

Brand identity projects start from ₹30,000 and are delivered in 10 to 14 business days depending on scope. We include three initial concept directions, unlimited revisions on the selected concept, and final delivery in all standard vector and raster formats.`
  },
  // Legal Pages
  {
    path: '/legal/privacy-policy',
    title: 'Privacy Policy | DigiWorku Data Security',
    description: 'Read the DigiWorku Privacy Policy. Learn how we collect, store, and protect your personal data and project information on our platform.',
    h1: 'Privacy Policy — Data Protection & Privacy Terms',
    h2: 'How DigiWorku Handles Your Data',
    content: `DigiWorku is committed to protecting the privacy and security of personal data belonging to clients, team members, and visitors who access the platform at digiworku.in.

We collect personal information including name, email address, phone number, and project details only when voluntarily submitted through our inquiry forms, chat system, or account registration flows. This data is used exclusively to deliver our services, respond to inquiries, and improve the platform.

DigiWorku stores all user data on encrypted cloud infrastructure using AES-256 encryption at rest and TLS 1.3 in transit. We do not sell, rent, or share personal data with third parties except as required to deliver our contracted services (e.g. payment processors and cloud storage providers).

Users have the right to request access to, correction of, or deletion of their personal data at any time by contacting our team at the email address listed in this policy. We aim to respond to all data requests within 72 hours. This policy was last updated in September 2026.`
  },
  {
    path: '/legal/terms-of-service',
    title: 'Terms of Service | DigiWorku Platform',
    description: 'Review the DigiWorku Terms of Service. Client engagement rules, project delivery obligations, payment terms, and intellectual property rights.',
    h1: 'Terms of Service — Official Client & Platform Usage Terms',
    h2: 'Rules Governing Your Use of DigiWorku',
    content: `These Terms of Service govern all client engagements, platform access, and service delivery agreements between DigiWorku and its clients, partners, and registered users.

By accessing digiworku.in or engaging DigiWorku services, you agree to comply with these terms. DigiWorku reserves the right to modify these terms at any time, with changes communicated via email to registered clients at least 14 days before they take effect.

All project deliverables produced by DigiWorku remain the intellectual property of the client upon full payment of agreed milestone fees. Code, designs, video assets, and brand materials are transferred to client ownership after the final invoice is paid and confirmed.

Payment is structured in milestones tied to project delivery stages. DigiWorku is not liable for delays caused by client-side feedback latency, third-party service outages, or force majeure events. Detailed dispute resolution procedures are outlined in our Refund Policy and Cancellation Policy pages.`
  },
  {
    path: '/legal/cookie-policy',
    title: 'Cookie Policy | DigiWorku',
    description: 'Learn about cookies used by DigiWorku. How we use browser storage, analytics cookies, and session tokens to improve your experience.',
    h1: 'Cookie Policy — Browser Cookies & Analytics Usage',
    h2: 'What Cookies DigiWorku Uses and Why',
    content: `DigiWorku uses cookies and similar browser storage technologies to improve platform performance, remember user preferences, and understand how visitors interact with our website.

We use essential session cookies required for secure authentication, localStorage tokens for dark mode and panel state preferences, and optional analytics cookies that help us understand which pages and features are most used by our clients.

We do not use third-party advertising cookies or cross-site tracking technologies. Analytics data is aggregated and anonymised before being reviewed by our team. Users can clear all cookies and localStorage data at any time via their browser settings.

By continuing to use digiworku.in, you consent to our cookie usage as described in this policy. Users in the European Union have the right to opt out of non-essential cookies. Cookie preferences can be reset by clearing site data in your browser.`
  },
  {
    path: '/legal/refund-policy',
    title: 'Refund Policy | DigiWorku',
    description: 'Read the DigiWorku Refund Policy. Milestone payment protection, refund eligibility criteria, and dispute resolution for all service engagements.',
    h1: 'Refund Policy — Milestone Payments & Guarantee Terms',
    h2: 'How Refunds and Disputes Are Handled',
    content: `DigiWorku's refund policy is designed to protect both clients and our dedicated team members in the event of project disputes, missed deliverables, or service quality issues.

All payments are structured in milestones tied to specific, agreed deliverables. If DigiWorku fails to deliver a milestone as defined in the project scope document, the client is entitled to a full refund of that milestone payment within 7 business days of the missed deadline.

Refunds are not applicable for completed and approved deliverables, scope changes requested after project commencement, or delays caused by client-side factors such as delayed feedback, withheld access credentials, or scope expansion.

To initiate a refund request, clients must submit a written request via email within 14 days of the disputed milestone delivery date. Our disputes team aims to resolve all refund requests within 5 business days.`
  },
  {
    path: '/legal/cancellation-policy',
    title: 'Cancellation Policy | DigiWorku',
    description: 'Read the DigiWorku Cancellation Policy. How to pause, modify, or cancel ongoing service subscriptions and project milestones on DigiWorku.',
    h1: 'Cancellation Policy — Subscription & Milestone Notice',
    h2: 'How to Cancel or Pause Your DigiWorku Project',
    content: `DigiWorku allows clients to cancel, pause, or modify ongoing projects and service subscriptions in accordance with the terms outlined in this cancellation policy.

For monthly service subscription plans, cancellation must be requested at least 7 business days before the next billing cycle to avoid being charged for the following month. Cancellation requests received after this window will take effect in the subsequent billing period.

For milestone-based project engagements, clients may pause a project at the completion of any milestone. Work in progress at the time of cancellation will be billed proportionally based on hours completed and deliverables produced up to the cancellation date.

All cancellation requests must be submitted in writing via email to the DigiWorku project management team. Upon confirmation of cancellation, all completed deliverables, source files, and access credentials will be transferred to the client within 3 business days.`
  },
  {
    path: '/legal/disclaimer',
    title: 'Platform Disclaimer | DigiWorku',
    description: 'Important disclaimers regarding DigiWorku services, software warranties, AI tool outputs, and third-party integration limitations.',
    h1: 'Platform Disclaimer & Usage Notice',
    h2: 'Important Notices About DigiWorku Services',
    content: `DigiWorku provides digital services and a platform workspace on an as-is basis and makes no warranties, express or implied, regarding the continuous availability, fitness for a specific purpose, or error-free operation of any service or software product delivered.

AI-generated content and automation outputs produced using DigiWorku AI tools should be reviewed by qualified professionals before being relied upon for critical business decisions. DigiWorku is not liable for decisions made based solely on AI-generated recommendations.

Third-party integrations including Supabase, Stripe, and Google services operate under their own terms of service and privacy policies. DigiWorku is not responsible for outages, data incidents, or policy changes affecting third-party platforms used within our service delivery.

DigiWorku's maximum liability in any dispute is limited to the total amount paid by the client for the specific service in question during the 3-month period immediately preceding the claim.`
  },
  {
    path: '/legal/acceptable-use-policy',
    title: 'Acceptable Use Policy | DigiWorku',
    description: 'DigiWorku Acceptable Use Policy. Rules for platform security, prohibited activities, and compliance requirements for all users.',
    h1: 'Acceptable Use Policy — Platform Security & Rules',
    h2: 'Permitted and Prohibited Platform Activities',
    content: `The DigiWorku Acceptable Use Policy defines the rules that all registered users, clients, and partners must follow when accessing and using the digiworku.in platform and related services.

Users may not use DigiWorku's platform to engage in automated scraping, credential stuffing, brute-force attacks, or any activity that interferes with the normal operation of the platform or other users' access.

Clients may not request DigiWorku teams to produce content that violates copyright law, promotes illegal activity, constitutes hate speech, or infringes on the intellectual property rights of any third party. DigiWorku reserves the right to decline any project request that violates these standards.

Violations of this acceptable use policy may result in immediate suspension of platform access, termination of active project engagements without refund, and reporting to relevant law enforcement authorities where applicable.`
  },
  {
    path: '/legal/security-policy',
    title: 'Security Policy | DigiWorku Data Protection',
    description: 'DigiWorku Security Policy. Our SSL/TLS encryption, cloud security architecture, access controls, and data protection measures.',
    h1: 'Security Architecture & Data Protection Policy',
    h2: 'How DigiWorku Protects Your Data',
    content: `DigiWorku implements enterprise-grade security measures to protect all client data, project files, communications, and payment information handled through our platform.

All data in transit is encrypted using TLS 1.3. Data at rest is encrypted using AES-256 encryption on Supabase's managed PostgreSQL infrastructure hosted on AWS. Admin access to production databases requires multi-factor authentication and is logged for audit purposes.

Our platform follows OWASP Top 10 security guidelines including input validation, prepared SQL statements to prevent injection attacks, CSRF token protection, and CSP headers on all pages. Regular vulnerability scans and penetration tests are conducted quarterly.

Security incidents are investigated and reported to affected clients within 72 hours of detection. Clients who discover a potential vulnerability are encouraged to report it via our responsible disclosure process to allow us to remediate the issue before it is publicly disclosed.`
  },
  {
    path: '/legal/responsible-disclosure',
    title: 'Responsible Disclosure Policy | DigiWorku',
    description: 'Report security vulnerabilities to DigiWorku responsibly. Our disclosure guidelines, scope, reporting process, and researcher recognition programme.',
    h1: 'Responsible Vulnerability Disclosure Policy',
    h2: 'How to Report a Security Vulnerability to DigiWorku',
    content: `DigiWorku encourages security researchers and ethical hackers to report potential vulnerabilities in our platform in a responsible manner that allows us to address issues before they are publicly disclosed.

If you discover a potential security vulnerability affecting digiworku.in, our APIs, or any related infrastructure, please send a detailed report to our security team via the contact email listed on this page. Include a clear description of the vulnerability, steps to reproduce it, and any supporting evidence.

We commit to acknowledging all valid vulnerability reports within 48 hours, providing regular status updates during investigation, and issuing a fix or mitigation within 30 days for critical-severity findings. We will not pursue legal action against researchers who follow this responsible disclosure process.

We maintain a researcher recognition programme for valid disclosures that are not already known to our team. Researchers may be credited in our security acknowledgements page and may receive a token of appreciation for critical findings.`
  },
  {
    path: '/legal/help-center',
    title: 'Help Center & Support | DigiWorku',
    description: 'Get answers to common DigiWorku questions. Platform guides, project onboarding, billing FAQs, and direct support contact details.',
    h1: 'Help Center — Client Guides & Frequently Asked Questions',
    h2: 'Find Answers and Get Support',
    content: `The DigiWorku Help Center provides answers to the most common questions asked by new and returning clients about our platform, services, billing, and project management processes.

New clients can find step-by-step onboarding guides explaining how to submit a project inquiry, review service packages, communicate with dedicated team leads, and track project milestones in real time through the client portal.

For billing questions, our Help Center covers payment methods accepted, invoice generation, milestone release procedures, and how to request a refund or cancel a service subscription in accordance with our policies.

If you cannot find an answer in our Help Center documentation, you can contact the DigiWorku support team directly via the live chat widget on the platform or by emailing our client success team. We aim to respond to all support queries within 4 business hours during Monday to Friday, 9 AM to 6 PM IST.`
  }
];

function prerender() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Template dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');

  console.log(`🚀 Pre-rendering static HTML entry points for ${routes.length} SEO routes...`);

  routes.forEach(route => {
    const fullCanonical = `https://digiworku.in${route.path}`;
    
    let html = template;

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/g, `<title>${route.title}</title>`);
    html = html.replace(/<meta name="title" content=".*?" \/>/g, `<meta name="title" content="${route.title}" />`);

    // Replace Description
    html = html.replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${route.description}" />`);

    // Replace Canonical
    html = html.replace(/<link rel="canonical" href=".*?" \/>/g, `<link rel="canonical" href="${fullCanonical}" />`);

    // Replace OpenGraph & Twitter tags
    html = html.replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${route.title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${route.description}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${fullCanonical}" />`);

    html = html.replace(/<meta property="twitter:title" content=".*?" \/>/g, `<meta property="twitter:title" content="${route.title}" />`);
    html = html.replace(/<meta property="twitter:description" content=".*?" \/>/g, `<meta property="twitter:description" content="${route.description}" />`);
    html = html.replace(/<meta property="twitter:url" content=".*?" \/>/g, `<meta property="twitter:url" content="${fullCanonical}" />`);

    // Build rich crawler-readable HTML (H1 + H2 + 200+ word content + footer nav)
    const contentParas = route.content
      .trim()
      .split(/\n\n+/)
      .map(p => `          <p style="margin-bottom: 1rem;">${p.trim()}</p>`)
      .join('\n');

    const crawlerContent = `<div id="root">
      <main style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 900px; margin: 0 auto; color: #0f172a;">
        <header>
          <h1 style="font-size: 2rem; font-weight: 900; letter-spacing: -0.025em; color: #030712;">${route.h1}</h1>
          <p style="font-size: 1.125rem; color: #475569; line-height: 1.6; margin-top: 0.75rem;">${route.description}</p>
        </header>
        <section style="margin-top: 1.5rem; line-height: 1.75; color: #334155;">
          <h2 style="font-size: 1.375rem; font-weight: 800; color: #030712; margin-bottom: 0.75rem;">${route.h2}</h2>
${contentParas}
        </section>
        <footer style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
          <nav style="display: flex; flex-wrap: wrap; gap: 1rem; font-weight: 700; font-size: 0.9rem;">
            <a href="/" style="color: #00c853; text-decoration: underline;">DigiWorku Home</a>
            <a href="/services" style="color: #00c853; text-decoration: underline;">Services &amp; Solutions</a>
            <a href="/portfolio" style="color: #00c853; text-decoration: underline;">Portfolio</a>
            <a href="/team" style="color: #00c853; text-decoration: underline;">Team</a>
            <a href="/reviews" style="color: #00c853; text-decoration: underline;">Reviews</a>
            <a href="/legal/privacy-policy" style="color: #00c853; text-decoration: underline;">Privacy Policy</a>
            <a href="/legal/terms-of-service" style="color: #00c853; text-decoration: underline;">Terms of Service</a>
          </nav>
        </footer>
      </main>
    </div>`;

    html = html.replace(/<div id="root">[\s\S]*?<\/div>/, crawlerContent);

    const targetDir = path.join(distDir, route.path.replace(/^\//, ''));
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');

    console.log(`  ✓ Generated static HTML for: ${route.path} -> dist${route.path}/index.html`);
  });

  console.log(`✅ All ${routes.length} SEO routes prerendered successfully!`);
}

prerender();

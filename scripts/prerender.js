import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const routes = [
  {
    path: '/services',
    title: 'Digital Services & Solutions | DigiWorku India',
    description: 'Explore DigiWorku dedicated digital services: Web Development, Mobile Apps, UI/UX Design, Video Production, and AI Automation in India.',
    h1: 'DigiWorku Digital Services & Tech Solutions',
    content: 'DigiWorku provides dedicated engineering teams, web application development, custom UI/UX design, automated workflow engineering, and digital growth marketing.'
  },
  {
    path: '/portfolio',
    title: 'Portfolio & Client Case Studies | DigiWorku India',
    description: 'View live client projects, software engineering deliverables, and high-impact case studies delivered by DigiWorku teams.',
    h1: 'DigiWorku Client Work & Software Portfolio',
    content: 'Explore case studies and live web applications built for startups, enterprises, and digital creators across India and globally.'
  },
  {
    path: '/projects',
    title: 'Client Projects & Milestone Tracker | DigiWorku',
    description: 'Manage ongoing client project deliverables, milestone timelines, and development progress in real-time on DigiWorku.',
    h1: 'Active Client Software Projects & Milestones',
    content: 'Track development sprints, design reviews, code deployments, and live project deliverables managed by DigiWorku project leads.'
  },
  {
    path: '/team',
    title: 'Our Dedicated Engineering & Creative Team | DigiWorku India',
    description: 'Meet the expert engineers, UI/UX designers, marketing specialists, and AI developers at DigiWorku India.',
    h1: 'DigiWorku Dedicated Engineering & Creative Workforce',
    content: 'Access India top 1% digital talent across software development, graphic design, video editing, and artificial intelligence.'
  },
  {
    path: '/reviews',
    title: 'Client Testimonials & Verified Reviews | DigiWorku India',
    description: 'Read what founders and businesses say about working with DigiWorku digital teams and custom engineering services.',
    h1: 'Verified Client Reviews & Founder Testimonials',
    content: 'Discover real client ratings and reviews from tech founders, agencies, and businesses who scaled using DigiWorku.'
  },
  {
    path: '/legal/privacy-policy',
    title: 'Privacy Policy | DigiWorku Legal & Data Security',
    description: 'Read the official DigiWorku Privacy Policy to understand how we collect, handle, and safeguard your personal information and user data.',
    h1: 'Privacy Policy — Data Protection & Privacy Terms',
    content: 'DigiWorku operates in full compliance with global privacy standards, ensuring 256-bit encryption for user data, client chats, and transaction logs.'
  },
  {
    path: '/legal/terms-of-service',
    title: 'Terms of Service | DigiWorku Legal Agreement',
    description: 'Review the Terms of Service for accessing and using DigiWorku digital workforce services, software engineering, and design offerings.',
    h1: 'Terms of Service — Official Client & Platform Usage Terms',
    content: 'Read the complete legal terms governing client project engagement, payment milestones, code ownership, and service delivery.'
  },
  {
    path: '/legal/cookie-policy',
    title: 'Cookie Policy | DigiWorku Data & Cookies Settings',
    description: 'Learn about DigiWorku cookie management policies, performance analytics, and browser storage guidelines.',
    h1: 'Cookie Policy — Browser Cookies & Analytics Usage',
    content: 'Information regarding session cookies, functional preference tokens, and security analytics utilized across the DigiWorku portal.'
  },
  {
    path: '/legal/refund-policy',
    title: 'Refund Policy | DigiWorku Payment & Billing Terms',
    description: 'Comprehensive guidelines on refund eligibility, payment processing, and milestone fee adjustments at DigiWorku.',
    h1: 'Refund Policy — Milestone Payments & Guarantee Terms',
    content: 'Transparent refund mechanisms and milestone guarantee terms protecting client project investments.'
  },
  {
    path: '/legal/cancellation-policy',
    title: 'Cancellation Policy | DigiWorku Service Cancellation',
    description: 'Read how to pause, modify, or cancel ongoing service subscriptions and project milestones on DigiWorku.',
    h1: 'Cancellation Policy — Subscription & Milestone Notice',
    content: 'Guidelines on how clients can request project pauses, scope adjustments, or milestone service cancellations.'
  },
  {
    path: '/legal/disclaimer',
    title: 'Disclaimer & Platform Usage Notice | DigiWorku',
    description: 'Important disclaimers and platform notices regarding DigiWorku services, software, and artificial intelligence tools.',
    h1: 'Platform Disclaimer & Usage Notice',
    content: 'Official disclaimers regarding software engineering warranties, third-party integrations, and AI tool outputs.'
  },
  {
    path: '/legal/acceptable-use-policy',
    title: 'Acceptable Use Policy | DigiWorku Community Rules',
    description: 'Guidelines on acceptable behaviors, system security rules, and platform compliance policies for DigiWorku users.',
    h1: 'Acceptable Use Policy — Platform Security & Rules',
    content: 'Rules preventing security misuse, unauthorized automated scraping, and platform abuse across DigiWorku infrastructure.'
  },
  {
    path: '/legal/security-policy',
    title: 'Security Policy & Data Protection | DigiWorku',
    description: 'Our technical security architecture, data encryption standards, and enterprise cybersecurity safeguards.',
    h1: 'Security Architecture & Data Protection Policy',
    content: 'Overview of DigiWorku SSL/TLS 256-bit encryption, cloud firewall controls, and database access authorization controls.'
  },
  {
    path: '/legal/responsible-disclosure',
    title: 'Responsible Vulnerability Disclosure | DigiWorku',
    description: 'Guidelines for reporting security vulnerabilities responsibly to the DigiWorku technical security team.',
    h1: 'Responsible Vulnerability Disclosure Policy',
    content: 'Instructions for cybersecurity researchers to report potential security vulnerabilities directly to DigiWorku security teams.'
  },
  {
    path: '/legal/help-center',
    title: 'Help Center & Support Docs | DigiWorku Platform',
    description: 'Get instant answers to FAQs, account management guides, and client support resources on DigiWorku.',
    h1: 'Help Center — Client Guides & Frequently Asked Questions',
    content: 'Instant answers to common client questions regarding onboarding, project tracking, invoices, and dedicated team workflows.'
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

    // Inject crawler-readable HTML inside #root
    const crawlerContent = `<div id="root">
      <main style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 900px; margin: 0 auto; color: #0f172a;">
        <header>
          <h1 style="font-size: 2rem; font-weight: 900; letter-spacing: -0.025em; color: #030712;">${route.h1}</h1>
          <p style="font-size: 1.125rem; color: #475569; line-height: 1.6; margin-top: 0.75rem;">${route.description}</p>
        </header>
        <section style="margin-top: 1.5rem; line-height: 1.7; color: #334155;">
          <p>${route.content}</p>
        </section>
        <footer style="margin-top: 2rem; padding-top: 1.5rem; border-t: 1px solid #e2e8f0;">
          <nav style="display: flex; flex-wrap: wrap; gap: 1rem; font-weight: 700; font-size: 0.9rem;">
            <a href="/" style="color: #00c853; text-decoration: underline;">DigiWorku Home</a>
            <a href="/services" style="color: #00c853; text-decoration: underline;">Services &amp; Solutions</a>
            <a href="/portfolio" style="color: #00c853; text-decoration: underline;">Portfolio</a>
            <a href="/inquiries" style="color: #00c853; text-decoration: underline;">Inquiries &amp; Quotes</a>
            <a href="/projects" style="color: #00c853; text-decoration: underline;">Projects</a>
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

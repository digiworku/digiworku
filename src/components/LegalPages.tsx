import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Shield, FileText, Cookie, RotateCcw, XCircle, AlertTriangle,
  Lock, Eye, Zap, HelpCircle, ChevronDown, ChevronRight, Mail, Phone,
  CheckCircle, Scale, Settings, MessageCircle
} from 'lucide-react';

export type LegalPageSlug =
  | 'privacy-policy'
  | 'terms-of-service'
  | 'cookie-policy'
  | 'refund-policy'
  | 'cancellation-policy'
  | 'disclaimer'
  | 'acceptable-use-policy'
  | 'security-policy'
  | 'responsible-disclosure'
  | 'help-center';

interface LegalPagesProps {
  slug: LegalPageSlug;
  darkMode: boolean;
  onBack: () => void;
}

const effectiveDate = '1 July 2026';
const companyName = 'DigiWorku';
const companyEmail = 'hello@digiworku.in';
const companyWebsite = 'https://digiworku.in';
const companyAddress = 'India';

/* ─── Shared Section Component ─── */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 border-l-4 border-[#00c853] pl-3">{title}</h2>
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">{children}</div>
  </div>
);

/* ─── FAQ Accordion ─── */
const FAQ: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 text-left text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        {q}
        {open ? <ChevronDown className="w-4 h-4 text-[#00c853] shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Page Content Map ─── */
const pageConfig: Record<LegalPageSlug, { title: string; icon: React.ReactNode; badge: string; color: string }> = {
  'privacy-policy': { title: 'Privacy Policy', icon: <Eye className="w-5 h-5" />, badge: 'Legal', color: 'text-blue-500 bg-blue-500/10' },
  'terms-of-service': { title: 'Terms of Service', icon: <Scale className="w-5 h-5" />, badge: 'Legal', color: 'text-purple-500 bg-purple-500/10' },
  'cookie-policy': { title: 'Cookie Policy', icon: <Cookie className="w-5 h-5" />, badge: 'Legal', color: 'text-amber-500 bg-amber-500/10' },
  'refund-policy': { title: 'Refund Policy', icon: <RotateCcw className="w-5 h-5" />, badge: 'Billing', color: 'text-emerald-500 bg-emerald-500/10' },
  'cancellation-policy': { title: 'Cancellation Policy', icon: <XCircle className="w-5 h-5" />, badge: 'Billing', color: 'text-red-500 bg-red-500/10' },
  'disclaimer': { title: 'Disclaimer', icon: <AlertTriangle className="w-5 h-5" />, badge: 'Legal', color: 'text-orange-500 bg-orange-500/10' },
  'acceptable-use-policy': { title: 'Acceptable Use Policy', icon: <CheckCircle className="w-5 h-5" />, badge: 'Policy', color: 'text-teal-500 bg-teal-500/10' },
  'security-policy': { title: 'Security Policy', icon: <Lock className="w-5 h-5" />, badge: 'Security', color: 'text-slate-600 bg-slate-500/10' },
  'responsible-disclosure': { title: 'Responsible Disclosure', icon: <Shield className="w-5 h-5" />, badge: 'Security', color: 'text-[#00c853] bg-[#00c853]/10' },
  'help-center': { title: 'Help Center', icon: <HelpCircle className="w-5 h-5" />, badge: 'Support', color: 'text-sky-500 bg-sky-500/10' },
};

/* ═══════════════════════════════════════════════ PRIVACY POLICY ═══════*/
const PrivacyPolicy = () => (
  <>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effective Date: {effectiveDate}</p>
    <Section title="1. Introduction">
      <p>{companyName} ("we", "our", or "us") operates {companyWebsite}. This Privacy Policy explains how we collect, use, disclose, and protect your information when you access our platform.</p>
    </Section>
    <Section title="2. Information We Collect">
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Account Data:</strong> Name, email address, phone number, profile photo.</li>
        <li><strong>Usage Data:</strong> Pages visited, features used, session duration, browser type.</li>
        <li><strong>Communication Data:</strong> Messages sent via the platform chat system.</li>
        <li><strong>Payment Data:</strong> Processed securely by third-party payment providers. We do not store card details.</li>
        <li><strong>Technical Data:</strong> IP address, cookies, device identifiers.</li>
      </ul>
    </Section>
    <Section title="3. How We Use Your Information">
      <ul className="list-disc pl-5 space-y-1">
        <li>To provide, maintain, and improve our services.</li>
        <li>To communicate updates, invoices, and support responses.</li>
        <li>To detect and prevent fraud or security breaches.</li>
        <li>To comply with applicable laws and legal obligations.</li>
        <li>To personalise your experience on the platform.</li>
      </ul>
    </Section>
    <Section title="4. Data Sharing & Third Parties">
      <p>We do not sell your personal data. We share data only with:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Service providers (e.g., Supabase for database hosting, payment processors).</li>
        <li>Law enforcement when required by law.</li>
        <li>Business successors in the event of a merger or acquisition.</li>
      </ul>
    </Section>
    <Section title="5. Cookies">
      <p>We use essential and analytics cookies. See our <strong>Cookie Policy</strong> for full details. You can manage preferences at any time.</p>
    </Section>
    <Section title="6. Data Retention">
      <p>We retain personal data as long as your account is active or as required by law. You may request deletion at any time by contacting us at <strong>{companyEmail}</strong>.</p>
    </Section>
    <Section title="7. Your Rights">
      <ul className="list-disc pl-5 space-y-1">
        <li>Right to access your personal data.</li>
        <li>Right to correction or deletion.</li>
        <li>Right to data portability.</li>
        <li>Right to withdraw consent at any time.</li>
        <li>Right to lodge a complaint with a supervisory authority.</li>
      </ul>
    </Section>
    <Section title="8. Data Security">
      <p>We implement industry-standard security measures including AES-256 encryption, TLS for data in transit, and regular security audits.</p>
    </Section>
    <Section title="9. Contact">
      <p>For privacy-related queries, email us at <strong>{companyEmail}</strong>.</p>
    </Section>
  </>
);

/* ═══════════════════════════════════════════════ TERMS OF SERVICE ═══════*/
const TermsOfService = () => (
  <>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effective Date: {effectiveDate}</p>
    <Section title="1. Acceptance of Terms">
      <p>By accessing or using {companyName}, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, do not use the platform.</p>
    </Section>
    <Section title="2. Services Description">
      <p>{companyName} provides a digital workforce platform connecting clients with dedicated engineering, design, video, marketing, and AI automation teams based in India.</p>
    </Section>
    <Section title="3. User Accounts">
      <ul className="list-disc pl-5 space-y-1">
        <li>You must be at least 18 years old to create an account.</li>
        <li>You are responsible for maintaining the security of your account credentials.</li>
        <li>One person may maintain only one account.</li>
        <li>You must provide accurate and complete registration information.</li>
      </ul>
    </Section>
    <Section title="4. Prohibited Activities">
      <ul className="list-disc pl-5 space-y-1">
        <li>Reverse engineering or attempting to extract source code.</li>
        <li>Using the platform for unlawful, fraudulent, or harmful purposes.</li>
        <li>Sending spam, unsolicited messages, or malicious code.</li>
        <li>Impersonating another person or entity.</li>
        <li>Scraping platform data without prior written consent.</li>
      </ul>
    </Section>
    <Section title="5. Intellectual Property">
      <p>All content, branding, and software on the platform is owned by {companyName} or its licensors. You may not reproduce, distribute, or create derivative works without explicit permission.</p>
    </Section>
    <Section title="6. Payment Terms">
      <p>Services are invoiced as per agreed project scope. All payments are due within the period specified in the project agreement. Overdue payments may result in service suspension.</p>
    </Section>
    <Section title="7. Limitation of Liability">
      <p>To the maximum extent permitted by law, {companyName} shall not be liable for indirect, incidental, special, or consequential damages arising from use of the platform.</p>
    </Section>
    <Section title="8. Termination">
      <p>We reserve the right to suspend or terminate accounts that violate these Terms, at our sole discretion, with or without notice.</p>
    </Section>
    <Section title="9. Governing Law">
      <p>These Terms are governed by the laws of India. Disputes shall be resolved through arbitration in accordance with Indian Arbitration & Conciliation Act, 1996.</p>
    </Section>
    <Section title="10. Contact">
      <p>Questions about these Terms? Email us at <strong>{companyEmail}</strong>.</p>
    </Section>
  </>
);

/* ═══════════════════════════════════════════════ COOKIE POLICY ═══════*/
const CookiePolicy = () => (
  <>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effective Date: {effectiveDate}</p>
    <Section title="1. What Are Cookies?">
      <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, stay logged in, and understand how you use the service.</p>
    </Section>
    <Section title="2. Cookies We Use">
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="p-2 text-left font-bold border border-slate-200 dark:border-slate-700">Category</th>
              <th className="p-2 text-left font-bold border border-slate-200 dark:border-slate-700">Purpose</th>
              <th className="p-2 text-left font-bold border border-slate-200 dark:border-slate-700">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">Essential</td>
              <td className="p-2 border border-slate-200 dark:border-slate-700">Authentication, security, core functionality</td>
              <td className="p-2 border border-slate-200 dark:border-slate-700">Session / Persistent</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-900/30">
              <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">Preferences</td>
              <td className="p-2 border border-slate-200 dark:border-slate-700">Dark/Light mode, language settings</td>
              <td className="p-2 border border-slate-200 dark:border-slate-700">12 months</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">Analytics</td>
              <td className="p-2 border border-slate-200 dark:border-slate-700">Page views, session metrics (anonymized)</td>
              <td className="p-2 border border-slate-200 dark:border-slate-700">6 months</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
    <Section title="3. Managing Cookies">
      <p>You can control cookies through your browser settings. Note that disabling essential cookies may affect platform functionality. Preferences are stored in your browser's localStorage.</p>
    </Section>
    <Section title="4. Third-Party Cookies">
      <p>We use Supabase and analytics providers that may set their own cookies. These are governed by their respective privacy policies.</p>
    </Section>
    <Section title="5. Updates">
      <p>We may update this Cookie Policy periodically. Continued use of the platform after changes constitutes acceptance.</p>
    </Section>
    <Section title="6. Contact">
      <p>Cookie concerns? Contact us at <strong>{companyEmail}</strong>.</p>
    </Section>
  </>
);

/* ═══════════════════════════════════════════════ REFUND POLICY ═══════*/
const RefundPolicy = () => (
  <>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effective Date: {effectiveDate}</p>
    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6">
      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">⚡ Our Commitment</p>
      <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">We are committed to delivering quality digital services. If you are not satisfied, we work to make it right.</p>
    </div>
    <Section title="1. Eligibility for Refund">
      <ul className="list-disc pl-5 space-y-1">
        <li>Refund requests must be submitted within <strong>7 days</strong> of project delivery or payment.</li>
        <li>Services that have been fully delivered and accepted are non-refundable.</li>
        <li>Partial refunds may be issued for partially completed work at our discretion.</li>
      </ul>
    </Section>
    <Section title="2. Conditions for Full Refund">
      <ul className="list-disc pl-5 space-y-1">
        <li>Work has not commenced after payment.</li>
        <li>DigiWorku failed to deliver the agreed service within the stipulated timeline (without client delay).</li>
        <li>The delivered work materially differs from the agreed scope.</li>
      </ul>
    </Section>
    <Section title="3. Non-Refundable Services">
      <ul className="list-disc pl-5 space-y-1">
        <li>Completed and approved design deliverables.</li>
        <li>Published or deployed code/applications.</li>
        <li>Consultation sessions already conducted.</li>
        <li>Third-party tools or licenses purchased on your behalf.</li>
      </ul>
    </Section>
    <Section title="4. Refund Process">
      <p>Submit your request to <strong>{companyEmail}</strong> with your invoice number, project description, and reason for refund. We will respond within <strong>5 business days</strong>. Approved refunds are processed within 10-14 business days to your original payment method.</p>
    </Section>
    <Section title="5. Disputes">
      <p>If you disagree with a refund decision, you may escalate to our leadership team via email. All disputes are handled under Indian law.</p>
    </Section>
  </>
);

/* ═══════════════════════════════════════════════ CANCELLATION POLICY ═══════*/
const CancellationPolicy = () => (
  <>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effective Date: {effectiveDate}</p>
    <Section title="1. Project Cancellation by Client">
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Before work begins:</strong> 100% refund of any advance paid.</li>
        <li><strong>During active development (≤ 30% completion):</strong> 50% refund of advance; remaining retained for work done.</li>
        <li><strong>After significant work (&gt; 30% completion):</strong> Payment for completed milestones is non-refundable. Remaining advance may be partially refunded pro-rata.</li>
        <li><strong>After delivery:</strong> No refund; however, we will assist with a handover period.</li>
      </ul>
    </Section>
    <Section title="2. Cancellation by DigiWorku">
      <p>We reserve the right to cancel a project if:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Payment obligations are not met by the client.</li>
        <li>The project violates our Acceptable Use Policy.</li>
        <li>Circumstances beyond our control prevent delivery.</li>
      </ul>
      <p className="mt-2">In such cases, a pro-rated refund for work not yet started will be issued.</p>
    </Section>
    <Section title="3. Retainer & Monthly Subscriptions">
      <p>Monthly retainer agreements require <strong>14 days' written notice</strong> to cancel. Services will continue to be provided through the end of the paid period.</p>
    </Section>
    <Section title="4. How to Cancel">
      <p>Email <strong>{companyEmail}</strong> with your project ID and reason for cancellation. We will confirm receipt within 2 business days.</p>
    </Section>
  </>
);

/* ═══════════════════════════════════════════════ DISCLAIMER ═══════*/
const Disclaimer = () => (
  <>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effective Date: {effectiveDate}</p>
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
      <p className="text-sm text-amber-700 dark:text-amber-400">Please read this disclaimer carefully before using the {companyName} platform.</p>
    </div>
    <Section title="1. General Disclaimer">
      <p>The information provided on {companyWebsite} is for general informational purposes only. {companyName} makes no warranties, expressed or implied, regarding the completeness, accuracy, reliability, or availability of the content.</p>
    </Section>
    <Section title="2. No Professional Advice">
      <p>Content on this platform does not constitute legal, financial, or professional advice. Always consult a qualified professional before making business decisions based on information found here.</p>
    </Section>
    <Section title="3. External Links">
      <p>Our platform may contain links to third-party websites. {companyName} has no control over the content or practices of these sites and assumes no responsibility for them.</p>
    </Section>
    <Section title="4. Results Disclaimer">
      <p>Case studies, testimonials, and project results shown on the platform represent past performance. Individual results may vary and are not guaranteed.</p>
    </Section>
    <Section title="5. Service Availability">
      <p>We strive for 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance, unexpected outages, or third-party dependency failures may occasionally affect availability.</p>
    </Section>
    <Section title="6. Limitation of Liability">
      <p>To the maximum extent permitted by Indian law, {companyName} is not liable for any loss or damage arising from use of or inability to use the platform.</p>
    </Section>
  </>
);

/* ═══════════════════════════════════════════════ ACCEPTABLE USE ═══════*/
const AcceptableUsePolicy = () => (
  <>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effective Date: {effectiveDate}</p>
    <Section title="1. Overview">
      <p>This Acceptable Use Policy ("AUP") governs your use of the {companyName} platform. Violation of this policy may result in account suspension or termination.</p>
    </Section>
    <Section title="2. Permitted Uses">
      <ul className="list-disc pl-5 space-y-1">
        <li>Submitting and managing digital service requests.</li>
        <li>Communicating with {companyName} team members through the platform.</li>
        <li>Reviewing project progress and deliverables.</li>
        <li>Managing your account and billing settings.</li>
      </ul>
    </Section>
    <Section title="3. Prohibited Uses">
      <p>You must NOT use the platform to:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Upload, transmit, or distribute malware, viruses, or harmful code.</li>
        <li>Conduct phishing, social engineering, or identity theft.</li>
        <li>Create projects for illegal, defamatory, or harmful content.</li>
        <li>Attempt to gain unauthorized access to our systems or other accounts.</li>
        <li>Overload or interfere with platform infrastructure (DDoS, scraping).</li>
        <li>Use the platform for activities that violate any applicable law.</li>
        <li>Harass, abuse, or threaten team members or other users.</li>
      </ul>
    </Section>
    <Section title="4. Content Standards">
      <p>All content submitted through the platform must be lawful, accurate, and respectful. We reserve the right to remove content that violates this policy without notice.</p>
    </Section>
    <Section title="5. Enforcement">
      <p>Violations may result in immediate account suspension, termination, and/or reporting to law enforcement. No refund will be issued for accounts terminated due to AUP violations.</p>
    </Section>
    <Section title="6. Reporting Violations">
      <p>Report AUP violations to <strong>{companyEmail}</strong>. We take all reports seriously and investigate promptly.</p>
    </Section>
  </>
);

/* ═══════════════════════════════════════════════ SECURITY POLICY ═══════*/
const SecurityPolicy = () => (
  <>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effective Date: {effectiveDate}</p>
    <Section title="1. Our Security Commitment">
      <p>{companyName} takes the security of your data seriously. We employ multiple layers of protection to safeguard your information and maintain platform integrity.</p>
    </Section>
    <Section title="2. Technical Measures">
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers uses TLS 1.3.</li>
        <li><strong>Encryption at Rest:</strong> Sensitive data stored in our database is encrypted using AES-256.</li>
        <li><strong>Authentication:</strong> Secure credential handling with hashed passwords; session tokens stored securely.</li>
        <li><strong>Infrastructure:</strong> Hosted on Supabase (enterprise-grade cloud) with regular automated backups.</li>
        <li><strong>Access Controls:</strong> Role-based access control; admin functions require separate authentication.</li>
      </ul>
    </Section>
    <Section title="3. Organizational Measures">
      <ul className="list-disc pl-5 space-y-1">
        <li>Security awareness training for all team members.</li>
        <li>Principle of least privilege applied to all internal systems.</li>
        <li>Regular internal security reviews and code audits.</li>
        <li>Incident response plan in place for security events.</li>
      </ul>
    </Section>
    <Section title="4. Incident Response">
      <p>In the event of a security incident affecting your data, we will:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Notify affected users within 72 hours of discovery.</li>
        <li>Describe the nature of the breach and data affected.</li>
        <li>Detail steps taken to contain and remediate the incident.</li>
      </ul>
    </Section>
    <Section title="5. Reporting Security Issues">
      <p>If you discover a security vulnerability, please report it responsibly via our Responsible Disclosure policy or email <strong>security@digiworku.in</strong>. Do not publicly disclose vulnerabilities before we have had a chance to address them.</p>
    </Section>
  </>
);

/* ═══════════════════════════════════════════════ RESPONSIBLE DISCLOSURE ═══════*/
const ResponsibleDisclosure = () => (
  <>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effective Date: {effectiveDate}</p>
    <div className="bg-[#00c853]/10 border border-[#00c853]/30 rounded-xl p-4 mb-6">
      <p className="text-sm font-bold text-[#00c853]">🛡️ We Welcome Security Researchers</p>
      <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">{companyName} believes responsible disclosure is vital to security. We appreciate the efforts of security researchers who help keep our platform safe.</p>
    </div>
    <Section title="1. Scope">
      <p>This policy applies to vulnerabilities found in:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>{companyWebsite} and its subdomains.</li>
        <li>{companyName} web application and API endpoints.</li>
        <li>Mobile or desktop clients (if any).</li>
      </ul>
    </Section>
    <Section title="2. How to Report">
      <p>Email your findings to <strong>security@digiworku.in</strong> with:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>A clear description of the vulnerability.</li>
        <li>Steps to reproduce the issue.</li>
        <li>Potential impact and severity assessment.</li>
        <li>Any screenshots or proof-of-concept (non-destructive only).</li>
      </ul>
    </Section>
    <Section title="3. Our Commitments">
      <ul className="list-disc pl-5 space-y-1">
        <li>We will acknowledge your report within <strong>48 hours</strong>.</li>
        <li>We will provide a resolution timeline within <strong>7 business days</strong>.</li>
        <li>We will not pursue legal action against researchers acting in good faith.</li>
        <li>We will credit you in our security acknowledgements (if you wish).</li>
      </ul>
    </Section>
    <Section title="4. Rules of Engagement">
      <p>When researching, you must NOT:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Access, modify, or delete data that does not belong to you.</li>
        <li>Perform denial-of-service attacks.</li>
        <li>Publicly disclose the vulnerability before we have patched it.</li>
        <li>Use automated scanners that generate excessive load.</li>
      </ul>
    </Section>
    <Section title="5. Out of Scope">
      <ul className="list-disc pl-5 space-y-1">
        <li>Social engineering attacks on our staff.</li>
        <li>Physical security issues.</li>
        <li>Issues in third-party services we use.</li>
        <li>Self-XSS or issues requiring unlikely user actions.</li>
      </ul>
    </Section>
  </>
);

/* ═══════════════════════════════════════════════ HELP CENTER ═══════*/
const HelpCenter = () => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[
        { icon: <MessageCircle className="w-5 h-5 text-[#00c853]" />, title: 'Live Chat', desc: 'Chat with our team directly from the platform portal.', action: 'Open Chat' },
        { icon: <Mail className="w-5 h-5 text-blue-500" />, title: 'Email Support', desc: 'Send your query to hello@digiworku.in', action: companyEmail },
        { icon: <Phone className="w-5 h-5 text-purple-500" />, title: 'WhatsApp', desc: 'Message us on WhatsApp for quick responses.', action: 'Contact Us' },
      ].map(item => (
        <div key={item.title} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-[#00c853]/40 transition-colors">
          <div className="mb-2">{item.icon}</div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
        </div>
      ))}
    </div>

    <h2 className="text-base font-black text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
    <FAQ q="How do I start a project with DigiWorku?" a="Browse our Services page, select the service you need, and click 'Request Service'. Fill in your project requirements and budget, and our team will get in touch within 24 hours." />
    <FAQ q="How does the project delivery process work?" a="Once you submit a project request, we assign a dedicated team and project manager. You receive regular updates via the platform dashboard and chat. Deliverables are shared for your review and approval at each milestone." />
    <FAQ q="What payment methods are accepted?" a="We accept bank transfers (NEFT/RTGS/IMPS), UPI, and international wire transfers. Payment terms are agreed per project. We do not store payment card details." />
    <FAQ q="Can I talk to the team before committing?" a="Absolutely. Use the Live Chat on the platform, or email us at hello@digiworku.in. We offer a free 30-minute consultation for new projects." />
    <FAQ q="How do I track my project progress?" a="Your project dashboard under the 'Home' tab shows real-time status, milestones, and team assignments. You can also view all communications in the Chat section." />
    <FAQ q="What if I'm not happy with the deliverable?" a="We offer revisions as part of every project. If work doesn't meet the agreed scope, we revise at no extra cost. For more serious concerns, see our Refund Policy." />
    <FAQ q="How do I change or cancel my project?" a="Contact your project manager directly via chat, or email hello@digiworku.in. Refer to our Cancellation Policy for details on timelines and applicable charges." />
    <FAQ q="Is my data secure on DigiWorku?" a="Yes. We use TLS encryption for data in transit, AES-256 for data at rest, and enterprise-grade cloud infrastructure (Supabase). See our Security Policy for full details." />
    <FAQ q="Can I hire a dedicated full-time team member?" a="Yes. DigiWorku offers dedicated monthly retainer packages for full-time or part-time remote team members. Email us for pricing details." />
    <FAQ q="Do you offer services outside India?" a="Yes. While our team is based in India, we serve clients globally. Communication happens via the platform, email, and video calls." />
  </>
);

/* ═══════════════════════════════════════════════ MAIN COMPONENT ═══════*/
const contentMap: Record<LegalPageSlug, React.ReactNode> = {
  'privacy-policy': <PrivacyPolicy />,
  'terms-of-service': <TermsOfService />,
  'cookie-policy': <CookiePolicy />,
  'refund-policy': <RefundPolicy />,
  'cancellation-policy': <CancellationPolicy />,
  'disclaimer': <Disclaimer />,
  'acceptable-use-policy': <AcceptableUsePolicy />,
  'security-policy': <SecurityPolicy />,
  'responsible-disclosure': <ResponsibleDisclosure />,
  'help-center': <HelpCenter />,
};

export const LegalPages: React.FC<LegalPagesProps> = ({ slug, darkMode, onBack }) => {
  const config = pageConfig[slug];
  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className={`min-h-screen ${darkMode ? 'bg-[#0d0d0d] text-slate-100' : 'bg-slate-50 text-slate-900'}`}
    >
      {/* Sticky header */}
      <div className={`sticky top-0 z-20 px-4 md:px-8 py-3 border-b flex items-center gap-4 ${darkMode ? 'bg-[#111111] border-slate-800' : 'bg-white border-slate-200'}`}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#00c853] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg ${config.color}`}>{config.icon}</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-100">{config.title}</span>
        </div>
        <span className={`ml-auto text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${config.color}`}>{config.badge}</span>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 ${config.color}`}>
            {config.icon}
            <span>{config.badge}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">{config.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{companyName} · {companyWebsite}</p>
        </div>

        <div className={`rounded-2xl border p-6 md:p-8 ${darkMode ? 'bg-[#181818] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          {contentMap[slug]}
        </div>

        {/* Footer CTA */}
        <div className={`mt-6 p-5 rounded-2xl border text-center ${darkMode ? 'bg-[#181818] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Have questions about this policy?</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Our team is happy to help clarify anything.</p>
          <a
            href={`mailto:${companyEmail}`}
            className="inline-flex items-center gap-2 bg-[#00c853] hover:bg-[#00b047] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact Us — {companyEmail}
          </a>
        </div>
      </div>
    </motion.div>
  );
};

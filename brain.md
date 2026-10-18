# 🧠 DigiWorku Codebase Brain & Memory Reference

> **Important Note for Assistant**: Always inspect this document at the start of tasks to understand the complete application state, schema, credentials, and feature set. Update this file whenever making architectural, structural, or key feature changes.

---

## 🌐 1. Domain & SEO Configuration
- **Official Live Domain**: `https://digiworku.in/`
- **Canonical Domain**: `https://digiworku.in/` (defined dynamically per route in `App.tsx` and pre-rendered in `scripts/prerender.js`)
- **Google Search Console Property**: Set to `https://digiworku.in/`.
- **Sitemap File Location**: `public/sitemap.xml` — contains 18 public routes (no admin routes like /inquiries or /projects)
- **Robots File Location**: `public/robots.txt` — disallows /inquiries, /projects, /clients, /analytics, /admin, /api/
- **Structured Data Schemas**: JSON-LD `Organization`, `WebSite`, `ProfessionalService`, `FAQPage`, and `SiteNavigationElement` embedded in `index.html`.
- **SEO Static Prerendering Script**: `scripts/prerender.js` — generates 18 pre-rendered `index.html` files in `dist/` upon build:
  - Core: `/services`, `/portfolio`, `/team`, `/reviews`
  - Service details: `/services/website-development`, `/services/graphic-design`, `/services/video-editing`, `/services/branding`
  - Legal (10): all `/legal/*` routes
  - Each pre-rendered page has: correct `<title>` (≤60 chars), `<meta description>` (≤155 chars), canonical, OG tags, **H1 distinct from title**, **H2 subheading**, **200+ word body content**
- **Dynamic Meta Engine**: React `useEffect` in `App.tsx` dynamically synchronizes `document.title`, `<meta name="description">`, `<link rel="canonical">`, OpenGraph, and Twitter tags per tab & legal slug transition.
- **Home page (`index.html`)**: Title `DigiWorku — India's Top Digital Workforce Platform` (50 chars), H1 distinct from title, 3× H2s + WebPage schema + BreadcrumbList schema in `<head>`.
- **SEO/AEO/GEO Content Section in App.tsx**: Rich section rendered by React in the home tab containing: top summary paragraph, 4× H2 FAQ question-answer blocks ("What is DigiWorku?", "What services?", "How does it work?", "Why choose DigiWorku?"), bullet + numbered lists, and 4 internal navigation link cards to /services, /portfolio, /team, /reviews. Boosts word count from 140 to ~600+, fixes H2 count (was 0), and satisfies AEO question-style headings requirement.
- **Dynamic title** (App.tsx): `DigiWorku — India's Digital Workforce & AI Ecosystem` (52 chars, ≤60).

---

## 🔒 2. Security Headers (SEO Audit Fixes — Oct 2026)
All 4 previously-missing security headers are now set on **every response** via:
- **`server.ts`** Express middleware (`app.use(...)` before all routes):
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com; ...`
- **`vercel.json`** headers block (applies on Vercel CDN for production):
  - Same 4 headers applied via `"headers"` array on `"source": "/(.*)"`.
- **`vercel.json`** routing: Uses `cleanUrls: true` + **`rewrites`** (NOT `routes` — `routes` is the old API that ignores cleanUrls and static files). With `cleanUrls + rewrites`, Vercel serves each pre-rendered `dist/*/index.html` directly for crawlers, then falls back to SPA root `index.html` only for unmatched paths.
- **Branding**: All occurrences of "Agency" replaced with **"Ecosystem"** across: `index.html` (H1 + keywords), `App.tsx` (dynamic title + hero H1), `manifest.json`, `llms.txt`.

## 🛡️ 2b. DDoS & Rate Limiting Protection (Oct 2026)
**Package**: `express-rate-limit` installed.
**3-layer protection in `server.ts`**:
1. **Global limiter** — `200 req / 15 min / IP` on ALL routes
2. **Admin login limiter** — `5 attempts / 15 min / IP` on `/api/admin-login` (brute-force blocker)
3. **AI endpoints limiter** — `30 req / min / IP` on `/api/chat`, `/api/flashcards`, `/api/mindmap`, `/api/compose` (Gemini API bill protection)
**Body size limit**: `100kb` max payload (blocks large payload injection attacks)
**Vercel function (`api/admin-login.ts`)**: In-memory IP-based rate limit (5 attempts / 15 min).

---

## 🔑 3. Administrative Security & Credentials
- **Authorized Admin Emails**:
  1. `digiworku55@gmail.com`
  2. `virkanwlia@gmail.com`
- **Admin Passphrase**: `DigiWorku55@`
- **State Management**:
  - `isAdmin` (boolean): `localStorage.getItem('digiworku-is-admin') === 'true'`
  - `panelMode` ('user' | 'admin'): `localStorage.getItem('digiworku-panel-mode')`
- **Admin Routes (ALL GATED)**: `/projects`, `/inquiries`, `/clients`, `/analytics`, `/chat`, `/settings`, `/team` — when accessed by non-admin or non-authenticated users, ALL show the **"Admin Console Restricted"** lock screen with a "Sign In to Admin Console" button. None are in sitemap or prerendered as public pages.
- **Admin Auth Flow (SECURE)**: Frontend sends `email+password` to **`/api/admin-login`** backend endpoint. Credentials are validated **server-side only** using `process.env.ADMIN_EMAILS` and `process.env.ADMIN_PASSWORD` — **never exposed in browser JS bundle**.
- **New Backend File**: `api/admin-login.ts` — Vercel serverless function handling admin credential verification.
- **Env Vars Required**: `ADMIN_EMAILS` (comma-separated), `ADMIN_PASSWORD` — set in Vercel project environment variables.

---

## 🗄️ 4. Supabase Database Integration
- **Supabase Project Endpoint**: `https://rjxbdjgagizjmjwnlbxx.supabase.co`
- **Primary SQL Schema File**: [supabase_projects_setup.sql](file:///Users/digiworku/Downloads/digiworku/supabase_projects_setup.sql)
- **Database Tables**:
  - `projects`: Portfolio projects (`id`, `title`, `description`, `category`, `tags`, `image_url`, `video_url`, `media_type`, `client_name`, `impact_result`, `created_at`).
  - `messages`: Real-time chat messages between client sessions and admin console (`id`, `user_id`, `text`, `role`, `created_at`).
  - `inquiries`: Lead inquiry forms (`id`, `name`, `email`, `phone`, `service`, `budget`, `message`, `status`, `created_at`).

---

## 📁 5. Codebase Architecture & File Structure
```
/Users/digiworku/Downloads/digiworku/
├── brain.md                              # This master memory reference file
├── supabase_projects_setup.sql           # SQL setup queries for Supabase tables
├── index.html                            # Root HTML with SEO meta, H1/H2/content, JSON-LD schemas
├── vercel.json                           # Vercel: cleanUrls, filesystem routing, 4 security headers
├── vite.config.ts                        # Vite configuration & dev server options
├── server.ts                             # Express server with 4 security headers middleware + API routes
├── public/
│   ├── manifest.json                     # PWA web app manifest
│   ├── robots.txt                        # Disallows /inquiries /projects /clients /analytics /admin /api/
│   ├── sitemap.xml                       # 18 public URLs (no admin routes)
│   └── logo.jpg                          # DigiWorku brand logo
├── scripts/
│   └── prerender.js                      # 18-route static HTML pre-renderer (H2, 200+ words, clean nav)
└── src/
    ├── main.tsx                          # React entry point
    ├── App.tsx                           # Master monolithic React application file
    ├── index.css                         # Tailwind directives & custom CSS animations
    └── components/
        ├── ServiceDetailPage.tsx         # Detailed service detail page & proposal builder
        ├── LegalPages.tsx                # Privacy Policy, Terms of Service, Cancellation Policy
        ├── CaseStudies.tsx               # Case Studies listing + 3 detail layouts (Web App, Design, AI)
        └── ErrorBoundary.tsx             # React error fallback component
```

---

## ⚡ 6. Key Features & Workflows

### 🎨 A. Portfolio Manager
- **Location**: Portfolio tab in Admin & User modes.
- **Media Support**: Full support for both **Images** (PNG, JPG, WEBP) and **Videos** (MP4, MOV, WebM).
- **Direct File Upload**: Interactive Drag & Drop / File Picker box using `FileReader` (reads files as base64 Data URLs with live video player/image preview in modal).
- **URL Fallback**: Allows pasting external image or video URLs.
- **Supabase Sync**: Synchronizes added, updated, or deleted projects to Supabase `projects` table in real-time.

### 📱 B. Mobile Friendliness & Gesture Controls
- **Left Edge Swipe-to-Open Taskbar**: Touch gesture listener on left 30px edge zone allows swiping right to open the mobile sidebar drawer.
- **Responsive Admin Chat Console**: Mobile view toggle switches seamlessly between conversation thread list and active chat view with a top `← Back` button (`ArrowLeft`).
- **Clean UI Spacing**: Mobile padding (`p-3.5 sm:p-6 md:p-8`) prevents content clipping on small phone screens.

### 💬 C. Chat Hub & CRM Support
- **Thread Status Filters**: `New`, `Active`, `Closed`.
- **Auto-Reply Engine**: Configurable 10-second automatic response system with custom editable message templates.
- **Private Admin Notes**: In-thread notes saved directly per client thread.
- **Client Direct Line & Email Integration**: Direct action buttons to copy email or trigger phone dialing.

### 📊 D. Projects Pipeline & CRM (Admin-Only)
- **Views**: Kanban Board & Milestones Timeline views.
- **Health Score & Status Cycle**: Clickable milestone pills (`ON TRACK`, `IN REVIEW`, `STABLE`, `OFF TRACK`).
- **Access**: Gated — non-admin users visiting `/projects` see the "Admin Console Restricted" lock screen.

### 🔐 E. Admin-Gated Routes
These routes are STRICTLY admin-only. Non-authenticated visitors see the "Admin Console Restricted" screen:
- `/projects` — Projects Control Pipeline (Kanban/Milestone board)
- `/inquiries` — Inbound Leads Feed (Supabase inquiries table)
- `/clients` — Corporate Client Directory
- `/analytics` — Analytics Dashboard
- `/chat` — Chat Support Hub
- `/settings` — Platform Settings

### 📋 F. Case Studies (Public)
- **Listing page**: `/case-studies` — filter by All / Web Apps / Design / Video / Branding / AI Automation
- **Detail pages**: `/case-studies/[slug]` — three distinct layouts (Web App, Design/Brand/Video, AI Automation)
- **Data**: `CaseStudies.tsx` → `CASE_STUDIES` array — 1 internal demo (DigiWorku platform) + 2 anonymised placeholders
- **CTA**: All CTAs trigger `handleOpenServiceRequestModal()` (existing inquiry modal)
- **Routing**: Wired in `App.tsx` via `navigateToCaseStudy()` / `navigateToCaseStudyListing()` helpers
- **Sidebar nav**: Added to both user sidebar and admin sidebar in `App.tsx`
- **SEO**: Dynamic meta title/description in `App.tsx` useEffect; `/case-studies` and `/case-studies/digiworku-platform` in `sitemap.xml`
- **URL format**: `digiworku.in/case-studies/[slug]`

---

## 🛠️ 7. Useful Shell Commands & Maintenance
- **Build Verification**: `npm run build`
- **Development Server**: `npm run dev`
- **TypeScript Check**: `npx tsc --noEmit`
- **Database Table Setup**: Execute SQL in `supabase_projects_setup.sql` via Supabase SQL Editor.

---

## 📋 8. SEO Audit Fixes Log (Oct 2026)

| Issue | Status | Fix Location |
|-------|--------|--------------|
| Missing X-Content-Type-Options header | ✅ Fixed | `server.ts` + `vercel.json` |
| Missing X-Frame-Options header | ✅ Fixed | `server.ts` + `vercel.json` |
| Missing Referrer-Policy header | ✅ Fixed | `server.ts` + `vercel.json` |
| Missing Content-Security-Policy header | ✅ Fixed | `server.ts` + `vercel.json` |
| Page title >60 chars (home) | ✅ Fixed | `index.html` — now 50 chars |
| Meta description >155 chars (home) | ✅ Fixed | `index.html` — now 144 chars |
| Title same as H1 (home) | ✅ Fixed | `index.html` — H1 is now distinct |
| H2 missing on all pages | ✅ Fixed | `index.html` (3 H2s) + `prerender.js` (1 H2 per route) |
| Low content pages (<200 words) | ✅ Fixed | `prerender.js` — 160-250 words per page |
| Internal links to robots.txt blocked URLs | ✅ Fixed | `prerender.js` — removed /inquiries & /projects from crawler footer nav |
| /projects and /inquiries as public routes | ✅ Fixed | `App.tsx` — both gated with Admin Console Restricted lock screen |
| /projects in sitemap.xml | ✅ Fixed | `public/sitemap.xml` — removed |
| Vercel serving all routes via single index.html | ✅ Fixed | `vercel.json` — `cleanUrls` + `handle: filesystem` |
| Service detail pages not pre-rendered | ✅ Fixed | `prerender.js` — 4 service detail pages added |
| 404 NOT_FOUND on `/admin` / `/wp-admin` | ✅ Fixed | `vercel.json` — added `redirects` block to `/` |
| Case Studies section missing | ✅ Added | `CaseStudies.tsx` + `App.tsx` routing + `sitemap.xml` |

---

## 🛠️ 9. Full Audit Fixes Log (Oct 2026 — Comprehensive Bug Fix Pass)

| Issue | Severity | Status | Fix Location |
|-------|----------|--------|--------------|
| Invalid AI model name `gemini-3.5-flash` (does not exist) — all AI endpoints 500'd | Critical | ✅ Fixed | `server.ts` (×4) + `api/chat.ts` + `api/flashcards.ts` + `api/mindmap.ts` + `api/compose.ts` — replaced with `gemini-2.0-flash` |
| Offline detection broken — `removeEventListener` called BEFORE `addEventListener` | High | ✅ Fixed | `src/App.tsx` line 799 — removed stray `removeEventListener` call |
| Hindi text in English-only admin panel UI (`"Jab user msg karta hai..."`) | High | ✅ Fixed | `src/App.tsx` line 2165 — translated to English |
| Admin email addresses exposed as login form placeholder hint | High | ✅ Fixed | `src/App.tsx` line 4168 — placeholder changed to neutral `"Enter your admin email address"` |
| Same Hindi phrase in chat endpoint fallback response | High | ✅ Fixed | `server.ts` line 145 + `api/chat.ts` line 42 — removed Hindi fragment |
| `'clients'` tab missing from `tabToPath()` and `pathToTab()` routing functions | Medium | ✅ Fixed | `src/App.tsx` — added `/clients` case to both switch statements |
| SEO meta `useEffect` missing `activeCaseStudySlug` dependency | Medium | ✅ Fixed | `src/App.tsx` line 1087 — added `activeCaseStudySlug` to dependency array |
| Hardcoded fallback admin credentials in source code (`DigiWorku55@`) | High | ✅ Fixed | `server.ts` + `api/admin-login.ts` — hardcoded fallbacks removed; returns 503 if env vars not set |
| `triggerToast` completely disabled — all button/action feedback silently swallowed | Medium | ✅ Fixed | `src/App.tsx` — wired to `setCopiedText()` with 3s auto-clear; all 50+ toast calls now work |
| 2.5s polling for chat (24 API calls/min per session) | Medium | ✅ Fixed | `src/App.tsx` — replaced with Supabase Realtime `postgres_changes` subscription + 10s fallback poll |

> **⚠️ Important:** Admin login now **requires** `ADMIN_EMAILS` and `ADMIN_PASSWORD` to be set as env vars. In local dev, copy `.env.example` to `.env` and fill in values. On Vercel, add them in Project Settings → Environment Variables.

---

## 🏗️ 10. Production-Readiness Fixes (Oct 2026 — Round 3)

| Issue | Severity | Status | Fix Location |
|-------|----------|--------|--------------|
| Admin profile showed hardcoded fake person "Ananya Sharma" with fake email/avatar | High | ✅ Fixed | `src/App.tsx` — profile now shows actual logged-in admin email + dynamic letter avatar |
| Admin email cleared from state immediately after login → profile panel showed empty | High | ✅ Fixed | `src/App.tsx` — email kept in state + persisted to `localStorage('digiworku-admin-email')` |
| Admin logout didn't clear `digiworku-admin-email` from localStorage | Medium | ✅ Fixed | `src/App.tsx` — both header logout button and profile drawer logout now clear it |
| Chat thread "Clear Chat" only emptied messages but thread stayed in list forever | High | ✅ Fixed | `src/App.tsx` — delete now fully removes thread from list using `.filter()`, resets `activeThreadId`, re-fetches from Supabase |
| Hardcoded fake phone number `+91 98765 43210` in thread creation | Medium | ✅ Fixed | `src/App.tsx` — replaced with empty string (no fake data) |

---

## 🛠️ 11. Chat Auto-Reply Removal (Oct 2026)

| Issue | Severity | Status | Fix Location |
|-------|----------|--------|--------------|
| Auto-reply block sent automatic bot message 1.5s after user's first chat message | High | ✅ Fixed | `src/App.tsx` ~line 3017 — entire auto-reply trigger block removed from `sendMessage` function |

---

## 🛠️ 12. Founder Page (Oct 2026)

**Route**: `/founder`  
**Access**: Public — linked from footer alongside legal pages  
**Photo**: `public/founder-vir.jpg` (uploaded by user)

### Page Sections:
1. **Hero** — Full photo, name "Vir", title "Founder & CEO", intro bio, 4 quick stats (Age, Class, Founded, Platform)
2. **Skills & Expertise** — 9 animated skill cards with progress bars: Web Dev, SEO, Business Strategy, UI/UX, AI & Automation, Commerce, Cybersecurity, Digital Marketing, Leadership
3. **The Journey** — Timeline from 2022 → 2026 (first code → DigiWorku founded → platform live → scaling)
4. **Education** — Class XI Commerce with Math, self-taught developer, subjects listed
5. **Founder's Philosophy** — Blockquote CTA card
6. **CTA** — "Start a Project with DigiWorku" button (opens inquiry modal)

### Technical:
- Tab type: `'founder'` added to union in `activeTabState` and `setActiveTab`
- Routing: `tabToPath('founder') → '/founder'`, `pathToTab('/founder') → 'founder'`
- Navigation: `navigateToFounder()` helper function
- SEO meta: `title = 'Vir — Founder & CEO | DigiWorku'`, matching description
- Footer link: "👤 Meet the Founder" added first in footer legal links list
- `vercel.json`: Existing catch-all rewrite handles `/founder` automatically


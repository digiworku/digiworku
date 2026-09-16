# 🧠 DigiWorku Codebase Brain & Memory Reference

> **Important Note for Assistant**: Always inspect this document at the start of tasks to understand the complete application state, schema, credentials, and feature set. Update this file whenever making architectural, structural, or key feature changes.

---

## 🌐 1. Domain & SEO Configuration
- **Official Live Domain**: `https://digiworku.in/`
- **Canonical Domain**: `https://digiworku.in/` (defined in `index.html`, `robots.txt`, `sitemap.xml`)
- **Google Search Console Property**: Must be set to `https://digiworku.in/` (not `.com`).
- **Sitemap File Location**: `public/sitemap.xml`
- **Robots File Location**: `public/robots.txt`

---

## 🔑 2. Administrative Security & Credentials
- **Authorized Admin Emails**:
  1. `digiworku55@gmail.com`
  2. `virkanwlia@gmail.com`
- **Admin Passphrase**: `DigiWorku55@`
- **State Management**:
  - `isAdmin` (boolean): `localStorage.getItem('digiworku-is-admin') === 'true'`
  - `panelMode` ('user' | 'admin'): `localStorage.getItem('digiworku-panel-mode')`
- **Admin Routes**: Domain paths ending with `/admin` or `#admin` trigger automatic redirection to the secure Admin console node.

---

## 🗄️ 3. Supabase Database Integration
- **Supabase Project Endpoint**: `https://rjxbdjgagizjmjwnlbxx.supabase.co`
- **Primary SQL Schema File**: [supabase_projects_setup.sql](file:///Users/digiworku/Downloads/digiworku/supabase_projects_setup.sql)
- **Database Tables**:
  - `projects`: Portfolio projects (`id`, `title`, `description`, `category`, `tags`, `image_url`, `video_url`, `media_type`, `client_name`, `impact_result`, `created_at`).
  - `messages`: Real-time chat messages between client sessions and admin console (`id`, `user_id`, `text`, `role`, `created_at`).
  - `inquiries`: Lead inquiry forms (`id`, `name`, `email`, `phone`, `service`, `budget`, `message`, `status`, `created_at`).

---

## 📁 4. Codebase Architecture & File Structure
```
/Users/digiworku/Downloads/digiworku/
├── brain.md                              # This master memory reference file
├── supabase_projects_setup.sql           # SQL setup queries for Supabase tables
├── index.html                            # Root HTML template with metadata & fonts
├── vite.config.ts                        # Vite configuration & dev server options
├── public/
│   ├── manifest.json                     # PWA web app manifest
│   ├── robots.txt                        # Search engine crawler instructions
│   ├── sitemap.xml                       # XML sitemap for SEO indexing
│   └── logo.jpg                          # DigiWorku brand logo
└── src/
    ├── main.tsx                          # React entry point
    ├── App.tsx                           # Master monolithic React application file
    ├── index.css                         # Tailwind directives & custom CSS animations
    └── components/
        ├── ServiceDetailPage.tsx         # Detailed service detail page & proposal builder
        ├── LegalPages.tsx                # Privacy Policy, Terms of Service, Cancellation Policy
        └── ErrorBoundary.tsx             # React error fallback component
```

---

## ⚡ 5. Key Features & Workflows

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

### 📊 D. Projects Pipeline & CRM
- **Views**: Kanban Board & Milestones Timeline views.
- **Health Score & Status Cycle**: Clickable milestone pills (`ON TRACK`, `IN REVIEW`, `STABLE`, `OFF TRACK`).

---

## 🛠️ 6. Useful Shell Commands & Maintenance
- **Build Verification**: `npm run build`
- **Development Server**: `npm run dev`
- **Database Table Setup**: Execute SQL in `supabase_projects_setup.sql` via Supabase SQL Editor.

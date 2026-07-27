# Product Requirements Document (PRD)
## Mohamed Ghanem — AI Engineer Portfolio & Interactive Platform

---

## 1. Document Overview
* **Product Name:** Mohamed Ghanem AI Engineer Portfolio & Interactive AI Platform
* **Owner:** Mohamed Ghanem (AI & Machine Learning Engineer)
* **Status:** Live / Active Development
* **Version:** 2.0.0
* **Target Audience:** Tech Recruiters, Engineering Managers, AI Researchers, Potential Clients & Global Collaborators

---

## 2. Product Vision & Goals

### 2.1 Vision
To create a world-class, hyper-interactive portfolio web application that demonstrates Mohamed Ghanem's technical authority in AI, Machine Learning, Deep Learning, Computer Vision, and Software Engineering. The portfolio combines cutting-edge visual design, fluid animations, dynamic content management, and a custom AI chatbot that interacts with visitors in natural Egyptian Arabic and English.

### 2.2 Core Objectives
1. **Showcase Expertise & Projects:** Present machine learning and software engineering projects with interactive cards and live/code links.
2. **Interactive AI Representation:** Provide a 24/7 AI Assistant trained on Mohamed's background to answer technical and professional inquiries.
3. **Dynamic Content Management:** Enable seamless CRUD operations for projects and live text updates through an authenticated Admin Dashboard (`/mag`).
4. **Search Engine Supremacy (SEO):** Optimize metadata, JSON-LD schemas, and sitemaps so searching "Mohamed Ghanem" ranks the site at the top of Google.
5. **High Performance & Security:** Maintain sub-60fps smooth scrolling, optimized media streaming, strict Supabase Row Level Security (RLS), and zero exposed credentials.

---

## 3. Technology Stack & Architecture

### 3.1 Frontend Stack
* **Framework:** React 19 (TypeScript)
* **Build Tool:** Vite 8.x
* **Styling:** Tailwind CSS 4.x, PostCSS, Autoprefixer
* **Animations:** Framer Motion 12.x
* **Smooth Scrolling:** Lenis 1.3.x
* **Icons:** Lucide React
* **Routing:** React Router DOM 7.x

### 3.2 Backend & Infrastructure Stack
* **Backend as a Service (BaaS):** Supabase (PostgreSQL Database)
* **Authentication:** Supabase Auth (Email & Password with Session Tokens)
* **Object Storage:** Supabase Storage (`project-images` bucket with image transformation API)
* **Serverless Compute:** Supabase Edge Functions (Deno Runtime)
* **AI Engine:** Google Gemini API (with automated multi-model fallback streaming)
* **Hosting & Deployment:** Vercel (Auto-deploy from GitHub `main` branch)

---

## 4. Feature Specifications

### 4.1 Visual Experience & UI/UX
* **Preloader & Custom Cursor:** Custom animated preloader with progress tracking and custom interactive ring cursor.
* **Hero Section:** High-impact typography, animated dynamic text role rotation, and direct call-to-action buttons.
* **Smooth Stacking Project Cards:** Interactive smooth-scroll card gallery utilizing GPU-accelerated CSS transforms (`y` translate) and scale transformations.
* **Flip Card Description View:** Visitors can toggle between the project showcase media and detailed descriptions.
* **Responsive Sizing:** Custom button widths (`w-[150px] sm:w-[180px]`) and no-wrap text rules to ensure consistent aesthetics across mobile, tablet, and desktop viewports.

### 4.2 Interactive AI Assistant (`AIChatWidget`)
* **Persona & Identity:** Smart, witty, and friendly AI assistant speaking authentic Egyptian Arabic or professional English.
* **Streaming Responses:** Server-Sent Events (SSE) typewriter streaming for instant user feedback.
* **Dynamic Knowledge Injection:** The Edge Function dynamically fetches live project data from the PostgreSQL database before generating responses.
* **Model Fallback Array:** Automatically fails over between Gemini models (`gemini-flash-lite-latest`, `gemini-flash-latest`, `gemini-2.0-flash`) in case of rate limits (429/503).
* **Buffer Safety:** Implements post-loop stream buffer decoding so zero sentence endings are truncated.

### 4.3 Admin Dashboard (`/mag`)
* **Access Control:** Authenticated route protected by Supabase Auth and restricted `robots.txt` indexing (`Disallow: /mag`).
* **Projects Manager:** Full CRUD (Create, Read, Update, Delete) interface for portfolio projects with direct image uploads to Supabase Storage.
* **Content Manager:** Live inline editor for website copy (Hero titles, About paragraphs, Footer content) without requiring code deployments.
* **Sanitized Feedback:** Displays clean error states to the admin while logging full technical tracebacks to developer logs.

### 4.4 Search Engine Optimization (SEO) & Knowledge Graph
* **Canonical & Meta Tags:** Primary meta tags, OpenGraph (OG) tags, and Twitter Cards tuned for `mohamedghanem-ai.vercel.app`.
* **Google Search Console Integration:** HTML verification file and `<meta name="google-site-verification">` integration.
* **XML Sitemap:** Dynamic `sitemap.xml` with Google Images extensions.
* **Structured Data (JSON-LD):** Dual `Person` and `WebSite` schemas linking social accounts (LinkedIn, GitHub, YouTube, Facebook, Instagram, TikTok) to establish Google Knowledge Graph panel authority.

---

## 5. Security & Risk Management

### 5.1 Security Controls Implemented
* **Zero Hardcoded Secrets:** All API keys managed via environment variables and Supabase Secrets.
* **Strict Row Level Security (RLS):** Database policies restricted to authorized admin credentials.
* **Edge Function Input Validation:** Strict payload validation enforcing maximum message count (30) and character limits (2000 chars/msg).
* **Dynamic CORS:** Restricts Edge Function invocations to whitelisted origins (`mohamedghanem-ai.vercel.app`, `localhost`).
* **URL Sanitization:** Validates `href` links using `isSafeUrl()` helper to prevent `javascript:` XSS and open redirect attacks.
* **Security Headers:** Enforces `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` in `vite.config.ts`.

---

## 6. Non-Functional Requirements (NFRs)

* **Performance:** Lighthouse Performance score > 90. Project images optimized on-the-fly via Supabase Image Transformation (`?width=1200&quality=85`).
* **Availability:** 99.9% uptime provided by Vercel Edge Network and Supabase Infrastructure.
* **Maintainability:** Modular component structure with strict TypeScript interfaces.

---

## 7. Future Roadmap & Enhancements

1. **AI Chat Analytics:** Admin telemetry dashboard tracking popular visitor questions and AI interactions.
2. **Blog / Technical Articles:** Dynamic markdown blog section for sharing AI research and computer vision tutorials.
3. **Interactive 3D Demos:** WebGL / Three.js interactive machine learning model visualization node graph.

---
*Document maintained by Mohamed Ghanem — AI Engineer*

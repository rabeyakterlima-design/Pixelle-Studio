# Pixelle Studio — Digital Products E-Commerce Platform

> **"Digital Products for Creative Minds"**
> A modern, secure, and responsive full-stack digital product e-commerce application built for Bangladesh (BDT currency) with React, TypeScript, Vite, Tailwind CSS, and Supabase PostgreSQL.

---

## Brand Identity & Design System

- **Brand Name:** Pixelle Studio
- **Tagline:** Digital Products for Creative Minds
- **Primary Currency:** Bangladeshi Taka (BDT, `৳`)
- **Color Palette:**
  - **Cobalt Blue (`#4169E1`):** Primary accent, interactive buttons, badges, links
  - **Dark Navy (`#17294B`):** Headers, footers, dark backgrounds, high-contrast headings
  - **Light Grey (`#F3F6FB`):** Page surface background
  - **Border Grey (`#DCE3EF`):** Subtle borders and card dividers
  - **Main Text (`#24324A`):** Body typography
  - **Secondary Text (`#68758B`):** Meta descriptions and subtitles
- **Official Brand Logo:** Integrated directly from customer brand assets into `/public/logo.png`.

---

## Key Features & Architecture

### 1. Storefront & Customer Experience
- **Hero Carousel:** Dynamic, admin-configurable banners with title, subtitle, CTA destination, previous/next controls, and auto-rotation.
- **Shop by Category:** Canva Templates, Social Media Designs, Planners & Journals, Ebooks, Graphics & Illustrations, Digital Papers, and Others.
- **Variable Product Selector:** Dynamic attribute matrix generator (Size, Format, License, Colour) that recalculates price, SKU, stock status, and variations on the fly.
- **Slide-out Cart Drawer & Full Cart Page:** Quantity adjustments, subtotal recalculation, item removal, coupon code verification (e.g., `PIXELLE10`).
- **Validated Checkout:**
  - Bangladeshi mobile number format verification (`017...`, `018...`, `019...`, etc.).
  - Honeypot anti-bot protection.
  - Idempotency key to block duplicate rapid submissions.
  - Duplicate Transaction ID (`TrxID`) detection.
- **Manual Mobile Payments (bKash, Nagad, Rocket):**
  - Displays admin-configured receiving numbers and instructions.
  - Collects sender number and TrxID for admin verification.
- **Customer Account & Instant Downloads:**
  - Secure digital downloads dashboard for paid orders with file entitlement keys.
  - Order history tracking and invoice views (`/account/orders/:id`).

### 2. Comprehensive Admin Portal (`/admin`)
- **Dashboard:** Real-time KPI counters (Users, Orders, Revenue in BDT, Products), sales trend SVG chart, and recent order queue.
- **Product Management:** Create simple and variable digital products, multi-image upload, SEO meta, instant download file attachments, regular/sale pricing.
- **Category Management:** Create, reorder, and edit categories. Built-in protection prevents deleting categories with existing products.
- **Attributes & Variations:** Manage Size, Colour, Format, and License attributes.
- **Inventory & Stock Movements:** In-stock, low-stock, and out-of-stock tracking; unlimited digital stock policy; stock movement audit history.
- **Payment Verification Queue:** Review pending bKash, Nagad, and Rocket payments. One-click "Approve" (unlocks customer digital download files) or "Reject" (with custom audit notes).
- **Site Settings:** Edit store announcement, phone, email, Chittagong business address, social links (FB, IG, YT, X), and bKash/Nagad/Rocket receiving numbers without code edits.
- **Security & Audit Logs:** View immutable timestamped audit logs for administrative operations.

---

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v3
- **Icons:** Lucide React & Custom Brand SVGs
- **Router:** React Router v7 (`react-router-dom`)
- **Backend & Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Data Engine:** Hybrid dual-mode (connects directly to Supabase when credentials exist in `.env`, or provides reactive local persistence with rich initial seed data for offline / preview testing).

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+ or v11+)

### 2. Installation
```bash
cd pixelle-studio
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Running Automated Tests
```bash
npm test
```
Runs 9 comprehensive unit & integration tests validating:
- Price validation (`sale_price < regular_price`)
- Product creation & editing
- Category safe-delete constraints
- Bangladeshi phone number validation
- Checkout idempotency
- Payment verification approval/rejection
- Digital download entitlement authorization
- Inventory logging
- Audit log persistence

### 5. Production Build
```bash
npm run build
```
Generates production-optimized artifacts in the `dist/` directory.

---

## Supabase Configuration & Migrations

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Note your **Project URL** and **Anon Key** from `Project Settings -> API`.

### Step 2: Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Run SQL Migrations
In your Supabase Dashboard, navigate to the **SQL Editor** and run the migration scripts located in:
1. `supabase/migrations/20261026000001_initial_schema.sql` (Creates 17 normalized tables, constraints, indexes, RLS policies, and admin functions).
2. `supabase/migrations/20261026000002_seed_data.sql` (Seeds default store settings, homepage slides, categories, and initial product catalog).

### Step 4: Storage Buckets Setup
In the Supabase Storage dashboard, create the following buckets:
- `product-images` (Public bucket)
- `digital-downloads` (Private bucket, authenticated download access)
- `payment-proofs` (Private bucket)

### Step 5: Initialize First Administrator Account
1. Register a new user through the `/register` storefront page with your admin email (e.g., `admin@pixellestudio.com`).
2. Run the secure bootstrap function in Supabase SQL Editor:
```sql
SELECT public.make_user_admin('admin@pixellestudio.com');
```

---

## Quick Testing Credentials (Local Engine)

In local preview mode, you can immediately test the application using the top demo switcher bar or logging in with:
- **Admin Account:** `admin@pixellestudio.com` (password: any value) -> Full `/admin` dashboard access.
- **Customer Account:** `customer@pixellestudio.com` (password: any value) -> Customer orders & downloads access.

---

## Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub.
2. In Vercel, import the repository.
3. Configure the build settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

### Deploy to Netlify
1. Create a `_redirects` file in `public/` containing:
   ```
   /*    /index.html   200
   ```
2. In Netlify, connect your Git repository.
3. Set build command to `npm run build` and publish directory to `dist`.
4. Add your Supabase environment variables in Netlify site settings.

---

## Security Best Practices
- Supabase Row Level Security (RLS) is enabled on all tables.
- Private digital download URLs are generated on demand for verified paid orders.
- Service role keys are never exposed on the client.
- Sensitive customer data and audit logs are restricted to authenticated administrators.

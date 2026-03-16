# Jewelry E-commerce Platform Design Specification

**Date:** 2026-03-16
**Project:** Rare Carat-inspired jewelry e-commerce platform
**Target Market:** Global/English-speaking market
**Status:** Approved

---

## Overview

A complete jewelry e-commerce platform focused on diamonds and fine jewelry, targeting the global English-speaking market. The platform will feature self-managed inventory, standard e-commerce functionality (product browsing, filtering, cart, checkout), with AI features planned for phase 2.

---

## Technical Architecture

### Technology Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS + shadcn/ui
- **CMS:** Sanity (product and content management)
- **Database:** Supabase (PostgreSQL) for users, orders, and cart data
- **Payment:** Stripe (checkout, payment intents, webhooks)
- **Authentication:** NextAuth.js (email/password + Google OAuth)
- **Deployment:** Vercel (frontend) + Sanity Cloud + Supabase Cloud

### Core Page Structure

```
/                   Homepage (hero + featured products + category navigation)
/shop               Product listing (filterable by shape, carat, price, material)
/shop/[slug]        Product detail page
/cart               Shopping cart
/checkout           Checkout flow (Stripe)
/account            User account (order history, wishlist)
/admin              Sanity Studio (product management backend)
```

### Data Flow

1. Product data stored in Sanity, queried via GROQ and displayed on frontend
2. Orders written to Supabase upon checkout, payment status updated via Stripe webhooks
3. User authentication handled by NextAuth, sessions stored in Supabase

---

## Data Models

### Sanity Schema (Product Content)

**Product**
- `name`: string
- `slug`: slug (unique identifier)
- `category`: reference to Category
- `price`: number
- `images`: image[] (multiple product images)
- `description`: text (rich text)
- `specs`: object
  - `carat`: number (diamond weight)
  - `cut`: string (cut quality)
  - `color`: string (color grade)
  - `clarity`: string (clarity grade)
  - `shape`: string (round, oval, cushion, emerald, etc.)
  - `material`: string (18K gold, platinum, etc.)
- `stock`: number (inventory count)
- `featured`: boolean (display on homepage)

**Category**
- `name`: string
- `slug`: slug
- `image`: image

### Supabase Tables (Transactional Data)

**users**
- `id`: uuid (primary key)
- `email`: string
- `name`: string
- `created_at`: timestamp

**orders**
- `id`: uuid (primary key)
- `user_id`: uuid (foreign key to users)
- `status`: enum (pending, paid, shipped, completed, failed)
- `total`: decimal
- `stripe_payment_intent_id`: string
- `shipping_address`: jsonb
- `created_at`: timestamp

**order_items**
- `id`: uuid (primary key)
- `order_id`: uuid (foreign key to orders)
- `product_id`: string (Sanity product slug)
- `quantity`: integer
- `price_at_purchase`: decimal

**wishlists**
- `id`: uuid (primary key)
- `user_id`: uuid (foreign key to users)
- `product_id`: string (Sanity product slug)
- `created_at`: timestamp

---

## Core Features & User Flows

### Product Browsing & Filtering

- **Homepage:** Display featured products (where `featured: true`) and category navigation
- **Shop Page (/shop):** Multi-dimensional filtering
  - Shape (round, oval, princess, cushion, emerald, etc.)
  - Carat range (slider)
  - Price range (slider)
  - Material (18K gold, platinum, etc.)
- Filters implemented via URL query parameters for shareable links
- Server-side filtering using Sanity GROQ queries for performance and SEO
- Responsive grid layout with product cards showing image, name, price

### Shopping Cart & Checkout

**Cart Management:**
- Unauthenticated users: cart stored in localStorage
- Authenticated users: cart synced to Supabase for cross-device access
- Cart displays product thumbnail, name, price, quantity controls, subtotal

**Checkout Flow:**
1. Cart page → Review items
2. Checkout page → Enter shipping address (authenticated users can save addresses)
3. Stripe Checkout Session → Hosted payment page (secure, PCI-compliant)
4. Order confirmation page → Display order number and details

**Payment Processing:**
- Use Stripe Checkout Session mode (hosted payment page)
- Support credit/debit cards
- Stripe webhooks handle payment status updates

### User Account

**Authentication:**
- NextAuth.js with multiple providers:
  - Email/password (credentials provider)
  - Google OAuth
- Session management via Supabase

**Account Features (/account):**
- Order history with status tracking
- Wishlist/favorites
- Saved shipping addresses
- Profile management

**Order Status Flow:**
- `pending` → Order created, awaiting payment
- `paid` → Payment successful
- `shipped` → Order dispatched
- `completed` → Order delivered
- `failed` → Payment failed

### Product Management Backend

**Sanity Studio (/admin):**
- Deployed as part of Next.js app at `/admin` route
- Non-technical staff can manage products:
  - Upload product images (drag-and-drop)
  - Edit descriptions (rich text editor)
  - Update inventory counts
  - Set featured products
- Draft/preview functionality for reviewing changes before publishing
- Role-based access control (admin vs editor)

---

## Error Handling & Edge Cases

### Inventory Management

- Product detail page checks `stock` field in real-time from Sanity
- When `stock = 0`: display "Out of Stock" badge, disable "Add to Cart" button
- At checkout: re-validate stock availability to prevent overselling (race condition protection)
- After successful payment: Stripe webhook triggers inventory decrement via Sanity API mutation

### Payment Failure Handling

- Stripe webhook listens for `payment_intent.failed` event
- Order status updated to `failed` in Supabase
- Email notification sent to user with retry instructions
- User can retry payment from `/account` order details page

### Network & Loading States

- All async operations display loading indicators (Tailwind skeleton screens)
- API call failures show user-friendly error messages with retry buttons
- Use Next.js `error.tsx` and `loading.tsx` for page-level error/loading states
- Implement error boundaries for component-level failures

### SEO & Performance

- Product pages use `generateMetadata` for dynamic meta tags (title, description, Open Graph)
- Images optimized with Next.js `Image` component (lazy loading, WebP format, responsive sizes)
- Product listing pages use ISR (Incremental Static Regeneration) with `revalidate: 60` seconds
- Implement proper canonical URLs and structured data (JSON-LD) for products

---

## Testing Strategy

### Unit Tests

- **Framework:** Vitest
- **Coverage:**
  - Utility functions (price formatting, currency conversion)
  - Filter logic (query parameter parsing, GROQ query builders)
  - Data transformation functions (Sanity → frontend format)

### Integration Tests

- **Framework:** Playwright
- **Critical User Flows:**
  - Browse products → Add to cart → Checkout (using Stripe test mode)
  - User registration and login flow
  - Filter functionality (verify correct products displayed)
  - Wishlist add/remove
  - Order history display

### Manual Testing Checklist

- Stripe webhook testing using Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
- Responsive layout verification on mobile, tablet, desktop
- Out-of-stock product UI behavior
- Payment success/failure email notifications
- Cross-browser compatibility (Chrome, Safari, Firefox)

### Pre-Deployment Checklist

- Environment variables configured correctly:
  - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
  - `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- Stripe webhook endpoint configured in Stripe Dashboard for production domain
- Sanity CORS settings allow production domain
- Supabase RLS (Row Level Security) policies configured
- SSL certificate active on production domain

---

## Future Enhancements (Phase 2)

- AI price scoring and recommendations (similar to Rare Carat)
- AI chatbot for customer support
- Virtual try-on features
- Advanced search with natural language queries
- Personalized product recommendations based on browsing history
- Multi-currency support
- International shipping calculations

---

## Success Criteria

- Users can browse and filter products smoothly
- Checkout process completes successfully with Stripe
- Inventory accurately reflects stock levels
- Order status updates correctly via webhooks
- Admin staff can manage products without developer assistance
- Site loads quickly (Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Mobile-responsive design works across devices

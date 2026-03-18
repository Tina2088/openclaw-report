# Jewelry E-commerce Platform Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete jewelry e-commerce platform with product browsing, filtering, cart, checkout, and admin management.

**Architecture:** Next.js 15 App Router frontend with Sanity CMS for product management, Supabase for transactional data (users, orders, cart), Stripe for payments, and NextAuth for authentication. Server-side rendering for SEO, client components for interactivity.

**Tech Stack:** Next.js 15, Tailwind CSS, shadcn/ui, Sanity CMS, Supabase, Stripe, NextAuth.js

---

## Chunk 1: Project Setup & Foundation

### File Structure Overview

```
tinaproject/
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Homepage
│   ├── shop/
│   │   ├── page.tsx                  # Product listing
│   │   └── [slug]/page.tsx           # Product detail
│   ├── cart/page.tsx                 # Shopping cart
│   ├── checkout/page.tsx             # Checkout flow
│   ├── account/page.tsx              # User account
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth config
│   │   ├── cart/route.ts             # Cart sync API
│   │   └── webhooks/stripe/route.ts  # Stripe webhook handler
│   └── admin/[[...index]]/page.tsx   # Sanity Studio
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── product-card.tsx              # Product display card
│   ├── product-filters.tsx           # Filter controls
│   ├── cart-item.tsx                 # Cart line item
│   └── header.tsx                    # Site header with nav
├── lib/
│   ├── sanity/
│   │   ├── client.ts                 # Sanity client config
│   │   └── queries.ts                # GROQ queries
│   ├── supabase/
│   │   ├── client.ts                 # Supabase client
│   │   └── server.ts                 # Server-side Supabase client
│   ├── stripe/
│   │   ├── client.ts                 # Stripe client config
│   │   └── webhooks.ts               # Webhook signature verification
│   ├── auth.ts                       # NextAuth config
│   └── utils.ts                      # Utility functions
├── sanity/
│   ├── schema.ts                     # Sanity schema definitions
│   └── schemas/
│       ├── product.ts                # Product schema
│       └── category.ts               # Category schema
├── types/
│   ├── product.ts                    # Product types
│   ├── order.ts                      # Order types
│   ├── user.ts                       # User types
│   └── index.ts                      # Re-exports
└── tests/
    └── e2e/
        └── checkout.spec.ts          # Playwright E2E tests
```

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `.env.local`

- [ ] **Step 1: Create Next.js app**

Note: The project directory already contains files (.gitignore, .claude/, report/). The create-next-app command will prompt about existing files — answer Yes to proceed and overwrite where needed. Existing files (report/, .claude/) will not be touched.

```bash
cd /Users/tina/Downloads/tinaproject
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Expected: Next.js 15 project initialized with TypeScript and Tailwind. Prompts about existing files — accept all.

- [ ] **Step 2: Install core dependencies**

```bash
npm install @sanity/client @sanity/image-url next-sanity
npm install @supabase/supabase-js @supabase/ssr
npm install stripe @stripe/stripe-js
npm install next-auth@beta
npm install zod
npm install -D @types/node
```

Expected: All packages installed successfully

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init -d
```

When prompted:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Expected: shadcn/ui configured with components/ui directory

- [ ] **Step 4: Install shadcn components**

```bash
npx shadcn@latest add button card input label select slider badge skeleton
```

Expected: UI components added to components/ui/

- [ ] **Step 5: Create environment variables file**

Create `.env.local`:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

- [ ] **Step 6: Update .gitignore**

Add to `.gitignore`:

```
.env.local
.env*.local
.vercel
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with dependencies"
```

---

### Task 2: Setup Sanity CMS

**Files:**
- Create: `sanity.config.ts`
- Create: `sanity/schema.ts`
- Create: `sanity/schemas/product.ts`
- Create: `sanity/schemas/category.ts`
- Create: `lib/sanity/client.ts`
- Create: `lib/sanity/queries.ts`

- [ ] **Step 1: Install Sanity dependencies**

```bash
npm install sanity @sanity/vision
npm install -D @sanity/types
```

Expected: Sanity packages installed

- [ ] **Step 2: Initialize Sanity**

```bash
npx sanity@latest init --project-id <your_project_id> --dataset production
```

When prompted:
- Use existing project: Yes
- Project output path: ./sanity

Expected: Sanity configuration created

- [ ] **Step 3: Create Sanity config**

Create `sanity.config.ts`:

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schema'

export default defineConfig({
  name: 'default',
  title: 'Jewelry E-commerce',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/admin',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
```

- [ ] **Step 4: Create product schema**

Create `sanity/schemas/product.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'object',
      fields: [
        { name: 'carat', title: 'Carat', type: 'number' },
        { name: 'cut', title: 'Cut', type: 'string' },
        { name: 'color', title: 'Color', type: 'string' },
        { name: 'clarity', title: 'Clarity', type: 'string' },
        {
          name: 'shape',
          title: 'Shape',
          type: 'string',
          options: {
            list: [
              { title: 'Round', value: 'round' },
              { title: 'Oval', value: 'oval' },
              { title: 'Cushion', value: 'cushion' },
              { title: 'Emerald', value: 'emerald' },
              { title: 'Princess', value: 'princess' },
              { title: 'Pear', value: 'pear' },
            ],
          },
        },
        { name: 'material', title: 'Material', type: 'string' },
      ],
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
```

- [ ] **Step 5: Create category schema**

Create `sanity/schemas/category.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
})
```

- [ ] **Step 6: Create schema index**

Create `sanity/schema.ts`:

```typescript
import { product } from './schemas/product'
import { category } from './schemas/category'

export const schemaTypes = [product, category]
```

- [ ] **Step 7: Create Sanity client**

Create `lib/sanity/client.ts`:

```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
```

- [ ] **Step 8: Create Sanity utilities and queries**

Create `lib/sanity/queries.ts`:

```typescript
import { client } from './client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export const queries = {
  allProducts: `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    price,
    "image": images[0],
    stock,
    featured,
    specs
  }`,

  featuredProducts: `*[_type == "product" && featured == true] | order(_createdAt desc) [0...6] {
    _id,
    name,
    slug,
    price,
    "image": images[0],
    stock
  }`,

  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    price,
    images,
    description,
    specs,
    stock,
    category->{name, slug}
  }`,

  allCategories: `*[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    image
  }`,
}
```

- [ ] **Step 9: Create Sanity Studio page**

Create `app/admin/[[...index]]/page.tsx`:

```typescript
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function AdminPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 10: Test Sanity Studio**

```bash
npm run dev
```

Navigate to http://localhost:3000/admin

Expected: Sanity Studio loads, can create products and categories

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: setup Sanity CMS with product and category schemas"
```

---

### Task 3: Setup Supabase Database

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `types/product.ts`
- Create: `types/order.ts`
- Create: `types/user.ts`
- Create: `types/index.ts`

- [ ] **Step 1: Create Supabase browser client**

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create Supabase server client**

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}
```

- [ ] **Step 3: Create product types**

Create `types/product.ts`:

```typescript
export type ProductImage = {
  asset: {
    _ref: string
    _type: string
  }
}

export type ProductSpecs = {
  carat?: number
  cut?: string
  color?: string
  clarity?: string
  shape?: string
  material?: string
}

export type Product = {
  _id: string
  name: string
  slug: { current: string }
  price: number
  images: ProductImage[]
  image?: ProductImage
  description?: string
  specs?: ProductSpecs
  stock: number
  featured?: boolean
  category?: {
    name: string
    slug: { current: string }
  }
}

export type Category = {
  _id: string
  name: string
  slug: { current: string }
  image?: ProductImage
}
```

- [ ] **Step 4: Create order types**

Create `types/order.ts`:

```typescript
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'failed'

export type ShippingAddress = {
  street: string
  city: string
  state: string
  postal_code: string
  country: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
}

export type Order = {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  stripe_payment_intent_id: string | null
  shipping_address: ShippingAddress
  created_at: string
  order_items?: OrderItem[]
}

export type CartItem = {
  product_id: string
  name: string
  price: number
  image?: string
  quantity: number
  slug: string
}
```

- [ ] **Step 5: Create user types**

Create `types/user.ts`:

```typescript
export type User = {
  id: string
  email: string
  name: string | null
  created_at: string
}
```

- [ ] **Step 6: Create types index**

Create `types/index.ts`:

```typescript
export * from './product'
export * from './order'
export * from './user'
```

- [ ] **Step 7: Create migration SQL**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'failed')) DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id TEXT,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Create wishlists table
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for wishlists
CREATE POLICY "Users can view own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist" ON wishlists
  FOR ALL USING (auth.uid() = user_id);
```

- [ ] **Step 8: Apply migration**

Go to Supabase Dashboard → SQL Editor → Paste the migration SQL → Run

Expected: Tables created successfully with RLS policies

- [ ] **Step 9: Verify tables**

In Supabase Dashboard → Table Editor, verify:
- users table exists
- orders table exists
- order_items table exists
- wishlists table exists

Expected: All tables visible with correct columns

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: setup Supabase database schema with RLS policies"
```

---

## Chunk 2: Authentication, Stripe & Core Utilities

### Task 4: Setup NextAuth Authentication

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create NextAuth config**

Create `lib/auth.ts`:

```typescript
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { createAdminClient } from '@/lib/supabase/server'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const supabase = createAdminClient()
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        })
        if (error || !data.user) return null
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
```

- [ ] **Step 2: Create NextAuth route**

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

- [ ] **Step 3: Create login page**

Create `app/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-semibold mb-6">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Test auth endpoints**

```bash
npm run dev
```

Navigate to http://localhost:3000/api/auth/providers

Expected: JSON response listing configured providers (google, credentials)

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: setup NextAuth with Google and credentials providers"
```

---

### Task 5: Setup Stripe Client

**Files:**
- Create: `lib/stripe/client.ts`
- Create: `lib/stripe/webhooks.ts`

- [ ] **Step 1: Create Stripe server client**

Create `lib/stripe/client.ts`:

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})
```

- [ ] **Step 2: Create webhook utilities**

Create `lib/stripe/webhooks.ts`:

```typescript
import Stripe from 'stripe'
import { stripe } from './client'

export async function constructWebhookEvent(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: setup Stripe client and webhook utilities"
```

---

### Task 6: Create Utility Functions

**Files:**
- Create: `lib/utils.ts` (extends auto-generated shadcn file)

- [ ] **Step 1: Add utility functions to lib/utils.ts**

Open `lib/utils.ts` (created by shadcn init) and add:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function parseFilterParams(searchParams: URLSearchParams) {
  return {
    shape: searchParams.get('shape') ?? '',
    caratMin: Number(searchParams.get('caratMin') ?? 0),
    caratMax: Number(searchParams.get('caratMax') ?? 20),
    priceMin: Number(searchParams.get('priceMin') ?? 0),
    priceMax: Number(searchParams.get('priceMax') ?? 100000),
    material: searchParams.get('material') ?? '',
  }
}

export function buildProductFilterQuery(filters: ReturnType<typeof parseFilterParams>): string {
  const conditions = ['_type == "product"']
  if (filters.shape) conditions.push(`specs.shape == "${filters.shape}"`)
  if (filters.material) conditions.push(`specs.material match "${filters.material}*"`)
  if (filters.caratMin > 0) conditions.push(`specs.carat >= ${filters.caratMin}`)
  if (filters.caratMax < 20) conditions.push(`specs.carat <= ${filters.caratMax}`)
  if (filters.priceMin > 0) conditions.push(`price >= ${filters.priceMin}`)
  if (filters.priceMax < 100000) conditions.push(`price <= ${filters.priceMax}`)
  return `*[${conditions.join(' && ')}] | order(_createdAt desc)`
}
```

- [ ] **Step 2: Write unit tests for utils**

Create `tests/unit/utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { formatPrice, parseFilterParams, buildProductFilterQuery } from '@/lib/utils'

describe('formatPrice', () => {
  it('formats whole dollar amounts', () => {
    expect(formatPrice(5000)).toBe('$5,000')
  })
  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0')
  })
  it('rounds decimals', () => {
    expect(formatPrice(1234.99)).toBe('$1,235')
  })
})

describe('parseFilterParams', () => {
  it('returns defaults for empty params', () => {
    const result = parseFilterParams(new URLSearchParams())
    expect(result.shape).toBe('')
    expect(result.caratMin).toBe(0)
    expect(result.priceMax).toBe(100000)
  })
  it('parses provided values', () => {
    const result = parseFilterParams(new URLSearchParams('shape=round&priceMin=1000'))
    expect(result.shape).toBe('round')
    expect(result.priceMin).toBe(1000)
  })
})

describe('buildProductFilterQuery', () => {
  it('returns all products when no filters', () => {
    const filters = parseFilterParams(new URLSearchParams())
    const query = buildProductFilterQuery(filters)
    expect(query).toBe('*[_type == "product"] | order(_createdAt desc)')
  })
  it('includes shape filter when provided', () => {
    const filters = parseFilterParams(new URLSearchParams('shape=round'))
    const query = buildProductFilterQuery(filters)
    expect(query).toContain('specs.shape == "round"')
  })
  it('includes price range when provided', () => {
    const filters = parseFilterParams(new URLSearchParams('priceMin=500&priceMax=5000'))
    const query = buildProductFilterQuery(filters)
    expect(query).toContain('price >= 500')
    expect(query).toContain('price <= 5000')
  })
})
```

- [ ] **Step 3: Install Vitest and run tests**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

Run tests:
```bash
npm test
```

Expected: 8 tests pass (3 for formatPrice, 2 for parseFilterParams, 3 for buildProductFilterQuery)

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add utility functions with unit tests"
```

---


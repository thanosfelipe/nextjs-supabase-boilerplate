# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 13 SaaS boilerplate with Supabase authentication and Stripe payments.

### Tech Stack
- Next.js 13.5 (App Router)
- TypeScript with strict mode
- Tailwind CSS + shadcn/ui components
- Supabase for auth and database
- Stripe for payments/subscriptions

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group (sign-in page)
│   ├── (site)/            # Marketing site route group
│   ├── api/webhooks/      # Stripe webhook handler
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── layout/            # Navbar, Footer
│   └── ui/                # shadcn/ui components
├── hooks/
│   └── useUser.tsx        # User context and subscription state
├── lib/
│   ├── stripe.ts          # Stripe server instance
│   ├── stripeClient.ts    # Stripe client instance
│   ├── supabaseAdmin.ts   # Supabase admin + Stripe sync functions
│   └── utils.ts           # cn() utility for class merging
├── providers/
│   ├── SupabaseProvider   # Supabase session context
│   └── UserProvider       # User details and subscription context
└── sections/              # Landing page sections (Header, Pricing, etc.)
```

### Key Patterns

**Provider Hierarchy** (in `layout.tsx`):
ThemeProvider → SupabaseProvider → UserProvider → children

**User State**: The `useUser()` hook from `@/hooks/useUser` provides:
- `user` - Supabase auth user
- `userDetails` - Profile from `users` table
- `subscription` - Active subscription with nested price/product data
- `isLoading` - Combined loading state

**Stripe-Supabase Sync**: Stripe webhooks (`/api/webhooks/route.ts`) sync products, prices, and subscriptions to Supabase tables via functions in `supabaseAdmin.ts`.

### Database Schema

Tables (defined in `types_db.ts`):
- `users` - User profiles (id references Supabase auth.users)
- `customers` - Maps user IDs to Stripe customer IDs
- `products` - Synced from Stripe
- `prices` - Synced from Stripe, references products
- `subscriptions` - Synced from Stripe, references users and prices

### Path Aliases

Use `@/*` to import from `src/*` (configured in tsconfig.json).

### Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

# Vision Developments

Real estate developer website with an admin panel. Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand (localStorage), Framer Motion, Recharts, Lucide icons. Fully client-side data, no secrets, no environment variables needed.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint
```

Requires Node.js 18.17 or newer.

## Admin panel

- URL: `/admin/login` (open it by typing the address; there is deliberately no link to it anywhere on the public site, and it is not listed in robots.txt)
- Password: `admin123` (hardcoded in `app/admin/login/page.tsx`)
- Login sets a `vision_admin` cookie (checked by `middleware.ts` on the Edge) and a localStorage flag (checked by the admin shell).
- Pages: Dashboard, Projects (list, new, edit), Inquiries, Settings.

Change the password and contact details before going live. Company details (phone, email, address, social links) are edited in Admin > Settings; the defaults live in `lib/store.ts`.

Project images must be hosted on `images.unsplash.com` (enforced in the project form because `next/image` only loads configured hosts). To allow another host, add it to `images.remotePatterns` in `next.config.js` and to `ALLOWED_HOST` handling in `components/admin/ProjectForm.tsx`.

## Folder structure

```
app/
  layout.tsx            root layout, fonts, metadata
  globals.css
  (site)/               public site (navbar + footer)
    page.tsx            home
    projects/page.tsx   listing with tabs and filters
    projects/[slug]/    project detail
    about/  contact/
  admin/                admin panel (own shell, no public navbar)
    login/  projects/{new,edit/[id]}/  inquiries/  settings/
  sitemap.ts  robots.ts  not-found.tsx  error.tsx  loading.tsx
components/             shared UI, home sections, admin components, ui/ primitives
data/projects.json      20 projects
lib/store.ts            Zustand + persist data layer
lib/supabase.ts         commented Supabase template
lib/seed.ts             server-safe access to projects.json (metadata, sitemap)
types/index.ts
middleware.ts           admin route guard (Edge safe)
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New > Project** and import the repository.
3. Framework preset is detected as Next.js. Leave build and output settings at their defaults.
4. (Optional) Add `NEXT_PUBLIC_SITE_URL` with your production domain so the sitemap, robots and Open Graph URLs use it.
5. Click **Deploy**. No other environment variables are required.

## Switching to Supabase

Only `lib/store.ts` changes. Components call the same store methods.

1. `npm install @supabase/supabase-js`
2. Add to `.env.local` and to Vercel environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Uncomment the client in `lib/supabase.ts`.
4. Create tables:
   ```sql
   create table projects (
     id text primary key, slug text unique not null, name text not null,
     category text not null, location text, plot text, road text, sector text,
     area text, city text, description text, featured boolean default false,
     status text, specifications jsonb, image text, gallery jsonb,
     amenities jsonb, coordinates jsonb, floor_plan text,
     created_at timestamptz default now()
   );
   create table inquiries (
     id text primary key, name text, phone text, email text, message text,
     project_name text, status text default 'new', created_at timestamptz default now()
   );
   create table settings (id int primary key default 1, data jsonb);
   ```
5. In `lib/store.ts`, keep the same state shape and method names but replace the bodies: have `addProject`, `updateProject`, `deleteProject`, `addInquiry`, `markInquiryRead`, `deleteInquiry` and `updateSettings` call `supabase.from(...)` (insert, update, delete) and then update local state. Replace the `persist` middleware and seed data with a `load()` action that fetches the three tables, and call it from `components/Hydrator.tsx` instead of `useStore.persist.rehydrate()`. Set `hydrated: true` when the fetch completes.
6. Enable Row Level Security: allow public `select` on `projects`, public `insert` on `inquiries`, and restrict everything else. Replace the hardcoded admin password with Supabase Auth before production, since the current login is a client-side convenience gate.

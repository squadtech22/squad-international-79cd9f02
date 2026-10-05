# Squad International

Marketing site for Squad International — a BPO providing dedicated offshore teams for
customer support, virtual assistance, lead generation and operational delivery.

## Stack

- [TanStack Start](https://tanstack.com/start) (SSR) with file-based routing via TanStack Router
- React 19, TypeScript, Vite
- Tailwind CSS v4 with [shadcn/ui](https://ui.shadcn.com) components
- Nitro for the production server build (Cloudflare by default; the target is
  auto-detected, so a Vercel or Netlify build selects its own preset)

## Languages

- **TypeScript and TSX** for the application, components, routes, and server code
- **JavaScript (ES modules)** for build configuration and Node.js scripts
- **CSS** for global styles and Tailwind theme tokens

## Development

Requires Node.js. npm is the package manager — `package-lock.json` is the source
of truth.

```sh
npm install
npm run dev
```

Available scripts:

| Script | Purpose |
| --- | --- |
| `dev` | Vite dev server |
| `build` | Production build |
| `build:dev` | Production build in development mode |
| `preview` | Serve the production build locally |
| `lint` | ESLint, including Prettier as a rule |
| `format` | Rewrite files with Prettier |

## Content

Nearly all copy lives in [`src/lib/site-data.ts`](src/lib/site-data.ts) — services,
industries, case studies, FAQs, blog posts, stats, testimonials and the shared `site`
object (contact details, social links, Google Business Profile). Pages read from it, so
editing that one file updates the whole site.

## Environment variables

All optional; the site renders correctly without them.

| Variable | Purpose |
| --- | --- |
| `GOOGLE_PLACES_API_KEY` | Places API (New) key. Server-only — never prefix with `VITE_`. |
| `GOOGLE_PLACE_ID` | Place ID for the Google Business Profile. |
| `VITE_ASSET_CDN_BASE` | Overrides the CDN base used to resolve hosted media. |

With the first two set, the homepage reviews section serves live Google reviews; without
them it falls back to the reviews transcribed in `site-data.ts`. See
[`src/lib/google-reviews.ts`](src/lib/google-reviews.ts).

## Project structure

```
src/
  assets/      images and hosted-media descriptors
  components/  shared components; ui/ holds shadcn primitives
  lib/         site content, Google reviews, asset URL resolution, error plumbing
  routes/      file-based routes; __root.tsx holds the shell, head tags and boundaries
  styles.css   design tokens (charcoal / gunmetal / off-white / marigold) and Tailwind theme
```

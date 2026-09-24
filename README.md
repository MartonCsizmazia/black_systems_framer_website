# Black Systems Website

A single-page marketing site built with React, TypeScript and Vite. The layout and scroll animations began as a hand-coded rebuild of the "Fuel" Framer template. Its demo content is being replaced with real content.

## Requirements

- **Node.js 18 or newer** (tested on Node 22.23 / npm 10.9)
- npm (comes with Node)

You don't need any environment variables or `.env` file.

## Getting started

```bash
npm install     # install dependencies (first time, or after package.json changes)
npm run dev     # start the dev server → http://localhost:5173
```

## Commands

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm install`     | Installs dependencies from `package-lock.json`                      |
| `npm run dev`     | Starts the Vite dev server with hot reload on port **5173**         |
| `npm run build`   | Type-checks with `tsc -b`, then builds a production bundle in `dist/` |
| `npm run preview` | Serves the built `dist/` locally to check the production build (port 4173) |

To use a different port for one run: `npm run dev -- --port 3000`
To open the dev server to other devices on your network (e.g. testing on a phone): `npm run dev -- --host`

## Configuration

| File              | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `vite.config.ts`  | Vite config: React plugin, dev server port `5173`                       |
| `tsconfig.json`   | TypeScript: strict mode, ES2020 target, `react-jsx`, bundler module resolution, `noEmit` (Vite does the compiling) |
| `index.html`      | HTML entry point. Sets the page `<title>` and loads `src/main.tsx`      |
| `package.json`    | Dependencies and npm scripts                                            |
| `.gitignore`      | Ignores `node_modules/`, `dist/`, `*.tsbuildinfo`, `.DS_Store`, `.env*` |

## Stack

- **React 18** + **TypeScript**
- **Vite 5**: dev server and bundler
- **framer-motion**: scroll-linked and in-view animations (`useScroll`, `useTransform`, `useSpring`, `whileInView`)
- **lenis**: inertial smooth scrolling (set up in `src/hooks/useLenis.ts`)
- Plain CSS, one file per component, sharing the design tokens in `src/styles/`
- Self-hosted fonts: BDO Grotesk Variable, with Inter as the fallback

## Project structure

```
src/
├── App.tsx          # puts the page together from the sections, in order
├── main.tsx         # React entry point
├── sections/        # page sections: Hero, About, ClientLogos, Portfolio, Services,
│                    #   Pricing, Testimonial, Archive, Stats, Article
├── components/      # reusable parts: Navbar, Button, WorkCard, ServiceCard,
│                    #   PricingCard, StatCard, CtaBanner, TestimonialSlider, ...
├── hooks/           # useLenis (smooth scrolling)
├── styles/          # tokens.css (colors/spacing), typography.css, global.css, breakpoints.ts
└── assets/          # fonts/, images/, video/ (each exported via an index.ts)
```

## Deployment

`npm run build` outputs a fully static site to `dist/`. You can deploy that folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.). There is no client-side routing yet, so the host doesn't need any SPA rewrite rules.

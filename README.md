# Black Systems Website

The marketing site of Black Systems (https://www.blacksystems.ai), in English
and Hungarian. Built with React, TypeScript and Vite; every page is
prerendered to static HTML at build time.

## Requirements

- **Node.js 20.19 or newer** (Vite 7; tested on Node 22)
- Google Chrome, only for `npm run og` and `npm run intro-pdf`

No environment variables or `.env` file are needed.

## Commands

| Command             | What it does |
| ------------------- | ------------ |
| `npm install`       | Installs dependencies from `package-lock.json` |
| `npm run dev`       | Dev server with hot reload (port 5173, or the next free one) |
| `npm run build`     | Type-checks, builds the site and prerenders every page into `dist/` |
| `npm run preview`   | Serves the built `dist/` locally (port 4173) |
| `npm run lint`      | ESLint |
| `npm run og`        | Regenerates the link preview images in `public/og/` (needs the dev server running) |
| `npm run intro-pdf` | Regenerates the intro PDFs in `public/intro/` |

Re-run `npm run og` when the hero or a case study's title or category
changes, and `npm run intro-pdf` when About, Services, the case studies or
the contact details change. Commit the generated files.

## Where things live

```
src/
├── App.tsx            # picks the page for the address (home, case study, legal, 404)
├── main.tsx           # browser entry: hydrates the prerendered HTML
├── entry-server.tsx   # build-time entry used by scripts/prerender.mjs
├── seo.ts             # page titles, descriptions, preview images, site address
├── pages/             # Home, CaseStudy, Legal, NotFound
├── sections/          # home page sections: Hero, About, Services, Contact, ...
├── components/        # shared parts: Navbar, Footer, Button, WorkCard, ...
├── i18n/              # en.json + hu.json (all texts), language switching, /hu addresses
├── data/              # case study list, contact details, company details
├── hooks/             # smooth scrolling (Lenis), Cal.com booking popup, media queries
├── animations/        # the animated squares logo
├── styles/            # design tokens, typography presets, breakpoints
└── assets/            # fonts and images (images are listed in assets/images/index.ts)
scripts/
├── prerender.mjs      # writes every page in every language, the sitemap and robots.txt
├── og-images.mjs      # link preview images
└── intro-pdf.mjs      # intro slide decks (fonts in scripts/fonts/)
```

All texts are in `src/i18n/en.json` and `src/i18n/hu.json`; both files must
have the same keys (a missing one is a type error). English pages live at
`/...`, Hungarian ones at `/hu/...`.

## Deployment

Cloudflare Pages, connected to this repository: build command
`npm run build`, output directory `dist`, environment variable
`NODE_VERSION=22`. Every push to `main` deploys. Clean addresses
(`/legal` for `legal.html`) and the 404 pages work without extra config.

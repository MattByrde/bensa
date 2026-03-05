# Bensa — Shopify 2.0 Furniture Theme

A modern, minimal Shopify 2.0 theme built for furniture stores. Clean design with warm neutrals, generous whitespace, and large imagery — inspired by Scandinavian aesthetics.

## Features

- **Shopify 2.0 architecture** — JSON templates, sections everywhere, fully customizable via theme editor
- **AJAX cart** — drawer-based cart with add/remove/update without page reload
- **Responsive** — mobile-first design that looks great on all devices
- **Fast** — minimal CSS/JS, lazy-loaded images with srcset, no external dependencies
- **Accessible** — skip links, ARIA labels, keyboard navigation, semantic HTML
- **Furniture-optimized** — product tabs for dimensions/materials/shipping, image gallery with thumbnails, category browsing by room

## Theme Structure

```
bensa/
├── assets/          CSS and JavaScript
├── config/          Theme settings schema and defaults
├── layout/          Base theme.liquid layout
├── locales/         Translation strings
├── sections/        All theme sections (18 total)
├── snippets/        Reusable Liquid partials
└── templates/       JSON templates for all page types
```

## Sections

### Global
- **Header** — sticky nav, logo, search, account, cart with drawer
- **Footer** — about text, link columns, social icons
- **Announcement bar** — dismissible promo bar

### Homepage
- **Hero banner** — full-width image with overlay, heading, CTA
- **Featured collection** — product grid from selected collection
- **Collection list** — category cards (Living Room, Bedroom, Dining, Office)
- **Rich text** — brand story / craftsmanship content
- **Image with text** — side-by-side layout, reversible
- **Testimonials** — customer review cards with star ratings
- **Newsletter** — email signup form

### Core Pages
- **Product page** — gallery with thumbnails, variant picker, quantity, accordion tabs
- **Collection page** — sortable product grid with pagination
- **Cart page** — line items with quantity controls, order notes
- **Blog / Article** — blog grid and single article layout
- **Search** — search form with product/content results
- **404** — friendly error page

## Design Tokens

| Token | Value |
|-------|-------|
| Background | `#FAF8F5` |
| Text | `#2C2C2C` |
| Accent (wood) | `#A67C52` |
| Secondary (sage) | `#8B9D77` |
| Border | `#E5E0DA` |

## Getting Started

1. Install the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
2. Connect to your store: `shopify theme dev --store your-store.myshopify.com`
3. Customize in the theme editor

## Development

```bash
# Start local dev server
shopify theme dev

# Push to store
shopify theme push

# Pull latest from store
shopify theme pull
```

Built by Simpol.
# bensa

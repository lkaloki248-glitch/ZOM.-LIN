# COD PRO - متجر الأزياء الفاخرة

A luxury Arabic RTL e-commerce store for COD PRO — a premium Moroccan fashion brand. Full shopping cart, WhatsApp checkout, admin panel with localStorage persistence.

## Run & Operate

- `pnpm --filter @workspace/cod-pro run dev` — run the storefront (port from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4
- State: React Context + localStorage
- Router: Wouter
- Image hosting: imgbb API

## Where things live

- `artifacts/cod-pro/src/context/StoreContext.tsx` — all products, cart state, localStorage sync
- `artifacts/cod-pro/src/pages/Home.tsx` — main storefront (hero, products, footer)
- `artifacts/cod-pro/src/pages/Admin.tsx` — product management panel (add/edit/delete/import/export)
- `artifacts/cod-pro/src/components/` — Navbar, Hero, ProductCard, CartSidebar, WhatsAppButton

## Architecture decisions

- Products stored in localStorage under `codpro_products` key; cart under `codpro_cart`
- imgbb API key embedded for image upload in Admin panel (key: fb99db1296d15c3b43676b06d8e66c51)
- WhatsApp checkout sends full cart as formatted Arabic message to +212614221016
- Admin panel accessible via `/admin` route or ⚙ button in Navbar
- RTL direction set globally on `<body>` via CSS
- No backend needed — fully client-side with localStorage persistence

## Product

- Arabic RTL e-commerce site with luxury dark theme (black/charcoal/amber gold)
- 10 pre-loaded fashion products (hoodies, jackets, shirts, jeans, etc.)
- Shopping cart sidebar with quantity controls and total calculation
- WhatsApp checkout button that sends formatted order message
- Product filtering by category and search
- Admin panel: add/edit/delete products, upload images via imgbb, import/export JSON
- Floating WhatsApp contact button (bottom left)
- Mobile-first responsive design

## User preferences

- Language: Arabic (RTL)
- Currency: MAD (Moroccan Dirham)
- WhatsApp number: 212614221016
- imgbb API key: fb99db1296d15c3b43676b06d8e66c51
- Theme: Luxury dark (black, charcoal, amber gold)
- Font: Cairo (Google Fonts)

## Gotchas

- Admin panel is at `/admin` path — no separate auth, hidden from regular customers
- Delete requires double-click confirmation (anti-accidental deletion)
- Products reset to defaults only if localStorage is empty or corrupted

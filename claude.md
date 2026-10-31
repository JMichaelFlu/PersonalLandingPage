# Bearly In a Hurry: Personal Website Documentation

## Project Overview

Jacob Fluharty's personal site, rebuilt from scratch in July 2026 as a scaled-back, interactive linktree-style home base with a **90s nostalgia aesthetic**: neon signs, spray paint, hip-hop street art, and Memphis-design geometry.

**Live Site:** https://fluharty.link
**Digital Garden:** https://garden.fluharty.link (Obsidian-powered, external)

---

## Site Structure

1. **index.html** (`/`): graffiti wordmark, intro blurb, 3 link cards (Garden / Now / Colophon), social icon grid, fake retro hit counter. Carries the h-card and JSON-LD Person data.
2. **now.html** (`/now`): Life, Reading, Listening, Working On. Update the `updated-stamp` date when editing.
3. **colophon.html** (`/colophon`): build, look, type, principles, garden pointer.
4. **privacy.html** (`/privacy`): what the site collects. Update it whenever analytics, fonts, or third-party requests change.
5. **404.html**: served by `.htaccess` for any missing URL. `noindex`, not in the sitemap.

Clean URLs come from `.htaccess` (see Hosting). Always link internally as `/now`, never `/now.html` or `https://fluharty.link/now`.

---

## Design System

### Colors (CSS vars in css/style.css :root)
- Base: `--asphalt #181226` (bg), `--wall #241b3a` (cards), `--ink #0c0914`, `--paper #f5f0e6` (text), `--dim #b9b0c9`
- Spray cans: `--pink #ff3fa4`, `--cyan #00e5ff`, `--lime #a8ff3e`, `--yellow #ffe94e`, `--orange #ff9f1c`, `--purple #b04dff`

### Type (Google Fonts, one shared URL on every page)
- **Bungee Shade**: big display titles (section/page titles)
- **Bungee**: wordmark, buttons, labels
- **Permanent Marker**: taglines, handwritten accents
- **Mouse Memoirs**: body copy (single weight, 400 only; requesting other weights breaks the font request)

### Signature elements
- Wordmark: green dayglow gradient (chartreuse, lime, neon green, mint) with pink drippy spray underline
- Halftone-dot + multi-corner dayglow haze background (body background-image stack)
- Graffiti extras: crown / wildstyle arrow / vinyl / splat SVGs, `.tag-scrawl` marker-font tags, and giant faint `.wall-tag` words in the `.memphis` layer
- Wordmark has a throw-up outline: `.wordmark::before` (data-text attr, fat paper text-stroke) behind `.wordmark-fill` (gradient clip, z-index 1). Gradient text paints in the background layer, so the fill MUST be an inner span above the pseudo. The pseudo uses `content: attr(data-text) / ""` so screen readers don't read the heading twice.
- Paint drips: `.drips` strip under the ticker (7 `<i>` drips, staggered grow-in) and drips on the hero underline SVG
- "HELLO my name is" `.slap` sticker in the hero (wiggles on hover)
- Cards use uneven border-radius (235px 18px 255px 20px / 20px 245px 18px 250px) for a hand-drawn sticker outline
- Sticker-style cards: 3px paper border, hard offset `box-shadow` in an accent color, slight rotation that straightens on hover
- Scrolling ticker banner at top of homepage (pure CSS marquee, duplicated span for seamless loop)
- Floating Memphis shapes (`.memphis` fixed layer, inline SVGs, `aria-hidden`)
- Boombox + animated equalizer divider
- Social icons are inline SVG paths from Simple Icons (CC0), colored with `fill: currentColor`

## JavaScript (js/main.js, vanilla, IIFE)
- Spray-splat effect on click (skips interactive elements)
- Fake hit counter: base 19940 + localStorage visit count, odometer digits, announced as one number
- Party mode: Konami code or triple-click wordmark. Toggles `.party` on `<html>` (NOT `<body>`: a filter on body re-anchors every fixed layer). Hue-rotate + emoji rain, auto-ends after 12s.
- Everything guarded by `prefers-reduced-motion`

---

## Tech Stack
- HTML5 / CSS3 / vanilla JS: **no frameworks, no build step**
- Hosting: NixiHost shared hosting (cPanel). DNS on Cloudflare.
- Deploy: manual upload through cPanel (see README for the file list)
- Analytics: GA4 via gtag.js (G-B2JZDMJE9T) on every page. No Tag Manager.

## Hosting (.htaccess)
- `/page` serves `page.html`; `/page.html` and `/page/` 301 to `/page`; `/index.html` 301s to `/`
- `ErrorDocument 404 /404.html`, directory listings off
- Blocks repo-only files if they get uploaded: `.git`, `.claude`, `*.md`, `*.py`
- Tested on Apache 2.4. Local preview: `python3 scripts/serve.py` mirrors the clean-URL and 404 behavior.

## File Structure
```
/
├── index.html, now.html, colophon.html, privacy.html, 404.html
├── css/style.css        # all styles
├── js/main.js           # all interactions
├── favicon.svg          # JF tag on asphalt
├── social-preview.jpg   # 1200x630 OG image
├── sitemap.xml, robots.txt
├── .htaccess            # clean URLs + 404 (must be uploaded)
├── scripts/serve.py     # local preview server (not deployed)
└── claude.md            # this file (not deployed)
```

---

## Rules
- ❌ No frameworks, no build tools: keep it plain files
- ❌ Don't remove accessibility: skip links, `prefers-reduced-motion` guards, semantic markup, focus styles
- ❌ Don't duplicate digital-garden content here: garden.fluharty.link is the single source of truth for notes/essays
- ✅ New pages: root-level `name.html`, served at `/name`. Copy the head from an existing subpage (gtag snippet, shared font URL, OG tags with absolute canonical), plus the memphis shapes block, `.page-header` pattern, and footer with `/privacy` link. Add it to sitemap.xml.
- ✅ Emoji in headings go in `<span aria-hidden="true">`
- ✅ Keep the voice: unpolished, funny, authentic
- ✅ Test party mode + reduced motion after touching main.js or animations

## TODO / Known debt (Phase 2 redesign)
- Font choice; consider self-hosting fonts (faster, and drops the Google Fonts IP disclosure)
- Contrast: `.footer-hint` is 1.9:1; social chip labels (0.58rem) and footer badge (0.62rem) are too small
- CSS dedup: sticker radius and accent shadow are repeated three times; `.content-card ul` leaks padding into `.swatches`
- Animation load on low-end phones (`background-attachment: fixed`, ~15 looping animations)
- New social preview image, favicon refresh, apple-touch-icon, theme-color

## Version History
- **v3.1** (October 2026): fixes pass. Clean URLs via .htaccess, 404 page, inline SVG icons, GTM removed, font and OG image fixes, a11y and party-mode bug fixes, IndieWeb h-card + rel="me"
- **v3.0** (July 2026): full teardown/rebuild: 90s street-art aesthetic, linktree homepage
- **v2.0** (Jan 2026): neon dive bar, 5 pages
- **v1.0** (2025): initial launch

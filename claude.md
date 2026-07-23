# Bearly In a Hurry — Personal Website Documentation

## Project Overview

Jacob Fluharty's personal site, rebuilt from scratch in July 2026 as a scaled-back, interactive linktree-style home base with a **90s nostalgia aesthetic**: neon signs, spray paint, hip-hop street art, and Memphis-design geometry.

**Live Site:** https://fluharty.link
**Digital Garden:** https://garden.fluharty.link (Obsidian-powered, external)

---

## Site Structure (3 pages, that's it)

1. **index.html** — Homepage: graffiti wordmark, intro blurb, 3 link cards (Garden / Now / Colophon), social icon grid, fake retro hit counter
2. **now.html** — Serves at `fluharty.link/now` (GitHub Pages resolves extensionless URLs). Sections: Life, Reading, Listening, Working On. Update the `updated-stamp` date when editing.
3. **colophon.html** — Serves at `/colophon`. Build, look, type, principles, garden pointer.

More pages will be added as plans evolve. **Don't add pages without updating sitemap.xml.**

---

## Design System

### Colors (CSS vars in css/style.css :root)
- Base: `--asphalt #14101c` (bg), `--wall #1f1830` (cards), `--ink #0c0914`, `--paper #f5f0e6` (text), `--dim #b9b0c9`
- Spray cans: `--pink #ff3fa4`, `--cyan #00e5ff`, `--lime #a8ff3e`, `--yellow #ffe94e`, `--orange #ff9f1c`, `--purple #b04dff`

### Type (Google Fonts)
- **Bungee Shade** — big display titles (section/page titles)
- **Bungee** — wordmark, buttons, labels
- **Permanent Marker** — taglines, handwritten accents
- **Space Grotesk** — body copy

### Signature elements
- Wordmark: green dayglow gradient (chartreuse → lime → neon green → mint) with pink drippy spray underline
- Halftone-dot + multi-corner dayglow haze background (body background-image stack)
- Graffiti extras: crown / wildstyle arrow / vinyl / splat SVGs, `.tag-scrawl` marker-font tags, and giant faint `.wall-tag` words in the `.memphis` layer
- Wordmark has a throw-up outline: `.wordmark::before` (data-text attr, fat paper text-stroke) behind `.wordmark-fill` (gradient clip, z-index 1) — gradient text paints in the background layer, so the fill MUST be an inner span above the pseudo
- Paint drips: `.drips` strip under the ticker (7 `<i>` drips, staggered grow-in) and drips on the hero underline SVG
- "HELLO my name is" `.slap` sticker in the hero (wiggles on hover)
- Cards use uneven border-radius (235px 18px 255px 20px / 20px 245px 18px 250px) for a hand-drawn sticker outline
- Sticker-style cards: 3px paper border, hard offset `box-shadow` in an accent color, slight rotation that straightens on hover
- Scrolling ticker banner at top of homepage (pure CSS marquee, duplicated span for seamless loop)
- Floating Memphis shapes (`.memphis` fixed layer, inline SVGs, `aria-hidden`)
- Boombox + animated equalizer divider

## JavaScript (js/main.js — vanilla, IIFE)
- Spray-splat effect on click (skips interactive elements)
- Fake hit counter: base 19940 + localStorage visit count, odometer digits
- Party mode: Konami code or triple-click wordmark → hue-rotate + emoji rain, auto-ends after 12s
- Everything guarded by `prefers-reduced-motion`

---

## Tech Stack
- HTML5 / CSS3 / vanilla JS — **no frameworks, no build step**
- GitHub Pages hosting; GTM (GTM-KJJ5MTKM) + GA4 (G-B2JZDMJE9T) on every page
- simple-icons font CDN for social icons (homepage only)

## File Structure
```
/
├── index.html, now.html, colophon.html
├── css/style.css        # all styles
├── js/main.js           # all interactions
├── favicon.svg          # JF tag on asphalt
├── sitemap.xml
├── assets/              # legacy images from v2; social-preview.png still referenced by OG tags
└── claude.md            # this file
```

---

## Rules
- ❌ No frameworks, no build tools — keep it plain files
- ❌ Don't remove accessibility: skip links, `prefers-reduced-motion` guards, semantic markup, focus styles
- ❌ Don't duplicate digital-garden content here — garden.fluharty.link is the single source of truth for notes/essays
- ✅ New pages: root-level `name.html` → served at `/name`; add GTM snippet, memphis shapes block, `.page-header` pattern; update sitemap.xml
- ✅ Keep the voice: unpolished, funny, authentic
- ✅ Test party mode + reduced motion after touching main.js or animations

## TODO / Known debt
- `assets/social-preview.png` is the old dive-bar design — needs a 90s-style replacement (OG tags on all 3 pages point at it)
- Legacy images in `assets/` can be purged once a new social preview exists

## Version History
- **v3.0** (July 2026) — Full teardown/rebuild: 90s street-art aesthetic, 3 pages, linktree homepage
- **v2.0** (Jan 2026) — Neon dive bar, 5 pages
- **v1.0** (2025) — Initial launch

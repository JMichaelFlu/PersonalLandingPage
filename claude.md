# Personal Website Documentation

## Project Overview

Jacob Fluharty's personal site: a small front door to the digital garden and the now page, plus his IndieWeb identity (h-card, `rel="me"`). Not a bio page. The look is **Alley Neon**: wheatpaste posters on a concrete wall, hanging neon bar signs, and a Hypercolor strip you can rub.

**Live Site:** https://fluharty.link
**Digital Garden:** https://garden.fluharty.link (Obsidian-powered, external; planned move to Quartz with this site's look)

---

## Site Structure

1. **index.html** (`/`): "Fluharty Alley" neon sign, two poster doors (Garden, Now), Hypercolor strip, "reach me" stickers, "find me elsewhere" list, xerox footer with hit counter. Carries the h-card and JSON-LD Person data.
2. **now.html** (`/now`): Life, Reading, Listening, Working On. Update the `page-stamp` date when editing.
3. **colophon.html** (`/colophon`): build, look, palette, type, principles, garden pointer.
4. **privacy.html** (`/privacy`): what the site collects. Update it whenever analytics, fonts, or third-party requests change.
5. **404.html**: served by the host for any missing URL. `noindex`, not in the sitemap. Must exist: without it, Cloudflare Pages serves the homepage for every missing URL.

Clean URLs come from the host (see Hosting). Always link internally as `/now`, never `/now.html` or `https://fluharty.link/now`.

---

## Design System: Alley Neon

Two modes share one palette:
- **The wall** (homepage): loud. Tilted torn posters, tape, stickers, neon.
- **The page** (now, colophon, privacy, 404, and later the garden): calm. One hanging neon title sign, a thin Hypercolor strip, then a straight paper `.sheet` for reading.

### Colors (CSS vars in public/css/style.css :root)
- Wall: `--concrete #1f1d1b`, `--concrete-hi`, `--concrete-lo`, `--wire #5c5762`, `--shadow #0b0a0a`
- Paper: `--ink #141210`, `--paper #ece6d6`, `--sheet #f1ece0`, `--paper-dim`, `--paper-rule`, `--muted`, `--tape`
- Spray + neon: `--poster-lime #c6ff00`, `--pink #ff2e88`, `--pink-deep #a8004a` (links on paper), `--neon-pink #ff3fa4`, `--cyan #00e5ff`, `--neon-lime #a8ff3e`, `--blue #5ad1ff`, `--orange #ff9f1c`, `--yellow #ffe94e` (focus rings)
- Hypercolor fabric: `--hc-violet`, `--hc-purple`, `--hc-magenta`

### Type (self-hosted in public/fonts, licenses in public/fonts/licenses)
- **Tilt Neon**: neon tube block letters (signs, badges)
- **Neonderthaw**: neon tube script ("Fluharty")
- **Rubik Dirt**: poster titles and sheet headings. Subset to basic Latin; still ~200 KB because the grit is in the glyphs
- **Permanent Marker**: kickers, tags, captions
- **Work Sans** 400 / 400 italic / 600: everything you actually read
- Rubik Dirt and Neonderthaw are subset with `pyftsubset` to U+0020-007E plus ’ — →. Add characters there if a heading needs them.

### Components
- `.neon-sign`: hanging sign. Near-white `border` = hot tube core, colored `box-shadow` = glow, `::before`/`::after` = the two wires. `--pink` variant for page titles. Inside: `h1 > .neon-script` / `.neon-block` (`--long` for 8-letter titles so they fit a phone). One letter wrapped in `.flicker`.
- `.poster` > `.poster-card` (the link, torn via `clip-path`), `.tape`, `.neon-badge`. `clip-path` hides the card's own focus outline, so `.poster:focus-within` draws it.
- `.hyper` > `.hyper-strip` (`--thin` on pages): heat spot position is `--hx`/`--hy`, registered with `@property` so it drifts back when it cools. Whole block is `aria-hidden`; no text ever sits on the gradient.
- `.stickers` > `.sticker--pink|paper|blue|orange`. `.sticker-torn` wraps a torn one: drop shadow and focus outline live on the `<li>` because `clip-path` eats them on the link.
- `.elsewhere`: plain link list with slash separators.
- `.xerox` (homepage footer), `.page-footer` (subpages).
- `.page-header` > `.back-link`, `.neon-sign--pink`, `.page-stamp`; then `.sheet` with `section`s.

## JavaScript (public/js/main.js, vanilla, IIFE)
- Spray-splat effect on click (skips links, buttons, form fields and the Hypercolor strip)
- Hypercolor strips: pointer sets `--hx`/`--hy`; leaving or cancelling removes them so the CSS transition cools it back
- Fake hit counter: base 19940 + localStorage visit count, announced as one number
- Party mode: Konami code or triple-click the neon sign (`#wordmark`). Toggles `.party` on `<html>` (NOT `<body>`: a filter on body re-anchors every fixed layer). Hue-rotate + emoji rain, auto-ends after 12s.
- Motion (flicker, party, transitions, the cool-down drift) is off under `prefers-reduced-motion`

---

## Tech Stack
- HTML5 / CSS3 / vanilla JS: **no frameworks, no build step**
- Hosting: Cloudflare Pages (free), Git-connected; build output directory `public`. DNS on Cloudflare.
- Deploy: merge to `main` and Pages publishes automatically. No upload step. Every branch also gets a preview URL.
- Analytics: GA4 via gtag.js (G-B2JZDMJE9T) on every page. No Tag Manager. No other third-party requests.

## Hosting
- Only `public/` is published. Docs, scripts, and editor config stay out of it.
- Cloudflare Pages: `/page` serves `page.html`, `/page.html` redirects to `/page`, missing URLs get `404.html` with a 404 status.
- `public/.htaccess` does the same on cPanel and only matters while NixiHost is a fallback. Delete it once NixiHost is retired.
- Local preview: `python3 scripts/serve.py` serves `public/` with the same clean-URL and 404 behavior.
- Email (Proton MX/SPF/DKIM/DMARC) and the Bluesky `_atproto` record live in Cloudflare DNS and are independent of web hosting. Never touch them when moving sites.

## File Structure
```
/
├── public/                  # the published site, nothing else
│   ├── index.html, now.html, colophon.html, privacy.html, 404.html
│   ├── css/style.css        # all styles
│   ├── js/main.js           # all interactions
│   ├── fonts/               # self-hosted woff2 + licenses/
│   ├── favicon.svg          # lime neon bear on a cyan neon sign (bold, built for 16 px)
│   ├── apple-touch-icon.png # 180x180 detailed bear for phone home screens
│   ├── social-preview.jpg   # 1200x630 OG image
│   ├── sitemap.xml, robots.txt
│   └── .htaccess            # cPanel-only fallback; Pages ignores it
├── scripts/serve.py         # local preview server
├── README.md                # local preview + deploy settings
└── claude.md                # this file
```

---

## Rules
- ❌ No frameworks, no build tools: keep it plain files
- ❌ Don't remove accessibility: skip links, `prefers-reduced-motion` guards, semantic markup, focus styles
- ❌ Don't duplicate digital-garden content here: garden.fluharty.link is the single source of truth for notes/essays
- ❌ No text on the Hypercolor gradient, no glossy plastic buttons (tried in exploration, rejected)
- ✅ New pages: `public/name.html`, served at `/name`. Copy the head and the `.wall.page` body skeleton from now.html (gtag snippet, Tilt Neon preload, OG tags with absolute canonical, neon title sign, thin Hypercolor strip, `.sheet`, footer with `/privacy` link). Add it to sitemap.xml.
- ✅ Keep the voice: unpolished, funny, authentic
- ✅ Test party mode + reduced motion after touching main.js or animations

## TODO / Known debt
- RSS sticker (`sticker--orange`) goes back in "reach me" once the garden has a feed
- Garden move to Quartz, styled with this design system
- New social preview image in the Alley Neon look
- Optional: custom-drawn SVG neon lettering for the wordmark (real tube bends and gaps)

## Version History
- **v4.1** (November 2026): sign reads "Fluharty Alley"; lime neon bear favicon (the online mascot), apple-touch-icon, theme-color
- **v4.0** (October 2026): Alley Neon redesign. Wheatpaste posters, hanging neon signs, Hypercolor strip; self-hosted fonts; ticker, Memphis shapes and social icons retired
- **v3.2** (October 2026): moved to Cloudflare Pages; site files now live in `public/`
- **v3.1** (October 2026): fixes pass. Clean URLs via .htaccess, 404 page, inline SVG icons, GTM removed, font and OG image fixes, a11y and party-mode bug fixes, IndieWeb h-card + rel="me"
- **v3.0** (July 2026): full teardown/rebuild: 90s street-art aesthetic, linktree homepage
- **v2.0** (Jan 2026): neon dive bar, 5 pages
- **v1.0** (2025): initial launch

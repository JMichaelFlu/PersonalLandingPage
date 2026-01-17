# Bearly In a Hurry - Personal Website Documentation

## Project Overview

This is Jacob Fluharty's personal website featuring a neon dive bar aesthetic with cool slate/charcoal color palette. The site emphasizes authenticity, accessibility, and a slower-paced approach to life.

**Live Site:** https://fluharty.link
**Digital Garden:** https://wiki.fluharty.link

---

## Site Structure

### Pages
1. **index.html** - Homepage with 6 navigation cards (2x3 grid)
2. **about.html** - Personal story and background
3. **contact.html** - Social links and contact form (Formspree)
4. **colophon.html** - Site credits, tech stack, design philosophy
5. **now.html** - *(Deprecated - links to digital garden instead)*

### Navigation Cards (Homepage)
1. **Digital Garden** → https://wiki.fluharty.link (Pink)
2. **About Me** → /about.html (Amber)
3. **What I'm Doing Now** → https://wiki.fluharty.link/now (Green)
4. **Longhand Compass Academic Support** → https://longhandcompass.com (Cyan)
5. **My Internet Footprint** → /contact.html (Pink)
6. **Colophon** → /colophon.html (Amber)

---

## Design System

### Color Palette
**Base Colors:**
- Background: `#0a0e14` (cool charcoal)
- Text Light: `#e8e8e8`
- Text Dim: `#a0a8b0`
- Card Background: `rgba(20, 25, 35, 0.7)`
- Card Border: `#4a5568`

**Neon Colors (rotate through nav cards):**
- Pink: `#ff2a6d`
- Amber: `#ffa928`
- Green: `#39ff14`
- Cyan: `#00f0ff`

### Typography
- **Headings:** Caveat (handwritten, neon sign aesthetic)
- **Body:** Asar (readable with character)
- **Font Size:** 18px base

### Spacing Scale
```css
--spacing-xs: 0.5rem
--spacing-sm: 0.75rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
--spacing-2xl: 2.5rem
--spacing-3xl: 3rem
--spacing-4xl: 4rem
```

### Border Radius
```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
```

---

## CSS Architecture

### Key Classes
- `.nav-cards` - 3-column grid (2x3 layout), collapses to 1 column on mobile
- `.nav-card` - Individual navigation cards with hover effects
- `.story` - Content sections with card styling
- `.back-link` + `.back-link-sticky` - Back to home button
- `.skip-link` - Accessibility skip to content link

### Color Assignment System
Uses CSS custom properties with nth-child selectors:
```css
.nav-card:nth-child(1) { --card-color: var(--neon-pink); }
.nav-card:nth-child(2) { --card-color: var(--neon-amber); }
.nav-card:nth-child(3) { --card-color: var(--neon-green); }
.nav-card:nth-child(4) { --card-color: var(--neon-cyan); }
.nav-card:nth-child(5) { --card-color: var(--neon-pink); }
.nav-card:nth-child(6) { --card-color: var(--neon-amber); }
```

### Responsive Design
- **Breakpoint:** `@media (max-width: 768px)`
- Grid collapses to single column
- All media queries consolidated at end of style.css

---

## JavaScript Features

### animations.js
Located at `/js/animations.js`

**Features:**
1. **Neon Flicker Effect** - Random subtle flickers on headings
2. **Parallax Scrolling** - Background depth effect
3. **Typing Animation** - Character-by-character reveal (once per session)
4. **Fade-in on Scroll** - IntersectionObserver with staggered delays
5. **Easter Eggs:**
   - Konami Code (↑↑↓↓←→←→BA) - Disco mode
   - Triple-click logo - Disco mode
   - Shift + hover card - Enhanced effects

**Accessibility:**
- Respects `prefers-reduced-motion` media query
- All animations disabled if user prefers reduced motion

---

## Technology Stack

### Core
- HTML5 (semantic markup)
- CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript (no frameworks)

### Services
- **Formspree** - Contact form handling
- **Google Fonts** - Caveat & Asar typography
- **Simple Icons** - Social media icon font
- **GitHub Pages** - Hosting

### Development
- **Claude Code** - AI pair programming assistant

---

## File Structure

```
/
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact page
├── colophon.html           # Site credits
├── now.html               # (Deprecated - kept as backup)
├── sitemap.xml            # SEO sitemap
├── claude.md              # This file
├── css/
│   └── style.css          # All styles (708 lines)
├── js/
│   └── animations.js      # All JavaScript animations
├── assets/
│   ├── bar-bg.png         # Background image (6.8 MB - needs optimization)
│   ├── neon-sign.png      # Homepage hero (426 KB)
│   ├── about-me-neon.png  # About page hero (1.1 MB)
│   ├── contact-neon.png   # Contact page hero (1.6 MB)
│   └── social-preview.jpg # Open Graph preview image
└── [favicons...]          # apple-touch-icon, favicon-32x32, etc.
```

---

## SEO & Accessibility

### Meta Tags
- Unique meta descriptions on all pages
- Open Graph tags for social sharing
- Twitter Card tags

### Structured Data
- JSON-LD Person schema on homepage
- AboutPage schema on about.html
- ContactPage schema on contact.html

### Accessibility Features
- Skip-to-content links on all pages
- ARIA labels on navigation
- Semantic HTML5 elements
- Proper form labels and associations
- Keyboard navigation support

### Sitemap
Located at `/sitemap.xml` with all 5 pages

---

## Performance Considerations

### Current Issues
- **bar-bg.png:** 6.8 MB (should be <1 MB)
- **Neon images:** Could be optimized to WebP format

### Optimization Recommendations
1. Compress bar-bg.png using TinyPNG or Squoosh
2. Convert all images to WebP format
3. Add `loading="lazy"` to images
4. Add width/height attributes to prevent layout shift

---

## Design Philosophy

### Aesthetic Goals
- **Neon dive bar** - Warm, authentic, unpretentious
- **Cool slate palette** - Modern electric vibe with neon pops
- **Subtle animations** - Enhance, don't distract
- **Accessible first** - Works for everyone

### Content Philosophy
- **Single source of truth:** Digital garden (wiki.fluharty.link) for dynamic content
- **Personal & honest:** No corporate polish, authentic voice
- **Learning in public:** Embrace imperfection and evolution

---

## Important Notes

### External Links
- **Now page:** Links to digital garden instead of local now.html
- **Digital Garden:** Primary knowledge base at wiki.fluharty.link
- **Longhand Compass:** Academic support service at longhandcompass.com

### Don't Do This
- ❌ Don't add new pages without corresponding nav card
- ❌ Don't modify color scheme without updating CSS variables
- ❌ Don't remove accessibility features
- ❌ Don't add JavaScript frameworks (keep it vanilla)
- ❌ Don't duplicate content from digital garden

### Do This
- ✅ Keep single source of truth in digital garden
- ✅ Maintain neon dive bar aesthetic
- ✅ Test animations with prefers-reduced-motion
- ✅ Update sitemap.xml when adding pages
- ✅ Keep descriptions concise and authentic

---

## Common Tasks

### Adding a New Navigation Card
1. Edit `index.html` - add new card to `.nav-cards`
2. Update `css/style.css` - add nth-child color if needed
3. Create new HTML page with standard structure
4. Update `sitemap.xml` with new page
5. Test responsive layout (should still be 3 columns → 1 column)

### Updating Color Scheme
1. Edit CSS variables in `style.css` `:root`
2. Update glow/shadow variants for new colors
3. Test all hover states and animations
4. Check accessibility contrast ratios (WCAG AA)

### Modifying Animations
1. Edit `/js/animations.js`
2. Test with `prefers-reduced-motion` enabled
3. Verify no performance issues (use DevTools Performance tab)
4. Test all easter eggs still work

---

## Version History

- **v2.0** (January 2026) - Added JavaScript animations, Colophon page, cool slate color scheme, accessibility improvements, SEO enhancements
- **v1.0** (2025) - Initial launch with neon dive bar aesthetic, 4 pages

---

## Contact & Links

- **Email:** jacob@fluharty.link
- **Digital Garden:** https://wiki.fluharty.link
- **GitHub:** https://github.com/JMichaelFlu
- **Bluesky:** https://bsky.app/profile/wiki.fluharty.link

---

## For Future Claude Sessions

When working on this site:
1. **Read this file first** to understand the design system
2. **Maintain the aesthetic** - neon dive bar with cool slate palette
3. **Test accessibility** - always respect prefers-reduced-motion
4. **Keep it simple** - no frameworks, vanilla HTML/CSS/JS
5. **Single source of truth** - digital garden for dynamic content
6. **Check the plan** - Reference `/Users/jflu/.claude/plans/precious-pondering-crescent.md` for full implementation details

# Personal Website Documentation

## Project Overview

Jacob Fluharty's personal site: a small front door to the digital garden and the now page, plus his IndieWeb identity (h-card, `rel="me"`). Not a bio page. The look is **Alley Neon**: wheatpaste posters on a concrete wall, hanging neon bar signs, and a Hypercolor strip you can rub.

**Live Site:** https://fluharty.link
**Digital Garden:** https://garden.fluharty.link (Obsidian-powered, external; planned move to Quartz with this site's look)

---

## Site Structure

1. **index.html** (`/`): "Fluharty Alley" neon sign, two poster doors (Garden, Now), Hypercolor strip, "reach me" stickers, "find me elsewhere" list, IndieWeb Webring strip, xerox footer. Carries the h-card and JSON-LD Person data.
   - The `<body class="h-card">` is the representative h-card (its `u-url u-uid` is the homepage). The IndieWeb Webring builds Jacob's profile from it: `p-name` (footer), `p-note` (the tagline), `u-photo` (a `<data>` pointing at profile.jpg, a 400x400 crop of Jacob's illustrated portrait; the JSON-LD `image` uses the same file). To change the photo, replace profile.jpg with another square image under the same name. Changing any of these means re-signing in at the ring so it re-reads the profile.
2. **now.html** (`/now`): Life, Reading, Listening, Working On. Update the `page-stamp` date when editing, and keep the `<time datetime="YYYY-MM-DD">` attribute matching the visible date: search engines (and the planned feed) read the attribute, not the text.
3. **colophon.html** (`/colophon`): stack, hosting, AI help, look, palette, type + licenses, privacy, accessibility, page weight, IndieWeb bits, changelog. Update its changelog and `page-stamp` date with every version below, and re-check facts there whenever hosting, fonts, analytics, or page weight change.
4. **privacy.html** (`/privacy`): what the site collects. Update it whenever analytics, fonts, or third-party requests change.
5. **links.html** (`/links`): blogroll ("Gardens I Wander Through", "Required Reading for Garden Nerds"), the 88x31 button with a copy-paste snippet, and the webrings section. Each entry is `<li><a>Name</a> [feed tag]<br>one-liner</li>`. The one-liners are Claude drafts from November 2026 (written from each site's own description); Jacob is rewriting them and trimming the list. Keep `blogroll.opml` in step with the list: every entry that has a feed belongs in it.
6. **blogroll.opml**: the blogroll's feeds for import into a feed reader, plus the now feed. Linked from /links and advertised with `<link rel="blogroll">`.
7. **buttons/fluharty-alley-88x31.png**: our 88x31 button ("Fluharty" pink neon script, "ALLEY" lime neon). Rendered once from HTML with the site fonts; redraw it by hand-editing a copy if the look changes.
8. **404.html**: served by the host for any missing URL. `noindex`, not in the sitemap. Must exist: without it, Cloudflare Pages serves the homepage for every missing URL.

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
- `.webring` (homepage, just above the footer): the ring's required ← / "An IndieWeb Webring 🕸💍" / → links, from the ring's own snippet plus aria-labels on the arrows. The ring must see it on the homepage, so never move it to another page. The prev/next links work out where you are from the Referer, so don't add `rel="noreferrer"` or a no-referrer policy.
- `.xerox` (homepage footer), `.page-footer` (subpages).
- `.page-header` > `.back-link`, `.neon-sign--pink`, `.page-stamp`; then `.sheet` with `section`s.
- `.notes` > `section.note` (now page only): each section is its own torn wheatpaste note. The paper is `::before` (torn with `clip-path`) and the tape is `::after`, so the tear never clips the tape. All notes are light paper (paper/sheet alternating) with ink text; the color is the tape, cycling lime, pink, cyan, orange. Saturated backgrounds behind long reading text were tried and rejected.

### Responsive layout
Mobile first: one narrow column. Breakpoints at the end of style.css:
- `min-width: 760px`: subpages widen to 760px.
- `min-width: 960px`: wall widens to 1080px. Homepage posters sit side by side, stickers and "elsewhere" share a row, xerox footer goes horizontal. Reading pages (colophon, privacy) cap at 820px for line length. `.page--wide` (now page) goes 1080px with notes in two masonry columns (CSS `columns`; notes are `inline-flex` so a note and its tape never split across columns).

## JavaScript (public/js/main.js, vanilla, IIFE)
- Spray-splat effect on click (skips links, buttons, form fields and the Hypercolor strip)
- Hypercolor strips: pointer sets `--hx`/`--hy`; leaving or cancelling removes them so the CSS transition cools it back
- Hit counter: fetches `/api/hits` (see Pages Function below) and shows visits in the last 30 days. The `<p class="hit-counter">` stays `hidden` unless a real number comes back, so local preview and cPanel simply don't show it. Never fake a number or a starting offset. The old version (until November 2026) kept a per-browser count in `localStorage`: consent trouble under EU ePrivacy rules, and it only counted your own visits. main.js still deletes that old `flu-visits` key; remove that line (and its sentence in privacy.html) after mid-2027.
- Party mode: Konami code or triple-click the neon sign (`#wordmark`). Toggles `.party` on `<html>` (NOT `<body>`: a filter on body re-anchors every fixed layer). Hue-rotate + emoji rain, auto-ends after 12s.
- Motion (flicker, party, transitions, the cool-down drift) is off under `prefers-reduced-motion`

---

## Now Feed (functions/now.xml.js)
- `GET /now.xml` is an Atom feed built on request from now.html (fetched with `env.ASSETS.fetch('/now')`), so Jacob only ever edits the page. One entry, titled "News From the Road: <Month D, YYYY>", content = the inner HTML of `article.notes` with root-relative links made absolute.
- The entry id (`tag:fluharty.link,YYYY-MM-DD:now`) and dates come from the page-stamp `<time datetime>`. Bumping that date = a new post in readers (they keep the history); editing without bumping it pings nobody. Brand-new subscribers only see the current update; an archive of past now pages is an idea on the Roadmap.
- The function reads the page with two regexes: `class="page-stamp"` ... `<time datetime="YYYY-MM-DD"` and `<article class="notes">`. Keep that markup, or update the function with it. If either is missing it returns 503 (the reason is in the Pages Functions logs).
- Discovery: `<link rel="alternate" type="application/atom+xml">` in the head of index.html and now.html, plus a visible link in the now page footnote. The garden gets its own separate feed later; people may want one and not the other.
- Not testable with scripts/serve.py (no Functions locally): check it on the branch preview URL.

## Pages Function (functions/api/hits.js)
- The hit counter. `GET /api/hits` asks the Cloudflare GraphQL Analytics API (`rumPageloadEventsAdaptiveGroups`, bots excluded) for visits in the last 30 days to fluharty.link, www and the garden, and returns `{ visits, days, asOf }`, cached for an hour. Returns 503 when unconfigured or upstream fails.
- Counts by hostname (`ALLEY_HOSTS` in the file), not by Web Analytics site: visits have landed under three different site tags over time (zone-wide automatic setup, the Pages switch, the garden plugin). Add a host there if a new subdomain should count. Numbers are Cloudflare's sampled estimates, so at low traffic they move in round steps.
- Pages compiles `functions/` itself on deploy, even with the build command left blank (confirmed November 2026); there is still no local build.
- Project variables (Settings → Variables and Secrets, Production and Preview): `CF_ACCOUNT_ID` (plain text) and `CF_ANALYTICS_TOKEN` (secret; API token with only Account Analytics: Read). If the counter vanishes, the token probably expired: `/api/hits` returns 503 and the reason is in the Pages Functions logs.
- 30 days is a choice, not a limit: Web Analytics allows windows up to about 93 days and keeps about 6 months. An all-time total would need a running sum stored server-side (e.g. KV), never in the browser.

## Tech Stack
- HTML5 / CSS3 / vanilla JS: **no frameworks, no build step** (two Pages Functions, compiled by Pages)
- Hosting: Cloudflare Pages (free), Git-connected; build command blank, build output directory `public`. DNS on Cloudflare.
- Deploy: merge to `main` and Pages publishes automatically. No upload step. Every branch also gets a preview URL.
- Analytics: Cloudflare Web Analytics (cookie-free), switched on in the Pages project (Workers & Pages → project → Metrics → Web Analytics); Cloudflare adds its script at deploy time, so there is no analytics code in the HTML. The zone-wide "automatic setup" site does not reach Pages or Workers responses (checked live in November 2026), so don't rely on it. garden.fluharty.link counts through its own Web Analytics site and a small plugin in the garden repo. No Google Analytics, no Tag Manager.

## Hosting
- Only `public/` is published. Docs, scripts, and editor config stay out of it.
- Cloudflare Pages: `/page` serves `page.html`, `/page.html` redirects to `/page`, missing URLs get `404.html` with a 404 status.
- `public/.htaccess` does the same on cPanel and only matters while NixiHost is a fallback. Delete it once NixiHost is retired.
- Local preview: `python3 scripts/serve.py` serves `public/` with the same clean-URL and 404 behavior.
- Email (Proton MX/SPF/DKIM/DMARC) and the Bluesky `_atproto` record live in Cloudflare DNS and are independent of web hosting. Never touch them when moving sites.
- Cloudflare adds scripts at its edge that never appear in this repo: bot protection (`/cdn-cgi/challenge-platform`, may set a `cf_clearance` cookie), email obfuscation (`email-decode.min.js`), and Web Analytics. **Google tag gateway must stay off** (it re-injected the old GTM container in November 2026). Audit what visitors really get with a real browser (Playwright), not curl: Cloudflare only injects into browser-like requests.

## File Structure
```
/
├── public/                  # the published site, nothing else
│   ├── index.html, now.html, links.html, colophon.html, privacy.html, 404.html
│   ├── blogroll.opml        # blogroll feeds for feed readers
│   ├── buttons/             # 88x31 button(s)
│   ├── css/style.css        # all styles
│   ├── js/main.js           # all interactions
│   ├── fonts/               # self-hosted woff2 + licenses/
│   ├── favicon.svg          # lime neon bear on a cyan neon sign (bold, built for 16 px)
│   ├── apple-touch-icon.png # 180x180 detailed bear for phone home screens
│   ├── profile.jpg          # 400x400 profile photo (h-card u-photo, JSON-LD image)
│   ├── social-preview.jpg   # 1200x630 OG image
│   ├── sitemap.xml, robots.txt
│   └── .htaccess            # cPanel-only fallback; Pages ignores it
├── functions/api/hits.js    # hit counter endpoint (Pages Function, not in public/)
├── functions/now.xml.js     # now page Atom feed (Pages Function)
├── scripts/serve.py         # local preview server
├── README.md                # local preview + deploy settings
└── CLAUDE.md                # this file (Claude Code loads it automatically; keep the caps)
```

---

## Rules
- ❌ No frameworks, no build tools: keep it plain files
- ❌ Don't remove accessibility: skip links, `prefers-reduced-motion` guards, semantic markup, focus styles
- ❌ Don't duplicate digital-garden content here: garden.fluharty.link is the single source of truth for notes/essays
- ❌ No text on the Hypercolor gradient, no glossy plastic buttons (tried in exploration, rejected)
- ✅ New pages: `public/name.html`, served at `/name`. Copy the head and the `.wall.page` body skeleton from now.html (Tilt Neon preload, OG tags with absolute canonical, neon title sign, thin Hypercolor strip, `.sheet`, footer with `/privacy` link). Add it to sitemap.xml.
- ✅ Keep the voice: unpolished, funny, authentic
- ✅ Test party mode + reduced motion after touching main.js or animations
- ✅ **Jacob does the hands-on work by default, everywhere.** Jacob describes what he wants; Claude writes the first version of anything new and walks him through it. From then on, Claude teaches and Jacob does: which file, where, what to change, and why. In areas new to him (JavaScript, the Pages Functions, Cloudflare settings, DNS) Claude goes slower and explains more, but he still makes the change. Claude makes changes itself only when Jacob says so ("just do it"). For anything hard to undo, like DNS records, Claude explains the change and what could break before Jacob makes it, and checks it afterward.

## Working Across Sessions
Claude sessions can't see each other. This file is the shared memory for site work.
- Start of a session: read Roadmap below before proposing anything new.
- End of a session: record any decision, plan change, or newly opened item in Roadmap (or the relevant section), in the same PR as the work.
- Jacob's general working rules live in his AI Operating Guide (Google Drive, 02 Areas). Site specifics live here.
- Finish open items before starting new ones; if something new comes up, add it to Roadmap and ask what it replaces.

## Roadmap
Status: **next** (agreed, not started), **later** (agreed, waiting on something), **idea** (not decided).

### /ai launch checklist (Jacob's task log, November 2026)
Work top to bottom; tick items off here as they land (one PR can tick several). Details and reasons: AIPageOutline.md and DraftingAIPolicy.md (Google Drive, 02 Areas/AIOperationsAndLogs). Hands-on rule applies: Jacob makes the changes, Claude teaches.

**Copy (fluharty.link)**
- [ ] /links: rewrite every blurb in his own words, cut sites he no longer reads, drop their feeds from blogroll.opml, remove the draft comment
- [ ] /colophon: rework the body heavily; rewrite "Help From a Robot" to point to /ai; say Claude drew the bear mascot
- [ ] /404: rework "or check the digital garden if you were after"
- [ ] Homepage small copy: Konami hint, hit counter text, webring line
- [ ] /now: the feed footer line
- [ ] Meta and OG descriptions on every page, and the palette names on /colophon (July 2026 rebuild copy)
- [ ] /privacy: keep the AI draft; fact-check every claim against how the site works
- [ ] Log anything left unreworked, with why, in DraftingAIPolicy.md (section 6 list)

**Images**
- [ ] Rework profile.jpg (h-card photo; re-sign in at the webring afterward)
- [ ] Rework social-preview.jpg and fix its alt text
- [ ] Favicon, apple-touch-icon, 88x31 button: rework, or keep and list on /ai
- [ ] Garden: rework the Welcome note banner; give it real alt text (live alt reads "GeminiGardenBanner.jpeg800") plus the AI note
- [ ] Garden: rework logo.png and favicon.svg, or list them on /ai
- [ ] Every AI-generated image still up at launch: alt note naming the tool, caption where possible, or a line in "Currently AI-generated"

**Cloudflare (hosting review session, before launch)**
- [ ] Turn off the managed robots.txt and the AI bot firewall block on both hosts; check Bot Preference Sync; keep normal bot protection and rate limiting
- [ ] Re-fetch both live robots.txt files and re-run the user-agent check (expect 200, not 403)

**Write and ship /ai**
- [ ] Write the /ai copy from AIPageOutline.md (400 to 600 words plus the AI-generated list)
- [ ] Gemini reviews the written page against the confirmed positions
- [ ] Build public/ai.html from the now.html skeleton; add it to sitemap.xml; link it from the colophon (and footer if wanted)
- [ ] After launch: add the policy and a pointer to the hands-on rule to the AIOperatingGuide; clear its stale Emergency Fund open item

**Done**
- [x] Garden: unpublished "Using AI in Tutoring" and "Initial Session Progress Note" (both 404 on the live garden, checked November 2026)


- **next (Jacob): review all flagged Claude content.** Jacob needs to make a manual review of all flagged Claude content and rework the content that is intended to represent his voice. Any content that is not reworked needs to be noted by Jacob and submitted to the workspace document (DraftingAIPolicy.md, Google Drive, 02 Areas/AIOperationsAndLogs) for transparency, with an explanation. Must be done before /ai goes live. Flagged by the November 2026 copy audit (full list in that document):
  - /links: all copy, including the blurbs (see the item below).
  - /colophon: most body text, including "Help From a Robot" (the current AI disclosure, written by Claude) and "house mascot, drawn for this site" (Claude drew the bear favicon as SVG; say so).
  - /privacy: nearly all body text.
  - Small copy: the Konami hint, hit counter text, webring line, now-feed footer line, OG/meta descriptions, social preview alt text.
  - Probably Claude: copy from the July 2026 rebuild (d584dca, Claude co-author), such as the /now and /colophon meta descriptions, the palette names, and "Fun shouldn't cost anyone access".
- **next (Jacob): rewrite the /links blurbs** in his own words and cut sites he no longer reads. Remove the draft comment in links.html when done. Remove dropped feeds from blogroll.opml too.
- **next: /ai page.** Jacob is outlining it with Claude, writes the final copy himself, Gemini reviews. The project record (research, decisions, audit) is DraftingAIPolicy.md in Google Drive, 02 Areas/AIOperationsAndLogs. The outline Jacob writes from (page sections, companion-post outline, cut list, before-launch checklist) is AIPageOutline.md in the same folder; Gemini reviewed it (Ship with fixes) and it is revised and ready to write from. Jacob works through the checklist below. Settled so far: one public policy; sections Writing, Images and media, Code, Research and thinking, Bots reading the site, Why; anything that speaks as Jacob (posts, notes, /now, colophon, /links, 404, the disclosure itself) is his, heavily reworked; the privacy policy is AI-led and fact-checked by Jacob, not lawyer-reviewed; nuts-and-bolts copy (commit messages, alt text, meta descriptions) may be AI-drafted and reviewed. Images: prompting alone, however many rounds, is "AI-generated"; "AI-assisted" means Jacob edited or assembled it by hand. AI-generated images get an alt note naming the tool that made that image ("AI-generated with Gemini, not hand-edited"; "drawn by Claude as code" for the Claude-made ones) and a caption where possible; ones with no caption spot are listed on /ai under "Currently AI-generated". Today that is every image on the site: profile.jpg and social-preview.jpg (Gemini, being reworked), favicon.svg and apple-touch-icon.png (Claude, SVG), the 88x31 button (Claude); on the garden, the Welcome note banner (Gemini, not hand-edited), logo.png and favicon.svg (AI-generated). Code: every piece starts with Jacob describing it; Claude Code writes the first version and walks him through it; HTML and CSS are where he is hands-on today; JavaScript, the Pages Functions, and hosting are Claude-written for now and he is learning them; the Claude and Gemini editor extensions are installed but rarely used. When /ai ships: point /colophon's "Help From a Robot" at it, add it to sitemap.xml, and add the policy to Jacob's AI Operating Guide so future sessions flag work that would break it.
- **later: Hosting review, after /ai ships.** Walk Jacob through the whole setup step by step (Cloudflare Pages, DNS, what each record does) and decide whether to keep NixiHost. NixiHost is the cPanel fallback from before the move to Pages; if it goes, delete `public/.htaccess` too. Jacob valued learning the backend hands-on in cPanel, so this is a teaching session as much as a decision. Email and Bluesky DNS records stay untouched. **Before /ai ships, in this session:** make the bot settings match the /ai stance (open to all bots, Jacob's decision, November 2026). Two things block AI crawlers today on both fluharty.link and the garden, neither in this repo: Cloudflare's managed robots.txt (prepends `ai-train=no` and disallows about 30 crawlers, ClaudeBot and GPTBot included) and a firewall-level block (requests with GPTBot, ClaudeBot or CCBot user agents get a 403 with the body `blocked`; likely the AI bot blocking toggle, not confirmed, because the API token can't read bot management or custom rules). Turn both off, keep normal bot protection and rate limiting, then re-fetch both live robots.txt files and re-run the user-agent check.
- **done: IndieWeb Webring** (November 2026): Jacob signed in with GitHub as the authenticator; strip on the homepage. Other rings and other people's 88x31 buttons can follow.
- **idea: Submit /now to nownownow.com** so the now page is listed in the directory.
- **later: Garden feed.** The garden is the Obsidian Digital Garden plugin: the plugin pushes notes marked for publish to the garden's git repo, and a Cloudflare build generates the site. Jacob also edits some things directly on GitHub. Check whether the garden template already makes a feed before building one; fold it into the Quartz decision. When a garden feed exists, the RSS sticker (`sticker--orange`) goes back in "reach me".
- **later: Garden move to Quartz**, styled with this design system.
- **idea: Now page archive** (e.g. `/now/2026-11-12`) so new feed subscribers can see past updates. Costs a copy step every week.
- **idea: Photo feed.** Each stream gets its own feed later; nothing to design up front.
- **idea: Start our own webring.** Not before a year of being in others.
- **idea: New social preview image** in the Alley Neon look.
- **idea: Custom SVG neon lettering** for the wordmark (real tube bends and gaps).

## Version History
- **v4.9** (November 2026): profile photo (illustrated portrait) for the h-card and JSON-LD; fixed a trailing comma that made the JSON-LD invalid
- **v4.8** (November 2026): joined the IndieWeb Webring (homepage strip); h-card gains p-note and u-photo for the ring profile
- **v4.7** (November 2026): /links page (blogroll with draft one-liners, OPML, 88x31 button, webrings placeholder); Links added to the homepage footer
- **v4.6** (November 2026): now page Atom feed at /now.xml (Pages Function built from now.html)
- **v4.5** (November 2026): project notes renamed to CLAUDE.md so Claude Code loads them; Roadmap and cross-session rules added; now page datetime fixed
- **v4.4** (November 2026): now page notes all light paper with colored tape; colophon rewritten (hosting, AI help, font licenses, privacy, skip-link hint, weight, IndieWeb, changelog)
- **v4.3** (November 2026): desktop layout (wider wall, side-by-side posters, two-column now page); now page sections are separate torn-paper notes
- **v4.2** (November 2026): Google fully removed (incl. Cloudflare's Google tag gateway), cookie-free Cloudflare Web Analytics on both sites, privacy policy covers the whole alley, hit counter rebuilt on real Cloudflare totals (nothing stored in the browser)
- **v4.1** (November 2026): sign reads "Fluharty Alley"; lime neon bear favicon (the online mascot), apple-touch-icon, theme-color
- **v4.0** (October 2026): Alley Neon redesign. Wheatpaste posters, hanging neon signs, Hypercolor strip; self-hosted fonts; ticker, Memphis shapes and social icons retired
- **v3.2** (October 2026): moved to Cloudflare Pages; site files now live in `public/`
- **v3.1** (October 2026): fixes pass. Clean URLs via .htaccess, 404 page, inline SVG icons, GTM removed, font and OG image fixes, a11y and party-mode bug fixes, IndieWeb h-card + rel="me"
- **v3.0** (July 2026): full teardown/rebuild: 90s street-art aesthetic, linktree homepage
- **v2.0** (Jan 2026): neon dive bar, 5 pages
- **v1.0** (2025): initial launch

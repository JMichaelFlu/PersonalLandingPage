# personal-site

The code for my personal landing page, [fluharty.link](https://fluharty.link). Plain HTML, CSS, and JavaScript with no build step. See `claude.md` for the design system and conventions.

Everything the public sees lives in `public/`. Everything else (docs, scripts, editor config) stays in the repo and is never served.

## Local preview

```bash
python3 scripts/serve.py
```

Then open http://localhost:4173. The script serves `public/` with the same clean URLs (`/now` serves `now.html`) and 404 page as the live host.

## Deploy

Hosted on Cloudflare Pages, connected to this GitHub repo. Merging to `main` deploys automatically; there is no upload step.

Pages project settings, for reference if it ever needs rebuilding:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | None |
| Build command | *(blank; Pages still compiles `functions/`)* |
| Build output directory | `public` |
| Custom domains | `fluharty.link`, `www.fluharty.link` |
| Variables | `CF_ACCOUNT_ID`, `CF_SITE_TAGS`, secret `CF_ANALYTICS_TOKEN` (see `claude.md`, Pages Function) |

The hit counter is the one piece of server code: `functions/api/hits.js`. Locally and on cPanel it has nothing to answer, so the counter stays hidden.

Pages handles clean URLs and `404.html` on its own. Keep `404.html` in `public/`: without it, Pages serves the homepage for every missing URL.

### Fallback: cPanel

Until NixiHost is retired, the site can still be uploaded by hand: copy the **contents** of `public/` to the site root, including the hidden `.htaccess` (in cPanel File Manager, open Settings and tick "Show Hidden Files"). Without `.htaccess`, `/now`, `/colophon`, and `/privacy` return 404 on cPanel.

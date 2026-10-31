# personal-site

The code for my personal landing page, [fluharty.link](https://fluharty.link). Plain HTML, CSS, and JavaScript with no build step. See `claude.md` for the design system and conventions.

## Local preview

```bash
python3 scripts/serve.py
```

Then open http://localhost:4173. The script mirrors the server's clean URLs (`/now` serves `now.html`) and 404 page.

## Deploy (cPanel)

Upload these to the site root:

- `index.html`, `now.html`, `colophon.html`, `privacy.html`, `404.html`
- `css/`, `js/`
- `favicon.svg`, `social-preview.jpg`, `sitemap.xml`, `robots.txt`
- `.htaccess` (hidden file: in cPanel File Manager, open Settings and tick "Show Hidden Files")

Leave out `README.md`, `claude.md`, `scripts/`, `.claude/`, and `.git/`. The server blocks them if they do get uploaded.

Without `.htaccess`, `/now`, `/colophon`, and `/privacy` return 404.

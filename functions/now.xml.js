/*
 * GET /now.xml: an Atom feed of the now page, built from now.html on request, so the page is
 * the only file Jacob ever edits.
 *
 * The feed holds one entry: the page as it stands. Its id and date come from the page-stamp
 * <time datetime="YYYY-MM-DD">, so bumping that date is what makes feed readers show a new
 * post (and they keep the older ones). Fixing a typo without changing the date pings nobody.
 *
 * It reads nothing about the reader asking and stores nothing. If the page or its date can't
 * be read, it returns 503 rather than a broken feed.
 */
const SITE = 'https://fluharty.link';
const CACHE_SECONDS = 3600; // readers poll; once an hour is plenty
const TITLE_PREFIX = 'News From the Road';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function readNowPage(html) {
    const stamp = html.match(/class="page-stamp"[^>]*>[\s\S]*?<time datetime="(\d{4})-(\d{2})-(\d{2})"/);
    const notes = html.match(/<article class="notes">([\s\S]*?)<\/article>/);
    if (!stamp || !notes) {
        throw new Error('now.html is missing its page-stamp date or its notes');
    }
    const [, y, m, d] = stamp;
    const month = MONTHS[Number(m) - 1];
    if (!month || Number(d) < 1 || Number(d) > 31) {
        throw new Error(`page-stamp date is not a real date: ${y}-${m}-${d}`);
    }
    const content = notes[1]
        .replace(/ class="note"/g, '')
        // feed readers live elsewhere, so root-relative links need the domain
        .replace(/(href|src)="\//g, `$1="${SITE}/`)
        .replace(/\s+/g, ' ')
        .trim();
    return {
        date: `${y}-${m}-${d}`,
        title: `${TITLE_PREFIX}: ${month} ${Number(d)}, ${y}`,
        content,
    };
}

export function buildFeed({ date, title, content }) {
    const updated = `${date}T00:00:00Z`;
    return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Jacob Fluharty: Now</title>
  <subtitle>What I'm doing, reading, and obsessing over, updated about weekly.</subtitle>
  <id>${SITE}/now</id>
  <link rel="self" type="application/atom+xml" href="${SITE}/now.xml"/>
  <link rel="alternate" type="text/html" href="${SITE}/now"/>
  <updated>${updated}</updated>
  <author><name>Jacob Fluharty</name><uri>${SITE}/</uri></author>
  <icon>${SITE}/apple-touch-icon.png</icon>
  <entry>
    <title>${escapeXml(title)}</title>
    <id>tag:fluharty.link,${date}:now</id>
    <link rel="alternate" type="text/html" href="${SITE}/now"/>
    <published>${updated}</published>
    <updated>${updated}</updated>
    <content type="html">${escapeXml(content)}</content>
  </entry>
</feed>
`;
}

export async function onRequestGet({ request, env }) {
    try {
        const page = await env.ASSETS.fetch(new URL('/now', request.url));
        if (!page.ok) {
            throw new Error(`now page answered ${page.status}`);
        }
        const feed = buildFeed(readNowPage(await page.text()));
        return new Response(feed, {
            headers: {
                'Content-Type': 'application/atom+xml; charset=utf-8',
                'Cache-Control': `public, max-age=${CACHE_SECONDS}`,
            },
        });
    } catch (err) {
        console.error('now feed:', err.message);
        return new Response('The now feed is taking a breather. Try again later.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
        });
    }
}

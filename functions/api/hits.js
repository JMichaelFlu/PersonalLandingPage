/*
 * GET /api/hits: how many visits the alley got in the last 30 days, straight from
 * Cloudflare Web Analytics. It hands back one aggregate number. It reads nothing about
 * the visitor asking and stores nothing anywhere: no cookies, no browser storage, no log.
 *
 * Needs three settings on the Pages project (Settings → Variables and Secrets):
 *   CF_ACCOUNT_ID       the Cloudflare account ID
 *   CF_SITE_TAGS        Web Analytics site tag(s), comma-separated (fluharty.link, the garden)
 *   CF_ANALYTICS_TOKEN  secret: an API token with only "Account Analytics: Read"
 * If any are missing or Cloudflare can't answer, it returns 503 and the page hides the counter.
 */
const WINDOW_DAYS = 30;
const CACHE_SECONDS = 3600; // one GraphQL call an hour is plenty for a hit counter
const HEX = /^[0-9a-f]{32}$/;

function reply(body, status, maxAge) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
        },
    });
}

export function buildQuery(account, sites, start, end) {
    // one aliased block per site; values are validated hex and ISO dates, so inlining is safe
    const blocks = sites.map((site, i) => `
        s${i}: rumPageloadEventsAdaptiveGroups(limit: 1, filter: {
            siteTag: "${site}", bot: 0, datetime_geq: "${start}", datetime_lt: "${end}"
        }) { sum { visits } }`).join('');
    return `{ viewer { accounts(filter: { accountTag: "${account}" }) {${blocks} } } }`;
}

export async function countVisits(env, now = new Date()) {
    const account = (env.CF_ACCOUNT_ID || '').trim().toLowerCase();
    const sites = (env.CF_SITE_TAGS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (!HEX.test(account) || !sites.length || !sites.every((s) => HEX.test(s)) || !env.CF_ANALYTICS_TOKEN) {
        throw new Error('hit counter is not configured');
    }
    const end = now.toISOString();
    const start = new Date(now.getTime() - WINDOW_DAYS * 864e5).toISOString();

    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.CF_ANALYTICS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: buildQuery(account, sites, start, end) }),
    });
    const json = await res.json().catch(() => null);
    const acct = json && json.data && json.data.viewer && json.data.viewer.accounts && json.data.viewer.accounts[0];
    if (!res.ok || !acct || (json.errors && json.errors.length)) {
        throw new Error(`analytics query failed (${res.status}): ${JSON.stringify(json && json.errors)}`);
    }
    return sites.reduce((total, _, i) => {
        const group = (acct[`s${i}`] || [])[0];
        return total + ((group && group.sum && group.sum.visits) || 0);
    }, 0);
}

export async function onRequestGet({ request, env, waitUntil }) {
    const cache = typeof caches !== 'undefined' ? caches.default : null;
    const key = new Request(new URL('/api/hits', request.url).toString());
    const hit = cache && (await cache.match(key));
    if (hit) return hit;

    try {
        const visits = await countVisits(env);
        const res = reply({ visits, days: WINDOW_DAYS, asOf: new Date().toISOString() }, 200, CACHE_SECONDS);
        if (cache) waitUntil(cache.put(key, res.clone()));
        return res;
    } catch (err) {
        console.error(err.message); // shows up in the Pages Functions real-time logs
        return reply({ error: 'counter unavailable' }, 503, 0);
    }
}

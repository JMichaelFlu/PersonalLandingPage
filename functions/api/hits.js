/*
 * GET /api/hits: how many visits the alley got in the last 30 days, straight from
 * Cloudflare Web Analytics. It hands back one aggregate number. It reads nothing about
 * the visitor asking and stores nothing anywhere: no cookies, no browser storage, no log.
 *
 * It counts by hostname, not by Web Analytics site, because the alley's visits have been
 * recorded under more than one site over time (zone-wide setup, the Pages switch, the garden
 * plugin). Numbers are Cloudflare's own estimates, the same ones the dashboard shows.
 *
 * Needs two settings on the Pages project (Settings → Variables and Secrets):
 *   CF_ACCOUNT_ID       the Cloudflare account ID
 *   CF_ANALYTICS_TOKEN  secret: an API token with only "Account Analytics: Read"
 * If either is missing or Cloudflare can't answer, it returns 503 and the page hides the counter.
 */
const WINDOW_DAYS = 30;
const CACHE_SECONDS = 3600; // one GraphQL call an hour is plenty for a hit counter
const HEX = /^[0-9a-f]{32}$/;
const ALLEY_HOSTS = ['fluharty.link', 'www.fluharty.link', 'garden.fluharty.link'];

function reply(body, status, maxAge) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
        },
    });
}

export function buildQuery(account, hosts, start, end) {
    // values are validated hex, fixed hostnames and ISO dates, so inlining them is safe
    return `{ viewer { accounts(filter: { accountTag: "${account}" }) {
        rumPageloadEventsAdaptiveGroups(limit: 1, filter: {
            requestHost_in: ${JSON.stringify(hosts)}, bot: 0, datetime_geq: "${start}", datetime_lt: "${end}"
        }) { sum { visits } } } } }`;
}

export async function countVisits(env, now = new Date()) {
    const account = (env.CF_ACCOUNT_ID || '').trim().toLowerCase();
    if (!HEX.test(account) || !env.CF_ANALYTICS_TOKEN) {
        throw new Error('hit counter is not configured');
    }
    const end = now.toISOString();
    const start = new Date(now.getTime() - WINDOW_DAYS * 864e5).toISOString();

    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.CF_ANALYTICS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: buildQuery(account, ALLEY_HOSTS, start, end) }),
    });
    const json = await res.json().catch(() => null);
    const acct = json && json.data && json.data.viewer && json.data.viewer.accounts && json.data.viewer.accounts[0];
    if (!res.ok || !acct || (json.errors && json.errors.length)) {
        throw new Error(`analytics query failed (${res.status}): ${JSON.stringify(json && json.errors)}`);
    }
    const group = (acct.rumPageloadEventsAdaptiveGroups || [])[0];
    return (group && group.sum && group.sum.visits) || 0; // no rows means no visits yet
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

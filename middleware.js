import { next, rewrite } from '@vercel/functions';

// ─── MAINTENANCE MODE ───────────────────────────────────
// Set to true to gate the entire site behind /maintenance.
// Bypass: visit any page with ?bypass to set a cookie and skip the gate.
const MAINTENANCE_MODE = false;
// ────────────────────────────────────────────────────────

// ─── KNOWN BOTS (bypass geo-fence for SEO & ads) ─────
// These bots must reach your actual content for indexing,
// ad verification, and social media link previews.
const BOT_PATTERNS = [
    'googlebot', 'google-inspectiontool', 'adsbot-google', 'mediapartners-google',
    'apis-google', 'google-safety',
    'bingbot', 'msnbot', 'adidxbot',
    'facebookexternalhit', 'facebot',
    'twitterbot',
    'linkedinbot',
    'slackbot', 'slack-imgproxy',
    'whatsapp',
    'pinterestbot',
    'discordbot',
    'applebot',
    'duckduckbot',
    'yandexbot',
    'baiduspider',
    'ia_archiver',
    'semrushbot', 'ahrefsbot', 'dotbot', 'rogerbot', 'screaming frog',
    'gtmetrix', 'pagespeed', 'lighthouse',
    'uptimerobot', 'pingdom', 'statuscake',
    'vercel-edge-functions',
];

function isKnownBot(userAgent) {
    if (!userAgent) return false;
    const ua = userAgent.toLowerCase();
    return BOT_PATTERNS.some(bot => ua.includes(bot));
}
// ────────────────────────────────────────────────────────

// ─── GEO-BLOCKED RESPONSE ──────────────────────────────
// Minimal on-brand 451 page for visitors from blocked regions.
const GEO_BLOCKED_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Not Available — Bertrand Brands</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0a0a0a;
            color: #fafafa;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
        }
        .geo-block { max-width: 420px; }
        .geo-block__logo {
            width: 40px; height: 40px;
            margin-bottom: 1.5rem;
            opacity: 0.8;
        }
        .geo-block__title {
            font-size: 1.125rem;
            font-weight: 400;
            letter-spacing: 0.01em;
            margin-bottom: 0.75rem;
        }
        .geo-block__message {
            font-size: 0.875rem;
            color: #737373;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <main class="geo-block">
        <img src="/assets/dot-logomark.svg" alt="" class="geo-block__logo" width="40" height="40" style="filter: brightness(0) invert(1);">
        <h1 class="geo-block__title">This site serves Canadian clients only.</h1>
        <p class="geo-block__message">Bertrand Brands is a studio based in Sudbury, Ontario, serving businesses across Canada. If you believe this is an error, contact us at hello@bertrandgroup.ca</p>
    </main>
</body>
</html>`;
// ────────────────────────────────────────────────────────

export const config = {
    matcher: '/((?!api|assets|styles|scripts|components|favicon|apple-touch|og-image|robots|sitemap|llms|fonts).*)',
};

/**
 * Division entry page HTML for brands.bertrandgroup.ca
 * Indexable by search engines, auto-redirects to bertrandbrands.ca after 5s
 */
function divisionEntryPage() {
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bertrand Brands — Brand &amp; Web Systems | A Division of Bertrand Group</title>
    <meta name="description" content="Bertrand Brands is the brand, web, and systems design division of Bertrand Group. Brand strategy, web systems, and digital platforms for businesses that value clarity. Based in Sudbury, Ontario.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://brands.bertrandgroup.ca">
    <meta property="og:title" content="Bertrand Brands — Brand & Web Systems | A Division of Bertrand Group">
    <meta property="og:description" content="Brand, web, and systems design division of Bertrand Group. Based in Sudbury, Ontario.">
    <meta property="og:url" content="https://brands.bertrandgroup.ca">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_CA">
    <meta property="og:site_name" content="Bertrand Group">
    <meta property="og:image" content="https://bertrandbrands.ca/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Bertrand Brands — Brand & Web Systems">
    <meta http-equiv="refresh" content="5;url=https://bertrandbrands.ca">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Bertrand Brands",
        "alternateName": "Bertrand Group | Brand & Web Systems",
        "description": "Brand, web, and systems design division of Bertrand Group. Based in Greater Sudbury, Ontario.",
        "url": "https://bertrandbrands.ca",
        "logo": "https://bertrandbrands.ca/assets/dot-logomark.svg",
        "email": "hello@bertrandgroup.ca",
        "telephone": "+17054133705",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Greater Sudbury",
            "addressRegion": "Ontario",
            "addressCountry": "CA"
        },
        "parentOrganization": {
            "@type": "Organization",
            "name": "Bertrand Group",
            "url": "https://bertrandgroup.ca"
        },
        "sameAs": [
            "https://bertrandbrands.ca",
            "https://bertrandgroup.ca"
        ]
    }
    </script>
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0a0a0a;
            color: #fafafa;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
        }
        .entry {
            max-width: 480px;
        }
        .entry__logo {
            width: 48px;
            height: 48px;
            margin-bottom: 1.5rem;
        }
        .entry__division {
            font-size: 0.75rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #a3a3a3;
            margin-bottom: 0.75rem;
        }
        .entry__name {
            font-size: 1.5rem;
            font-weight: 300;
            letter-spacing: 0.02em;
            margin-bottom: 0.5rem;
        }
        .entry__sub {
            font-size: 0.875rem;
            color: #737373;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        .entry__link {
            display: inline-block;
            padding: 0.75rem 2rem;
            border: 1px solid rgba(217, 119, 6, 0.4);
            border-radius: 8px;
            color: #D97706;
            text-decoration: none;
            font-size: 0.875rem;
            letter-spacing: 0.04em;
            transition: border-color 0.2s ease, background 0.2s ease;
        }
        .entry__link:hover {
            border-color: #D97706;
            background: rgba(217, 119, 6, 0.08);
        }
        .entry__parent-link {
            color: #a3a3a3;
            text-decoration: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
            transition: color 0.2s ease, border-color 0.2s ease;
        }
        .entry__parent-link:hover {
            color: #fafafa;
            border-color: rgba(255, 255, 255, 0.3);
        }
        .entry__redirect {
            margin-top: 1.5rem;
            font-size: 0.75rem;
            color: #525252;
        }
    </style>
</head>
<body>
    <main class="entry" role="main">
        <img src="https://bertrandbrands.ca/assets/dot-logomark.svg" alt="Bertrand Brands logomark" class="entry__logo" width="48" height="48" style="filter: brightness(0) invert(1);">
        <p class="entry__division">A division of <a href="https://bertrandgroup.ca" class="entry__parent-link">Bertrand Group</a></p>
        <h1 class="entry__name">Bertrand Brands</h1>
        <p class="entry__sub">Brand, web, and systems design studio based in Sudbury, Ontario. Strategy, websites, and digital platforms for businesses that value clarity.</p>
        <a href="https://bertrandbrands.ca" class="entry__link">Visit bertrandbrands.ca &rarr;</a>
        <p class="entry__redirect">Redirecting automatically&hellip;</p>
    </main>
</body>
</html>`, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}

export default function middleware(request) {
    const hostname = request.headers.get('host') || '';
    const url = new URL(request.url);

    // brands.bertrandgroup.ca → division entry page (root) or 301 redirect (deep links)
    if (hostname === 'brands.bertrandgroup.ca' || hostname === 'www.brands.bertrandgroup.ca') {
        if (url.pathname === '/' || url.pathname === '') {
            return divisionEntryPage();
        }
        url.hostname = 'bertrandbrands.ca';
        url.port = '';
        return Response.redirect(url.toString(), 301);
    }

    // www.bertrandbrands.ca → bertrandbrands.ca (canonical)
    if (hostname === 'www.bertrandbrands.ca') {
        url.hostname = 'bertrandbrands.ca';
        url.port = '';
        return Response.redirect(url.toString(), 301);
    }

    if (hostname.startsWith('group.')) {
        return Response.redirect('https://bertrandgroup.ca', 301);
    }

    // ─── Geo-fencing (country allowlist) ────────────────────
    // Env var format: "CA" or "CA,US" (comma-separated ISO country codes)
    // Empty or unset = no geo-fencing (all countries allowed).
    // Bypass cookie and ?bypass param skip the check.
    const allowedCountries = (process.env.GEO_ALLOWED_COUNTRIES || '')
        .split(',')
        .map(c => c.trim().toUpperCase())
        .filter(Boolean);

    if (allowedCountries.length > 0) {
        const cookies = request.headers.get('cookie') || '';
        const hasGeoBypass = cookies.includes('bb_geo_bypass=1');
        // Magic-link session holders bypass geo — they've been authorized
        // by the admin who issued their link, so country of access doesn't
        // matter. Covers pricing gate, booking gate, and questionnaire.
        const hasMagicLinkSession = /\bbb_(pricing|booking|questionnaire)_session=/.test(cookies);

        if (!hasGeoBypass && !hasMagicLinkSession && !url.searchParams.has('bypass')) {
            // Let known bots through so Google can index, ads can verify,
            // and social platforms can generate link previews.
            const userAgent = request.headers.get('user-agent') || '';
            if (!isKnownBot(userAgent)) {
                const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();

                if (country && !allowedCountries.includes(country)) {
                    return new Response(GEO_BLOCKED_HTML, {
                        status: 451,
                        headers: { 'Content-Type': 'text/html; charset=utf-8' },
                    });
                }
            }
        }
    }
    // ─────────────────────────────────────────────────────

    // ─── Maintenance gate ───────────────────────────────
    if (MAINTENANCE_MODE) {
        // Allow the maintenance page itself
        if (url.pathname === '/maintenance') {
            return next();
        }

        // ?bypass sets a cookie to skip the gate (for owner/dev access)
        if (url.searchParams.has('bypass')) {
            const response = next();
            response.headers.set('Set-Cookie', 'bb_maintenance_bypass=1; Path=/; Max-Age=86400; SameSite=Lax');
            return response;
        }

        // Check for bypass cookie
        const cookies = request.headers.get('cookie') || '';
        if (cookies.includes('bb_maintenance_bypass=1')) {
            return next();
        }

        // Rewrite everything else to the maintenance page
        return rewrite('/maintenance');
    }
    // ────────────────────────────────────────────────────

    return next();
}

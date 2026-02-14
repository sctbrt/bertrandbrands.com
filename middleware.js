import { next } from '@vercel/functions';

export const config = {
    matcher: '/((?!api|assets|styles|scripts|components|favicon|apple-touch|og-image|robots|sitemap|llms).*)',
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
    <meta name="description" content="Bertrand Brands is the brand, web, and systems design division of Bertrand Group. Visit bertrandbrands.ca for services, pricing, and booking.">
    <link rel="canonical" href="https://brands.bertrandgroup.ca">
    <meta property="og:title" content="Bertrand Brands — Brand & Web Systems">
    <meta property="og:description" content="Brand, web, and systems design division of Bertrand Group.">
    <meta property="og:url" content="https://brands.bertrandgroup.ca">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://bertrandbrands.ca/og-image.png">
    <meta http-equiv="refresh" content="5;url=https://bertrandbrands.ca">
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
        .entry__redirect {
            margin-top: 1.5rem;
            font-size: 0.75rem;
            color: #525252;
        }
    </style>
</head>
<body>
    <div class="entry">
        <img src="https://bertrandbrands.ca/assets/bg-brands-logomark.png" alt="" class="entry__logo">
        <p class="entry__division">A division of Bertrand Group</p>
        <h1 class="entry__name">Bertrand Brands</h1>
        <p class="entry__sub">Brand, web, and systems design studio based in Sudbury, Ontario.</p>
        <a href="https://bertrandbrands.ca" class="entry__link">Visit bertrandbrands.ca</a>
        <p class="entry__redirect">Redirecting automatically&hellip;</p>
    </div>
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

    // brands.bertrandgroup.ca → division entry page (root) or redirect (deep links)
    if (hostname === 'brands.bertrandgroup.ca' || hostname === 'www.brands.bertrandgroup.ca') {
        const url = new URL(request.url);
        if (url.pathname === '/' || url.pathname === '') {
            return divisionEntryPage();
        }
        url.hostname = 'bertrandbrands.ca';
        url.port = '';
        return Response.redirect(url.toString(), 301);
    }

    // Legacy domains → new canonical
    if (
        hostname === 'bertrandbrands.com' ||
        hostname === 'www.bertrandbrands.com' ||
        hostname === 'www.bertrandbrands.ca'
    ) {
        const url = new URL(request.url);
        url.hostname = 'bertrandbrands.ca';
        url.port = '';
        return Response.redirect(url.toString(), 301);
    }

    if (hostname.startsWith('group.')) {
        return Response.redirect('https://bertrandgroup.ca', 301);
    }

    return next();
}

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
        "logo": "https://bertrandbrands.ca/assets/bg-brands-logomark.png",
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
        <img src="https://bertrandbrands.ca/assets/bg-brands-logomark.png" alt="Bertrand Brands logomark" class="entry__logo" width="48" height="48">
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

    // brands.bertrandgroup.ca → division entry page (root) or 301 redirect (deep links)
    if (hostname === 'brands.bertrandgroup.ca' || hostname === 'www.brands.bertrandgroup.ca') {
        const url = new URL(request.url);
        if (url.pathname === '/' || url.pathname === '') {
            return divisionEntryPage();
        }
        url.hostname = 'bertrandbrands.ca';
        url.port = '';
        return Response.redirect(url.toString(), 301);
    }

    // www.bertrandbrands.ca → bertrandbrands.ca (canonical)
    if (hostname === 'www.bertrandbrands.ca') {
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

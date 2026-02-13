import { next } from '@vercel/functions';

export const config = {
    matcher: '/((?!api|assets|styles|scripts|components|favicon|apple-touch|og-image|robots|sitemap|llms).*)',
};

export default function middleware(request) {
    const hostname = request.headers.get('host') || '';

    // Redirect old domains to new bertrandgroup.ca structure
    if (
        hostname === 'bertrandbrands.com' ||
        hostname === 'www.bertrandbrands.com' ||
        hostname === 'bertrandbrands.ca' ||
        hostname === 'www.bertrandbrands.ca'
    ) {
        const url = new URL(request.url);
        url.hostname = 'brands.bertrandgroup.ca';
        url.port = '';
        return Response.redirect(url.toString(), 301);
    }

    if (hostname.startsWith('group.')) {
        return Response.redirect('https://bertrandgroup.ca', 301);
    }

    return next();
}

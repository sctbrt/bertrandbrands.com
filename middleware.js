import { rewrite, next } from '@vercel/functions';

export const config = {
    matcher: '/((?!api|assets|styles|scripts|components|favicon|apple-touch|og-image|robots|sitemap|llms).*)',
};

export default function middleware(request) {
    const hostname = request.headers.get('host') || '';

    if (hostname.startsWith('group.')) {
        return rewrite(new URL('/pages/group/index', request.url));
    }

    return next();
}

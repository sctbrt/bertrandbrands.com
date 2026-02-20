import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://bertrandbrands.ca',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  vite: {
    css: {
      devSourcemap: true,
    },
  },
  redirects: {
    // Homepage anchors (temporary)
    '/about': { destination: '/#about', status: 302 },
    '/services': { destination: '/#packages', status: 302 },
    '/process': { destination: '/#process', status: 302 },
    '/how-it-works': { destination: '/#process', status: 302 },
    '/contact': { destination: '/#contact', status: 302 },
    '/portal': { destination: '/#portal', status: 302 },
    '/client-portal': { destination: '/#portal', status: 302 },
    '/login': { destination: '/#portal', status: 302 },

    // Convenience (temporary)
    '/start-here': { destination: '/intake', status: 302 },
    '/brand-website-starter-map': { destination: '/#packages', status: 302 },

    // V10 → Tier migration: /start → /intake (permanent)
    '/start': { destination: '/intake', status: 301 },

    // V10 service redirects (permanent)
    '/book': { destination: '/intake', status: 301 },
    '/focus-studio': { destination: '/#packages', status: 301 },
    '/core-services': { destination: '/#packages', status: 301 },
    '/core-systems': { destination: '/#packages', status: 301 },
    '/exploratory': { destination: '/intake', status: 301 },
    '/clarity-session': { destination: '/intake', status: 301 },
    '/starter-site': { destination: '/amber/starter-onepage', status: 301 },
    '/one-page-redesign': { destination: '/violet/foundation-growth', status: 301 },
    '/brandmark': { destination: '/amber/starter-onepage', status: 301 },
    '/brand-system-reset': { destination: '/violet/brand-platform', status: 301 },
    '/digital-platform-build': { destination: '/violet/brand-platform', status: 301 },
    '/integrated-brand-platform': { destination: '/violet/brand-platform', status: 301 },
    '/website-conversion-snapshot': { destination: '/intake', status: 301 },
    '/brand-clarity-diagnostic': { destination: '/intake', status: 301 },

    // Intake redirects (permanent)
    '/intake/exploratory': { destination: '/intake', status: 301 },
    '/intake/website-conversion-snapshot': { destination: '/intake', status: 301 },
    '/intake/brand-clarity-diagnostic': { destination: '/intake', status: 301 },

    // Legacy route redirects (permanent → /intake)
    '/direction-session': { destination: '/intake', status: 301 },
    '/business-clarity-call': { destination: '/intake', status: 301 },
    '/brand-clarity-call': { destination: '/intake', status: 301 },
    '/website-clarity-call': { destination: '/intake', status: 301 },
    '/founders-direction-check': { destination: '/intake', status: 301 },
    '/founders-check': { destination: '/intake', status: 301 },
    '/intake/direction-session': { destination: '/intake', status: 301 },
    '/intake/business-clarity-call': { destination: '/intake', status: 301 },
    '/intake/brand-clarity-call': { destination: '/intake', status: 301 },
    '/intake/website-clarity-call': { destination: '/intake', status: 301 },
    '/intake/founders-check': { destination: '/intake', status: 301 },

    // Campaign aliases (permanent)
    '/sudbury-brand-website-clarity': { destination: '/sudbury', status: 301 },
    '/sudbury-small-business-website-leads': { destination: '/sudbury', status: 301 },
    '/website-snapshot-review': { destination: '/intake', status: 301 },
    '/intake/website-snapshot-review': { destination: '/intake', status: 301 },

    // Tier migration (permanent → new tier pages)
    '/strategic-brand-review': { destination: '/violet/brand-platform', status: 301 },
    '/brand-reset': { destination: '/violet/brand-platform', status: 301 },
    '/full-brand-platform-reset': { destination: '/violet/brand-platform', status: 301 },

    // V10 package → tier redirects (permanent)
    '/packages/starter': { destination: '/amber/starter-onepage', status: 301 },
    '/packages/refresh': { destination: '/violet/foundation-growth', status: 301 },
    '/packages/platform': { destination: '/violet/brand-platform', status: 301 },

    // Tier convenience aliases (permanent)
    '/build': { destination: '/amber', status: 301 },
    '/transform': { destination: '/violet', status: 301 },
    '/blue': { destination: '/care', status: 301 },
  },
});

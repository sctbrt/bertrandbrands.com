import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://brands.bertrandgroup.ca',
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
    // Anchor redirects (temporary)
    '/about': { destination: '/#about', status: 302 },
    '/services': { destination: '/#services', status: 302 },
    '/process': { destination: '/#process', status: 302 },
    '/how-it-works': { destination: '/#process', status: 302 },
    '/contact': { destination: '/#contact', status: 302 },
    '/portal': { destination: '/#portal', status: 302 },
    '/client-portal': { destination: '/#portal', status: 302 },
    '/login': { destination: '/#portal', status: 302 },

    // Convenience redirects (temporary)
    '/intake': { destination: '/focus-studio', status: 302 },
    '/start': { destination: '/focus-studio', status: 302 },
    '/start-here': { destination: '/focus-studio', status: 302 },
    '/brand-website-starter-map': { destination: '/#services', status: 302 },

    // Legacy route redirects (permanent)
    '/direction-session': { destination: '/exploratory', status: 301 },
    '/business-clarity-call': { destination: '/exploratory', status: 301 },
    '/brand-clarity-call': { destination: '/exploratory', status: 301 },
    '/website-clarity-call': { destination: '/exploratory', status: 301 },
    '/founders-direction-check': { destination: '/exploratory', status: 301 },
    '/founders-check': { destination: '/exploratory', status: 301 },

    // Legacy intake redirects (permanent)
    '/intake/direction-session': { destination: '/intake/exploratory', status: 301 },
    '/intake/business-clarity-call': { destination: '/intake/exploratory', status: 301 },
    '/intake/brand-clarity-call': { destination: '/intake/exploratory', status: 301 },
    '/intake/website-clarity-call': { destination: '/intake/exploratory', status: 301 },
    '/intake/founders-check': { destination: '/intake/exploratory', status: 301 },

    // Campaign aliases (permanent)
    '/sudbury-brand-website-clarity': { destination: '/sudbury', status: 301 },
    '/sudbury-small-business-website-leads': { destination: '/sudbury', status: 301 },
    '/website-snapshot-review': { destination: '/website-conversion-snapshot', status: 301 },
    '/intake/website-snapshot-review': { destination: '/intake/website-conversion-snapshot', status: 301 },

    // Service aliases (permanent)
    '/core-systems': { destination: '/core-services', status: 301 },

    // Tier migration redirects (permanent)
    '/strategic-brand-review': { destination: '/brand-system-reset', status: 301 },
    '/brand-reset': { destination: '/brand-system-reset', status: 301 },
    '/full-brand-platform-reset': { destination: '/integrated-brand-platform', status: 301 },
  },
});

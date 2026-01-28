# CLAUDE.md - Project Guide for Claude Code

## Project Overview

**Bertrand Brands** - Premium brand and web systems design studio website. A sophisticated single-page marketing site with serverless backend functionality hosted on Vercel.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Hosting**: Vercel (static site + serverless functions)
- **Database**: Vercel Postgres
- **Email**: Resend API
- **Notifications**: Pushover API
- **Forms**: Formspree
- **Analytics**: Google Analytics, Google Tag Manager

## Project Structure

```
├── src/                    # Static site source
│   ├── index.html          # Main SPA (entry point)
│   ├── styles/
│   │   ├── tokens.css      # Design system variables
│   │   └── main.css        # Main stylesheet
│   ├── pages/              # Landing pages (ads/, intake/, services/)
│   └── assets/             # Logos & images
├── api/                    # Vercel serverless functions
│   ├── notify.js           # Visitor notifications → Pushover
│   ├── pricing/            # Magic link pricing gate system
│   └── lib/db.js           # Database utilities
├── public/                 # Static assets
├── vercel.json             # Deployment config & rewrites
└── package.json            # Dependencies
```

## Key Files

| File | Purpose |
|------|---------|
| `src/index.html` | Main single-page application |
| `src/styles/main.css` | Primary stylesheet (~3k lines) |
| `src/styles/tokens.css` | CSS custom properties/design tokens |
| `api/pricing/*.js` | Magic link authentication flow |
| `api/lib/db.js` | Vercel Postgres utilities |
| `vercel.json` | Routing, rewrites, security headers |

## Development Commands

```bash
# Local development with Vercel CLI
vercel dev

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Design System

- **Color scheme**: Dark mode (#0a0a0a background)
- **Accent color**: Amber (#D97706)
- **Fonts**: Inter (sans), Fraunces (display), Source Serif 4 (body)
- **Effects**: Glassmorphism (backdrop-blur), gradient spotlights

## Key Features

### 1. Cinematic Intro Animation
- Full-screen animated intro with logo, gradient glows, grid
- 4-second sequence with scroll-lock during animation
- Respects `prefers-reduced-motion`

### 2. Fullpage Scroll System
- Smart section snapping with overflow handling
- URL params: `?scroll=fullpage` (default), `?scroll=snap`, `?scroll=free`
- Keyboard: Arrow keys, Page Up/Down, Space

### 3. Pricing Gate (Magic Links)
- Gated tiers require email opt-in
- Flow: Email → Resend sends token → 15-min validity → 60-min session
- Database: `magic_links` and `pricing_sessions` tables
- Security: Token hashing, rate limiting (3/hr per email)

### 4. Visitor Tracking
- Page loads trigger Pushover notifications with geolocation
- Form submissions logged with full details

## Code Patterns

### JavaScript
- **IIFE pattern** for feature encapsulation
- **Intersection Observer** for scroll animations
- **Event delegation** via data attributes (`[data-pricing-trigger]`)
- **Async/await** for all API calls
- **Graceful degradation** for reduced-motion

### CSS
- **CSS Custom Properties** for theming
- **Mobile-first** media queries
- **BEM-ish naming** for components

## Security

- CSP headers configured in `vercel.json`
- HSTS, X-Frame-Options, X-XSS-Protection enabled
- HttpOnly, Secure, SameSite cookies
- Parameterized SQL queries (no injection)
- Rate limiting on sensitive endpoints

## Environment Variables (Vercel)

```
POSTGRES_URL          # Vercel Postgres connection
RESEND_API_KEY        # Email delivery
PUSHOVER_USER_KEY     # Push notifications
PUSHOVER_API_TOKEN    # Push notifications
```

## Common Tasks

### Adding a new landing page
1. Create HTML in `src/pages/ads/` or `src/pages/services/`
2. Add rewrite rule in `vercel.json` if needed

### Modifying the pricing gate
1. Backend logic in `api/pricing/`
2. Frontend triggers via `[data-pricing-trigger]` attributes
3. Session validation in `api/pricing/check-access.js`

### Updating styles
1. Design tokens in `src/styles/tokens.css`
2. Component styles in `src/styles/main.css`

## Notes

- No build step required for frontend (vanilla HTML/CSS/JS)
- Inline JavaScript in `index.html` for performance
- Mobile gestures: pinch-to-zoom disabled, tap anywhere to begin triggers Header Hero transition

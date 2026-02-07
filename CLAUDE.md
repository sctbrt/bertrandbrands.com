# CLAUDE.md - Bertrand Brands

## Version 5.6.0 (Current)

This document is the **Bertrand Brands-specific** guide. For full ecosystem context, see `/Users/scottbertrand/Sites/scottbertrand.com/CLAUDE.md`.

---

## 1. Operating Context

### 1.1 Role & Boundaries

**Bertrand Brands** is a Sudbury-based brand, web, and systems studio led by Scott Bertrand.

**Scott handles:**
- Brand strategy & judgment
- Design direction & taste
- Client communication

**Claude handles:**
- Coding, refactors, audits
- Structured documentation
- System integrity and consistency

### 1.2 Deployment Protocol (CRITICAL)

**Vercel has a 100 deploy/day limit. Do not waste deploys.**

**Rules:**
1. **NEVER deploy after a single change**
2. **Batch changes** — deploy only when:
   - At least 5 minor changes accumulated, OR
   - At least 3 major changes accumulated, OR
   - Scott explicitly requests a deploy
3. **Always use local preview first** — run `vercel dev` to verify changes before any deploy
4. **Track pending changes** — maintain awareness of what's ready to deploy
5. **Ask before deploying** — "Ready to deploy these X changes?" unless Scott initiated

**What counts as a change:**
- Minor: text edits, color tweaks, spacing adjustments, typo fixes
- Major: new sections, structural changes, new pages, feature additions

**Workflow:**
1. Make change
2. Test locally (`vercel dev`)
3. Confirm with Scott
4. Repeat until threshold met
5. Deploy once with meaningful commit message

### 1.3 Core Operating Philosophy

**Structure Reduces Anxiety**

All systems must prioritize:
- Clarity
- Predictability
- Low cognitive overhead

Avoid cleverness. Favor legibility and durability.

**BRIGHTS Values Are Non-Negotiable**

All decisions must align with BRIGHTS:
- **B**elonging
- **R**espect
- **I**ntegrity
- **G**rowth
- **H**ealth (mental + physical safety)
- **T**rust (care, reliability)
- **S**afety

If a technical or UX decision introduces confusion, pressure, or ambiguity, it violates BRIGHTS.

### 1.4 Service Architecture (LOCKED — Feb 2026)

Bertrand Brands operates under **THREE strictly hierarchical service tiers**.

**Mental Model:** Conversation → Execution → Transformation

**Hard Constraints:**
- Tier 1: Exploratory → **2 offerings only**
- Tier 2: Focus Studio → **3 offerings only**
- Tier 3: Core Services → **Maximum 5 offerings**

Claude must not add services, rename tiers, or exceed these limits.

---

**Tier 1 — B Exploratory** (Entry Layer)

Purpose: Low-friction entry, qualification, and clarity. Not asset delivery.

| Offering | Price | Duration | Notes |
|----------|-------|----------|-------|
| Introductory Direction Call | Free | ~20 min | Live video. No prep, no deliverables. Fit and high-level direction only. |
| Brand or Website Clarity Session | $145 CAD | ~45 min | Live video. Working session (diagnosis + next steps). Unlocks Focus Studio or Core Services. |

**Rules:**
- One free option, one paid option only
- No additional Tier 1 services allowed
- Tier 1 never includes execution work

---

**Tier 2 — B Focus Studio** (Primary Revenue Engine)

Purpose: Fast, fixed-scope studio work with clear timelines and pricing.

| Offering | Price | Timeline | Notes |
|----------|-------|----------|-------|
| Starter Site | $750 CAD | 1 business day | Template-assisted, fast-launch website. Built for speed and simplicity. |
| One-Page Redesign | $1,250 CAD | 2–3 business days | Fully custom, code-based. No templates, no builders. |
| Brandmark & Visual Identity | $950 CAD | 5–7 business days | Primary brandmark + supporting marks + visual direction. |

**Offering Distinctions (Critical):**
- **Starter Site** = speed & simplicity (template-assisted, managed builder)
- **One-Page Redesign** = custom & crafted (code-based, no templates)
- These are parallel options, not upgrades of each other

**Platform Rule:**
- Do NOT name or foreground the website builder platform (e.g., Wix) in client-facing copy
- Position as "Starter" or "Launch" solution, not "builder site"

**Rules:**
- Fixed scope only
- Public pricing required
- No discovery-heavy or multi-week work
- No Brand Resets
- No Brand Moments / events

Focus Studio is the primary revenue engine and Google Ads entry point.

---

**Tier 3 — B Core Services** (Strategic Work)

Purpose: Discovery-led, multi-week engagements for brands requiring structural clarity.

| Offering | Pricing | Notes |
|----------|---------|-------|
| Strategic Brand Review | Private | Discovery-led |
| Digital Platform Build | Private | Multi-page website built as a brand platform |
| Brand Reset | Private | Strategic realignment of positioning and system |
| Full Brand + Platform Reset | Private | End-to-end brand and digital reset |
| Brand Moments & Micro-Activations | Private | By request only. See Section 21. |

**Rules:**
- 50% deposit to begin
- No public pricing
- Always discovery-led
- Never sold as an entry service

---

**Key Principles:**
- No open-ended scope
- No vague deliverables
- No ad-hoc calls outside defined services
- No hourly/time-based pricing language
- AI efficiency increases margin, not discount justification
- Prices ≤$1,500 are shown publicly; prices ≥$3,000 use private pricing

**Never invent new services, pricing, or scopes.**

### 1.5 Visual Hierarchy (LOCKED)

**Homepage Section Order (Top to Bottom):**
1. **B Focus Studio** — Primary, largest, most prominent
2. **B Core Services** — Includes both Reviews and Builds & Resets
3. **B Exploratory Sessions** — Subtle, contextual ("Not sure where to start?")

**Key Visual Rules:**
- Focus Studio appears FIRST (commercial priority, not tier priority)
- Exploratory Sessions is Tier 1 conceptually but visually subtle (side door, not front door)
- Focus Studio uses solid borders; Exploratory uses dashed borders
- Both sub-brands use shared B logomark with differentiated wordmarks

**Navigation Order:**
1. Focus Studio (first in dropdown)
2. Core Services (second in dropdown)

### 1.6 AI Positioning (Critical)

**AI is never positioned as the product.**

Externally:
- Language centers on systems, clarity, structure
- AI is implied, not advertised

Internally:
- Claude handles execution
- ChatGPT assists with strategy, synthesis, and language
- Human judgment remains the authority

If a solution makes AI visible to clients, flag it as a risk.

### 1.7 Decision Rules

When unsure, default to:
1. Simpler
2. Clearer
3. More documented
4. Less emotionally demanding for the user

If something:
- Increases cognitive load
- Creates edge-case anxiety
- Requires constant explanation

→ It should be redesigned.

### 1.8 Success Criteria

A successful implementation:
- Feels calm
- Requires minimal explanation
- Is easy to maintain
- Can be reused across brands
- Supports future delegation

**Bertrand Brands is not scaling chaos—it is scaling clarity.**

---

## 2. Project Overview

**Bertrand Brands** — Premium brand and web systems design studio website. A sophisticated single-page marketing site with serverless backend functionality hosted on Vercel.

**Domain**: bertrandbrands.com
**Purpose**: Professional services showcase, lead generation, brand expression

---

## 3. Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Hosting**: Vercel (static site + serverless functions)
- **Database**: Vercel Postgres
- **Email**: Resend API
- **Notifications**: Pushover API
- **Forms**: Formspree
- **Analytics**: Google Analytics, Google Tag Manager (CSP-permitted, not yet implemented)

---

## 4. Project Structure

```
├── src/                           # Static site source
│   ├── index.html                 # Main SPA (entry point)
│   ├── 404.html                   # Error page
│   ├── thanks.html                # Formspree redirect (legacy)
│   ├── sitemapX.html              # Ecosystem sitemap
│   ├── styles/
│   │   ├── tokens.css             # Design system variables
│   │   └── main.css               # Main stylesheet (~5,700 lines)
│   ├── scripts/
│   │   ├── main.js                # Main site functionality
│   │   └── dot-grid-about.js      # About section dot grid animation
│   ├── components/
│   │   ├── header.js              # Universal header injector
│   │   ├── header.html            # Header component template
│   │   └── visitor-notify.js      # Visitor notification script
│   ├── pages/
│   │   ├── ads/                   # Google Ads landing pages
│   │   │   ├── focus-studio.html
│   │   │   ├── core-services.html
│   │   │   ├── sudbury-focus-studio.html
│   │   │   ├── website-conversion-snapshot.html
│   │   │   └── brand-clarity-diagnostic.html
│   │   ├── services/              # Service detail pages
│   │   │   ├── starter-site.html
│   │   │   ├── one-page-redesign.html
│   │   │   ├── brandmark.html
│   │   │   ├── strategic-brand-review.html
│   │   │   ├── digital-platform-build.html
│   │   │   ├── brand-reset.html
│   │   │   ├── full-brand-platform-reset.html
│   │   │   └── website-audit.html          # Legacy (V3 theme)
│   │   ├── intake/                # Intake form pages
│   │   │   ├── exploratory.html
│   │   │   ├── brand-clarity-diagnostic.html
│   │   │   └── website-conversion-snapshot.html
│   │   ├── booking/
│   │   │   └── schedule.html      # Calendly booking widget
│   │   ├── book.html              # Booking page
│   │   ├── exploratory.html       # Exploratory tier landing
│   │   ├── clarity-session.html   # Clarity session page
│   │   ├── scottbertrand.html     # Personal cross-promotion
│   │   ├── payment-confirmed.html
│   │   ├── booking-confirmed.html
│   │   └── snapshot-confirmed.html
│   └── assets/                    # Logos & images
├── api/                           # Vercel serverless functions
│   ├── notify.js                  # Visitor notifications → Pushover
│   ├── pricing/                   # Magic link pricing gate
│   │   ├── request-access.js      # Send magic link email
│   │   ├── access.js              # Consume token, create session
│   │   ├── check-access.js        # Validate session cookie
│   │   └── logout.js              # Clear session
│   ├── booking/                   # Magic link booking gate
│   │   ├── access.js              # Consume token, create session
│   │   ├── check-access.js        # Validate session cookie
│   │   └── logout.js              # Clear session
│   ├── snapshot/
│   │   └── book.js                # Snapshot booking endpoint
│   └── _lib/                      # Shared helpers (underscore prefix excludes from function count)
│       ├── db.js                  # Database utilities
│       ├── crypto.js              # Token hashing (SHA-256)
│       ├── cookies.js             # Secure cookie builder
│       └── html.js                # HTML escaping + error page template
├── scripts/
│   └── init-db.js                 # Database table initialization
├── public/                        # Static assets (favicons, OG image, manifest)
├── vercel.json                    # Deployment config, rewrites, redirects, headers
├── package.json                   # Dependencies (@vercel/postgres, resend)
└── CLAUDE.md                      # This file
```

---

## 5. V5.0 Design Philosophy

### 5.1 Core Aesthetic Principles

V5.0.0 builds on the refined, minimal, architectural approach with **performance-first optimizations**:

- **Restraint over spectacle** — Effects should be barely perceptible
- **Content-first** — Design serves content, never competes with it
- **Material realism** — Glass and lighting should feel physical, not digital
- **Time-aware theming** — Sites respond to time of day (Canada/Eastern)

### 5.2 Bertrand Brands Expression

Bertrand Brands is **more expressive** than scottbertrand.com:

- RGB ethereal effects permitted (subtly)
- Animated gradients on key CTAs
- Mobile hamburger menu with transitions
- RGB border animations on secondary CTAs
- Ethereal text glow on hover states
- Three RGB spotlights (mobile hero only)

### 5.3 Organic Dynamic Lighting (LOCKED)

Ambient spotlights throughout the site use **organic breathing animations** to create a living, ethereal feel without distraction.

**Core Principles:**
- Spotlights should feel alive but never demand attention
- Movement is slow, asymmetric, and naturalistic
- Multiple spotlights use counter-rhythms (different durations, offset timing)
- Opacity, scale, and shape change together for depth
- Shape morphing creates amorphous, fluid light sources

**Animation Pattern:**

```css
/* Standard organic breathing pattern with shape morphing */
@keyframes organicBreathe {
    0%, 100% {
        opacity: 0.85;
        transform: translate(0, 0) scale(1);
        border-radius: 50% 50% 50% 50%;
    }
    15% {
        opacity: 0.95;
        transform: translate(15px, -20px) scale(1.06);
        border-radius: 60% 40% 55% 45%;
    }
    35% {
        opacity: 0.75;
        transform: translate(-10px, 10px) scale(0.94);
        border-radius: 45% 55% 40% 60%;
    }
    50% {
        opacity: 0.9;
        transform: translate(20px, 5px) scale(1.02);
        border-radius: 55% 45% 60% 40%;
    }
    70% {
        opacity: 0.8;
        transform: translate(-5px, -15px) scale(0.97);
        border-radius: 40% 60% 45% 55%;
    }
    85% {
        opacity: 0.92;
        transform: translate(8px, 12px) scale(1.04);
        border-radius: 58% 42% 48% 52%;
    }
}
```

**Implementation Rules:**
- Duration: 15–25 seconds per cycle (slow enough to be subliminal)
- Use 5–7 keyframes for organic feel (avoid symmetric 0/50/100 patterns)
- Offset secondary spotlights by 0.3–0.5s delay
- Scale range: 0.94–1.06 (subtle, never jarring)
- Opacity range: 0.7–0.95 (visible but not attention-grabbing)
- Translate range: ±20px max (gentle drift, not bounce)
- Border-radius range: 40%–60% per corner (subtle blob morphing)

**Color Application:**
- Amber (`rgba(217, 119, 6, x)`) — Primary accent, used in header and contact
- Violet (`rgba(139, 92, 246, x)`) — Focus Studio tier accent
- Blue (`rgba(37, 99, 235, x)`) — Exploratory tier accent

**Mobile Optimization:**
- Header ambient lighting stays **enabled** on mobile (per design decision)
- Reduce blur: 60px → 30-35px
- Reduce size: ~60% of desktop dimensions
- Simplify keyframes: Use 2-3 keyframes instead of 5-7
- Extend duration: +2-4 seconds for smoother GPU performance
- Disable `backdrop-filter` on modal/lightbox backdrops for GPU performance

---

## 6. Design Tokens

### 6.1 Colors

```css
/* Dark Theme (Default) */
--bg: #0a0a0a;
--bg-elevated: #111111;
--text: #fafafa;
--text-muted: #a3a3a3;
--text-subtle: #737373;
--accent: #D97706;           /* Amber 600 */
--accent-hover: #B45309;     /* Amber 700 */
--border: rgba(255, 255, 255, 0.08);

/* Light Theme */
--bg: #fafaf8;
--bg-elevated: #ffffff;
--text: #111111;
--text-muted: #666666;
--accent: #B45309;           /* Amber 700 */

/* Glass Properties */
--glass-blur: 12px;
--glass-bg: rgba(255, 255, 255, 0.02);
--glass-border: rgba(255, 255, 255, 0.06);
--glass-edge-highlight: rgba(255, 255, 255, 0.08);
```

### 6.2 Typography

```css
/* Font Families */
--font-display: 'Fraunces', Georgia, serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Type Scale */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### 6.3 Motion

```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;

/* Easings */
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Bertrand Brands: Expressive but purposeful */
```

---

## 7. Key Features

### 7.1 Cinematic Intro Animation

- Full-screen animated intro with logo, gradient glows, grid
- 4-second sequence with scroll-lock during animation
- Respects `prefers-reduced-motion`

### 7.2 Fullpage Scroll System

- Smart section snapping with overflow handling
- URL params: `?scroll=fullpage` (default), `?scroll=snap`, `?scroll=free`
- Keyboard: Arrow keys, Page Up/Down, Space

### 7.3 Pricing Gate (Magic Links)

- Gated tiers require email opt-in
- Flow: Email → Resend sends token → 15-min validity → 4-hour session
- Database: `pricing_magic_links` and `pricing_sessions` tables (created by `scripts/init-db.js`)
- Security: Token hashing, rate limiting (3/hr per email)
- Cookie: `bb_pricing_session` set on `.bertrandbrands.com` domain

### 7.4 Visitor Tracking

- Page loads trigger Pushover notifications with geolocation
- Form submissions logged with full details

---

## 8. Code Patterns

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

---

## 9. Development Commands

```bash
# Local development with Vercel CLI
vercel dev

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 10. Environment Variables

```env
POSTGRES_URL          # Vercel Postgres connection
RESEND_API_KEY        # Email delivery
PUSHOVER_USER_KEY     # Push notifications
PUSHOVER_API_TOKEN    # Push notifications
APP_URL               # CORS origin (defaults to https://bertrandbrands.com)
```

---

## 11. Security

- CSP headers configured in `vercel.json`
- HSTS, X-Frame-Options, X-XSS-Protection enabled
- HttpOnly, Secure, SameSite cookies
- Parameterized SQL queries (no injection)
- Rate limiting on sensitive endpoints (3/hr per email, in-memory IP limiting)
- CORS restricted to `APP_URL` origin (not wildcard)
- Token hashing: SHA256 on all magic link tokens before DB storage

**CSP Note:** The current policy uses `'unsafe-inline'` for both `script-src` and `style-src`. This is required by the inline `<script>` and `<style>` blocks used across landing pages. Removing `'unsafe-inline'` would require externalizing all inline scripts and styles. The policy also lacks `object-src 'none'` — should be added for defense in depth.

---

## 12. Absolute Constraints

### Design

- If an effect is noticeable, it is wrong
- Glass is architectural, not decorative
- Zero gimmicks, zero spectacle
- Content always takes priority over chrome

### Code

- Do NOT add dependencies or frameworks
- Do NOT restructure existing layouts
- Keep diffs minimal
- Preserve existing formatting
- No build step required (vanilla HTML/CSS/JS)

### Motion

- Restrained but expressive (more than scottbertrand.com)
- Respect `prefers-reduced-motion`

### Accessibility

- Maintain WCAG contrast ratios
- Provide fallbacks for `backdrop-filter`
- Do not break keyboard navigation

---

## 13. Related Systems (system-build)

The **Internal System** at `/Users/scottbertrand/Sites/scottbertrand.com/system-build/` powers:

- **dashboard.bertrandbrands.com** — Admin CRM dashboard
- **clients.bertrandbrands.com** — Client portal ("Delivery Room")

See main CLAUDE.md sections 14–16 for locked specs:

- **Section 14**: Client Portal v1 ("Delivery Room")
- **Section 15**: Admin / CRM Dashboard v1
- **Section 16**: Payment Integration v1 (Stripe Payment Links)

**Launched**: Feb 3, 2026

---

## 14. CRM Dashboard Design (V1.1)

The admin dashboard at `dashboard.bertrandbrands.com` follows these design patterns:

### 14.1 Header Breadcrumb

Dynamic breadcrumb showing current section:
```
BERTRAND BRANDS | Customer Relationship Management | {Section}
```
- Brand name is clickable, returns to Overview
- Section updates dynamically based on current route

### 14.2 Navigation Badge Counts

Sidebar nav items show real-time counts for actionable items:
- **Leads**: Count of NEW status leads
- **Invoices**: Count of unpaid invoices (SENT, VIEWED, OVERDUE)

Badges use amber accent color: `bg-amber-500/20 text-amber-400`

### 14.3 Stat Cards

Overview stat cards include:
- **Icons** in top-right corner (subtle, turns amber on hover)
- **Hover animation**: `scale-[1.02]` with border color change
- **Clickable**: Navigate to respective section

### 14.4 Status Badge Color System

Consistent status colors across all pages using semi-transparent backgrounds with borders:

**Lead Statuses:**
- NEW: `bg-amber-500/20 text-amber-400 border-amber-500/30`
- CONTACTED: `bg-sky-500/20 text-sky-400 border-sky-500/30`
- QUALIFIED: `bg-emerald-500/20 text-emerald-400 border-emerald-500/30`
- CONVERTED: `bg-violet-500/20 text-violet-400 border-violet-500/30`
- DISQUALIFIED: `bg-rose-500/20 text-rose-400 border-rose-500/30`
- ARCHIVED: `bg-zinc-500/20 text-zinc-400 border-zinc-500/30`

**Project Statuses:**
- DRAFT: `bg-zinc-500/20 text-zinc-400 border-zinc-500/30`
- PENDING_APPROVAL: `bg-amber-500/20 text-amber-400 border-amber-500/30`
- IN_PROGRESS: `bg-emerald-500/20 text-emerald-400 border-emerald-500/30`
- ON_HOLD: `bg-orange-500/20 text-orange-400 border-orange-500/30`
- COMPLETED: `bg-sky-500/20 text-sky-400 border-sky-500/30`
- CANCELLED: `bg-rose-500/20 text-rose-400 border-rose-500/30`

---

## 15. Common Tasks

### Adding a new landing page

1. Create HTML in `src/pages/ads/` or `src/pages/services/`
2. Add rewrite rule in `vercel.json` if needed

### Modifying the pricing gate

1. Backend logic in `api/pricing/` (this repo's serverless functions)
2. Frontend triggers via `[data-pricing-trigger]` attributes
3. Session validation via cookie check

### Updating styles

1. Design tokens in `src/styles/tokens.css`
2. Component styles in `src/styles/main.css`

---

## 16. Routes Reference

### Exploratory Routes (Tier 1)

**Active Routes:**
- `/exploratory` → Exploratory landing page (serves both offerings)
- `/intake/exploratory` → Exploratory intake form

**Tier 1 Offerings (all via shared intake):**
- Introductory Direction Call (Free, ~20 min)
- Brand or Website Clarity Session ($145, ~45 min)

### Focus Studio Routes (Tier 2)
- `/focus-studio` → B Focus Studio landing page
- `/intake/focus-studio` → B Focus Studio intake form

**Focus Studio Offerings (all via shared intake):**
- Starter Site ($750)
- One-Page Redesign ($1,250)
- Brandmark & Visual Identity ($950)

### Core Services Routes (Tier 3)
- `/core-services` → Core Services landing page

**Core Services Offerings (max 5):**
- Strategic Brand Review
- Digital Platform Build
- Brand Reset
- Full Brand + Platform Reset
- Brand Moments & Micro-Activations (by request only)

### Service Detail Pages
- `/starter-site` → Focus Studio: Starter Site detail
- `/one-page-redesign` → Focus Studio: One-Page Redesign detail
- `/brandmark` → Focus Studio: Brandmark & Visual Identity detail
- `/strategic-brand-review` → Core Services detail
- `/digital-platform-build` → Core Services detail
- `/brand-reset` → Core Services detail
- `/full-brand-platform-reset` → Core Services detail

### Google Ads Landing Pages
- `/sudbury` → Sudbury-specific Focus Studio landing (local campaign)
- `/website-conversion-snapshot` → Website Snapshot Diagnostic landing
- `/brand-clarity-diagnostic` → Brand Clarity Diagnostic landing
- `/intake/website-conversion-snapshot` → Snapshot intake form
- `/intake/brand-clarity-diagnostic` → Diagnostic intake form

### Booking & Confirmation Routes
- `/book` → Main booking page
- `/booking/schedule` → Calendly inline widget
- `/clarity-session` → Clarity session page
- `/payment-confirmed` → Post-payment confirmation
- `/booking-confirmed` → Post-booking confirmation
- `/snapshot-confirmed` → Post-snapshot confirmation

### Utility Routes
- `/scottbertrand` → Scott Bertrand cross-promotion page

### Campaign Aliases (redirects)
- `/sudbury-brand-website-clarity` → `/sudbury` (permanent)
- `/sudbury-small-business-website-leads` → `/sudbury` (permanent)
- `/website-snapshot-review` → `/website-conversion-snapshot` (permanent)
- `/intake/website-snapshot-review` → `/intake/website-conversion-snapshot` (permanent)

### Legacy Routes (redirects)
- `/direction-session` → `/exploratory` (permanent)
- `/business-clarity-call` → `/exploratory` (permanent)
- `/founders-check` → `/exploratory` (permanent)
- `/founders-direction-check` → `/exploratory` (permanent)
- `/brand-clarity-call` → `/exploratory` (permanent)
- `/website-clarity-call` → `/exploratory` (permanent)
- `/intake/direction-session` → `/intake/exploratory` (permanent)
- `/intake/business-clarity-call` → `/intake/exploratory` (permanent)
- `/intake/founders-check` → `/intake/exploratory` (permanent)
- `/intake/brand-clarity-call` → `/intake/exploratory` (permanent)
- `/intake/website-clarity-call` → `/intake/exploratory` (permanent)

### Convenience Redirects
- `/about`, `/services`, `/process` → Homepage anchors (`/#about`, etc.)
- `/intake`, `/start`, `/start-here` → `/focus-studio`
- `/portal`, `/client-portal`, `/login` → `/#portal`
- `/brand-website-starter-map` → `/#services` (temporary)

---

## 17. Sub-Brand Visual System

### B Core Services
- Shared B logomark (40px, white)
- "Core Services" wordmark in Fraunces (1.875rem, 300 weight)
- Positioned below "What we offer" heading
- Solid borders on service cards

### B Focus Studio
- Shared B logomark (40px, white)
- "Focus Studio" wordmark in Fraunces (1.875rem, 300 weight)
- Positioned within Focus Studio section header
- Dashed borders on service cards
- Includes boundary statement at bottom

Both sub-brands use identical logomark + wordmark styling for consistency.

---

## 18. Tier Container Styling (V5.2)

All three service tiers use consistent container and card styling with tier-specific colors.

### 18.1 Tier Color Tokens

| Tier | Primary Color | CSS Variable |
|------|---------------|--------------|
| Focus Studio | Violet | `#8B5CF6` / `rgba(139, 92, 246, x)` |
| Core Services | Amber | `#D97706` / `rgba(217, 119, 6, x)` |
| Exploratory | Blue | `#2563EB` / `rgba(37, 99, 235, x)` |

### 18.2 Container Styling

All tier containers share:
- **Background**: `rgba([color], 0.03)` — very subtle tint
- **Border**: `1px solid rgba([color], 0.15)`
- **Border radius**: `16px`
- **Padding**: `var(--space-lg)`

### 18.3 Card Styling

All tier cards share:
- **Background**: `rgba([color], 0.05)` — slightly more visible
- **Border**: `1px dashed rgba([color], 0.2)` — dashed by default
- **Border radius**: `12px`
- **Hover border**: `1px solid rgba([color], 0.5)` — solid on hover
- **Hover lift**: `translateY(-2px)` or `translateY(-3px)`
- **Hover shadow**: `0 6px 20px -6px rgba([color], 0.2)`

### 18.4 Edge Glow Effect

All cards have a hover edge glow using `::before`:

```css
.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, [tier-color], transparent);
    opacity: 0;
    transition: opacity var(--duration-fast) ease;
}

.card:hover::before {
    opacity: 1;
}
```

Cards must have `position: relative` and `overflow: hidden` for the edge glow to work.

---

## 19. Pricing & Marketing Strategy

### 19.1 Pricing Philosophy

- Pricing is **outcome- and deliverable-based**, never time-based
- AI efficiency increases margin and focus, not justification to discount
- Prices are upper-mid for Sudbury market, acceptable with clear scope and confident presentation
- **Do not discount publicly**

### 19.2 Local Incentive Strategy (Approved)

For Sudbury-first campaigns, local incentives may be offered via:
- Google Ads landing pages only
- CTA pages only (not global site)

**Framing (approved language):**
- "Local launch"
- "Community-first access"
- "Sudbury partnership"

**Never use:**
- "Discount" language
- Public pricing reductions
- Site-wide promotions

**Implementation:**
- Optional promo code field in intake forms
- Code visibility restricted to ad-specific landing pages only

### 19.3 Campaign Focus

- Single campaign only (no split testing yet)
- Campaign focus: Focus Studio offerings
- Main CTA for ads: Direction Session ($145) or specific Focus Studio service page

---

## 20. V5.0.0 Performance Optimizations

V5.0.0 is a polish pass focused on eliminating janky animations and improving mobile performance.

### 20.1 Animation Performance

**Header Ambient Lights**
- Throttled from 60fps to 30fps for reduced GPU load
- Movement values doubled to compensate (same visual speed)
- Disabled entirely on mobile via CSS

**Scroll Handler**
- Cached viewport height (updated on debounced resize)
- Cached DOM state flags to avoid repeated reads
- Batched class mutations
- Added passive event listeners

**Hero Spotlights**
- Mobile blur reduced: 50px → 30px (768px), 35px → 20px (480px)
- Mobile keyframes simplified to avoid `filter` animation (expensive)
- Animation duration reduced: 3s → 2s on mobile, 1.5s on small screens
- Added `contain: layout style` for isolation

### 20.2 Mobile Optimizations

**Header**
- Backdrop blur reduced: 20px → 12px on mobile
- GPU layer promotion via `transform: translateZ(0)`
- Ambient lighting pseudo-element disabled on mobile

**Intro Animation**
- Added `contain: layout style paint` to intro container
- `will-change` cleanup after animation completes

**Touch Targets**
- All CTAs minimum 44px height
- Improved tap feedback with scale transform

### 20.3 CSS Containment

Added `contain: layout style` to:
- `.intro` (full containment with paint)
- `.hero`
- `.section`
- `.section--alt`
- `.hero__spotlight`
- `.intro__glow`

### 20.4 Card Interactions

**Service Cards**
- Refined hover transitions (border, transform, shadow)
- Subtle lift on hover (3px)
- Active state feedback

**Focus Studio Cards**
- Added hover lift (2px)
- Violet-tinted shadow on hover

**Exploratory Cards**
- Added hover lift (2px)
- Active state scale feedback

**Pricing Modal**
- Improved entrance animation with scale + fade
- Backdrop fade-in separate from content animation

### 20.5 Mobile Service Layout

- Improved spacing consistency
- Touch target minimums (44px)
- Disabled hover lift on touch devices
- Active state uses scale(0.98) for feedback

---

## 21. Version History

| Version | Date | Changes |
|---------|------|---------|
| 4.2.0 | Jan 2026 | Focus Studio color tokens, mobile typography |
| 5.0.0 | Jan 2026 | Performance polish pass: 30fps throttling, reduced blur, CSS containment, improved touch targets |
| 5.1.0 | Jan 2026 | Service architecture update: renamed offerings, added Business Clarity Call, updated pricing tables |
| 5.2.0 | Feb 2026 | Locked tiered service architecture: 2/3/5 offering limits, consolidated Exploratory routes, added Brand Moments definition |
| 5.2.1 | Feb 2026 | Added Section 22: Header Navigation Standard (LOCKED) — canonical reference for all pages |
| 5.2.2 | Feb 2026 | Implemented universal header component (`/components/header.js`), updated 7 pages to use it, documented exceptions |
| 5.3.0 | Feb 2026 | Reordered homepage services to Tier 1→2→3; added organic dynamic lighting to Contact section; documented lighting pattern in Section 5.3 |
| 5.4.0 | Feb 2026 | Focus Studio offering restructure: Quick Website Refresh → Starter Site; Brandmarking Package → Brandmark & Visual Identity; added explicit distinction between template-assisted vs. custom code offerings |
| 5.5.0 | Feb 2026 | Comprehensive audit execution (P0-P4): OG image tags on 20 pages, honeypot fields on all forms, Formspree _subject fields, font-weight token standardization, phone validation, legacy page deprecation markers, Calendly PII documentation |
| 5.5.1 | Feb 2026 | P5 polish pass: removed unused --font-mono token, consolidated duplicate scroll-behavior, added phone button title attr, fixed vercel.json formatting, sanitized PII in snapshot booking logs, documented canonical email regex, marked launch gate for removal, added audit log retention strategy, clarified header nav documentation |
| 5.6.0 | Feb 2026 | CLAUDE.md accuracy audit (P0–P4): fixed version header, duplicate numbering, sub-numbering, GA/GTM status, pricing gate location, launch date; replaced project structure tree, expanded Section 16 routes (26 new), removed orphaned pages from Section 22.8, added APP_URL; added Section 25 API Endpoints Reference, expanded Section 11 security with CSP note; fixed exploratory blue token (#3B82F6→#2563EB in tokens.css + main.css), removed unused z-index tokens, kept glass tokens for future use; P4 code cleanup: removed empty scroll handler from dot-grid-about.js, deleted orphaned brand-clarity-call.html and website-clarity-call.html, extracted shared API utilities to api/lib/ (crypto.js, cookies.js, html.js) |

---

## 22. Header Navigation Standard (LOCKED)

The homepage header (`src/index.html`) is the canonical reference for all pages. All landing pages and sub-pages must match this structure.

### 22.1 HTML Structure

```html
<header class="header">
    <div class="header__glass">
        <div class="header__inner">
            <a href="/?skip" class="header__logo">
                <img src="/assets/bertrand-brands-logomark.png" alt="" class="header__logo-icon">
                <img src="/assets/bertrand-brands-wordmark-light-2026.png" alt="Bertrand Brands" class="header__logo-text">
            </a>
            <button class="header__toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="mainNav">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav class="header__nav" id="mainNav">
                <a href="/?skip#about" class="header__link">About</a>
                <a href="/?skip#process" class="header__link">How It Works</a>
                <a href="/?skip#services" class="header__link">Services</a>
                <a href="/book" class="header__link header__link--cta">Book a Call</a>
                <span class="header__divider" aria-hidden="true"></span>
                <a href="https://clients.bertrandbrands.com" class="header__link header__link--portal">Client Portal</a>
            </nav>
        </div>
    </div>
</header>
```

### 22.2 Nav Link Order (LOCKED)

| Order | Element | Href | Class |
|-------|---------|------|-------|
| 1 | About | `/?skip#about` | `header__link` |
| 2 | How It Works | `/?skip#process` | `header__link` |
| 3 | Services | `/?skip#services` | `header__link` |
| 4 | Book a Call | `/book` | `header__link header__link--cta` |
| 5 | Divider | — | `header__divider` (span) |
| 6 | Client Portal | `https://clients.bertrandbrands.com` | `header__link header__link--portal` |

**Rules:**
- The table above shows the **sub-page / universal header** format (`/?skip#section`)
- Homepage (`index.html`) uses bare anchor links (`#about`, `#process`, `#services`) since it's already the SPA
- Sub-pages and the universal header component use `/?skip#section` to bypass the intro animation
- "Book a Call" always uses `header__link--cta` modifier (amber styling)
- "Client Portal" always uses `header__link--portal` modifier (subtle styling)

### 22.3 Logo Configuration

- **Logomark**: `/assets/bertrand-brands-logomark.png` — always present
- **Wordmark**: `/assets/bertrand-brands-wordmark-light-2026.png` — always present
- **Link**: `/?skip` — returns to homepage, bypassing intro
- **Alt text**: Logomark has empty alt (decorative), wordmark has "Bertrand Brands"

### 22.4 Mobile Menu Toggle

Three-span hamburger button with accessibility attributes:
- `aria-label="Toggle menu"`
- `aria-expanded="false"` (toggles to `"true"` when open)
- `aria-controls="mainNav"`

### 22.5 Landing Page Overrides

Landing pages (e.g., `focus-studio.html`) require CSS override to show header immediately:

```css
/* Override main.css header to be visible by default on landing pages */
.header {
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
    transform: translateY(0) !important;
}

.header__logo-icon,
.header__logo-text {
    opacity: 1 !important;
}
```

### 22.6 Ambient Lighting (Optional)

Landing pages may include the header ambient lighting animation:

```javascript
// Ambient header lighting animation
(function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const header = document.querySelector('.header');
    const headerGlass = document.querySelector('.header__glass');
    if (!header || !headerGlass) return;

    // Immediately enable lights (no intro animation on landing pages)
    header.classList.add('lights-on');

    let pos1 = 15, pos2 = 85, dir1 = 1, dir2 = -1;
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30fps

    function animateLights(timestamp) {
        if (timestamp - lastFrame < FRAME_INTERVAL) {
            requestAnimationFrame(animateLights);
            return;
        }
        lastFrame = timestamp;
        pos1 += dir1 * 0.06;
        pos2 += dir2 * 0.05;
        if (pos1 > 35 || pos1 < 10) dir1 *= -1;
        if (pos2 > 90 || pos2 < 60) dir2 *= -1;
        headerGlass.style.setProperty('--orange-pos-1', pos1 + '%');
        headerGlass.style.setProperty('--orange-pos-2', pos2 + '%');
        requestAnimationFrame(animateLights);
    }
    requestAnimationFrame(animateLights);
})();
```

### 22.7 Mobile Menu JavaScript

Required on all pages with mobile menu:

```javascript
(function() {
    const toggle = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');
    const header = document.querySelector('.header');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function() {
        const isOpen = nav.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        if (header) header.classList.toggle('nav-open', isOpen);
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            if (header) header.classList.remove('nav-open');
        });
    });
})();
```

### 22.8 Universal Header Component

A JavaScript-based universal header is available at `/components/header.js`. It auto-injects the standard header with mobile menu and ambient lighting.

**Usage:**
```html
<!-- Universal Header -->
<script src="/components/header.js"></script>
```

**Pages using universal header:**
- `/src/pages/ads/focus-studio.html`
- `/src/pages/exploratory.html`
- `/src/pages/book.html`
- `/src/pages/ads/core-services.html`
- `/src/pages/clarity-session.html`

### 22.9 Pages with Intentional Custom Headers

Some pages have custom header designs for specific UX or conversion purposes:

| Page | Header Type | Reason |
|------|-------------|--------|
| `sudbury-focus-studio.html` | Minimal (logo only) | Google Ads landing page — focus on conversion |
| `website-conversion-snapshot.html` | Minimal (centered logo) | Google Ads landing page |
| `brand-clarity-diagnostic.html` | Minimal (centered logo) | Google Ads landing page |
| `website-audit.html` | Custom V3 theme | Legacy page with different design system |
| All `/intake/*.html` pages | Intake header (back + logo) | Form pages need back navigation |
| `payment-confirmed.html` | Tier badge header | Confirmation page with service tier context |
| `snapshot-confirmed.html` | Tier badge header | Confirmation page with service tier context |
| `booking-confirmed.html` | Tier badge header | Confirmation page with service tier context |

**Do not update these pages to use the universal header without explicit instruction.**

---

## 23. Brand Moments & Micro-Activations (Canonical Definition)

Brand Moments & Micro-Activations are concept-led brand expressions in the physical world.

### 23.1 Philosophy

They prioritize:
- **Meaning over scale**
- **Coherence over spectacle**
- **Proof over promotion**

Scale is irrelevant. Intent is everything.

### 23.2 What Qualifies

- Launch moments
- Pop-up concepts or installations
- Brand-led gatherings
- Spatial expressions of brand identity

### 23.3 What Bertrand Brands Provides

- Concept and narrative design
- Experience structure and intent
- Visual and spatial coherence
- Atmosphere, flow, and meaning

### 23.4 What Is Excluded by Default

- Event logistics
- Staffing
- Permits
- Rentals
- Full production execution

These may be handled collaboratively or via partners, but are not core obligations.

### 23.5 Integration Rule (Critical)

Brand Moments & Micro-Activations are **never the entry point**.

They may only be introduced through:
- A Brand Reset
- A Digital Platform Build
- A Brandmarking system expansion

If a request is "just an event," it is out of scope.

### 23.6 Internal Guardrail

A Brand Moment must satisfy at least one of the following:
- Marks a transition
- Tests a brand idea
- Expresses a brand system
- Creates proof

If none apply, Bertrand Brands does not pursue the engagement.

### 23.7 Language & Tone Rules

- Declarative, not promotional
- No hype or trend language
- No scale-based claims
- Emphasis on systems, intent, and coherence
- Avoid "agency" framing; use "studio" framing

---

## 24. Calendly Integration & PII Handling

### 24.1 Where Calendly Is Used

| Page | Method | PII Passed |
|------|--------|------------|
| `payment-confirmed.html` | Inline widget embed | None (widget handles collection) |
| `booking/schedule.html` | Inline widget embed | Client email (prefill from session) |
| `intake/brand-clarity-call.html` | URL link with query params | Name, email (URL params) |
| `intake/website-clarity-call.html` | URL link with query params | Name, email (URL params) |

### 24.2 PII Risk: URL Parameter Prefill

The legacy intake pages (`brand-clarity-call`, `website-clarity-call`) pass user name and email as Calendly URL parameters:

```
calendly.com/bertrandbrands/call?name=John&email=john@example.com
```

This exposes PII in:
- Browser address bar
- Browser history
- Server access logs
- Referrer headers if Calendly redirects

**Mitigation**: These pages are deprecated (redirect to `/exploratory`). The active booking flow (`booking/schedule.html`) uses the inline widget with `prefill` object instead of URL params, which is the safer approach.

### 24.3 Calendly Data Handling

- Calendly collects: name, email, scheduling preferences
- Data stored on Calendly's infrastructure (SOC 2 certified)
- Bertrand Brands receives booking confirmations via Calendly webhooks/email
- No Calendly data is stored in our database — bookings are tracked through Stripe payment events

---

## 25. API Endpoints Reference

All serverless functions live in `api/` and run on Vercel Functions (Node.js). Database utilities in `api/_lib/db.js`.

### 25.1 Pricing Gate (`api/pricing/`)

Magic link system for gating premium pricing visibility.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/pricing/request-access` | POST | Validates email, generates token, sends magic link via Resend |
| `/api/pricing/access?token=...` | GET | Consumes token, creates session, sets `bb_pricing_session` cookie |
| `/api/pricing/check-access` | GET | Validates session cookie, returns `{ hasAccess: true/false }` |
| `/api/pricing/logout` | POST | Clears session cookie |

**Security:**
- Email rate limit: 3 requests/hr per email (DB-backed, persistent)
- IP rate limit: In-memory per warm instance (resets on cold start)
- Token: `crypto.randomBytes(32)` → SHA256 hash stored in DB
- Token validity: 15 minutes
- Session duration: 4 hours
- Cookie flags: HttpOnly, Secure (production), SameSite=Lax
- CORS: Restricted to `APP_URL` origin
- Validation errors return `200 OK` to prevent email enumeration

### 25.2 Booking Gate (`api/booking/`)

Magic link system for gated booking access (client-specific). Parallels pricing gate architecture.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/booking/access?token=...` | GET | Consumes token, creates session, sets `bb_booking_session` cookie |
| `/api/booking/check-access` | GET | Validates session cookie, returns `{ hasAccess: true, clientEmail }` |
| `/api/booking/logout` | POST | Clears session cookie |

**Note:** There is no `request-access` endpoint in this repo. Booking tokens are generated externally (via system-build admin dashboard or manual process). The `access.js` endpoint queries a `clients` table to resolve client email from the token's `client_id`.

**Dependency:** Requires `clients` table in Vercel Postgres (not created by `scripts/init-db.js` — managed by system-build).

### 25.3 Snapshot Booking (`api/snapshot/`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/snapshot/book` | POST | Processes snapshot booking form submission |

**Request body:**
```json
{
  "name": "string (required, max 200)",
  "email": "string (required, max 254)",
  "website": "string (required, max 500)",
  "concern": "string (optional, max 2000)",
  "source": "string (optional, max 200)",
  "offer": "string (optional, max 200)",
  "rate": "string (optional, max 200)"
}
```

**Behavior:**
1. Validates all fields (type, length, email format)
2. Sends Pushover notification with masked email
3. Forwards to Formspree for email delivery
4. Returns `{ ok: true }` on success

**CORS:** Restricted to `APP_URL` origin.

### 25.4 Visitor Notifications (`api/notify.js`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notify` | POST | Sends visitor page-view notification via Pushover |

**Request body:**
```json
{
  "type": "visitor",
  "page": "/current-path",
  "referrer": "https://source.com"
}
```

**Behavior:**
- Uses Vercel geo headers for location (no external geo API)
- Sends formatted Pushover notification with page, city, region, country
- Fails silently (no error exposed to client)
- Called by `src/components/visitor-notify.js` on page load

### 25.5 Database Utilities (`api/_lib/db.js`)

Shared module used by pricing and booking endpoints:
- `initializeDatabase()` — Creates `pricing_magic_links` and `pricing_sessions` tables if not exists
- `createMagicLink({ email, tokenHash, expiresAt })` — Inserts hashed token
- `consumeMagicLink(tokenHash)` — Finds and deletes valid (unexpired) token
- `createSession({ sessionId, email, expiresAt })` — Creates authenticated session
- `getSession(sessionId)` — Validates session exists and not expired
- `cleanupExpiredSessions()` — Removes stale sessions
- `countRecentRequests({ email })` — Rate limit check (1-hour window)

### 25.6 Shared API Utilities (`api/_lib/`)

Common utilities extracted from the pricing and booking access endpoints:

| Module | Exports | Used By |
|--------|---------|---------|
| `crypto.js` | `hashToken(rawToken)` — SHA-256 hash | pricing/access, booking/access |
| `cookies.js` | `buildCookie(name, value, maxAgeSeconds)` — Secure cookie builder (HttpOnly, SameSite=Lax, Secure in production, `.bertrandbrands.com` domain) | pricing/access, booking/access |
| `html.js` | `escapeHtml(str)`, `errorPageHtml(title, message, options?)` — HTML escaping + styled error page template with configurable back link | pricing/access, booking/access |

---

**End of Instructions**

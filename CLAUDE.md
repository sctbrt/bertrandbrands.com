# CLAUDE.md - Bertrand Brands

## Version 11.0.0 (Current)

This document is the **Bertrand Brands** studio site guide. For full ecosystem context, see `/Users/scottbertrand/Sites/scottbertrand.com/CLAUDE.md`.

---

## 1. Operating Context

### 1.1 Role & Boundaries

**Bertrand Brands** is a Sudbury-based brand, web, and systems studio led by Scott Bertrand and Devin Major. A division of Bertrand Group Canada.

**Scott handles:**
- Brand strategy, UX direction, and design taste
- Client communication, scoping, and operations
- Final judgment on all brand decisions

**Devin Major (human, full-stack developer/architect):**
- Architecture, performance, and data/security
- Technical feasibility assessments
- Full-stack implementation and infrastructure

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

### 1.4 Service Tier Architecture (V11)

Bertrand Brands operates under a **4-tier service model** with sub-brand naming:

| Tier | Sub-Brand | Color | Hex | CSS Class | Offers |
|------|-----------|-------|-----|-----------|--------|
| Conversation | B Conversation | Tri-colour gradient | Amber → Violet → Blue | `--conversation` | Intake/qualification routing |
| Build | B Build | Amber | `#D97706` | `--build` | 3 offers (One-Page, Multi-Page, Full Site) |
| Transform | B Transform | Violet | `#8B5CF6` | `--transform` | 3 offers (Foundation+Growth, SMB Platform, Brand+Platform) |
| Care | B Care | Blue | `#2563EB` | `--care` | 3 levels (Bronze, Silver, Gold) |

**Hard Constraints:**
- 4 tiers, 9 offers + 3 care levels
- Single unified intake at `/intake`
- Phone-first conversion: calling is the PRIMARY CTA, web intake is secondary
- Async-first policy: meetings are escalators, not defaults

Claude must not add tiers, invent offers, or exceed these limits.

---

**B Build** (Amber #D97706) — Quick Builds

| Offer | Slug | Price | Timeline | Revisions | Meetings |
|-------|------|-------|----------|-----------|----------|
| Starter Site — One-Page + Contact | `starter-onepage` | $750 CAD | 7–10 days | 1 round | 0 (optional 15-min call) |
| Starter Site — Multi-Page + Contact | `starter-multipage` | Scoped | 2–3 weeks | 2 rounds | 0 (optional 15-min call) |
| Full Site — Multi-Page + Booking | `fullsite-booking` | Scoped | 3–4 weeks | 2 rounds | 0 (optional 15-min call) |

**Intake URL format:** `/intake?tier=amber&offer={slug}`

---

**B Transform** (Violet #8B5CF6) — Bigger Commitments

| Offer | Slug | Price | Timeline | Revisions | Meetings |
|-------|------|-------|----------|-----------|----------|
| Website Foundation + Growth System | `foundation-growth` | Scoped | 4–8 weeks | Tied to approval gates | 2–4 |
| SMB Platform Development | `smb-platform` | Scoped | 6–12 weeks | Tied to approval gates | 2–4 |
| Brand Design + Platform Development | `brand-platform` | Scoped | 8–16 weeks | Tied to approval gates | 2–4 |

**Meeting types:** Discovery, Direction Approval, Pre-Launch QA, Optional Training

**Intake URL format:** `/intake?tier=violet&offer={slug}`

---

**B Care** (Blue #2563EB) — Ongoing Support

| Plan | Slug | Price | Credits/mo | Response | Turnaround | Meeting Cadence |
|------|------|-------|-----------|----------|------------|-----------------|
| Bronze | `bronze` | $249/mo CAD | 4 | Within 1 business day | 3–5 business days | None |
| Silver | `silver` | $649/mo CAD | 10 | Same or next business day | 1–3 days (Micro/Standard), 3–7 days (Advanced) | Monthly optional |
| Gold | `gold` | By application | 24 | Same business day | 24–72 hours target | 1–2x monthly |

**Credit Definitions:**
- Micro (1 credit): text swap, image swap, link/button fix, metadata tweak, small CSS tweak, add/remove a simple block
- Standard (2 credits): new section on existing page, landing page iteration, form changes, embed/integration swap, blog post upload + formatting
- Advanced (4 credits): new page from existing patterns, heavier layout work, performance sweep, structured CRO pass + implementation

**Rules:**
- Credits are not hours. They represent scoped units of work.
- Anything outside plan scope becomes a fixed-scope Build quote.
- Gold uses scarcity framing: "Limited seats. Fit + capacity confirmed before onboarding."
- Bronze and Silver show pricing publicly. Gold pricing is gated.
- Use "Monthly Care Plan" or "scoped monthly support" language. Avoid "retainer."

**Intake URL format:** `/intake?tier=blue&offer={slug}`

---

**Beside AI Phone Policy:**
- Beside is phone/text routing only
- No assumed API integration
- All Beside leads manually entered into CRM
- Beside does not issue custom quotes
- All calls are qualified and manually routed into intake system

**Key Principles:**
- No open-ended scope
- No vague deliverables
- No ad-hoc calls outside defined services
- No hourly/time-based pricing language
- AI efficiency increases margin, not discount justification
- Prices ≤$1,500 are shown publicly; prices ≥$3,000 use private pricing

**Never invent new services, pricing, or scopes.**

### 1.5 Visual Hierarchy (V11)

**Homepage Section Order (Top to Bottom):**
1. **Intro** — Cinematic brand signature (4-second animation)
2. **Header** — Fixed glass header with nav
3. **Hero** — "Brands & Web Systems" with spotlights
4. **Services (#packages)** — Tri-Colour intake CTA, then 3 tier groups:
   - B Build (Amber) — 3 OfferCards
   - B Transform (Violet) — 3 OfferCards
   - B Care (Blue) — 3 OfferCards
5. **Process (#process)** — 5-step journey + tier-specific workflows
6. **About (#about)** — Founder section with dot grid
7. **Trust Stack** — Social proof
8. **Phone CTA** — Phone-first conversion block with Beside AI
9. **FAQ** — Accordion with Schema.org
10. **Contact (#contact)** — Email + phone + link to /intake
11. **Footer**

**Tier Color System:**
- Build uses amber accent (#D97706)
- Transform uses violet accent (#8B5CF6)
- Care uses blue accent (#2563EB)
- Conversation uses tri-colour gradient (amber → violet → blue)

**Navigation Order (V11):**
1. Services
2. How It Works
3. About
4. CTA: Mobile = "Call Now" (tel:), Desktop = "Get a Quote" (→ /intake)
5. Divider
6. Client Portal

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

**Bertrand Brands** — Premium brand and web systems design studio website. A division of Bertrand Group Canada. Astro 5 static site with serverless backend functionality hosted on Vercel.

**Domain**: bertrandbrands.ca
**Purpose**: Professional services showcase, lead generation, brand expression

---

## 3. Tech Stack

- **Framework**: Astro 5 (`output: 'static'`, `@astrojs/vercel` adapter)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+) — no UI framework (React/Vue/Svelte)
- **Hosting**: Vercel (static site + serverless functions)
- **Database**: Vercel Postgres
- **Email**: Resend API
- **Notifications**: Pushover API
- **Forms**: Formspree
- **Analytics**: Google Analytics, Google Tag Manager (CSP-permitted, not yet implemented)

---

## 4. Project Structure

```
├── src/                           # Astro source
│   ├── env.d.ts                   # Astro environment types
│   ├── layouts/
│   │   └── BaseLayout.astro       # Shared HTML shell (<head>, fonts, CSS, OG, Schema.org)
│   ├── components/
│   │   ├── HeaderCanonical.astro  # Homepage header (HTML only, scripts in index.astro)
│   │   ├── HeaderUniversal.astro  # Sub-page header (nav + mobile menu + ambient lighting)
│   │   ├── HeaderIntake.astro     # Intake form header (back button + logo)
│   │   ├── HeaderTierBadge.astro  # Confirmation page header (tier badge)
│   │   ├── HeaderMinimal.astro    # Ad landing page header (logo only)
│   │   ├── FooterMain.astro       # Full footer (homepage, hub pages)
│   │   ├── FooterMinimal.astro    # Simple footer (service, intake, confirmation)
│   │   ├── SkipLink.astro         # Accessibility skip link
│   │   ├── VisitorNotify.astro    # Silent Pushover notification on page load (skips owner visits)
│   │   ├── AnnouncementBanner.astro # Dismissible announcement banner
│   │   ├── GesturePrevention.astro # iOS gesture prevention (shared across all pages)
│   │   ├── OfferCard.astro        # V11 offer card (used in homepage tier groups)
│   │   ├── TierGroupHeader.astro  # B logomark + tier name header for homepage
│   │   ├── PackageCard.astro      # V10 legacy card (kept for sudbury.astro compat)
│   │   ├── InlineIntakeForm.astro # 2-step inline intake form (used on detail pages)
│   │   ├── StickyMobileCTA.astro  # Mobile-only sticky CTA bar
│   │   ├── PhoneFirstCTA.astro    # Phone-first conversion block with Beside AI
│   │   └── FAQ.astro              # FAQ accordion with optional Schema.org
│   ├── pages/
│   │   ├── index.astro            # Homepage (V11 — 3 tier groups + FAQ + phone CTA)
│   │   ├── 404.astro              # Error page
│   │   ├── thanks.astro           # Formspree redirect
│   │   ├── sitemapX.astro         # Ecosystem sitemap
│   │   ├── intake.astro           # Tier-aware intake form (replaces start.astro)
│   │   ├── build.astro            # B Build tier hub (3 offers)
│   │   ├── transform.astro       # B Transform tier hub (3 offers)
│   │   ├── care.astro             # B Care hub (Bronze/Silver/Gold)
│   │   ├── build/
│   │   │   ├── starter-onepage.astro    # One-Page + Contact detail ($750)
│   │   │   ├── starter-multipage.astro  # Multi-Page + Contact detail
│   │   │   └── fullsite-booking.astro   # Full Site + Booking detail
│   │   ├── transform/
│   │   │   ├── foundation-growth.astro  # Foundation + Growth System detail
│   │   │   ├── smb-platform.astro       # SMB Platform Development detail
│   │   │   └── brand-platform.astro     # Brand Design + Platform detail
│   │   ├── care/
│   │   │   ├── bronze.astro             # Bronze plan detail ($249/mo)
│   │   │   ├── silver.astro             # Silver plan detail ($649/mo)
│   │   │   └── gold.astro              # Gold plan detail (by application)
│   │   ├── scottbertrand.astro    # Personal cross-promotion
│   │   ├── sudbury.astro          # Sudbury local campaign landing (Google Ads)
│   │   ├── payment-confirmed.astro      # Post-payment confirmation
│   │   ├── booking-confirmed.astro      # Post-booking confirmation
│   │   ├── snapshot-confirmed.astro     # Post-snapshot confirmation
│   │   ├── booking/
│   │   │   └── schedule.astro     # Calendly booking widget
│   │   └── group/
│   │       └── index.astro        # Group hub page
│   └── _legacy/                   # Archived pre-Astro HTML files (not built)
├── public/                        # Static assets (served as-is at /)
│   ├── styles/
│   │   ├── tokens.css             # Design system variables
│   │   ├── main.css               # Main stylesheet (~5,100 lines)
│   │   ├── fonts.css              # @font-face declarations
│   │   ├── pricing-modal.css      # Pricing modal (homepage only)
│   │   └── founder-lightbox.css   # Founder lightbox (homepage only)
│   ├── scripts/
│   │   └── dot-grid-about.js      # About section dot grid animation
│   ├── fonts/                     # Inter, Fraunces, Manrope, Sora (woff2)
│   ├── assets/                    # Logos, images (bg-brands-logomark.png, etc.)
│   └── ...                        # Favicons, OG image, manifest, robots.txt, llms.txt
├── api/                           # Vercel serverless functions (NOT processed by Astro)
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
│   └── _lib/                      # Shared helpers
│       ├── db.js                  # Database utilities
│       ├── crypto.js              # Token hashing (SHA-256)
│       ├── cookies.js             # Secure cookie builder
│       └── html.js                # HTML escaping + error page template
├── scripts/
│   └── init-db.js                 # Database table initialization
├── astro.config.ts                # Astro config (Vercel adapter, redirects, routing)
├── tsconfig.json                  # TypeScript config
├── vercel.json                    # API rewrites + security headers only
├── package.json                   # Dependencies (astro, @astrojs/vercel, @vercel/postgres, resend)
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

### 5.2 Brand Expression

This site is **more expressive** than scottbertrand.com:

- RGB ethereal effects permitted (subtly)
- Animated gradients on key CTAs
- Mobile hamburger menu with transitions
- RGB border animations on secondary CTAs
- Ethereal text glow on hover states
- Three RGB spotlights (mobile hero only)

### 5.3 Organic Dynamic Lighting (LOCKED)

Ambient spotlights throughout the site use **organic breathing animations** to create a living, ethereal feel without distraction.

**Hard Rule: All background ambient light must be living (animated).** No static radial-gradients as ambient lighting. Every glow, spotlight, or ambient light element must breathe, drift, or morph. If a page has background lighting, it must move. Static glows feel dead and break the site's organic quality.

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
- Amber (`rgba(217, 119, 6, x)`) — Primary accent, used in header, contact, and Starter package
- Violet (`rgba(139, 92, 246, x)`) — Refresh package accent
- Blue (`rgba(37, 99, 235, x)`) — Platform package accent
- Tri-colour gradient (Amber → Violet → Blue) — Care tier accent

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
--font-display: halyard-display, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Type Scale */
--text-2xs: 0.6875rem;   /* 11px */
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
--leading-normal: 1.5;
```

### 6.3 Motion

```css
/* Durations */
--duration-fast: 0.3s;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;

/* Easings */
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Expressive but purposeful */
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
- Cookie: `bb_pricing_session` set on `.bertrandgroup.ca` domain

### 7.4 Pushover Notification System

Pushover notifications provide real-time alerts for visitor activity, form submissions, and lead intake across both the static site and the CRM backend.

**Environment Variables (shared across both projects):**
- `PUSHOVER_USER_KEY` — Pushover user key
- `PUSHOVER_API_TOKEN` — Pushover application token

**Notification Types:**

| Type | Priority | Sound | Trigger |
|------|----------|-------|---------|
| Visitor page view | -1 (silent) | None | Every page load (via `VisitorNotify.astro`) |
| Generic form submission | 0 (normal) | `pushover` | Non-intake form submissions |
| Intake form submission | 1 (high) | `cashregister` | Intake forms (exploratory, snapshot, diagnostic, sudbury) |
| Snapshot booking | 1 (high) | `cashregister` | `/api/snapshot/book` endpoint |
| Formspree CRM webhook | 1 (high) | `cashregister` | Formspree → system-build webhook |
| Google Ads CRM webhook | 1 (high) | `cashregister` | Google Ads → system-build webhook |

**Architecture:**
- **bertrandbrands.ca** — `api/notify.js` handles visitor + form + intake notifications; `api/snapshot/book.js` handles snapshot bookings directly
- **system-build** — `api/intake/formspree/route.ts` and `api/intake/google-ads/route.ts` each send Pushover notifications inline after creating leads

**Geolocation (LOCKED):**
- Uses **Vercel geo headers** (`x-vercel-ip-city`, `x-vercel-ip-country-region`, `x-vercel-ip-country`) — free, instant, no external API
- Applied to both visitor and intake notifications
- Do NOT use ip-api.com or any external geolocation API (fails from cloud/serverless IPs)
- City names are URL-encoded by Vercel; always `decodeURIComponent()` the city header

**Source Attribution (LOCKED):**
- `VisitorNotify.astro` captures UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`) and `gclid` from the URL
- `api/notify.js` builds a source line using priority: **UTM params > referrer domain > nothing**
- UTM display format: `google / cpc / sudbury-campaign (Google Ads)`
- Referrer display format: cleaned domain only (e.g., `google.com` not `https://www.google.com/search?q=...`)
- `gclid` presence is sent as a boolean flag (`'1'`), never the actual value (PII)

**Owner Exclusion:**
- Visit `bertrandbrands.ca/?owner` once to set a `localStorage` flag (`bb_owner`)
- `VisitorNotify.astro` checks this flag and skips visitor notifications for the site owner
- Intake/form notifications are NOT suppressed (those are always important)

**Visitor Tracking Coverage (LOCKED):**

Every page in `src/pages/` **must** include `VisitorNotify`. No exceptions. This is enforced either by:
1. Direct import: `import VisitorNotify from '../components/VisitorNotify.astro';` + `<VisitorNotify />` before `</BaseLayout>`
2. Shared layout: `ServiceDetailLayout.astro` and `IntakeLayout.astro` include it automatically

**Current coverage (26/26 pages):**

| Page | Source |
|------|--------|
| `index.astro` | Direct |
| `intake.astro` | Via IntakeLayout |
| `care.astro` | Direct |
| `build.astro` | Direct |
| `transform.astro` | Direct |
| `build/starter-onepage.astro` | Via ServiceDetailLayout |
| `build/starter-multipage.astro` | Via ServiceDetailLayout |
| `build/fullsite-booking.astro` | Via ServiceDetailLayout |
| `transform/foundation-growth.astro` | Via ServiceDetailLayout |
| `transform/smb-platform.astro` | Via ServiceDetailLayout |
| `transform/brand-platform.astro` | Via ServiceDetailLayout |
| `care/bronze.astro` | Via ServiceDetailLayout |
| `care/silver.astro` | Via ServiceDetailLayout |
| `care/gold.astro` | Via ServiceDetailLayout |
| `sudbury.astro` | Direct |
| `scottbertrand.astro` | Direct |
| `booking/schedule.astro` | Direct |
| `booking-confirmed.astro` | Direct |
| `payment-confirmed.astro` | Direct |
| `snapshot-confirmed.astro` | Direct |
| `thanks.astro` | Direct |
| `404.astro` | Direct |
| `privacy.astro` | Direct |
| `group/index.astro` | Direct |
| `sitemapX.astro` | Direct |
| `maintenance.astro` | Direct |

**Rule:** When adding a new page, include `<VisitorNotify />` or use a layout that includes it. If a page is missing visitor tracking, it is a bug.

---

## 8. Code Patterns

### Astro

- **`BaseLayout.astro`** — shared HTML shell; all pages pass props (title, description, canonical, etc.)
- **`<Fragment slot="head">`** — inject page-specific `<head>` content (e.g., homepage CSS)
- **`<script is:inline>`** — for scripts that need immediate DOM access (not deferred/bundled)
- **Astro components** — header variants, footer, skip link, visitor notify, gesture prevention
- **File-based routing** — `src/pages/` structure maps directly to URLs
- **Redirects** — managed in `astro.config.ts` (not vercel.json)
- **Static output** — `output: 'static'`, `build.format: 'file'`, `trailingSlash: 'never'`

### JavaScript

- **IIFE pattern** for feature encapsulation (inside `<script is:inline>` blocks)
- **Intersection Observer** for scroll animations
- **Event delegation** via data attributes (`[data-pricing-trigger]`)
- **Async/await** for all API calls
- **Graceful degradation** for reduced-motion

### CSS

- **CSS Custom Properties** for theming (in `public/styles/tokens.css`)
- **Mobile-first** media queries
- **BEM-ish naming** for components
- **Static CSS files** in `public/styles/` — linked via `<link>` tags, not Astro imports
- **Homepage-only CSS** — `pricing-modal.css` and `founder-lightbox.css` loaded via head slot

---

## 9. Development Commands

```bash
# Local development (Astro dev server)
npm run dev

# Build static site
npm run build

# Preview built site locally
npm run preview

# Local development with Vercel CLI (includes serverless functions)
vercel dev

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Note:** `npm run dev` starts the Astro dev server (fastest for frontend work). Use `vercel dev` when testing serverless API functions locally.

---

## 10. Environment Variables

```env
POSTGRES_URL          # Vercel Postgres connection
RESEND_API_KEY        # Email delivery
PUSHOVER_USER_KEY     # Push notifications
PUSHOVER_API_TOKEN    # Push notifications
APP_URL               # CORS origin (defaults to https://bertrandbrands.ca)
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

**CSP Note:** The current policy uses `'unsafe-inline'` for both `script-src` and `style-src`. This is required by the `<script is:inline>` blocks used across Astro pages. Removing `'unsafe-inline'` would require converting all inline scripts to Astro-bundled `<script>` tags (which get content hashes). The policy includes `object-src 'none'` for defense in depth.

---

## 12. Absolute Constraints

### Design

- If an effect is noticeable, it is wrong
- Glass is architectural, not decorative
- Zero gimmicks, zero spectacle
- Content always takes priority over chrome

### Code

- Do NOT add UI framework integrations (React, Vue, Svelte) — vanilla JS only
- Do NOT restructure existing layouts without explicit instruction
- Keep diffs minimal
- Preserve existing formatting
- Build via Astro 5 (`npm run build`) — output is static HTML/CSS/JS

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

- **dashboard.bertrandgroup.ca** — Admin CRM dashboard
- **clients.bertrandgroup.ca** — Client portal ("Delivery Room")

See main CLAUDE.md sections 14–16 for locked specs:

- **Section 14**: Client Portal v1 ("Delivery Room")
- **Section 15**: Admin / CRM Dashboard v1
- **Section 16**: Payment Integration v1 (Stripe Payment Links)

**Launched**: Feb 3, 2026

---

## 14. CRM Dashboard Design (V1.1)

The admin dashboard at `dashboard.bertrandgroup.ca` follows these design patterns:

### 14.1 Header Breadcrumb

Dynamic breadcrumb showing current section:
```
BERTRAND GROUP | Customer Relationship Management | {Section}
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

### Adding a new page

1. Create `.astro` file in `src/pages/` (file path = URL path)
2. Import `BaseLayout` and appropriate header/footer components
3. No rewrite rules needed — Astro file-based routing handles it
4. Add redirects in `astro.config.ts` if old URLs need to point to the new page

### Adding a new landing page

1. Create `.astro` file in `src/pages/` (e.g., `src/pages/campaign-name.astro`)
2. Use `BaseLayout` + `HeaderMinimal` or `HeaderUniversal` depending on conversion goals
3. Include `GesturePrevention` and `VisitorNotify` components

### Modifying the pricing gate

1. Backend logic in `api/pricing/` (this repo's serverless functions)
2. Frontend triggers via `[data-pricing-trigger]` attributes
3. Session validation via cookie check

### Updating styles

1. Design tokens in `public/styles/tokens.css`
2. Component styles in `public/styles/main.css`
3. Homepage-only styles in `public/styles/pricing-modal.css` and `public/styles/founder-lightbox.css`

### Adding a redirect

1. Add to `redirects` object in `astro.config.ts`
2. Use `status: 301` for permanent, `status: 302` for temporary
3. Run `npm run build` to verify it appears in `.vercel/output/config.json`

---

## 16. Routes Reference (V11)

### Active Pages (File-based routes)
- `/` → Homepage (3 tier groups, FAQ, phone CTA)
- `/intake` → Tier-aware intake form (`?tier=amber&offer=starter-onepage`)
- `/care` → B Care hub page (Bronze/Silver/Gold plans)
- `/build` → B Build hub page (3 offers)
- `/transform` → B Transform hub page (3 offers)
- `/build/starter-onepage` → Starter One-Page detail (Amber)
- `/build/starter-multipage` → Starter Multi-Page detail (Amber)
- `/build/fullsite-booking` → Full Site + Booking detail (Amber)
- `/transform/foundation-growth` → Foundation + Growth System detail (Violet)
- `/transform/smb-platform` → SMB Platform Development detail (Violet)
- `/transform/brand-platform` → Brand + Platform Development detail (Violet)
- `/care/bronze` → Bronze plan detail (Blue)
- `/care/silver` → Silver plan detail (Blue)
- `/care/gold` → Gold plan detail (Blue)
- `/sudbury` → Sudbury local campaign landing (Google Ads)
- `/scottbertrand` → Scott Bertrand cross-promotion

### Booking & Confirmation Routes
- `/booking/schedule` → Calendly inline widget
- `/payment-confirmed` → Post-payment confirmation (service config via `?service=`)
- `/booking-confirmed` → Post-booking confirmation
- `/snapshot-confirmed` → Post-snapshot confirmation
- `/thanks` → Formspree redirect confirmation

### V11 Redirects (permanent — V10/V11 legacy paths → current routes)
- `/start` → `/intake`
- `/packages/starter` → `/build/starter-onepage`
- `/packages/refresh` → `/transform/foundation-growth`
- `/packages/platform` → `/transform/brand-platform`
- `/amber` → `/build`
- `/violet` → `/transform`
- `/blue` → `/care`

### Legacy Redirects (permanent → tier pages or /intake)
- `/focus-studio` → `/#packages`
- `/core-services` → `/#packages`
- `/core-systems` → `/#packages`
- `/exploratory` → `/intake`
- `/clarity-session` → `/intake`
- `/starter-site` → `/build/starter-onepage`
- `/one-page-redesign` → `/transform/foundation-growth`
- `/brandmark` → `/build/starter-onepage`
- `/brand-system-reset` → `/transform/brand-platform`
- `/digital-platform-build` → `/transform/brand-platform`
- `/integrated-brand-platform` → `/transform/brand-platform`
- `/website-conversion-snapshot` → `/intake`
- `/brand-clarity-diagnostic` → `/intake`
- `/intake/exploratory` → `/intake`
- `/intake/website-conversion-snapshot` → `/intake`
- `/intake/brand-clarity-diagnostic` → `/intake`
- `/book` → `/intake`
- `/direction-session`, `/business-clarity-call`, `/brand-clarity-call`, `/website-clarity-call` → `/intake`
- `/founders-direction-check`, `/founders-check` → `/intake`
- All `/intake/*` legacy paths → `/intake`

### Campaign Aliases (permanent)
- `/sudbury-brand-website-clarity` → `/sudbury`
- `/sudbury-small-business-website-leads` → `/sudbury`
- `/website-snapshot-review` → `/intake`

### Convenience Redirects (temporary)
- `/about`, `/services`, `/process`, `/how-it-works` → Homepage anchors
- `/start-here` → `/intake`
- `/portal`, `/client-portal`, `/login` → `/#portal`
- `/brand-website-starter-map` → `/#packages`

---

## 17. Sub-Brand Visual System

> **V11:** The 4-tier sub-brand system (B Conversation, B Build, B Transform, B Care) is fully active. The homepage displays 3 tier groups (Build, Transform, Care). Conversation tier handles intake/qualification routing.

### Tier Hub + Detail Pages
- Shared B logomark (40px, white)
- Tier/offer name wordmark in Fraunces (1.875rem, 300 weight)
- Each tier uses its accent color for spotlights, borders, and accents
- Hub pages: self-contained inline styles (not main.css)
- Detail pages: inherit from `ServiceDetailLayout.astro`

### Tier Color Mapping (V11)
| Tier | Sub-Brand | Tier Class | Accent Color | Hex |
|------|-----------|-----------|--------------|-----|
| Build | B Build | `--build` / `tier-card--build` | Amber | `#D97706` |
| Transform | B Transform | `--transform` / `tier-card--transform` | Violet | `#8B5CF6` |
| Care | B Care | `--care` / `tier-card--care` | Blue | `#2563EB` |
| Conversation | B Conversation | `--conversation` / `tier-card--conversation` | Tri-colour gradient | `linear-gradient(135deg, #D97706, #8B5CF6, #2563EB)` |

### Sub-Brand Name Display
- Homepage tier group headers: white text (not accent-colored)
- Hub pages: white text with accent-colored spotlights
- Detail pages: white text with accent-colored spotlights and borders

---

## 18. Unified Card System (V5.3)

All interactive service cards use a single card system defined in `main.css` with tier-color modifiers. Tokens in `tokens.css`.

### 18.1 Tier Color Tokens

| Tier | Primary Color | CSS Variable | Hex |
|------|---------------|--------------|-----|
| Build (Amber) | Amber | `--build-accent` / `--tier-build` / `--pkg-starter` | `#D97706` / `rgba(217, 119, 6, x)` |
| Transform (Violet) | Violet | `--transform-accent` / `--tier-transform` / `--pkg-refresh` | `#8B5CF6` / `rgba(139, 92, 246, x)` |
| Care (Blue) | Blue | `--care-accent` / `--tier-care` / `--pkg-platform` | `#2563EB` / `rgba(37, 99, 235, x)` |
| Conversation | Tri-colour | `--tier-conversation` | `linear-gradient(135deg, #D97706, #8B5CF6, #2563EB)` |

### 18.2 Card System Tokens (`tokens.css`)

```css
--card-bg: 0.05;           /* Background alpha */
--card-bg-hover: 0.10;     /* Hover background alpha */
--card-border: 0.12;       /* Border alpha */
--card-border-hover: 0.40; /* Hover border alpha */
--card-radius: var(--radius-lg);  /* 12px */
--card-padding: var(--space-lg);  /* 4rem */
--card-lift: -3px;          /* Hover translateY */
--card-lift-active: -1px;   /* Active translateY */
--card-shadow-spread: 0.20; /* Hover shadow alpha */
--card-glow-height: 2px;    /* Edge glow height */
--card-icon-size: 100px;    /* Watermark icon size */
--card-icon-opacity: 0.06;  /* Watermark base opacity */
--card-icon-opacity-hover: 0.10; /* Watermark hover opacity */
--wrapper-bg: 0.03;         /* Tier wrapper background alpha */
--wrapper-border: 0.15;     /* Tier wrapper border alpha */
--wrapper-radius: 16px;
--wrapper-padding: var(--space-lg);
```

### 18.3 Card CSS Classes (`main.css`)

**Base card**: `.tier-card` — All interactive service cards inherit from this. Provides padding, border-radius, cursor, will-change, transitions, `::before` edge glow, `::after` watermark icon, hover lift, active press.

**Tier color modifiers** (one required):
- `.tier-card--conversation` — Blue (`rgba(37, 99, 235, x)`)
- `.tier-card--build` — Amber (`rgba(217, 119, 6, x)`)
- `.tier-card--transform` — Violet (`rgba(139, 92, 246, x)`)

**Size variants** (optional):
- `.tier-card--compact` — Reduced padding (`var(--space-md)`)
- `.tier-card--featured` — 2px border, larger padding (`var(--space-xl)`), max-width 600px, centered

**Tier wrappers** (section containers):
- `.tier-wrapper` — Base wrapper (padding, radius)
- `.tier-wrapper--conversation` / `.tier-wrapper--build` / `.tier-wrapper--transform` — Color variants

### 18.4 Usage Pattern

```html
<!-- Wrapper -->
<div class="focused-studio tier-wrapper tier-wrapper--build">
    <!-- Interactive card -->
    <div class="focused-studio__card tier-card tier-card--build">
        ...content...
    </div>
</div>
```

Old page-specific class names (`.focused-studio__card`, `.fs-offering`, `.cs-offering`, etc.) are kept for typography and layout rules. The `.tier-card` classes handle all card-surface properties (background, border, radius, padding, shadow, transitions, pseudo-elements, hover/active states).

### 18.5 What Uses the Card System

| Page | Elements | Tier Class |
|------|----------|-----------|
| `index.astro` | `OfferCard` (×9 via `.offer-grid` in 3 `.tier-group` sections) | `tier-card--build`, `tier-card--transform`, `tier-card--care` |
| `sudbury.astro` | `.sb-other__card` (×2) | `tier-card--transform tier-card--compact`, `tier-card--care tier-card--compact` |
| `care.astro` | `.care-plan-card` (×3) | Uses `.care-plan-card` system (not `.tier-card`) |

**V11 Offer Card System:** The `.offer-card__*` classes in main.css handle offer card internals (best-for chip, name, headline, price, timeline, features, revisions, meeting policy, exclusions, CTAs). These are used by `OfferCard.astro` and sit inside `.tier-card` wrappers. Legacy `.pkg-card__*` classes remain for backward compat (`PackageCard.astro` still used by `sudbury.astro`).

### 18.6 Mobile & Touch Behavior

- **768px**: Card padding reduces to `var(--space-md)`; compact to `var(--space-sm)`; featured to `var(--space-lg)`
- **480px**: Card padding reduces to `var(--space-sm)`
- **Touch devices** (`@media (hover: none)`): No hover lift; active state uses `scale(0.98)`
- **Reduced motion**: All card durations set to `0ms` via token overrides

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
- Campaign focus: B Build offerings
- Main CTA for ads: Clarity Session ($145) or specific B Build service page

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

**Build Cards**
- Added hover lift (2px)
- Violet-tinted shadow on hover

**Conversation Cards**
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
| 6.0.0 | Feb 2026 | Service architecture v6: Added Devin (human full-stack dev) to Section 1.1. Unlocked Sections 1.4/1.5. Tier 1 Exploratory: 2→3 offerings (Guided Intake, Clarity Session w/ Systems domain, Technical Feasibility Check). Tier 2: One-Page Redesign→One-Page System Redesign, added scope boundary. Tier 3: renamed Core Services→Core Systems, reduced 5→3 offerings (Brand System Reset absorbs Strategic Brand Review, Integrated Brand+Platform replaces Full Brand+Platform Reset, dropped Brand Moments). Renamed files: brand-reset→brand-system-reset, full-brand-platform-reset→integrated-brand-platform. Deleted strategic-brand-review.html. New routes: /core-systems, /brand-system-reset, /integrated-brand-platform. CSS: all .core-services→.core-systems. Section 23: Brand Moments→Language Standards. Updated all ads pages, SEO files, booking labels, llms.txt. |
| 7.0.0 | Feb 2026 | Rebrand: Introduced "Bertrand Group | Brand & Web Systems" wordmark with animated collapse. Domain: bertrandbrands.ca. Email: hello@bertrandgroup.ca. New logomark asset (bg-brands-logomark.png). Updated all ~45 files. Kept Calendly URLs as-is (calendly.com/bertrandbrands/*). |
| 8.0.0 | Feb 2026 | Astro 5 migration: Migrated all 27 pages from vanilla HTML to `.astro` files with `BaseLayout` + 5 header variants + 6 shared components. File-based routing eliminates all page rewrites. Redirects moved from `vercel.json` to `astro.config.ts` (28 entries). CSS/fonts/scripts relocated from `src/` to `public/` for Astro static serving. Extracted `GesturePrevention.astro` (replaced 21 inline occurrences). Extracted `pricing-modal.css` and `founder-lightbox.css` from main.css (homepage-only loading). Fixed HeaderCanonical double-binding bug. Removed legacy JS injectors (`header.js`, `visitor-notify.js`, `announcement-banner.js`). `vercel.json` reduced to API rewrites + security headers only. Legacy HTML archived in `src/_legacy/`. |
| 10.0.0 | Feb 2026 | V10 Offerings Reset: Restructured from 4-tier × 12-offering catalog to 3 packages (Starter $750 / Refresh / Platform) + Care plans. Phone-first conversion via Beside AI receptionist — mobile nav shows "Call Now", desktop shows "Get a Quote". New components: PackageCard, PhoneFirstCTA, FAQ. Created unified intake at `/start` replacing 3 separate intake forms. Created `/care` page with tri-colour gradient. 3 package detail pages at `/packages/starter|refresh|platform`. Deleted 15 deprecated `.astro` files (focus-studio, core-services, exploratory, clarity-session, starter-site, one-page-redesign, brandmark, brand-system-reset, digital-platform-build, integrated-brand-platform, website-conversion-snapshot, brand-clarity-diagnostic, + 3 intake pages). Rewrote all redirects in `astro.config.ts` (~50 entries). Updated homepage with 3-up PackageCard grid, Trust Stack, FAQ accordion, phone CTA. Added GA4 + Google Ads conversion tracking (`bbConvert()` helper) to BaseLayout. Updated Sudbury landing, all confirmation pages. V10 CSS: `.pkg-grid`, `.pkg-card__*`, `.phone-cta__*`, `.faq__*`, responsive nav CTA classes. |
| 11.0.0 | Feb 2026 | V11 Service Tier Architecture: Restructured from 3 packages to 4-tier sub-brand model (B Conversation, B Build, B Transform, B Care). Homepage now shows 3 tier groups with OfferCard grid (Amber 3 offers + Violet 3 offers + Blue 3 plans). New components: OfferCard, TierGroupHeader, InlineIntakeForm, StickyMobileCTA. Created tier-aware intake at `/intake` replacing `/start` with URL params (`?tier=amber&offer=starter-onepage`). Created 3 tier hub pages (`/build`, `/transform`, updated `/care`). Created 9 individual detail pages (`/build/starter-onepage|starter-multipage|fullsite-booking`, `/transform/foundation-growth|smb-platform|brand-platform`, `/care/bronze|silver|gold`). Care plans renamed: Essentials→Bronze, Growth→Silver, Partner→Gold. Deleted V10 pages (`start.astro`, `packages/starter|refresh|platform.astro`). Added V10→V11 redirects (`/start`→`/intake`, `/packages/*`→tier pages, `/amber`→`/build`, `/violet`→`/transform`, `/blue`→`/care`). Updated all legacy redirect destinations. Nav: "Packages"→"Services", CTA→`/intake`. Updated all confirmation pages with tier hub cross-sell links. Added tier-specific Pushover source labels (`tier-intake-amber|violet|blue`). V11 CSS: `.tier-group`, `.offer-grid`, `.offer-card__*`, tier group header styles. 26 total pages (was 18). |

---

## 22. Header Navigation Standard (LOCKED)

The homepage header (`src/pages/index.astro` via `HeaderCanonical.astro`) is the canonical reference for all pages. All landing pages and sub-pages must match this structure.

### 22.1 HTML Structure

```html
<header class="header">
    <div class="header__glass">
        <div class="header__inner">
            <a href="/?skip" class="header__logo">
                <img src="/assets/bg-brands-logomark.png" alt="" class="header__logo-icon">
                <span class="header__wordmark" aria-label="Bertrand Brands | Brand &amp; Web Systems">
                    <span class="header__wordmark-short" aria-hidden="true">BERTRAND BRANDS</span>
                    <span class="header__wordmark-full" aria-hidden="true">BERTRAND BRANDS <span class="header__wordmark-sep">|</span> <span class="header__wordmark-sub">Brand &amp; Web Systems</span></span>
                </span>
            </a>
            <button class="header__toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="mainNav">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav class="header__nav" id="mainNav">
                <a href="/?skip#packages" class="header__link">Services</a>
                <a href="/?skip#process" class="header__link">How It Works</a>
                <a href="/?skip#about" class="header__link">About</a>
                <a href="tel:+17054133705" class="header__link header__link--cta header__link--cta-call">Call Now</a>
                <a href="/intake" class="header__link header__link--cta header__link--cta-form">Get a Quote</a>
                <span class="header__divider" aria-hidden="true"></span>
                <a href="https://clients.bertrandgroup.ca" class="header__link header__link--portal">Client Portal</a>
            </nav>
        </div>
    </div>
</header>
```

### 22.2 Nav Link Order (V11 — LOCKED)

| Order | Element | Href (Universal) | Href (Canonical) | Class |
|-------|---------|-------------------|------------------|-------|
| 1 | Services | `/?skip#packages` | `#packages` | `header__link` |
| 2 | How It Works | `/?skip#process` | `#process` | `header__link` |
| 3 | About | `/?skip#about` | `#about` | `header__link` |
| 4 | Call Now (mobile) | `tel:+17054133705` | `tel:+17054133705` | `header__link header__link--cta header__link--cta-call` |
| 5 | Get a Quote (desktop) | `/intake` | `/intake` | `header__link header__link--cta header__link--cta-form` |
| 6 | Divider | — | — | `header__divider` (span) |
| 7 | Client Portal | `https://clients.bertrandgroup.ca` | same | `header__link header__link--portal` |

**CTA is responsive:**
- Mobile: "Call Now" (tel: link) via `.header__link--cta-call` (hidden on desktop)
- Desktop: "Get a Quote" (→ /intake) via `.header__link--cta-form` (hidden on mobile)
- In mobile menu (`.is-open`), both CTAs are visible

**Rules:**
- Homepage (`index.astro` via `HeaderCanonical.astro`) uses bare anchor links (`#packages`, `#process`, `#about`)
- Sub-pages use `HeaderUniversal.astro` with `/?skip#section` links to bypass the intro animation
- "Client Portal" always uses `header__link--portal` modifier (subtle styling)

### 22.3 Logo Configuration

- **Logomark**: `/assets/bg-brands-logomark.png` — always present
- **Wordmark**: Text-based animated span (Inter font). Shows "BERTRAND BRANDS" (collapsed) or "BERTRAND BRANDS | Brand & Web Systems" (expanded). Collapses after 2s, expands on hover.
- **Link**: `/?skip` — returns to homepage, bypassing intro
- **Alt text**: Logomark has empty alt (decorative), wordmark has aria-label "Bertrand Brands | Brand & Web Systems"

### 22.4 Mobile Menu Toggle

Three-span hamburger button with accessibility attributes:
- `aria-label="Toggle menu"`
- `aria-expanded="false"` (toggles to `"true"` when open)
- `aria-controls="mainNav"`

### 22.5 Landing Page Overrides

Landing pages (e.g., `sudbury.astro`) and service detail pages use CSS override to show header immediately:

```css
/* Override main.css header to be visible by default on landing pages */
.header {
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
    transform: translateY(0) !important;
}

.header__logo-icon {
    opacity: 1 !important;
}

.header__wordmark {
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

### 22.8 Header Astro Components

Headers are now Astro components that render static HTML at build time (no runtime injection). Each variant includes its own scripts as `<script is:inline>` blocks.

**Available components:**

| Component | Used By | Includes |
|-----------|---------|----------|
| `HeaderCanonical.astro` | Homepage only | HTML only (scripts provided by index.astro) |
| `HeaderUniversal.astro` | Sub-pages (care, build, transform, build/*, transform/*, care/*, scottbertrand, group, sitemapX, privacy) | Mobile menu + ambient lighting + wordmark collapse |
| `HeaderIntake.astro` | Intake form (`intake.astro`) | Back button + logo |
| `HeaderTierBadge.astro` | Confirmation pages (3 pages) | Service tier badge |
| `HeaderMinimal.astro` | Ad landing page (`sudbury.astro`) | Logo only |

**Usage:**
```astro
---
import HeaderUniversal from '../components/HeaderUniversal.astro';
---
<HeaderUniversal />
```

**Wordmark behavior** (HeaderUniversal + HeaderCanonical):
- On load: Shows full "BERTRAND BRANDS | Brand & Web Systems"
- After 2s: Collapses to "BERTRAND BRANDS" via `.is-collapsed` class
- On hover: Expands back to full name
- Mobile (≤768px): Always shows collapsed form
- Respects `prefers-reduced-motion`

### 22.9 Pages with Intentional Custom Headers

Some pages have custom header designs for specific UX or conversion purposes:

| Page | Header Component | Reason |
|------|-----------------|--------|
| `sudbury.astro` | `HeaderMinimal` | Google Ads landing page — focus on conversion |
| `intake.astro` | `HeaderIntake` | Tier-aware intake form needs back navigation |
| `payment-confirmed.astro` | `HeaderTierBadge` | Confirmation page with service tier context |
| `snapshot-confirmed.astro` | `HeaderTierBadge` | Confirmation page with service tier context |
| `booking-confirmed.astro` | `HeaderTierBadge` | Confirmation page with service tier context |

**Do not change these pages to use HeaderUniversal without explicit instruction.**

---

## 23. Language Standards

### 23.1 Copy Language (Marketing & Client-Facing)

**Avoid in copy:**
- "website design" → use "web systems" or "digital systems"
- "redesign" → use "system redesign" or "reset"
- "build" (as a noun) → use "platform" or "system"
- "development services" → use "systems work"
- "agency" → use "studio"
- "discount" / "sale" / "promo"
- Hype or trend language
- Scale-based claims

**Use in copy:**
- "systems" — core framing word
- "clarity" — value proposition
- "structure" — methodology
- "studio" — identity framing
- "platform" — for digital work
- "reset" — for strategic realignment

### 23.2 Offering Names (Exceptions)

Package names are proper nouns and are exempt from copy language rules:
- "Starter" — entry-level website package
- "Refresh" — brand + site redesign package
- "Platform" — full brand + systems build package
- "Care Essentials" / "Growth Care" / "Partner Care" — monthly support plans
- "Brandmark Kit" — add-on, uses "kit" intentionally

### 23.3 Tone Rules

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
| `payment-confirmed.astro` | Inline widget embed | None (widget handles collection) |
| `booking/schedule.astro` | Inline widget embed | Client email (prefill from session) |
| `intake/brand-clarity-call` (deprecated) | URL link with query params | Name, email (URL params) |
| `intake/website-clarity-call` (deprecated) | URL link with query params | Name, email (URL params) |

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

**Mitigation**: These pages are deprecated (redirect to `/start`). The active booking flow (`booking/schedule.astro`) uses the inline widget with `prefill` object instead of URL params, which is the safer approach.

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

### 25.4 Pushover Notifications (`api/notify.js`)

Central notification endpoint handling three types: visitor tracking, intake submissions, and generic form inquiries.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notify` | POST | Sends Pushover notification (visitor, intake, or form) |

**Request body (visitor):**
```json
{
  "type": "visitor",
  "page": "/current-path",
  "referrer": "https://source.com"
}
```

**Request body (intake):**
```json
{
  "type": "intake",
  "source": "unified-intake",
  "name": "...", "email": "...", "phone": "...",
  "business": "...", "website": "...", "service": "...",
  "situation": "...", "budget": "...", "timeline": "...",
  "concerns": "...", "details": "...", "description": "...",
  "challenge": "...", "context": "...", "outcome": "..."
}
```

**Request body (generic form):**
```json
{
  "type": "form",
  "name": "...", "email": "...", "service": "...", "message": "..."
}
```

**Type handling:**

| Type | Title | Priority | Sound | Geolocation | URL |
|------|-------|----------|-------|-------------|-----|
| `visitor` | "Visitor on BG Brands" | -1 (silent) | None | Vercel geo | Page URL |
| `intake` | "New {Source Label}" | 1 (high) | `cashregister` | Vercel geo | `dash.bertrandgroup.ca/leads` |
| (other) | "BG Brands Inquiry" | 0 (normal) | `pushover` | None | `bertrandbrands.ca/#contact` |

**Source labels (intake type):**
- `tier-intake` → "General Intake"
- `tier-intake-amber` → "Build Tier Inquiry"
- `tier-intake-violet` → "Transform Tier Inquiry"
- `tier-intake-blue` → "Care Tier Inquiry"
- `unified-intake` → "V10 Intake" (legacy)
- `inline-starter` → "Starter Package Inquiry" (legacy)
- `inline-refresh` → "Refresh Package Inquiry" (legacy)
- `inline-platform` → "Platform Package Inquiry" (legacy)
- `exploratory-guided-intake` → "Exploratory Intake" (legacy)
- `website_conversion_snapshot` → "Website Snapshot" (legacy)
- `brand-clarity-diagnostic-intake` → "Brand Diagnostic" (legacy)
- `sudbury_focus_studio` → "Sudbury Lead"

**Called by:**
- `src/components/VisitorNotify.astro` — visitor tracking on every page load
- `src/pages/intake.astro` — tier-aware intake form submission
- `src/pages/sudbury.astro` — after Formspree submission
- `src/components/InlineIntakeForm.astro` — inline form on offer detail pages

**Owner exclusion:** `VisitorNotify.astro` checks `localStorage` for `bb_owner` flag (set via `?owner` URL param). Only visitor notifications are suppressed.

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
| `cookies.js` | `buildCookie(name, value, maxAgeSeconds)` — Secure cookie builder (HttpOnly, SameSite=Lax, Secure in production, `.bertrandgroup.ca` domain) | pricing/access, booking/access |
| `html.js` | `escapeHtml(str)`, `errorPageHtml(title, message, options?)` — HTML escaping + styled error page template with configurable back link | pricing/access, booking/access |

---

**End of Instructions**

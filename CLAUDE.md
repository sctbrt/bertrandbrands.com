# CLAUDE.md - Bertrand Brands

## Version 5.0.0 (Current)

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

### 1.2 Core Operating Philosophy

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

### 1.3 Service Architecture (Locked)

Bertrand Brands operates two distinct service categories:

**Category A: B Core Services**
- Strategic, discovery-led engagements
- Relationship-based work
- Entry and gateway offerings (not production-heavy)
- Tone: Calm, collaborative, outcome-driven

**Core Services — Entry Offerings:**

| Service | Price | Format | Deliverable |
|---------|-------|--------|-------------|
| Direction Session | $145 CAD | 45-min video call | Written summary + next-step recommendations |
| Business Clarity Call | $95 CAD | 25-min video call | No written output (verbal guidance only) |

**Category B: B Focus Studio**
- Fixed-scope, fixed-price offerings
- Clear timelines, clear outcomes
- Transactional, deliverable-first
- Cash-stabilization tier for immediate revenue

**Focus Studio Offerings:**

| Service | Price | Timeline | Best For |
|---------|-------|----------|----------|
| Quick Website Refresh | $750 CAD | 1 business day | Businesses with underperforming sites needing targeted fixes |
| One-Page Redesign | $1,250 CAD | 2–3 business days | Restaurants, clinics, trades, local service businesses |
| Brandmarking Package | $950 CAD | 5–7 business days | Businesses needing a credible mark (not full rebrand) |

Key principles:
- No open-ended scope
- No vague deliverables
- No ad-hoc calls outside defined services
- No hourly/time-based pricing language
- AI efficiency increases margin, not discount justification
- Each service has:
  - A dedicated landing page (or shared intake for Focus Studio)
  - A single CTA
  - A defined intake flow
  - A fixed price

**Never invent new services, pricing, or scopes.**

### 1.4 Visual Hierarchy (Critical)

B Core Services always takes visual precedence over B Focus Studio:
- Core Services appears first in services section
- Focus Studio uses dashed borders (vs solid for Core)
- Focus Studio section separated by horizontal divider
- Both use shared B logomark with differentiated wordmarks

### 1.5 AI Positioning (Critical)

**AI is never positioned as the product.**

Externally:
- Language centers on systems, clarity, structure
- AI is implied, not advertised

Internally:
- Claude handles execution
- ChatGPT assists with strategy, synthesis, and language
- Human judgment remains the authority

If a solution makes AI visible to clients, flag it as a risk.

### 1.6 Decision Rules

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

### 1.7 Success Criteria

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
- **Analytics**: Google Analytics, Google Tag Manager

---

## 4. Project Structure

```
├── src/                    # Static site source
│   ├── index.html          # Main SPA (entry point)
│   ├── styles/
│   │   ├── tokens.css      # Design system variables
│   │   └── main.css        # Main stylesheet
│   ├── pages/
│   │   ├── ads/            # Landing pages
│   │   │   ├── direction-session.html
│   │   │   ├── business-clarity-call.html
│   │   │   ├── focus-studio.html      # B Focus Studio intake
│   │   │   └── ...
│   │   └── intake/         # Intake forms
│   └── assets/             # Logos & images
├── api/                    # Vercel serverless functions
│   ├── notify.js           # Visitor notifications → Pushover
│   ├── pricing/            # Magic link pricing gate system
│   └── lib/db.js           # Database utilities
├── public/                 # Static assets
├── vercel.json             # Deployment config & rewrites
└── package.json            # Dependencies
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

---

## 6. Design Tokens

### 6.1 Colors

```css
/* Dark Theme (Default) */
--bg: #0a0a0a;
--bg-elevated: #111111;
--text: #fafafa;
--text-muted: #888888;
--text-subtle: #555555;
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
- Database: `pricing_magic_links` and `pricing_sessions` tables (in system-build)
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
```

---

## 11. Security

- CSP headers configured in `vercel.json`
- HSTS, X-Frame-Options, X-XSS-Protection enabled
- HttpOnly, Secure, SameSite cookies
- Parameterized SQL queries (no injection)
- Rate limiting on sensitive endpoints

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

**Launch target**: Feb 3, 2026

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

1. Backend logic now in `system-build/src/app/api/pricing/`
2. Frontend triggers via `[data-pricing-trigger]` attributes
3. Session validation via cookie check

### Updating styles

1. Design tokens in `src/styles/tokens.css`
2. Component styles in `src/styles/main.css`

---

## 16. Routes Reference

### Core Service Routes
- `/direction-session` → Direction Session landing page ($145)
- `/business-clarity-call` → Business Clarity Call landing page ($95)

### Focus Studio Routes
- `/focus-studio` → B Focus Studio intake page (serves all three offerings)

**Focus Studio Offerings (all via shared intake):**
- Quick Website Refresh ($750)
- One-Page Redesign ($1,250)
- Brandmarking Package ($950)

### Intake Routes
- `/intake/direction-session` → Direction Session intake form
- `/intake/business-clarity-call` → Business Clarity Call intake form

### Legacy Routes (redirects)
- `/founders-check` → redirects to `/business-clarity-call`
- `/intake/founders-check` → redirects to `/intake/business-clarity-call`

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

## 18. Pricing & Marketing Strategy

### 18.1 Pricing Philosophy

- Pricing is **outcome- and deliverable-based**, never time-based
- AI efficiency increases margin and focus, not justification to discount
- Prices are upper-mid for Sudbury market, acceptable with clear scope and confident presentation
- **Do not discount publicly**

### 18.2 Local Incentive Strategy (Approved)

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

### 18.3 Campaign Focus

- Single campaign only (no split testing yet)
- Campaign focus: Focus Studio offerings
- Main CTA for ads: Direction Session ($145) or specific Focus Studio service page

---

## 19. V5.0.0 Performance Optimizations

V5.0.0 is a polish pass focused on eliminating janky animations and improving mobile performance.

### 19.1 Animation Performance

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

### 19.2 Mobile Optimizations

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

### 19.3 CSS Containment

Added `contain: layout style` to:
- `.intro` (full containment with paint)
- `.hero`
- `.section`
- `.section--alt`
- `.hero__spotlight`
- `.intro__glow`

### 19.4 Card Interactions

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

### 19.5 Mobile Service Layout

- Improved spacing consistency
- Touch target minimums (44px)
- Disabled hover lift on touch devices
- Active state uses scale(0.98) for feedback

---

## 20. Version History

| Version | Date | Changes |
|---------|------|---------|
| 4.2.0 | Jan 2026 | Focus Studio color tokens, mobile typography |
| 5.0.0 | Jan 2026 | Performance polish pass: 30fps throttling, reduced blur, CSS containment, improved touch targets |
| 5.1.0 | Jan 2026 | Service architecture update: renamed offerings, added Business Clarity Call, updated pricing tables |

---

**End of Instructions**

# CLAUDE.md - Bertrand Brands

## Version 4.1.0 (Current)

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

### 1.3 Service Model (Locked)

Bertrand Brands operates on clearly defined, fixed-price service tiers tailored to the Sudbury market.

Key principles:
- No open-ended scope
- No vague deliverables
- No ad-hoc calls outside defined services
- Each service has:
  - A dedicated landing page
  - A single CTA
  - A defined intake flow
  - A fixed price

**Never invent new services, pricing, or scopes.**

### 1.4 AI Positioning (Critical)

**AI is never positioned as the product.**

Externally:
- Language centers on systems, clarity, structure
- AI is implied, not advertised

Internally:
- Claude handles execution
- ChatGPT assists with strategy, synthesis, and language
- Human judgment remains the authority

If a solution makes AI visible to clients, flag it as a risk.

### 1.5 Decision Rules

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

### 1.6 Success Criteria

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

---

## 5. V4.0 Design Philosophy

### 5.1 Core Aesthetic Principles

V4.0.0 represents a **refined, minimal, architectural** approach:

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

**End of Instructions**

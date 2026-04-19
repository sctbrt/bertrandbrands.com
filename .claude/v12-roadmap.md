# V12 Implementation Roadmap

## Overview

V12 is a **technical maturity release** — no new services, no visual rebrand, no pricing changes. The goal is to make the existing V11 site faster, more measurable, more maintainable, and harder to break.

**Version bump rationale:** MINOR (11.x → 12.0) because it adds capabilities (View Transitions, testing, analytics events) without changing what visitors see.

---

## Phase 1: Performance & Load Speed (V12.0)

### 1A. CSS Modularization

**Problem:** `main.css` is 6,927 lines / 212 KB. Every page loads all of it, even though most pages use <30% of the styles.

**Approach:** Split into route-scoped CSS files loaded via Astro `<Fragment slot="head">`. Keep `tokens.css` and a slim `base.css` global.

**Proposed file structure:**

```
public/styles/
├── tokens.css              # Design system variables (keep as-is, ~7 KB)
├── fonts.css               # @font-face declarations (keep as-is, ~2.5 KB)
├── base.css                # Reset, typography, utilities, layout (~800 lines)
├── components/
│   ├── header.css          # All header variants + ambient lighting (~400 lines)
│   ├── footer.css          # FooterMain + FooterMinimal (~150 lines)
│   ├── cards.css           # .tier-card, .offer-card__*, card tokens (~350 lines)
│   ├── forms.css           # Form elements, validation states (~200 lines)
│   ├── buttons.css         # CTAs, gradient buttons (~150 lines)
│   ├── phone-cta.css       # PhoneFirstCTA block (~50 lines)
│   ├── faq.css             # Accordion + glow (~80 lines)
│   └── trust-stack.css     # Social proof section (~50 lines)
├── pages/
│   ├── homepage.css        # Intro, hero, tier groups, offer grid, process (~2,500 lines)
│   ├── tier-selector.css   # Situation-based decision cards (~370 lines)
│   └── sudbury.css         # Sudbury landing page specifics (~200 lines)
├── animations.css          # All @keyframes definitions (~200 lines)
├── pricing-modal.css       # Keep as-is (homepage-only, ~4.4 KB)
└── founder-lightbox.css    # Keep as-is (homepage-only, ~4.2 KB)
```

**Loading strategy:**

```astro
<!-- Every page (via BaseLayout) -->
<link rel="stylesheet" href="/styles/tokens.css" />
<link rel="stylesheet" href="/styles/fonts.css" />
<link rel="stylesheet" href="/styles/base.css" />

<!-- Homepage only (via head slot) -->
<Fragment slot="head">
  <link rel="stylesheet" href="/styles/components/header.css" />
  <link rel="stylesheet" href="/styles/components/cards.css" />
  <link rel="stylesheet" href="/styles/pages/homepage.css" />
  <link rel="stylesheet" href="/styles/animations.css" />
  <link rel="stylesheet" href="/styles/pricing-modal.css" />
  <link rel="stylesheet" href="/styles/founder-lightbox.css" />
</Fragment>

<!-- Detail page (via ServiceDetailLayout) -->
<Fragment slot="head">
  <link rel="stylesheet" href="/styles/components/header.css" />
  <link rel="stylesheet" href="/styles/components/cards.css" />
  <link rel="stylesheet" href="/styles/components/forms.css" />
</Fragment>
```

**Estimated savings:** Detail pages go from loading 212 KB to ~40-60 KB of CSS. Homepage stays roughly the same (it needs most of it).

**Risk:** Class name drift — a style in `cards.css` might depend on a utility in `base.css`. Need to verify every page after split.

**Effort:** ~4-6 hours. Mechanical extraction + page-by-page verification.

**Files touched:** `public/styles/` (new files), `BaseLayout.astro`, `ServiceDetailLayout.astro`, all page files (head slot updates).

---

### 1B. Image Optimization

**Problem:** All images are unoptimized PNGs. No WebP/AVIF, no responsive srcsets, no build-time compression.

**Approach:** Use Astro's built-in `<Image />` component for automatic format conversion and responsive sizing.

**Steps:**

1. Move images from `public/assets/` to `src/assets/` (required for Astro Image processing)
2. Replace `<img>` tags with Astro `<Image />` where beneficial
3. Keep favicons and OG images in `public/` (they need fixed URLs)

**Candidates for optimization:**

| Image | Current | Benefit |
|-------|---------|---------|
| `bg-brands-logomark.png` | PNG, used on every page | WebP conversion, responsive widths |
| `og-image.png` | 1200x630 PNG | Keep as PNG (social platforms need it) |
| Favicons | Various PNGs | Keep as-is (browser requirements) |

**Note:** This site is image-light (logos and icons, no photography). The benefit is moderate — maybe 20-50 KB savings total. Worth doing for best practices but not the highest priority.

**Effort:** ~2 hours.

**Files touched:** `src/assets/` (new directory), component files with `<img>` tags.

---

### 1C. Critical CSS Inlining

**Problem:** Even after modularization, CSS files are render-blocking.

**Approach:** Extract above-the-fold CSS for each page template and inline it in `<style>` tags in `<head>`. Load remaining CSS with `media="print" onload="this.media='all'"` pattern.

**Priority pages:**
1. Homepage (intro animation must not flash)
2. Intake form (conversion-critical)
3. Tier hub pages (Build, Transform, Care)

**Effort:** ~3 hours. Requires identifying above-the-fold styles per template.

**Dependency:** Do after 1A (modularization) so the files are already split.

---

## Phase 2: Navigation & UX (V12.1)

### 2A. Astro View Transitions

**Problem:** Every navigation is a full page reload. Moving between tier hubs and detail pages feels disconnected.

**Approach:** Add Astro's `<ViewTransitions />` to `BaseLayout.astro` for automatic cross-fade transitions.

**Implementation:**

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

**Key considerations:**

1. **Intro animation** — Must only play on fresh homepage load, not on back-navigation. Use `transition:persist` or session flag.
2. **Inline scripts** — All `<script is:inline>` blocks need `transition:persist` or re-initialization on `astro:page-load` event.
3. **Header ambient lighting** — Must survive transitions without restarting animation.
4. **GA4 tracking** — Page view events need to fire on client-side navigation (listen to `astro:page-load`).
5. **Scroll position** — Detail page → back to hub should restore scroll position.

**Pages that need special handling:**

| Page | Issue | Solution |
|------|-------|----------|
| Homepage | Intro animation replay | Check `sessionStorage` flag, skip if already seen |
| Intake | Form state loss | `transition:persist` on form container |
| All pages | Inline scripts re-run | Move to `astro:page-load` event listener |
| All pages | Header ambient lights restart | `transition:persist` on header element |

**Testing required:** Every page-to-page navigation path. Especially:
- Homepage → tier hub → detail → back → back
- Detail page → intake → submission → confirmation
- Mobile menu state across transitions

**Effort:** ~6-8 hours. The base setup is simple, but script re-initialization is the real work.

**Files touched:** `BaseLayout.astro`, `index.astro` (intro guard), all pages with `<script is:inline>`.

---

### 2B. Intake Form Progressive Disclosure

**Problem:** The 3-step wizard is functional but all fields within each step are visible immediately. Tier selection could drive which fields appear.

**Current flow:** Contact → Project Details → Logistics

**Proposed flow:** Contact → Tier Selection (if not pre-selected) → Tier-Specific Details → Confirm

**Tier-specific field variations:**

| Field | Build | Transform | Care |
|-------|-------|-----------|------|
| Website URL | Required | Required | Required |
| Budget range | Hidden (fixed pricing) | Shown | Hidden (plan pricing) |
| Timeline | Shown | Shown | Hidden |
| Current pain points | Optional | Required | Required |
| Team size | Hidden | Shown | Hidden |
| Current hosting/tools | Hidden | Shown | Optional |

**Effort:** ~4 hours. Mostly JavaScript conditional logic.

**Files touched:** `intake.astro`.

---

## Phase 3: Measurement & Analytics (V12.2)

### 3A. GTM Container Implementation

**Problem:** GA4 + Google Ads are hardcoded in BaseLayout. Adding new tracking (heatmaps, A/B tests, retargeting) requires code deploys.

**Approach:** Add GTM container that manages all tags. Keep the existing gtag as fallback during migration.

**Steps:**

1. Create GTM container (GTM-XXXXXXX)
2. Add GTM snippet to BaseLayout.astro (head + body)
3. Migrate existing GA4 config and Google Ads conversion tags into GTM
4. Remove hardcoded gtag scripts from BaseLayout (after GTM is verified)
5. Update CSP in vercel.json to allow `https://www.googletagmanager.com`

**Effort:** ~2 hours (code), ~2 hours (GTM container setup in Google UI).

**Files touched:** `BaseLayout.astro`, `vercel.json` (CSP update).

---

### 3B. Funnel Event Tracking

**Problem:** No visibility into where users drop off in the intake funnel or which tier/offer pages drive conversions.

**Proposed events:**

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `page_section_view` | Intersection Observer on homepage sections | `section_name` |
| `offer_card_click` | Click on OfferCard | `tier`, `offer_slug` |
| `tier_hub_view` | Page load on /build, /transform, /care | `tier` |
| `detail_page_view` | Page load on offer detail pages | `tier`, `offer_slug` |
| `intake_start` | First field interaction on intake form | `tier`, `offer`, `source` |
| `intake_step_complete` | Each wizard step completion | `step_number`, `tier` |
| `intake_submit` | Form submission | `tier`, `offer` |
| `intake_abandon` | Page unload with incomplete form | `last_step`, `tier` |
| `phone_click` | Click on tel: link | `location` (header/cta/footer) |
| `cta_click` | Click on "Get a Quote" | `location`, `tier` |
| `faq_expand` | FAQ accordion open | `question_index` |
| `scroll_depth` | 25%, 50%, 75%, 100% of page | `depth`, `page` |

**Implementation:** Fire via `gtag('event', ...)` or `dataLayer.push()` if GTM is set up.

**Effort:** ~4 hours.

**Files touched:** `index.astro`, `OfferCard.astro`, `intake.astro`, `BaseLayout.astro`, tier hub pages, detail pages.

---

## Phase 4: Code Quality & Safety (V12.3)

### 4A. Playwright E2E Tests

**Problem:** No automated tests. Regressions caught manually. Risky for a site handling lead intake.

**Approach:** Playwright for critical path smoke tests. Run locally before deploy, optionally in CI.

**Test suite:**

```
tests/
├── homepage.spec.ts        # Load, intro skip, section visibility, nav links
├── navigation.spec.ts      # All nav links resolve, mobile menu toggle
├── intake-form.spec.ts     # 3-step flow, validation, tier params, submission mock
├── tier-hubs.spec.ts       # /build, /transform, /care load correctly
├── detail-pages.spec.ts    # All 9 detail pages load, CTAs present
├── phone-cta.spec.ts       # tel: links present on mobile viewport
├── accessibility.spec.ts   # Skip link, focus trap, aria attributes
├── redirects.spec.ts       # Legacy URLs redirect correctly
└── seo.spec.ts             # Meta tags, Schema.org, canonical URLs
```

**Key test scenarios:**

1. **Homepage loads without JS errors** — Console check
2. **Intro animation can be skipped** — Click/tap during animation
3. **Mobile menu opens/closes** — Toggle, link click closes
4. **Intake form validates** — Empty submission blocked, email format checked
5. **Intake form accepts tier params** — `?tier=amber&offer=starter-onepage` pre-fills correctly
6. **All 28 redirects resolve** — No 404s on legacy URLs
7. **Phone CTA visible on mobile** — Viewport 375px, tel: link present
8. **Schema.org valid** — JSON-LD parses without error

**Setup:**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

**Package.json scripts:**

```json
{
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:ui": "playwright test --ui"
}
```

**Effort:** ~8-10 hours for initial suite. Ongoing: ~1 hour per new feature.

**Files touched:** New `tests/` directory, `playwright.config.ts`, `package.json`.

---

### 4B. API TypeScript Migration

**Problem:** 12 API files in plain JavaScript. No type safety on request/response shapes, environment variables, or database queries.

**Approach:** Rename `.js` → `.ts`, add types for request bodies, response shapes, and shared utilities.

**Migration order (by risk):**

1. `api/_lib/*.js` → `.ts` (shared utilities, highest reuse)
2. `api/notify.js` → `.ts` (most complex, handles 3 notification types)
3. `api/pricing/*.js` → `.ts` (magic link flow, security-critical)
4. `api/booking/*.js` → `.ts` (parallels pricing)
5. `api/snapshot/book.js` → `.ts` (simplest)

**Type definitions needed:**

```typescript
// types/api.ts
interface VisitorNotification {
  type: 'visitor';
  page: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: string;
}

interface IntakeNotification {
  type: 'intake';
  source: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  website?: string;
  // ... etc
}

interface MagicLinkRequest {
  email: string;
}

interface SessionResponse {
  hasAccess: boolean;
  clientEmail?: string;
}
```

**Vercel TypeScript support:** Vercel Functions natively support `.ts` files. No build step needed.

**Effort:** ~6-8 hours.

**Files touched:** All files in `api/`, new `api/types/` directory.

**Risk:** Low. TypeScript compilation errors surface immediately. Vercel handles TS → JS at deploy.

---

### 4C. Rate Limiting Upgrade

**Problem:** In-memory rate limiting resets on serverless cold starts. A determined attacker gets a fresh limit every ~5 minutes.

**Options:**

| Approach | Persistence | Cost | Complexity |
|----------|-------------|------|------------|
| Vercel KV (Redis) | Permanent | Free tier: 30K requests/day | Low |
| Vercel Postgres (existing) | Permanent | Already provisioned | Medium |
| Upstash Redis | Permanent | Free tier: 10K requests/day | Low |

**Recommended:** Vercel KV (Redis) — purpose-built for this, atomic operations, TTL support.

**Implementation:**

```typescript
import { kv } from '@vercel/kv';

async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const count = await kv.incr(key);
  if (count === 1) {
    await kv.expire(key, windowSeconds);
  }
  return count <= limit;
}
```

**Apply to:**
- `api/notify.js` — 10 req/min per IP
- `api/pricing/request-access.js` — Keep DB-backed email limit, upgrade IP limit
- `api/booking/create-token.js` — 10 req/min per IP
- `api/snapshot/book.js` — 10 req/min per IP

**Effort:** ~3 hours.

**Files touched:** `api/_lib/rate-limit.ts` (new), all rate-limited API files, `package.json` (add `@vercel/kv`).

**Dependency:** Requires Vercel KV store provisioning in Vercel dashboard.

---

## Phase 5: SEO & Structured Data (V12.4)

### 5A. Schema.org Expansion

**Current:** ProfessionalService (homepage), Service (some detail pages), FAQPage.

**Add:**

1. **Organization** — Bertrand Group Canada parent org
2. **LocalBusiness** — Sudbury location with geo, hours, service area
3. **BreadcrumbList** — On all detail pages (`Home > Build > Starter One-Page`)
4. **WebSite** — With SearchAction for Google sitelinks
5. **Service** — On ALL 9 detail pages (some are missing)

**BreadcrumbList implementation (ServiceDetailLayout):**

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bertrandbrands.ca" },
    { "@type": "ListItem", "position": 2, "name": "Build", "item": "https://bertrandbrands.ca/build" },
    { "@type": "ListItem", "position": 3, "name": "Starter One-Page" }
  ]
}
```

**Effort:** ~3 hours.

**Files touched:** `BaseLayout.astro`, `ServiceDetailLayout.astro`, tier hub pages.

---

### 5B. Tier Comparison Page

**New page:** `/compare`

**Purpose:** Help prospects who land on the site but aren't sure which tier fits. Reduces bounce, improves qualification.

**Layout:**
- 3-column comparison table (Build vs Transform vs Care)
- Rows: Price range, Timeline, Revisions, Meetings, Best for, Includes
- Each column links to respective tier hub
- Mobile: Stacked cards with "Best for" labels prominent
- Uses `HeaderUniversal` + `FooterMain`

**Effort:** ~4 hours.

**Files touched:** New `src/pages/compare.astro`, update nav if desired.

---

## Phase 6: Dark/Light Mode (V12.5 — Optional)

### 6A. Color Scheme Support

**Problem:** Site is dark-only. Some users prefer light mode. The token system in `tokens.css` is already variable-driven, making this feasible.

**Approach:** `prefers-color-scheme` media query with optional manual toggle.

**Token overrides needed:**

```css
@media (prefers-color-scheme: light) {
  :root {
    --bg: #fafafa;
    --bg-elevated: #ffffff;
    --bg-subtle: #f5f5f5;
    --text: #171717;
    --text-muted: #525252;
    --text-subtle: #737373;
    --border: rgba(0, 0, 0, 0.10);
    --glass-bg: rgba(0, 0, 0, 0.03);
    --glass-border: rgba(0, 0, 0, 0.08);
    --glass-edge-highlight: rgba(0, 0, 0, 0.06);
    /* Accent colors stay the same */
  }
}
```

**Challenges:**
- Ambient lighting (organic breathing) needs opacity adjustments for light backgrounds
- Glass effects look different on light
- OG image is dark-themed (can't change dynamically)
- Intro animation assumes dark background

**Risk:** High visual QA effort. Every page needs verification in both modes. The brand identity is strongly tied to the dark aesthetic.

**Recommendation:** Defer unless Scott specifically wants it. The dark theme IS the brand.

**Effort:** ~8-12 hours (including QA across all 26 pages).

---

## Priority & Sequencing

| Phase | Items | Priority | Effort | Impact |
|-------|-------|----------|--------|--------|
| **1A** | CSS Modularization | P0 | 4-6h | Load speed on non-homepage routes |
| **4A** | Playwright Tests | P0 | 8-10h | Regression safety, deploy confidence |
| **3B** | Funnel Event Tracking | P1 | 4h | Conversion visibility |
| **2A** | View Transitions | P1 | 6-8h | Navigation feel, modern UX |
| **4B** | API TypeScript Migration | P1 | 6-8h | Code safety, DX |
| **1B** | Image Optimization | P2 | 2h | Minor load improvement |
| **1C** | Critical CSS Inlining | P2 | 3h | First paint speed |
| **3A** | GTM Container | P2 | 4h | Tag management flexibility |
| **4C** | Rate Limiting Upgrade | P2 | 3h | Security hardening |
| **5A** | Schema.org Expansion | P2 | 3h | SEO rich results |
| **5B** | Comparison Page | P3 | 4h | Conversion help |
| **2B** | Intake Progressive Disclosure | P3 | 4h | Form UX |
| **6A** | Dark/Light Mode | P4 | 8-12h | User preference (defer) |

**Recommended execution order:**
1. CSS Modularization (1A) — Foundation for everything else
2. Playwright Tests (4A) — Safety net before making changes
3. Funnel Events (3B) — Start collecting data immediately
4. View Transitions (2A) — Biggest UX upgrade
5. API TypeScript (4B) — Code quality
6. Everything else in priority order

**Total estimated effort:** ~60-80 hours across all phases.

---

## Version Bumping Strategy

| Milestone | Version | Bump Type |
|-----------|---------|-----------|
| CSS modularization complete | 12.0.0 | MINOR (adds no visible features, but restructures internals significantly) |
| View Transitions + tests live | 12.1.0 | MINOR (visible navigation improvement) |
| Analytics events instrumented | 12.2.0 | MINOR (new capability) |
| API TypeScript + rate limiting | 12.2.1 | PATCH (internal improvement) |
| Schema.org + comparison page | 12.3.0 | MINOR (new page + SEO) |
| Dark/light mode (if done) | 13.0.0 | MAJOR (visible to visitors) |

---

## What V12 Does NOT Include

- No new services or pricing changes
- No visual redesign or rebrand
- No new tiers or offers
- No CRM/dashboard changes (that's system-build)
- No framework migration (stays vanilla JS + Astro)
- No Tailwind or CSS-in-JS adoption

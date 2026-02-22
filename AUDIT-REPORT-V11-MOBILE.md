# V11 Full-Site Visual Audit — Mobile (390×844)

**Date:** February 22, 2026
**Viewport:** 390×844 (iPhone 14/15 equivalent)
**Pages audited:** 26 (all pages in `src/pages/`)
**Dev server:** Astro 5 on localhost

---

## Executive Summary

The homepage is strong — large, confident Halyard Display headings, well-spaced tier groups, and a clear visual hierarchy. But once a user navigates to any hub or detail page, the typography drops dramatically — headlines shrink by 50%, body text becomes barely readable, and the site feels like a different, less polished product.

**The single biggest issue across the entire site is inner-page mobile typography scaling.** All 12 hub and detail pages share this problem. Fixing the ServiceDetailLayout's mobile breakpoints and the hub pages' inline font sizes would elevate the perceived quality of the entire site in one focused pass.

---

## Typography Measurements at 390px

### Homepage
| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 "Brand & Web Systems Studio" | Inter | 37.5px | 300 |
| H2 "Choose your starting point" | Halyard Display | 31.2px | 300 |
| H2 "A clear path..." | Halyard Display | 22.6px | 300 |
| H2 "Forward thinking..." | Halyard Display | 31.2px | 300 |
| H2 "Common questions" | Halyard Display | 31.2px | 300 |
| H2 "Get in touch" | Halyard Display | 37.5px | 300 |
| H3 offer card names | Halyard Display | 18.75px | 300 |
| Tier group names (Build etc.) | Halyard Display | ~30px | 300 |
| Section labels | Inter | 11.25px | 500 |
| Body text | Inter | 13.1–15px | 400 |

### Hub Pages (/build, /transform, /care)
| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 "Quick Builds" | Inter | 17.55px | 400 |
| H2 card titles | Inter | 15px | 500 |
| Sub-brand name ("Build") | Halyard Display | 16.875px | 300 |
| Hero description | Inter | 10.3px | 400 |
| Card labels (BEST FOR, etc.) | Inter | 8.44px | 600 |
| Card body text | Inter | 10.3px | 400 |
| Meta values ($750, 4-8 weeks) | Inter | 11.25px | 500 |
| Card CTAs | Inter | 13.1px | 600 |

### Detail Pages (/build/*, /transform/*, /care/*)
| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 "Get live with..." | Inter | 17.55px | 400 |
| H2 "Start with an intake" | Halyard Display | 18.75px | 600 |
| Sub-brand name | Halyard Display | 16.875px | 300 |
| Hero description | Inter | 10.3px | 400 |
| Card labels | Inter | 8.44px | 600 |
| Card body text | Inter | 10.3px | 400 |
| Meta values | Inter | 11.25px | 500 |
| Inline form button | Inter | 13.1px | — |

### Intake Page (/intake)
| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 "Get a quote" | Inter | 26.25px | 300 |
| H2 "Contact info" | Inter | 16.875px | 500 |
| Body text | Inter | 13.1px | 400 |
| Form labels | Inter | 13.1px | 500 |

---

## Findings — Prioritized

### P0 — Inner Page Typography Is Too Small (HIGH IMPACT)

**Affects:** All 3 hub pages + all 9 detail pages = 12 pages
**Severity:** High — makes the site feel like two different products

The homepage-to-inner-page quality drop is dramatic:

| Element | Homepage | Hub/Detail | Delta |
|---------|----------|------------|-------|
| Primary headline | 37.5px | 17.55px | **-53%** |
| Section heading | 31.2px | 15px | **-52%** |
| Body text | 13.1–15px | 10.3px | **-25%** |
| Labels | 11.25px | 8.44px | **-25%** |

**Root cause:** The `ServiceDetailLayout.astro` 480px breakpoint applies extremely aggressive clamping:
- `.service-hero__headline`: `clamp(1.125rem, 4.5vw, 1.375rem)` → 17.55px at 390px
- `.service-card__label`: `0.5625rem` → 9px
- `.service-card__text` / list items: `0.6875rem` → 11px

Hub pages use identical inline styles with similar aggressive scaling.

**Recommendation:**
Increase mobile minimum sizes across all inner pages:

| Element | Current (390px) | Recommended | Token |
|---------|-----------------|-------------|-------|
| H1 headline | 17.55px | 24–26px | `clamp(1.5rem, 5.5vw, 2rem)` |
| Hero description | 10.3px | 14px | `var(--text-sm)` |
| Card labels | 8.44px | 10.5–11px | `var(--text-2xs)` or `0.6875rem` |
| Card body text | 10.3px | 13px | `var(--text-sm)` |
| Card list items | 10.3px | 13px | `var(--text-sm)` |
| Meta values | 11.25px | 14px | `var(--text-sm)` |

**Files to change:**
- `src/layouts/ServiceDetailLayout.astro` — 480px and 768px media queries
- `src/pages/build.astro` — inline style `<style is:inline>` media queries
- `src/pages/transform.astro` — inline style media queries
- `src/pages/care.astro` — inline style media queries (uses different class names)

---

### P1 — Hub Page H1 Should Use Display Font

**Affects:** 3 hub pages
**Severity:** Medium — brand coherence

Hub page H1s ("Quick Builds", "Bigger Commitments", "Ongoing support after launch.") use Inter at 17.55px. The homepage uses Halyard Display for all section headings.

**Recommendation:** Switch hub H1s to `var(--font-display)` (Halyard Display) at weight 300, matching the homepage heading language. Combined with the size increase from P0, this would make hub pages feel like a natural continuation of the homepage.

---

### P2 — Card Label Minimum Accessibility Size

**Affects:** All hub + detail pages
**Severity:** Medium — accessibility concern

`.service-card__label` renders at 8.44px on mobile. This is:
- Below WCAG recommended minimum (typically 12px for body, 10px absolute minimum)
- Uses tier-colored text at 0.8 opacity on dark background, further reducing contrast
- Violet labels (`rgba(139, 92, 246, 0.8)`) have limited contrast on `#0a0a0a`

**Recommendation:** Minimum 10.5px (0.6875rem) for card labels. Consider increasing label opacity to 1.0 or using the `--transform-text` token for violet labels (already created in V11.1.0 at `#A78BFA`).

---

### P3 — Confirmation Pages: Phone Modal Auto-Display

**Affects:** 3 confirmation pages + thanks + 404
**Severity:** Low-medium — UX friction

All confirmation and utility pages display a phone modal dialog at the bottom of the page. On confirmation pages, users have already converted — showing a phone prompt adds visual noise and may confuse users who just completed an action.

**Recommendation:** Remove the phone modal from confirmation pages, or make it not auto-display. The "Back to Bertrand Brands" link and cross-sell cards are sufficient post-conversion.

---

### P4 — Thanks Page Missing Header & Cross-Promotion

**Affects:** /thanks
**Severity:** Low — minor polish

- No header component (no way to navigate except the two buttons)
- "Visit scottbertrand.com" link routes users away from the brand funnel
- Very sparse — no footer, no phone number, no services cross-sell

**Recommendation:** Add `HeaderTierBadge` (like confirmation pages), remove scottbertrand.com link, add tier cross-sell cards ("While you're here" pattern from confirmation pages).

---

### P5 — Care Hub Uses Different CSS Class Namespace

**Affects:** /care (maintenance concern, not visual)
**Severity:** Low — technical debt

Build/Transform hubs use `.service-*` classes.
Care hub uses `.care-page__*` and `.care-plan-card` classes.

Not visually different, but increases cognitive overhead for future maintenance. Note for V12 consideration.

---

### P6 — Sudbury Landing Page Spacing

**Affects:** /sudbury
**Severity:** Low — minor

- Stats strip ("100%", "5-10", "Fixed") spacing is acceptable but tight
- The $499/$750 strikethrough pricing display is effective
- Sticky CTA ("From $499 — Get a quote →" + "Call us") is well-implemented
- Form section spacing is clean

Overall the Sudbury page is strong on mobile. No critical issues.

---

### P7 — 404 Page Could Be Warmer

**Affects:** /nonexistent (404.astro)
**Severity:** Very low — nice-to-have

- Large "404" is effective
- Clean CTAs
- Could add the subtle ambient spotlights for brand consistency
- Phone modal auto-shows (unnecessary on error page)

---

## Section-by-Section Homepage Notes

These were documented in the previous session. Key notes:

1. **Hero** — Full viewport height, strong. Spotlights animate smoothly.
2. **Services intro** — "Choose your starting point" heading proportioning good after the session changes.
3. **Tier group headers** — Now display as Halyard Display ~30px with tier-colored accent lines (from the session CSS changes). Clean, cohesive.
4. **Process section** — "A clear path..." heading now fits one line (from session CSS change). Process steps well-spaced.
5. **About section** — Dot grid area renders well. Founder button is clear.
6. **Phone CTA** — Small, effective. "(705) 413-3705" is prominent.
7. **FAQ** — Accordion works well. Schema.org present.
8. **Contact** — "Get in touch" heading is the largest H2 (37.5px) — intentional emphasis.
9. **Footer** — Clean. "Not sure where to start?" CTA above copyright.

---

## Page Heights at 390px

| Page | Height |
|------|--------|
| Homepage | ~9,090px |
| /build hub | 2,422px |
| /transform hub | 2,272px |
| /care hub | ~2,800px (estimated from screenshot) |
| /build/starter-onepage | 1,865px |
| /transform/foundation-growth | ~1,900px |
| /care/silver | ~2,200px |
| /care/gold | ~2,300px |
| /intake | 1,358px |
| /sudbury | ~3,200px (estimated) |

---

## Spotlight System Summary

| Page Type | Count | Size (mobile) | Blur | Animation |
|-----------|-------|---------------|------|-----------|
| Homepage hero | 3 | varied | 30px | simplified mobile keyframes |
| Hub pages | 2–3 | 200–250px | 40px | organicBreathe 18-22s |
| Detail pages | 2 | 200–250px | 40px | organicBreathe 18-22s |
| Confirmation pages | 0 | — | — | — |
| Sudbury | 0 | — | — | — |

---

## Pending CSS Changes (Not Yet Deployed)

From the current session, 3 CSS changes are in `main.css` but not yet committed:

1. **Tier group headers → section-label pattern on mobile** — Accent line + stacked layout + logomark hidden at ≤480px
2. **Tier group header font/size → Halyard Display at headline scale** — `clamp(2rem, 5vw, 4rem)` matching "Choose your starting point"
3. **Process heading single-line fit** — `.section__title--clear-phrase { font-size: clamp(1.35rem, 5.8vw, 2rem); }` at ≤480px

---

## Recommended Implementation Order

1. **P0 — Inner page typography scaling** (~2 hours)
   - Adjust ServiceDetailLayout.astro 480px/768px breakpoints
   - Adjust 3 hub page inline styles
   - Test all 12 pages at 390px

2. **P1 — Hub H1 display font** (~30 min)
   - Change font-family for hub H1s to var(--font-display)
   - May need weight adjustment (300 vs 400)

3. **P2 — Card label accessibility** (~30 min)
   - Increase label minimums
   - Check violet contrast with --transform-text token

4. **P3–P7 — Polish items** (~1-2 hours combined)
   - Confirmation phone modal
   - Thanks page header
   - 404 spotlights (optional)

**Total estimated effort: 4-5 hours of focused work.**

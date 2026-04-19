# SYSTEM_STATE.md

Truthful read-only audit of the Bertrand-Brand-System stack (this repo + `system-build`).

- **WORKING** — feature is fully wired end-to-end; primary flow completes without gaps.
- **PARTIAL** — feature exists but has identifiable gaps; the gaps are named explicitly.
- **SCAFFOLD** — UI or routes exist but the feature isn't actually wired to do what it appears to do.

All claims below have file:line citations. Scope covers both `/Users/scottbertrand/Sites/bertrandbrands.ca/` and `/Users/scottbertrand/Sites/scottbertrand.com/system-build/`.

---

## 1. Intake submission → lead creation — **WORKING**

Public intake forms on this site (`/intake` simple + wizard, `/sudbury`) submit to Formspree. Formspree fires a webhook to `system-build/src/app/api/intake/formspree/route.ts` (confirmed exists, 23KB), which creates a `leads` row and — if the payload has an intake `source` field — also creates `users` + `clients` + `intake_submissions` rows atomically. `bertrandbrands.ca`'s `api/notify.ts:151-186` fires a Pushover alert in parallel with click-through to `https://dash.bertrandbrands.ca/leads`. The weak link: if Formspree is down or the `FORMSPREE_WEBHOOK_SECRET` env is unset, leads silently don't land; there's no retry or alternate path. Still, the happy path is wired.

## 2. Lead → client conversion — **PARTIAL**

The server action at `system-build/src/lib/actions/leads.ts:177-294` (`convertToClient()`) runs an atomic transaction: creates a `users` row (role=CLIENT), creates a `clients` row, updates the lead's status to CONVERTED with `convertedToClientId`, logs activity, and can optionally create an initial project with template-derived tasks. **Gap:** the conversion form's UI text promises the client "will receive portal access via magic link," but the action doesn't call Resend or any email service — no welcome email is sent. Scott has to separately send the client a login link out of band. The DB state is correct; the communication edge is missing.

## 3. Client → project creation (milestones, tasks, deliverables) — **PARTIAL**

`createProject()` in `system-build/src/lib/actions/projects.ts:7-70` writes a project row and bulk-creates tasks from the selected template's `checklistItems` JSON. **Gaps that matter:**
- **There is no `milestones` table.** What CLAUDE.md and the question frame as "milestones" are actually enum values on `projects.portalStage` (SCHEDULED, IN_DELIVERY, RELEASED, etc.) — not discrete scheduled entities with due dates or approval gates.
- **Tasks have no `dueDate` or `assignee`** — they're a flat checklist copied from the template.
- **Deliverables are never auto-created** at project creation; admin uploads them manually post-hoc via `/api/admin/deliverables`.

So projects + tasks work; the "milestones" and "deliverables at plan-time" framing overstates what the code does.

## 4. Deliverable upload + `/p/[publicId]` review + approval/revision — **WORKING**

Admin upload at `system-build/src/app/api/admin/deliverables/route.ts` → `uploadDeliverable()` at `src/lib/deliverable-storage.ts:34-105` writes both a watermarked preview and a clean file to Vercel Blob, creates a `deliverables` DB row. The client-facing `/p/[publicId]` page reads project + deliverables + latest signoff. Client feedback form posts to `/api/projects/[id]/feedback` → writes `feedbacks` row, downgrades `portalStage` on revision requests. Approve-and-release hits `/api/projects/[id]/release` → atomic transaction creating a `signoffs` row, marking the deliverable FINAL, and updating `portalStage` to RELEASED. Clean-file download at `/api/deliverables/[id]/download` gates on payment + release state. **One honest caveat:** `/p/[publicId]` is not actually public — `src/app/p/[publicId]/page.tsx:36-39` checks `auth()` and redirects unauthenticated users to `/login`. The "delivery room" URL shape suggests shareability but it requires a session. The watermark-on-fail fallback also serves the clean file if watermarking errors (`src/lib/watermark.ts`) — a graceful-degradation choice that could leak clean previews on a bad upload.

## 5. Invoice generation + PDF + Stripe payment — **PARTIAL**

Invoice creation at `system-build/src/lib/actions/invoices.ts:24-95` writes a row with line items + totals. `sendInvoice` at lines 240-330 emails the client via Resend with an HTML table. The client pays via a Stripe Payment Link stored on `projects.stripePaymentLinkUrl`. Stripe webhook at `src/app/api/webhooks/stripe/route.ts` verifies signatures, enforces idempotency via `payment_events.eventId`, and calls `processStripeCheckoutCompleted()` → sets `projects.paymentStatus=PAID`, `paidAt`, `lastPaymentEventId`. **Gaps, in order of severity:**
- **No PDF generation anywhere.** Grep found zero matches for PDFKit / @react-pdf / puppeteer / jsPDF imports. Invoices are HTML email only. The CLAUDE.md claim of "invoices with PDF generation" is incorrect.
- **`invoices.status` is never set to PAID** by the webhook. Only `projects.paymentStatus` updates. The `invoices` table remains SENT forever after payment.
- **Payment Link is per-project, not per-invoice.** Multiple invoices against one project share one `stripePaymentLinkUrl` — multi-invoice workflows break here.
- **No `/portal/invoices/[id]` payment view for clients** — clients pay indirectly via the `/p/[publicId]` project portal's "Pay Now" button.

The cash-flow works for simple single-invoice projects; it does not scale to multi-invoice billing.

## 6. Care subscription + ticket + FIFO credits — **PARTIAL**

Client files at `/portal/care/request` → `submitCareTicket()` inserts a SUBMITTED row in `care_tickets` (no credits charged yet). Admin triages at `/dashboard/care/tickets/[id]` → sets `creditSize` (MICRO 1 / STANDARD 2 / ADVANCED 4) → `spendCredits()` in `src/lib/care-credits.ts` consumes `care_credit_lots` FIFO by `expiresAt ASC`, appends signed-`delta` ledger rows to `care_credit_ledger`. The ledger is append-only; balance computes from a SUM aggregate. The daily cron at `/api/care/cron` with schedule `0 6 * * *` **is configured in `system-build/vercel.json:7-12`** (I verified), so expiry sweep actually runs. Refunds on ticket cancel re-credit the oldest eligible lot. **Real gaps:**
- **No row-level locking on lot drawdown.** If two triages land concurrently on the same subscription, both read the same `remaining` count before decrement, risking overdraw. Needs `SELECT … FOR UPDATE` or serializable isolation.
- **No recovery path for post-completion disputes.** If admin marks a ticket COMPLETED and the client disputes the work, there's no built-in refund workflow — credits are gone.
- **No re-triage** — if admin sized wrong, only path is cancel+refund+resubmit.

Core FIFO math is correct; concurrency and dispute edges aren't hardened.

## 7. Magic-link authentication — **WORKING**

**Auth.js v5.0.0-beta.30** (confirmed in `package.json`) with Resend email provider and a custom Prisma adapter (`system-build/src/lib/auth.ts`). The adapter's `createUser()` throws — auto-registration is blocked; only pre-created users can sign in, which is the correct choice for an invite-only system. Verification tokens are 32 random hex bytes stored in `verification_tokens`, deleted on consume (single-use). Sessions persist in the `sessions` table with 30-day expiry, cookie `authjs.session-token` (or `__Secure-authjs.session-token` in production) on domain `.bertrandbrands.ca`. Rate limiting exists at the proxy layer for `/api/auth POST` (5/min per IP) — no per-email throttle, but the email-delivery cost itself limits abuse. One noteworthy finding: the dev-login bypass at `src/app/api/auth/dev-login/route.ts` **is correctly guarded** — `IS_BLOCKED = NODE_ENV === 'production' || !!VERCEL` returns a 404 (not a 403) in production to avoid revealing the endpoint exists. That's safe, not a backdoor.

## 8. Role-based routing between subdomains — **WORKING**

`system-build/src/proxy.ts` (actually Next.js middleware despite the filename) routes by host: `dash.bertrandbrands.ca` → `/dashboard/*`, `clients.bertrandbrands.ca` → `/portal/*`. `src/app/dashboard/layout.tsx:19-26` enforces `session.user.role === 'INTERNAL_ADMIN'` and redirects mismatched users to `https://clients.bertrandbrands.ca`; `src/app/portal/layout.tsx:19-26` is the mirror. Role lives on `users.role` (enum `CLIENT | INTERNAL_ADMIN`), set at user-creation time, never changed by normal flows. Minor observations (not label-changing): the proxy isn't at the repo root (`src/proxy.ts` vs `middleware.ts`), meaning it runs as a server handler rather than edge middleware — perf-adjacent, not security. Cross-domain redirects hardcode HTTPS, which works in prod but would fail on local dev if triggered.

## 9. Service templates — **SCAFFOLD**

Templates CRUD works (`src/lib/actions/templates.ts`, `/dashboard/templates/*`). The intended data model was bigger than what shipped. **The `project_service_instances` junction table is never written to by any code path** — the invoice form reads it expecting rows, always finds empty. Project creation accepts a `templateId`, copies the template's `checklistItems` into `tasks`, and stops there: the template's `tier`, `price`, and `deliverables` fields are never enforced or copied. There's no versioning — editing a template silently affects all historical projects using it. Templates today are unenforced suggestions the admin can override, not structured service contracts. This looks like an abandoned-in-progress design for multi-service projects.

## 10. Calendly integration — **PARTIAL**

This one is subtler than the earlier guess of "just tokens." The full user flow **is wired end-to-end for booking**, but not for data capture:
- system-build admin UI → `/api/admin/generate-booking-link` → creates a token in `booking_access_tokens`, emails the client a URL: `https://bertrandbrands.ca/booking/access?token=...` (`src/app/api/admin/generate-booking-link/route.ts:124-125`).
- `bertrandbrands.ca/vercel.json` **rewrites** `/booking/access` → `/api/booking/access`, which redeems the token (shared Postgres, same `booking_access_tokens` schema) and sets a session cookie.
- The user lands on `src/pages/booking/schedule.astro` which embeds the Calendly **inline widget via iframe** (CSP includes `frame-src https://calendly.com`).
- User books on Calendly.

**What's missing:** zero Calendly API integration. No `@calendly/api` dependency, no `api.calendly.com` calls, no Calendly webhook endpoint. After the client books, system-build knows nothing about it — no booking record, no status change, no sync. Scott receives a Calendly email, then manually records the outcome (if at all). CLAUDE.md §24 acknowledges Calendly as external, but the gap from "booking completed" to "system-build knows about it" is fully manual.

## 11. Questionnaire integration — **SCAFFOLD**

The 8-step questionnaire at `/questionnaire` is functionally complete in isolation: magic link, auto-save, JSONB storage, completion email. But **it has zero structural linkage to the CRM.** The three tables (`questionnaire_projects`, `questionnaire_tokens`, `questionnaire_sessions`) store `client_email` and `client_name` as plain TEXT — no FK to `system-build`'s `clients` or `projects` tables. Verified by grep: **zero references to "questionnaire" anywhere in `system-build/src/`**. When a client completes the questionnaire, the response lives in JSONB forever, visible only via the admin summary email (and the underlying Postgres — which nothing queries). CLAUDE.md §26.9 is honest that "Admin UI for listing/viewing/editing responses" is deferred to system-build; what it doesn't say is that without an FK, even when that admin UI ships, it'll only match rows by email string. The questionnaire is a parallel universe bolted to the site, not integrated with the CRM.

## 12. Intake → questionnaire → client-record continuity — **PARTIAL**

Three edges have to work for continuity. Two don't:
- **Intake → Client:** Works via the Formspree webhook (Area 1). `intake_submissions.clientId` is a real FK.
- **Questionnaire → Client:** **Does not exist.** No FK, no email-match lookup at token creation time, no write-back after completion.
- **Intake → Questionnaire:** **Does not exist.** Two separate universes sharing only an email string.

Canonical process today: Scott receives Pushover → opens dash → manually inspects if the new lead matches an existing client by email → manually qualifies → manually converts to client → manually issues a questionnaire invite referencing that client's email (which the questionnaire system doesn't cross-reference against the clients table). Each step is fully automated internally; the cross-flow wiring is Scott's brain plus email-string-matching.

---

## Additional findings

### Features present but not in the 12-area list

| Feature | Status | Note |
|---|---|---|
| Visitor tracking (`VisitorNotify.astro`) | **WORKING** | Silent Pushover pings with geo + UTM, owner-exclusion via localStorage `bb_owner` flag |
| Pushover notification system (`api/notify.ts`) | **WORKING** | Visitor / intake / form types; Vercel geo headers; tier-specific source labels |
| Honeypot spam field | **WORKING** | `_gotcha` input in `InlineIntakeForm.astro:35` for Formspree |
| GA4 + Google Ads conversion (`bbConvert()`) | **WORKING** | In BaseLayout; fires on confirmation flows |
| Announcement banner (`AnnouncementBanner.astro`) | **SCAFFOLD** | `line 11: return;` hard-disables the render; B-POS promo content is stale |
| Playwright test suite (`tests/`) | **WORKING** | 6 suites: homepage, mobile, a11y, navigation, redirects, SEO |
| Sitemap generator (`sitemapX.astro`) | **WORKING** | With `<lastmod>` per V12.1.1 |
| 404 page | **WORKING** | `src/pages/404.astro` |
| Maintenance page | **SCAFFOLD** | `src/pages/maintenance.astro` exists but not routed to — ready for emergency swap |
| Pricing gate (`api/pricing/*`) | **WORKING** | Magic-link flow parallel to booking; used if/when pricing is gated |
| `/bpos` product page | **SCAFFOLD** | Meta says "Coming soon"; body-copy reflects pre-launch state |
| `/therakeep` product page | **SCAFFOLD** | Meta + homepage teaser both say "Coming soon" |
| Hospitality portfolio tile (`group/index.astro:555`) | **SCAFFOLD** | Placeholder class + "Coming 2026" string |
| Questionnaire addendum: `hang-in-there` | **SCAFFOLD** | Placeholder content in `src/lib/questionnaire-addendums/hang-in-there.ts` per CLAUDE.md §26.4 |
| `dev-login` auth bypass | **WORKING (dev-only)** | Properly 404s in production; `DEV_LOGIN_ENABLED` + `!VERCEL` gate |
| Stripe Connect / multi-tenant billing | **ABSENT** | No code paths — confirms the "single-tenant" answer from the prior plan |

### CLAUDE.md contradictions with actual code

1. **§13 domain names are stale.** Claims the backend lives at `dashboard.bertrandgroup.ca` / `clients.bertrandgroup.ca`; live code uses `.bertrandbrands.ca` throughout. Known — already flagged.
2. **§7.4 page coverage count is wrong.** Claims "27/27 pages" with a 27-row table. Actual page count is 31 — `brand-platform.astro`, `questionnaire.astro`, `maintenance.astro`, `group/index.astro` are missing from the table even though they include `VisitorNotify`.
3. **§25 questionnaire endpoints are correct** but the surrounding prose doesn't clarify that **the admin UI is not just "deferred" — there is also no FK from questionnaire to clients.** A future admin UI shipped in system-build will match rows by email string, not by relation. This is a design issue CLAUDE.md doesn't surface.
4. **§14.2 "Invoices: Count of unpaid invoices"** claims the dashboard's sidebar badge shows unpaid invoices. Since `invoices.status` is never updated to PAID by the webhook (Area 5 gap), this badge, if it queries `status IN (SENT, VIEWED, OVERDUE)`, will over-count forever.
5. **Prior claim of "PDF generation"** (from earlier planning scan) is wrong. No PDF library is imported in either repo. Invoices are HTML-email only.

### Dead or orphan code

- **`@notionhq/client`** declared in `system-build/package.json:19`, zero imports. `SETUP.md` documents `NOTION_API_KEY` but no code reads it.
- **`system-build/prisma/schema.prisma: project_service_instances`** — table modeled, never written (Area 9 detail).
- **`system-build/prisma/schema.prisma: booking_sessions`** — table modeled, never written. `booking_access_tokens` is the active table; `booking_sessions` appears to be the abandoned "post-redemption session" half of the design.
- **`bertrandbrands.ca/src/lib/questionnaire-schema.ts:290-474`** exports `getFieldByKey`, `validateFieldValue`, `computeResumeStep`, `validateAllRequired`, `serializeResponsesAsHtmlTable`, `serializeResponsesAsPlainText` — only imported in this file's own API endpoints (which DO exist in `bertrandbrands.ca/api/questionnaire/` — the earlier agent was partly wrong; the endpoints are in this repo). Not dead. Correction noted.
- **`bertrandbrands.ca/src/lib/questionnaire-addendums/index.ts`** exports `getAddendumStep`, `listAddendumKeys` — check whether the questionnaire page actually calls these; if it renders addendum step 9 client-side from a static import only, the helpers may be unused.
- **`bertrandbrands.ca/src/_legacy/`** — archived pre-Astro HTML, not in the build. Intentional, not dead-code in the concerning sense.
- **Care `booking_access_tokens.usedAt`** is tracked but on single-use redemption, so it's not dead — just note that if re-redemption is ever attempted, the current code path writes `usedAt` on consume.

### Inconsistencies / WIP

- **"Coming soon" copy on 4 surfaces**: `/bpos`, `/therakeep`, hospitality tile in `group/index.astro`, announcement banner. These suggest staged reveals but some (like the banner) appear to have been forgotten in the disabled state.
- **Email-from defaults stale** in 5 API files (`api/booking/create-token.ts:224`, `api/questionnaire/create-token.ts:169`, `api/questionnaire/complete.ts:28,204`, `api/pricing/request-access.ts:157`) — all default to `hello@bertrandgroup.ca` if `RESEND_FROM_EMAIL` env is unset. Not critical (env override exists) but confusing.

---

## Summary table

| # | Area | Label |
|---|---|---|
| 1 | Intake submission → lead creation | **WORKING** |
| 2 | Lead → client conversion | **PARTIAL** |
| 3 | Client → project creation (milestones/tasks/deliverables) | **PARTIAL** |
| 4 | Deliverable upload + `/p/[publicId]` review + approve/revise | **WORKING** |
| 5 | Invoice + PDF + Stripe payment | **PARTIAL** |
| 6 | Care subscription + FIFO credits | **PARTIAL** |
| 7 | Magic-link auth | **WORKING** |
| 8 | Role-based subdomain routing | **WORKING** |
| 9 | Service templates | **SCAFFOLD** |
| 10 | Calendly integration | **PARTIAL** |
| 11 | Questionnaire integration with CRM | **SCAFFOLD** |
| 12 | Intake → questionnaire → client continuity | **PARTIAL** |

**Count:** 4 WORKING · 6 PARTIAL · 2 SCAFFOLD.

## Honest one-paragraph read

The system is more mature than typical "WIP" AI-era projects and less complete than CLAUDE.md's prose implies. The operator-facing CRUD (leads → clients → projects → deliverables → payment) works end-to-end for the simple single-invoice case. The client-facing portal (delivery room, approvals, care tickets) works. The invisible wiring between intake, questionnaire, and client records is where the system is held together by email-string-matching and Scott's memory — this is the highest-leverage place to add continuity. Calendly is a booking handoff, not an integration. Templates, service-instances, and a proper milestones model look like design aspirations that didn't ship. There are no "coming soon" features masquerading as working ones, just a handful of marketing pages honestly labeling themselves pre-launch.

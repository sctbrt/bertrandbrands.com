# Three Prototype Directions for Bertrand Brands Ecosystem Reimagining

## Overview

Three self-contained HTML prototype files, each demonstrating a distinct visual direction across all three surfaces (public site, admin dashboard, client portal) as tabbed views within a single file. Each prototype is buildable with vanilla HTML/CSS/JS.

**Surfaces:**
- **Public site** (bertrandbrands.ca) — Astro 5, marketing/conversion
- **Admin dashboard** (dashboard.bertrandgroup.ca) — Next.js, CRM/operations
- **Client portal** (clients.bertrandgroup.ca) — Next.js, delivery/communication

**Shared constraints across all prototypes:**
- 4-tier service model: Conversation (tri-colour), Build (amber), Transform (violet), Care (blue)
- Phone-first conversion (Beside AI receptionist)
- BRIGHTS values alignment
- "Structure reduces anxiety" philosophy
- Halyard Display + Inter typography retained as brand constants
- No UI frameworks on public site (vanilla JS)
- `prefers-reduced-motion` respected

---

## Prototype A — "Architectural Blueprint"

### Design Concept
A light-mode, technical-drawing aesthetic where the site feels like a refined architectural blueprint come to life. Dot-matrix patterns, construction grid overlays, and precision line work replace the current glass morphism. The V14 direction taken to full expression.

### 1. Color Palette

```
/* Public Site — Light Mode (Primary) */
--bg:                #F5F0E8;       /* Warm cream parchment */
--bg-elevated:       #FDFAF5;       /* Near-white card surface */
--bg-subtle:         #EDE8DF;       /* Subtle section break */
--bg-grid:           #E5DFD4;       /* Grid line color */
--text:              #2C2824;       /* Warm charcoal */
--text-muted:        #6B635A;       /* Warm medium gray */
--text-subtle:       #9C9488;       /* Light warm gray */
--accent:            #C06A00;       /* Deepened amber for light bg (AA on cream) */
--accent-hover:      #A35A00;       /* Darker amber press state */
--border:            rgba(44, 40, 36, 0.12);
--border-strong:     rgba(44, 40, 36, 0.25);

/* Construction / Blueprint Elements */
--line-construction: rgba(44, 40, 36, 0.08);   /* Faint grid lines */
--line-accent:       rgba(192, 106, 0, 0.20);  /* Amber construction marks */
--dot-matrix:        rgba(44, 40, 36, 0.10);   /* Background dot grid */
--dot-matrix-active: rgba(192, 106, 0, 0.35);  /* Active/highlighted dots */
--node-amber:        #C06A00;
--node-violet:       #7C3AED;
--node-blue:         #1D4ED8;

/* Dashboard — Dark Mode */
--dash-bg:           #0F0E0C;       /* Warm near-black */
--dash-bg-elevated:  #1A1816;       /* Warm dark elevated */
--dash-bg-subtle:    #242220;       /* Warm dark subtle */
--dash-text:         #F5F0E8;       /* Cream text on dark */
--dash-text-muted:   #9C9488;
--dash-grid:         rgba(245, 240, 232, 0.04);  /* Faint grid overlay */
--dash-grid-accent:  rgba(192, 106, 0, 0.08);    /* Amber grid highlights */

/* Client Portal — Adaptive (light default, dark option) */
/* Light mode uses public site palette */
/* Dark mode uses dashboard palette */

/* Tier Colors (consistent across all surfaces) */
--build-accent:      #C06A00;       /* Amber, deepened for cream bg */
--build-rgb:         192, 106, 0;
--transform-accent:  #7C3AED;       /* Violet 600 */
--transform-rgb:     124, 58, 237;
--care-accent:       #1D4ED8;       /* Blue 700 */
--care-rgb:          29, 78, 216;
```

### 2. Typography

```
--font-display: halyard-display, sans-serif;       /* Retained — display headings */
--font-body:    'Inter', -apple-system, sans-serif; /* Retained — body */
--font-mono:    'JetBrains Mono', monospace;        /* NEW — blueprint annotations, code, metadata */

/* Scale adjustments for light mode (slightly tighter for architectural precision) */
--text-hero:    clamp(2.5rem, 5.5vw, 4rem);   /* Reduced from current 4.25rem max */
--text-section: clamp(1.5rem, 3vw, 2.25rem);
--text-card:    1rem;
--letter-spacing-display: -0.02em;              /* Tighter tracking on display */
--letter-spacing-body: 0;
--letter-spacing-mono: 0.05em;                  /* Wider for mono annotations */

/* Weight usage */
/* Display: 300 (light) for large headings — architectural drawing feel */
/* Body: 400 normal, 500 medium for emphasis */
/* Mono: 400 for annotations, 500 for active data */
```

### 3. Key Visual Motifs and Patterns

**Dot-Matrix Grid Background:**
- Full-page dot grid at 24px spacing, 2px dots at 10% opacity
- Dots at intersection points of the baseline grid
- On scroll, dots near content elements gain slight opacity boost (12% -> 18%)
- Tier-colored dots appear at key structural nodes (section starts, card corners)

**Construction Lines:**
- Thin horizontal and vertical hairlines (0.5px, 8% opacity) creating a subtle engineering grid
- Amber accent lines at section boundaries (1px, 20% amber)
- Cross-hatch marks at grid intersections near navigation anchors
- Margin annotations in mono font ("01.", "02.", etc.) for section numbering

**Architectural Nodes:**
- Small filled circles (6px) at structural junctions — where lines meet content edges
- Tier-colored nodes mark tier section starts
- Animated node: single dot pulses gently at active section indicator

**Blueprint Annotations:**
- Measurement-style markers alongside key elements ("7-10 days", "$750 CAD") use mono font with bracket marks
- Whisker lines connecting annotations to their subjects
- Corner registration marks on cards (small L-shaped marks at 2 corners)

### 4. Three-Surface Relationship

**Public Site (Light, Cream):**
- The "gallery" — a curated presentation of services
- Blueprint aesthetic reads as precision, competence, planning
- Dot grid is subtle background texture
- Construction lines frame content sections
- Cards have sharp corners (4px radius max), thin 1px borders
- Tier sections announced by colored node + hairline accent

**Dashboard (Dark, Warm):**
- The "war room" — same grid language but inverted
- Dot grid becomes the ambient background (replacing organic spotlights)
- Construction lines form the data grid structure
- Status indicators use the same node/dot language
- Sidebar nav uses vertical construction line as track
- Real-time data tables inherit the measurement annotation style

**Client Portal (Light default, Dark option):**
- The "project sheet" — a technical document feel
- Cards feel like blueprint callout boxes
- Progress indicators use the node-and-line motif (connected dots showing project stages)
- File/deliverable listings use the annotation style
- Bridges both: light mode matches public site warmth, dark mode matches dashboard precision

### 5. What Makes It Distinct

This is the most "branded" direction — it establishes a unique visual vocabulary (dot-matrix, construction lines, architectural nodes) that no competitor uses. It directly embodies "structure reduces anxiety" by literally showing structure. The light mode shift is dramatic against the current dark site. It trades cinematic drama for technical confidence.

### 6. Tier Color Handling

- **Build (Amber):** Amber accent nodes at section starts, amber construction lines around Build cards, amber dot clusters highlighting Build features. On light bg, amber deepens to #C06A00 for contrast.
- **Transform (Violet):** Violet nodes, violet annotation brackets on Transform pricing/timelines. Slightly muted on light bg (#7C3AED).
- **Care (Blue):** Blue nodes, blue connection lines between Care plan features. Blue measurement markers for plan credits/response times.
- **Conversation (Gradient):** Tri-color node sequence (amber -> violet -> blue) at the intake CTA. Gradient appears only at this single junction point, not smeared across large surfaces.

### 7. Navigation and Layout

**Public Site:**
- Top: Fixed header with left-aligned wordmark, right-aligned nav
- No glass blur — instead, a 1px bottom border with cream background at 95% opacity
- Section numbering in left margin (mono, small: "01 Services", "02 Process", etc.)
- Footer: minimal, single row of links with construction line separator
- Mobile: full-width menu drops down with grid lines framing each item

**Dashboard:**
- Left: Vertical sidebar (200px), construction-line left border as track
- Top: Breadcrumb bar with pipe separators (same as current)
- Content: Grid-based layout with 8px baseline grid alignment
- Cards: Thin border, sharp corners, node accent at top-left

**Client Portal:**
- Top: Horizontal nav with project name and status node
- Content: Two-column layout (sidebar project nav + main content)
- Cards: Blueprint callout style — thin border, corner registration marks, mono metadata

### 8. Motion / Animation Philosophy

**Principle: "Precision, not performance"**
- All motion is linear or gently eased — no spring, no bounce
- Transitions feel mechanical: straight-line reveals, clean fades
- Dot grid has zero ambient animation by default
- On scroll, dots near the viewport edge increase opacity (intersection observer, 300ms transition)
- Card hover: 1px border thickens to 2px, node dot brightens (no lift, no shadow change)
- Page transitions: content fades in from 0 opacity over 200ms, no transform
- Construction lines draw on-screen as you scroll (optional, subtle, 0.5px line extends from left margin to content edge)
- `prefers-reduced-motion`: all transitions set to 0ms, static dot grid at base opacity

**Keyframe budget: near zero.** This direction achieves personality through static pattern, not animation.

---

## Prototype B — "Warm Minimalism"

### Design Concept
A radical simplification. Dieter Rams meets a high-end architecture firm portfolio. Almost no decoration. Typography and spacing do all the heavy lifting. Color appears only functionally. No glass, no gradients, no grids, no ambient effects. The site communicates through restraint and editorial confidence.

### 1. Color Palette

```
/* Public Site — Light Mode */
--bg:                #FAFAF8;       /* Warm white (barely off-white) */
--bg-elevated:       #FFFFFF;       /* Pure white for cards */
--bg-subtle:         #F2F1EF;       /* Warm light gray for alternating sections */
--text:              #1A1A1A;       /* Near-black */
--text-muted:        #6E6E6E;       /* True medium gray */
--text-subtle:       #A3A3A3;       /* Light gray for labels */
--accent:            #B8860B;       /* Dark goldenrod — warm amber, muted */
--accent-hover:      #996F09;       /* Slightly darker on press */
--border:            rgba(0, 0, 0, 0.08);  /* Barely visible dividers */
--border-strong:     rgba(0, 0, 0, 0.15);

/* No glass properties. No glow properties. No blur properties. */

/* Dashboard — Dark Mode */
--dash-bg:           #111111;       /* Neutral dark (not warm) */
--dash-bg-elevated:  #1A1A1A;       /* Minimal elevation */
--dash-bg-subtle:    #222222;
--dash-text:         #E8E8E8;       /* Slightly warm white */
--dash-text-muted:   #888888;
--dash-border:       rgba(255, 255, 255, 0.06);

/* Client Portal — Light default, dark option */
/* Uses public site palette for light, dashboard palette for dark */

/* Tier Colors — MUTED / DESATURATED */
--build-accent:      #C49A3C;       /* Muted warm gold (not orange-amber) */
--build-rgb:         196, 154, 60;
--build-text:        #8B6914;       /* Darker version for text on light */

--transform-accent:  #9B8EC4;       /* Muted lavender (not vivid violet) */
--transform-rgb:     155, 142, 196;
--transform-text:    #6B5CA5;       /* Darker for text */

--care-accent:       #7B9CC4;       /* Muted steel blue (not vivid blue) */
--care-rgb:          123, 156, 196;
--care-text:         #4A6E94;       /* Darker for text */

/* Tier colors appear ONLY as: */
/* - 2px left-border on tier cards */
/* - Small label pill backgrounds at 10% opacity */
/* - Never as backgrounds, never as large fields */
```

### 2. Typography

```
--font-display: halyard-display, sans-serif;       /* Retained */
--font-body:    'Inter', -apple-system, sans-serif; /* Retained */
/* No mono font — unnecessary in this direction */

/* Larger, more generous scale — type does the work */
--text-hero:    clamp(3rem, 7vw, 5.5rem);     /* Oversized hero text */
--text-section: clamp(1.75rem, 4vw, 3rem);    /* Large section heads */
--text-card:    1.125rem;                       /* Larger card body */
--text-label:   0.6875rem;                      /* 11px — small uppercase labels */

/* Line heights — generous for reading comfort */
--leading-hero:    1.05;    /* Extremely tight for display */
--leading-heading: 1.2;
--leading-body:    1.7;     /* Very generous body leading */

/* Weight usage */
/* Display: 300 (light) exclusively for hero text */
/* Section heads: 400 (regular) — not bold */
/* Body: 400 for text, 500 for only the most critical emphasis */
/* Labels: 500 + uppercase + wide tracking (0.12em) */

--letter-spacing-hero: -0.03em;     /* Tight display tracking */
--letter-spacing-heading: -0.015em;
--letter-spacing-label: 0.12em;     /* Wide uppercase labels */
```

### 3. Key Visual Motifs and Patterns

**Large Typography as Architecture:**
- Oversized hero text (up to 5.5rem) creates visual weight without decoration
- Section headers are large, light-weight (300), and left-aligned with generous top margin (120px+)
- Numbers and prices set in display weight at oversized scale
- All headings left-aligned, never centered (editorial convention)

**Generous Whitespace:**
- Sections separated by 120-160px of empty space (no lines, no dividers)
- Cards have 48-64px internal padding
- Maximum content width: 720px for body text (reading column)
- Full-width: 1200px container, but content rarely touches edges

**Functional Dividers:**
- Horizontal rules are the only decorative element: 1px, rgba(0,0,0,0.08)
- Used sparingly — between major sections, never between cards
- No vertical dividers

**Monochrome + Functional Color:**
- The page is essentially grayscale
- Color appears ONLY on: tier label pills, card left-border accents, primary CTA button (amber), active nav state
- Links are underlined text (not colored) except CTAs
- Images (if any) could be desaturated or warm-toned black and white

### 4. Three-Surface Relationship

**Public Site (Light, Minimal):**
- Editorial magazine feel — scroll through large type and generous space
- Service cards are simple white rectangles with 2px left border in tier color
- No grid lines, no dots, no patterns
- Hero is just text on cream — nothing else
- CTA buttons are solid amber with white text, no effects, no gradient
- Footer is a single line of small links

**Dashboard (Dark, Typographic):**
- Data density achieved through typography hierarchy, not chrome
- Stat cards are plain dark rectangles with large numbers (Halyard, light weight)
- Tables use minimal grid — 1px bottom borders on rows only
- Status badges are small pills with muted backgrounds
- No sidebar decorations — just text labels in a vertical list
- Active nav item: bold weight + 2px left amber bar

**Client Portal (Light default, matching):**
- Almost indistinguishable from the public site in overall tone
- Project status shown as a simple text line: "In Progress" in muted type
- Deliverables listed as a clean typographic list with dates right-aligned
- Messages appear as a simple conversation thread — no bubbles, no cards
- Timeline shown as text-based milestones (no visual timeline/gantt)

### 5. What Makes It Distinct

This is the opposite of the current site. Where V13 says "cinematic," this says "editorial." Where V13 uses glass and ambient light to create atmosphere, this uses negative space and typographic scale. The tier colors are barely present — almost pastel. The entire site could work in a print magazine. It is the purest expression of "if an effect is noticeable, it is wrong" because there are no effects at all.

### 6. Tier Color Handling

- **Build (Muted Gold #C49A3C):** 2px left border on Build cards. Small "BUILD" label pill with 10% gold background. Gold used on the CTA button only on Build detail pages.
- **Transform (Muted Lavender #9B8EC4):** 2px left border. "TRANSFORM" label pill. Lavender CTA on Transform pages.
- **Care (Muted Steel #7B9CC4):** 2px left border. "CARE" label pill. Steel blue CTA on Care pages.
- **Conversation (No gradient):** The tri-color gradient is eliminated. Conversation intake uses amber CTA (as primary brand accent). The three tier colors may appear as three small dots (6px) in a row as a subtle brand mark.

### 7. Navigation and Layout

**Public Site:**
- Top: Fixed header, completely transparent until scroll (then white bg, 1px bottom border)
- Wordmark left, nav right: "Services  Process  About  Call  Get a Quote"
- No hamburger icon styling — mobile uses plain text "Menu" toggle
- Content: single column, max 720px for text, full width for card grids
- Card grids: 3-up at desktop, stacking to single column
- Footer: single centered line of small text links

**Dashboard:**
- Left: Text-only sidebar (180px), no icons, just labels
- Active item: amber left bar + bold text
- Content: fluid grid, max 1000px, centered
- Tables: minimal chrome, hover row highlight (subtle bg change)

**Client Portal:**
- Top: Project name (large), client name (small muted), status text
- Content: single column, max 800px
- No sidebar on mobile; tab-based navigation for sections

### 8. Motion / Animation Philosophy

**Principle: "No motion is the motion"**
- Page load: content appears immediately, no fade, no reveal
- Scroll: no parallax, no reveal animations, no intersection observer effects
- Hover: underline on links, border-color darken on cards (150ms ease)
- Card hover: background shifts from #FFFFFF to #FAFAF8 (barely perceptible)
- Navigation: instant state changes, no sliding panels
- Page transitions: none (hard cuts between pages)
- Mobile menu: immediate show/hide, no slide animation
- `prefers-reduced-motion`: identical to default (there is nothing to reduce)

**Keyframe budget: zero.** This direction has no @keyframes declarations at all.

---

## Prototype C — "Living Canvas"

### Design Concept
Evolves the current dark foundation rather than replacing it. Abandons glass morphism in favor of depth through layered planes and subtle parallax. The existing dot-matrix B logo becomes a foundational pattern — a constellation of dots that responds to scroll position. Richer, more saturated tier colors. The dashboard becomes a command center. The portal feels like opening a beautifully designed dark-theme book.

### 1. Color Palette

```
/* Public Site — Dark Mode (Evolved) */
--bg:                #080808;       /* Deeper black than current #0a0a0a */
--bg-elevated:       #121214;       /* Slightly cooler elevation */
--bg-subtle:         #1A1A1E;       /* Cool undertone for depth planes */
--bg-warm:           #141210;       /* Warm variant for highlighted sections */
--text:              #F0ECE4;       /* Warm off-white (not pure white) */
--text-muted:        #9A948C;       /* Warm muted */
--text-subtle:       #5E5A54;       /* Warm subtle */
--accent:            #E8950A;       /* Brighter, warmer amber (more saturated) */
--accent-hover:      #D08508;       /* Slightly darker */
--accent-glow:       rgba(232, 149, 10, 0.25); /* For subtle glow effects */
--border:            rgba(255, 255, 255, 0.06); /* Softer than current 0.10 */

/* Depth Planes (replaces glass) */
--plane-0:           #080808;       /* Base layer */
--plane-1:           #0E0E10;       /* First elevation */
--plane-2:           #141416;       /* Second elevation */
--plane-3:           #1C1C20;       /* Third elevation (cards) */
--plane-4:           #24242A;       /* Fourth elevation (modals, dropdowns) */
/* Each plane is a solid color — no transparency, no blur */

/* Constellation Dots */
--dot-base:          rgba(240, 236, 228, 0.04); /* Background constellation */
--dot-active:        rgba(240, 236, 228, 0.12); /* Near-viewport dots */
--dot-amber:         rgba(232, 149, 10, 0.20);  /* Amber-highlighted dots */
--dot-violet:        rgba(167, 139, 250, 0.20);
--dot-blue:          rgba(96, 165, 250, 0.20);

/* Dashboard — Same dark palette, cooler variant */
--dash-bg:           #06060A;       /* Slightly blue-black */
--dash-bg-elevated:  #0C0C12;
--dash-bg-subtle:    #14141C;
--dash-text:         #E8E4DC;
--dash-accent:       #F0A020;       /* Slightly warmer command-center amber */

/* Client Portal — Dark default with warm amber accent */
--portal-bg:         #0A0A08;       /* Very slightly warm black */
--portal-bg-page:    #121210;       /* "Page" surface — warm, book-like */
--portal-text:       #F0ECE4;
--portal-accent:     #E8950A;

/* Tier Colors — RICHER, MORE SATURATED */
--build-accent:      #F59E0B;       /* Amber 500 — warmer, more golden */
--build-rgb:         245, 158, 11;
--build-glow:        rgba(245, 158, 11, 0.15);

--transform-accent:  #A78BFA;       /* Violet 400 — luminous on dark */
--transform-rgb:     167, 139, 250;
--transform-glow:    rgba(167, 139, 250, 0.12);

--care-accent:       #60A5FA;       /* Blue 400 — brighter, more electric */
--care-rgb:          96, 165, 250;
--care-glow:         rgba(96, 165, 250, 0.12);
```

### 2. Typography

```
--font-display: halyard-display, sans-serif;       /* Retained */
--font-body:    'Inter', -apple-system, sans-serif; /* Retained */
--font-accent:  'Fraunces', serif;                  /* Elevated role — used for tier names and pull quotes */

/* Scale — slightly more dramatic than current */
--text-hero:    clamp(2.5rem, 6vw, 4.5rem);
--text-section: clamp(1.5rem, 3.5vw, 2.5rem);
--text-card:    1rem;
--text-accent:  clamp(1.125rem, 2vw, 1.5rem);  /* Fraunces tier name size */

/* Line heights */
--leading-hero:    1.1;
--leading-heading: 1.25;
--leading-body:    1.6;
--leading-accent:  1.3;    /* Fraunces leading */

/* Weight usage */
/* Display: 300 for hero, 500 for section heads */
/* Body: 400 normal, 500 for emphasis */
/* Fraunces: 300 for tier names (light italic feel without actual italic) */
```

### 3. Key Visual Motifs and Patterns

**Constellation Dot Field:**
- Full-viewport canvas-based dot grid (inheriting from current dot-grid-about.js pattern)
- Dots are 1.5px radius, 24px spacing, base opacity 4%
- As content scrolls into view, dots within a radius of the content brighten to 12%
- Tier sections cause nearby dots to shift to their tier color (amber, violet, blue) at 20% opacity
- The overall effect: content "illuminates" the surrounding constellation as you read
- At the top of the page (hero), dots subtly pulse in a breathing pattern (current organicBreathe concept, but as dot opacity rather than blob positions)
- The "B" from DotLogo.astro becomes the loading state — dots assemble into B, then scatter to become the background field

**Depth Planes (replacing glass):**
- No backdrop-filter anywhere
- Cards are solid-color planes at --plane-3
- Hover elevates to --plane-4 with a subtle warm shadow
- Content sections sit on different depth planes creating parallax depth
- Plane edges have a 1px border at 6% white — reads as paper edges in low light

**Warm Amber Accents:**
- Amber is used more prominently than current — as a warm glow beneath key content
- CTA buttons have a solid amber background with a soft 0 4px 20px amber glow shadow
- Active navigation has a small amber dot (no underline, just a 6px dot beneath the label)
- Section breaks use a short amber horizontal rule (60px wide, 2px, centered)

**Book/Codex Metaphor (Portal):**
- Client portal pages have slightly wider margins (like book margins)
- Content area has a very subtle warm tint (--portal-bg-page) creating a "page" feel
- Project phases shown as chapter markers in a sidebar
- Deliverables presented as a table of contents with page-style numbering

### 4. Three-Surface Relationship

**Public Site (Deep Dark, Constellation):**
- The "gallery at night" — constellation dots create a planetarium atmosphere
- Content emerges from darkness as you scroll
- Hero: large text with breathing constellation behind it
- Service cards are solid dark planes with tier-colored top border (2px)
- The B dot-logo lives in the hero area, its dots becoming part of the field
- Process section: five nodes connected by a dotted amber line

**Dashboard (Cool Dark, Command Center):**
- The "mission control" — slightly cooler temperature than public site
- Real-time stat numbers in large Halyard display font, amber highlights
- Data tables on solid plane-2 surfaces with plane-3 row alternation
- Chart/graph areas use the constellation dot motif as background texture
- Status indicators are small glowing dots (amber = action needed, green = good, red = alert)
- Sidebar has a vertical amber accent line on the active section

**Client Portal (Warm Dark, Book):**
- The "leather-bound project book" — warmest dark variant
- Content area has a barely perceptible warm tint
- Project milestones use amber dots connected by thin lines (timeline)
- Message/communication threads use alternating planes (plane-2, plane-3) for sender differentiation
- File listings use Fraunces for deliverable names, Inter for metadata
- A subtle amber rule separates major content sections

### 5. What Makes It Distinct

This is the evolution, not the revolution. It keeps the dark foundation clients already associate with the brand but matures it — replacing glass blur (which is becoming generic in 2026) with opaque depth planes and replacing random organic spotlights with an intelligent, responsive dot constellation. The dots are the signature element: they unify all three surfaces with a common visual DNA while behaving differently on each. The tier colors are richer and more confident. The overall feel moves from "nightclub VIP" to "observatory."

### 6. Tier Color Handling

- **Build (Rich Amber #F59E0B):** Amber dots cluster around Build content. 2px top border on Build cards. Amber glow beneath Build CTA buttons. Build detail pages have a warm amber undertone in the hero.
- **Transform (Luminous Violet #A78BFA):** Violet constellation shift around Transform content. 2px top border. Violet glow on CTAs. Fraunces tier name in violet.
- **Care (Electric Blue #60A5FA):** Blue constellation shift. 2px top border. Blue glow on CTAs. Care plan comparison uses blue-highlighted dots to show plan level (more dots = more credits).
- **Conversation (Animated Gradient):** At the intake CTA, the constellation dots cycle through amber -> violet -> blue in a slow wave pattern. This is the only place where the tri-color appears, and it is achieved through the dot field rather than a CSS gradient.

### 7. Navigation and Layout

**Public Site:**
- Top: Fixed header on --plane-1, no blur, solid background with 1px bottom border
- Wordmark + nav layout matches current structure
- Mobile CTA behavior preserved (Call Now / Get a Quote)
- Scroll: constellation brightens around current viewport content
- Footer: simple layout on --plane-1, amber accent rule above

**Dashboard:**
- Left: Sidebar on --plane-1 (200px), active item has amber dot + bold
- Top: Breadcrumb on --plane-2 bar
- Content: cards on --plane-3, data on --plane-2
- Real-time elements pulse subtly (amber dot breathe for notifications)

**Client Portal:**
- Left: Project chapter sidebar (collapsible on mobile)
- Main: Content area on --portal-bg-page (warm tint)
- Top: minimal — project name in Fraunces, status as colored dot
- Deliverable cards: --plane-3 with amber accent on actionable items

### 8. Motion / Animation Philosophy

**Principle: "Responsive, not performative"**
- The constellation is the single animated element — everything else is static or transition-based
- Constellation dots respond to scroll position via intersection observer (opacity transitions, 400ms ease)
- Tier color shifts happen over 600ms as you enter a tier section
- Card hover: plane elevation change (background-color transition 200ms) + subtle warm shadow fade-in
- CTA hover: amber glow intensifies (box-shadow transition 200ms)
- Page load: constellation starts dim, brightens over 800ms (single fade, not per-dot stagger for perf)
- The B dot-logo assembly plays once on first visit (stored in localStorage, matching current intro behavior)
- No parallax on content — only the constellation layer has a slight scroll-speed difference (0.95x) if the device supports it
- Mobile: constellation simplified (larger spacing, fewer dots, no scroll response, just static field)
- `prefers-reduced-motion`: constellation is static at base opacity, all transitions are 0ms

**Keyframe budget: 1 keyframe** (constellation breathing at hero only, 20s cycle, opacity-only).

---

## Implementation Plan (Shared Across Prototypes)

### File Structure

Each prototype is a single HTML file at:
```
public/prototypes/prototype-a-blueprint.html
public/prototypes/prototype-b-minimalism.html
public/prototypes/prototype-c-canvas.html
```

### Internal Structure of Each File

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Prototype [A/B/C] — [Name] | Bertrand Brands</title>
    <style>/* All CSS inline — self-contained */</style>
</head>
<body>
    <!-- Tab Navigation -->
    <nav class="proto-tabs">
        <button class="proto-tab active" data-surface="public">Public Site</button>
        <button class="proto-tab" data-surface="dashboard">Dashboard</button>
        <button class="proto-tab" data-surface="portal">Client Portal</button>
    </nav>

    <!-- Surface: Public Site -->
    <section class="proto-surface" data-surface="public">
        <!-- Header mockup -->
        <!-- Hero section mockup -->
        <!-- Services/tier cards mockup (all 3 tiers shown) -->
        <!-- Process section mockup -->
        <!-- Phone CTA mockup -->
        <!-- Footer mockup -->
    </section>

    <!-- Surface: Dashboard -->
    <section class="proto-surface" data-surface="dashboard" hidden>
        <!-- Sidebar nav mockup -->
        <!-- Breadcrumb mockup -->
        <!-- Overview stat cards -->
        <!-- Leads table sample -->
        <!-- Status badges sample -->
    </section>

    <!-- Surface: Client Portal -->
    <section class="proto-surface" data-surface="portal" hidden>
        <!-- Header/project nav mockup -->
        <!-- Project status mockup -->
        <!-- Deliverables list mockup -->
        <!-- Message thread mockup -->
    </section>

    <script>/* Tab switching + any animation JS */</script>
</body>
</html>
```

### Content to Mock in Each Surface

**Public Site sections:**
1. Header with wordmark and nav items
2. Hero with "Brands & Web Systems" headline
3. Tier selector (Conversation CTA)
4. Build tier: 1-2 sample OfferCards (Starter One-Page at $750, Full Site)
5. Transform tier: 1 sample OfferCard
6. Care tier: 1 sample plan card (Bronze $249/mo)
7. Process: 3 of 5 steps shown
8. Phone CTA block
9. Footer

**Dashboard sections:**
1. Sidebar nav (Overview, Leads, Projects, Invoices, Clients)
2. Breadcrumb header
3. 4 stat cards (Total Leads, Active Projects, Open Invoices, Revenue)
4. Recent leads table (4-5 rows with status badges)
5. Quick actions area

**Client Portal sections:**
1. Project header (project name, status, client name)
2. Project timeline/milestones (3-4 phases)
3. Deliverables list (3-4 items with status)
4. Recent messages (2-3 thread entries)
5. Next steps callout

### Implementation Order

1. **Prototype A** first — it aligns most closely with the V14 direction already explored and builds on the existing DotLogo and dot-grid-about.js patterns
2. **Prototype C** second — it evolves the current dark system and reuses the constellation concept from A
3. **Prototype B** last — it is the simplest to build (no animation, no canvas, no special effects)

### Per-Prototype Estimated Effort

- **Prototype A:** ~600-800 lines HTML/CSS/JS. CSS is the bulk (grid patterns, dot-matrix background via SVG data URI, construction line patterns). JS: tab switching + optional dot opacity scroll observer.
- **Prototype B:** ~400-500 lines HTML/CSS. Almost pure CSS. JS: tab switching only.
- **Prototype C:** ~700-900 lines HTML/CSS/JS. Canvas-based constellation is the heaviest piece (adapted from dot-grid-about.js). JS: tab switching + constellation renderer + scroll observer.

### Fonts

All three prototypes use the same self-hosted fonts already in `/public/fonts/`:
- Inter (body)
- Halyard Display (via Adobe Fonts — referenced in CSS but loads from Adobe CDN)
- Fraunces (accent, used prominently in Prototype C, minimally in A and B)
- JetBrains Mono (Prototype A only — loaded from CDN or self-hosted)

### Validation Criteria

Each prototype should be evaluated against:
1. Does it embody "structure reduces anxiety"?
2. Does it pass the "if an effect is noticeable, it is wrong" test?
3. Can the tier color system work on this surface?
4. Is the dashboard usable (data density, readability)?
5. Does the portal feel trustworthy (client-facing)?
6. Does it respect `prefers-reduced-motion`?
7. Can it be implemented with the existing tech stack (vanilla JS public, Next.js internal)?
8. Does it feel like the same brand across all three surfaces?

---

## Summary Comparison Matrix

| Dimension | A: Architectural Blueprint | B: Warm Minimalism | C: Living Canvas |
|-----------|---------------------------|-------------------|-----------------|
| **Primary mode** | Light (cream) | Light (warm white) | Dark (deep black) |
| **Signature element** | Dot-matrix grid + construction lines | Oversized typography + whitespace | Responsive constellation dots |
| **Glass/blur** | None | None | None |
| **Ambient animation** | None (static patterns) | None | Constellation scroll response |
| **Card style** | Sharp corners, thin borders, registration marks | Plain white, 2px left accent | Solid depth planes, top accent |
| **Tier color intensity** | Medium (deepened for light bg) | Muted/desaturated | Rich/saturated |
| **Type scale** | Moderate, architectural precision | Very large, editorial | Moderate-large, dramatic |
| **Mono font** | Yes (annotations) | No | No (Fraunces for accent) |
| **Dashboard mood** | War room, dark blueprint | Dark spreadsheet | Command center |
| **Portal mood** | Project sheet | Clean document | Leather-bound book |
| **Total keyframes** | 0 | 0 | 1 |
| **Canvas/JS complexity** | Low (optional scroll observer) | Zero | Medium (constellation) |
| **Departure from current** | High (light mode, new visual language) | Extreme (total aesthetic reset) | Moderate (evolved dark, new depth model) |

// src/lib/questionnaire-schema.ts
// Brand Discovery Questionnaire — single source of truth for steps, fields,
// validation shape, and admin-email serialization.
//
// Imported by:
//   - src/pages/questionnaire.astro  (wizard renderer)
//   - api/questionnaire/save-field   (field existence + value shape validation)
//   - api/questionnaire/complete     (required-field gating + summary email)
//
// Addendums (optional step 9) live in ./questionnaire-addendums/<key>.ts and
// are resolved through ./questionnaire-addendums/index.ts.

export type FieldType = 'text' | 'textarea' | 'radio' | 'checkbox';

export interface FieldOption {
  value: string;
  label: string;
}

export interface QuestionnaireField {
  key: string;                 // stable storage key, e.g. 'basics_name'
  label: string;               // human-readable question
  hint?: string;               // helper copy shown below the label
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;          // text/textarea only (default: 200 text, 2000 textarea)
  options?: FieldOption[];     // radio/checkbox only
  maxSelect?: number;          // checkbox only — pick up to N
}

export interface QuestionnaireStep {
  index: number;               // 1-based, sequential
  title: string;
  intro: string;               // warm one-line intro shown above fields
  fields: QuestionnaireField[];
}

// ============================================
// STANDARD 8 STEPS
// ============================================

export const STANDARD_STEPS: QuestionnaireStep[] = [
  {
    index: 1,
    title: 'The Basics',
    intro: "Let's start with the simple stuff. Short answers are great.",
    fields: [
      { key: 'basics_name', label: 'Your Name', type: 'text', required: true, maxLength: 200 },
      { key: 'basics_brand', label: 'Business or Brand Name', type: 'text', hint: 'If you have one already. If not, leave it blank.', maxLength: 200 },
      { key: 'basics_location', label: 'Where are you based?', type: 'text', hint: 'City, province/state, country.', maxLength: 200 },
      { key: 'basics_email', label: 'Best email to reach you', type: 'text', required: true, maxLength: 254 },
      { key: 'basics_phone', label: 'Best phone number (optional)', type: 'text', maxLength: 40 },
      { key: 'basics_website', label: 'Do you have an existing website?', type: 'text', hint: "If yes, enter the URL. If no, just write 'No'.", maxLength: 500 },
      { key: 'basics_social', label: 'Do you have existing social media accounts?', type: 'textarea', hint: 'List any handles or URLs.', maxLength: 2000 },
    ],
  },
  {
    index: 2,
    title: 'Your Vision',
    intro: "This is the heart of it. Don't overthink — just tell us what you see.",
    fields: [
      { key: 'vision_oneSentence', label: 'In one sentence, what does your brand do?', type: 'textarea', required: true, hint: "Example: 'We sell hand-illustrated encouragement cards and gifts.'", maxLength: 600 },
      { key: 'vision_why', label: 'Why does this brand exist?', type: 'textarea', required: true, hint: 'What inspired you to start it? What problem does it solve or feeling does it create?', maxLength: 2000 },
      { key: 'vision_story', label: 'Is there a story behind the brand?', type: 'textarea', hint: 'A personal experience, a person who inspired it, a moment that started it all?', maxLength: 2000 },
      { key: 'vision_feelingWords', label: 'What are 3 words that describe how you want people to feel about your brand?', type: 'text', hint: 'Example: warm, encouraged, hopeful', maxLength: 300 },
      { key: 'vision_tagline', label: 'Is there a tagline or phrase you love?', type: 'text', hint: "Something you'd want on a t-shirt, a card, or at the top of your website.", maxLength: 300 },
    ],
  },
  {
    index: 3,
    title: 'Your Audience',
    intro: 'Who are we speaking to? A rough sketch is plenty here.',
    fields: [
      { key: 'audience_ideal', label: 'Who is your ideal customer?', type: 'textarea', hint: 'Describe them in a few words — age, lifestyle, what they care about.', maxLength: 2000 },
      {
        key: 'audience_ageRange', label: 'What age range fits your audience best?', type: 'checkbox',
        options: [
          { value: 'under_18', label: 'Under 18' },
          { value: '18_25', label: '18–25' },
          { value: '26_35', label: '26–35' },
          { value: '36_50', label: '36–50' },
          { value: '51_65', label: '51–65' },
          { value: '65_plus', label: '65+' },
          { value: 'all_ages', label: 'All ages' },
        ],
      },
      {
        key: 'audience_useCase', label: 'Are your products mainly for...', type: 'checkbox',
        options: [
          { value: 'gift', label: 'Giving as a gift' },
          { value: 'self', label: 'Buying for yourself' },
          { value: 'corporate', label: 'Workplace / corporate' },
          { value: 'kids_family', label: 'Kids / family' },
          { value: 'occasions', label: 'Special occasions' },
          { value: 'everyday', label: 'Everyday encouragement' },
        ],
      },
      {
        key: 'audience_channels', label: 'Where does your audience spend time?', type: 'checkbox',
        options: [
          { value: 'instagram', label: 'Instagram' },
          { value: 'facebook', label: 'Facebook' },
          { value: 'tiktok', label: 'TikTok' },
          { value: 'pinterest', label: 'Pinterest' },
          { value: 'markets', label: 'Local markets / fairs' },
          { value: 'gift_shops', label: 'Gift shops / boutiques' },
          { value: 'online_shopping', label: 'Online shopping' },
          { value: 'other', label: 'Other' },
        ],
      },
    ],
  },
  {
    index: 4,
    title: 'Your Products',
    intro: "What are you making? Rough plans are welcome — we'll refine together.",
    fields: [
      {
        key: 'products_types', label: 'What types of products do you plan to offer?', type: 'checkbox',
        options: [
          { value: 'cards', label: 'Greeting cards' },
          { value: 'prints', label: 'Art prints / posters' },
          { value: 'apparel', label: 'T-shirts / apparel' },
          { value: 'hats', label: 'Hats' },
          { value: 'stickers', label: 'Stickers' },
          { value: 'mugs', label: 'Mugs' },
          { value: 'totes', label: 'Tote bags' },
          { value: 'home_decor', label: 'Home decor / wall signs' },
          { value: 'kids', label: "Kids' items" },
          { value: 'wood', label: 'Wood products' },
          { value: 'paper_goods', label: 'Napkins / paper goods' },
          { value: 'bundles', label: 'Bundles / gift sets' },
        ],
      },
      { key: 'products_launchFirst', label: 'Which products do you want to launch with first?', type: 'textarea', maxLength: 2000 },
      { key: 'products_priceRange', label: 'Do you have a general price range in mind?', type: 'textarea', hint: "Example: 'Cards around $6, prints around $25'", maxLength: 1000 },
      {
        key: 'products_sustainability', label: 'Are sustainable or eco-friendly materials important to your brand?', type: 'radio',
        options: [
          { value: 'core', label: "Yes — it's a core part of the brand" },
          { value: 'somewhat', label: "Somewhat — I'd like to where possible" },
          { value: 'not_priority', label: 'Not a priority right now' },
        ],
      },
      {
        key: 'products_otherChannels', label: 'Will you sell through other channels besides your website?', type: 'checkbox',
        options: [
          { value: 'markets', label: 'Local markets / pop-ups' },
          { value: 'wholesale', label: 'Wholesale to retailers' },
          { value: 'etsy', label: 'Etsy or similar' },
          { value: 'corporate_bulk', label: 'Corporate / bulk orders' },
          { value: 'website_only', label: 'Website only for now' },
        ],
      },
    ],
  },
  {
    index: 5,
    title: 'Look & Feel',
    intro: 'This helps us speak the same visual language from day one.',
    fields: [
      {
        key: 'look_styleWords', label: 'Which words describe the visual style you\u2019re drawn to?',
        hint: 'Pick up to 4.', type: 'checkbox', maxSelect: 4,
        options: [
          { value: 'hand_drawn', label: 'Hand-drawn / illustrated' },
          { value: 'clean_minimal', label: 'Clean / minimal' },
          { value: 'bold_playful', label: 'Bold / playful' },
          { value: 'earthy_natural', label: 'Earthy / natural' },
          { value: 'modern_sleek', label: 'Modern / sleek' },
          { value: 'vintage_retro', label: 'Vintage / retro' },
          { value: 'warm_cozy', label: 'Warm / cozy' },
          { value: 'professional_polished', label: 'Professional / polished' },
        ],
      },
      { key: 'look_brandsAdmired', label: 'Are there any brands you admire?', type: 'textarea', hint: "They don't have to be in your industry.", maxLength: 2000 },
      { key: 'look_existingArt', label: 'Do you have any existing artwork, sketches, or illustrations?', type: 'textarea', maxLength: 2000 },
      {
        key: 'look_logoStatus', label: 'Do you have a logo or brand mark already?', type: 'radio',
        options: [
          { value: 'finished', label: 'Yes — finished logo' },
          { value: 'sketches', label: 'Sketches / ideas but nothing finalized' },
          { value: 'none', label: 'No — I need one created' },
        ],
      },
      { key: 'look_colors', label: 'Any colors you love or want to avoid?', type: 'text', maxLength: 400 },
    ],
  },
  {
    index: 6,
    title: 'Your Website',
    intro: "What does the site need to do? Plain-English answers are perfect.",
    fields: [
      {
        key: 'web_mainJob', label: "What's the main job of your website?", type: 'radio',
        options: [
          { value: 'sell_online', label: 'Sell products online' },
          { value: 'showcase', label: 'Showcase brand, sell elsewhere' },
          { value: 'both', label: 'Both' },
          { value: 'not_sure', label: 'Not sure yet' },
        ],
      },
      {
        key: 'web_pages', label: 'What pages do you want on your site?', type: 'checkbox',
        options: [
          { value: 'home', label: 'Home' },
          { value: 'about', label: 'About / Our Story' },
          { value: 'shop', label: 'Shop / Products' },
          { value: 'contact', label: 'Contact' },
          { value: 'blog', label: 'Blog / News' },
          { value: 'wholesale', label: 'Wholesale' },
          { value: 'community', label: 'Community / Social' },
          { value: 'press', label: 'Press / Media' },
          { value: 'philanthropy', label: 'Philanthropy' },
          { value: 'faq', label: 'FAQ' },
        ],
      },
      { key: 'web_domain', label: 'Do you have a domain name in mind?', type: 'text', maxLength: 400 },
      {
        key: 'web_ecomHelp', label: 'Do you need help setting up payments and shipping?', type: 'radio',
        options: [
          { value: 'full_ecom', label: 'Yes — full e-commerce setup' },
          { value: 'guidance', label: 'Just guidance' },
          { value: 'not_selling', label: 'Not selling online right now' },
        ],
      },
      {
        key: 'web_newsletter', label: 'Do you want to collect email addresses (newsletter)?', type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'maybe_later', label: 'Maybe later' },
          { value: 'no', label: 'No' },
        ],
      },
    ],
  },
  {
    index: 7,
    title: 'Timeline & Priorities',
    intro: "So we know how to pace things. No wrong answers.",
    fields: [
      {
        key: 'timeline_launch', label: 'How soon do you want to launch?', type: 'radio',
        options: [
          { value: 'asap', label: 'ASAP' },
          { value: '1_2_months', label: '1–2 months' },
          { value: '3_6_months', label: '3–6 months' },
          { value: 'no_rush', label: 'No rush' },
        ],
      },
      {
        key: 'timeline_priorities', label: "What's most important to you?",
        hint: 'Pick your top 2.', type: 'checkbox', maxSelect: 2,
        options: [
          { value: 'beautiful_site', label: 'Beautiful website' },
          { value: 'strong_identity', label: 'Strong brand identity' },
          { value: 'products_selling', label: 'Products for sale quickly' },
          { value: 'story_told', label: 'Brand story told well' },
          { value: 'social_presence', label: 'Social media presence' },
          { value: 'wholesale_retail', label: 'Wholesale / retail channels' },
        ],
      },
      { key: 'timeline_event', label: 'Is there a specific date or event you\u2019re working toward?', type: 'text', maxLength: 400 },
      { key: 'timeline_success', label: 'What does success look like in the first 6 months?', type: 'textarea', maxLength: 2000 },
    ],
  },
  {
    index: 8,
    title: 'Anything Else',
    intro: "Last step. Anything we didn't ask that we should know?",
    fields: [
      { key: 'extra_anythingElse', label: 'Is there anything else you want us to know?', type: 'textarea', maxLength: 4000 },
    ],
  },
];

// ============================================
// LIMITS & VALIDATION HELPERS
// ============================================

const DEFAULT_TEXT_MAX = 500;
const DEFAULT_TEXTAREA_MAX = 4000;
const CHECKBOX_MAX_ITEMS = 20;
const CHECKBOX_ITEM_MAX_LENGTH = 200;

/**
 * Find a field definition by key across a combined schema (standard + optional addendum).
 */
export function getFieldByKey(combinedSteps: QuestionnaireStep[], key: string): QuestionnaireField | undefined {
  for (const step of combinedSteps) {
    const found = step.fields.find((f) => f.key === key);
    if (found) return found;
  }
  return undefined;
}

/**
 * Validate that `value` matches the shape expected for `field`.
 * Returns { ok: true, sanitized } or { ok: false, reason }.
 * Server-side — never trust the client.
 */
export function validateFieldValue(
  field: QuestionnaireField,
  value: unknown
): { ok: true; sanitized: unknown } | { ok: false; reason: string } {
  // Empty value is always allowed for non-required fields at save time
  // (required enforcement happens at completion, not per-field-save).
  if (value === null || value === undefined || value === '') {
    return { ok: true, sanitized: '' };
  }

  if (field.type === 'text') {
    if (typeof value !== 'string') return { ok: false, reason: 'Value must be a string' };
    const max = field.maxLength ?? DEFAULT_TEXT_MAX;
    if (value.length > max) return { ok: false, reason: `Value exceeds ${max} characters` };
    return { ok: true, sanitized: value };
  }

  if (field.type === 'textarea') {
    if (typeof value !== 'string') return { ok: false, reason: 'Value must be a string' };
    const max = field.maxLength ?? DEFAULT_TEXTAREA_MAX;
    if (value.length > max) return { ok: false, reason: `Value exceeds ${max} characters` };
    return { ok: true, sanitized: value };
  }

  if (field.type === 'radio') {
    if (typeof value !== 'string') return { ok: false, reason: 'Value must be a string' };
    const allowed = (field.options || []).map((o) => o.value);
    if (!allowed.includes(value)) return { ok: false, reason: 'Value not in allowed options' };
    return { ok: true, sanitized: value };
  }

  if (field.type === 'checkbox') {
    if (!Array.isArray(value)) return { ok: false, reason: 'Value must be an array' };
    if (value.length > CHECKBOX_MAX_ITEMS) return { ok: false, reason: `Too many selections (max ${CHECKBOX_MAX_ITEMS})` };
    if (field.maxSelect && value.length > field.maxSelect) {
      return { ok: false, reason: `Please pick up to ${field.maxSelect}` };
    }
    const allowed = new Set((field.options || []).map((o) => o.value));
    for (const v of value) {
      if (typeof v !== 'string') return { ok: false, reason: 'Array values must be strings' };
      if (v.length > CHECKBOX_ITEM_MAX_LENGTH) return { ok: false, reason: 'Array item too long' };
      if (!allowed.has(v)) return { ok: false, reason: `Value '${v}' not in allowed options` };
    }
    return { ok: true, sanitized: value };
  }

  return { ok: false, reason: 'Unknown field type' };
}

/**
 * Check if a field has a non-empty response.
 */
function hasValue(field: QuestionnaireField, responses: Record<string, unknown>): boolean {
  const v = responses[field.key];
  if (v === null || v === undefined) return false;
  if (field.type === 'checkbox') return Array.isArray(v) && v.length > 0;
  if (typeof v === 'string') return v.trim().length > 0;
  return false;
}

/**
 * Return the lowest step index (1-based) that still has unfilled required fields,
 * or (steps.length + 1) if every required field is complete.
 * Used for resume-at-step UX on page load.
 */
export function computeResumeStep(combinedSteps: QuestionnaireStep[], responses: Record<string, unknown>): number {
  for (const step of combinedSteps) {
    const missingRequired = step.fields.some((f) => f.required && !hasValue(f, responses));
    if (missingRequired) return step.index;
  }
  return combinedSteps.length; // all required fields filled — land on final step
}

/**
 * Check that every required field (across all steps) has a value.
 * Returns { ok: true } or { ok: false, missing: string[] }.
 */
export function validateAllRequired(
  combinedSteps: QuestionnaireStep[],
  responses: Record<string, unknown>
): { ok: true } | { ok: false; missing: string[] } {
  const missing: string[] = [];
  for (const step of combinedSteps) {
    for (const field of step.fields) {
      if (field.required && !hasValue(field, responses)) {
        missing.push(field.key);
      }
    }
  }
  if (missing.length > 0) return { ok: false, missing };
  return { ok: true };
}

/**
 * Render a response value as human-readable HTML for the admin summary email.
 * Checkbox arrays become bulleted lists; empty values render as an em-dash.
 */
function renderValueHtml(field: QuestionnaireField, value: unknown, escapeHtml: (s: string) => string): string {
  if (value === null || value === undefined || value === '') return '<span style="color:#999">—</span>';

  if (field.type === 'checkbox' && Array.isArray(value)) {
    if (value.length === 0) return '<span style="color:#999">—</span>';
    const labelFor = (v: string) => field.options?.find((o) => o.value === v)?.label ?? v;
    const items = value.map((v) => `<li>${escapeHtml(labelFor(String(v)))}</li>`).join('');
    return `<ul style="margin:0;padding-left:20px">${items}</ul>`;
  }

  if (field.type === 'radio' && typeof value === 'string') {
    const label = field.options?.find((o) => o.value === value)?.label ?? value;
    return escapeHtml(label);
  }

  if (typeof value === 'string') {
    // Preserve line breaks for textareas
    return escapeHtml(value).replace(/\n/g, '<br>');
  }

  return escapeHtml(String(value));
}

/**
 * Build an HTML summary table of the full questionnaire response for the admin email.
 * Caller must provide `escapeHtml` (kept as a param so this module stays dependency-free).
 */
export function serializeResponsesAsHtmlTable(
  combinedSteps: QuestionnaireStep[],
  responses: Record<string, unknown>,
  fieldUpdatedAt: Record<string, string>,
  escapeHtml: (s: string) => string
): string {
  const sections: string[] = [];

  for (const step of combinedSteps) {
    const rows: string[] = [];
    for (const field of step.fields) {
      const value = responses[field.key];
      const valueHtml = renderValueHtml(field, value, escapeHtml);
      const updatedAt = fieldUpdatedAt[field.key];
      const updatedNote = updatedAt
        ? `<div style="color:#999;font-size:11px;margin-top:4px">Updated ${escapeHtml(new Date(updatedAt).toLocaleString())}</div>`
        : '';

      rows.push(`
        <tr>
          <td style="padding:10px 14px;vertical-align:top;border-top:1px solid #eee;width:38%;color:#444;font-weight:500">
            ${escapeHtml(field.label)}${updatedNote}
          </td>
          <td style="padding:10px 14px;vertical-align:top;border-top:1px solid #eee;color:#111">
            ${valueHtml}
          </td>
        </tr>
      `);
    }

    sections.push(`
      <section style="margin:28px 0">
        <h2 style="font-size:15px;font-weight:600;color:#0a0a0a;margin:0 0 4px 0">Step ${step.index}: ${escapeHtml(step.title)}</h2>
        <p style="font-size:13px;color:#666;margin:0 0 12px 0">${escapeHtml(step.intro)}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tbody>${rows.join('')}</tbody>
        </table>
      </section>
    `);
  }

  return sections.join('');
}

/**
 * Plain-text version of the summary (fallback for email clients that disable HTML).
 */
export function serializeResponsesAsPlainText(
  combinedSteps: QuestionnaireStep[],
  responses: Record<string, unknown>
): string {
  const out: string[] = [];
  for (const step of combinedSteps) {
    out.push(`\n==== Step ${step.index}: ${step.title} ====`);
    for (const field of step.fields) {
      const value = responses[field.key];
      let rendered = '—';
      if (field.type === 'checkbox' && Array.isArray(value) && value.length > 0) {
        const labelFor = (v: string) => field.options?.find((o) => o.value === v)?.label ?? v;
        rendered = value.map((v) => `  • ${labelFor(String(v))}`).join('\n');
      } else if (field.type === 'radio' && typeof value === 'string' && value) {
        rendered = field.options?.find((o) => o.value === value)?.label ?? value;
      } else if (typeof value === 'string' && value.trim()) {
        rendered = value;
      }
      out.push(`\n${field.label}\n${rendered}`);
    }
  }
  return out.join('\n');
}

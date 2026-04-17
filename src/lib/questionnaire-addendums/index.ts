// src/lib/questionnaire-addendums/index.ts
// Registry mapping a project's `addendum_key` → its step-9 module.
//
// To add a new project addendum:
//   1. Create ./your-project-key.ts exporting `{ addendum: QuestionnaireStep }`.
//   2. Register the key here.
//   3. Insert a questionnaire_projects row with that `addendum_key`.
//
// Static imports keep this build-time friendly (Astro + Vercel Functions both
// resolve without dynamic-import overhead).

import type { QuestionnaireStep } from '../questionnaire-schema.js';
import { addendum as hangInThere } from './hang-in-there.js';

const REGISTRY: Record<string, QuestionnaireStep> = {
  'hang-in-there': hangInThere,
};

/**
 * Look up the step-9 addendum for a given key.
 * Returns undefined if the key is null, empty, or unregistered.
 */
export function getAddendumStep(key: string | null | undefined): QuestionnaireStep | undefined {
  if (!key) return undefined;
  return REGISTRY[key];
}

/**
 * All registered addendum keys (for admin tooling / debugging).
 */
export function listAddendumKeys(): string[] {
  return Object.keys(REGISTRY);
}

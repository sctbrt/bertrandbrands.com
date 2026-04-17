// src/lib/questionnaire-addendums/hang-in-there.ts
// Project-specific step 9 appended for "Hang In There" questionnaires.
//
// PLACEHOLDER — Scott to replace the field copy with final wording before this
// project actually goes live. The structure below is wired and tested; only the
// text needs refinement.

import type { QuestionnaireStep } from '../questionnaire-schema.js';

export const addendum: QuestionnaireStep = {
  index: 9,
  title: 'Hang In There — Project Specifics',
  intro: 'A few questions tailored to this project.',
  fields: [
    {
      key: 'hit_characterNames',
      label: 'Do you have names for your characters yet?',
      type: 'textarea',
      hint: 'If not, sketches or rough ideas are welcome.',
      maxLength: 2000,
    },
    {
      key: 'hit_characterBackstory',
      label: 'Is there a backstory or world the characters live in?',
      type: 'textarea',
      maxLength: 2000,
    },
    {
      key: 'hit_messages',
      label: 'What kinds of messages or sayings do you want on your products?',
      hint: 'A few examples are fine — we can expand from there.',
      type: 'textarea',
      maxLength: 4000,
    },
    {
      key: 'hit_supplierStatus',
      label: 'Have you identified suppliers yet?',
      type: 'radio',
      options: [
        { value: 'yes_locked', label: 'Yes — I have suppliers lined up' },
        { value: 'some', label: 'Some — still sourcing others' },
        { value: 'none', label: 'Not yet — need help finding them' },
      ],
    },
    {
      key: 'hit_supplierNotes',
      label: 'Any suppliers you want us to know about?',
      type: 'textarea',
      hint: 'Names, URLs, or notes on who you\u2019re working with.',
      maxLength: 2000,
    },
    {
      key: 'hit_artworkReadiness',
      label: 'How far along is your artwork?',
      type: 'radio',
      options: [
        { value: 'ready', label: 'Ready to go — files in hand' },
        { value: 'in_progress', label: 'In progress — drafts available' },
        { value: 'needs_creation', label: 'Needs to be created from scratch' },
      ],
    },
    {
      key: 'hit_artworkNotes',
      label: 'Anything else about the artwork we should know?',
      type: 'textarea',
      maxLength: 2000,
    },
  ],
};

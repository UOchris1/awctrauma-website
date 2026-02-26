export type HandoutPreviewType = 'markdown' | 'docx' | 'pdf'
export type HandoutGroup =
  | 'Infection Prevention'
  | 'Ventilator Care'
  | 'VTE and Anticoagulation'
  | 'Perioperative'
  | 'Special Populations'
  | 'Orthopaedic Trauma'

export interface HandoutAsset {
  label: string
  path: string
}

export interface SICUHandout {
  slug: string
  group: HandoutGroup
  title: string
  summary: string
  previewType: HandoutPreviewType
  previewPath: string
  assets: HandoutAsset[]
}

const basePath = '/deliverables/sicu-2026'

export const sicuHandouts: SICUHandout[] = [
  {
    slug: 'cauti-hard-stop-handout',
    group: 'Infection Prevention',
    title: 'CAUTI Hard-Stop Handout',
    summary: 'Aggressive UA/culture ordering guardrails with hard-stop criteria.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_cauti-rounding-handout.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_cauti-rounding-handout.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_cauti-rounding-handout.docx` }
    ]
  },
  {
    slug: 'vap-rounds-handout',
    group: 'Ventilator Care',
    title: 'VAP/VAE Resident Rounds Quick Guide',
    summary: 'Bundle-aligned rounds checklist with daily documentation targets and hard stops.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_vap-rounding-handout.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_vap-rounding-handout.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_vap-rounding-handout.docx` }
    ]
  },
  {
    slug: 'mmv-clinical-reference-guide',
    group: 'Ventilator Care',
    title: 'MMV Clinical Reference Guide',
    summary: 'Bedside reference for mandatory minute ventilation setup, monitoring, and troubleshooting.',
    previewType: 'docx',
    previewPath: `${basePath}/2026-02-26_mmv-clinical-reference-guide.docx`,
    assets: [{ label: 'DOCX', path: `${basePath}/2026-02-26_mmv-clinical-reference-guide.docx` }]
  },
  {
    slug: 'vte-prophylaxis-quick-guide',
    group: 'VTE and Anticoagulation',
    title: 'VTE Prophylaxis Resident Quick Guide',
    summary: 'Timing, dosing logic, anti-Xa use, and discharge planning essentials.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_vte-prophylaxis_resident-quick-guide.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_vte-prophylaxis_resident-quick-guide.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_vte-prophylaxis_resident-quick-guide.docx` }
    ]
  },
  {
    slug: 'anesthesia-npo-quick-guide',
    group: 'Perioperative',
    title: 'Perioperative NPO and Tube Feeding Quick Guide',
    summary: 'Fast reference for PO fasting, tube-feed holds, GLP-1, and urgent case precautions.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_anesthesia-npo_resident-quick-guide.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_anesthesia-npo_resident-quick-guide.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_anesthesia-npo_resident-quick-guide.docx` }
    ]
  },
  {
    slug: 'older-adult-trauma-quick-guide',
    group: 'Special Populations',
    title: 'Older Adult Trauma Resident Quick Guide',
    summary: 'Occult shock triggers, early frailty/delirium actions, and high-yield escalation rules.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_older-adult-trauma_resident-quick-guide.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_older-adult-trauma_resident-quick-guide.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_older-adult-trauma_resident-quick-guide.docx` }
    ]
  },
  {
    slug: 'ortho-trauma-quick-guide',
    group: 'Orthopaedic Trauma',
    title: 'Orthopaedic Trauma Resident Quick Guide',
    summary: 'Pelvic hemorrhage, open-fracture priorities, DCO/EAC decisions, and geriatric hip timing.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_ortho-trauma_resident-quick-guide.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_ortho-trauma_resident-quick-guide.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_ortho-trauma_resident-quick-guide.docx` }
    ]
  },
  {
    slug: 'ue-prevention-handout',
    group: 'Ventilator Care',
    title: 'UE Prevention Rounds Handout',
    summary: 'High-risk airway checks and immediate post-UE actions.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_ue-prevention-rounding-handout.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_ue-prevention-rounding-handout.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_ue-prevention-rounding-handout.docx` }
    ]
  },
  {
    slug: 'fever-workup-draft',
    group: 'Infection Prevention',
    title: 'Fever Workup Guideline (Draft)',
    summary: 'Targeted diagnostic workflow to reduce non-indicated testing.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_fever-workup-guideline_draft.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_fever-workup-guideline_draft.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_fever-workup-guideline_draft.docx` }
    ]
  },
  {
    slug: 'ue-event-form',
    group: 'Ventilator Care',
    title: 'UE Event Form Template',
    summary: 'Structured RN/RT/provider event documentation template.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_ue-event-form_template.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_ue-event-form_template.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_ue-event-form_template.docx` }
    ]
  },
  {
    slug: 'ue-huddle-checklist',
    group: 'Ventilator Care',
    title: 'UE Post-Event Huddle Checklist',
    summary: 'Standardized 1-hour huddle checklist after any UE event.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_ue-post-event-huddle-checklist.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_ue-post-event-huddle-checklist.md` }
    ]
  },
  {
    slug: 'cauti-national-norms-brief',
    group: 'Infection Prevention',
    title: 'CAUTI National Norms + CMS Brief',
    summary: 'National benchmark context and hospital quality impact summary.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_cauti-national-norms_cms-hospital-privileging-brief.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_cauti-national-norms_cms-hospital-privileging-brief.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_cauti-national-norms_cms-hospital-privileging-brief.docx` }
    ]
  },
  {
    slug: 'ua-hard-stop-quotes',
    group: 'Infection Prevention',
    title: 'UA/Culture Hard-Stop Quotes',
    summary: 'Direct source quotes and links supporting hard-stop criteria.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_ua-culture-hard-stop_reference-quotes.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_ua-culture-hard-stop_reference-quotes.md` },
      { label: 'DOCX', path: `${basePath}/2026-02-26_ua-culture-hard-stop_reference-quotes.docx` }
    ]
  },
  {
    slug: 'metrics-dictionary',
    group: 'VTE and Anticoagulation',
    title: 'CAUTI/VAP/UE Metrics Dictionary',
    summary: 'Operational definitions, numerators, and denominators for reporting.',
    previewType: 'markdown',
    previewPath: `${basePath}/2026-02-26_metrics-dictionary_cauti-vap-ue.md`,
    assets: [
      { label: 'Markdown', path: `${basePath}/2026-02-26_metrics-dictionary_cauti-vap-ue.md` }
    ]
  }
]

export function getSICUHandoutBySlug(slug: string): SICUHandout | undefined {
  return sicuHandouts.find((item) => item.slug === slug)
}

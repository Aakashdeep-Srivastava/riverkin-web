/**
 * Demo data for the RiverKin citizen loop.
 *
 * Sites, cities and rivers are REAL OneAquaHealth research locations (Coimbra,
 * Toulouse, Benevento, Ghent, Oslo) — see riverkin-api/data/DATA_PROVENANCE.md.
 * Per-site coordinates are synthesized around the real city centres (OAH has not
 * published exact citizen-site coordinates), so anything shown here still carries
 * the "Simulated, illustrative" badge. The field codes mirror the real OAH code
 * system (foam/colour/smell, hydrology, riparian vegetation, morphology).
 *
 * TODO(PRD): replace with live RiverKin API data (GET /sites, Open-Meteo rain)
 * and the full 106-site seed in riverkin-api/data/oah_sites.json.
 */
import type { Site } from './api-types';

export const mockSites: Site[] = [
  { id: 'cb-coselhas', name: 'Ribeira de Coselhas — São Romão', waterbody: 'Ribeira de Coselhas', daysUnseen: 19, attention: 'urgent', lat: 40.1930, lng: -8.3971 },
  { id: 'tl-touch', name: 'Touch — Tournefeuille reach', waterbody: 'Touch', daysUnseen: 26, attention: 'urgent', lat: 43.5890, lng: 1.4020 },
  { id: 'bn-calore', name: 'Calore Irpino — Ponte Vanvitelli', waterbody: 'Calore Irpino', daysUnseen: 12, attention: 'attention', lat: 41.1312, lng: 14.7821 },
  { id: 'cb-eiras', name: 'Ribeira de Eiras — Ponte dos Amores', waterbody: 'Ribeira de Eiras', daysUnseen: 8, attention: 'attention', lat: 40.2190, lng: -8.4210 },
  { id: 'os-hovinbekken', name: 'Hovinbekken — Hasle reach', waterbody: 'Hovinbekken', daysUnseen: 5, attention: 'monitoring', lat: 59.9230, lng: 10.7920 },
  { id: 'os-akerselva', name: 'Akerselva — Nydalen', waterbody: 'Akerselva', daysUnseen: 3, attention: 'monitoring', lat: 59.9490, lng: 10.7650 },
  { id: 'cb-valeflores', name: 'Vale das Flores — park reach', waterbody: 'Vale das Flores', daysUnseen: 1, attention: 'ok', lat: 40.1920, lng: -8.4040 },
  { id: 'ge-leie', name: 'Leie — Coupure', waterbody: 'Leie', daysUnseen: 0, attention: 'ok', lat: 51.0520, lng: 3.7150 },
];

/** Look up a single site by id. */
export function getMockSite(id: string): Site | undefined {
  return mockSites.find((s) => s.id === id);
}

/* ============================================================
 * Extended detail for the citizen loop (C2–C6).
 * ============================================================ */

export type GapLevel = 'low' | 'medium' | 'high';

export interface SiteDetail {
  city: string;
  country: string;
  /** Rain in the last 48 h (mm), from Open-Meteo in production. */
  rain48h: number;
  gapLevel: GapLevel;
  /** Plain-language "Why this site?" reason. */
  reason: string;
  lastCheckLabel: string;
  photoCount: number;
}

export const mockSiteDetails: Record<string, SiteDetail> = {
  'cb-coselhas': {
    city: 'Coimbra', country: 'Portugal', rain48h: 32, gapLevel: 'high',
    reason: 'No observations since 32 mm of rain fell. A bank-side check keeps this OneAquaHealth site’s time series intact.',
    lastCheckLabel: '19 days ago', photoCount: 3,
  },
  'tl-touch': {
    city: 'Toulouse', country: 'France', rain48h: 9, gapLevel: 'high',
    reason: 'Unseen for over three weeks — an orphan-site mission. Any look revives the record.',
    lastCheckLabel: '26 days ago', photoCount: 1,
  },
  'bn-calore': {
    city: 'Benevento', country: 'Italy', rain48h: 14, gapLevel: 'medium',
    reason: 'Flow looked high after recent rain. Confirm the bank is clear below Ponte Vanvitelli.',
    lastCheckLabel: '12 days ago', photoCount: 2,
  },
  'cb-eiras': {
    city: 'Coimbra', country: 'Portugal', rain48h: 11, gapLevel: 'medium',
    reason: 'Due for its fortnightly check. Riparian vegetation here changes fast.',
    lastCheckLabel: '8 days ago', photoCount: 4,
  },
  'os-hovinbekken': {
    city: 'Oslo', country: 'Norway', rain48h: 6, gapLevel: 'low',
    reason: 'On its regular cadence. A monitoring check keeps the record fresh.',
    lastCheckLabel: '5 days ago', photoCount: 3,
  },
  'os-akerselva': {
    city: 'Oslo', country: 'Norway', rain48h: 4, gapLevel: 'low',
    reason: 'Recently seen and healthy. Shown for coverage context.',
    lastCheckLabel: '3 days ago', photoCount: 6,
  },
  'cb-valeflores': {
    city: 'Coimbra', country: 'Portugal', rain48h: 2, gapLevel: 'low',
    reason: 'Seen yesterday. No action needed right now.',
    lastCheckLabel: 'yesterday', photoCount: 5,
  },
  'ge-leie': {
    city: 'Ghent', country: 'Belgium', rain48h: 1, gapLevel: 'low',
    reason: 'Seen today — healthy. Shown for coverage context.',
    lastCheckLabel: 'today', photoCount: 7,
  },
};

export function getMockSiteDetail(id: string): SiteDetail | undefined {
  return mockSiteDetails[id];
}

/* ---- Mission brief (C3) ---- */
export interface MissionBrief {
  id: string;
  siteId: string;
  name: string;
  windowLabel: string;
  estMinutes: string;
  distanceKm: number;
  safetyLine: string;
  steps: string[];
}

export const mockMissionBriefs: Record<string, MissionBrief> = {
  'cb-coselhas': {
    id: 'mission-coselhas', siteId: 'cb-coselhas', name: 'After-the-Rain Check',
    windowLabel: 'Open for 2 days', estMinutes: '3–5 min', distanceKm: 1.2,
    safetyLine: 'Photo from the bank only. Never wade or touch water near pipes.',
    steps: ['Observe', 'Photograph', 'Verify'],
  },
  'tl-touch': {
    id: 'mission-touch', siteId: 'tl-touch', name: 'Orphan-Site Check',
    windowLabel: 'Unseen 26 days', estMinutes: '3–5 min', distanceKm: 3.4,
    safetyLine: 'Photo from the bank only. Keep back from fast or high water.',
    steps: ['Observe', 'Photograph', 'Verify'],
  },
  'bn-calore': {
    id: 'mission-calore', siteId: 'bn-calore', name: 'Flow Settle Check',
    windowLabel: 'Open for 5 days', estMinutes: '3–5 min', distanceKm: 2.1,
    safetyLine: 'Photo from the bank only. Keep back from fast or high water.',
    steps: ['Observe', 'Photograph', 'Verify'],
  },
  'cb-eiras': {
    id: 'mission-eiras', siteId: 'cb-eiras', name: 'Fortnightly Check',
    windowLabel: 'Open for 6 days', estMinutes: '3–5 min', distanceKm: 0.8,
    safetyLine: 'Photo from the bank only. Watch your footing on the path.',
    steps: ['Observe', 'Photograph', 'Verify'],
  },
};

export function getMockMissionBrief(siteId: string): MissionBrief | undefined {
  return mockMissionBriefs[siteId];
}

/* ---- Field check questions (C4) — mirror the real OAH code system ---- */
export type AnswerTone = 'ok' | 'warn' | 'bad' | 'neutral';

export interface FieldOption {
  value: string;
  label: string;
  tone?: AnswerTone;
}

export interface FieldQuestion {
  id: string;
  /** Maps to the OAH code system where one exists (see oah_field_codes.json). */
  fieldCode: string;
  question: string;
  options: FieldOption[];
}

export const fieldQuestions: FieldQuestion[] = [
  {
    id: 'q-water', fieldCode: 'foam', question: 'What is the water appearance?',
    options: [
      { value: 'clear', label: 'Clear', tone: 'ok' },
      { value: 'slightly_cloudy', label: 'Slightly cloudy', tone: 'neutral' },
      { value: 'cloudy', label: 'Cloudy', tone: 'warn' },
      { value: 'very_turbid', label: 'Very turbid', tone: 'bad' },
    ],
  },
  {
    id: 'q-litter', fieldCode: 'litter', question: 'Any visible litter or debris?',
    options: [
      { value: 'none', label: 'None', tone: 'ok' },
      { value: 'some', label: 'Some', tone: 'warn' },
      { value: 'a_lot', label: 'A lot', tone: 'bad' },
    ],
  },
  {
    id: 'q-foam', fieldCode: 'foam', question: 'Is there foam on the surface?',
    options: [
      { value: 'none', label: 'None', tone: 'ok' },
      { value: 'patches', label: 'A few patches', tone: 'warn' },
      { value: 'lots', label: 'Lots of foam', tone: 'bad' },
    ],
  },
  {
    id: 'q-flow', fieldCode: 'hydrology', question: 'How is the flow?',
    options: [
      { value: 'low', label: 'Low / still', tone: 'neutral' },
      { value: 'normal', label: 'Normal', tone: 'ok' },
      { value: 'high', label: 'High / fast', tone: 'warn' },
    ],
  },
  {
    id: 'q-pipe', fieldCode: 'pipe_outfall', question: 'Any pipe or outfall discharging?',
    options: [
      { value: 'no', label: 'No', tone: 'ok' },
      { value: 'yes', label: 'Yes — I can see one', tone: 'bad' },
      { value: 'cant_tell', label: "Can't tell", tone: 'neutral' },
    ],
  },
];

/** Camera steps after the questions. Bank is optional. */
export interface CameraStep {
  id: string;
  label: string;
  hint: string;
  optional?: boolean;
}
export const cameraSteps: CameraStep[] = [
  { id: 'upstream', label: 'Upstream', hint: 'Face upstream and frame the water + bank.' },
  { id: 'downstream', label: 'Downstream', hint: 'Turn around and frame downstream.' },
  { id: 'bank', label: 'Bank', hint: 'Optional: the bank vegetation or any issue.', optional: true },
];

/** Feelings pick (stored at crew level; wellbeing perception). */
export const feelings: { value: string; label: string }[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'hopeful', label: 'Hopeful' },
  { value: 'curious', label: 'Curious' },
  { value: 'worried', label: 'Worried' },
];

/* ---- Verify round (C5) ---- */
export interface VerifyItem {
  id: string;
  siteName: string;
  prompt: string;
  /** The AI "highlight" note — a weak prior, never a verdict. */
  aiBox: string;
  photoAlt: string;
}

export const verifyQueue: VerifyItem[] = [
  { id: 'v-01', siteName: 'A stream in Coimbra', prompt: 'Does this water look clear?', aiBox: 'I flagged a possible sheen near the left bank. Humans decide.', photoAlt: 'Simulated river surface near a bank' },
  { id: 'v-02', siteName: 'A stream in Ghent', prompt: 'Is there visible foam on the surface?', aiBox: 'I spotted light foam under the bridge. Humans decide.', photoAlt: 'Simulated river water near a bridge' },
  { id: 'v-03', siteName: 'A stream in Benevento', prompt: 'Is there litter in the frame?', aiBox: 'Possible debris on the right. Humans decide.', photoAlt: 'Simulated riverbank with vegetation' },
  { id: 'v-04', siteName: 'A stream in Oslo', prompt: 'Does the bank look eroded?', aiBox: 'Bank edge looks exposed. Humans decide.', photoAlt: 'Simulated riverbank close-up' },
  { id: 'v-05', siteName: 'A stream in Toulouse', prompt: 'Is a pipe or outfall visible?', aiBox: 'No outfall detected, but check the shadows. Humans decide.', photoAlt: 'Simulated river with a far bank' },
];

/* ---- Receipt (C6) ---- */
export interface Receipt {
  siteName: string;
  waterbody: string;
  city: string;
  gapBefore: number;
  gapAfter: number;
  rainContext: string;
  verifierCount: number;
  fhirId: string;
  sentinelLine: string;
  state: string;
  dateLabel: string;
  points?: number;
  /** Was the visitor confirmed within the site radius (GPS)? */
  geoOk?: boolean;
}

export function getMockReceipt(siteId: string): Receipt {
  const site = getMockSite(siteId);
  const detail = getMockSiteDetail(siteId);
  return {
    siteName: site?.name ?? 'River reach',
    waterbody: site?.waterbody ?? 'River',
    city: detail?.city ?? 'Coimbra',
    gapBefore: site?.daysUnseen ?? 19,
    gapAfter: 0,
    rainContext: `First verified check after ${detail?.rain48h ?? 32} mm of rain`,
    verifierCount: 3,
    fhirId: 'a91f',
    sentinelLine: 'Sombra: "Plant cover was high on the left bank, so I\'m content."',
    state: 'In peer verification',
    dateLabel: '2 Oct 2026 · 14:23',
  };
}

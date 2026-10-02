/**
 * Mock data for the app shell.
 *
 * Everything here is SIMULATED and only exists so the screens render without a
 * backend. Any UI that displays this data must show the "Simulated, illustrative"
 * label (see <SimulatedBadge />).
 *
 * TODO(PRD): replace with live data from the RiverKin API (OneAquaHealth sites,
 * Open-Meteo weather) once endpoints and exact copy are defined in the PRD.
 */
import type { Mission, Site, VerifyCard } from './api-types';

export const mockSites: Site[] = [
  {
    id: 'site-arno-01',
    name: 'Rifredi reach',
    waterbody: 'Arno',
    daysUnseen: 19,
    attention: 'urgent',
    lat: 43.79,
    lng: 11.23,
  },
  {
    id: 'site-arno-02',
    name: 'Cascine bend',
    waterbody: 'Arno',
    daysUnseen: 8,
    attention: 'attention',
    lat: 43.78,
    lng: 11.22,
  },
  {
    id: 'site-mugnone-01',
    name: 'Mugnone confluence',
    waterbody: 'Mugnone',
    daysUnseen: 3,
    attention: 'monitoring',
    lat: 43.8,
    lng: 11.25,
  },
  {
    id: 'site-greve-01',
    name: 'Greve footbridge',
    waterbody: 'Greve',
    daysUnseen: 0,
    attention: 'ok',
    lat: 43.74,
    lng: 11.19,
  },
];

export const mockMissions: Mission[] = [
  {
    id: 'mission-arno-01',
    siteId: 'site-arno-01',
    siteName: 'Rifredi reach',
    title: 'Check the Rifredi reach',
    summary: 'Unseen for 19 days. A quick bank-side check closes the gap.',
    distanceKm: 1.2,
    attention: 'urgent',
  },
  {
    id: 'mission-arno-02',
    siteId: 'site-arno-02',
    siteName: 'Cascine bend',
    title: 'Look over Cascine bend',
    summary: 'Flow looked high last week. Confirm the bank is clear.',
    distanceKm: 2.6,
    attention: 'attention',
  },
];

export const mockVerifyCards: VerifyCard[] = [
  {
    id: 'verify-01',
    prompt: 'Is there visible foam on the water surface?',
    photoAlt: 'Simulated photo of a river surface near a bank',
  },
  {
    id: 'verify-02',
    prompt: 'Is the water colour unusually brown or cloudy?',
    photoAlt: 'Simulated photo of river water close to the bank',
  },
];

/** Look up a single mock mission by id. */
export function getMockMission(id: string): Mission | undefined {
  return mockMissions.find((m) => m.id === id);
}

/** Look up a single mock site by id. */
export function getMockSite(id: string): Site | undefined {
  return mockSites.find((s) => s.id === id);
}

/* ============================================================
 * Extended, FRONTEND-ONLY mock detail for the citizen loop
 * (C2–C6). These shapes are local to the web app — not the
 * generated API types — so the whole loop renders without a
 * backend. Everything here is SIMULATED (show the badge).
 * TODO(PRD): replace with live RiverKin API data.
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
  'site-arno-01': {
    city: 'Florence',
    country: 'Italy',
    rain48h: 12,
    gapLevel: 'high',
    reason:
      'No recent observations after heavy rainfall. Help us update the conditions and keep the time series consistent.',
    lastCheckLabel: '19 days ago',
    photoCount: 3,
  },
  'site-arno-02': {
    city: 'Florence',
    country: 'Italy',
    rain48h: 8,
    gapLevel: 'medium',
    reason: 'Flow looked high last week. A quick bank-side look confirms whether it has settled.',
    lastCheckLabel: '8 days ago',
    photoCount: 2,
  },
  'site-mugnone-01': {
    city: 'Fiesole',
    country: 'Italy',
    rain48h: 4,
    gapLevel: 'low',
    reason: 'On its regular cadence. A monitoring check keeps the record fresh.',
    lastCheckLabel: '3 days ago',
    photoCount: 4,
  },
  'site-greve-01': {
    city: 'Greve in Chianti',
    country: 'Italy',
    rain48h: 1,
    gapLevel: 'low',
    reason: 'Seen today — no action needed. Shown for coverage context.',
    lastCheckLabel: 'today',
    photoCount: 5,
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
  'site-arno-01': {
    id: 'mission-arno-01',
    siteId: 'site-arno-01',
    name: 'After-the-Rain Check',
    windowLabel: 'Open for 2 days',
    estMinutes: '3–5 min',
    distanceKm: 1.2,
    safetyLine: 'Photo from the bank only. Never wade or touch water near pipes.',
    steps: ['Observe', 'Photograph', 'Verify'],
  },
  'site-arno-02': {
    id: 'mission-arno-02',
    siteId: 'site-arno-02',
    name: 'Flow Settle Check',
    windowLabel: 'Open for 5 days',
    estMinutes: '3–5 min',
    distanceKm: 2.6,
    safetyLine: 'Photo from the bank only. Keep back from fast or high water.',
    steps: ['Observe', 'Photograph', 'Verify'],
  },
};

export function getMockMissionBrief(siteId: string): MissionBrief | undefined {
  return mockMissionBriefs[siteId];
}

/* ---- Field check questions (C4) — mirrors OAH protocol fields ---- */
export type AnswerTone = 'ok' | 'warn' | 'bad' | 'neutral';

export interface FieldOption {
  value: string;
  label: string;
  tone?: AnswerTone;
}

export interface FieldQuestion {
  id: string;
  fieldCode: string;
  question: string;
  options: FieldOption[];
}

export const fieldQuestions: FieldQuestion[] = [
  {
    id: 'q-water',
    fieldCode: 'water_appearance',
    question: 'What is the water appearance?',
    options: [
      { value: 'clear', label: 'Clear', tone: 'ok' },
      { value: 'slightly_cloudy', label: 'Slightly cloudy', tone: 'neutral' },
      { value: 'cloudy', label: 'Cloudy', tone: 'warn' },
      { value: 'very_turbid', label: 'Very turbid', tone: 'bad' },
    ],
  },
  {
    id: 'q-litter',
    fieldCode: 'litter',
    question: 'Any visible litter or debris?',
    options: [
      { value: 'none', label: 'None', tone: 'ok' },
      { value: 'some', label: 'Some', tone: 'warn' },
      { value: 'a_lot', label: 'A lot', tone: 'bad' },
    ],
  },
  {
    id: 'q-foam',
    fieldCode: 'foam',
    question: 'Is there foam on the surface?',
    options: [
      { value: 'none', label: 'None', tone: 'ok' },
      { value: 'patches', label: 'A few patches', tone: 'warn' },
      { value: 'lots', label: 'Lots of foam', tone: 'bad' },
    ],
  },
  {
    id: 'q-flow',
    fieldCode: 'flow',
    question: 'How is the flow?',
    options: [
      { value: 'low', label: 'Low / still', tone: 'neutral' },
      { value: 'normal', label: 'Normal', tone: 'ok' },
      { value: 'high', label: 'High / fast', tone: 'warn' },
    ],
  },
  {
    id: 'q-pipe',
    fieldCode: 'pipe_outfall',
    question: 'Any pipe or outfall discharging?',
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
  {
    id: 'v-01',
    siteName: 'A stream in Coimbra',
    prompt: 'Does this water look clear?',
    aiBox: 'I flagged a possible sheen near the left bank. Humans decide.',
    photoAlt: 'Simulated river surface near a bank',
  },
  {
    id: 'v-02',
    siteName: 'A stream in Ghent',
    prompt: 'Is there visible foam on the surface?',
    aiBox: 'I spotted light foam under the bridge. Humans decide.',
    photoAlt: 'Simulated river water near a bridge',
  },
  {
    id: 'v-03',
    siteName: 'A stream in Benevento',
    prompt: 'Is there litter in the frame?',
    aiBox: 'Possible debris on the right. Humans decide.',
    photoAlt: 'Simulated riverbank with vegetation',
  },
  {
    id: 'v-04',
    siteName: 'A stream in Oslo',
    prompt: 'Does the bank look eroded?',
    aiBox: 'Bank edge looks exposed. Humans decide.',
    photoAlt: 'Simulated riverbank close-up',
  },
  {
    id: 'v-05',
    siteName: 'A stream in Florence',
    prompt: 'Is a pipe or outfall visible?',
    aiBox: 'No outfall detected, but check the shadows. Humans decide.',
    photoAlt: 'Simulated river with a far bank',
  },
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
}

export function getMockReceipt(siteId: string): Receipt {
  const site = getMockSite(siteId);
  const detail = getMockSiteDetail(siteId);
  return {
    siteName: site?.name ?? 'River reach',
    waterbody: site?.waterbody ?? 'River',
    city: detail?.city ?? 'Florence',
    gapBefore: site?.daysUnseen ?? 19,
    gapAfter: 0,
    rainContext: `First verified check after ${detail?.rain48h ?? 12} mm of rain`,
    verifierCount: 3,
    fhirId: 'a91f',
    sentinelLine: 'Sombra: "Plant cover was high on the left bank, so I\'m content."',
    state: 'In peer verification',
    dateLabel: '2 Oct 2026 · 14:23',
  };
}

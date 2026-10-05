/**
 * Rich detail content for each challenge's /challenges/[id] page. Kept separate
 * from the state layer (community.ts). Icons are string keys resolved to lucide
 * components in the detail page. "Observe/look-for" items use icon tiles rather
 * than stock photos so the app stays asset-light and honest.
 */
export type IconKey =
  | 'bird' | 'bug' | 'frog' | 'plant' | 'snail'
  | 'litter' | 'pipe' | 'algae' | 'oil' | 'fish'
  | 'rain' | 'droplet' | 'thermometer' | 'wind' | 'flow'
  | 'map' | 'run' | 'camera' | 'doc' | 'upload' | 'pin' | 'leaf';

export interface ObserveItem {
  label: string;
  sub: string;
  icon: IconKey;
}
export interface StepItem {
  title: string;
  body: string;
  icon: IconKey;
}
export interface ChallengeDetail {
  /** Background image in /public, or undefined for a gradient hero. */
  bg?: string;
  accent: string;
  /** "reports" | "sites" | "checks" | "observations" — the progress noun. */
  progressNoun: string;
  why: string;
  /** The 4th stat tile (the first three are sites/days/joined). */
  stat4Title: string;
  stat4Sub: string;
  observeTitle: string;
  observe: ObserveItem[];
  steps: StepItem[];
  safety: string;
}

const COMMON_STEPS: StepItem[] = [
  { title: 'Visit a site', body: 'Go to a nearby river, lake or canal (safe locations only).', icon: 'pin' },
  { title: 'Take clear photos', body: 'Capture what you see from the bank — never enter the water.', icon: 'camera' },
  { title: 'Answer a few questions', body: 'Select what you observed from simple options.', icon: 'doc' },
  { title: 'Submit', body: 'Your observation helps researchers and the community.', icon: 'upload' },
];

export const CHALLENGE_DETAILS: Record<string, ChallengeDetail> = {
  'spot-report-pollution': {
    bg: '/ch-pollution.png',
    accent: '#E5724D',
    progressNoun: 'reports',
    why: 'Litter, plastic, sewage and other visible pollution harm aquatic life and people’s health. Your reports help identify pollution hotspots so communities and authorities can act.',
    stat4Title: 'Real Impact',
    stat4Sub: 'Helps cleaner rivers',
    observeTitle: 'What to look for?',
    observe: [
      { label: 'Litter & Plastics', sub: 'Bottles, wrappers, bags, microplastics', icon: 'litter' },
      { label: 'Discharge / Pipes', sub: 'Visible outflow, foam, unusual colour or smell', icon: 'pipe' },
      { label: 'Algal Blooms', sub: 'Unusual green water or surface scum', icon: 'algae' },
      { label: 'Oil or Chemical', sub: 'Oil film, sheen, unknown substances', icon: 'oil' },
      { label: 'Dead Fish', sub: 'Dead or distressed aquatic life', icon: 'fish' },
    ],
    steps: [
      { title: 'Visit a site', body: 'Go to a nearby river, lake or canal (safe locations only).', icon: 'pin' },
      { title: 'Take clear photos', body: 'Capture the pollution — do not touch or enter the water.', icon: 'camera' },
      { title: 'Answer a few questions', body: 'Select the type, quantity and impact you observe.', icon: 'doc' },
      { title: 'Submit report', body: 'Your report helps authorities and researchers take action.', icon: 'upload' },
    ],
    safety:
      'Observe from the bank only. Do not enter the water, touch unknown substances or approach discharge pipes. Follow local safety guidelines.',
  },

  'after-rain-check': {
    bg: '/ch-rain.png',
    accent: '#1E7BFF',
    progressNoun: 'checks',
    why: 'Heavy rain flushes pollutants, sewage overflow and sediment into rivers. Checks right after rainfall catch changes fast and support early warnings for the whole community.',
    stat4Title: 'High priority',
    stat4Sub: 'Time-sensitive',
    observeTitle: 'What to check?',
    observe: [
      { label: 'Water clarity', sub: 'Murky, muddy or discoloured water', icon: 'droplet' },
      { label: 'Flow & level', sub: 'Faster flow, higher or flooding banks', icon: 'flow' },
      { label: 'Foam & scum', sub: 'Surface foam after the rainfall', icon: 'algae' },
      { label: 'Debris', sub: 'Litter and material washed in', icon: 'litter' },
      { label: 'Smell', sub: 'Sewage or chemical odour', icon: 'wind' },
    ],
    steps: COMMON_STEPS,
    safety:
      'Rivers rise fast after rain. Stay well back from the edge, never enter fast or high water, and photograph from a safe distance on the bank.',
  },

  'biodiversity-walk': {
    bg: '/ch-biodiversity.png',
    accent: '#2FA36B',
    progressNoun: 'sites',
    why: 'Rivers and lakes are home to incredible biodiversity. Your observations help track the health of aquatic ecosystems and support real research.',
    stat4Title: 'Featured',
    stat4Sub: 'Community pick',
    observeTitle: 'What can you observe?',
    observe: [
      { label: 'Birds', sub: 'e.g. kingfisher, heron, ducks', icon: 'bird' },
      { label: 'Insects', sub: 'e.g. dragonflies, mayflies', icon: 'bug' },
      { label: 'Amphibians', sub: 'e.g. frogs, toads, newts', icon: 'frog' },
      { label: 'Plants', sub: 'e.g. water plants, algae', icon: 'plant' },
      { label: 'Other signs', sub: 'e.g. snails, tracks, nests', icon: 'snail' },
    ],
    steps: [
      { title: 'Visit a site', body: 'Go to a nearby river, lake or canal (safe locations only).', icon: 'pin' },
      { title: 'Look and capture', body: 'Take photos of plants, animals or other biodiversity signs.', icon: 'camera' },
      { title: 'Answer a few questions', body: 'Select what you observed from simple options.', icon: 'doc' },
      { title: 'Submit', body: 'Your observation helps researchers and the community.', icon: 'upload' },
    ],
    safety:
      'Observe from the bank only. Do not enter the water or approach wildlife. Follow local guidelines.',
  },

  'run-for-the-river': {
    accent: '#1E7BFF',
    progressNoun: 'sites',
    why: 'Combine your run, walk or cycle with real impact: find freshwater sites along your route and keep them seen. Same routes, bigger purpose.',
    stat4Title: 'Open',
    stat4Sub: 'To all',
    observeTitle: 'On your route',
    observe: [
      { label: 'Find water sites', sub: 'Rivers, canals and ponds near your route', icon: 'map' },
      { label: 'Quick check', sub: 'A 5-minute observation at each', icon: 'droplet' },
      { label: 'Keep moving', sub: 'Run, walk or cycle between sites', icon: 'run' },
      { label: 'Share the route', sub: 'Invite your crew to join', icon: 'leaf' },
    ],
    steps: [
      { title: 'Join as a guest', body: 'No account required.', icon: 'pin' },
      { title: 'Go for a run, walk or cycle', body: 'Find freshwater sites near your route.', icon: 'run' },
      { title: 'Submit quick checks', body: '5-minute observations at each site.', icon: 'camera' },
      { title: 'Help your river', body: 'Your contribution supports real research.', icon: 'upload' },
    ],
    safety:
      'Stay aware of traffic and the riverbank. Photograph from safe ground only and never enter the water.',
  },

  'urban-water-map': {
    accent: '#7A5AF8',
    progressNoun: 'spots',
    why: 'Many urban water spots aren’t on any map yet. Help build the picture of your city’s freshwater so it can be monitored and protected.',
    stat4Title: 'Upcoming',
    stat4Sub: 'Starts soon',
    observeTitle: 'What to map',
    observe: [
      { label: 'Streams', sub: 'Small urban watercourses', icon: 'flow' },
      { label: 'Canals', sub: 'Managed waterways', icon: 'droplet' },
      { label: 'Ponds', sub: 'Still water bodies', icon: 'map' },
      { label: 'Outfalls', sub: 'Where water enters the river', icon: 'pipe' },
    ],
    steps: COMMON_STEPS,
    safety: 'Map from public, safe vantage points only. Never enter the water or private land.',
  },
};

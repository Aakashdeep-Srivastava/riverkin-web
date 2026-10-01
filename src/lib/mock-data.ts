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

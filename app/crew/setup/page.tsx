'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Users, MapPin, ShieldCheck, FileText, Check } from 'lucide-react';
import { Button, buttonClasses } from '@/components/ui/button';
import {
  createCrew,
  addMember,
  adoptSite,
  crewCheckin,
  rememberCrewId,
} from '@/lib/crews-api';

const CONSENT_TEMPLATE = `RiverKin — Parental / Guardian Consent (template)

RiverKin stores NO personal data about students: no name, email, birthdate or
free text. Students take part only as a pseudonymous crew handle (e.g. "Scout 3")
inside their teacher's (Crew Lead's) account.

Field visits for under-16 crews require an active Crew Lead check-in within 100 m.
Observation is bank-only: no wading, never touch water near pipes or sewage.

I consent to my child taking part in RiverKin river observation activities led by
their teacher, under the conditions above.

Child's crew handle: ____________________
Parent/Guardian name: ____________________
Signature: ____________________   Date: __________
`;

/**
 * L2 — Crew Lead setup. Create a crew, add pseudonymous members, adopt up to 3
 * sites, run a safety check-in and download the consent template. No personal
 * student data is ever collected (PRD role model).
 */
export default function CrewSetupPage() {
  const [crewId, setCrewId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [isMinor, setIsMinor] = useState(true);
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const [adopted, setAdopted] = useState<string[]>([]);
  const [siteInput, setSiteInput] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!name.trim()) return;
    setBusy(true);
    setError('');
    try {
      const id = await createCrew(name.trim(), city.trim(), isMinor);
      setCrewId(id);
      rememberCrewId(id);
    } catch {
      setError('Could not create the crew. Is the API running?');
    } finally {
      setBusy(false);
    }
  }

  async function handleAddMember() {
    const handle = memberInput.trim();
    if (!handle || crewId == null) return;
    await addMember(crewId, handle);
    setMembers((m) => [...m, handle]);
    setMemberInput('');
  }

  async function handleAdopt() {
    const code = siteInput.trim().toUpperCase();
    if (!code || crewId == null) return;
    if (adopted.length >= 3) {
      setError('A crew can adopt at most 3 sites.');
      return;
    }
    try {
      await adoptSite(crewId, code);
      setAdopted((a) => [...a, code]);
      setSiteInput('');
      setError('');
    } catch {
      setError(`Could not adopt ${code}. Check the OAH site code (e.g. CB-01).`);
    }
  }

  async function handleCheckin() {
    if (crewId == null) return;
    await crewCheckin(crewId);
    setCheckedIn(true);
  }

  function downloadConsent() {
    const blob = new Blob([CONSENT_TEMPLATE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'riverkin-consent-template.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pb-24">
      <header className="flex items-center gap-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <Link
          href="/crew"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">Crew Lead</p>
          <h1 className="text-lg font-bold leading-tight text-ink">Set up your crew</h1>
        </div>
      </header>

      {error ? (
        <p className="mt-4 rounded-card border border-[color-mix(in_srgb,var(--urgent)_45%,var(--unseen))] bg-[color-mix(in_srgb,var(--urgent)_8%,var(--surface))] p-3 text-sm text-ink">
          {error}
        </p>
      ) : null}

      {/* Step 1 — create crew */}
      <section className="mt-6 rounded-card border border-unseen bg-surface p-4">
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Users className="h-4 w-4 text-[var(--action)]" aria-hidden="true" /> 1. Create crew
        </p>
        {crewId == null ? (
          <div className="mt-3 space-y-3">
            <input
              aria-label="Crew name"
              placeholder="Crew name (e.g. Crew Coselhas)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-button border border-unseen bg-[var(--bg)] px-3 py-2.5 text-ink"
            />
            <input
              aria-label="City"
              placeholder="City (e.g. Coimbra)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-button border border-unseen bg-[var(--bg)] px-3 py-2.5 text-ink"
            />
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} />
              Under-16 crew (requires Crew Lead check-in in the field)
            </label>
            <Button onClick={handleCreate} disabled={busy || !name.trim()}>
              Create crew
            </Button>
          </div>
        ) : (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--success)]">
            <Check className="h-4 w-4" aria-hidden="true" /> {name} created
          </p>
        )}
      </section>

      {crewId != null ? (
        <>
          {/* Step 2 — members */}
          <section className="mt-4 rounded-card border border-unseen bg-surface p-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Users className="h-4 w-4 text-[var(--action)]" aria-hidden="true" /> 2. Add members
              (pseudonymous)
            </p>
            <div className="mt-3 flex gap-2">
              <input
                aria-label="Member handle"
                placeholder="Handle (e.g. Scout 3)"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                className="flex-1 rounded-button border border-unseen bg-[var(--bg)] px-3 py-2.5 text-ink"
              />
              <button onClick={handleAddMember} className={buttonClasses('secondary', 'md')} aria-label="Add member">
                <Plus className="h-4 w-4" aria-hidden="true" /> Add
              </button>
            </div>
            {members.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {members.map((m) => (
                  <li key={m} className="rounded-full bg-[var(--action-tint)] px-3 py-1 text-xs font-semibold text-[var(--action)]">
                    {m}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {/* Step 3 — adopt sites */}
          <section className="mt-4 rounded-card border border-unseen bg-surface p-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              <MapPin className="h-4 w-4 text-[var(--action)]" aria-hidden="true" /> 3. Adopt sites (max 3)
            </p>
            <div className="mt-3 flex gap-2">
              <input
                aria-label="OAH site code"
                placeholder="OAH site code (e.g. CB-01)"
                value={siteInput}
                onChange={(e) => setSiteInput(e.target.value)}
                className="flex-1 rounded-button border border-unseen bg-[var(--bg)] px-3 py-2.5 text-ink"
              />
              <button onClick={handleAdopt} className={buttonClasses('secondary', 'md')} aria-label="Adopt site">
                <Plus className="h-4 w-4" aria-hidden="true" /> Adopt
              </button>
            </div>
            {adopted.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {adopted.map((s) => (
                  <li key={s} className="rounded-full bg-[color-mix(in_srgb,var(--success)_14%,var(--surface))] px-3 py-1 text-xs font-semibold text-[var(--success)]">
                    {s}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {/* Step 4 — safety + consent */}
          <section className="mt-4 rounded-card border border-unseen bg-surface p-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              <ShieldCheck className="h-4 w-4 text-[var(--action)]" aria-hidden="true" /> 4. Safety &amp; consent
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <button onClick={handleCheckin} className={buttonClasses('secondary', 'cta')}>
                {checkedIn ? (
                  <>
                    <Check className="h-4 w-4 text-[var(--success)]" aria-hidden="true" /> Checked in (90 min)
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Field check-in
                  </>
                )}
              </button>
              <button onClick={downloadConsent} className={buttonClasses('secondary', 'cta')}>
                <FileText className="h-4 w-4" aria-hidden="true" /> Download consent template
              </button>
            </div>
          </section>

          <Link href="/crew" className={`mt-6 ${buttonClasses('primary', 'cta')}`}>
            Go to crew dashboard
          </Link>
        </>
      ) : null}
    </main>
  );
}

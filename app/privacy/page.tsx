import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — RiverKin',
  description: 'How RiverKin collects, uses and protects personal data under the EU GDPR.',
  alternates: { canonical: 'https://riverkin.online/privacy' },
};

/** GDPR-aligned Privacy Policy. Review with a DPO before a production pilot. */
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <Link
        href="/welcome"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
      </Link>

      <h1 className="font-display mt-4 text-[clamp(1.6rem,5vw,2rem)] font-semibold text-ink">
        Privacy Policy
      </h1>
      <p className="mt-1 text-sm text-ink-muted">Last updated 3 October 2026 · GDPR (EU) 2016/679</p>

      <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-ink">
        <section>
          <h2 className="text-base font-semibold">1. Who we are</h2>
          <p className="mt-1 text-ink-muted">
            RiverKin is a citizen-science app for the IEEE OneAquaHealth Global Hackathon 2026,
            operated by Xphora AI Technology Pvt Ltd (the “data controller”). For any privacy
            request, contact <span className="text-ink">privacy@riverkin.app</span>. This policy
            follows the EU General Data Protection Regulation (GDPR); EU law governs user data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">2. The data we collect, by role</h2>
          <ul className="mt-2 space-y-2 text-ink-muted">
            <li>
              <span className="font-medium text-ink">Visitors</span> (just browsing): no personal
              data, no account.
            </li>
            <li>
              <span className="font-medium text-ink">Guests</span>: a random anonymous identifier
              stored on your device, plus any observations you choose to make (answers, photos, the
              site you checked). Guest contributions are marked pending and do not count toward
              shared data until you sign in.
            </li>
            <li>
              <span className="font-medium text-ink">Keepers / Crew Leads / Researchers</span>{' '}
              (adult accounts, 16+): your email address and display name. If you sign in with
              Microsoft, we receive only your email and name from Microsoft — never your password.
            </li>
            <li>
              <span className="font-medium text-ink">Crew members (students)</span>: no personal
              data at all. Students take part only through a teacher-issued pseudonymous handle
              (e.g. “Scout 3”) — no name, email or date of birth.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold">3. Lawful bases (Art. 6)</h2>
          <p className="mt-1 text-ink-muted">
            Consent for adult accounts; the school’s lawful basis for teacher-led crews (we process
            only pseudonymous handles); and legitimate interest for operating the public map of
            monitored sites. You may withdraw consent at any time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">4. Photos and location</h2>
          <p className="mt-1 text-ink-muted">
            Photos are stripped of embedded metadata (including GPS) before storage, and we blur
            recognisable faces where detected. Your device location is used once to confirm you are
            near the site, then snapped to the site’s identifier — we do not keep raw GPS or build
            any per-user location history. Photograph from the bank only; never include bystanders.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">5. Children</h2>
          <p className="mt-1 text-ink-muted">
            No personal accounts for anyone under 16. Under-16s participate only as pseudonymous
            members inside a Crew Lead’s (teacher’s) crew, under the school’s responsibility and
            GDPR Art. 8. This single rule meets the digital-consent ages of all five project
            countries.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">6. Who we share with</h2>
          <p className="mt-1 text-ink-muted">
            Verified, de-identified observations may be shared with OneAquaHealth and local water
            authorities for river-health research. We use Microsoft for optional sign-in and
            Microsoft Azure for hosting. We never sell your data or use it for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">7. Retention</h2>
          <p className="mt-1 text-ink-muted">
            Raw photos are kept up to 24 months; account data until you delete your account;
            anonymous guest data until you clear it from your device. Aggregated, de-identified
            research data may be kept indefinitely.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">8. Your rights</h2>
          <p className="mt-1 text-ink-muted">
            You have the right to access, correct, delete, export or restrict your data, to object
            to processing, and to withdraw consent — from the Me screen or by emailing us. You may
            also lodge a complaint with your national data-protection authority.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">9. Security &amp; transfers</h2>
          <p className="mt-1 text-ink-muted">
            Connections use HTTPS; passwords (where used) are bcrypt-hashed; access uses
            short-lived signed tokens. Data is hosted on Microsoft Azure; where data leaves the EEA,
            we rely on appropriate safeguards such as Standard Contractual Clauses.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">10. Changes</h2>
          <p className="mt-1 text-ink-muted">
            We will update this policy as the product evolves and post the new date above. See also
            our{' '}
            <Link href="/terms" className="font-medium text-[var(--action)] underline">
              Terms of Service
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

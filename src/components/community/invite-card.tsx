'use client';

import { useEffect, useState } from 'react';
import { Link2, Copy, Check, Share2, MessageCircle, Instagram, Twitter } from 'lucide-react';
import { joinLink } from '@/lib/community';

const MESSAGE =
  'Join me on RiverKin — run, walk or cycle and help keep our rivers seen. No account needed:';

/**
 * Invite card — share your pseudonymous /join link and earn community credits
 * when a friend joins and completes a mission. All share targets are
 * user-initiated navigations (no data sent anywhere by us).
 */
export function InviteCard() {
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => setLink(joinLink()), []);

  const pretty = link.replace(/^https?:\/\//, '');

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'RiverKin', text: MESSAGE, url: link });
        return;
      } catch {
        /* cancelled */
      }
    }
    void copy();
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(`${MESSAGE} ${link}`)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(MESSAGE)}&url=${encodeURIComponent(link)}`;

  const targets = [
    { key: 'wa', label: 'WhatsApp', Icon: MessageCircle, tint: '#25D366', href: wa },
    { key: 'ig', label: 'Instagram', Icon: Instagram, tint: '#E1306C', onClick: nativeShare },
    { key: 'x', label: 'X', Icon: Twitter, tint: '#111827', href: x },
    { key: 'share', label: 'Share', Icon: Share2, tint: '#1E7BFF', onClick: nativeShare },
  ];

  return (
    <div className="rounded-card border border-[var(--action)]/25 bg-[var(--action)]/8 p-4">
      <p className="text-[16px] font-bold text-ink">Invite friends &amp; grow impact</p>
      <p className="mt-1 text-[13px] leading-snug text-ink-muted">
        Share your unique link and earn community credits when your friends complete a mission. No account required.
      </p>

      <div className="mt-3 flex items-center gap-2 rounded-full border border-unseen bg-surface px-3 py-2">
        <Link2 className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{pretty || 'riverkin.online/join/…'}</span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy invite link"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--action)]/12 text-[var(--action)]"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {targets.map(({ key, label, Icon, tint, href, onClick }) =>
          href ? (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: `${tint}18` }}>
                <Icon className="h-5 w-5" style={{ color: tint }} aria-hidden="true" />
              </span>
              <span className="text-[11px] text-ink-muted">{label}</span>
            </a>
          ) : (
            <button key={key} type="button" onClick={onClick} className="flex flex-col items-center gap-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: `${tint}18` }}>
                <Icon className="h-5 w-5" style={{ color: tint }} aria-hidden="true" />
              </span>
              <span className="text-[11px] text-ink-muted">{label}</span>
            </button>
          ),
        )}
      </div>
    </div>
  );
}

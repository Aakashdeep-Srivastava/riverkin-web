import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SimulatedBadge } from '@/components/simulated-badge';

/**
 * Stand-in for a real river photo. We don't ship remote images (self-contained
 * build + the "Simulated, illustrative" rule), so this renders a calm
 * water-toned gradient with a faint current, labelled as simulated where it
 * represents captured evidence.
 */
export function PhotoFrame({
  label,
  aspect = 'video',
  simulated = false,
  className,
  children,
}: {
  label?: string;
  aspect?: 'video' | 'square' | 'tall' | 'wide';
  simulated?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const ratio = {
    video: 'aspect-[16/10]',
    square: 'aspect-square',
    tall: 'aspect-[3/4]',
    wide: 'aspect-[2/1]',
  }[aspect];

  return (
    <div
      role="img"
      aria-label={label ? `${label} (simulated)` : 'Simulated river photo'}
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-card',
        ratio,
        className,
      )}
      style={{
        background:
          'linear-gradient(160deg, color-mix(in srgb, var(--water) 32%, var(--surface)) 0%, color-mix(in srgb, var(--action) 22%, var(--surface)) 55%, color-mix(in srgb, var(--success) 20%, var(--surface)) 100%)',
      }}
    >
      {/* Faint flowing current. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 120"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-40"
      >
        <path d="M0 70 C40 55 60 85 100 70 S160 55 200 70" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
        <path d="M0 88 C40 73 60 103 100 88 S160 73 200 88" fill="none" stroke="white" strokeWidth="2" opacity="0.35" />
      </svg>

      {!children ? <Camera className="relative h-7 w-7 text-white/70" aria-hidden="true" /> : children}

      {label ? (
        <span className="absolute bottom-2 left-2 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {label}
        </span>
      ) : null}
      {simulated ? (
        <div className="absolute right-2 top-2">
          <SimulatedBadge />
        </div>
      ) : null}
    </div>
  );
}

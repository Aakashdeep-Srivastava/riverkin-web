import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'cta' | 'md' | 'sm';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-button font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS: Record<Variant, string> = {
  // Primary CTA = crimson (brand showcase); active:scale gives instant
  // pointer-down feedback (apple-design §1).
  primary:
    'bg-[var(--cta)] text-white shadow-[var(--rk-shadow)] hover:bg-[var(--cta-strong)] active:scale-[0.98]',
  secondary:
    'border border-unseen bg-surface text-ink hover:border-[var(--action)] hover:text-[var(--action)] active:scale-[0.98]',
  ghost: 'text-[var(--action)] hover:bg-[var(--action-tint)]',
};

const SIZES: Record<Size, string> = {
  /** Full-width primary CTA: 56 px tall, pinned above the nav (PRD). */
  cta: 'h-cta w-full px-6 text-base',
  md: 'h-11 px-5 text-sm',
  sm: 'h-9 px-4 text-sm',
};

/** Shared classes so a Next <Link> can look like a button too. */
export function buttonClasses(variant: Variant = 'primary', size: Size = 'cta') {
  return cn(BASE, VARIANTS[variant], SIZES[size]);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'primary', size = 'cta', className, ...props }: ButtonProps) {
  return <button className={cn(buttonClasses(variant, size), className)} {...props} />;
}

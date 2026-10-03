import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        action: 'var(--action)',
        cta: 'var(--cta)',
        water: 'var(--water)',
        attention: 'var(--attention)',
        gold: 'var(--gold)',
        maroon: 'var(--maroon)',
        urgent: 'var(--urgent)',
        unseen: 'var(--unseen)',
        success: 'var(--success)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '20px',
        button: '16px',
      },
      spacing: {
        // 8px grid helpers
        cta: '56px',
        tap: '48px',
      },
    },
  },
  plugins: [],
};

export default config;

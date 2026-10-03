'use client';

import { useRouter } from 'next/navigation';
import { Entry } from '@/components/entry';
import { markEntered } from '@/lib/entry-state';

/** The opening splash → onboarding → sign-in screen. */
export default function WelcomePage() {
  const router = useRouter();
  const enter = (role: string) => {
    markEntered(role);
    router.replace('/');
  };
  return <Entry onEnter={enter} />;
}

'use client';

import { useRouter } from 'next/navigation';
import { Entry, type Role } from '@/components/entry';
import { markEntered } from '@/lib/entry-state';

/** The opening globe/login screen. */
export default function WelcomePage() {
  const router = useRouter();
  const enter = (role: Role) => {
    markEntered(role);
    router.replace('/');
  };
  return <Entry onEnter={enter} />;
}

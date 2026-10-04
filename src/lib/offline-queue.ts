import { openDB, type IDBPDatabase } from 'idb';

/**
 * Minimal offline check queue. Field checks are written to IndexedDB on submit
 * so a check taken by a stream with no signal is never lost; a real app syncs
 * these to the API when back online (PRD F1, step 6).
 *
 * TODO(PRD): background sync + retry against POST /observations.
 */
export interface QueuedCheck {
  siteId: string;
  answers: Record<string, string>;
  photos: string[];
  feeling: string;
  createdAt: number;
  /** River points (River Value) earned for this check, from the receipt. */
  points?: number;
}

const DB_NAME = 'riverkin';
const STORE = 'check-queue';

async function db(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE, { keyPath: 'createdAt' });
      }
    },
  });
}

/** Best-effort enqueue — never throws into the UI. */
export async function enqueueCheck(check: QueuedCheck): Promise<void> {
  try {
    const database = await db();
    await database.put(STORE, check);
  } catch {
    // IndexedDB unavailable (private mode, SSR) — the demo still proceeds.
  }
}

export async function pendingCount(): Promise<number> {
  try {
    const database = await db();
    return await database.count(STORE);
  } catch {
    return 0;
  }
}

/** This device's checks, newest first (powers the Impact screen + identity tier). */
export async function listChecks(): Promise<QueuedCheck[]> {
  try {
    const database = await db();
    const all = (await database.getAll(STORE)) as QueuedCheck[];
    return all.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

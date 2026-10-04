/**
 * Day-streak — an honest, device-side engagement streak (consecutive days the
 * app was opened). No server data exists for a personal streak, so this is a
 * local signal only; it never claims to be verified contribution. Call
 * `touchStreak()` once on app open; read with `getStreak()`.
 */
const KEY = 'rk_streak';
const DAY_KEY = 'rk_streak_day';

function todayStamp(): number {
  const now = new Date();
  // Days since epoch in local time (ignores time-of-day).
  return Math.floor(
    (now.getTime() - now.getTimezoneOffset() * 60_000) / 86_400_000,
  );
}

/** Register today's visit and return the current streak (consecutive days). */
export function touchStreak(): number {
  try {
    const today = todayStamp();
    const lastDay = Number(localStorage.getItem(DAY_KEY));
    let streak = Number(localStorage.getItem(KEY)) || 0;

    if (!lastDay || Number.isNaN(lastDay)) {
      streak = 1;
    } else if (today === lastDay) {
      // Already counted today — leave the streak as-is (min 1).
      streak = streak || 1;
      return streak;
    } else if (today === lastDay + 1) {
      streak = (streak || 0) + 1; // consecutive day
    } else {
      streak = 1; // gap → reset
    }

    localStorage.setItem(KEY, String(streak));
    localStorage.setItem(DAY_KEY, String(today));
    return streak;
  } catch {
    return 1;
  }
}

export function getStreak(): number {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}

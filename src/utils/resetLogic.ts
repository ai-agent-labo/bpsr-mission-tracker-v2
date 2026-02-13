import {
  startOfDay,
  startOfWeek,
  addHours,
  isBefore,
  isAfter,
  differenceInCalendarDays,
  format
} from 'date-fns';
import type { Mission } from '../types';

export function getNextDailyReset(date: Date) {
  let reset = addHours(startOfDay(date), 5);
  if (isAfter(date, reset)) {
    reset = addHours(reset, 24);
  }
  return reset;
}

export function getLastDailyReset(date: Date) {
  let reset = addHours(startOfDay(date), 5);
  if (isBefore(date, reset)) {
    reset = addHours(reset, -24);
  }
  return reset;
}

export function getLastWeeklyReset(date: Date) {
  let reset = addHours(startOfWeek(date, { weekStartsOn: 1 }), 5);
  if (isBefore(date, reset)) {
    reset = addHours(reset, -168);
  }
  return reset;
}

export function getNextWeeklyReset(date: Date) {
  let reset = addHours(startOfWeek(date, { weekStartsOn: 1 }), 5);
  if (isAfter(date, reset)) {
    reset = addHours(reset, 168);
  }
  return reset;
}

export function getLastBiWeeklyReset(date: Date, anchorDateString?: string) {
  // Bi-weekly reset: Every other Monday at 05:00.
  // We need an anchor to know which Monday is the reset Monday.
  const anchor = anchorDateString ? new Date(anchorDateString) : new Date('2026-02-09T05:00:00'); // Assuming Feb 9 was a reset Monday
  const reset = addHours(startOfWeek(date, { weekStartsOn: 1 }), 5);
  const weeksSinceAnchor = Math.floor(differenceInCalendarDays(reset, anchor) / 7);

  if (weeksSinceAnchor % 2 === 0) {
    // Current week is a reset week
    return isBefore(date, reset) ? addHours(reset, -336) : reset;
  } else {
    // Last week was a reset week
    return addHours(reset, -168);
  }
}

export function shouldReset(
  lastCompletedAt: string | null,
  type: 'daily' | 'weekly' | 'bi-weekly' | 'none'
): boolean {
  if (!lastCompletedAt || !type || type === 'none') return false;
  const lastDate = new Date(lastCompletedAt);
  const now = new Date();

  let lastReset: Date;
  if (type === 'daily') lastReset = getLastDailyReset(now);
  else if (type === 'weekly') lastReset = getLastWeeklyReset(now);
  else if (type === 'bi-weekly') lastReset = getLastBiWeeklyReset(now);
  else return false;

  return isBefore(lastDate, lastReset);
}

export function isMissionActive(mission: Mission, now: Date): boolean {
  if (!mission.metadata?.activeDays && !mission.metadata?.activeTimeRange) return true;

  if (mission.metadata.activeDays) {
    const dayName = format(now, 'EEEE'); // e.g. "Friday"
    if (!mission.metadata.activeDays.includes(dayName)) return false;
  }

  if (mission.metadata.activeTimeRange) {
    const { start, end } = mission.metadata.activeTimeRange;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const startTime = addHours(startOfDay(now), startH).setMinutes(startM);
    const endTime = addHours(startOfDay(now), endH).setMinutes(endM);

    if (isBefore(now, startTime) || isAfter(now, endTime)) return false;
  }

  return true;
}

export function calculateKeyIncrements(lastResetTime: string | null): number {
  if (!lastResetTime) return 0;
  const last = new Date(lastResetTime);
  const now = new Date();
  const lastResetNormalized = getLastDailyReset(last);
  const currentResetNormalized = getLastDailyReset(now);
  const daysPassed = differenceInCalendarDays(
    currentResetNormalized,
    lastResetNormalized
  );
  return Math.max(0, daysPassed * 2);
}

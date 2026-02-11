import type { Event } from "../types/event";

const isYyyyMmDd = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const parseEventStartAt = (event: Event): Date | null => {
  const raw = event.startDate;
  if (!raw) return null;

  // If only a date is provided, assume local 12:00.
  if (isYyyyMmDd(raw)) {
    const [y, m, d] = raw.split("-").map((v) => Number(v));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d, 12, 0, 0, 0);
  }

  const dt = new Date(raw);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

export const formatDateTime = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
};

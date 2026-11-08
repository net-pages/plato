import { useEffect, useState } from "react";
import { MEALS, type MealId } from "./data";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const fmt12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suf = h >= 12 ? "pm" : "am";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suf}`;
};

export type Times = Record<MealId, string>;
export const DEFAULT_TIMES = Object.fromEntries(MEALS.map((m) => [m.id, m.time])) as Times;

/** Días seguidos con las 5 comidas marcadas (hoy cuenta solo si ya está completo). */
export function streak(done: Record<string, MealId[]>, today: Date) {
  let n = 0;
  const d = new Date(today);
  if ((done[dateKey(d)]?.length ?? 0) < MEALS.length) d.setDate(d.getDate() - 1);
  while ((done[dateKey(d)]?.length ?? 0) >= MEALS.length) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

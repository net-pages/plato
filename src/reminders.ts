import { useEffect } from "react";
import { MEALS, type MealId, type Recipe } from "./data";

type Plan = Record<number, Record<MealId, Recipe>>;
import { dateKey, type Times } from "./store";

const BYDAY = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const pad = (n: number) => String(n).padStart(2, "0");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** Archivo .ics con 35 eventos semanales (uno por comida y día), cada uno con alarma a la hora exacta. */
export function buildICS(times: Times, PLAN: Plan, now = new Date()) {
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Plato//Plan de alimentacion//ES", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Plato · Comidas"];

  for (let wd = 0; wd < 7; wd++) {
    // próxima fecha (hoy incluido) que cae en ese día de la semana
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    d.setDate(d.getDate() + ((wd - d.getDay() + 7) % 7));
    const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

    for (const m of MEALS) {
      const r = PLAN[wd][m.id];
      const [h, min] = times[m.id].split(":").map(Number);
      lines.push(
        "BEGIN:VEVENT",
        `UID:plato-${wd}-${m.id}@plato.app`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${ymd}T${pad(h)}${pad(min)}00`,
        "DURATION:PT20M",
        `RRULE:FREQ=WEEKLY;BYDAY=${BYDAY[wd]}`,
        `SUMMARY:${esc(`${m.name} · ${r.title}`)}`,
        `DESCRIPTION:${esc([...r.items, ...(r.added ?? []).map((a) => `+ ${a}`)].join("\n"))}`,
        "TRANSP:TRANSPARENT",
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${esc(`Hora de tu ${m.name.toLowerCase()}: ${r.title}`)}`,
        "TRIGGER:PT0M",
        "END:VALARM",
        "END:VEVENT",
      );
    }
  }
  lines.push("END:VCALENDAR");
  // RFC 5545: líneas de máx. 75 octetos; las continuaciones empiezan con un espacio
  const enc = new TextEncoder();
  const fold = (line: string) => {
    const out: string[] = [];
    let cur = "";
    for (const ch of line) {
      if (enc.encode(cur + ch).length > (out.length ? 74 : 75)) {
        out.push(cur);
        cur = "";
      }
      cur += ch;
    }
    out.push(cur);
    return out.join("\r\n ");
  };
  return lines.map(fold).join("\r\n");
}

export function downloadICS(times: Times, plan: Plan) {
  const blob = new Blob([buildICS(times, plan)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "plato-comidas.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export const notifySupported = () => typeof window !== "undefined" && "Notification" in window;

async function show(title: string, body: string) {
  const opts: NotificationOptions = { body, icon: `${import.meta.env.BASE_URL}icon-192.png`, badge: `${import.meta.env.BASE_URL}icon-192.png`, tag: title };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) return reg.showNotification(title, opts);
  } catch {
    /* sin service worker: se usa la API directa */
  }
  new Notification(title, opts);
}

/** Mientras la app esté abierta (o en segundo plano reciente), avisa a la hora de cada comida. */
export function useMealNotifications(enabled: boolean, times: Times, PLAN: Plan) {
  useEffect(() => {
    if (!enabled || !notifySupported() || Notification.permission !== "granted") return;
    const tick = () => {
      const now = new Date();
      const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const meal = MEALS.find((m) => times[m.id] === hhmm);
      if (!meal) return;
      const key = `plato.notified.${dateKey(now)}.${meal.id}`;
      try {
        if (localStorage.getItem(key)) return;
        localStorage.setItem(key, "1");
      } catch {
        /* sin almacenamiento */
      }
      const r = PLAN[now.getDay()][meal.id];
      show(`${meal.name} · ${r.title}`, [...r.items, ...(r.added ?? []).map((a) => `+ ${a}`)].join(" · "));
    };
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, [enabled, times, PLAN]);
}

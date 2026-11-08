import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DAYS, DAYS_SHORT, MEALS, PLAN, type MealId } from "./data";
import { DEFAULT_TIMES, dateKey, fmt12, streak, toMinutes, useNow, usePersisted, type Times } from "./store";
import Hero from "./components/Hero";
import MealCard from "./components/MealCard";
import { GuideView, PrepView } from "./components/Views";
import Market from "./components/Market";
import Progress from "./components/Progress";
import { useMealNotifications } from "./reminders";
import SettingsSheet from "./components/SettingsSheet";
import CountUp from "./components/rb/CountUp";
import BlurText from "./components/rb/BlurText";

type Tab = "hoy" | "prep" | "mercado" | "progreso" | "guia";
const WEEK = [1, 2, 3, 4, 5, 6, 0];

export default function App() {
  const now = useNow();
  const today = now.getDay();
  const todayKey = dateKey(now);

  const [tab, setTab] = useState<Tab>("hoy");
  const [day, setDay] = useState(today);
  const [open, setOpen] = useState<MealId | null>(null);
  const [settings, setSettings] = useState(false);
  const [times, setTimes] = usePersisted<Times>("plato.times", DEFAULT_TIMES);
  const [done, setDone] = usePersisted<Record<string, MealId[]>>("plato.done", {});
  const [notify, setNotify] = usePersisted<boolean>("plato.notify", false);
  useMealNotifications(notify, times);

  const isToday = day === today;
  const doneToday = done[todayKey] ?? [];
  const meals = useMemo(() => [...MEALS].sort((a, b) => toMinutes(times[a.id]) - toMinutes(times[b.id])), [times]);

  const toggle = (id: MealId) =>
    setDone((prev) => {
      const list = prev[todayKey] ?? [];
      return { ...prev, [todayKey]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] };
    });

  const focus = useMemo(() => {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    let idx = -1;
    meals.forEach((m, i) => toMinutes(times[m.id]) <= nowMin && (idx = i));
    for (let i = Math.max(idx, 0); i < meals.length; i++) {
      if (!doneToday.includes(meals[i].id)) {
        const start = toMinutes(times[meals[i].id]);
        return { meal: meals[i], minutesUntil: Math.max(0, start - nowMin) };
      }
    }
    return null;
  }, [now, meals, times, doneToday]);

  const reveal = (id: MealId) => {
    setOpen(id);
    setTimeout(() => {
      const el = document.getElementById(`meal-${id}`);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 16, behavior: "smooth" });
    }, 60);
  };

  const s = streak(done, now);
  const dateLabel = now.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="grain relative min-h-dvh overflow-x-hidden">
      <div className="mx-auto max-w-xl px-4 pt-safe pb-32">
        {/* Encabezado */}
        <header className="rise flex items-end justify-between pt-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">{dateLabel}</p>
            <h1 className="font-display text-5xl italic leading-none tracking-tight">
              Plato<span className="text-tang">.</span>
            </h1>
          </div>
          <button
            onClick={() => setSettings(true)}
            aria-label="Horarios y recordatorios"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-ink-2 text-mute transition hover:text-cream active:scale-95"
          >
            <ClockIcon />
          </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {tab === "hoy" && (
              <>
                {/* Selector de día */}
                <nav className="mt-6 grid grid-cols-7 gap-1.5" aria-label="Día de la semana">
                  {WEEK.map((d) => {
                    const active = d === day;
                    return (
                      <button
                        key={d}
                        onClick={() => {
                          setDay(d);
                          setOpen(null);
                        }}
                        aria-pressed={active}
                        aria-label={DAYS[d]}
                        className={`relative flex h-14 flex-col items-center justify-center rounded-2xl border text-sm font-semibold transition ${
                          active ? "border-transparent text-ink" : "border-line text-mute hover:text-cream"
                        }`}
                      >
                        {active && <motion.span layoutId="day-pill" className="absolute inset-0 -z-0 rounded-2xl bg-cream" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />}
                        <span className="relative">{DAYS_SHORT[d]}</span>
                        {d === today && <span className={`relative mt-1 h-1 w-1 rounded-full ${active ? "bg-tang" : "bg-tang/80"}`} />}
                      </button>
                    );
                  })}
                </nav>

                {/* Hero */}
                <section className="mt-5">
                  {isToday ? (
                    <Hero focus={focus} times={times} recipe={focus ? PLAN[day][focus.meal.id] : null} onReveal={reveal} onDone={toggle} />
                  ) : (
                    <div className="rounded-[2rem] border border-line bg-ink-2 px-6 py-8">
                      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">Vista previa</p>
                      <BlurText key={day} text={DAYS[day]} animateBy="letters" delay={40} className="font-display text-6xl italic leading-none" />
                      <p className="mt-3 text-sm text-mute">
                        {MEALS.length} comidas · ≈ {Object.values(PLAN[day]).reduce((a, r) => a + r.minutes, 0)} min de cocina en total
                      </p>
                      <button onClick={() => setDay(today)} className="mt-5 text-sm font-semibold text-tang underline-offset-4 hover:underline">
                        Volver a hoy →
                      </button>
                    </div>
                  )}
                </section>

                {/* Progreso */}
                {isToday && (
                  <section className="mt-4 grid grid-cols-2 gap-3">
                    <Stat label="Comidas de hoy">
                      <CountUp key={doneToday.length} from={Math.max(0, doneToday.length - 1)} to={doneToday.length} duration={0.6} trigger="load" />
                      <span className="text-mute">/{MEALS.length}</span>
                    </Stat>
                    <Stat label={s === 1 ? "Día seguido" : "Días seguidos"}>
                      <CountUp to={s} duration={1.2} trigger="load" />
                      <span className="ml-1 text-tang">●</span>
                    </Stat>
                  </section>
                )}

                {/* Línea de tiempo */}
                <section className="mt-8">
                  <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mute">El día completo</h2>
                  <ol className="relative space-y-3">
                    {meals.map((m, i) => (
                      <li key={`${day}-${m.id}`} id={`meal-${m.id}`} className="rise scroll-mt-6" style={{ animationDelay: `${i * 60}ms` }}>
                        <MealCard
                          name={m.name}
                          time={fmt12(times[m.id])}
                          recipe={PLAN[day][m.id]}
                          open={open === m.id}
                          onToggleOpen={() => setOpen(open === m.id ? null : m.id)}
                          done={isToday && doneToday.includes(m.id)}
                          canCheck={isToday}
                          onCheck={() => toggle(m.id)}
                          isNow={isToday && focus?.meal.id === m.id}
                        />
                      </li>
                    ))}
                  </ol>
                </section>
              </>
            )}

            {tab === "prep" && <PrepView />}
            {tab === "mercado" && <Market />}
            {tab === "progreso" && <Progress />}
            {tab === "guia" && <GuideView />}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Navegación inferior */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 px-4" aria-label="Secciones">
        <div className="mx-auto flex max-w-xl gap-1 rounded-[1.75rem] border border-line bg-ink-2/80 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {(
            [
              ["hoy", "Hoy", <SunIcon key="i" />],
              ["prep", "Prep", <PotIcon key="i" />],
              ["mercado", "Mercado", <CartIcon key="i" />],
              ["progreso", "Progreso", <ChartIcon key="i" />],
              ["guia", "Guía", <LeafIcon key="i" />],
            ] as const
          ).map(([id, label, icon]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  window.scrollTo({ top: 0 });
                }}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-[1.35rem] py-2 text-[10.5px] font-semibold transition ${
                  active ? "text-ink" : "text-mute hover:text-cream"
                }`}
              >
                {active && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-[1.35rem] bg-tang" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} />}
                <span className="relative">{icon}</span>
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <SettingsSheet open={settings} onClose={() => setSettings(false)} times={times} setTimes={setTimes} notify={notify} setNotify={setNotify} />
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-ink-2 px-5 py-4">
      <div className="font-display text-4xl leading-none">{children}</div>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">{label}</p>
    </div>
  );
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
const PotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M2 10h20M9 6c0-1 1-1.5 1-2.5M14 6c0-1 1-1.5 1-2.5" /></svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></svg>
);
const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M3 20h18" /><path d="m4 15 5-5 4 3 7-7" /><path d="M16 6h4v4" /></svg>
);
const LeafIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15" /><path d="M5 19 14 10" /></svg>
);

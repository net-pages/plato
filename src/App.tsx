import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DAYS, DAYS_SHORT, KCAL_REQUIREMENT, MEALS, dayKcal, planFor, type MealId } from "./data";
import { DEFAULT_TIMES, dateKey, dayTotals, fmt12, streak, toMinutes, useNow, usePersisted, type Entry, type Goals, type Slot, type Times } from "./store";
import KcalCard from "./components/KcalCard";
import WaterCard from "./components/WaterCard";
import LogSheet from "./components/LogSheet";
import Hero from "./components/Hero";
import MealCard from "./components/MealCard";
import { GuideView, PrepView } from "./components/Views";
import Market from "./components/Market";
import Progress from "./components/Progress";
import { useMealNotifications } from "./reminders";
import { InstallBanner, InstallSheet } from "./components/Install";
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
  const [install, setInstall] = useState(false);
  const [times, setTimes] = usePersisted<Times>("plato.times", DEFAULT_TIMES);
  const [done, setDone] = usePersisted<Record<string, MealId[]>>("plato.done", {});
  const [notify, setNotify] = usePersisted<boolean>("plato.notify", false);
  const [adjusted, setAdjusted] = usePersisted<boolean>("plato.adjusted", true);
  const PLAN = planFor(adjusted);
  const [log, setLog] = usePersisted<Record<string, Entry[]>>("plato.log", {});
  const [water, setWater] = usePersisted<Record<string, number>>("plato.water", {});
  const [goals, setGoals] = usePersisted<Goals>("plato.goals", { kcal: KCAL_REQUIREMENT, water: 2500 });
  const [logSheet, setLogSheet] = useState<{ open: boolean; slot: Slot; replaces: boolean }>({ open: false, slot: "extra", replaces: false });
  useMealNotifications(notify, times, PLAN);

  const isToday = day === today;
  const doneToday = done[todayKey] ?? [];
  const logToday = log[todayKey] ?? [];
  const waterToday = water[todayKey] ?? 0;
  // comidas cubiertas: el plato del plan o algo registrado en su lugar
  const coveredOn = (key: string) => {
    const set = new Set<MealId>(done[key] ?? []);
    for (const e of log[key] ?? []) if (e.replaces && e.slot !== "extra") set.add(e.slot);
    return [...set];
  };
  const coveredToday = coveredOn(todayKey);
  const totals = dayTotals(PLAN[today], doneToday, logToday);
  const meals = useMemo(() => [...MEALS].sort((a, b) => toMinutes(times[a.id]) - toMinutes(times[b.id])), [times]);

  const toggle = (id: MealId) => {
    const marking = !doneToday.includes(id);
    setDone((prev) => {
      const list = prev[todayKey] ?? [];
      return { ...prev, [todayKey]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] };
    });
    // si ahora sí se comió el plato del plan, lo registrado en su lugar pasa a ser extra
    if (marking && logToday.some((e) => e.slot === id && e.replaces))
      setLog((prev) => ({ ...prev, [todayKey]: (prev[todayKey] ?? []).map((e) => (e.slot === id ? { ...e, replaces: false } : e)) }));
  };

  const saveEntries = (entries: Entry[], slot: Slot, replaces: boolean) => {
    setLog((prev) => ({ ...prev, [todayKey]: [...(prev[todayKey] ?? []), ...entries] }));
    if (replaces && slot !== "extra") setDone((prev) => ({ ...prev, [todayKey]: (prev[todayKey] ?? []).filter((x) => x !== slot) }));
  };
  const removeEntry = (id: string) => setLog((prev) => ({ ...prev, [todayKey]: (prev[todayKey] ?? []).filter((e) => e.id !== id) }));
  const openLog = (slot: Slot, replaces: boolean) => setLogSheet({ open: true, slot, replaces });

  const focus = useMemo(() => {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    let idx = -1;
    meals.forEach((m, i) => toMinutes(times[m.id]) <= nowMin && (idx = i));
    for (let i = Math.max(idx, 0); i < meals.length; i++) {
      if (!coveredToday.includes(meals[i].id)) {
        const start = toMinutes(times[meals[i].id]);
        return { meal: meals[i], minutesUntil: Math.max(0, start - nowMin) };
      }
    }
    return null;
  }, [now, meals, times, coveredToday.join()]);

  const reveal = (id: MealId) => {
    setOpen(id);
    setTimeout(() => {
      const el = document.getElementById(`meal-${id}`);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 16, behavior: "smooth" });
    }, 60);
  };

  const s = streak(Object.fromEntries([...new Set([...Object.keys(done), ...Object.keys(log)])].map((k) => [k, coveredOn(k)])), now);
  const dateLabel = now.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="grain relative min-h-dvh overflow-x-hidden">
      <div className="mx-auto max-w-xl px-4 pt-safe pb-32">
        {/* Encabezado */}
        <header className="rise flex items-end justify-between pt-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{dateLabel}</p>
            <h1 className="font-display text-5xl italic leading-none tracking-tight">
              Plato<span className="text-primary">.</span>
            </h1>
          </div>
          <button
            onClick={() => setSettings(true)}
            aria-label="Horarios y recordatorios"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-muted transition hover:text-fg active:scale-95"
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
                          active ? "border-transparent text-bg" : "border-line text-muted hover:text-fg"
                        }`}
                      >
                        {active && <motion.span layoutId="day-pill" className="absolute inset-0 -z-0 rounded-2xl bg-fg" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />}
                        <span className="relative">{DAYS_SHORT[d]}</span>
                        {d === today && <span className={`relative mt-1 h-1 w-1 rounded-full ${active ? "bg-primary" : "bg-primary/80"}`} />}
                      </button>
                    );
                  })}
                </nav>

                {/* Hero */}
                <section className="mt-5">
                  {isToday ? (
                    <Hero focus={focus} times={times} recipe={focus ? PLAN[day][focus.meal.id] : null} onReveal={reveal} onDone={toggle} onOther={(id) => openLog(id, true)} />
                  ) : (
                    <div className="rounded-[2rem] border border-line bg-surface px-6 py-8">
                      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Así viene el</p>
                      <BlurText key={day} text={DAYS[day]} animateBy="letters" delay={40} className="font-display text-6xl italic leading-none" />
                      <p className="mt-3 text-sm text-muted">
                        {MEALS.length} platos · ≈ {dayKcal(PLAN[day]).toLocaleString("es-CO")} kcal · ≈ {Object.values(PLAN[day]).reduce((a, r) => a + r.minutes, 0)} min frente a la estufa
                      </p>
                      <button onClick={() => setDay(today)} className="mt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                        ← Volver a hoy
                      </button>
                    </div>
                  )}
                </section>

                {isToday && <InstallBanner onOpen={() => setInstall(true)} />}

                {/* Calorías, agua y racha */}
                {isToday && (
                  <>
                    <KcalCard totals={totals} goal={goals.kcal} onAdd={() => openLog(focus?.meal.id ?? "extra", false)} />
                    <WaterCard ml={waterToday} goal={goals.water} setMl={(v) => setWater((w) => ({ ...w, [todayKey]: v }))} />
                    <div className="mt-3 flex items-center justify-between rounded-2xl border border-line px-5 py-3 text-sm">
                      <span className="text-muted">
                        Platos de hoy <span className="font-semibold text-fg">{coveredToday.length}/{MEALS.length}</span>
                      </span>
                      <span className="text-muted">
                        {s === 1 ? "Día sin fallar" : "Días sin fallar"}{" "}
                        <span className="font-semibold text-fg">
                          <CountUp to={s} duration={1.2} trigger="load" />
                        </span>
                      </span>
                    </div>
                  </>
                )}

                {/* Línea de tiempo */}
                <section className="mt-8">
                  <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{isToday ? "La carta de hoy" : `La carta del ${DAYS[day].toLowerCase()}`}</h2>
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
                          entries={isToday ? logToday.filter((e) => e.slot === m.id) : []}
                          onOther={() => openLog(m.id, true)}
                          onRemoveEntry={removeEntry}
                          canCheck={isToday}
                          onCheck={() => toggle(m.id)}
                          isNow={isToday && focus?.meal.id === m.id}
                        />
                      </li>
                    ))}
                  </ol>
                  {isToday && logToday.some((e) => e.slot === "extra") && (
                    <div className="mt-3 rounded-[1.75rem] border border-line bg-surface/60 px-5 py-4">
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Fuera de carta</h3>
                      <ul className="mt-2 divide-y divide-line">
                        {logToday
                          .filter((e) => e.slot === "extra")
                          .map((e) => (
                            <li key={e.id} className="flex items-center gap-3 py-2.5">
                              {e.thumb && <img src={e.thumb} alt="" className="h-9 w-9 rounded-lg object-cover" />}
                              <span className="min-w-0 flex-1 truncate text-[15px]">{e.name}</span>
                              <span className="whitespace-nowrap font-mono text-xs text-secondary">{e.kcal.toLocaleString("es-CO")} kcal</span>
                              <button onClick={() => removeEntry(e.id)} aria-label={`Borrar ${e.name}`} className="text-muted hover:text-fg">
                                ×
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </section>
              </>
            )}

            {tab === "prep" && <PrepView />}
            {tab === "mercado" && <Market adjusted={adjusted} />}
            {tab === "progreso" && <Progress />}
            {tab === "guia" && <GuideView onInstall={() => setInstall(true)} />}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Navegación inferior */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 px-4" aria-label="Secciones">
        <div className="mx-auto flex max-w-xl gap-1 rounded-[1.75rem] border border-line bg-surface/80 p-1.5 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.6)] backdrop-blur-xl">
          {(
            [
              ["hoy", "Hoy", <SunIcon key="i" />],
              ["prep", "Prep", <PotIcon key="i" />],
              ["mercado", "Mercado", <CartIcon key="i" />],
              ["progreso", "Báscula", <ChartIcon key="i" />],
              ["guia", "Reglas", <LeafIcon key="i" />],
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
                  active ? "text-bg" : "text-muted hover:text-fg"
                }`}
              >
                {active && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-[1.35rem] bg-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} />}
                <span className="relative">{icon}</span>
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <InstallSheet open={install} onClose={() => setInstall(false)} />
      <LogSheet
        open={logSheet.open}
        onClose={() => setLogSheet((l) => ({ ...l, open: false }))}
        slot={logSheet.slot}
        replaces={logSheet.replaces}
        planTitle={(slot) => (slot === "extra" ? null : PLAN[today][slot].title)}
        onSave={saveEntries}
      />
      <SettingsSheet open={settings} onClose={() => setSettings(false)} times={times} setTimes={setTimes} notify={notify} setNotify={setNotify} goals={goals} setGoals={setGoals} adjusted={adjusted} setAdjusted={setAdjusted} />
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

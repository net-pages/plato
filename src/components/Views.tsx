import { useState } from "react";
import { motion } from "motion/react";
import { BRANDS, PREP, SWAPS, TIPS } from "../data";
import BlurText from "./rb/BlurText";
import SpotlightCard from "./rb/SpotlightCard";
import ClickSpark from "./rb/ClickSpark";
import { usePersisted } from "../store";

export function Title({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <header className="mt-6 mb-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">{kicker}</p>
      <BlurText text={title} animateBy="words" delay={60} className="mt-1 font-display text-5xl italic leading-[0.95]" />
      {sub && <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{sub}</p>}
    </header>
  );
}

const card = { theme: "dark" as const, spotlightColor: "rgba(210, 180, 140, 0.10)", style: { "--spotlight-card-surface": "rgb(47 23 27 / 0.72)", "--spotlight-card-shadow": "0 18px 40px -28px rgb(0 0 0 / 0.8)" } as React.CSSProperties };

export function PrepView() {
  const [checked, setChecked] = usePersisted<string[]>("plato.prep", []);
  const toggle = (w: string) => setChecked((c) => (c.includes(w) ? c.filter((x) => x !== w) : [...c, w]));

  return (
    <>
      <Title kicker="Mise en place · domingo" title="El domingo se cocina. La semana se arma." sub="Una hora de estufa y de lunes a sábado solo calientas y sirves. Tacha lo que vaya quedando listo." />
      <ol className="space-y-3">
        {PREP.map((p, i) => {
          const on = checked.includes(p.what);
          return (
            <li key={p.what} className="rise" style={{ animationDelay: `${i * 50}ms` }}>
              <SpotlightCard {...card} className={`rounded-[1.75rem]! p-5! border ${on ? "border-secondary/40" : "border-line"}`}>
                <div className="flex gap-4">
                  <span className="font-display text-4xl italic leading-none text-primary/80">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className={`text-lg font-bold ${on ? "text-fg/40 line-through" : ""}`}>{p.what}</h3>
                      <span className="font-mono text-[11px] text-muted">{p.qty}</span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-secondary">{p.why}</p>
                    <p className="mt-2 text-sm leading-relaxed text-fg/80">{p.how}</p>
                  </div>
                  <ClickSpark sparkColor={["#b9c47f", "#d2b48c"]} sparkCount={8} sparkRadius={22} disabled={on} className="h-9! w-9! shrink-0">
                    <button
                      onClick={() => toggle(p.what)}
                      aria-pressed={on}
                      aria-label={`Marcar ${p.what} como listo`}
                      className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-bold transition ${on ? "border-secondary bg-secondary text-bg" : "border-fg/20 text-transparent"}`}
                    >
                      ✓
                    </button>
                  </ClickSpark>
                </div>
              </SpotlightCard>
            </li>
          );
        })}
      </ol>
      {checked.length > 0 && (
        <button onClick={() => setChecked([])} className="mt-5 w-full text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-fg">
          Limpiar para el próximo domingo
        </button>
      )}
    </>
  );
}

export function SwapsView() {
  const [group, setGroup] = useState(SWAPS[0].group);
  const active = SWAPS.find((s) => s.group === group)!;
  return (
    <>
      <Title kicker="Intercambios" title="¿Se acabó el arroz? Tranquilo." sub="Cámbialo por otro del mismo grupo, en la cantidad de la lista, y el plan sigue intacto." />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {SWAPS.map((s) => (
          <button
            key={s.group}
            onClick={() => setGroup(s.group)}
            aria-pressed={s.group === group}
            className={`relative shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              s.group === group ? "border-transparent text-bg" : "border-line text-muted hover:text-fg"
            }`}
          >
            {s.group === group && <motion.span layoutId="swap-pill" className="absolute inset-0 rounded-full bg-secondary" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} />}
            <span className="relative">{s.group}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{active.note}</p>
      <ul key={group} className="divide-y divide-line overflow-hidden rounded-[1.75rem] border border-line bg-surface">
        {active.list.map(([food, qty], i) => (
          <li key={food} className="rise flex items-baseline justify-between gap-4 px-5 py-3.5" style={{ animationDelay: `${i * 25}ms` }}>
            <span className="text-[15px]">{food}</span>
            <span className="shrink-0 text-right font-mono text-xs text-secondary">{qty}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Ejemplo: el almuerzo del lunes tiene 2 harinas (arroz + papa). Puedes cambiar la papa por 1 trozo de yuca o ½ plátano verde.
      </p>
    </>
  );
}

export function TipsView() {
  return (
    <>
      <Title kicker="Reglas de la casa" title="Lo que dijo Ana María." sub="Nueve reglas, 2.410 kcal al día y un dulce pequeño permitido. No se negocian, salvo el sábado en la noche." />
      <ol className="space-y-px overflow-hidden rounded-[1.75rem] border border-line">
        {TIPS.map((t, i) => (
          <li key={t} className="rise flex gap-4 bg-surface px-5 py-4" style={{ animationDelay: `${i * 40}ms` }}>
            <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-[15px] leading-snug text-fg/90">{t}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Lo que sí va en el carrito</h2>
      <div className="grid gap-3">
        {BRANDS.map(([cat, list]) => (
          <SpotlightCard key={cat} {...card} className="rounded-[1.5rem]! p-5! border border-line">
            <h3 className="font-display text-2xl italic">{cat}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{list}</p>
          </SpotlightCard>
        ))}
      </div>

      <div className="mt-10 rounded-[1.75rem] border border-primary/30 bg-primary/[0.07] px-6 py-6">
        <p className="font-display text-3xl italic leading-tight">¿Algo no cuadra?</p>
        <p className="mt-2 text-sm text-fg/80">
          Pregúntale directo a tu nutricionista: <span className="font-semibold text-primary">@anaisazanutricion</span>
        </p>
      </div>
    </>
  );
}

export function GuideView({ onInstall }: { onInstall: () => void }) {
  const [view, setView] = useState<"reglas" | "cambios">("reglas");
  return (
    <>
      <div className="mt-6 inline-flex rounded-full border border-line bg-surface p-1">
        {(
          [
            ["reglas", "Reglas"],
            ["cambios", "Intercambios"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            aria-pressed={view === id}
            className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition ${view === id ? "text-bg" : "text-muted hover:text-fg"}`}
          >
            {view === id && <motion.span layoutId="guide-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>
      {view === "reglas" ? <TipsView /> : <SwapsView />}
      <button
        onClick={onInstall}
        className="mt-6 flex w-full items-center justify-between rounded-[1.5rem] border border-line bg-surface/60 px-5 py-4 text-left transition hover:border-secondary/50"
      >
        <span>
          <span className="block font-display text-2xl italic">Instalar en el celular</span>
          <span className="block text-sm text-muted">Paso a paso para iPhone y Android.</span>
        </span>
        <span className="text-secondary">→</span>
      </button>
    </>
  );
}

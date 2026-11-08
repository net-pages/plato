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
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-wine">{kicker}</p>
      <BlurText text={title} animateBy="words" delay={60} className="mt-1 font-display text-5xl italic leading-[0.95]" />
      {sub && <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">{sub}</p>}
    </header>
  );
}

const card = { theme: "light" as const, spotlightColor: "rgba(95, 99, 52, 0.10)", style: { "--spotlight-card-surface": "#fbf8f3", "--spotlight-card-shadow": "0 1px 2px rgb(42 29 32 / 0.04)" } as React.CSSProperties };

export function PrepView() {
  const [checked, setChecked] = usePersisted<string[]>("plato.prep", []);
  const toggle = (w: string) => setChecked((c) => (c.includes(w) ? c.filter((x) => x !== w) : [...c, w]));

  return (
    <>
      <Title kicker="Domingo · 1 hora" title="Cocina una vez, come toda la semana." sub="Deja esto listo el domingo y entre semana solo calientas y armas el plato." />
      <ol className="space-y-3">
        {PREP.map((p, i) => {
          const on = checked.includes(p.what);
          return (
            <li key={p.what} className="rise" style={{ animationDelay: `${i * 50}ms` }}>
              <SpotlightCard {...card} className={`rounded-[1.75rem]! p-5! border ${on ? "border-olive/40" : "border-line"}`}>
                <div className="flex gap-4">
                  <span className="font-display text-4xl italic leading-none text-wine/80">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className={`text-lg font-bold ${on ? "text-ink/40 line-through" : ""}`}>{p.what}</h3>
                      <span className="font-mono text-[11px] text-mute">{p.qty}</span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-olive">{p.why}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/80">{p.how}</p>
                  </div>
                  <ClickSpark sparkColor={["#5f6334", "#6e1e2c"]} sparkCount={8} sparkRadius={22} disabled={on} className="h-9! w-9! shrink-0">
                    <button
                      onClick={() => toggle(p.what)}
                      aria-pressed={on}
                      aria-label={`Marcar ${p.what} como listo`}
                      className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-bold transition ${on ? "border-olive bg-olive text-paper" : "border-ink/20 text-transparent"}`}
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
        <button onClick={() => setChecked([])} className="mt-5 w-full text-center font-mono text-[11px] uppercase tracking-[0.2em] text-mute hover:text-ink">
          Reiniciar para la próxima semana
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
      <Title kicker="Intercambios" title="¿No tienes algo? Cámbialo." sub="Cambia un alimento por otro del mismo grupo. Así respetas tu plan sin aburrirte." />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {SWAPS.map((s) => (
          <button
            key={s.group}
            onClick={() => setGroup(s.group)}
            aria-pressed={s.group === group}
            className={`relative shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              s.group === group ? "border-transparent text-paper" : "border-line text-mute hover:text-ink"
            }`}
          >
            {s.group === group && <motion.span layoutId="swap-pill" className="absolute inset-0 rounded-full bg-olive" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} />}
            <span className="relative">{s.group}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-mute">{active.note}</p>
      <ul key={group} className="divide-y divide-line overflow-hidden rounded-[1.75rem] border border-line bg-paper-2">
        {active.list.map(([food, qty], i) => (
          <li key={food} className="rise flex items-baseline justify-between gap-4 px-5 py-3.5" style={{ animationDelay: `${i * 25}ms` }}>
            <span className="text-[15px]">{food}</span>
            <span className="shrink-0 text-right font-mono text-xs text-olive">{qty}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-mute">
        Ejemplo: el almuerzo del lunes tiene 2 harinas (arroz + papa). Puedes cambiar la papa por 1 trozo de yuca o ½ plátano verde.
      </p>
    </>
  );
}

export function TipsView() {
  return (
    <>
      <Title kicker="Tu guía" title="Las reglas del juego." sub="Recomendaciones de tu nutricionista, Ana María Isaza. Meta: 2.410 kcal al día." />
      <ol className="space-y-px overflow-hidden rounded-[1.75rem] border border-line">
        {TIPS.map((t, i) => (
          <li key={t} className="rise flex gap-4 bg-paper-2 px-5 py-4" style={{ animationDelay: `${i * 40}ms` }}>
            <span className="font-mono text-xs text-wine">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-[15px] leading-snug text-ink/90">{t}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mute">Marcas recomendadas</h2>
      <div className="grid gap-3">
        {BRANDS.map(([cat, list]) => (
          <SpotlightCard key={cat} {...card} className="rounded-[1.5rem]! p-5! border border-line">
            <h3 className="font-display text-2xl italic">{cat}</h3>
            <p className="mt-1 text-sm leading-relaxed text-mute">{list}</p>
          </SpotlightCard>
        ))}
      </div>

      <div className="mt-10 rounded-[1.75rem] border border-wine/30 bg-wine/[0.07] px-6 py-6">
        <p className="font-display text-3xl italic leading-tight">¿Dudas con el plan?</p>
        <p className="mt-2 text-sm text-ink/80">
          Escríbele a tu nutricionista: <span className="font-semibold text-wine">@anaisazanutricion</span>
        </p>
      </div>
    </>
  );
}

export function GuideView() {
  const [view, setView] = useState<"reglas" | "cambios">("reglas");
  return (
    <>
      <div className="mt-6 inline-flex rounded-full border border-line bg-paper-2 p-1">
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
            className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition ${view === id ? "text-paper" : "text-mute hover:text-ink"}`}
          >
            {view === id && <motion.span layoutId="guide-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>
      {view === "reglas" ? <TipsView /> : <SwapsView />}
    </>
  );
}

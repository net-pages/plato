import { motion } from "motion/react";
import CountUp from "./rb/CountUp";
import { fmtNum, type Totals } from "../store";

const R = 46;
const CIRC = 2 * Math.PI * R;

export default function KcalCard({ totals, goal, onAdd }: { totals: Totals; goal: number; onAdd: () => void }) {
  const pct = goal > 0 ? totals.kcal / goal : 0;
  const left = goal - totals.kcal;
  const over = left < 0;
  const macroKcal = totals.p * 4 + totals.c * 4 + totals.g * 9 || 1;

  return (
    <section className="rise mt-4 rounded-[2rem] border border-line bg-surface/70 px-5 pb-5 pt-5" aria-label="Calorías de hoy">
      <div className="flex items-center gap-5">
        {/* Anillo de progreso */}
        <div className="relative h-[7.5rem] w-[7.5rem] shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`${Math.round(pct * 100)} % de la meta diaria`}>
            <circle cx="60" cy="60" r={R} fill="none" stroke="#ede3d3" strokeOpacity="0.08" strokeWidth="9" />
            <motion.circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#9aaa5c"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: CIRC * (1 - Math.min(pct, 1)) }}
              transition={{ type: "spring", bounce: 0.1, duration: 1.1 }}
            />
            {over && (
              <motion.circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="#d2b48c"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: CIRC * (1 - Math.min(pct - 1, 1)) }}
                transition={{ type: "spring", bounce: 0.1, duration: 1.1, delay: 0.3 }}
              />
            )}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-3xl leading-none">{Math.round(pct * 100)}<span className="text-lg text-muted">%</span></p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">de la meta</p>
            </div>
          </div>
        </div>

        {/* Números */}
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Llevas</p>
          <p className="font-display text-5xl leading-none">
            <CountUp key={totals.kcal} to={totals.kcal} separator="." duration={0.9} trigger="load" />
            <span className="ml-1 text-xl text-muted">kcal</span>
          </p>
          <p className="mt-1 text-sm text-muted">de {fmtNum(goal)}</p>
          <p className={`mt-2 text-[15px] font-semibold ${over ? "text-secondary" : "text-primary-2"}`}>
            {over ? `Te pasaste por ${fmtNum(-left)}` : left === 0 ? "Justo en la meta" : `Te faltan ${fmtNum(left)}`}
          </p>
        </div>
      </div>

      {/* Macros */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {(
          [
            ["Proteína", totals.p, 4],
            ["Carbos", totals.c, 4],
            ["Grasa", totals.g, 9],
          ] as const
        ).map(([label, grams, k]) => (
          <div key={label} className="rounded-2xl bg-bg/40 px-3 py-2.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">{label}</p>
            <p className="mt-0.5 font-display text-2xl leading-none">
              {fmtNum(grams)}
              <span className="ml-0.5 text-sm text-muted">g</span>
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-fg/10">
              <motion.div className="h-full rounded-full bg-secondary" animate={{ width: `${((grams * k) / macroKcal) * 100}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        ))}
      </div>

      <button onClick={onAdd} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 py-3.5 text-sm font-semibold text-primary-2 transition hover:border-primary hover:bg-primary/5">
        <span className="text-lg leading-none">+</span> Registrar lo que comí
      </button>
    </section>
  );
}

import { motion } from "motion/react";
import { fmtNum } from "../store";

const GLASS = 250;
const WATER = "#8fb0b8";

function Glass({ fill }: { fill: number }) {
  // fill: 0..1
  const h = 26 * fill;
  return (
    <svg viewBox="0 0 22 30" className="h-8 w-full max-w-6" aria-hidden="true">
      <defs>
        <clipPath id="glass-clip">
          <path d="M2 2 L20 2 L17.5 28 L4.5 28 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#glass-clip)">
        <motion.rect x="0" width="22" fill={WATER} initial={false} animate={{ y: 28 - h, height: h }} transition={{ type: "spring", bounce: 0.3, duration: 0.6 }} />
      </g>
      <path d="M2 2 L20 2 L17.5 28 L4.5 28 Z" fill="none" stroke="#ede3d3" strokeOpacity={fill > 0 ? 0.55 : 0.22} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export default function WaterCard({ ml, goal, setMl }: { ml: number; goal: number; setMl: (v: number) => void }) {
  const glasses = Math.max(1, Math.min(12, Math.round(goal / GLASS)));
  const pct = goal > 0 ? Math.min(ml / goal, 1) : 0;

  return (
    <section className="rise mt-3 rounded-[2rem] border border-line bg-surface/70 px-5 py-4" aria-label="Agua de hoy">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl italic">Agua</h2>
        <p className="font-mono text-xs text-muted">
          <span className="text-fg">{fmtNum(ml)}</span> / {fmtNum(goal)} ml
        </p>
      </div>

      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${glasses}, minmax(0, 1fr))` }}>
        {Array.from({ length: glasses }, (_, i) => {
          const f = Math.max(0, Math.min(1, (ml - i * GLASS) / GLASS));
          return (
            <button
              key={i}
              onClick={() => setMl(f >= 1 && ml < (i + 2) * GLASS ? i * GLASS : (i + 1) * GLASS)}
              aria-label={`${(i + 1) * GLASS} ml`}
              className="flex justify-center rounded-lg py-0.5 transition active:scale-90"
            >
              <Glass fill={f} />
            </button>
          );
        })}
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-fg/10">
        <motion.div className="h-full rounded-full" style={{ background: WATER }} animate={{ width: `${pct * 100}%` }} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => setMl(Math.max(0, ml - GLASS))}
          disabled={ml === 0}
          aria-label="Quitar un vaso"
          className="grid h-10 w-10 place-items-center rounded-xl border border-line text-lg text-muted disabled:opacity-40"
        >
          −
        </button>
        <button onClick={() => setMl(ml + GLASS)} className="flex-1 rounded-xl bg-bg/50 py-2.5 text-sm font-semibold transition hover:bg-bg/70">
          + 1 vaso <span className="text-muted">(250 ml)</span>
        </button>
        <button onClick={() => setMl(ml + 500)} className="rounded-xl bg-bg/50 px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-bg/70 hover:text-fg">
          +500
        </button>
      </div>
      {ml >= goal && <p className="mt-2 text-xs text-primary-2">Meta de agua cumplida.</p>}
    </section>
  );
}

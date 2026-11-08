import { AnimatePresence, motion } from "motion/react";
import SpotlightCard from "./rb/SpotlightCard";
import ClickSpark from "./rb/ClickSpark";
import type { Recipe } from "../data";

interface Props {
  name: string;
  time: string;
  recipe: Recipe;
  open: boolean;
  onToggleOpen: () => void;
  done: boolean;
  canCheck: boolean;
  onCheck: () => void;
  isNow: boolean;
}

export default function MealCard({ name, time, recipe, open, onToggleOpen, done, canCheck, onCheck, isNow }: Props) {
  return (
    <SpotlightCard
      theme="light"
      spotlightColor="rgba(110, 30, 44, 0.08)"
      spotlightSize={280}
      className={`rounded-[1.75rem]! p-0! border transition-colors ${isNow ? "border-wine/50" : "border-line"}`}
      style={{ "--spotlight-card-surface": done ? "#f6f2ea" : "#fbf8f3", "--spotlight-card-shadow": "0 1px 2px rgb(42 29 32 / 0.04)" } as React.CSSProperties}
    >
      <div className="flex gap-4 p-5">
        {/* Hora */}
        <div className="w-[4.25rem] shrink-0 pt-1.5">
          <p className={`whitespace-nowrap font-mono text-xs font-semibold ${isNow ? "text-wine" : "text-ink/80"}`}>{time}</p>
          <p className="mt-1 text-[10px] uppercase leading-tight tracking-[0.18em] text-mute">{name}</p>
        </div>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          <h3
            className={`font-display text-[1.65rem] italic leading-[1.05] transition ${done ? "text-ink/40 line-through decoration-wine/60 decoration-1" : ""} ${
              recipe.free ? "text-olive" : ""
            }`}
          >
            {recipe.title}
          </h3>
          <p className={`mt-2 text-[13px] leading-relaxed ${done ? "text-mute/60" : "text-mute"}`}>{recipe.items.join(" · ")}</p>

          <button
            onClick={onToggleOpen}
            aria-expanded={open}
            className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-olive transition hover:text-ink"
          >
            {open ? "Ocultar" : recipe.free ? "Detalles" : `Receta${recipe.minutes ? ` · ${recipe.minutes} min` : ""}`}
            <motion.span animate={{ rotate: open ? 180 : 0 }} className="inline-block">
              ↓
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.ol
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 ml-2.5 space-y-3 border-l border-wine/30 pl-4">
                  {recipe.steps.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.07 }}
                      className="relative list-none text-sm leading-relaxed text-ink/90"
                    >
                      <span className="absolute -left-[1.4rem] top-1 grid h-4 w-4 place-items-center rounded-full bg-wine font-mono text-[9px] font-bold text-paper">
                        {i + 1}
                      </span>
                      {s}
                    </motion.li>
                  ))}
                </div>
              </motion.ol>
            )}
          </AnimatePresence>
        </div>

        {/* Check */}
        {canCheck && (
          <ClickSpark sparkColor={["#5f6334", "#6e1e2c"]} sparkCount={10} sparkRadius={26} disabled={done} className="h-11! w-11! shrink-0">
            <button
              onClick={onCheck}
              aria-pressed={done}
              aria-label={done ? `Desmarcar ${name}` : `Marcar ${name} como comida`}
              className={`grid h-11 w-11 place-items-center rounded-full border transition active:scale-90 ${
                done ? "border-wine bg-wine text-paper" : "border-ink/20 text-transparent hover:border-wine/60 hover:text-wine/50"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={false} animate={{ pathLength: done ? 1 : 0.999 }} />
              </svg>
            </button>
          </ClickSpark>
        )}
      </div>
    </SpotlightCard>
  );
}

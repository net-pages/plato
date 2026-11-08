import { AnimatePresence, motion } from "motion/react";
import SpotlightCard from "./rb/SpotlightCard";
import ClickSpark from "./rb/ClickSpark";
import type { Recipe } from "../data";
import { Olive } from "./Olives";

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
      theme="dark"
      spotlightColor="rgba(185, 196, 127, 0.10)"
      spotlightSize={280}
      className={`rounded-[1.75rem]! p-0! border transition-colors ${isNow ? "border-primary/50" : "border-line"}`}
      style={{ "--spotlight-card-surface": done ? "rgb(36 17 20 / 0.55)" : "rgb(47 23 27 / 0.72)", "--spotlight-card-shadow": "0 18px 40px -28px rgb(0 0 0 / 0.8)" } as React.CSSProperties}
    >
      <div className="flex gap-4 p-5">
        {/* Hora */}
        <div className="w-[4.25rem] shrink-0 pt-1.5">
          <p className={`whitespace-nowrap font-mono text-xs font-semibold ${isNow ? "text-primary" : "text-fg/80"}`}>{time}</p>
          <p className="mt-1 text-[10px] uppercase leading-tight tracking-[0.18em] text-muted">{name}</p>
        </div>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          <h3
            className={`font-display text-[1.65rem] italic leading-[1.05] transition ${done ? "text-fg/40 line-through decoration-primary/60 decoration-1" : ""} ${
              recipe.free ? "text-secondary" : ""
            }`}
          >
            {recipe.title}
          </h3>
          <p className={`mt-2 text-[13px] leading-relaxed ${done ? "text-muted/60" : "text-muted"}`}>{recipe.items.join(" · ")}</p>

          <button
            onClick={onToggleOpen}
            aria-expanded={open}
            className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary transition hover:text-fg"
          >
            {open ? "Cerrar" : recipe.free ? "Ideas" : `Receta · ${recipe.minutes} min`}
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
                <div className="mt-4 ml-2.5 space-y-3 border-l border-primary/30 pl-4">
                  {recipe.steps.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.07 }}
                      className="relative list-none text-sm leading-relaxed text-fg/90"
                    >
                      <span className="absolute -left-[1.4rem] top-1 grid h-4 w-4 place-items-center rounded-full bg-primary font-mono text-[9px] font-bold text-bg">
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
          <ClickSpark sparkColor={["#b9c47f", "#d2b48c"]} sparkCount={10} sparkRadius={26} disabled={done} className="h-11! w-11! shrink-0">
            <button
              onClick={onCheck}
              aria-pressed={done}
              aria-label={done ? `Desmarcar ${name}` : `Marcar ${name} como comida`}
              className={`grid h-11 w-11 place-items-center rounded-full border transition active:scale-90 ${
                done ? "border-primary/40 bg-bg/50" : "border-fg/20 hover:border-primary/60"
              }`}
            >
              <motion.span initial={false} animate={{ scale: done ? 1 : 0.4, opacity: done ? 1 : 0 }} transition={{ type: "spring", bounce: 0.5, duration: 0.45 }}>
                <Olive size={30} />
              </motion.span>
            </button>
          </ClickSpark>
        )}
      </div>
    </SpotlightCard>
  );
}

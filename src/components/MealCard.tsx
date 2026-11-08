import { AnimatePresence, motion } from "motion/react";
import SpotlightCard from "./rb/SpotlightCard";
import ClickSpark from "./rb/ClickSpark";
import type { Recipe } from "../data";
import { fmtNum, type Entry } from "../store";
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
  entries: Entry[];
  onOther: () => void;
  onRemoveEntry: (id: string) => void;
}

export default function MealCard({ name, time, recipe, open, onToggleOpen, done, canCheck, onCheck, isNow, entries, onOther, onRemoveEntry }: Props) {
  const replaced = entries.some((e) => e.replaces);
  const struck = done || replaced;
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
            className={`font-display text-[1.65rem] italic leading-[1.05] transition ${struck ? "text-fg/40 line-through decoration-primary/60 decoration-1" : ""} ${
              recipe.free ? "text-secondary" : ""
            }`}
          >
            {recipe.title}
          </h3>
          <p className={`mt-2 text-[13px] leading-relaxed ${struck ? "text-muted/60" : "text-muted"}`}>
            {recipe.items.join(" · ")}
            {recipe.kcal ? <span className="whitespace-nowrap text-secondary/80"> · ≈ {recipe.kcal} kcal</span> : null}
          </p>
          {recipe.added && (
            <p className={`mt-1 text-[13px] leading-relaxed ${struck ? "text-primary-2/50" : "text-primary-2"}`}>
              {recipe.added.map((a) => `+ ${a}`).join(" · ")}
            </p>
          )}

          {entries.length > 0 && (
            <ul className="mt-3 space-y-1.5 rounded-2xl bg-bg/40 px-3 py-2.5">
              <li className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary-2">{replaced ? "Comiste en su lugar" : "Además comiste"}</li>
              {entries.map((e) => (
                <li key={e.id} className="flex items-center gap-2 text-sm">
                  {e.thumb && <img src={e.thumb} alt="" className="h-7 w-7 rounded-md object-cover" />}
                  <span className="min-w-0 flex-1 truncate">{e.name}</span>
                  <span className="whitespace-nowrap font-mono text-[11px] text-secondary">{fmtNum(e.kcal)} kcal</span>
                  {canCheck && (
                    <button onClick={() => onRemoveEntry(e.id)} aria-label={`Borrar ${e.name}`} className="px-1 text-muted hover:text-fg">
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

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

          {canCheck && !done && (
            <button onClick={onOther} className="mt-3 ml-4 inline-flex text-[11px] font-semibold uppercase tracking-[0.15em] text-muted transition hover:text-fg">
              {recipe.free ? "+ Registrar" : "Comí otra cosa"}
            </button>
          )}
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

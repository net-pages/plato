import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SHOPPING } from "../shopping";
import { usePersisted } from "../store";
import ClickSpark from "./rb/ClickSpark";
import CountUp from "./rb/CountUp";
import { Title } from "./Views";

const TOTAL = SHOPPING.reduce((a, c) => a + c.items.length, 0);

export default function Market() {
  const [got, setGot] = usePersisted<string[]>("plato.market", []);
  const [hideGot, setHideGot] = useState(false);
  const [copied, setCopied] = useState(false);
  const toggle = (n: string) => setGot((g) => (g.includes(n) ? g.filter((x) => x !== n) : [...g, n]));
  const pct = got.length / TOTAL;

  const share = async () => {
    const text =
      "🛒 Mercado de la semana — Plato\n\n" +
      SHOPPING.map((c) => {
        const pending = c.items.filter((i) => !got.includes(i.name));
        return pending.length ? `*${c.cat}*\n${pending.map((i) => `• ${i.name} — ${i.qty}`).join("\n")}` : "";
      })
        .filter(Boolean)
        .join("\n\n");
    try {
      if (navigator.share) return await navigator.share({ title: "Mercado de la semana", text });
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* el usuario canceló */
    }
  };

  return (
    <>
      <Title kicker="Mercado · 1 semana" title="Todo lo que necesitas, sumado." sub="Calculado comida por comida desde tu plan. Ve marcando mientras compras." />

      {/* Progreso de compra */}
      <div className="sticky top-[max(env(safe-area-inset-top),0.75rem)] z-30 -mx-1 mb-5 rounded-3xl border border-line bg-ink-2/85 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-end justify-between">
          <p className="font-display text-4xl leading-none">
            <CountUp key={got.length} from={Math.max(0, got.length - 1)} to={got.length} duration={0.5} trigger="load" />
            <span className="text-mute">/{TOTAL}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setHideGot((h) => !h)}
              aria-pressed={hideGot}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] transition ${
                hideGot ? "border-sage bg-sage text-ink" : "border-line text-mute hover:text-cream"
              }`}
            >
              Ocultar lo comprado
            </button>
            <button onClick={share} className="rounded-full bg-tang px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink">
              {copied ? "Copiado ✓" : "Compartir"}
            </button>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream/10" role="progressbar" aria-valuenow={got.length} aria-valuemax={TOTAL} aria-label="Productos comprados">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-tang to-ember" animate={{ width: `${pct * 100}%` }} transition={{ type: "spring", bounce: 0.2 }} />
        </div>
      </div>

      <div className="space-y-8">
        {SHOPPING.map((c) => {
          const items = hideGot ? c.items.filter((i) => !got.includes(i.name)) : c.items;
          const doneCat = c.items.every((i) => got.includes(i.name));
          if (!items.length) return null;
          return (
            <section key={c.cat}>
              <h2 className="mb-2 flex items-baseline justify-between">
                <span className={`font-display text-3xl italic ${doneCat ? "text-sage" : ""}`}>{c.cat}</span>
                <span className="font-mono text-[11px] text-mute">
                  {c.items.filter((i) => got.includes(i.name)).length}/{c.items.length}
                </span>
              </h2>
              <ul className="overflow-hidden rounded-[1.5rem] border border-line bg-ink-2">
                <AnimatePresence initial={false}>
                  {items.map((i) => {
                    const on = got.includes(i.name);
                    return (
                      <motion.li
                        key={i.name}
                        layout
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-line last:border-b-0"
                      >
                        <ClickSpark sparkColor={["#ff7a3d", "#ffb347"]} sparkCount={7} sparkRadius={18} disabled={on}>
                          <button onClick={() => toggle(i.name)} aria-pressed={on} className="flex w-full items-center gap-4 px-5 py-3.5 text-left">
                            <span
                              className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-[12px] font-bold transition ${
                                on ? "border-tang bg-tang text-ink" : "border-cream/25 text-transparent"
                              }`}
                            >
                              ✓
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={`block text-[15px] transition ${on ? "text-cream/35 line-through" : ""}`}>{i.name}</span>
                              {i.para && <span className="block truncate text-[11px] text-mute/80">{i.para}</span>}
                            </span>
                            <span className={`shrink-0 text-right font-mono text-xs ${on ? "text-mute/50" : "text-ember"}`}>{i.qty}</span>
                          </button>
                        </ClickSpark>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </section>
          );
        })}
      </div>

      {got.length > 0 && (
        <button onClick={() => setGot([])} className="mt-8 w-full text-center font-mono text-[11px] uppercase tracking-[0.2em] text-mute hover:text-cream">
          Empezar lista nueva
        </button>
      )}
    </>
  );
}

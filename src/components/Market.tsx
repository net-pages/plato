import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SHOPPING as BASE, SHOPPING_EXTRA } from "../shopping";
import { usePersisted } from "../store";
import ClickSpark from "./rb/ClickSpark";
import CountUp from "./rb/CountUp";
import { Title } from "./Views";


export default function Market({ adjusted }: { adjusted: boolean }) {
  const SHOPPING = adjusted ? [...BASE, SHOPPING_EXTRA] : BASE;
  const TOTAL = SHOPPING.reduce((a, c) => a + c.items.length, 0);
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
      <Title kicker="Mercado · lunes a domingo" title={`${TOTAL} cosas. Ni una más.`} sub="Sumadas plato por plato desde tu carta. Tacha a medida que llenas el carrito." />

      {/* Progreso de compra */}
      <div className="sticky top-[max(env(safe-area-inset-top),0.75rem)] z-30 -mx-1 mb-5 rounded-3xl border border-line bg-surface/85 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-end justify-between">
          <p className="font-display text-4xl leading-none">
            <CountUp key={got.length} from={Math.max(0, got.length - 1)} to={got.length} duration={0.5} trigger="load" />
            <span className="text-muted">/{TOTAL}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setHideGot((h) => !h)}
              aria-pressed={hideGot}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] transition ${
                hideGot ? "border-secondary bg-secondary text-bg" : "border-line text-muted hover:text-fg"
              }`}
            >
              Esconder lo tachado
            </button>
            <button onClick={share} className="rounded-full bg-primary px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-bg">
              {copied ? "Copiada ✓" : "Enviar"}
            </button>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-fg/10" role="progressbar" aria-valuenow={got.length} aria-valuemax={TOTAL} aria-label="Productos comprados">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" animate={{ width: `${pct * 100}%` }} transition={{ type: "spring", bounce: 0.2 }} />
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
                <span className={`font-display text-3xl italic ${doneCat ? "text-secondary" : ""}`}>{c.cat}</span>
                <span className="font-mono text-[11px] text-muted">
                  {c.items.filter((i) => got.includes(i.name)).length}/{c.items.length}
                </span>
              </h2>
              <ul className="overflow-hidden rounded-[1.5rem] border border-line bg-surface">
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
                        <ClickSpark sparkColor={["#b9c47f", "#d2b48c"]} sparkCount={7} sparkRadius={18} disabled={on}>
                          <button onClick={() => toggle(i.name)} aria-pressed={on} className="flex w-full items-center gap-4 px-5 py-3.5 text-left">
                            <span
                              className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-[12px] font-bold transition ${
                                on ? "border-primary bg-primary text-bg" : "border-fg/25 text-transparent"
                              }`}
                            >
                              ✓
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={`block text-[15px] transition ${on ? "text-fg/35 line-through" : ""}`}>{i.name}</span>
                              {i.para && <span className="block truncate text-[11px] text-muted/80">{i.para}</span>}
                            </span>
                            <span className={`shrink-0 text-right font-mono text-xs ${on ? "text-muted/50" : "text-secondary"}`}>{i.qty}</span>
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
        <button onClick={() => setGot([])} className="mt-8 w-full text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-fg">
          Lista nueva para la otra semana
        </button>
      )}
    </>
  );
}

import Aurora from "./rb/Aurora";
import BlurText from "./rb/BlurText";
import ShinyText from "./rb/ShinyText";
import ClickSpark from "./rb/ClickSpark";
import Counter from "./rb/Counter";
import type { MealId, Recipe } from "../data";
import { fmt12, type Times } from "../store";

interface Props {
  focus: { meal: { id: MealId; name: string }; minutesUntil: number } | null;
  recipe: Recipe | null;
  times: Times;
  onReveal: (id: MealId) => void;
  onDone: (id: MealId) => void;
}

// Aurora muy tenue en tonos vino y oliva: movimiento sin estridencia
const AURA = ["#5a1622", "#8c3443", "#6b6f3a"];

export default function Hero({ focus, recipe, times, onReveal, onDone }: Props) {
  if (!focus || !recipe) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] bg-olive px-6 py-10 text-paper">
        <div className="pointer-events-none absolute inset-0 opacity-35">
          <Aurora colorStops={["#4c4f28", "#8a8e52", "#6e1e2c"]} amplitude={0.7} speed={0.4} />
        </div>
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-olive-soft">Día completo</p>
          <BlurText text="Cumpliste las 5 comidas." animateBy="words" className="mt-2 font-display text-5xl italic leading-[0.95]" />
          <p className="mt-4 max-w-xs text-sm text-paper/80">Ahora a dormir temprano: así se construye el músculo.</p>
        </div>
      </div>
    );
  }

  const { meal, minutesUntil } = focus;
  const upcoming = minutesUntil > 0;
  const h = Math.floor(minutesUntil / 60);
  const m = minutesUntil % 60;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-wine text-paper shadow-[0_24px_48px_-28px_rgb(110_30_44/0.7)]">
      <div className="pointer-events-none absolute inset-0 opacity-45">
        <Aurora colorStops={AURA} amplitude={0.9} blend={0.6} speed={0.35} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine via-wine/80 to-transparent" />

      <div className="relative px-6 pb-6 pt-16">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-olive-2 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-olive-2" />
          </span>
          <ShinyText
            text={upcoming ? `Lo que sigue · ${meal.name}` : `Ahora · ${meal.name}`}
            color="#f3eee6"
            shineColor="#c9cc8a"
            speed={3.2}
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]"
          />
        </div>

        {recipe.free ? (
          <h2 className="mt-3 font-display text-6xl italic leading-[0.9] text-olive-2">{recipe.title}</h2>
        ) : (
          <BlurText
            key={recipe.title}
            text={recipe.title}
            animateBy="words"
            delay={70}
            className="mt-3 font-display text-[2.75rem] italic leading-[0.95] sm:text-6xl"
          />
        )}

        {upcoming && (
          <div className="mt-3 flex items-baseline gap-2 font-mono text-sm text-paper/75">
            <span>{fmt12(times[meal.id])} · en</span>
            {h > 0 && (
              <>
                <Counter value={h} fontSize={14} textColor="#c9cc8a" fontWeight={600} />
                <span>h</span>
              </>
            )}
            <Counter value={m} fontSize={14} textColor="#c9cc8a" fontWeight={600} minDigits={h > 0 ? 2 : 1} />
            <span>min</span>
          </div>
        )}

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {recipe.items.map((it) => (
            <li key={it} className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[11px] text-paper/90">
              {it}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => onReveal(meal.id)}
            className="flex-[1.4] whitespace-nowrap rounded-2xl border border-paper/25 px-4 py-3.5 text-sm font-semibold transition hover:bg-paper/10 active:scale-[0.98]"
          >
            {recipe.free ? "Ver detalles" : `Cómo prepararlo · ${recipe.minutes} min`}
          </button>
          <ClickSpark sparkColor={["#c9cc8a", "#f3eee6"]} sparkCount={10} sparkRadius={30} className="w-auto! flex-1">
            <button
              onClick={() => onDone(meal.id)}
              className="h-full w-full whitespace-nowrap rounded-2xl bg-paper px-4 py-3.5 text-sm font-bold text-wine transition hover:bg-paper-2 active:scale-[0.98]"
            >
              Ya comí ✓
            </button>
          </ClickSpark>
        </div>
      </div>
    </div>
  );
}

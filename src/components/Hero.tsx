import Aurora from "./rb/Aurora";
import BlurText from "./rb/BlurText";
import ShinyText from "./rb/ShinyText";
import ClickSpark from "./rb/ClickSpark";
import Counter from "./rb/Counter";
import GradientText from "./rb/GradientText";
import type { MealId, Recipe } from "../data";
import { fmt12, type Times } from "../store";

interface Props {
  focus: { meal: { id: MealId; name: string }; minutesUntil: number } | null;
  recipe: Recipe | null;
  times: Times;
  onReveal: (id: MealId) => void;
  onDone: (id: MealId) => void;
}

export default function Hero({ focus, recipe, times, onReveal, onDone }: Props) {
  if (!focus || !recipe) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-ink-2 px-6 py-10">
        <div className="absolute inset-0 opacity-50">
          <Aurora colorStops={["#1d3b2a", "#c9d8b6", "#ff7a3d"]} amplitude={0.8} speed={0.5} />
        </div>
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage">Día completo</p>
          <BlurText text="Cumpliste las 5 comidas." animateBy="words" className="mt-2 font-display text-5xl italic leading-[0.95]" />
          <p className="mt-4 max-w-xs text-sm text-cream/70">Ahora a dormir temprano: así se construye el músculo.</p>
        </div>
      </div>
    );
  }

  const { meal, minutesUntil } = focus;
  const upcoming = minutesUntil > 0;
  const h = Math.floor(minutesUntil / 60);
  const m = minutesUntil % 60;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-ink-2">
      {/* Atmósfera */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <Aurora colorStops={["#163322", "#ff7a3d", "#ffb347"]} amplitude={1.1} blend={0.6} speed={0.6} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      <div className="relative px-6 pb-6 pt-20">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tang opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-tang" />
          </span>
          <ShinyText
            text={upcoming ? `Lo que sigue · ${meal.name}` : `Ahora · ${meal.name}`}
            color="#f2ede3"
            shineColor="#ffb347"
            speed={2.6}
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]"
          />
        </div>

        {recipe.free ? (
          <h2 className="mt-3 font-display text-6xl italic leading-[0.9]">
            <GradientText colors={["#ff7a3d", "#ffb347", "#c9d8b6", "#ff7a3d"]} animationSpeed={6}>
              {recipe.title}
            </GradientText>
          </h2>
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
          <div className="mt-3 flex items-baseline gap-2 font-mono text-sm text-cream/80">
            <span>{fmt12(times[meal.id])} · en</span>
            {h > 0 && (
              <>
                <Counter value={h} fontSize={14} textColor="#ffb347" fontWeight={600} />
                <span>h</span>
              </>
            )}
            <Counter value={m} fontSize={14} textColor="#ffb347" fontWeight={600} minDigits={h > 0 ? 2 : 1} />
            <span>min</span>
          </div>
        )}

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {recipe.items.map((it) => (
            <li key={it} className="rounded-full border border-cream/15 bg-ink/50 px-3 py-1 font-mono text-[11px] text-cream/90 backdrop-blur">
              {it}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => onReveal(meal.id)}
            className="flex-[1.4] whitespace-nowrap rounded-2xl border border-cream/20 bg-ink/40 px-4 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-ink/70 active:scale-[0.98]"
          >
            {recipe.free ? "Ver detalles" : `Cómo prepararlo · ${recipe.minutes} min`}
          </button>
          <ClickSpark sparkColor={["#ff7a3d", "#ffb347", "#f2ede3"]} sparkCount={12} sparkRadius={34} shape="star" className="w-auto! flex-1">
            <button
              onClick={() => onDone(meal.id)}
              className="h-full w-full whitespace-nowrap rounded-2xl bg-tang px-4 py-3.5 text-sm font-bold text-ink shadow-lg shadow-tang/30 transition hover:brightness-110 active:scale-[0.98]"
            >
              Ya comí ✓
            </button>
          </ClickSpark>
        </div>
      </div>
    </div>
  );
}

import BlurText from "./rb/BlurText";
import ClickSpark from "./rb/ClickSpark";
import Counter from "./rb/Counter";
import { OliveSkewer } from "./Olives";
import type { MealId, Recipe } from "../data";
import { fmt12, type Times } from "../store";

interface Props {
  focus: { meal: { id: MealId; name: string }; minutesUntil: number } | null;
  recipe: Recipe | null;
  times: Times;
  onReveal: (id: MealId) => void;
  onDone: (id: MealId) => void;
  onOther: (id: MealId) => void;
}

const card =
  "relative overflow-hidden rounded-[2rem] border border-line bg-[radial-gradient(90%_70%_at_80%_20%,rgb(110_44_54/0.55),transparent_70%)] bg-surface/70";

export default function Hero({ focus, recipe, times, onReveal, onDone, onOther }: Props) {
  if (!focus || !recipe) {
    return (
      <div className={`${card} px-6 py-10`}>
        <OliveSkewer className="sway pointer-events-none absolute -right-6 -top-6 h-[125%] w-36 opacity-90" />
        <div className="relative max-w-[66%]">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-secondary">Cocina cerrada</p>
          <BlurText text="Cinco de cinco." animateBy="words" className="mt-2 font-display text-5xl italic leading-[0.95]" />
          <p className="mt-4 text-sm leading-relaxed text-muted">El músculo se construye dormido. A la cama antes de las diez.</p>
        </div>
      </div>
    );
  }

  const { meal, minutesUntil } = focus;
  const upcoming = minutesUntil > 0;
  const h = Math.floor(minutesUntil / 60);
  const m = minutesUntil % 60;

  return (
    <div className={card}>
      <OliveSkewer className="sway pointer-events-none absolute -right-5 -top-4 h-[115%] w-32 sm:w-40" />

      <div className="relative px-6 pb-6 pt-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary">
          {upcoming ? "En la fila" : "Te toca"} <span className="text-muted">· {meal.name}</span>
        </p>

        <div className="mt-3 max-w-[70%]">
          {recipe.free ? (
            <h2 className="font-display text-[2.9rem] italic leading-[0.92] text-primary-2">{recipe.title}</h2>
          ) : (
            <BlurText key={recipe.title} text={recipe.title} animateBy="words" delay={70} className="font-display text-[2.6rem] italic leading-[0.95] sm:text-6xl" />
          )}
        </div>

        {upcoming ? (
          <div className="mt-3 flex items-baseline gap-1.5 font-mono text-[13px] text-muted">
            <span>{fmt12(times[meal.id])} · faltan</span>
            {h > 0 && (
              <>
                <Counter value={h} fontSize={13} textColor="#d2b48c" fontWeight={600} />
                <span>h</span>
              </>
            )}
            <Counter value={m} fontSize={13} textColor="#d2b48c" fontWeight={600} minDigits={h > 0 ? 2 : 1} />
            <span>min</span>
            {recipe.kcal ? <span className="text-secondary">· ≈ {recipe.kcal} kcal</span> : null}
          </div>
        ) : (
          <p className="mt-3 font-mono text-[13px] text-muted">
            {recipe.free ? "Sin porciones. Sin culpa." : `Desde las ${fmt12(times[meal.id])}`}
            {recipe.kcal ? <span className="text-secondary"> · ≈ {recipe.kcal} kcal</span> : null}
          </p>
        )}

        <ul className="mt-5 flex max-w-[78%] flex-wrap gap-1.5">
          {recipe.items.map((it) => (
            <li key={it} className="rounded-full border border-fg/15 bg-bg/40 px-3 py-1 font-mono text-[11px] text-fg/85 backdrop-blur-sm">
              {it}
            </li>
          ))}
          {recipe.added?.map((it) => (
            <li key={`+${it}`} className="rounded-full border border-primary/45 bg-primary/10 px-3 py-1 font-mono text-[11px] text-primary-2 backdrop-blur-sm">
              + {it}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex gap-2">
          <button
            onClick={() => onReveal(meal.id)}
            className="flex-[1.3] whitespace-nowrap rounded-2xl border border-fg/20 bg-bg/60 px-4 py-3.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-bg/80 active:scale-[0.98]"
          >
            {recipe.free ? "¿Qué pido?" : `Ver receta · ${recipe.minutes} min`}
          </button>
          <ClickSpark sparkColor={["#b9c47f", "#d2b48c"]} sparkCount={9} sparkRadius={28} className="w-auto! flex-1">
            <button
              onClick={() => (recipe.free ? onOther(meal.id) : onDone(meal.id))}
              className="h-full w-full whitespace-nowrap rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-bg transition hover:bg-primary-2 active:scale-[0.98]"
            >
              {recipe.free ? "Registrar" : "Comido ✓"}
            </button>
          </ClickSpark>
        </div>
        {!recipe.free && (
          <button onClick={() => onOther(meal.id)} className="mt-3 w-full text-center text-[13px] text-muted underline-offset-4 hover:text-fg hover:underline">
            Comí otra cosa
          </button>
        )}
      </div>
    </div>
  );
}

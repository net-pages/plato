import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Sheet from "./Sheet";
import { MEALS } from "../data";
import { searchFoods } from "../foods";
import { AI_KEY_STORAGE, AIError, compressImage, estimate, getKey, type FoodItem } from "../ai";
import { fmtNum, newId, type Entry, type Slot } from "../store";

type Mode = "foto" | "texto" | "buscar" | "manual";
interface Pending extends FoodItem {
  thumb?: string;
  qty: number;
  source: Entry["source"];
  key: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  slot: Slot;
  replaces: boolean;
  planTitle: (slot: Slot) => string | null;
  onSave: (entries: Entry[], slot: Slot, replaces: boolean) => void;
}

const SLOTS: [Slot, string][] = [...MEALS.map((m) => [m.id, m.name] as [Slot, string]), ["extra", "Extra"]];

export default function LogSheet({ open, onClose, slot: initialSlot, replaces: initialReplaces, planTitle, onSave }: Props) {
  const [mode, setMode] = useState<Mode>("foto");
  const [slot, setSlot] = useState<Slot>(initialSlot);
  const [replaces, setReplaces] = useState(initialReplaces);
  const [pending, setPending] = useState<Pending[]>([]);
  const [hasKey, setHasKey] = useState(() => !!getKey());

  // reinicia cada vez que se abre
  useEffect(() => {
    if (open) {
      setSlot(initialSlot);
      setReplaces(initialReplaces);
      setPending([]);
      setMode("foto");
      setHasKey(!!getKey());
    }
  }, [open, initialSlot, initialReplaces]);

  const add = (items: (FoodItem & { thumb?: string })[], source: Entry["source"]) =>
    setPending((p) => [...p, ...items.map((i) => ({ ...i, qty: 1, source, key: newId() }))]);
  const total = pending.reduce((a, i) => a + i.kcal * i.qty, 0);
  const plan = slot === "extra" ? null : planTitle(slot);

  const save = () => {
    const entries: Entry[] = pending.map((i) => ({
      id: newId(),
      slot,
      name: i.qty === 1 ? i.name : `${i.qty.toLocaleString("es-CO")} × ${i.name}`,
      portion: i.portion,
      kcal: Math.round(i.kcal * i.qty),
      p: Math.round(i.p * i.qty * 10) / 10,
      c: Math.round(i.c * i.qty * 10) / 10,
      g: Math.round(i.g * i.qty * 10) / 10,
      source: i.source,
      replaces: slot !== "extra" && replaces,
      thumb: i.thumb,
      at: Date.now(),
    }));
    onSave(entries, slot, slot !== "extra" && replaces);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} label="Registrar comida">
      <h2 className="font-display text-4xl italic">¿Qué comiste?</h2>

      {/* Comida del día */}
      <div className="no-scrollbar -mx-5 mt-3 flex gap-1.5 overflow-x-auto px-5">
        {SLOTS.map(([id, name]) => (
          <button
            key={id}
            onClick={() => setSlot(id)}
            aria-pressed={slot === id}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              slot === id ? "border-secondary bg-secondary text-bg" : "border-line text-muted hover:text-fg"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {plan && (
        <button
          role="switch"
          aria-checked={replaces}
          onClick={() => setReplaces((r) => !r)}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-bg/40 px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1 text-sm">
            <span className="block font-semibold">{replaces ? "En vez del plato del plan" : "Además del plato del plan"}</span>
            <span className="block truncate text-xs text-muted">{plan}</span>
          </span>
          <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${replaces ? "bg-primary" : "bg-fg/15"}`}>
            <motion.span layout className={`absolute top-0.5 h-5 w-5 rounded-full bg-fg ${replaces ? "right-0.5" : "left-0.5"}`} />
          </span>
        </button>
      )}

      {/* Modos */}
      <div className="mt-4 grid grid-cols-4 gap-1 rounded-2xl border border-line bg-bg/40 p-1">
        {(
          [
            ["foto", "Foto"],
            ["texto", "Contar"],
            ["buscar", "Buscar"],
            ["manual", "Manual"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            aria-pressed={mode === id}
            className={`relative rounded-xl py-2 text-sm font-semibold transition ${mode === id ? "text-bg" : "text-muted hover:text-fg"}`}
          >
            {mode === id && <motion.span layoutId="log-mode" className="absolute inset-0 rounded-xl bg-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        {(mode === "foto" || mode === "texto") && !hasKey ? (
          <KeySetup onSaved={() => setHasKey(true)} />
        ) : mode === "foto" ? (
          <PhotoMode onResult={(items, thumb) => add(items.map((i) => ({ ...i, thumb })), "foto")} />
        ) : mode === "texto" ? (
          <TextMode onResult={(items) => add(items, "texto")} />
        ) : mode === "buscar" ? (
          <SearchMode onPick={(f) => add([f], "lista")} />
        ) : (
          <ManualMode onAdd={(f) => add([f], "manual")} />
        )}
      </div>

      {/* Lo que se va a guardar */}
      <AnimatePresence>
        {pending.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Para guardar</p>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-bg/40">
              {pending.map((i) => (
                <li key={i.key} className="px-4 py-3">
                  <div className="flex items-baseline gap-3">
                    {i.thumb && <img src={i.thumb} alt="" className="h-8 w-8 shrink-0 self-center rounded-lg object-cover" />}
                    <p className="min-w-0 flex-1 text-[15px] leading-snug">{i.name}</p>
                    <span className="shrink-0 whitespace-nowrap font-mono text-xs text-secondary">{fmtNum(i.kcal * i.qty)} kcal</span>
                    <button onClick={() => setPending((p) => p.filter((x) => x.key !== i.key))} aria-label={`Quitar ${i.name}`} className="shrink-0 px-1 text-muted hover:text-fg">
                      ×
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <p className="min-w-0 flex-1 truncate text-[11px] text-muted">
                      {i.portion} · P {fmtNum(i.p * i.qty)} · C {fmtNum(i.c * i.qty)} · G {fmtNum(i.g * i.qty)}
                    </p>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => setPending((p) => p.map((x) => (x.key === i.key ? { ...x, qty: Math.max(0.5, x.qty - 0.5) } : x)))}
                        aria-label="Menos"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-line text-muted"
                      >
                        −
                      </button>
                      <span className="w-9 text-center font-mono text-xs">×{i.qty.toLocaleString("es-CO")}</span>
                      <button
                        onClick={() => setPending((p) => p.map((x) => (x.key === i.key ? { ...x, qty: x.qty + 0.5 } : x)))}
                        aria-label="Más"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-line text-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={save}
        disabled={!pending.length}
        className="mt-5 mb-4 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-bg transition disabled:bg-fg/10 disabled:text-muted"
      >
        {pending.length ? `Guardar · ${fmtNum(total)} kcal` : "Agrega algo para guardar"}
      </button>
    </Sheet>
  );
}

/* ---------- Modos ---------- */

function useEstimate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const run = async (input: Parameters<typeof estimate>[0]) => {
    setLoading(true);
    setError(null);
    setNote(null);
    try {
      const r = await estimate(input);
      setNote(r.note || null);
      if (!r.items.length) setError(r.note || "No encontré comida para calcular.");
      return r.items;
    } catch (e) {
      setError(e instanceof AIError ? e.message : "No se pudo hacer la estimación.");
      return [];
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, note, run };
}

function Status({ loading, error, note }: { loading: boolean; error: string | null; note: string | null }) {
  if (loading)
    return (
      <p className="mt-3 flex items-center gap-2 text-sm text-muted">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Calculando… puede tardar unos segundos.
      </p>
    );
  if (error) return <p className="mt-3 rounded-xl bg-secondary/10 px-3 py-2 text-sm text-secondary">{error}</p>;
  if (note) return <p className="mt-3 text-xs text-muted">Supuesto: {note}</p>;
  return null;
}

function PhotoMode({ onResult }: { onResult: (items: FoodItem[], thumb: string) => void }) {
  const [img, setImg] = useState<{ base64: string; thumb: string } | null>(null);
  const [detail, setDetail] = useState("");
  const { loading, error, note, run } = useEstimate();
  const cam = useRef<HTMLInputElement>(null);
  const gal = useRef<HTMLInputElement>(null);

  const pick = async (f?: File) => {
    if (!f) return;
    setImg(await compressImage(f));
  };

  return (
    <div>
      <input ref={cam} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <input ref={gal} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      {img ? (
        <div className="flex gap-3">
          <img src={`data:image/jpeg;base64,${img.base64}`} alt="Tu comida" className="h-28 w-28 shrink-0 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={3}
              placeholder="Detalle opcional: «frito», «sin azúcar», «media porción»…"
              className="w-full resize-none rounded-xl border border-line bg-bg/50 px-3 py-2 text-sm placeholder:text-muted/70 focus:border-primary focus:outline-none"
            />
            <button onClick={() => setImg(null)} className="mt-1 text-xs text-muted underline-offset-2 hover:underline">
              Cambiar foto
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => cam.current?.click()} className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary/40 py-6 text-sm font-semibold text-primary-2">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            Tomar foto
          </button>
          <button onClick={() => gal.current?.click()} className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line py-6 text-sm font-semibold text-muted">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="m3 16 5-5 4 4 3-3 6 6" />
            </svg>
            De la galería
          </button>
        </div>
      )}
      {img && (
        <button
          onClick={async () => {
            const items = await run({ imageBase64: img.base64, text: detail });
            if (items.length) {
              onResult(items, img.thumb);
              setImg(null);
              setDetail("");
            }
          }}
          disabled={loading}
          className="mt-3 w-full rounded-2xl border border-primary/50 py-3 text-sm font-semibold text-primary-2 disabled:opacity-50"
        >
          Calcular calorías
        </button>
      )}
      <Status loading={loading} error={error} note={note} />
    </div>
  );
}

function TextMode({ onResult }: { onResult: (items: FoodItem[]) => void }) {
  const [text, setText] = useState("");
  const { loading, error, note, run } = useEstimate();
  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Cuéntalo como se lo dirías a alguien: «dos empanadas de carne con ají y una Coca-Cola mediana»"
        className="w-full resize-none rounded-2xl border border-line bg-bg/50 px-4 py-3 text-[15px] placeholder:text-muted/70 focus:border-primary focus:outline-none"
      />
      <button
        onClick={async () => {
          const items = await run({ text });
          if (items.length) {
            onResult(items);
            setText("");
          }
        }}
        disabled={loading || !text.trim()}
        className="mt-2 w-full rounded-2xl border border-primary/50 py-3 text-sm font-semibold text-primary-2 disabled:opacity-50"
      >
        Calcular calorías
      </button>
      <Status loading={loading} error={error} note={note} />
    </div>
  );
}

function SearchMode({ onPick }: { onPick: (f: FoodItem) => void }) {
  const [q, setQ] = useState("");
  const results = searchFoods(q);
  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Arepa, empanada, bandeja paisa…"
        className="w-full rounded-2xl border border-line bg-bg/50 px-4 py-3 text-[15px] placeholder:text-muted/70 focus:border-primary focus:outline-none"
      />
      {q && !results.length && <p className="mt-3 text-sm text-muted">No está en la lista. Prueba «Contar» o «Manual».</p>}
      <ul className="mt-2 space-y-1">
        {results.map((f) => (
          <li key={f.name + f.portion}>
            <button onClick={() => onPick(f)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-bg/50">
              <span className="min-w-0 flex-1">
                <span className="block text-[15px]">{f.name}</span>
                <span className="block text-xs text-muted">{f.portion}</span>
              </span>
              <span className="font-mono text-xs text-secondary">{f.kcal} kcal</span>
              <span className="text-lg text-primary-2">+</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ManualMode({ onAdd }: { onAdd: (f: FoodItem) => void }) {
  const [f, setF] = useState({ name: "", kcal: "", p: "", c: "", g: "" });
  const n = (s: string) => Math.max(0, parseFloat(s.replace(",", ".")) || 0);
  const ok = f.name.trim() && n(f.kcal) > 0;
  const field = "w-full rounded-xl border border-line bg-bg/50 px-3 py-2.5 text-sm placeholder:text-muted/70 focus:border-primary focus:outline-none";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        onAdd({ name: f.name.trim(), portion: "porción", kcal: n(f.kcal), p: n(f.p), c: n(f.c), g: n(f.g) });
        setF({ name: "", kcal: "", p: "", c: "", g: "" });
      }}
    >
      <div className="grid grid-cols-[1fr_6rem] gap-2">
        <input className={field} placeholder="¿Qué fue?" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className={field} placeholder="kcal" inputMode="decimal" value={f.kcal} onChange={(e) => setF({ ...f, kcal: e.target.value })} />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <input className={field} placeholder="Proteína g" inputMode="decimal" value={f.p} onChange={(e) => setF({ ...f, p: e.target.value })} />
        <input className={field} placeholder="Carbos g" inputMode="decimal" value={f.c} onChange={(e) => setF({ ...f, c: e.target.value })} />
        <input className={field} placeholder="Grasa g" inputMode="decimal" value={f.g} onChange={(e) => setF({ ...f, g: e.target.value })} />
      </div>
      <p className="mt-2 text-xs text-muted">Sirve para lo que trae etiqueta nutricional: copia los valores de la porción que comiste.</p>
      <button type="submit" disabled={!ok} className="mt-3 w-full rounded-2xl border border-primary/50 py-3 text-sm font-semibold text-primary-2 disabled:opacity-40">
        Agregar
      </button>
    </form>
  );
}

export function KeySetup({ onSaved }: { onSaved: () => void }) {
  const [key, setKey] = useState("");
  return (
    <div className="rounded-2xl border border-line bg-bg/40 p-4">
      <p className="font-semibold">Para fotos y descripciones necesitas una clave de IA</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        La app usa Claude para estimar porciones y calorías. Crea una clave en <span className="text-fg">console.anthropic.com</span> → API Keys y pégala aquí. Se
        guarda solo en este teléfono. Cada estimación cuesta unos centavos de dólar.
      </p>
      <p className="mt-1 text-xs text-muted">Mientras tanto, «Buscar» y «Manual» funcionan sin clave.</p>
      <div className="mt-3 flex gap-2">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-line bg-bg/60 px-3 py-2.5 font-mono text-sm focus:border-primary focus:outline-none"
        />
        <button
          onClick={() => {
            try {
              localStorage.setItem(AI_KEY_STORAGE, key.trim());
              onSaved();
            } catch {
              /* sin almacenamiento */
            }
          }}
          disabled={!key.trim().startsWith("sk-ant-")}
          className="rounded-xl bg-primary px-4 text-sm font-bold text-bg disabled:bg-fg/10 disabled:text-muted"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

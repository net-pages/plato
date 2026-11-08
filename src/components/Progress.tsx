import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { dateKey, usePersisted } from "../store";
import CountUp from "./rb/CountUp";
import ClickSpark from "./rb/ClickSpark";
import { Title } from "./Views";

export interface WeighIn {
  date: string; // YYYY-MM-DD
  kg: number;
}

const parse = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
};
const short = (d: string) => parse(d).toLocaleDateString("es-CO", { day: "numeric", month: "short" }).replace(".", "");

export default function Progress() {
  const [log, setLog] = usePersisted<WeighIn[]>("plato.weight", []);
  const today = dateKey(new Date());
  const sorted = useMemo(() => [...log].sort((a, b) => a.date.localeCompare(b.date)), [log]);
  const last = sorted.at(-1);
  const first = sorted[0];

  const [kg, setKg] = useState(() => (last ? String(last.kg) : ""));
  const [date, setDate] = useState(today);
  const [showTable, setShowTable] = useState(false);

  const add = (entry: WeighIn) => setLog((l) => [...l.filter((x) => x.date !== entry.date), entry]);
  const remove = (d: string) => setLog((l) => l.filter((x) => x.date !== d));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(kg.replace(",", "."));
    if (!Number.isFinite(v) || v < 30 || v > 250 || !date) return;
    add({ date, kg: Math.round(v * 10) / 10 });
  };

  const delta = last && first && sorted.length > 1 ? Math.round((last.kg - first.kg) * 10) / 10 : null;
  const days = last && first ? Math.round((parse(last.date).getTime() - parse(first.date).getTime()) / 86_400_000) : 0;
  const weekly = delta !== null && days >= 7 ? Math.round((delta / days) * 7 * 100) / 100 : null;

  return (
    <>
      <Title kicker="Progreso" title="Cada kilo, a su tiempo." sub="Pésate en ayunas, el mismo día de la semana. La tendencia importa más que un número aislado." />

      {/* Número principal */}
      <section className="rounded-[2rem] border border-line bg-paper-2 px-6 py-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">Peso actual</p>
        {last ? (
          <>
            <p className="mt-1 font-display text-7xl leading-none">
              <CountUp key={last.kg} to={Math.trunc(last.kg)} duration={1} trigger="load" />
              <span>,{Math.round((last.kg % 1) * 10)}</span>
              <span className="ml-1 text-3xl text-mute">kg</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute">
              {delta !== null && (
                <span>
                  <span className="font-semibold text-ink">
                    {delta > 0 ? "+" : ""}
                    {delta.toLocaleString("es-CO")} kg
                  </span>{" "}
                  desde {short(first!.date)}
                </span>
              )}
              {weekly !== null && (
                <span>
                  <span className="font-semibold text-ink">
                    {weekly > 0 ? "+" : ""}
                    {weekly.toLocaleString("es-CO")} kg
                  </span>{" "}
                  por semana
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-mute">Aún no hay registros. Agrega el primero abajo.</p>
        )}
      </section>

      {/* Gráfica */}
      {sorted.length >= 2 && (
        <section className="mt-4 rounded-[2rem] border border-line bg-paper-2 px-4 pb-4 pt-5">
          <div className="mb-2 flex items-center justify-between px-2">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">Peso (kg) en el tiempo</h2>
            <button onClick={() => setShowTable((s) => !s)} className="font-mono text-[10px] uppercase tracking-[0.15em] text-olive hover:text-ink">
              {showTable ? "Ver gráfica" : "Ver tabla"}
            </button>
          </div>
          {showTable ? <WeightTable data={sorted} onRemove={remove} /> : <WeightChart data={sorted} />}
        </section>
      )}

      {/* Sugerencia de punto de partida */}
      {sorted.length === 0 && (
        <button
          onClick={() => {
            const start = new Date();
            start.setMonth(start.getMonth() - 2);
            add({ date: dateKey(start), kg: 64 });
            add({ date: today, kg: 68 });
            setKg("68");
          }}
          className="mt-4 w-full rounded-[1.5rem] border border-dashed border-wine/40 px-5 py-4 text-left text-sm text-ink/80 transition hover:border-wine"
        >
          <span className="font-semibold text-wine">Usar mi punto de partida →</span>
          <br />
          64 kg hace 2 meses y 68 kg hoy (lo que me contaste). Puedes editarlo después en la tabla.
        </button>
      )}

      {/* Formulario */}
      <form onSubmit={submit} className="mt-4 rounded-[2rem] border border-line bg-paper-2 px-5 py-5">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mute">Nuevo registro</p>
        <div className="flex gap-2">
          <label className="flex-1">
            <span className="sr-only">Peso en kg</span>
            <div className="flex items-baseline rounded-2xl border border-line bg-paper px-4 py-3 focus-within:border-wine">
              <input
                inputMode="decimal"
                placeholder="68,0"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
                className="w-full min-w-0 bg-transparent font-display text-3xl leading-none text-ink placeholder:text-ink/20 focus:outline-none"
              />
              <span className="font-mono text-xs text-mute">kg</span>
            </div>
          </label>
          <label className="w-[9.5rem] shrink-0">
            <span className="sr-only">Fecha</span>
            <input
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="h-full w-full rounded-2xl border border-line bg-paper px-3 font-mono text-xs text-ink [color-scheme:light] focus:border-wine focus:outline-none"
            />
          </label>
        </div>
        <ClickSpark sparkColor={["#5f6334", "#6e1e2c"]} sparkCount={10} sparkRadius={28} className="mt-3">
          <button type="submit" className="w-full rounded-2xl bg-wine py-3.5 text-sm font-bold text-paper transition hover:brightness-110 active:scale-[0.99]">
            Guardar peso
          </button>
        </ClickSpark>
      </form>
    </>
  );
}

/* ---------- Gráfica de línea (SVG propio) ---------- */

function WeightChart({ data }: { data: WeighIn[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const W = 340, H = 190;
  const pad = { l: 34, r: 14, t: 14, b: 26 };
  const t0 = parse(data[0].date).getTime();
  const t1 = parse(data[data.length - 1].date).getTime();
  const span = Math.max(t1 - t0, 1);
  const kgs = data.map((d) => d.kg);
  const lo = Math.floor(Math.min(...kgs) - 0.5);
  const hi = Math.ceil(Math.max(...kgs) + 0.5);
  const x = (d: string) => pad.l + ((parse(d).getTime() - t0) / span) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);

  const step = Math.max(1, Math.ceil((hi - lo) / 4));
  const ticks: number[] = [];
  for (let v = lo; v <= hi; v += step) ticks.push(v);

  const path = data.map((d, i) => `${i ? "L" : "M"}${x(d.date).toFixed(1)},${y(d.kg).toFixed(1)}`).join(" ");
  const area = `${path} L${x(data[data.length - 1].date).toFixed(1)},${H - pad.b} L${x(data[0].date).toFixed(1)},${H - pad.b} Z`;

  const onMove = (e: React.PointerEvent) => {
    const svg = ref.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    data.forEach((d, i) => Math.abs(x(d.date) - px) < Math.abs(x(data[best].date) - px) && (best = i));
    setHover(best);
  };

  const h = hover !== null ? data[hover] : null;
  const showDotLabels = data.length <= 8;

  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        role="img"
        aria-label={`Peso de ${data[0].kg} kg el ${short(data[0].date)} a ${data[data.length - 1].kg} kg el ${short(data[data.length - 1].date)}`}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="wfill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6e1e2c" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6e1e2c" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* rejilla y eje y (recesivos) */}
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#2a1d20" strokeOpacity="0.08" />
            <text x={pad.l - 8} y={y(v)} dy="0.32em" textAnchor="end" className="fill-mute font-mono text-[9px]">
              {v}
            </text>
          </g>
        ))}
        {/* eje x: primera y última fecha */}
        <text x={x(data[0].date)} y={H - 6} textAnchor="start" className="fill-mute font-mono text-[9px]">
          {short(data[0].date)}
        </text>
        <text x={x(data[data.length - 1].date)} y={H - 6} textAnchor="end" className="fill-mute font-mono text-[9px]">
          {short(data[data.length - 1].date)}
        </text>

        <motion.path d={area} fill="url(#wfill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} />
        <motion.path
          d={path}
          fill="none"
          stroke="#6e1e2c"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        />

        {/* crosshair */}
        {h && <line x1={x(h.date)} x2={x(h.date)} y1={pad.t} y2={H - pad.b} stroke="#2a1d20" strokeOpacity="0.3" strokeDasharray="3 3" />}

        {data.map((d, i) => (
          <circle
            key={d.date}
            cx={x(d.date)}
            cy={y(d.kg)}
            r={hover === i ? 6 : showDotLabels || i === data.length - 1 ? 4 : 0}
            fill="#6e1e2c"
            stroke="#fbf8f3"
            strokeWidth={2}
          />
        ))}
        {/* etiqueta directa solo en el último punto */}
        {!h && (
          <text x={x(data[data.length - 1].date) - 8} y={y(data[data.length - 1].kg) - 10} textAnchor="end" className="fill-ink font-mono text-[10px] font-semibold">
            {data[data.length - 1].kg} kg
          </text>
        )}
      </svg>

      <AnimatePresence>
        {h && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute top-0 rounded-xl border border-line bg-paper px-3 py-2 shadow-xl"
            style={{
              left: `${(x(h.date) / W) * 100}%`,
              transform: `translateX(${x(h.date) / W > 0.6 ? "-105%" : "5%"})`,
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">{short(h.date)}</p>
            <p className="font-display text-2xl leading-none text-ink">{h.kg.toLocaleString("es-CO")} kg</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WeightTable({ data, onRemove }: { data: WeighIn[]; onRemove: (d: string) => void }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left font-mono text-[10px] uppercase tracking-[0.15em] text-mute">
          <th className="px-2 py-2 font-normal">Fecha</th>
          <th className="px-2 py-2 text-right font-normal">Peso</th>
          <th className="px-2 py-2 text-right font-normal">Cambio</th>
          <th className="w-8" />
        </tr>
      </thead>
      <tbody>
        {[...data].reverse().map((d, i, arr) => {
          const prev = arr[i + 1];
          const diff = prev ? Math.round((d.kg - prev.kg) * 10) / 10 : null;
          return (
            <tr key={d.date} className="border-t border-line">
              <td className="px-2 py-2.5">{short(d.date)}</td>
              <td className="px-2 py-2.5 text-right font-mono">{d.kg.toLocaleString("es-CO")} kg</td>
              <td className="px-2 py-2.5 text-right font-mono text-mute">{diff === null ? "—" : `${diff > 0 ? "+" : ""}${diff.toLocaleString("es-CO")}`}</td>
              <td className="px-1 text-right">
                <button onClick={() => onRemove(d.date)} aria-label={`Borrar registro del ${short(d.date)}`} className="px-1 text-mute hover:text-wine">
                  ×
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

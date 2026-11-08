import { useState } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { downloadICS, notifySupported } from "../reminders";
import { AI_KEY_STORAGE, getKey } from "../ai";
import { KeySetup } from "./LogSheet";
import { KCAL_REQUIREMENT } from "../data";
import { MEALS } from "../data";
import { DEFAULT_TIMES, type Goals, type Times } from "../store";

interface Props {
  open: boolean;
  onClose: () => void;
  times: Times;
  setTimes: (t: Times) => void;
  goals: Goals;
  setGoals: (g: Goals) => void;
  notify: boolean;
  setNotify: (v: boolean) => void;
}

export default function SettingsSheet({ open, onClose, times, setTimes, notify, setNotify, goals, setGoals }: Props) {
  const [key, setKey] = useState(() => getKey());
  const [msg, setMsg] = useState<string | null>(null);
  const drag = useDragControls();
  const denied = notifySupported() && Notification.permission === "denied";

  const toggleNotify = async () => {
    if (notify) return setNotify(false);
    if (!notifySupported()) return setMsg("Tu navegador no soporta avisos. En iPhone, primero instala la app en la pantalla de inicio.");
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotify(true);
      setMsg(null);
    } else setMsg("Permiso denegado. Actívalo en los ajustes del navegador para esta página.");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Horarios y recordatorios"
            className="pb-safe fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92dvh] max-w-xl overflow-y-auto rounded-t-[2rem] border border-line bg-surface px-6 pt-3 shadow-[0_-12px_40px_-20px_rgb(0_0_0/0.6)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => info.offset.y > 100 && onClose()}
          >
            <div onPointerDown={(e) => drag.start(e)} className="-mx-6 -mt-3 mb-2 flex cursor-grab touch-none justify-center pb-3 pt-3">
              <div className="h-1 w-10 rounded-full bg-fg/20" />
            </div>
            <h2 className="font-display text-4xl italic">Tu reloj de comidas</h2>
            <p className="mt-1 text-sm text-muted">Ajústalo a tu jornada y a la hora del gym. La carta se reordena sola.</p>
            <ul className="mt-5 divide-y divide-line">
              {MEALS.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3">
                  <label htmlFor={`t-${m.id}`} className="text-[15px] font-semibold">
                    {m.name}
                  </label>
                  <input
                    id={`t-${m.id}`}
                    type="time"
                    value={times[m.id]}
                    onChange={(e) => e.target.value && setTimes({ ...times, [m.id]: e.target.value })}
                    className="rounded-xl border border-line bg-bg px-3 py-2 font-mono text-sm text-fg [color-scheme:dark] focus:border-primary focus:outline-none"
                  />
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-display text-3xl italic">Metas del día</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="rounded-2xl border border-line bg-bg px-4 py-3">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Calorías</span>
                <span className="flex items-baseline gap-1">
                  <input
                    inputMode="numeric"
                    value={goals.kcal || ""}
                    onChange={(e) => setGoals({ ...goals, kcal: Math.min(6000, parseInt(e.target.value.replace(/\D/g, "")) || 0) })}
                    className="w-full min-w-0 bg-transparent font-display text-3xl focus:outline-none"
                  />
                  <span className="text-xs text-muted">kcal</span>
                </span>
              </label>
              <label className="rounded-2xl border border-line bg-bg px-4 py-3">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Agua</span>
                <span className="flex items-baseline gap-1">
                  <input
                    inputMode="numeric"
                    value={goals.water || ""}
                    onChange={(e) => setGoals({ ...goals, water: Math.min(6000, parseInt(e.target.value.replace(/\D/g, "")) || 0) })}
                    className="w-full min-w-0 bg-transparent font-display text-3xl focus:outline-none"
                  />
                  <span className="text-xs text-muted">ml</span>
                </span>
              </label>
            </div>
            <p className="mt-2 px-1 text-[11px] leading-snug text-muted/80">
              Tu plan indica un requerimiento de {KCAL_REQUIREMENT.toLocaleString("es-CO")} kcal. Si Ana María te da otra meta, cámbiala aquí.
            </p>

            <h3 className="mt-6 font-display text-3xl italic">Calorías con IA</h3>
            <div className="mt-3">
              {key ? (
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-bg px-4 py-3.5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold">Clave guardada</span>
                    <span className="block truncate font-mono text-xs text-muted">{key.slice(0, 10)}…{key.slice(-4)} · solo en este teléfono</span>
                  </span>
                  <button
                    onClick={() => {
                      try {
                        localStorage.removeItem(AI_KEY_STORAGE);
                      } catch {
                        /* sin almacenamiento */
                      }
                      setKey("");
                    }}
                    className="rounded-xl border border-line px-3 py-2 text-xs font-semibold text-muted hover:text-fg"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <KeySetup onSaved={() => setKey(getKey())} />
              )}
            </div>

            <h3 className="mt-6 font-display text-3xl italic">Recordatorios</h3>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => downloadICS(times)}
                className="flex w-full items-center gap-4 rounded-2xl border border-line bg-bg px-4 py-3.5 text-left transition hover:border-primary/60"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-lg">📅</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">Añadir a mi calendario</span>
                  <span className="block text-xs leading-snug text-muted">
                    35 eventos semanales con alarma, cada uno con el plato de ese día. Funciona aunque la app esté cerrada.
                  </span>
                </span>
              </button>
              <button
                onClick={toggleNotify}
                role="switch"
                aria-checked={notify}
                disabled={denied}
                className="flex w-full items-center gap-4 rounded-2xl border border-line bg-bg px-4 py-3.5 text-left disabled:opacity-50"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary/15 text-lg">🔔</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">Avisos de la app</span>
                  <span className="block text-xs leading-snug text-muted">Notificación a la hora de cada comida mientras la app esté abierta o en segundo plano.</span>
                </span>
                <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${notify ? "bg-primary" : "bg-fg/15"}`}>
                  <motion.span layout className={`absolute top-1 h-5 w-5 rounded-full bg-fg ${notify ? "right-1" : "left-1"}`} transition={{ type: "spring", bounce: 0.3, duration: 0.35 }} />
                </span>
              </button>
              {(msg || denied) && <p className="px-1 text-xs text-secondary">{msg ?? "Los avisos están bloqueados en este navegador."}</p>}
              <p className="px-1 text-[11px] leading-snug text-muted/80">
                Si cambias los horarios, vuelve a añadirlos al calendario. En iPhone, abre el archivo desde Safari.
              </p>
            </div>

            <div className="mt-5 mb-4 flex gap-2">
              <button onClick={() => setTimes(DEFAULT_TIMES)} className="flex-1 rounded-2xl border border-line py-3 text-sm font-semibold text-muted hover:text-fg">
                Restablecer
              </button>
              <button onClick={onClose} className="flex-1 rounded-2xl bg-primary py-3 text-sm font-bold text-bg">
                Listo
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

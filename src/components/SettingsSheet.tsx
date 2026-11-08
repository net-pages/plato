import { useState } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { downloadICS, notifySupported } from "../reminders";
import { MEALS } from "../data";
import { DEFAULT_TIMES, type Times } from "../store";

interface Props {
  open: boolean;
  onClose: () => void;
  times: Times;
  setTimes: (t: Times) => void;
  notify: boolean;
  setNotify: (v: boolean) => void;
}

export default function SettingsSheet({ open, onClose, times, setTimes, notify, setNotify }: Props) {
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
            className="fixed inset-0 z-50 bg-ink/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Horarios y recordatorios"
            className="pb-safe fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92dvh] max-w-xl overflow-y-auto rounded-t-[2rem] border border-line bg-paper-2 px-6 pt-3 shadow-[0_-12px_40px_-20px_rgb(42_29_32/0.35)]"
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
              <div className="h-1 w-10 rounded-full bg-ink/20" />
            </div>
            <h2 className="font-display text-4xl italic">Tus horarios</h2>
            <p className="mt-1 text-sm text-mute">Ajústalos a tu rutina y a la hora en que vas al gym.</p>
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
                    className="rounded-xl border border-line bg-paper px-3 py-2 font-mono text-sm text-ink [color-scheme:light] focus:border-wine focus:outline-none"
                  />
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-display text-3xl italic">Recordatorios</h3>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => downloadICS(times)}
                className="flex w-full items-center gap-4 rounded-2xl border border-line bg-paper px-4 py-3.5 text-left transition hover:border-wine/60"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-wine/15 text-lg">📅</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">Añadir a mi calendario</span>
                  <span className="block text-xs leading-snug text-mute">
                    35 eventos semanales con alarma, cada uno con el plato de ese día. Funciona aunque la app esté cerrada.
                  </span>
                </span>
              </button>
              <button
                onClick={toggleNotify}
                role="switch"
                aria-checked={notify}
                disabled={denied}
                className="flex w-full items-center gap-4 rounded-2xl border border-line bg-paper px-4 py-3.5 text-left disabled:opacity-50"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-olive/15 text-lg">🔔</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">Avisos de la app</span>
                  <span className="block text-xs leading-snug text-mute">Notificación a la hora de cada comida mientras la app esté abierta o en segundo plano.</span>
                </span>
                <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${notify ? "bg-wine" : "bg-ink/15"}`}>
                  <motion.span layout className={`absolute top-1 h-5 w-5 rounded-full bg-ink ${notify ? "right-1" : "left-1"}`} transition={{ type: "spring", bounce: 0.3, duration: 0.35 }} />
                </span>
              </button>
              {(msg || denied) && <p className="px-1 text-xs text-olive">{msg ?? "Los avisos están bloqueados en este navegador."}</p>}
              <p className="px-1 text-[11px] leading-snug text-mute/80">
                Si cambias los horarios, vuelve a añadirlos al calendario. En iPhone, abre el archivo desde Safari.
              </p>
            </div>

            <div className="mt-5 mb-4 flex gap-2">
              <button onClick={() => setTimes(DEFAULT_TIMES)} className="flex-1 rounded-2xl border border-line py-3 text-sm font-semibold text-mute hover:text-ink">
                Restablecer
              </button>
              <button onClick={onClose} className="flex-1 rounded-2xl bg-wine py-3 text-sm font-bold text-paper">
                Listo
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

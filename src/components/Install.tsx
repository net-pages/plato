import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import qrcode from "qrcode-generator";

type Platform = "ios" | "android" | "desktop";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// El evento de Android llega temprano: lo guardamos apenas carga el módulo.
let deferred: BIPEvent | null = null;
const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BIPEvent;
    listeners.forEach((l) => l());
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    listeners.forEach((l) => l());
  });
}

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || iPadOS) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

export const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

const inAppBrowser = () => /Instagram|FBAN|FBAV|Line|WhatsApp|GSA\//.test(navigator.userAgent);
const iosNotSafari = () => /CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);

function useDeferredPrompt() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => void listeners.delete(l);
  }, []);
  return deferred;
}

/* ---------- Banner en la pantalla de Hoy ---------- */

export function InstallBanner({ onOpen }: { onOpen: () => void }) {
  const [hidden, setHidden] = useState(() => {
    try {
      return isStandalone() || localStorage.getItem("plato.install.dismissed") === "1";
    } catch {
      return isStandalone();
    }
  });
  if (hidden) return null;
  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem("plato.install.dismissed", "1");
    } catch {
      /* sin almacenamiento */
    }
  };
  return (
    <div className="rise mt-4 flex items-center gap-3 rounded-3xl border border-secondary/25 bg-surface/70 py-3 pl-4 pr-2">
      <img src={`${import.meta.env.BASE_URL}icon-192.png`} alt="" className="h-10 w-10 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Llévala en el bolsillo</p>
        <p className="text-xs text-muted">Con ícono propio y sin internet.</p>
      </div>
      <button onClick={onOpen} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-bg">
        Instalar
      </button>
      <button onClick={dismiss} aria-label="No mostrar más" className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-fg">
        ×
      </button>
    </div>
  );
}

/* ---------- Hoja con los pasos ---------- */

const ShareGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline -mt-1">
    <path d="M12 3v12M8 7l4-4 4 4" />
    <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
  </svg>
);

const STEPS: Record<"ios" | "android", { title: ReactNode; body: ReactNode }[]> = {
  ios: [
    { title: "Ábrela en Safari", body: "Si llegaste desde Instagram, WhatsApp o Chrome, copia el link y pégalo en Safari." },
    { title: <>Toca Compartir <ShareGlyph /></>, body: "Es el cuadrito con la flecha hacia arriba, en la barra de abajo (o arriba en iPad)." },
    { title: "«Agregar a inicio»", body: "Desliza la lista hacia abajo hasta encontrarlo. Si no aparece, toca «Editar acciones» y agrégalo." },
    { title: "Toca «Agregar»", body: "Arriba a la derecha. El ícono de las aceitunas queda en tu pantalla de inicio." },
  ],
  android: [
    { title: "Ábrela en Chrome", body: "Si llegaste desde Instagram o WhatsApp, toca ⋮ y elige «Abrir en Chrome»." },
    { title: "Toca el menú ⋮", body: "Los tres puntos, arriba a la derecha." },
    { title: "«Instalar app»", body: "En algunos teléfonos dice «Agregar a la pantalla principal»." },
    { title: "Confirma", body: "Toca «Instalar». La encuentras con tus otras apps." },
  ],
};

export function InstallSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const platform = useMemo(() => (typeof navigator !== "undefined" ? detectPlatform() : "desktop"), []);
  const [tab, setTab] = useState<"ios" | "android">(platform === "android" ? "android" : "ios");
  const prompt = useDeferredPrompt();
  const drag = useDragControls();
  const url = typeof location !== "undefined" ? location.origin + import.meta.env.BASE_URL : "";
  const [copied, setCopied] = useState(false);

  const qr = useMemo(() => {
    const q = qrcode(0, "M");
    q.addData(url);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }, [url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sin portapapeles */
    }
  };

  const warn =
    platform === "ios" && (inAppBrowser() || iosNotSafari())
      ? "Estás en un navegador que no puede instalarla. Copia el link y ábrelo en Safari."
      : platform === "android" && inAppBrowser()
        ? "Estás dentro de otra app. Ábrela en Chrome para poder instalarla."
        : null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Instalar en el celular"
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

            <h2 className="font-display text-4xl italic">A tu pantalla de inicio</h2>
            <p className="mt-1 text-sm text-muted">No pasa por la App Store: se instala desde el navegador en un minuto.</p>

            {/* Computador: QR para abrirla en el celular */}
            {platform === "desktop" && (
              <div className="mt-5 flex items-center gap-4 rounded-3xl border border-line bg-bg/50 p-4">
                <div className="w-28 shrink-0 overflow-hidden rounded-xl bg-[#ede3d3] p-1.5" dangerouslySetInnerHTML={{ __html: qr }} />
                <div className="min-w-0 text-sm">
                  <p className="font-semibold">Estás en el computador.</p>
                  <p className="mt-1 text-muted">Escanea el código con la cámara del celular y sigue los pasos de abajo desde allá.</p>
                </div>
              </div>
            )}

            {warn && <p className="mt-4 rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary-2">{warn}</p>}

            {/* Android con instalación directa */}
            {prompt && platform !== "ios" && (
              <button
                onClick={async () => {
                  await prompt.prompt();
                  await prompt.userChoice;
                  onClose();
                }}
                className="mt-5 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-bg"
              >
                Instalar ahora
              </button>
            )}

            <div className="mt-5 inline-flex rounded-full border border-line bg-bg/50 p-1">
              {(
                [
                  ["ios", "iPhone"],
                  ["android", "Android"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  aria-pressed={tab === id}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition ${tab === id ? "text-bg" : "text-muted hover:text-fg"}`}
                >
                  {tab === id && <motion.span layoutId="install-pill" className="absolute inset-0 rounded-full bg-secondary" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />}
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>

            <ol className="mt-4 space-y-4">
              {STEPS[tab].map((s, i) => (
                <motion.li key={`${tab}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex gap-4">
                  <span className="font-display text-3xl italic leading-none text-secondary">{i + 1}</span>
                  <span>
                    <span className="block text-[15px] font-semibold">{s.title}</span>
                    <span className="block text-sm leading-relaxed text-muted">{s.body}</span>
                  </span>
                </motion.li>
              ))}
            </ol>

            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-line bg-bg/50 py-2 pl-4 pr-2">
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted">{url}</span>
              <button onClick={copy} className="rounded-xl border border-line px-3 py-2 text-xs font-semibold hover:border-secondary">
                {copied ? "Copiado ✓" : "Copiar link"}
              </button>
            </div>

            <button onClick={onClose} className="mt-4 mb-4 w-full rounded-2xl bg-fg/10 py-3 text-sm font-semibold">
              Entendido
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

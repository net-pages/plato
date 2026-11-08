import type { ReactNode } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";

/** Hoja inferior: se arrastra solo desde la manija para no chocar con el scroll interno. */
export default function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const drag = useDragControls();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="pb-safe fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[94dvh] max-w-xl overflow-y-auto overscroll-contain rounded-t-[2rem] border border-line bg-surface px-5 pt-3 shadow-[0_-12px_40px_-20px_rgb(0_0_0/0.6)]"
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
            <div onPointerDown={(e) => drag.start(e)} className="-mx-5 -mt-3 mb-1 flex cursor-grab touch-none justify-center pb-3 pt-3">
              <div className="h-1 w-10 rounded-full bg-fg/20" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

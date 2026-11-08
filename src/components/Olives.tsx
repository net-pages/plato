import { useId } from "react";

/** Brocheta de tres aceitunas, pintada en SVG (ilustración original). */
export function OliveSkewer({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const olives = [
    { cy: 150, rot: -8, hole: "left" },
    { cy: 262, rot: 3, hole: "left" },
    { cy: 372, rot: -2, hole: "right" },
  ] as const;

  return (
    <svg viewBox="0 0 200 560" className={className} aria-hidden="true">
      <defs>
        {/* bordes de pincel */}
        <filter id={`brush-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* trazos internos de la pintura */}
        <filter id={`strokes-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.11" numOctaves="2" seed="11" />
          <feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0 0.45  0 0 0 0.9 -0.32" />
        </filter>
        <filter id={`soft-${id}`}>
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <filter id={`shadow-${id}`}>
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <radialGradient id={`body-${id}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#7f9446" />
          <stop offset="38%" stopColor="#47621f" />
          <stop offset="78%" stopColor="#263b10" />
          <stop offset="100%" stopColor="#16220a" />
        </radialGradient>
        <linearGradient id={`wood-${id}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#a8875f" />
          <stop offset="45%" stopColor="#e3cfb0" />
          <stop offset="100%" stopColor="#9b7a55" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <ellipse cx="0" cy="0" rx="64" ry="47" />
        </clipPath>
      </defs>

      {/* palillo */}
      <g filter={`url(#brush-${id})`}>
        <path d="M100 20 L103.5 70 L104 560 L96 560 L96.5 70 Z" fill={`url(#wood-${id})`} />
      </g>

      {olives.map((o, i) => (
        <g key={i} transform={`translate(100 ${o.cy}) rotate(${o.rot})`}>
          {/* sombra suave sobre la siguiente */}
          <ellipse cx="6" cy="44" rx="56" ry="10" fill="#0b0405" opacity="0.45" filter={`url(#shadow-${id})`} />
          <g filter={`url(#brush-${id})`}>
            <ellipse cx="0" cy="0" rx="64" ry="47" fill={`url(#body-${id})`} />
            <g clipPath={`url(#clip-${id})`}>
              <rect x="-70" y="-50" width="140" height="100" filter={`url(#strokes-${id})`} opacity="0.22" />
              {/* reflejo vino del fondo en el borde inferior */}
              <ellipse cx="18" cy="40" rx="50" ry="16" fill="#6b2a33" opacity="0.28" filter={`url(#soft-${id})`} />
            </g>
            {/* hueco del deshuesado */}
            <ellipse
              cx={o.hole === "left" ? -50 : 50}
              cy="-2"
              rx="11"
              ry="17"
              fill="#121a07"
              opacity="0.85"
            />
            <ellipse cx={o.hole === "left" ? -47 : 47} cy="4" rx="5" ry="8" fill="#9db06a" opacity="0.35" filter={`url(#soft-${id})`} />
          </g>
          {/* brillos */}
          <ellipse cx="-16" cy="-20" rx="13" ry="8" fill="#eef2d6" opacity="0.75" filter={`url(#soft-${id})`} transform="rotate(-18)" />
          <ellipse cx="22" cy="-28" rx="16" ry="4" fill="#dfe7bd" opacity="0.35" filter={`url(#soft-${id})`} />
        </g>
      ))}
    </svg>
  );
}

/** Una sola aceituna, para marcar comidas cumplidas. */
export function Olive({ size = 22 }: { size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <radialGradient id={`o-${id}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#8fa452" />
          <stop offset="45%" stopColor="#4a6620" />
          <stop offset="100%" stopColor="#1c2a0c" />
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="20" rx="17" ry="13" fill={`url(#o-${id})`} transform="rotate(-10 20 20)" />
      <ellipse cx="7.5" cy="21" rx="3" ry="4.5" fill="#121a07" opacity="0.8" transform="rotate(-10 20 20)" />
      <ellipse cx="15" cy="14" rx="4" ry="2.2" fill="#eef2d6" opacity="0.8" transform="rotate(-20 15 14)" />
    </svg>
  );
}

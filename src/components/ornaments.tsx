export function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M3 45 C3 18 18 3 45 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 45 C9 24 24 9 45 9" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
      <path d="M3 45 c0-7 5.5-9 7.5-5.5 c1.8 3-1.6 6.4-4.4 4.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M45 3 c-7 0-9 5.5-5.5 7.5 c3 1.8 6.4-1.6 4.6-4.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.7" fill="currentColor" />
    </svg>
  );
}

export function Corners({ className = "text-gilt/60" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <Flourish className="absolute left-1.5 top-1.5 h-7 w-7" />
      <Flourish className="absolute right-1.5 top-1.5 h-7 w-7 rotate-90" />
      <Flourish className="absolute bottom-1.5 right-1.5 h-7 w-7 rotate-180" />
      <Flourish className="absolute bottom-1.5 left-1.5 h-7 w-7 -rotate-90" />
    </div>
  );
}

export function Divider({ glyph = "❦", className = "" }: { glyph?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-gilt ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gilt/60 to-gilt/60" />
      <span className="text-sm leading-none">{glyph}</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gilt/60 to-gilt/60" />
    </div>
  );
}

export function WaxSeal({ letter = "S", size = 44, className = "" }: { letter?: string; size?: number; className?: string }) {
  return (
    <div
      className={`anim-seal flex items-center justify-center text-parchlight ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "47% 53% 50% 50% / 52% 48% 54% 46%",
        background: "radial-gradient(circle at 32% 28%, #b03a37 0%, #8f1d21 48%, #5d0d11 100%)",
        boxShadow: "inset 0 2px 3px rgba(255,200,150,.4), inset 0 -4px 8px rgba(50,3,5,.7), 0 3px 10px rgba(0,0,0,.45)",
        fontFamily: "var(--font-black)",
        fontSize: size * 0.5,
        textShadow: "0 1px 2px rgba(50,3,5,.8)",
      }}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
}

export function QuillBadge({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 32% 28%, #e8bf5e, #b8892f 60%, #7a571a)",
        boxShadow: "inset 0 1px 2px rgba(255,240,200,.7), inset 0 -3px 6px rgba(80,50,8,.6), 0 2px 6px rgba(0,0,0,.35)",
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} fill="none" stroke="#3a2506" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
      </svg>
    </div>
  );
}

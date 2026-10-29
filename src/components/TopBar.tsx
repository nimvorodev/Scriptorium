import { BookOpenText, CircleHelp, PenLine, ScrollText, Settings2 } from "lucide-react";

interface Props {
  projectName: string;
  onRename: (name: string) => void;
  scribeLabel: string;
  isDemo: boolean;
  generating: boolean;
  onOpenSpells: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  onNewScroll: () => void;
}

export default function TopBar(p: Props) {
  return (
    <header className="relative z-20 flex items-center gap-3 border-b border-gilt/40 bg-gradient-to-b from-[#2b1a0b]/90 to-[#1c1006]/90 px-3 py-2 shadow-[0_6px_24px_rgba(0,0,0,0.55)] sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="gold-emboss whitespace-nowrap text-[26px] leading-none sm:text-[30px]" style={{ fontFamily: "var(--font-black)" }}>
          Scriptorium
        </h1>
        <div className="hidden flex-col border-l border-gilt/30 pl-3 md:flex">
          <span className="smallcaps text-[10px] text-giltbright/90">Vibe-coding atelier</span>
          <span className="text-[12px] italic leading-tight text-parch/60">plain words → working code</span>
        </div>
      </div>

      <div className="mx-auto hidden min-w-0 max-w-xs flex-1 items-center gap-2 sm:flex">
        <PenLine size={14} className="shrink-0 text-gilt/80" />
        <input
          value={p.projectName}
          onChange={(e) => p.onRename(e.target.value)}
          aria-label="Scroll name"
          className="w-full truncate border-b border-transparent bg-transparent text-center font-body text-[16px] italic text-parch/90 outline-none transition-colors focus:border-gilt/60"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={p.onOpenSettings}
          title="Thy current scribe — click to change provider or model"
          className="dark-btn hidden items-center gap-2 rounded-full px-3 py-1.5 text-[10px] md:flex"
        >
          <span
            className={`h-2 w-2 rounded-full ${p.generating ? "anim-glow bg-giltbright" : p.isDemo ? "bg-giltbright" : "bg-emerald-400"}`}
          />
          <span className="max-w-[180px] truncate normal-case tracking-normal" style={{ fontFamily: "var(--font-body)", fontSize: 13, letterSpacing: 0 }}>
            {p.scribeLabel}
          </span>
        </button>

        <button onClick={p.onOpenSpells} title="Book of Incantations — ready-made wishes" className="dark-btn flex items-center gap-2 rounded-md px-2.5 py-2 text-[10px]">
          <BookOpenText size={15} /> <span className="hidden xl:inline">Incantations</span>
        </button>
        <button onClick={p.onOpenGuide} title="The Apprentice's Guide — how vibe coding works" className="dark-btn flex items-center gap-2 rounded-md px-2.5 py-2 text-[10px]">
          <CircleHelp size={15} /> <span className="hidden xl:inline">Guide</span>
        </button>
        <button onClick={p.onNewScroll} title="Begin a new scroll (clears this project)" className="dark-btn flex items-center gap-2 rounded-md px-2.5 py-2 text-[10px]">
          <ScrollText size={15} /> <span className="hidden xl:inline">New</span>
        </button>
        <button onClick={p.onOpenSettings} title="Bind Scribe — choose AI provider, endpoint & model" className="wax-btn flex items-center gap-2 rounded-md px-3 py-2 text-[10px]">
          <Settings2 size={15} /> <span className="hidden sm:inline">Bind Scribe</span>
        </button>
      </div>
    </header>
  );
}
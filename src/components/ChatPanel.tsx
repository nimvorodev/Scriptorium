import { useEffect, useRef } from "react";
import { AlertTriangle, BookOpenText, Code2, Eye, Feather, Hand, Sparkles } from "lucide-react";
import type { ChatMsg, Folio } from "../lib/types";
import { fmtTime, roman } from "../lib/types";
import { REFINE_CHIPS, STARTER_CHIPS } from "../lib/spells";
import { Corners, Divider, QuillBadge } from "./ornaments";
import emblem from "../assets/emblem.jpg";

interface Props {
  messages: ChatMsg[];
  folioById: (id: string) => Folio | undefined;
  generating: boolean;
  draft: string;
  setDraft: (s: string) => void;
  onSend: (text: string) => void;
  onHalt: () => void;
  onOpenSpells: () => void;
  onOpenSettings: () => void;
  onBehold: (id: string) => void;
  onShowScript: (id: string) => void;
  onRetryDemo: () => void;
  isDemo: boolean;
  hasFolio: boolean;
}

export default function ChatPanel(p: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [p.messages, p.generating]);

  const send = () => {
    const t = p.draft.trim();
    if (!t || p.generating) return;
    p.onSend(t);
  };

  return (
    <section className="parchment panel-edge relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg">
      <Corners />
      <header className="relative flex items-center gap-2.5 border-b border-ink/15 px-4 pb-2.5 pt-3.5">
        <QuillBadge size={30} />
        <div>
          <h2 className="smallcaps text-[13px] font-semibold text-ink">The Petition</h2>
          <p className="text-[12.5px] italic leading-tight text-inksoft">plain words become working code</p>
        </div>
        <button
          onClick={p.onOpenSpells}
          className="chip ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px]"
          title="Browse ready-made wishes"
        >
          <BookOpenText size={13} /> Incantations
        </button>
      </header>

      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {p.messages.length === 0 ? (
          <div className="anim-fadeup flex h-full flex-col items-center justify-center text-center">
            <img src={emblem} alt="Illuminated quill emblem" className="mb-3 h-32 w-32 rounded-full object-cover mix-blend-multiply" style={{ maskImage: "radial-gradient(circle, black 62%, transparent 72%)", WebkitMaskImage: "radial-gradient(circle, black 62%, transparent 72%)" }} />
            <h3 className="font-display text-[20px] font-semibold text-ink">Speak thy first incantation</h3>
            <p className="mt-2 max-w-[300px] text-[15px] leading-relaxed text-inksoft">
              Describe any page or little app in everyday words. The Scribe writes the code — <em>thou needst none</em>.
            </p>
            <Divider className="my-4 w-48" />
            <div className="flex flex-col gap-2">
              {STARTER_CHIPS.map((c) => (
                <button key={c.label} onClick={() => p.onSend(c.prompt)} className="chip rounded-full px-4 py-2 text-[14px]">
                  {c.label}
                </button>
              ))}
            </div>
            <button onClick={p.onOpenSpells} className="mt-4 text-[13px] italic text-wax underline decoration-wax/40 underline-offset-4 transition-colors hover:decoration-wax">
              …or browse the Book of Incantations
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {p.messages.map((m) => (
              <Bubble key={m.id} m={m} p={p} />
            ))}
          </div>
        )}
      </div>

      <footer className="relative border-t border-ink/15 px-3.5 pb-3.5 pt-2.5">
        {p.hasFolio && !p.generating && (
          <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {REFINE_CHIPS.map((c) => (
              <button key={c.label} onClick={() => p.onSend(c.prompt)} className="chip shrink-0 rounded-full px-3 py-1 text-[12px]" title={c.prompt}>
                {c.label}
              </button>
            ))}
          </div>
        )}
        <div className="mb-1.5 flex items-baseline justify-between px-0.5">
          <label htmlFor="petition" className="smallcaps text-[10px] text-inksoft">Thy petition</label>
          <span className="text-[11px] italic text-inkfaint">↵ send · Shift+↵ new line</span>
        </div>
        <textarea
          id="petition"
          ref={inputRef}
          value={p.draft}
          disabled={p.generating}
          onChange={(e) => {
            p.setDraft(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 132) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          rows={2}
          placeholder='e.g. "A cosy habit tracker with warm colours and gentle animations…"'
          className="ink-input w-full resize-none rounded-md px-3 py-2.5 text-[15.5px] leading-snug"
        />
        <div className="mt-2 flex items-center gap-2">
          {p.isDemo ? (
            <button onClick={p.onOpenSettings} className="min-w-0 flex-1 truncate text-left text-[11.5px] italic text-inksoft underline decoration-gilt/50 underline-offset-2 transition-colors hover:text-wax" title="The offline scribe knows a fixed repertoire. Bind a cloud or local AI for boundless craft.">
              Offline scribe · finite repertoire — bind an AI for boundless craft
            </button>
          ) : (
            <span className="min-w-0 flex-1 truncate text-[11.5px] italic text-inksoft">The scribe returns one complete, living page per wish.</span>
          )}
          {p.generating ? (
            <button onClick={p.onHalt} className="quill-btn flex shrink-0 items-center gap-2 rounded-md border-wax/60 px-4 py-2 text-[11px] text-wax">
              <Hand size={14} /> Stay the quill
            </button>
          ) : (
            <button onClick={send} disabled={!p.draft.trim()} className="wax-btn flex shrink-0 items-center gap-2 rounded-md px-5 py-2 text-[11px]">
              <Feather size={14} /> Inscribe
            </button>
          )}
        </div>
      </footer>
    </section>
  );
}

function Bubble({ m, p }: { m: ChatMsg; p: Props }) {
  if (m.role === "user") {
    return (
      <div className="anim-fadeup">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="smallcaps text-[10px] font-semibold text-wax">Thy wish</span>
          <span className="text-[10.5px] text-inkfaint">{fmtTime(m.time)}</span>
        </div>
        <div className="parchment-deep inset-well rounded-md rounded-tl-none px-3.5 py-2.5 text-[15.5px] leading-relaxed text-ink">
          {m.text}
        </div>
      </div>
    );
  }

  const folio = m.folioId ? p.folioById(m.folioId) : undefined;
  return (
    <div className="anim-fadeup">
      <div className="mb-1 flex items-center gap-2">
        <span className="smallcaps text-[10px] font-semibold text-[#8a6420]">The Scribe</span>
        <span className="text-[10.5px] text-inkfaint">{fmtTime(m.time)}</span>
        {m.streaming && <Feather size={12} className="anim-quill text-wax" />}
      </div>
      <div className={`rounded-md rounded-tl-none border px-3.5 py-2.5 text-[15.5px] leading-relaxed ${m.error ? "border-wax/50 bg-wax/8 text-waxdeep" : "border-gilt/35 bg-parchlight/60 text-ink"}`}>
        {m.error && <AlertTriangle size={15} className="mr-1.5 inline-block -translate-y-px" />}
        {m.text ? (
          <span className="whitespace-pre-wrap">{m.text}</span>
        ) : m.streaming ? (
          <span className="italic text-inksoft">The scribe dips the quill…</span>
        ) : null}

        {m.streaming && (m.codeLines ?? 0) > 0 && (
          <div className="mt-2.5 rounded-md border border-gilt/40 bg-parchdeep/50 px-3 py-2.5">
            <div className="flex items-center gap-2 text-[13px] italic text-inksoft">
              <Feather size={14} className="anim-quill text-wax" />
              Illuminating the manuscript… <b className="not-italic text-ink">{m.codeLines} lines</b>
            </div>
            <div className="shimmer-line mt-2 h-1.5 rounded-full" />
          </div>
        )}

        {!m.streaming && folio && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2 rounded-md border border-gilt/40 bg-parchdeep/50 px-3 py-2">
            <Sparkles size={14} className="text-gilt" />
            <span className="text-[13.5px]">
              <b className="font-display text-[12px] tracking-wide text-wax">Folio {roman(folio.n)}</b>
              <span className="mx-1.5 text-inkfaint">·</span>
              {folio.title}
              <span className="ml-1.5 text-[12px] italic text-inkfaint">{folio.code.split("\n").length} lines</span>
            </span>
            <span className="ml-auto flex gap-1.5">
              <button onClick={() => p.onBehold(folio.id)} className="chip flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px]">
                <Eye size={12} /> Behold
              </button>
              <button onClick={() => p.onShowScript(folio.id)} className="chip flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px]">
                <Code2 size={12} /> Script
              </button>
            </span>
          </div>
        )}
        {!m.streaming && m.folioId && !folio && (
          <div className="mt-2 text-[12.5px] italic text-inkfaint">(This folio has since been burned.)</div>
        )}

        {m.error && !p.isDemo && (
          <button onClick={p.onRetryDemo} className="chip mt-2.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px]">
            <Feather size={12} /> Let the offline scribe try instead
          </button>
        )}
      </div>
    </div>
  );
}
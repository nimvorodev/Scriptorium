import { useEffect, useMemo, useRef } from "react";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import cssLang from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import {
  AlertTriangle, Code2, Copy, Download, ExternalLink, Eye, Feather,
  Monitor, RefreshCw, ScrollText, Smartphone, Tablet, Trash2, Wrench, X,
} from "lucide-react";
import type { Device, Folio, MainView, PageError } from "../lib/types";
import { fmtTime, roman } from "../lib/types";
import { injectErrorCatcher } from "../lib/scribe";
import { Corners, Divider, WaxSeal } from "./ornaments";
import emblem from "../assets/emblem.jpg";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", cssLang);
hljs.registerLanguage("javascript", javascript);

interface Props {
  view: MainView;
  setView: (v: MainView) => void;
  folio: Folio | undefined;
  folios: Folio[];
  device: Device;
  setDevice: (d: Device) => void;
  generating: boolean;
  streamText: string;
  pageErrors: PageError[];
  onClearErrors: () => void;
  onMend: () => void;
  onRefresh: () => void;
  previewKey: number;
  onDownload: (f?: Folio) => void;
  onCopy: () => void;
  onOpenExternal: () => void;
  onSelectFolio: (id: string) => void;
  onDeleteFolio: (id: string) => void;
}

const DEVICES: { id: Device; icon: typeof Monitor; label: string; width: string }[] = [
  { id: "desktop", icon: Monitor, label: "Desktop", width: "100%" },
  { id: "tablet", icon: Tablet, label: "Tablet", width: "768px" },
  { id: "phone", icon: Smartphone, label: "Phone", width: "390px" },
];

export default function PreviewPane(p: Props) {
  const dev = DEVICES.find((d) => d.id === p.device)!;
  const srcDoc = useMemo(
    () => (p.folio ? injectErrorCatcher(p.folio.code) : ""),
    [p.folio],
  );

  return (
    <section className="parchment panel-edge relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg">
      <Corners />
      {/* toolbar */}
      <header className="relative flex flex-wrap items-center gap-x-1 gap-y-1 border-b border-ink/15 px-3 pt-2">
        <nav className="flex">
          <Tab active={p.view === "preview"} onClick={() => p.setView("preview")} icon={<Eye size={14} />} label="Living Page" />
          <Tab active={p.view === "code"} onClick={() => p.setView("code")} icon={<Code2 size={14} />} label="Manuscript" />
          <Tab
            active={p.view === "folios"}
            onClick={() => p.setView("folios")}
            icon={<ScrollText size={14} />}
            label={`Folios${p.folios.length ? " · " + p.folios.length : ""}`}
          />
        </nav>
        <div className="ml-auto flex items-center gap-1 pb-1.5">
          {p.view === "preview" && (
            <>
              <div className="mr-1 flex rounded-md border border-ink/20 bg-parchlight/50 p-0.5">
                {DEVICES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => p.setDevice(d.id)}
                    title={`Preview as ${d.label.toLowerCase()}`}
                    className={`icon-btn flex items-center gap-1 rounded px-2 py-1 text-[11px] ${p.device === d.id ? "active" : "text-inksoft"}`}
                  >
                    <d.icon size={13} />
                    <span className="hidden 2xl:inline">{d.label}</span>
                  </button>
                ))}
              </div>
              <IconBtn onClick={p.onRefresh} title="Reload the living page" disabled={!p.folio}><RefreshCw size={15} /></IconBtn>
              <IconBtn onClick={p.onOpenExternal} title="Open in a new tab" disabled={!p.folio}><ExternalLink size={15} /></IconBtn>
            </>
          )}
          {p.view === "code" && (
            <IconBtn onClick={p.onCopy} title="Copy the manuscript" disabled={!p.folio}><Copy size={15} /></IconBtn>
          )}
          {p.view !== "folios" && (
            <button onClick={() => p.onDownload()} disabled={!p.folio} className="quill-btn ml-1 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px]" title="Download as a standalone .html file">
              <Download size={13} /> Save .html
            </button>
          )}
        </div>
      </header>

      {/* body */}
      <div className="relative min-h-0 flex-1">
        {p.view === "preview" && (
          <div className="flex h-full flex-col">
            {p.pageErrors.length > 0 && p.folio && (
              <div className="anim-fadein flex items-center gap-2 border-b border-[#8a6420]/40 bg-[#f3e0b0] px-3 py-1.5 text-[13px] text-[#6b4a10]">
                <AlertTriangle size={14} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  The page whispers of {p.pageErrors.length} trouble{p.pageErrors.length > 1 ? "s" : ""}: <i>{p.pageErrors[0].message}</i>
                </span>
                <button onClick={p.onMend} disabled={p.generating} className="chip flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px]" title="Send the error to the scribe for repair">
                  <Wrench size={11} /> Mend it
                </button>
                <button onClick={p.onClearErrors} className="icon-btn rounded p-1" title="Dismiss"><X size={13} /></button>
              </div>
            )}
            <div className="relative min-h-0 flex-1 bg-[#241708]/90 p-3 sm:p-4" style={{ backgroundImage: "radial-gradient(700px 300px at 50% 0%, rgba(232,191,94,0.08), transparent)" }}>
              {p.folio ? (
                <div
                  className={`relative mx-auto h-full max-w-full overflow-hidden bg-white shadow-[0_18px_60px_rgba(0,0,0,0.6)] transition-all duration-500 ${p.device === "phone" ? "rounded-[30px] border-[9px] border-[#120b04]" : p.device === "tablet" ? "rounded-[20px] border-[8px] border-[#120b04]" : "rounded-md border border-black/50"}`}
                  style={{ width: dev.width }}
                >
                  <iframe
                    key={p.folio.id + ":" + p.previewKey}
                    title="The living page"
                    srcDoc={srcDoc}
                    sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-pointer-lock allow-downloads"
                    className="h-full w-full bg-white"
                  />
                  {p.generating && (
                    <div className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-2 rounded-full border border-gilt/50 bg-[#1c1006]/90 px-4 py-1.5 text-[12px] text-giltbright shadow-lg">
                      <Feather size={13} className="anim-quill" /> The scribe re-inscribes…
                    </div>
                  )}
                </div>
              ) : p.generating ? (
                <GeneratingPlaceholder />
              ) : (
                <EmptyPlaceholder />
              )}
            </div>
            {p.folio && (
              <div className="flex items-center gap-2 border-t border-ink/15 px-4 py-1.5 text-[12px] italic text-inksoft">
                <span className="font-display text-[10px] not-italic tracking-widest text-wax">FOLIO {roman(p.folio.n)}</span>
                <span className="truncate">{p.folio.title}</span>
                <span className="ml-auto hidden shrink-0 sm:inline">
                  {p.folio.code.split("\n").length} lines · {fmtTime(p.folio.time)} · {p.folio.scribe}
                </span>
              </div>
            )}
          </div>
        )}

        {p.view === "code" && <CodeView folio={p.folio} generating={p.generating} streamText={p.streamText} />}

        {p.view === "folios" && (
          <FoliosView folios={p.folios} currentId={p.folio?.id} onSelect={p.onSelectFolio} onDelete={p.onDeleteFolio} onDownload={p.onDownload} />
        )}
      </div>
    </section>
  );
}

function Tab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`tab-ribbon flex items-center gap-1.5 px-3 pb-2.5 pt-1 text-[11px] ${active ? "active" : "text-inksoft hover:text-ink"}`}>
      {icon} {label}
    </button>
  );
}

function IconBtn({ children, onClick, title, disabled }: { children: React.ReactNode; onClick: () => void; title: string; disabled?: boolean }) {
  return (
    <button onClick={onClick} title={title} disabled={disabled} className="icon-btn rounded-md p-1.5 text-inksoft disabled:cursor-not-allowed disabled:opacity-40">
      {children}
    </button>
  );
}

function EmptyPlaceholder() {
  return (
    <div className="anim-fadeup flex h-full flex-col items-center justify-center text-center">
      <img src={emblem} alt="" className="h-40 w-40 rounded-full object-cover opacity-90" style={{ maskImage: "radial-gradient(circle, black 60%, transparent 72%)", WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 72%)" }} />
      <h3 className="gold-emboss mt-2 font-display text-[22px] font-semibold">Thy living page awaits</h3>
      <p className="mt-2 max-w-sm text-[15px] italic leading-relaxed text-parch/70">
        Speak a wish in the Petition — the finished page shall appear here, alive and clickable. No code knowledge required.
      </p>
      <Divider className="mt-5 w-56" glyph="✦" />
    </div>
  );
}

function GeneratingPlaceholder() {
  return (
    <div className="anim-fadein flex h-full flex-col items-center justify-center">
      <Feather size={44} className="anim-quill text-giltbright" />
      <p className="gold-emboss mt-4 font-display text-[17px]">The scribe is inscribing…</p>
      <div className="mt-6 w-72 max-w-full space-y-3">
        <div className="shimmer-line h-4 rounded" />
        <div className="shimmer-line h-4 w-5/6 rounded" />
        <div className="shimmer-line h-24 rounded" />
        <div className="shimmer-line h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

function CodeView({ folio, generating, streamText }: { folio: Folio | undefined; generating: boolean; streamText: string }) {
  const streamRef = useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (generating && streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [streamText, generating]);

  const highlighted = useMemo(() => {
    if (!folio) return "";
    try { return hljs.highlight(folio.code, { language: "xml" }).value; }
    catch { return folio.code.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  }, [folio]);

  if (generating && streamText) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-1.5 text-[12px] italic text-inksoft">
          <Feather size={13} className="anim-quill text-wax" /> Ink flows — {streamText.split("\n").length} lines thus far…
        </div>
        <pre ref={streamRef} className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all px-4 py-3 font-mono text-[12px] leading-[1.6] text-ink/90">
          {streamText}
          <span className="inscribe-cursor" />
        </pre>
      </div>
    );
  }

  if (!folio) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Code2 size={38} className="text-gilt/70" />
        <p className="mt-3 max-w-xs text-[15px] italic text-inksoft">
          The manuscript is yet unwritten. Make a wish, and every line of code shall be laid bare here — for the curious.
        </p>
      </div>
    );
  }

  const lines = folio.code.split("\n").length;
  const kb = (new Blob([folio.code]).size / 1024).toFixed(1);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-1.5 text-[12px] text-inksoft">
        <span className="font-mono text-[11.5px] text-wax">index.html</span>
        <span>· {lines} lines · {kb} KB</span>
        <span className="ml-auto hidden italic sm:inline">curiosity is welcome — but thou need never read this</span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex min-w-max">
          <pre aria-hidden className="select-none border-r border-ink/10 bg-parchdeep/40 px-3 py-3 text-right font-mono text-[12px] leading-[1.6] text-inkfaint">
            {Array.from({ length: lines }, (_, i) => i + 1).join("\n")}
          </pre>
          <pre className="flex-1 px-4 py-3 font-mono text-[12px] leading-[1.6]">
            <code className="hljs" dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>
      </div>
    </div>
  );
}

function FoliosView({ folios, currentId, onSelect, onDelete, onDownload }: {
  folios: Folio[];
  currentId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (f?: Folio) => void;
}) {
  if (folios.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <ScrollText size={38} className="text-gilt/70" />
        <p className="mt-3 max-w-xs text-[15px] italic text-inksoft">
          The archive is empty. Every wish that yields a page is pressed here as a folio — return to any of them at will.
        </p>
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto p-4">
      <p className="mb-3 text-[13px] italic text-inksoft">Every version of thy page, pressed and preserved. Click a folio to bring it back to the living page.</p>
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {[...folios].reverse().map((f) => {
          const current = f.id === currentId;
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className={`anim-fadeup group relative rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(60,36,6,0.3)] ${current ? "border-wax/60 bg-parchlight/80 shadow-[0_6px_18px_rgba(143,29,33,0.18)]" : "border-ink/20 bg-parchlight/50"}`}
            >
              {current && (
                <span className="absolute -right-2 -top-2">
                  <WaxSeal letter="✦" size={30} />
                </span>
              )}
              <div className="flex items-baseline gap-2">
                <span className="gold-emboss text-[26px] leading-none" style={{ fontFamily: "var(--font-black)" }}>{roman(f.n)}</span>
                <span className="min-w-0 truncate font-display text-[13px] font-semibold text-ink">{f.title}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] italic leading-snug text-inksoft">“{f.prompt}”</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-inkfaint">
                <span>{fmtTime(f.time)}</span>·<span className="truncate">{f.scribe}</span>·<span className="shrink-0">{f.code.split("\n").length} ln</span>
                <span className="ml-auto flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); onDownload(f); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onDownload(f); } }}
                    title="Download this folio"
                    className="icon-btn rounded p-1 text-inksoft"
                  >
                    <Download size={13} />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); onDelete(f.id); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onDelete(f.id); } }}
                    title="Burn this folio"
                    className="icon-btn rounded p-1 text-wax"
                  >
                    <Trash2 size={13} />
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import {
  Brush, BookOpenText, Calculator, Camera, Coins, Croissant, Eye, Feather, Gamepad2,
  Globe, HardDrive, Hourglass, KeyRound, Lightbulb, ListTodo, MessageSquare, Palette,
  Quote, Rocket, Search, Settings2, Store, X,
} from "lucide-react";
import { SPELLS } from "../lib/spells";
import { Corners, Divider, QuillBadge } from "./ornaments";
import emblem from "../assets/emblem.jpg";

/* ------------------------------- shell ------------------------------ */
export function Shell({ title, icon, onClose, children, wide }: {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="anim-fadein absolute inset-0 bg-black/70 backdrop-blur-[3px]" onClick={onClose} />
      <div className={`parchment panel-edge anim-fadeup relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl ${wide ? "max-w-3xl" : "max-w-xl"}`}>
        <Corners />
        <header className="relative flex items-center gap-3 border-b border-ink/15 px-6 pb-3 pt-4">
          <QuillBadge size={30} />
          <h2 className="smallcaps flex items-center gap-2 text-[14px] font-semibold text-ink">{icon} {title}</h2>
          <button onClick={onClose} className="icon-btn ml-auto rounded-md p-1.5 text-inksoft" title="Close (Esc)">
            <X size={18} />
          </button>
        </header>
        <div className="relative min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------ welcome ----------------------------- */
export function WelcomeModal({ onDemo, onBind }: { onDemo: () => void; onBind: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[4px]" />
      <div className="parchment panel-edge anim-fadeup relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl px-6 py-7 sm:px-10">
        <Corners />
        <div className="text-center">
          <img src={emblem} alt="Illuminated quill and scroll" className="mx-auto h-36 w-36 rounded-full object-cover mix-blend-multiply" style={{ maskImage: "radial-gradient(circle, black 60%, transparent 72%)", WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 72%)" }} />
          <h2 className="mt-1 text-[40px] leading-tight text-wax" style={{ fontFamily: "var(--font-black)" }}>Welcome to the Scriptorium</h2>
          <p className="smallcaps mt-1 text-[10px] text-inksoft">an atelier where plain words become working code</p>
        </div>
        <Divider className="my-5" />
        <p className="dropcap text-[16.5px] leading-relaxed text-ink">
          Vibe coding is simple: <b>describe what you want in everyday words</b>, and an AI scribe writes the actual code for you.
          No programming knowledge is required — if you can wish for it, you can build it.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { n: "I", icon: <MessageSquare size={20} />, t: "Speak thy wish", d: "“A cosy to-do list with warm colours.” That's all it takes." },
            { n: "II", icon: <Feather size={20} />, t: "The Scribe inscribes", d: "Watch real code appear, stroke by stroke, in the Manuscript." },
            { n: "III", icon: <Eye size={20} />, t: "Behold & refine", d: "See it live. Say “make it darker” — and it is done." },
          ].map((s) => (
            <div key={s.n} className="parchment-deep inset-well rounded-lg p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gilt/50 text-wax">{s.icon}</div>
              <div className="gold-emboss mt-2 font-display text-[15px] font-bold" style={{ textShadow: "none", color: "#8a6420" }}>{s.n}</div>
              <h3 className="font-display text-[13px] font-semibold text-ink">{s.t}</h3>
              <p className="mt-1 text-[13px] leading-snug text-inksoft">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={onDemo} className="wax-btn flex items-center justify-center gap-2 rounded-md px-6 py-3 text-[12px]">
            <Feather size={15} /> Begin with the Offline Scribe
          </button>
          <button onClick={onBind} className="quill-btn flex items-center justify-center gap-2 rounded-md px-6 py-3 text-[12px]">
            <Settings2 size={15} /> Bind an AI provider
          </button>
        </div>
        <p className="mt-4 text-center text-[12.5px] italic leading-relaxed text-inksoft">
          The offline scribe lives in this page — free, private, no key — and crafts from a fixed repertoire.
          For boundless creations, bind OpenAI, Anthropic, Gemini, Groq, Mistral, OpenRouter, or a local model via Ollama / LM Studio.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------- guide ------------------------------ */
export function GuideModal({ onClose, onOpenSettings }: { onClose: () => void; onOpenSettings: () => void }) {
  return (
    <Shell title="The Apprentice's Guide" icon={<BookOpenText size={15} />} onClose={onClose} wide>
      <div className="space-y-6 text-[15.5px] leading-relaxed text-ink">
        <section>
          <h3 className="smallcaps mb-2 text-[12px] font-bold text-wax">What is vibe coding?</h3>
          <p className="dropcap">
            Instead of writing code line by line, you describe the <em>feeling and function</em> of what you want — its vibe — and an AI writes
            the code. You judge the result with your eyes, then ask for changes in plain words. The Scriptorium shows you the living page
            immediately, keeps every version as a <b>folio</b>, and lets you download the finished work as a single file.
          </p>
        </section>

        <section>
          <h3 className="smallcaps mb-2 text-[12px] font-bold text-wax">Speaking well to the Scribe</h3>
          <ul className="space-y-2.5">
            {[
              ["Name the thing and 2–4 features.", "“A habit tracker with a weekly grid, streaks, and a calm green palette.”"],
              ["Mention mood, colours, or style.", "“…make it dark and elegant”, “…playful, rounded, rose pink”."],
              ["Refine in small steps.", "After each result, try “make it dark”, “add animations”, “bigger buttons”."],
              ["Borrow an incantation.", "The Book of Incantations holds ready-made wishes — a fine way to learn the rhythm."],
            ].map(([tip, ex]) => (
              <li key={tip} className="flex gap-2.5">
                <Lightbulb size={16} className="mt-1 shrink-0 text-gilt" />
                <span><b>{tip}</b> <i className="text-inksoft">{ex}</i></span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="smallcaps mb-2 text-[12px] font-bold text-wax">Choosing thy scribe</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="parchment-deep inset-well rounded-lg p-3.5">
              <Feather size={18} className="text-wax" />
              <h4 className="mt-1.5 font-display text-[12.5px] font-semibold">Offline</h4>
              <p className="mt-1 text-[13px] leading-snug text-inksoft">Built into this page. Free, private, instant — but a finite repertoire. Perfect first steps.</p>
            </div>
            <div className="parchment-deep inset-well rounded-lg p-3.5">
              <HardDrive size={18} className="text-wax" />
              <h4 className="mt-1.5 font-display text-[12.5px] font-semibold">Local models</h4>
              <p className="mt-1 text-[13px] leading-snug text-inksoft">Ollama or LM Studio run AI on thy own machine — private and free, no key. Start the app's server, then bind it.</p>
            </div>
            <div className="parchment-deep inset-well rounded-lg p-3.5">
              <Globe size={18} className="text-wax" />
              <h4 className="mt-1.5 font-display text-[12.5px] font-semibold">Cloud providers</h4>
              <p className="mt-1 text-[13px] leading-snug text-inksoft">OpenAI, Anthropic, Gemini, Groq, Mistral, OpenRouter… paste an API key and gain boundless craft. Usually pennies per page.</p>
            </div>
          </div>
          <button onClick={onOpenSettings} className="quill-btn mt-3 flex items-center gap-2 rounded-md px-4 py-2 text-[11px]">
            <Settings2 size={13} /> Open Bind Scribe
          </button>
        </section>

        <section>
          <h3 className="smallcaps mb-2 text-[12px] font-bold text-wax">A small glossary</h3>
          <dl className="space-y-2 text-[14.5px]">
            {[
              ["API endpoint", "The web address where an AI service listens, e.g. https://api.openai.com/v1. The Scriptorium sends thy wishes there."],
              ["API key", "A secret password from the provider that lets you use their AI. Stored only in thy browser, sent only to thy chosen endpoint."],
              ["Model", "The specific AI brain, e.g. gpt-4o-mini or llama3.2. Bigger models write finer pages; smaller ones answer faster."],
              ["Local model", "An AI running on thy own computer (via Ollama or LM Studio). Nothing leaves thy machine."],
              ["OpenAI-compatible", "A shared dialect many services speak. If a service is OpenAI-compatible, the Custom Endpoint here can talk to it."],
              ["Folio", "One saved version of thy page. Every inscription creates one; restore any of them from the Folios tab."],
            ].map(([term, def]) => (
              <div key={term} className="flex flex-col gap-0.5 border-b border-ink/10 pb-2 sm:flex-row sm:gap-3">
                <dt className="w-40 shrink-0 font-display text-[12px] font-semibold text-[#8a6420]">{term}</dt>
                <dd className="text-inksoft">{def}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h3 className="smallcaps mb-2 text-[12px] font-bold text-wax">Keys of the atelier</h3>
          <p className="text-[14.5px] text-inksoft">
            <KeyRound size={14} className="mr-1 inline text-gilt" />
            <b>↵</b> send thy petition · <b>Shift + ↵</b> new line · <b>Esc</b> close any scroll-dialog.
            The page's own errors are caught and shown above the living page — press <b>Mend it</b> and the scribe shall repair them.
          </p>
        </section>
      </div>
    </Shell>
  );
}

/* ------------------------------- spells ----------------------------- */
const SPELL_ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  ListTodo, Hourglass, Coins, Calculator, Palette, Brush, Gamepad2, Quote, Rocket, Store, Camera, Croissant,
};

export function SpellsModal({ onClose, onUse }: { onClose: () => void; onUse: (prompt: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return SPELLS;
    return SPELLS.filter((s) => (s.name + " " + s.desc + " " + s.prompt + " " + s.category).toLowerCase().includes(q));
  }, [query]);
  const categories = useMemo(() => [...new Set(filtered.map((s) => s.category))], [filtered]);

  return (
    <Shell title="The Book of Incantations" icon={<BookOpenText size={15} />} onClose={onClose} wide>
      <div className="ink-input mb-4 flex items-center gap-2 rounded-md px-3 py-2">
        <Search size={15} className="shrink-0 text-inksoft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the book… (timer, game, palette, shop…)"
          className="w-full bg-transparent text-[15px] outline-none placeholder:italic placeholder:text-inkfaint"
          autoFocus
        />
      </div>
      {categories.length === 0 && (
        <p className="py-8 text-center italic text-inksoft">No incantation matches “{query}” — but thy own words may work wonders. Write freely in the Petition.</p>
      )}
      {categories.map((cat) => (
        <section key={cat} className="mb-5">
          <Divider className="mb-3" glyph="❦" />
          <h3 className="smallcaps mb-3 text-center text-[11px] font-bold text-[#8a6420]">{cat}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.filter((s) => s.category === cat).map((s) => {
              const Icon = SPELL_ICONS[s.icon] ?? Feather;
              return (
                <button
                  key={s.id}
                  onClick={() => onUse(s.prompt)}
                  className="group rounded-lg border border-ink/20 bg-parchlight/60 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-gilt hover:shadow-[0_10px_24px_rgba(60,36,6,0.25)]"
                  title="Prepare this incantation in thy petition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gilt/50 bg-parchdeep/60 text-wax transition-transform group-hover:scale-110">
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0">
                      <h4 className="truncate font-display text-[13px] font-semibold text-ink">{s.name}</h4>
                      <p className="text-[12.5px] leading-tight text-inksoft">{s.desc}</p>
                    </div>
                  </div>
                  <p className="mt-2.5 line-clamp-2 border-l-2 border-gilt/40 pl-2.5 text-[12.5px] italic leading-snug text-inkfaint">“{s.prompt}”</p>
                </button>
              );
            })}
          </div>
        </section>
      ))}
      <p className="text-center text-[12.5px] italic text-inksoft">
        Choosing an incantation prepares it in thy petition — press <b>Inscribe</b> to release it.
      </p>
    </Shell>
  );
}

/* ------------------------------ confirm ----------------------------- */
export function ConfirmModal({ title, body, confirmLabel, onConfirm, onClose }: {
  title: string; body: string; confirmLabel: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Shell title={title} icon={<Feather size={15} />} onClose={onClose}>
      <p className="text-[15.5px] leading-relaxed text-inksoft">{body}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button onClick={onClose} className="quill-btn rounded-md px-4 py-2 text-[11px]">Nay, keep it</button>
        <button onClick={onConfirm} className="wax-btn rounded-md px-5 py-2 text-[11px]">{confirmLabel}</button>
      </div>
    </Shell>
  );
}
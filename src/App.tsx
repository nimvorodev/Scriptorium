import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eye, MessageSquare, Sparkles } from "lucide-react";
import type { ChatMsg, Device, Folio, MainView, PageError, Settings } from "./lib/types";
import { uid } from "./lib/types";
import { DEFAULT_SETTINGS, presetById, scribeLabel } from "./lib/providers";
import { buildHistory, demoGenerate, extractHtml, friendlyError, streamChat, stripFences } from "./lib/scribe";
import TopBar from "./components/TopBar";
import ChatPanel from "./components/ChatPanel";
import PreviewPane from "./components/PreviewPane";
import SettingsModal from "./components/SettingsModal";
import { ConfirmModal, GuideModal, SpellsModal, WelcomeModal } from "./components/Modals";

const STORE_KEY = "scriptorium:v1";

interface Saved {
  settings: Settings;
  messages: ChatMsg[];
  folios: Folio[];
  currentId: string | null;
  projectName: string;
  welcomed: boolean;
}

function load(): Saved {
  const fallback: Saved = { settings: DEFAULT_SETTINGS, messages: [], folios: [], currentId: null, projectName: "Untitled Scroll", welcomed: false };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return fallback;
    const j = JSON.parse(raw);
    return {
      settings: { ...DEFAULT_SETTINGS, ...(j.settings ?? {}) },
      messages: Array.isArray(j.messages) ? j.messages.map((m: ChatMsg) => ({ ...m, streaming: false })) : [],
      folios: Array.isArray(j.folios) ? j.folios : [],
      currentId: j.currentId ?? null,
      projectName: j.projectName ?? "Untitled Scroll",
      welcomed: !!j.welcomed,
    };
  } catch {
    return fallback;
  }
}

type Modal = null | "welcome" | "settings" | "guide" | "spells" | "confirm";

export default function App() {
  const initial = useMemo(load, []);
  const [settings, setSettings] = useState<Settings>(initial.settings);
  const [messages, setMessages] = useState<ChatMsg[]>(initial.messages);
  const [folios, setFolios] = useState<Folio[]>(initial.folios);
  const [currentId, setCurrentId] = useState<string | null>(initial.currentId);
  const [projectName, setProjectName] = useState(initial.projectName);
  const [welcomed, setWelcomed] = useState(initial.welcomed);
  const [modal, setModal] = useState<Modal>(initial.welcomed ? null : "welcome");

  const [view, setView] = useState<MainView>("preview");
  const [device, setDevice] = useState<Device>("desktop");
  const [generating, setGenerating] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [pageErrors, setPageErrors] = useState<PageError[]>([]);
  const [previewKey, setPreviewKey] = useState(0);
  const [draft, setDraft] = useState("");
  const [mobilePane, setMobilePane] = useState<"petition" | "atelier">("petition");
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const lastPromptRef = useRef("");

  const currentFolio = useMemo(() => folios.find((f) => f.id === currentId), [folios, currentId]);
  const folioById = useCallback((id: string) => folios.find((f) => f.id === id), [folios]);
  const isDemo = presetById(settings.providerId).builtin === true;

  const say = useCallback((text: string) => setToast({ id: Date.now(), text }), []);

  /* ---------------------------- persistence --------------------------- */
  useEffect(() => {
    try {
      const data: Saved = {
        settings,
        messages: messages.slice(-80).map((m) => ({ ...m, streaming: false })),
        folios: folios.slice(-30),
        currentId,
        projectName,
        welcomed,
      };
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch { /* storage may be full or blocked */ }
  }, [settings, messages, folios, currentId, projectName, welcomed]);

  /* ------------------------------ toasts ------------------------------ */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  /* --------------------- page error bridge (iframe) ------------------- */
  useEffect(() => {
    const h = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.__SCRIPTORIUM__ !== 1 || d.type !== "error") return;
      setPageErrors((prev) => {
        if (prev.length && prev[prev.length - 1].message === d.message) return prev;
        return [...prev.slice(-5), { message: String(d.message), time: Date.now() }];
      });
    };
    window.addEventListener("message", h);
    return () => window.removeEventListener("message", h);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  /* ---------------------------- generation ---------------------------- */
  const patchMsg = useCallback((id: string, patch: Partial<ChatMsg> | ((m: ChatMsg) => Partial<ChatMsg>)) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...(typeof patch === "function" ? patch(m) : patch) } : m)));
  }, []);

  const send = useCallback(async (prompt: string, forceDemo = false) => {
    const wish = prompt.trim();
    if (!wish || generating) return;
    lastPromptRef.current = wish;

    const userMsg: ChatMsg = { id: uid(), role: "user", text: wish, time: Date.now() };
    const scribeId = uid();
    const scribeMsg: ChatMsg = { id: scribeId, role: "scribe", text: "", time: Date.now(), streaming: true, codeLines: 0 };
    const history = buildHistory([...messages, userMsg], folioById);

    setMessages((prev) => [...prev.slice(-78), userMsg, scribeMsg]);
    setDraft("");
    setGenerating(true);
    setStreamText("");
    setPageErrors([]);

    const controller = new AbortController();
    abortRef.current = controller;
    const useDemo = forceDemo || isDemo;
    let textAccum = "";
    let fullAccum = "";

    const onText = (c: string) => {
      textAccum += c;
      patchMsg(scribeId, { text: textAccum.trimStart() });
    };

    try {
      let code: string | null = null;
      let title = "Inscribed Page";
      let meta: Folio["meta"];

      if (useDemo) {
        const outcome = await demoGenerate(
          wish,
          currentFolio?.meta,
          onText,
          (c) => {
            fullAccum += c;
            setStreamText(fullAccum);
            patchMsg(scribeId, { codeLines: fullAccum.split("\n").length });
          },
          controller.signal,
        );
        code = outcome.code;
        title = outcome.title;
        meta = outcome.meta;
      } else {
        let rawAccum = "";
        fullAccum = await streamChat(settings, history, (delta) => {
          rawAccum += delta;
          setStreamText(rawAccum);
          const commentary = stripFences(rawAccum);
          textAccum = commentary;
          const inCode = rawAccum.includes("```");
          patchMsg(scribeId, {
            text: commentary,
            codeLines: inCode ? Math.max(0, rawAccum.split("\n").length - 1) : 0,
          });
        }, controller.signal);
        textAccum = stripFences(fullAccum);
        code = extractHtml(fullAccum);
        if (code) {
          const t = /<title[^>]*>([^<]*)<\/title>/i.exec(code);
          if (t && t[1].trim()) title = t[1].trim();
        }
      }

      if (code) {
        const folio: Folio = {
          id: uid(),
          n: folios.length ? Math.max(...folios.map((f) => f.n)) + 1 : 1,
          title,
          prompt: wish,
          code,
          time: Date.now(),
          scribe: useDemo && !isDemo ? "Offline Scribe" : scribeLabel(settings),
          meta,
        };
        setFolios((prev) => [...prev.slice(-29), folio]);
        setCurrentId(folio.id);
        setPreviewKey((k) => k + 1);
        setView("preview");
        setMobilePane("atelier");
        patchMsg(scribeId, { streaming: false, folioId: folio.id, text: textAccum || "It is done — behold the living page." });
        say(`Folio ${folio.n} inscribed ✦`);
      } else {
        patchMsg(scribeId, {
          streaming: false,
          text: (textAccum || "The scribe wrote words, but no page was found in the reply.") +
            "\n\n(No complete HTML page arrived — try rephrasing thy wish, or bind a different model.)",
        });
      }
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      if (aborted) {
        patchMsg(scribeId, { streaming: false, text: textAccum ? textAccum + "\n\n(The quill was stayed at thy command.)" : "The quill was stayed at thy command. Speak again when ready." });
      } else {
        patchMsg(scribeId, { streaming: false, error: true, text: friendlyError(err, settings) });
      }
    } finally {
      setGenerating(false);
      abortRef.current = null;
    }
  }, [generating, messages, folioById, isDemo, currentFolio, settings, folios, patchMsg, say]);

  const halt = useCallback(() => abortRef.current?.abort(), []);

  /* ------------------------------ actions ----------------------------- */
  const behold = useCallback((id: string) => {
    setCurrentId(id);
    setView("preview");
    setPreviewKey((k) => k + 1);
    setPageErrors([]);
    setMobilePane("atelier");
  }, []);

  const showScript = useCallback((id: string) => {
    setCurrentId(id);
    setView("code");
    setMobilePane("atelier");
  }, []);

  const download = useCallback((f?: Folio) => {
    const target = f ?? currentFolio;
    if (!target) return;
    const blob = new Blob([target.code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = (projectName || "scriptorium").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "scriptorium";
    a.href = url;
    a.download = `${slug}-folio-${target.n}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    say("Saved to thy downloads");
  }, [currentFolio, projectName, say]);

  const copyCode = useCallback(() => {
    if (!currentFolio) return;
    navigator.clipboard.writeText(currentFolio.code).then(
      () => say("The manuscript is copied"),
      () => say("Alas — the clipboard refused. Select the text by hand."),
    );
  }, [currentFolio, say]);

  const openExternal = useCallback(() => {
    if (!currentFolio) return;
    const blob = new Blob([currentFolio.code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }, [currentFolio]);

  const mend = useCallback(() => {
    if (!pageErrors.length) return;
    const msg = pageErrors[0].message;
    setPageErrors([]);
    setMobilePane("petition");
    send(`The living page reports this error: "${msg}". Repair it and return the full corrected file.`);
  }, [pageErrors, send]);

  const deleteFolio = useCallback((id: string) => {
    setFolios((prev) => {
      const next = prev.filter((f) => f.id !== id);
      setCurrentId((cur) => (cur === id ? (next.length ? next[next.length - 1].id : null) : cur));
      return next;
    });
    say("The folio is burned");
  }, [say]);

  const newScroll = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setFolios([]);
    setCurrentId(null);
    setProjectName("Untitled Scroll");
    setPageErrors([]);
    setStreamText("");
    setDraft("");
    setView("preview");
    setModal(null);
    setMobilePane("petition");
    say("A fresh scroll is unfurled");
  }, [say]);

  const useSpell = useCallback((prompt: string) => {
    setDraft(prompt);
    setModal(null);
    setMobilePane("petition");
    say("Incantation prepared — press Inscribe");
    setTimeout(() => document.getElementById("petition")?.focus(), 60);
  }, [say]);

  /* ------------------------------ ambience ---------------------------- */
  const motes = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({
      left: (i * 97) % 100,
      delay: (i * 1.7) % 14,
      dur: 16 + ((i * 5) % 12),
      size: 2 + (i % 3),
      dx: ((i % 5) - 2) * 22,
    })),
    [],
  );

  return (
    <div className="bg-leather relative flex h-screen flex-col overflow-hidden">
      {/* ambient candlelight + dust */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="anim-candle absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,176,66,0.16), transparent 65%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 110%, rgba(0,0,0,0.5), transparent 55%)" }} />
        {motes.map((m, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-giltbright/50"
            style={{
              left: m.left + "%",
              width: m.size,
              height: m.size,
              animation: `mote ${m.dur}s linear ${m.delay}s infinite`,
              ["--dx" as string]: m.dx + "px",
            }}
          />
        ))}
      </div>

      <TopBar
        projectName={projectName}
        onRename={setProjectName}
        scribeLabel={scribeLabel(settings)}
        isDemo={isDemo}
        generating={generating}
        onOpenSpells={() => setModal("spells")}
        onOpenGuide={() => setModal("guide")}
        onOpenSettings={() => setModal("settings")}
        onNewScroll={() => setModal("confirm")}
      />

      {/* mobile pane switch */}
      <div className="relative z-10 flex gap-1 px-3 pt-2.5 lg:hidden">
        <button
          onClick={() => setMobilePane("petition")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-[10px ${mobilePane === "petition" ? "wax-btn" : "dark-btn"}`}
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          <MessageSquare size={13} /> The Petition
        </button>
        <button
          onClick={() => setMobilePane("atelier")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-[10px] ${mobilePane === "atelier" ? "wax-btn" : "dark-btn"}`}
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          <Eye size={13} /> The Living Page
        </button>
      </div>

      <main className="relative z-10 flex min-h-0 flex-1 gap-3 p-3 sm:gap-4 sm:p-4">
        <div className={`${mobilePane === "petition" ? "flex" : "hidden"} min-h-0 w-full flex-col lg:flex lg:w-[400px] lg:shrink-0 xl:w-[440px]`}>
          <ChatPanel
            messages={messages}
            folioById={folioById}
            generating={generating}
            draft={draft}
            setDraft={setDraft}
            onSend={(t) => send(t)}
            onHalt={halt}
            onOpenSpells={() => setModal("spells")}
            onOpenSettings={() => setModal("settings")}
            onBehold={behold}
            onShowScript={showScript}
            onRetryDemo={() => send(lastPromptRef.current, true)}
            isDemo={isDemo}
            hasFolio={!!currentFolio}
          />
        </div>
        <div className={`${mobilePane === "atelier" ? "flex" : "hidden"} min-h-0 min-w-0 flex-1 flex-col lg:flex`}>
          <PreviewPane
            view={view}
            setView={setView}
            folio={currentFolio}
            folios={folios}
            device={device}
            setDevice={setDevice}
            generating={generating}
            streamText={streamText}
            pageErrors={pageErrors}
            onClearErrors={() => setPageErrors([])}
            onMend={mend}
            onRefresh={() => { setPreviewKey((k) => k + 1); setPageErrors([]); }}
            previewKey={previewKey}
            onDownload={download}
            onCopy={copyCode}
            onOpenExternal={openExternal}
            onSelectFolio={behold}
            onDeleteFolio={deleteFolio}
          />
        </div>
      </main>

      {/* modals */}
      {modal === "welcome" && (
        <WelcomeModal
          onDemo={() => { setWelcomed(true); setModal(null); say("The offline scribe stands ready"); }}
          onBind={() => { setWelcomed(true); setModal("settings"); }}
        />
      )}
      {modal === "settings" && (
        <SettingsModal
          settings={settings}
          onClose={() => setModal(null)}
          onSave={(s) => {
            setSettings(s);
            setModal(null);
            const p = presetById(s.providerId);
            say(p.builtin ? "The offline scribe is bound" : `${p.name} is bound${s.model ? " · " + s.model : ""}`);
          }}
        />
      )}
      {modal === "guide" && <GuideModal onClose={() => setModal(null)} onOpenSettings={() => setModal("settings")} />}
      {modal === "spells" && <SpellsModal onClose={() => setModal(null)} onUse={useSpell} />}
      {modal === "confirm" && (
        <ConfirmModal
          title="Begin a new scroll?"
          body="This clears the conversation and all its folios from the archive. Thy scribe bindings remain. Download anything thou wishest to keep first."
          confirmLabel="Aye, begin anew"
          onConfirm={newScroll}
          onClose={() => setModal(null)}
        />
      )}

      {/* toast */}
      {toast && (
        <div key={toast.id} className="anim-fadeup fixed bottom-6 left-1/2 z-[70] -translate-x-1/2">
          <div className="parchment gilt-frame flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[14px] text-ink shadow-2xl">
            <Sparkles size={15} className="text-gilt" />
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
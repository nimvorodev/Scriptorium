import { useState } from "react";
import {
  Brain, CheckCircle2, AlertTriangle, Eye, EyeOff, Feather, Gem, Info, Laptop,
  Loader2, Plug, Route, Server, ShieldCheck, Sparkles, Telescope, Wind, Zap,
} from "lucide-react";
import type { Settings } from "../lib/types";
import { PRESETS, presetById } from "../lib/providers";
import { fetchModels, testConnection } from "../lib/scribe";
import { Shell, } from "./Modals";
import { Divider, WaxSeal } from "./ornaments";

const PROVIDER_ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  demo: Feather, ollama: Server, lmstudio: Laptop, openai: Sparkles, anthropic: Brain,
  gemini: Gem, groq: Zap, mistral: Wind, openrouter: Route, custom: Plug,
};

interface Props {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<Settings>({ ...settings });
  const [keys, setKeys] = useState<Record<string, string>>({ [settings.providerId]: settings.apiKey });
  const [showKey, setShowKey] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [scrying, setScrying] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [saveError, setSaveError] = useState("");

  const preset = presetById(draft.providerId);
  const set = (patch: Partial<Settings>) => { setDraft((d) => ({ ...d, ...patch })); setResult(null); setSaveError(""); };

  const chooseProvider = (id: string) => {
    const p = presetById(id);
    setKeys((k) => ({ ...k, [draft.providerId]: draft.apiKey }));
    setModels([]);
    setDraft((d) => ({ ...d, providerId: id, baseUrl: p.baseUrl, model: p.model, apiKey: keys[id] ?? "" }));
    setResult(null);
    setSaveError("");
  };

  const scry = async () => {
    setScrying(true);
    setResult(null);
    try {
      const list = await fetchModels(draft);
      setModels(list);
      if (list.length && (!draft.model || !list.includes(draft.model))) set({ model: list[0] });
      setResult({ ok: true, msg: `Divined ${list.length} model${list.length === 1 ? "" : "s"} — choose from the list beneath the model field.` });
    } catch (e) {
      setResult({ ok: false, msg: e instanceof Error ? e.message : String(e) });
    } finally {
      setScrying(false);
    }
  };

  const test = async () => {
    setTesting(true);
    setResult(null);
    try {
      const msg = await testConnection(draft);
      setResult({ ok: true, msg });
    } catch (e) {
      setResult({ ok: false, msg: e instanceof Error ? e.message : String(e) });
    } finally {
      setTesting(false);
    }
  };

  const save = () => {
    if (!preset.builtin && !draft.baseUrl.trim()) { setSaveError("A base URL is required — the address where this scribe dwells."); return; }
    if (preset.needsKey && !draft.apiKey.trim()) { setSaveError("This scribe requires an API key. The help note below says where to find one."); return; }
    onSave({ ...draft, baseUrl: draft.baseUrl.trim(), apiKey: draft.apiKey.trim(), model: draft.model.trim() || preset.model });
  };

  return (
    <Shell title="Bind thy Scribe" icon={<Sparkles size={15} />} onClose={onClose} wide>
      <div className="flex flex-col gap-5 md:flex-row">
        {/* provider list */}
        <div className="shrink-0 md:w-60">
          <p className="smallcaps mb-2 text-[10px] text-inksoft">Choose a scribe</p>
          <div className="grid grid-cols-2 gap-1.5 md:grid-cols-1">
            {PRESETS.map((p) => {
              const Icon = PROVIDER_ICONS[p.id] ?? Plug;
              const active = draft.providerId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => chooseProvider(p.id)}
                  className={`flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-all ${active ? "border-wax/60 bg-parchlight/90 shadow-[0_4px_12px_rgba(143,29,33,0.15)]" : "border-ink/15 bg-parchlight/40 hover:border-gilt/60 hover:bg-parchlight/70"}`}
                >
                  <Icon size={16} className={active ? "text-wax" : "text-inksoft"} />
                  <span className="min-w-0">
                    <span className={`block truncate font-display text-[12px] font-semibold ${active ? "text-wax" : "text-ink"}`}>{p.name}</span>
                    <span className="block truncate text-[10.5px] text-inkfaint">{p.tag}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* form */}
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] leading-relaxed text-inksoft">{preset.blurb}</p>
          <Divider className="my-4" />

          {preset.builtin ? (
            <div className="flex flex-col items-center py-4 text-center">
              <WaxSeal letter="S" size={64} />
              <p className="mt-4 max-w-sm text-[14.5px] italic leading-relaxed text-inksoft">
                No keys, no servers, no coin. The offline scribe knows to-dos, timers, calculators, games, palettes, ledgers, canvases and landing pages —
                and obeys refinements of darkness, light, colour and motion.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="smallcaps mb-1 block text-[10px] text-inksoft" htmlFor="baseUrl">Base URL · the endpoint</label>
                <input id="baseUrl" value={draft.baseUrl} onChange={(e) => set({ baseUrl: e.target.value })} placeholder="https://api.example.com/v1" className="ink-input w-full rounded-md px-3 py-2 font-mono text-[13px]" spellCheck={false} />
              </div>

              {(preset.needsKey || preset.id === "custom") && (
                <div>
                  <label className="smallcaps mb-1 block text-[10px] text-inksoft" htmlFor="apiKey">API key {!preset.needsKey && "(optional)"}</label>
                  <div className="relative">
                    <input id="apiKey" type={showKey ? "text" : "password"} value={draft.apiKey} onChange={(e) => set({ apiKey: e.target.value })} placeholder={preset.keyHint ?? "…"} className="ink-input w-full rounded-md px-3 py-2 pr-10 font-mono text-[13px]" spellCheck={false} autoComplete="off" />
                    <button onClick={() => setShowKey((v) => !v)} className="icon-btn absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-inksoft" title={showKey ? "Hide the key" : "Reveal the key"}>
                      {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="smallcaps mb-1 block text-[10px] text-inksoft" htmlFor="model">Model · the brain</label>
                <div className="flex gap-2">
                  <input id="model" list="scribed-models" value={draft.model} onChange={(e) => set({ model: e.target.value })} placeholder="e.g. gpt-4o-mini" className="ink-input w-full min-w-0 flex-1 rounded-md px-3 py-2 font-mono text-[13px]" spellCheck={false} />
                  <datalist id="scribed-models">
                    {models.map((m) => <option key={m} value={m} />)}
                  </datalist>
                  <button onClick={scry} disabled={scrying || !draft.baseUrl.trim()} className="quill-btn flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-[10px]" title="Ask the endpoint which models it offers">
                    {scrying ? <Loader2 size={13} className="animate-spin" /> : <Telescope size={13} />} Scry models
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="smallcaps mb-1 flex justify-between text-[10px] text-inksoft" htmlFor="temp">
                    <span>Creativity</span><span className="font-mono normal-case">{draft.temperature.toFixed(1)}</span>
                  </label>
                  <input id="temp" type="range" min={0} max={1.5} step={0.1} value={draft.temperature} onChange={(e) => set({ temperature: parseFloat(e.target.value) })} className="w-full" />
                  <div className="flex justify-between text-[10.5px] italic text-inkfaint"><span>precise</span><span>inventive</span></div>
                </div>
                <div>
                  <label className="smallcaps mb-1 block text-[10px] text-inksoft" htmlFor="maxtok">Max tokens · reply length</label>
                  <input id="maxtok" type="number" min={512} max={65536} step={512} value={draft.maxTokens} onChange={(e) => set({ maxTokens: Math.max(512, parseInt(e.target.value) || 8192) })} className="ink-input w-full rounded-md px-3 py-2 font-mono text-[13px]" />
                </div>
              </div>

              {preset.help && (
                <p className="flex gap-2 rounded-md border border-gilt/35 bg-parchdeep/40 px-3 py-2 text-[12.5px] leading-snug text-inksoft">
                  <Info size={14} className="mt-0.5 shrink-0 text-gilt" /> {preset.help}
                </p>
              )}

              <div className="flex items-center gap-3">
                <button onClick={test} disabled={testing} className="quill-btn flex items-center gap-2 rounded-md px-4 py-2 text-[10px]">
                  {testing ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />} Test the connection
                </button>
                {testing && <span className="text-[12.5px] italic text-inksoft">Sending a raven…</span>}
              </div>
            </div>
          )}

          {result && (
            <p className={`anim-fadein mt-3 flex gap-2 rounded-md border px-3 py-2 text-[13px] leading-snug ${result.ok ? "border-verdigris/50 bg-verdigris/10 text-verdigris" : "border-wax/50 bg-wax/8 text-waxdeep"}`}>
              {result.ok ? <CheckCircle2 size={15} className="mt-0.5 shrink-0" /> : <AlertTriangle size={15} className="mt-0.5 shrink-0" />}
              {result.msg}
            </p>
          )}
          {saveError && (
            <p className="anim-fadein mt-3 flex gap-2 rounded-md border border-wax/50 bg-wax/8 px-3 py-2 text-[13px] text-waxdeep">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {saveError}
            </p>
          )}

          <Divider className="my-4" glyph="✦" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="flex flex-1 items-start gap-1.5 text-[11.5px] leading-snug text-inkfaint">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-verdigris" />
              Thy key never leaves this browser save for the chosen endpoint. All settings live in local storage.
            </p>
            <div className="flex shrink-0 justify-end gap-2">
              <button onClick={onClose} className="quill-btn rounded-md px-4 py-2 text-[11px]">Cancel</button>
              <button onClick={save} className="wax-btn flex items-center gap-2 rounded-md px-5 py-2 text-[11px]">
                <Feather size={13} /> Bind this scribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
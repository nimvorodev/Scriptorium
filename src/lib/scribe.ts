import type { ChatMsg, Folio, FolioMeta, Settings } from "./types";
import { authHeaders, chatUrl, modelsUrl, presetById } from "./providers";
import { buildDemo } from "./demoApps";

export const SYSTEM_PROMPT = `You are the Scribe of the Scriptorium, a master craftsman who turns plain-language wishes into beautiful, working web pages for people who do not know how to code.

RULES OF THY CRAFT:
1. Begin with ONE or TWO short, warm sentences in lightly archaic but perfectly clear English (thee/thy sparingly). No headings, no lists.
2. Then output EXACTLY ONE fenced code block labelled html containing a COMPLETE, self-contained index.html file (doctype, head, inline <style> and <script>). Nothing after the block.
3. The page must be genuinely beautiful: thoughtful typography, a cohesive palette, generous spacing, subtle animations, hover states, and fully responsive from phone to desktop.
4. All logic must WORK: wire every button and input with vanilla JavaScript. Guard localStorage with try/catch. Never reference external images; use CSS art, gradients, emoji or inline SVG. A Google Fonts <link> is allowed.
5. When asked to refine, return the FULL updated file — never a fragment or a diff.
6. Never output more than one code block. Never explain the code unless asked.`;

/* ------------------------- message plumbing ------------------------- */

export interface WireMsg { role: "system" | "user" | "assistant"; content: string }

export function buildHistory(messages: ChatMsg[], folioById: (id: string) => Folio | undefined): WireMsg[] {
  const out: WireMsg[] = [];
  const recent = messages.filter((m) => !m.error && !m.streaming).slice(-10);
  for (const m of recent) {
    if (m.role === "user") out.push({ role: "user", content: m.text });
    else if (m.folioId) {
      const f = folioById(m.folioId);
      if (f) out.push({ role: "assistant", content: (m.text ? m.text + "\n\n" : "") + "```html\n" + f.code + "\n```" });
      else if (m.text) out.push({ role: "assistant", content: m.text });
    } else if (m.text) out.push({ role: "assistant", content: m.text });
  }
  return out;
}

export function stripFences(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/```[\s\S]*$/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function extractHtml(text: string): string | null {
  const blocks: string[] = [];
  const re = /```(?:html|xml)?[^\S\n]*\n?([\s\S]*?)(?:```|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) if (m[1] && m[1].includes("<")) blocks.push(m[1]);
  let code = blocks.sort((a, b) => b.length - a.length)[0];
  if (!code && /^\s*(<!doctype html|<html)/i.test(text)) code = text;
  if (!code) return null;
  code = code.trim();
  if (!/<html[\s>]/i.test(code)) {
    code = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Inscribed Page</title>\n</head>\n<body>\n${code}\n</body>\n</html>`;
  }
  return code;
}

export function injectErrorCatcher(code: string): string {
  const probe = `<script>(function(){function send(m){try{parent.postMessage({__SCRIPTORIUM__:1,type:'error',message:String(m).slice(0,300)},'*')}catch(e){}}
window.addEventListener('error',function(e){send(e.message||'A script error occurred')});
window.addEventListener('unhandledrejection',function(e){send((e.reason&&e.reason.message)||e.reason||'An unhandled promise rejection')});
var ce=console.error;console.error=function(){send(Array.prototype.slice.call(arguments).join(' '));ce.apply(console,arguments)};})();<\/script>`;
  if (/<head[^>]*>/i.test(code)) return code.replace(/<head[^>]*>/i, (h) => h + probe);
  if (/<html[^>]*>/i.test(code)) return code.replace(/<html[^>]*>/i, (h) => h + "<head>" + probe + "</head>");
  return probe + code;
}

/* --------------------------- friendly errors ------------------------ */

export function friendlyError(err: unknown, s: Settings): string {
  const p = presetById(s.providerId);
  const raw = err instanceof Error ? err.message : String(err);
  if (/aborted/i.test(raw)) return "The quill was stayed.";
  if (/failed to fetch|networkerror|load failed|err_connection/i.test(raw)) {
    if (p.local) return `I could not reach thy local server at ${s.baseUrl}. Is it running? ${p.help ?? ""}`;
    return `The messenger could not reach ${s.baseUrl || "the endpoint"}. Check thy connection, the URL, and whether the server permits browser (CORS) requests.`;
  }
  if (/\b401\b|unauthorized|invalid.*key|incorrect api key/i.test(raw)) return "The keeper of the gate refused thy key (401). Verify the API key in Bind Scribe.";
  if (/\b403\b|forbidden/i.test(raw)) return "Access forbidden (403). Thy key may lack permission for this model.";
  if (/\b404\b|not.?found/i.test(raw)) return "The endpoint or model was not found (404). Check the base URL and model name — “Scry models” can list what is available.";
  if (/\b429\b|rate|quota/i.test(raw)) return "The scribe is overworked (429 — rate limit or quota). Rest a moment, or check thy plan.";
  if (/max_tokens|context|too long/i.test(raw)) return "The request exceeded the model's limits. Try a shorter wish, or raise/lower max tokens in Bind Scribe.";
  return "The scribe faltered: " + raw;
}

/* ----------------------------- streaming ---------------------------- */

export async function streamChat(
  s: Settings,
  history: WireMsg[],
  onDelta: (chunk: string) => void,
  signal: AbortSignal,
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(chatUrl(s.baseUrl), {
      method: "POST",
      headers: authHeaders(s),
      signal,
      body: JSON.stringify({
        model: s.model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        temperature: s.temperature,
        max_tokens: s.maxTokens,
        stream: true,
      }),
    });
  } catch (e) {
    throw new Error(friendlyError(e, s));
  }
  if (!res.ok) {
    let detail = res.status + " " + res.statusText;
    try {
      const j = await res.json();
      detail = (j.error?.message ?? j.message ?? detail) + " (" + res.status + ")";
    } catch { /* ignore */ }
    throw new Error(friendlyError(new Error(detail), s));
  }

  const ctype = res.headers.get("content-type") ?? "";
  if (!ctype.includes("event-stream") || !res.body) {
    const j = await res.json();
    const content: string = j.choices?.[0]?.message?.content ?? j.choices?.[0]?.text ?? "";
    if (!content) throw new Error("The scribe returned an empty page. Try another model.");
    onDelta(content);
    return content;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith("data:")) continue;
      const payload = t.slice(5).trim();
      if (payload === "[DONE]") return full;
      try {
        const j = JSON.parse(payload);
        const delta: string = j.choices?.[0]?.delta?.content ?? j.choices?.[0]?.message?.content ?? "";
        if (delta) { full += delta; onDelta(delta); }
      } catch { /* partial json — skip */ }
    }
  }
  return full;
}

/* ------------------------- models & testing ------------------------- */

export async function fetchModels(s: Settings): Promise<string[]> {
  const res = await fetch(modelsUrl(s.baseUrl), { headers: authHeaders(s), signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(friendlyError(new Error(res.status + " " + res.statusText), s));
  const j = await res.json();
  const list = Array.isArray(j.data) ? j.data : Array.isArray(j.models) ? j.models : [];
  const ids = list
    .map((m: { id?: string; name?: string }) => m.id ?? m.name ?? "")
    .filter(Boolean)
    .map((id: string) => id.replace(/^models\//, ""))
    .sort() as string[];
  return [...new Set(ids)].slice(0, 200);
}

export async function testConnection(s: Settings): Promise<string> {
  const p = presetById(s.providerId);
  if (p.builtin) return "The offline scribe stands ready, quill in hand.";
  if (!s.baseUrl.trim()) throw new Error("Enter a base URL first — the address where thy scribe dwells.");
  try {
    const models = await fetchModels(s);
    return `The scribe answers! ${models.length} model${models.length === 1 ? "" : "s"} available at this endpoint.`;
  } catch (e) {
    // Some gateways hide /models — try a tiny completion instead.
    try {
      const res = await fetch(chatUrl(s.baseUrl), {
        method: "POST",
        headers: authHeaders(s),
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ model: s.model, messages: [{ role: "user", content: "Reply with the single word: ready" }], max_tokens: 8, stream: false }),
      });
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      return "The scribe answers! The model responded to a test summons.";
    } catch {
      throw new Error(friendlyError(e, s));
    }
  }
}

/* --------------------------- the offline scribe --------------------- */

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { clearTimeout(t); reject(new DOMException("Aborted", "AbortError")); }, { once: true });
  });

async function speak(text: string, onText: (c: string) => void, signal: AbortSignal) {
  const words = text.split(/(\s+)/);
  for (const w of words) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    onText(w);
    await sleep(16, signal);
  }
}

export interface DemoOutcome { title: string; code: string; meta: FolioMeta }

export async function demoGenerate(
  prompt: string,
  prevMeta: FolioMeta | undefined,
  onText: (c: string) => void,
  onCode: (c: string) => void,
  signal: AbortSignal,
): Promise<DemoOutcome> {
  const result = buildDemo(prompt, prevMeta);
  const lower = prompt.toLowerCase();

  let opener: string;
  if (result.refined) {
    const bits: string[] = [];
    if (/\b(dark|night|black|midnight)\b/.test(lower)) bits.push("shadows gathered");
    if (/\b(light|bright|day|white)\b/.test(lower)) bits.push("morning light restored");
    if (/\b(animat|motion|lively|alive)\w*/.test(lower)) bits.push("a livelier hand");
    if (Object.keys(result.meta).length && /crimson|red|orange|gold|amber|green|emerald|blue|azure|purple|violet|pink|rose|teal|cyan|yellow/.test(lower)) bits.push("fresh ink of thy chosen hue");
    opener = bits.length
      ? `As thou wishest — ${bits.join(", ")}. I take up the quill once more and re-inscribe “${result.title}”…`
      : `Very well — I re-inscribe “${result.title}” with thy words in mind. (The offline scribe's repertoire is finite; bind a cloud or local scribe for changes beyond dark, light, colours and motion.)`;
  } else {
    opener = `A fine wish! I shall inscribe “${result.title}” — dip the quill, steady the hand…`;
  }

  await sleep(350, signal);
  await speak(opener, onText, signal);
  await sleep(250, signal);

  const code = result.code;
  const step = 220;
  for (let i = 0; i < code.length; i += step) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    onCode(code.slice(i, i + step));
    await sleep(14, signal);
  }

  const closer = "\n\nIt is done. Behold the living page — and speak again if thou wouldst refine it. Try “make it dark”, “use emerald ink”, or “give it more motion”.";
  await speak(closer, onText, signal);
  return { title: result.title, code, meta: result.meta };
}
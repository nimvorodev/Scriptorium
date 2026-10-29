import type { ProviderPreset, Settings } from "./types";

export const PRESETS: ProviderPreset[] = [
  {
    id: "demo",
    name: "The Offline Scribe",
    tag: "Built-in · No key",
    blurb: "A scribe bound within this very page. Crafts from a repertoire of enchanted templates — perfect for thy first steps. No internet, no key, no cost.",
    baseUrl: "",
    model: "offline-repertoire",
    needsKey: false,
    builtin: true,
    help: "The offline scribe knows a fixed repertoire (to-dos, timers, games, palettes…). For boundless creations, bind one of the cloud or local scribes below.",
  },
  {
    id: "ollama",
    name: "Ollama",
    tag: "Local · No key",
    blurb: "Runs models on thine own machine. Private and free. Install Ollama, pull a model (e.g. llama3.2), and it serves an OpenAI-compatible endpoint.",
    baseUrl: "http://localhost:11434/v1",
    model: "llama3.2",
    needsKey: false,
    local: true,
    help: "If the browser cannot reach it, restart Ollama with cross-origin access allowed: OLLAMA_ORIGINS=\"*\" ollama serve",
  },
  {
    id: "lmstudio",
    name: "LM Studio",
    tag: "Local · No key",
    blurb: "A friendly desktop app for local models. Start its local server (Developer tab) and the Scriptorium will speak to it directly.",
    baseUrl: "http://localhost:1234/v1",
    model: "local-model",
    needsKey: false,
    local: true,
    help: "In LM Studio → Developer → Server, enable “CORS” so this page may connect. The model name usually does not matter.",
  },
  {
    id: "openai",
    name: "OpenAI",
    tag: "Cloud · Key",
    blurb: "The GPT family. Reliable, versatile, excellent at crafting complete pages from a single description.",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    needsKey: true,
    keyHint: "sk-…",
    help: "Create a key at platform.openai.com → API keys. It is stored only in thy browser.",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    tag: "Cloud · Key",
    blurb: "The Claude family, via Anthropic's OpenAI-compatible endpoint. Known for thoughtful, polished craftsmanship.",
    baseUrl: "https://api.anthropic.com/v1",
    model: "claude-sonnet-4-5",
    needsKey: true,
    keyHint: "sk-ant-…",
    help: "Create a key at console.anthropic.com. Browser access is enabled automatically by the Scriptorium.",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    tag: "Cloud · Key",
    blurb: "Google's Gemini models through their OpenAI-compatible gateway. A generous free tier for new scribes.",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.5-flash",
    needsKey: true,
    keyHint: "AIza…",
    help: "Create a key at aistudio.google.com → Get API key.",
  },
  {
    id: "groq",
    name: "Groq",
    tag: "Cloud · Key",
    blurb: "Astonishingly fast inference for open models. The quill barely touches the page before the ink is dry.",
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
    needsKey: true,
    keyHint: "gsk_…",
    help: "Create a key at console.groq.com. Free tier available.",
  },
  {
    id: "mistral",
    name: "Mistral",
    tag: "Cloud · Key",
    blurb: "European open-weight models with a fine hand for code. La Plateforme serves them via a standard endpoint.",
    baseUrl: "https://api.mistral.ai/v1",
    model: "mistral-large-latest",
    needsKey: true,
    keyHint: "…",
    help: "Create a key at console.mistral.ai → API keys.",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    tag: "Cloud · Key",
    blurb: "One key, hundreds of models — OpenAI, Anthropic, Meta, and many more, all through a single endpoint.",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "meta-llama/llama-3.3-70b-instruct",
    needsKey: true,
    keyHint: "sk-or-…",
    help: "Create a key at openrouter.ai → Keys. Model names look like “provider/model”. Use “Scry models” to browse them all.",
  },
  {
    id: "custom",
    name: "Custom Endpoint",
    tag: "Any · OpenAI-compatible",
    blurb: "Any server that speaks the OpenAI dialect — vLLM, llama.cpp, Jan, LocalAI, Together, DeepSeek, a proxy of thine own…",
    baseUrl: "",
    model: "",
    needsKey: false,
    keyHint: "optional",
    help: "Enter the base URL (usually ending in /v1). The Scriptorium will call {base}/chat/completions and {base}/models.",
  },
];

export const DEFAULT_SETTINGS: Settings = {
  providerId: "demo",
  baseUrl: "",
  apiKey: "",
  model: "offline-repertoire",
  temperature: 0.7,
  maxTokens: 8192,
};

export const presetById = (id: string): ProviderPreset =>
  PRESETS.find((p) => p.id === id) ?? PRESETS[0];

export function chatUrl(baseUrl: string): string {
  const b = baseUrl.trim().replace(/\/+$/, "");
  if (b.endsWith("/chat/completions")) return b;
  return b + "/chat/completions";
}

export function modelsUrl(baseUrl: string): string {
  const b = baseUrl.trim().replace(/\/+$/, "");
  if (b.endsWith("/chat/completions")) return b.replace(/\/chat\/completions$/, "/models");
  return b + "/models";
}

export function authHeaders(s: Settings): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (s.apiKey.trim()) h["Authorization"] = "Bearer " + s.apiKey.trim();
  if (s.baseUrl.includes("anthropic.com")) h["anthropic-dangerous-direct-browser-access"] = "true";
  if (s.baseUrl.includes("openrouter.ai")) {
    h["HTTP-Referer"] = typeof location !== "undefined" ? location.origin : "https://scriptorium.app";
    h["X-Title"] = "Scriptorium";
  }
  return h;
}

export function scribeLabel(s: Settings): string {
  const p = presetById(s.providerId);
  if (p.builtin) return "Offline Scribe";
  return p.name + (s.model ? " · " + s.model : "");
}
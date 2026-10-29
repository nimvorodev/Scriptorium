export type Role = "user" | "scribe";

export interface ChatMsg {
  id: string;
  role: Role;
  text: string;
  time: number;
  folioId?: string;
  error?: boolean;
  /** true while the scribe is still writing */
  streaming?: boolean;
  /** live line count while code streams in */
  codeLines?: number;
}

export interface FolioMeta {
  templateId?: string;
  dark?: boolean;
  accent?: string;
  motion?: boolean;
}

export interface Folio {
  id: string;
  n: number;
  title: string;
  prompt: string;
  code: string;
  time: number;
  scribe: string;
  meta?: FolioMeta;
}

export interface Settings {
  providerId: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface ProviderPreset {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  baseUrl: string;
  model: string;
  needsKey: boolean;
  local?: boolean;
  builtin?: boolean;
  keyHint?: string;
  help?: string;
}

export type Device = "desktop" | "tablet" | "phone";
export type MainView = "preview" | "code" | "folios";

export interface PageError {
  message: string;
  time: number;
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function roman(n: number): string {
  const table: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  let v = n;
  for (const [val, sym] of table) while (v >= val) { out += sym; v -= val; }
  return out || "I";
}

export const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
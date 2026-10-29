# Scriptorium — Vibe-Coding Atelier

Describe thy vision in plain words; the AI scribe inscribes working code.

Scriptorium is a browser-based "vibe-coding" studio: you type what you want
in normal English, an LLM writes a complete, self-contained HTML page, and
you get a live preview — no build step, no framework knowledge required.

It is themed as a medieval scriptorium, where the AI is the Scribe and your
projects are bound Folios. The whole thing ships as a single static
`index.html`, so it runs anywhere and keeps everything in the browser.

## Features

- Prompt-to-page: describe an app in plain words, get a working HTML file.
- Live preview pane with desktop / tablet / phone device toggles.
- Iterative refinement: keep chatting to tweak the current page.
- Built-in spellbook of starter prompts (to-dos, timers, ledgers, games…).
- Works with any OpenAI-compatible endpoint:
  - Offline built-in demo scribe (no key, no internet)
  - Local models via Ollama or LM Studio (private & free)
  - Cloud providers: OpenAI, Anthropic, and any compatible API
- Everything (settings, chat, folios) persists in localStorage.
- No backend, no account required — keys are stored only in the browser.

## Getting started

```bash
npm install
npm run dev      # start the dev server
```

Open the printed URL. Choose a scribe in the settings modal (the built-in
offline one needs nothing), type a wish, and watch it take shape.

Optional: open the local model providers by running Ollama or LM Studio with
CORS enabled (see the in-app help for each provider).

### Build a single-file bundle

```bash
npm run build
```

Output lands in `dist/index.html` as one self-contained file
(via `vite-plugin-singlefile`). Open it directly in a browser, host it on
any static server, or share it as a single file.

## Stack

React 19 + TypeScript + Vite 7 + Tailwind CSS 4, bundled to a single file.
No backend — all app state lives in `localStorage`.

## Project layout

```
src/
  App.tsx              # top-level state & orchestration
  components/          # TopBar, ChatPanel, PreviewPane, SettingsModal, Modals
  lib/
    providers.ts       # OpenAI-compatible provider presets + auth
    scribe.ts          # chat plumbing, streaming, HTML extraction
    demoApps.ts        # the built-in offline scribe's template repertoire
    spells.ts          # starter prompt spellbook
    types.ts
  assets/              # leather & parchment textures
```

## Notes / limitations (ponytail)

- The built-in "Offline Scribe" only knows its fixed template repertoire,
  use a real model (local or cloud) for boundless creations.
- `gitignore` is not included here; add `node_modules/`, `dist/` if you push
  this repo.

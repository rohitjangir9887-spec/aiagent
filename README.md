# Niva — Floating Voice AI Agent

तैरता हुआ voice + screen-share AI agent। NVIDIA NIM / Grok support, Hindi-first UI, desk workspace, 19 tasks.

## Features

- **Floating dock** — drag, minimize to orb, glass UI
- **Voice** — SpeechRecognition + TTS (hi-IN / en-US), hands-free mode
- **Screen share** — `getDisplayMedia` + JPEG snapshot for vision models
- **Desk** — notes / inbox / code / schedule (context injected into every query)
- **19 tasks** — explain screen, draft email, bug hunt, plan day, quiz, …
- **NVIDIA NIM** — OpenAI-compatible endpoint; falls back to xAI Grok or local demo
- **Bilingual** — Hindi default, English toggle
- **Focus timer**, copy last reply, clear chat

## Quick start

```bash
cd niva
npm install
npm run dev
```

Open http://localhost:5173

### API key

1. Settings tab → paste **NVIDIA NIM** key (`nvapi-…`)  
   or **xAI** key (`xai-…`)
2. Without a key the app still runs in **local demo** mode so you can try the UI.

NIM models used:
- Text: `meta/llama-3.1-70b-instruct`
- Vision (when screen shared): `meta/llama-3.2-90b-vision-instruct`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (0.0.0.0:5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Stack

- React 19 + Vite 6
- Zustand (persist)
- Lucide icons
- Web Speech API + getDisplayMedia
- Pure client-side (API key stays in localStorage)

## Project layout

```
src/
  App.tsx
  components/
    AgentDock.tsx   # floating panel + chat/tasks/settings
    DeskBoard.tsx   # editable workspace cards
  hooks/
    useVoice.ts
    useScreen.ts
  lib/
    ask.ts          # NIM / Grok client
    store.ts
    copy.ts         # hi / en strings
    tasks.ts
  index.css
```

Made for the request: screen share · floating window · chat · NVIDIA NIM · animations · many tasks · voice AI agent.

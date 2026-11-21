export type Lang = "hi" | "en";

export type Strings = {
  appName: string;
  tagline: string;
  chat: string;
  tasks: string;
  settings: string;
  desk: string;
  notes: string;
  inbox: string;
  code: string;
  schedule: string;
  placeholder: string;
  send: string;
  mic: string;
  stop: string;
  listening: string;
  thinking: string;
  speaking: string;
  clearChat: string;
  copyLast: string;
  screenShare: string;
  stopShare: string;
  float: string;
  minimize: string;
  expand: string;
  apiKey: string;
  apiKeyHint: string;
  model: string;
  voiceLang: string;
  handsFree: string;
  tts: string;
  lang: string;
  noKeyBanner: string;
  emptyChat: string;
  focusTimer: string;
  startFocus: string;
  stopFocus: string;
  viaNim: string;
  viaGrok: string;
  errorMic: string;
  errorScreen: string;
  errorApi: string;
  errorNoSpeech: string;
};

export const copy: Record<Lang, Strings> = {
  hi: {
    appName: "Niva",
    tagline: "आपका तैरता आवाज़ एजेंट",
    chat: "चैट",
    tasks: "टास्क",
    settings: "सेटिंग्स",
    desk: "डेस्क",
    notes: "नोट्स",
    inbox: "इनबॉक्स",
    code: "कोड",
    schedule: "शेड्यूल",
    placeholder: "कुछ पूछें या बोलें…",
    send: "भेजें",
    mic: "माइक",
    stop: "रोकें",
    listening: "सुन रही हूँ…",
    thinking: "सोच रही हूँ…",
    speaking: "बोल रही हूँ…",
    clearChat: "चैट साफ़",
    copyLast: "कॉपी",
    screenShare: "स्क्रीन शेयर",
    stopShare: "शेयर बंद",
    float: "फ्लोट",
    minimize: "मिनिमाइज़",
    expand: "खोलें",
    apiKey: "NVIDIA / xAI API Key",
    apiKeyHint: "NIM key डालें → NVIDIA लगेगा। खाली छोड़ें तो Grok (अगर XAI_API_KEY हो)।",
    model: "मॉडल",
    voiceLang: "आवाज़ भाषा",
    handsFree: "हैंड्स-फ्री",
    tts: "बोलकर जवाब",
    lang: "इंटरफ़ेस",
    noKeyBanner: "API key नहीं है — अभी Grok fallback चलेगा। Settings में key डालें।",
    emptyChat: "नमस्ते! मैं Niva हूँ। स्क्रीन शेयर करें, बोलें या टास्क चुनें।",
    focusTimer: "फोकस",
    startFocus: "25 मिनट शुरू",
    stopFocus: "टाइमर बंद",
    viaNim: "NIM",
    viaGrok: "Grok",
    errorMic: "माइक अनुमति नहीं मिली",
    errorScreen: "स्क्रीन शेयर नहीं हो सका",
    errorApi: "API त्रुटि",
    errorNoSpeech: "कुछ सुनाई नहीं दिया",
  },
  en: {
    appName: "Niva",
    tagline: "Your floating voice agent",
    chat: "Chat",
    tasks: "Tasks",
    settings: "Settings",
    desk: "Desk",
    notes: "Notes",
    inbox: "Inbox",
    code: "Code",
    schedule: "Schedule",
    placeholder: "Ask or speak…",
    send: "Send",
    mic: "Mic",
    stop: "Stop",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking…",
    clearChat: "Clear chat",
    copyLast: "Copy",
    screenShare: "Share screen",
    stopShare: "Stop share",
    float: "Float",
    minimize: "Minimize",
    expand: "Expand",
    apiKey: "NVIDIA / xAI API Key",
    apiKeyHint: "Paste NIM key for NVIDIA. Leave empty for Grok fallback if available.",
    model: "Model",
    voiceLang: "Voice language",
    handsFree: "Hands-free",
    tts: "Speak replies",
    lang: "Interface",
    noKeyBanner: "No API key — using Grok fallback. Add key in Settings.",
    emptyChat: "Hi! I'm Niva. Share screen, speak, or pick a task.",
    focusTimer: "Focus",
    startFocus: "Start 25 min",
    stopFocus: "Stop timer",
    viaNim: "NIM",
    viaGrok: "Grok",
    errorMic: "Mic permission denied",
    errorScreen: "Screen share failed",
    errorApi: "API error",
    errorNoSpeech: "No speech detected",
  },
};

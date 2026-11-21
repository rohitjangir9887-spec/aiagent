import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "./copy";

export type Via = "nim" | "grok" | "local";

export type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;
  via?: Via;
  hasImage?: boolean;
};

export type Desk = {
  notes: string;
  inbox: string;
  code: string;
  schedule: string;
};

type State = {
  messages: ChatMsg[];
  desk: Desk;
  apiKey: string;
  model: string;
  lang: Lang;
  voiceLang: "hi-IN" | "en-US";
  handsFree: boolean;
  ttsEnabled: boolean;
  minimized: boolean;
  // actions
  pushMessage: (msg: Omit<ChatMsg, "id" | "ts">) => void;
  clearMessages: () => void;
  setDesk: (key: keyof Desk, value: string) => void;
  setApiKey: (k: string) => void;
  setModel: (m: string) => void;
  setLang: (l: Lang) => void;
  setVoiceLang: (v: "hi-IN" | "en-US") => void;
  setHandsFree: (v: boolean) => void;
  setTtsEnabled: (v: boolean) => void;
  setMinimized: (v: boolean) => void;
};

const defaultDesk: Desk = {
  notes: "• आज का मुख्य लक्ष्य लिखें\n• कोई भी रफ आइडिया यहाँ",
  inbox: "• ईमेल / मैसेज के पॉइंट्स",
  code: "// paste code here",
  schedule: "10:00 – standup\n14:00 – deep work",
};

export const useNiva = create<State>()(
  persist(
    (set) => ({
      messages: [],
      desk: defaultDesk,
      apiKey: "",
      model: "meta/llama-3.1-70b-instruct",
      lang: "hi",
      voiceLang: "hi-IN",
      handsFree: false,
      ttsEnabled: true,
      minimized: false,

      pushMessage: (msg) =>
        set((s) => ({
          messages: [
            ...s.messages.slice(-40),
            { ...msg, id: crypto.randomUUID(), ts: Date.now() },
          ],
        })),

      clearMessages: () => set({ messages: [] }),

      setDesk: (key, value) =>
        set((s) => ({ desk: { ...s.desk, [key]: value } })),

      setApiKey: (apiKey) => set({ apiKey }),
      setModel: (model) => set({ model }),
      setLang: (lang) => set({ lang }),
      setVoiceLang: (voiceLang) => set({ voiceLang }),
      setHandsFree: (handsFree) => set({ handsFree }),
      setTtsEnabled: (ttsEnabled) => set({ ttsEnabled }),
      setMinimized: (minimized) => set({ minimized }),
    }),
    {
      name: "niva-v1",
      partialize: (s) => ({
        messages: s.messages.slice(-30),
        desk: s.desk,
        apiKey: s.apiKey,
        model: s.model,
        lang: s.lang,
        voiceLang: s.voiceLang,
        handsFree: s.handsFree,
        ttsEnabled: s.ttsEnabled,
      }),
    }
  )
);

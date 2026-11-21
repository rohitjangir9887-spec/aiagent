import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "idle" | "listening" | "speaking";

type Opts = {
  lang: string;
  handsFree: boolean;
  onFinal: (text: string) => void;
  onError?: (msg: string) => void;
};

export function useVoice({ lang, handsFree, onFinal, onError }: Opts) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [interim, setInterim] = useState("");
  const recRef = useRef<SpeechRecognition | null>(null);
  const holdRef = useRef(false); // prevent self-hearing during TTS
  const armedRef = useRef(false);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  const supported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {}
    setPhase("idle");
    setInterim("");
    armedRef.current = false;
  }, []);

  const start = useCallback(() => {
    if (!supported || holdRef.current) return;
    const SR =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    try {
      recRef.current?.abort();
    } catch {}

    const rec: SpeechRecognition = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setPhase("listening");
      setInterim("");
    };

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let final = "";
      let inter = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else inter += t;
      }
      if (inter) setInterim(inter);
      if (final.trim()) {
        setInterim("");
        onFinalRef.current(final.trim());
      }
    };

    rec.onerror = (e: any) => {
      if (e.error === "no-speech") onError?.("no-speech");
      else if (e.error === "not-allowed") onError?.("mic");
      setPhase("idle");
      setInterim("");
    };

    rec.onend = () => {
      setPhase("idle");
      setInterim("");
      // hands-free re-arm
      if (armedRef.current && handsFree && !holdRef.current) {
        setTimeout(() => {
          if (armedRef.current && !holdRef.current) start();
        }, 400);
      }
    };

    recRef.current = rec;
    try {
      rec.start();
      armedRef.current = true;
    } catch {
      setPhase("idle");
    }
  }, [supported, lang, handsFree, onError]);

  const hold = useCallback(() => {
    holdRef.current = true;
    try {
      recRef.current?.stop();
    } catch {}
  }, []);

  const release = useCallback(() => {
    holdRef.current = false;
    if (armedRef.current && handsFree) {
      setTimeout(() => {
        if (!holdRef.current) start();
      }, 300);
    }
  }, [handsFree, start]);

  const speak = useCallback(
    (text: string, voiceLang: string) => {
      if (!window.speechSynthesis) return;
      hold();
      setPhase("speaking");
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = voiceLang;
      u.rate = 1.02;
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang.startsWith(voiceLang.slice(0, 2)));
      if (match) u.voice = match;
      u.onend = () => {
        setPhase("idle");
        release();
      };
      u.onerror = () => {
        setPhase("idle");
        release();
      };
      window.speechSynthesis.speak(u);
    },
    [hold, release]
  );

  const toggle = useCallback(() => {
    if (phase === "listening") stop();
    else start();
  }, [phase, start, stop]);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.abort();
      } catch {}
      window.speechSynthesis?.cancel();
    };
  }, []);

  return {
    supported,
    phase,
    interim,
    start,
    stop,
    toggle,
    speak,
    hold,
    release,
  };
}

// minimal types for browsers that still use webkit prefix
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

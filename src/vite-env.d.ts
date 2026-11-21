/// <reference types="vite/client" />

// The Web Speech API is supported by some browsers but is not included in
// every TypeScript DOM library version. These narrow ambient types keep the
// speech feature typed without assuming that all browsers support it.
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; [index: number]: { transcript: string } }>;
}

declare var SpeechRecognition: {
  new (): SpeechRecognition;
  readonly prototype: SpeechRecognition;
};

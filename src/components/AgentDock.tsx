import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Mic,
  MicOff,
  Send,
  Minimize2,
  Monitor,
  MonitorOff,
  Settings,
  MessageSquare,
  LayoutGrid,
  Trash2,
  Copy,
  Timer,
  Eye,
  ArrowRight,
  Mail,
  FileText,
  Bug,
  Languages,
  Calendar,
  Briefcase,
  HelpCircle,
  Sparkles,
  Code,
  Lightbulb,
  ClipboardList,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { useNiva } from "../lib/store";
import { copy } from "../lib/copy";
import { TASKS } from "../lib/tasks";
import { useVoice } from "../hooks/useVoice";
import { useScreen } from "../hooks/useScreen";
import { askAgent } from "../lib/ask";

const ICONS: Record<string, ElementType> = {
  Eye,
  ArrowRight,
  Mail,
  FileText,
  Bug,
  Languages,
  Calendar,
  Briefcase,
  HelpCircle,
  Sparkles,
  Code,
  Lightbulb,
  ClipboardList,
  MessageCircle,
  BookOpen,
  Trash2,
  Timer,
  Copy,
};

type Tab = "chat" | "tasks" | "settings";

export function AgentDock() {
  const messages = useNiva((s) => s.messages);
  const pushMessage = useNiva((s) => s.pushMessage);
  const clearMessages = useNiva((s) => s.clearMessages);
  const desk = useNiva((s) => s.desk);
  const apiKey = useNiva((s) => s.apiKey);
  const setApiKey = useNiva((s) => s.setApiKey);
  const model = useNiva((s) => s.model);
  const setModel = useNiva((s) => s.setModel);
  const lang = useNiva((s) => s.lang);
  const setLang = useNiva((s) => s.setLang);
  const voiceLang = useNiva((s) => s.voiceLang);
  const setVoiceLang = useNiva((s) => s.setVoiceLang);
  const handsFree = useNiva((s) => s.handsFree);
  const setHandsFree = useNiva((s) => s.setHandsFree);
  const ttsEnabled = useNiva((s) => s.ttsEnabled);
  const setTtsEnabled = useNiva((s) => s.setTtsEnabled);
  const minimized = useNiva((s) => s.minimized);
  const setMinimized = useNiva((s) => s.setMinimized);

  const t = copy[lang];
  const [tab, setTab] = useState<Tab>("chat");
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [focusLeft, setFocusLeft] = useState(0);
  const [pos, setPos] = useState({ x: 24, y: 80 });
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ticket = useRef(0);
  const thinkingRef = useRef(false);
  const videoEl = useRef<HTMLVideoElement>(null);

  const screen = useScreen();

  const flash = (msg: string) => {
    setNote(msg);
    setTimeout(() => setNote(null), 3200);
  };

  const run = useCallback(
    async (text: string, forceScreen: boolean) => {
      const trimmed = text.trim();
      if (!trimmed || thinkingRef.current) {
        voice.release();
        return;
      }
      const mine = ++ticket.current;
      thinkingRef.current = true;
      setThinking(true);
      voice.hold();

      pushMessage({ role: "user", text: trimmed });

      let image: string | null = null;
      if (forceScreen || screen.sharing) {
        image = await screen.snapshot();
      }

      const deskBlock = [
        desk.notes && `NOTES:\n${desk.notes}`,
        desk.inbox && `INBOX:\n${desk.inbox}`,
        desk.code && `CODE:\n${desk.code}`,
        desk.schedule && `SCHEDULE:\n${desk.schedule}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const history = [
        ...useNiva.getState().messages.slice(-8).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.text,
        })),
        {
          role: "user" as const,
          content: deskBlock
            ? `${trimmed}\n\n---\nDESK CONTEXT:\n${deskBlock}`
            : trimmed,
        },
      ];

      const result = await askAgent({
        apiKey,
        model,
        messages: history,
        imageDataUrl: image,
      });

      if (mine !== ticket.current) return;

      if (result.ok) {
        pushMessage({
          role: "assistant",
          text: result.text,
          via: result.via,
          hasImage: Boolean(image),
        });
        if (ttsEnabled) {
          voice.speak(result.text, voiceLang);
        } else {
          voice.release();
        }
      } else {
        flash(`${t.errorApi}: ${result.error}`);
        voice.release();
      }

      thinkingRef.current = false;
      setThinking(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiKey, model, desk, screen, ttsEnabled, voiceLang, t]
  );

  const voice = useVoice({
    lang: voiceLang,
    handsFree,
    onFinal: (text) => void run(text, false),
    onError: (code) => {
      if (code === "mic") flash(t.errorMic);
      if (code === "no-speech") flash(t.errorNoSpeech);
    },
  });

  // auto-scroll
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  // focus timer
  useEffect(() => {
    if (focusLeft <= 0) return;
    const id = setInterval(() => {
      setFocusLeft((s) => {
        if (s <= 1) {
          flash(lang === "hi" ? "फोकस पूरा!" : "Focus done!");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [focusLeft > 0, lang]);

  // attach video
  useEffect(() => {
    screen.attach(videoEl.current);
  }, [screen.sharing, minimized]);

  // drag
  const onPointerDown = (e: ReactPointerEvent) => {
    if ((e.target as HTMLElement).closest("button, textarea, input, a, label"))
      return;
    dragRef.current = {
      dx: e.clientX - pos.x,
      dy: e.clientY - pos.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    const nx = Math.max(8, Math.min(window.innerWidth - 80, e.clientX - dragRef.current.dx));
    const ny = Math.max(8, Math.min(window.innerHeight - 80, e.clientY - dragRef.current.dy));
    setPos({ x: nx, y: ny });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onTask = async (id: string) => {
    const task = TASKS.find((x) => x.id === id);
    if (!task) return;
    if (task.local === "clear") {
      clearMessages();
      return;
    }
    if (task.local === "focus") {
      setFocusLeft(25 * 60);
      flash(lang === "hi" ? "25 मिनट फोकस शुरू" : "25 min focus started");
      return;
    }
    if (task.local === "copy") {
      const last = [...messages].reverse().find((m) => m.role === "assistant");
      if (last) {
        await navigator.clipboard.writeText(last.text);
        flash(lang === "hi" ? "कॉपी हो गया" : "Copied");
      }
      return;
    }
    setTab("chat");
    await run(task.prompt, Boolean(task.wantsScreen));
  };

  const submit = () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    void run(text, false);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // ── minimized orb ──────────────────────────────────────
  if (minimized) {
    return (
      <button
        className="niva-orb"
        style={{ left: pos.x, top: pos.y }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={() => setMinimized(false)}
        aria-label={t.expand}
      >
        <span className="orb-ring" />
        <span className="orb-core">N</span>
        {(voice.phase === "listening" || thinking) && (
          <span className="orb-pulse" />
        )}
      </button>
    );
  }

  // ── full dock ──────────────────────────────────────────
  return (
    <div
      className="agent-dock"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* hidden video for screen capture */}
      <video
        ref={videoEl}
        muted
        playsInline
        className="screen-video"
        style={{ display: screen.sharing ? "block" : "none" }}
      />

      <header className="dock-header">
        <div className="brand">
          <span className="logo">N</span>
          <div>
            <strong>{t.appName}</strong>
            <small>{t.tagline}</small>
          </div>
        </div>
        <div className="header-actions">
          {focusLeft > 0 && (
            <span className="focus-pill">
              <Timer size={12} /> {fmt(focusLeft)}
            </span>
          )}
          <button
            type="button"
            title={screen.sharing ? t.stopShare : t.screenShare}
            onClick={async () => {
              if (screen.sharing) screen.stop();
              else {
                const ok = await screen.start();
                if (!ok) flash(t.errorScreen);
              }
            }}
          >
            {screen.sharing ? <MonitorOff size={16} /> : <Monitor size={16} />}
          </button>
          <button type="button" title={t.minimize} onClick={() => setMinimized(true)}>
            <Minimize2 size={16} />
          </button>
        </div>
      </header>

      {!apiKey && (
        <div className="banner">{t.noKeyBanner}</div>
      )}

      {note && <div className="flash">{note}</div>}

      <nav className="tabs">
        {(
          [
            ["chat", MessageSquare, t.chat],
            ["tasks", LayoutGrid, t.tasks],
            ["settings", Settings, t.settings],
          ] as const
        ).map(([id, Icon, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? "active" : ""}
            onClick={() => setTab(id)}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </nav>

      <div className="dock-body">
        {tab === "chat" && (
          <div className="chat-pane">
            <div className="messages" ref={listRef}>
              {messages.length === 0 && (
                <div className="empty">{t.emptyChat}</div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`bubble ${m.role}${m.hasImage ? " has-img" : ""}`}
                >
                  <p>{m.text}</p>
                  {m.via && m.role === "assistant" && (
                    <span className="via">
                      {m.via === "nim" ? t.viaNim : m.via === "grok" ? t.viaGrok : "local"}
                    </span>
                  )}
                </div>
              ))}
              {thinking && (
                <div className="bubble assistant thinking">
                  <span className="dots">
                    <i /><i /><i />
                  </span>
                  {t.thinking}
                </div>
              )}
              {voice.phase === "listening" && voice.interim && (
                <div className="bubble user interim">{voice.interim}</div>
              )}
            </div>

            <div className="composer">
              <textarea
                rows={1}
                value={input}
                placeholder={
                  voice.phase === "listening"
                    ? t.listening
                    : voice.phase === "speaking"
                      ? t.speaking
                      : t.placeholder
                }
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
              />
              <button
                type="button"
                className={`mic ${voice.phase === "listening" ? "on" : ""}`}
                onClick={voice.toggle}
                disabled={!voice.supported}
                title={voice.phase === "listening" ? t.stop : t.mic}
              >
                {voice.phase === "listening" ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="button"
                className="send"
                onClick={submit}
                disabled={thinking || !input.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {tab === "tasks" && (
          <div className="tasks-grid">
            {TASKS.map((task) => {
              const Icon = ICONS[task.icon] || Sparkles;
              return (
                <button
                  key={task.id}
                  type="button"
                  className="task-card"
                  onClick={() => void onTask(task.id)}
                >
                  <Icon size={18} />
                  <span>{lang === "hi" ? task.labelHi : task.labelEn}</span>
                </button>
              );
            })}
          </div>
        )}

        {tab === "settings" && (
          <div className="settings">
            <label>
              <span>{t.apiKey}</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="nvapi-… or xai-…"
              />
              <small>{t.apiKeyHint}</small>
            </label>

            <label>
              <span>{t.model}</span>
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="meta/llama-3.1-70b-instruct">Llama 3.1 70B</option>
                <option value="meta/llama-3.1-405b-instruct">Llama 3.1 405B</option>
                <option value="meta/llama-3.2-90b-vision-instruct">
                  Llama 3.2 90B Vision
                </option>
                <option value="google/gemma-2-27b-it">Gemma 2 27B</option>
                <option value="mistralai/mistral-large">Mistral Large</option>
              </select>
            </label>

            <label>
              <span>{t.lang}</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "hi" | "en")}
              >
                <option value="hi">हिन्दी</option>
                <option value="en">English</option>
              </select>
            </label>

            <label>
              <span>{t.voiceLang}</span>
              <select
                value={voiceLang}
                onChange={(e) =>
                  setVoiceLang(e.target.value as "hi-IN" | "en-US")
                }
              >
                <option value="hi-IN">हिन्दी (hi-IN)</option>
                <option value="en-US">English (en-US)</option>
              </select>
            </label>

            <label className="toggle-row">
              <span>{t.handsFree}</span>
              <input
                type="checkbox"
                checked={handsFree}
                onChange={(e) => setHandsFree(e.target.checked)}
              />
            </label>

            <label className="toggle-row">
              <span>{t.tts}</span>
              <input
                type="checkbox"
                checked={ttsEnabled}
                onChange={(e) => setTtsEnabled(e.target.checked)}
              />
            </label>

            <div className="settings-actions">
              <button type="button" onClick={() => clearMessages()}>
                <Trash2 size={14} /> {t.clearChat}
              </button>
              <button
                type="button"
                onClick={() => {
                  const last = [...messages]
                    .reverse()
                    .find((m) => m.role === "assistant");
                  if (last) navigator.clipboard.writeText(last.text);
                }}
              >
                <Copy size={14} /> {t.copyLast}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

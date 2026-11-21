import { useState } from "react";
import { AgentDock } from "./components/AgentDock";
import { DeskBoard } from "./components/DeskBoard";
import { useNiva } from "./lib/store";
import { copy } from "./lib/copy";
import { PanelLeft, PanelLeftClose } from "lucide-react";

export default function App() {
  const lang = useNiva((s) => s.lang);
  const t = copy[lang];
  const [deskOpen, setDeskOpen] = useState(true);

  return (
    <div className={`niva-frame${deskOpen ? " is-open" : ""}`}>
      <header className="top-bar">
        <div className="top-brand">
          <span className="mark">N</span>
          <div>
            <strong>{t.appName}</strong>
            <small>{t.tagline}</small>
          </div>
        </div>
        <button
          type="button"
          className="desk-toggle"
          onClick={() => setDeskOpen((v) => !v)}
        >
          {deskOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          {t.desk}
        </button>
      </header>

      <main className="workspace">
        <DeskBoard open={deskOpen} />
      </main>

      <AgentDock />
    </div>
  );
}

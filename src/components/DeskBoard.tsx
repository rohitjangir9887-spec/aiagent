import { useNiva } from "../lib/store";
import { copy } from "../lib/copy";

export function DeskBoard({ open }: { open: boolean }) {
  const desk = useNiva((s) => s.desk);
  const setDesk = useNiva((s) => s.setDesk);
  const lang = useNiva((s) => s.lang);
  const t = copy[lang];

  if (!open) return null;

  const fields: { key: keyof typeof desk; label: string }[] = [
    { key: "notes", label: t.notes },
    { key: "inbox", label: t.inbox },
    { key: "code", label: t.code },
    { key: "schedule", label: t.schedule },
  ];

  return (
    <div className="desk-pad is-open">
      <div className="desk-grid">
        {fields.map((f) => (
          <label key={f.key} className="desk-card">
            <span className="desk-label">{f.label}</span>
            <textarea
              value={desk[f.key]}
              onChange={(e) => setDesk(f.key, e.target.value)}
              spellCheck={false}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

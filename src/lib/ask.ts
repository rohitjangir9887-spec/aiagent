import type { Via } from "./store";

export type AskInput = {
  apiKey: string;
  model: string;
  messages: { role: "user" | "assistant" | "system"; content: string | ContentPart[] }[];
  imageDataUrl?: string | null;
};

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export type AskResult =
  | { ok: true; text: string; via: Via }
  | { ok: false; error: string };

const VISION_MODEL = "meta/llama-3.2-90b-vision-instruct";
const NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const GROK_URL = "https://api.x.ai/v1/chat/completions";

const SYSTEM = `You are Niva, a helpful floating voice AI agent. 
Reply in the same language the user is using (Hindi or English). 
Keep answers concise, practical and friendly — suitable for spoken replies.
When a screen image is provided, carefully describe what you see and base advice on it.
Use the desk context (notes, inbox, code, schedule) when relevant.`;

function toPayload(
  messages: AskInput["messages"],
  imageDataUrl?: string | null
) {
  const out: { role: string; content: string | ContentPart[] }[] = [
    { role: "system", content: SYSTEM },
  ];

  for (const m of messages) {
    if (m.role === "user" && imageDataUrl && m === messages[messages.length - 1]) {
      out.push({
        role: "user",
        content: [
          { type: "text", text: typeof m.content === "string" ? m.content : "" },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      });
    } else {
      out.push({
        role: m.role,
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      });
    }
  }
  return out;
}

async function complete(
  url: string,
  key: string,
  body: object
): Promise<{ text: string } | { error: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        ...body,
        temperature: 0.6,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return { error: `${res.status}: ${t.slice(0, 180)}` };
    }

    const data = await res.json();
    const text =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      "";
    if (!text) return { error: "Empty response" };
    return { text: String(text).trim() };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function askAgent(input: AskInput): Promise<AskResult> {
  const hasImage = Boolean(input.imageDataUrl);
  const model = hasImage ? VISION_MODEL : input.model || "meta/llama-3.1-70b-instruct";
  const payload = {
    model,
    messages: toPayload(input.messages, input.imageDataUrl),
  };

  // Prefer NVIDIA NIM when key looks present
  if (input.apiKey && input.apiKey.length > 8) {
    const r = await complete(NIM_URL, input.apiKey, payload);
    if ("text" in r) return { ok: true, text: r.text, via: "nim" };
    // fall through to Grok on NIM failure
  }

  // Grok fallback — uses same key field if user pasted xAI key, or empty
  const grokKey = input.apiKey || "";
  if (grokKey) {
    const r = await complete(GROK_URL, grokKey, {
      ...payload,
      model: hasImage ? "grok-2-vision-1212" : "grok-2-1212",
    });
    if ("text" in r) return { ok: true, text: r.text, via: "grok" };
    return { ok: false, error: r.error };
  }

  // Last resort: local mock so UI still works without keys
  return {
    ok: true,
    text:
      "API key नहीं मिली। Settings में NVIDIA NIM या xAI key डालें, फिर से कोशिश करें।\n\n(Demo) मैं Niva हूँ — स्क्रीन, आवाज़ और टास्क तैयार हैं।",
    via: "local",
  };
}

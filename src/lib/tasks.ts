export type Task = {
  id: string;
  icon: string;
  labelHi: string;
  labelEn: string;
  prompt: string;
  wantsScreen?: boolean;
  local?: "clear" | "focus" | "copy";
};

export const TASKS: Task[] = [
  {
    id: "explain-screen",
    icon: "Eye",
    labelHi: "स्क्रीन समझाओ",
    labelEn: "Explain screen",
    prompt:
      "Look at the shared screen image carefully. Explain what is visible, the main UI elements, and what the user might be doing. Be concise and practical.",
    wantsScreen: true,
  },
  {
    id: "next-step",
    icon: "ArrowRight",
    labelHi: "अगला कदम",
    labelEn: "Next step",
    prompt:
      "Based on the desk notes and any screen context, suggest the single most useful next action the user should take right now. Keep it short.",
  },
  {
    id: "draft-email",
    icon: "Mail",
    labelHi: "ईमेल ड्राफ्ट",
    labelEn: "Draft email",
    prompt:
      "Using the desk notes and inbox context, draft a clear professional email. Include subject line and body. Match the language the user is using.",
  },
  {
    id: "summarize-hi",
    icon: "FileText",
    labelHi: "हिंदी सारांश",
    labelEn: "Hindi summary",
    prompt:
      "Summarize the current desk notes, inbox and recent chat into a short Hindi paragraph. Be clear and useful.",
  },
  {
    id: "summarize-en",
    icon: "FileText",
    labelHi: "English summary",
    labelEn: "English summary",
    prompt:
      "Summarize the current desk notes, inbox and recent chat into a short English paragraph. Be clear and useful.",
  },
  {
    id: "bug-hunt",
    icon: "Bug",
    labelHi: "बग ढूँढो",
    labelEn: "Find bugs",
    prompt:
      "Look at the code on the desk (and screen if shared). List possible bugs, edge cases and improvements. Be specific.",
    wantsScreen: true,
  },
  {
    id: "translate",
    icon: "Languages",
    labelHi: "अनुवाद",
    labelEn: "Translate",
    prompt:
      "Translate the most recent user message or selected desk text. If Hindi → English, if English → Hindi. Keep meaning exact.",
  },
  {
    id: "plan-day",
    icon: "Calendar",
    labelHi: "दिन योजना",
    labelEn: "Plan day",
    prompt:
      "Using the schedule and notes on the desk, create a realistic prioritized plan for the rest of the day. Use short bullet points.",
  },
  {
    id: "formal-mail",
    icon: "Briefcase",
    labelHi: "औपचारिक पत्र",
    labelEn: "Formal letter",
    prompt:
      "Write a formal letter or email based on the desk notes. Proper greeting, body, closing. Match the user's language.",
  },
  {
    id: "quiz-me",
    icon: "HelpCircle",
    labelHi: "मुझसे पूछो",
    labelEn: "Quiz me",
    prompt:
      "Based on the desk notes or code, ask me 3 short quiz questions to test understanding. Wait for answers one by one.",
  },
  {
    id: "improve-text",
    icon: "Sparkles",
    labelHi: "टेक्स्ट सुधारो",
    labelEn: "Improve text",
    prompt:
      "Take the notes or last message and rewrite it to be clearer, more professional and concise. Show before → after.",
  },
  {
    id: "code-review",
    icon: "Code",
    labelHi: "कोड रिव्यू",
    labelEn: "Code review",
    prompt:
      "Review the code on the desk. Point out issues, suggest better patterns, and give a short improved version if useful.",
    wantsScreen: true,
  },
  {
    id: "brainstorm",
    icon: "Lightbulb",
    labelHi: "आइडिया दो",
    labelEn: "Brainstorm",
    prompt:
      "Brainstorm 5 practical ideas related to the current desk notes or the user's last request. Keep them actionable.",
  },
  {
    id: "meeting-notes",
    icon: "ClipboardList",
    labelHi: "मीटिंग नोट्स",
    labelEn: "Meeting notes",
    prompt:
      "Turn the desk notes / inbox into clean meeting notes with decisions, action items and owners.",
  },
  {
    id: "tweet",
    icon: "MessageCircle",
    labelHi: "ट्वीट बनाओ",
    labelEn: "Make a tweet",
    prompt:
      "Write a short, engaging post (tweet-style) based on the desk notes. Max 280 characters. Match language.",
  },
  {
    id: "explain-simple",
    icon: "BookOpen",
    labelHi: "आसान भाषा में",
    labelEn: "Explain simply",
    prompt:
      "Explain the most complex thing on the desk or last message in very simple language, as if teaching a beginner.",
  },
  // Local tasks
  {
    id: "clear",
    icon: "Trash2",
    labelHi: "चैट साफ़ करो",
    labelEn: "Clear chat",
    prompt: "",
    local: "clear",
  },
  {
    id: "focus",
    icon: "Timer",
    labelHi: "फोकस टाइमर",
    labelEn: "Focus timer",
    prompt: "",
    local: "focus",
  },
  {
    id: "copy",
    icon: "Copy",
    labelHi: "आखिरी जवाब कॉपी",
    labelEn: "Copy last reply",
    prompt: "",
    local: "copy",
  },
];

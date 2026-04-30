"use client";

import { useWizardStore } from "@/lib/store/wizard-store";

export default function WizardStepLanguage() {
  const { answers, updateAnswers } = useWizardStore();
  const selected = (answers.language as string) || "en";

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">What's your primary language?</h2>
      <div className="space-y-3">
        {[
          { value: "en", label: "English", flagEmoji: "🇺🇸" },
          { value: "ar", label: "Arabic (العربية)", flagEmoji: "🇸🇦" },
        ].map((lang) => (
          <button
            key={lang.value}
            onClick={() => updateAnswers("language", lang.value)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
              selected === lang.value
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="text-2xl">{lang.flagEmoji}</span>
            <span className="font-medium text-slate-900">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

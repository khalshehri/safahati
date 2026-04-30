"use client";

import { useWizardStore } from "@/lib/store/wizard-store";

interface WizardStepLanguageProps {
  isRTL: boolean;
  onLanguageChange: (lang: "ar" | "en") => void;
}

export default function WizardStepLanguage({
  isRTL,
  onLanguageChange,
}: WizardStepLanguageProps) {
  const { answers, updateAnswers } = useWizardStore();

  const handleChange = (lang: "ar" | "en") => {
    updateAnswers("language", lang);
    onLanguageChange(lang);
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-1">
          {isRTL ? "اختر اللغة" : "Select language"}
        </h2>
        <p className="text-sm text-gray-600">
          {isRTL ? "ما اللغة التي تفضل استخدامها؟" : "Which language will you use?"}
        </p>
      </div>

      <div className="space-y-3">
        {[
          { code: "en", label: "English", flag: "🇺🇸" },
          { code: "ar", label: "العربية", flag: "🇸🇦" },
        ].map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code as "ar" | "en")}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all
              ${
                answers.language === lang.code
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <span className="text-2xl mr-3">{lang.flag}</span>
            <span className="font-medium text-gray-900">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

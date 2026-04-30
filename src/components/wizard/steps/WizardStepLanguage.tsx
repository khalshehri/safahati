"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import { motion } from "framer-motion";

interface WizardStepLanguageProps {
  isRTL: boolean;
}

export default function WizardStepLanguage({
  isRTL,
}: WizardStepLanguageProps) {
  const { answers, updateAnswers } = useWizardStore();

  const handleChange = (lang: "ar" | "en") => {
    updateAnswers("language", lang);
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-[#111] mb-3">
          {isRTL ? "اختر اللغة" : "What language is your website in?"}
        </h1>
        <p className="text-base text-gray-500">
          {isRTL ? "تحديد لغة موقعك الرئيسية" : "This sets your website's primary language"}
        </p>
      </div>

      {/* Language Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { code: "en", label: "English", labelAr: "الإنجليزية", flag: "🇺🇸", dir: "LTR" },
          { code: "ar", label: "العربية", labelAr: "اللغة العربية", flag: "🇸🇦", dir: "RTL" },
        ].map((lang) => (
          <motion.button
            key={lang.code}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChange(lang.code as "ar" | "en")}
            className={`h-32 p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
              answers.language === lang.code
                ? "border-sky-500 bg-sky-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-5xl">{lang.flag}</span>
            <div className="text-center">
              <p className={`text-lg font-bold ${
                answers.language === lang.code ? "text-sky-700" : "text-[#111]"
              }`}>
                {isRTL ? lang.labelAr : lang.label}
              </p>
              <p className={`text-xs ${
                answers.language === lang.code ? "text-sky-600" : "text-gray-500"
              }`}>
                {lang.dir}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

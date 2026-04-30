"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import StepCard from "../components/StepCard";
import { motion } from "framer-motion";

interface WizardStepLanguageProps {
  isRTL: boolean;
  onLanguageChange: (lang: "ar" | "en") => void;
}

export default function WizardStepLanguage({
  isRTL,
  onLanguageChange,
}: WizardStepLanguageProps) {
  const { answers, updateAnswers } = useWizardStore();

  const handleLanguageChange = (lang: "ar" | "en") => {
    updateAnswers("language", lang);
    onLanguageChange(lang);
  };

  return (
    <StepCard
      title={isRTL ? "اختر اللغة" : "Choose Your Language"}
      subtitle={isRTL ? "أي لغة تفضل لموقعك؟" : "Which language will you use?"}
      isRTL={isRTL}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* English Option */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLanguageChange("en")}
            className={`
              p-8 rounded-xl border-2 transition-all duration-300
              flex flex-col items-center justify-center gap-4
              text-center
              ${
                answers.language === "en"
                  ? "border-[#D4894C] bg-orange-50 shadow-lg"
                  : "border-[#E8DFD5] bg-white hover:border-[#D4894C]"
              }
            `}
          >
            <span className="text-4xl">🇺🇸</span>
            <div>
              <p className="text-lg font-semibold text-[#2D3436]">English</p>
              <p className="text-sm text-[#8B7D6F] mt-1">Left-to-Right (LTR)</p>
            </div>
            {answers.language === "en" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 text-sm font-medium text-[#D4894C]"
              >
                ✓ Selected
              </motion.div>
            )}
          </motion.button>

          {/* Arabic Option */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLanguageChange("ar")}
            className={`
              p-8 rounded-xl border-2 transition-all duration-300
              flex flex-col items-center justify-center gap-4
              text-center
              ${
                answers.language === "ar"
                  ? "border-[#D4894C] bg-orange-50 shadow-lg"
                  : "border-[#E8DFD5] bg-white hover:border-[#D4894C]"
              }
            `}
          >
            <span className="text-4xl">🇸🇦</span>
            <div>
              <p className="text-lg font-semibold text-[#2D3436]">العربية</p>
              <p className="text-sm text-[#8B7D6F] mt-1">Right-to-Left (RTL)</p>
            </div>
            {answers.language === "ar" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 text-sm font-medium text-[#D4894C]"
              >
                ✓ مختار
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-blue-50 rounded-lg border border-[#6B8FB3] border-opacity-30"
        >
          <p className="text-sm text-[#2D3436]">
            {isRTL
              ? "🌍 يمكنك تغيير اللغة لاحقاً في إعدادات الموقع"
              : "🌍 You can change the language later in site settings"}
          </p>
        </motion.div>
      </div>
    </StepCard>
  );
}

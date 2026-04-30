"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import StepCard from "../components/StepCard";
import { motion } from "framer-motion";
import { Edit2, Check } from "lucide-react";

interface WizardStepReviewProps {
  isRTL: boolean;
  onEditStep?: (step: number) => void;
}

export default function WizardStepReview({
  isRTL,
  onEditStep,
}: WizardStepReviewProps) {
  const { answers } = useWizardStore();

  const reviewItems = [
    {
      id: "business",
      label: isRTL ? "العمل" : "Business",
      value: `${answers.businessType} - ${answers.businessName}`,
      step: 0,
    },
    {
      id: "location",
      label: isRTL ? "الموقع" : "Location",
      value: answers.city,
      step: 1,
    },
    {
      id: "phone",
      label: isRTL ? "الهاتف" : "Phone",
      value: answers.phone,
      step: 1,
    },
    {
      id: "brand",
      label: isRTL ? "لون العلامة" : "Brand Color",
      value: answers.themeColor,
      step: 2,
      color: true,
    },
    {
      id: "language",
      label: isRTL ? "اللغة" : "Language",
      value: answers.language === "ar" ? "العربية" : "English",
      step: 3,
    },
  ];

  return (
    <StepCard
      title={isRTL ? "مراجعة النهائية" : "Final Review"}
      subtitle={isRTL ? "تحقق من معلوماتك" : "Confirm your details"}
      isRTL={isRTL}
    >
      <div className="space-y-6">
        {/* Summary Grid */}
        <div className="space-y-3">
          {reviewItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-r from-[#FFFBF5] to-[#F5EFE7] rounded-lg border border-[#E8DFD5] flex items-center justify-between group hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <p className="text-sm text-[#8B7D6F] font-medium">
                  {item.label}
                </p>
                {item.color ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-6 h-6 rounded border border-[#D4894C]"
                      style={{ backgroundColor: item.value }}
                    />
                    <span className="text-base font-semibold text-[#2D3436]">
                      {item.value}
                    </span>
                  </div>
                ) : (
                  <p className="text-base font-semibold text-[#2D3436] mt-1">
                    {item.value}
                  </p>
                )}
              </div>

              {onEditStep && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEditStep(item.step)}
                  className="p-2 text-[#D4894C] opacity-0 group-hover:opacity-100 transition-opacity"
                  title={isRTL ? "تعديل" : "Edit"}
                >
                  <Edit2 size={18} />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Encouragement Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-gradient-to-r from-[#D4894C] to-[#C76A3A] rounded-xl text-white space-y-3"
        >
          <div className="flex items-start gap-3">
            <Check size={24} strokeWidth={3} className="flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-lg">
                {isRTL ? "أنت جاهز!" : "You're All Set!"}
              </p>
              <p className="text-sm text-white text-opacity-90 mt-1">
                {isRTL
                  ? "انقر على الزر أدناه لإنشاء موقعك المذهل"
                  : "Click the button below to create your amazing website"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info */}
        <p className="text-xs text-[#A99D93] text-center">
          {isRTL
            ? "✨ يمكنك تعديل جميع هذه المعلومات لاحقاً في محرر الموقع"
            : "✨ You can edit all this information later in the site editor"}
        </p>
      </div>
    </StepCard>
  );
}

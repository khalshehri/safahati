"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import { getIndustryTemplate } from "@/config/industry-templates";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface WizardStepSectionsProps {
  isRTL: boolean;
}

const SECTION_DESCRIPTIONS: Record<string, { en: string; ar: string }> = {
  navbar: { en: "Navigation bar", ar: "شريط التنقل" },
  hero: { en: "Hero section", ar: "قسم البطل" },
  about: { en: "About your business", ar: "معلومات عنك" },
  services: { en: "Services you offer", ar: "الخدمات" },
  features: { en: "Key features", ar: "الميزات الرئيسية" },
  team: { en: "Your team", ar: "فريقك" },
  testimonials: { en: "Client testimonials", ar: "آراء العملاء" },
  clients: { en: "Client logos", ar: "شعارات العملاء" },
  stats: { en: "Statistics", ar: "الإحصائيات" },
  pricing: { en: "Pricing plans", ar: "خطط التسعير" },
  faq: { en: "FAQ", ar: "الأسئلة الشائعة" },
  cta: { en: "Call to action", ar: "دعوة للإجراء" },
  contact: { en: "Contact form", ar: "نموذج التواصل" },
  footer: { en: "Footer", ar: "التذييل" },
};

export default function WizardStepSections({
  isRTL,
}: WizardStepSectionsProps) {
  const { answers, updateAnswers } = useWizardStore();

  const template = getIndustryTemplate(answers.businessType as string);
  if (!template) return null;

  const availableSections = template.sections.map((s) => s.blockType);
  const selectedSections = (answers.selectedSections as string[]) || availableSections;

  const toggleSection = (blockType: string) => {
    const current = selectedSections.includes(blockType)
      ? selectedSections.filter((s) => s !== blockType)
      : [...selectedSections, blockType];
    updateAnswers("selectedSections", current);
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-[#111] mb-3">
          {isRTL ? "اختر الأقسام" : "Choose your sections"}
        </h1>
        <p className="text-base text-gray-500">
          {isRTL ? "اختر الأقسام التي تريدها على موقعك" : "Select the sections to display on your website"}
        </p>
      </div>

      {/* Counter Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-full">
        <span className="text-xs font-medium text-sky-700">
          {selectedSections.length}
        </span>
        <span className="text-xs text-sky-600">
          {isRTL ? "أقسام مختارة" : "sections selected"}
        </span>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableSections.map((blockType, index) => {
          const isSelected = selectedSections.includes(blockType);
          const desc =
            SECTION_DESCRIPTIONS[blockType] || { en: blockType, ar: blockType };

          return (
            <motion.button
              key={blockType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleSection(blockType)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-sky-500 bg-sky-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className={`text-sm font-medium ${
                  isSelected ? "text-sky-700" : "text-[#111]"
                }`}>
                  {isRTL ? desc.ar : desc.en}
                </p>
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-sky-500 bg-sky-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <Check size={16} className="text-white" strokeWidth={3} />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Hint */}
      <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
        <p>
          {isRTL
            ? "✨ يمكنك إضافة أو إزالة الأقسام لاحقاً من محرر الموقع"
            : "✨ You can add or remove sections later in the site editor"}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import { getIndustryTemplate } from "@/config/industry-templates";
import { motion } from "framer-motion";

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
  const selectedSections = answers.selectedSections as string[] || availableSections;

  const toggleSection = (blockType: string) => {
    const current = selectedSections.includes(blockType)
      ? selectedSections.filter((s) => s !== blockType)
      : [...selectedSections, blockType];
    updateAnswers("selectedSections", current);
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-1">
          {isRTL ? "أقسام الموقع" : "Website sections"}
        </h2>
        <p className="text-sm text-gray-600">
          {isRTL ? "اختر الأقسام التي تريدها على موقعك" : "Select which sections to include on your site"}
        </p>
      </div>

      <div className="space-y-2">
        {availableSections.map((blockType, index) => {
          const isSelected = selectedSections.includes(blockType);
          const desc = SECTION_DESCRIPTIONS[blockType] || { en: blockType, ar: blockType };

          return (
            <motion.button
              key={blockType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleSection(blockType)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {isRTL ? desc.ar : desc.en}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSection(blockType)}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
        <p>
          {isRTL
            ? "💡 يمكنك إضافة أو إزالة الأقسام لاحقاً من محرر الموقع"
            : "💡 You can add or remove sections later in the site editor"}
        </p>
      </div>
    </div>
  );
}

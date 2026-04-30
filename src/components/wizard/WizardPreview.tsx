"use client";

import { useWizardStore } from "@/lib/store/wizard-store";

interface WizardPreviewProps {
  isRTL: boolean;
}

const SECTION_NAMES: Record<string, { en: string; ar: string }> = {
  navbar: { en: "Navigation", ar: "التنقل" },
  hero: { en: "Hero", ar: "البطل" },
  about: { en: "About", ar: "عن" },
  services: { en: "Services", ar: "الخدمات" },
  features: { en: "Features", ar: "الميزات" },
  team: { en: "Team", ar: "الفريق" },
  testimonials: { en: "Testimonials", ar: "آراء العملاء" },
  clients: { en: "Clients", ar: "العملاء" },
  stats: { en: "Statistics", ar: "الإحصائيات" },
  pricing: { en: "Pricing", ar: "الأسعار" },
  faq: { en: "FAQ", ar: "الأسئلة" },
  cta: { en: "Call to Action", ar: "دعوة للإجراء" },
  contact: { en: "Contact", ar: "التواصل" },
  footer: { en: "Footer", ar: "التذييل" },
};

export default function WizardPreview({ isRTL }: WizardPreviewProps) {
  const { answers } = useWizardStore();

  const businessName = answers.businessName || "Your Business";
  const themeColor = answers.themeColor || "#000000";
  const selectedSections = (answers.selectedSections || []) as string[];

  return (
    <div className="sticky top-6 h-[calc(100vh-48px)] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-6">
      {/* Preview Header */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {isRTL ? "معاينة الموقع" : "Site Preview"}
        </p>

        <div
          className="h-2 rounded-full mb-4"
          style={{ backgroundColor: themeColor }}
        />

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {businessName}
        </h3>

        {answers.city && (
          <p className="text-sm text-gray-600">
            {answers.city}
          </p>
        )}
      </div>

      {/* Business Info Preview */}
      <div className="mb-6 pb-6 border-b border-gray-200 space-y-3">
        <div className="text-xs uppercase text-gray-500 font-semibold mb-3">
          {isRTL ? "معلومات عملك" : "Your Business Info"}
        </div>

        {answers.phone && (
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-600 w-16">
              {isRTL ? "الهاتف" : "Phone"}
            </span>
            <span className="text-sm text-gray-900">{answers.phone}</span>
          </div>
        )}

        {answers.description && (
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-600 w-16">
              {isRTL ? "الوصف" : "Description"}
            </span>
            <span className="text-sm text-gray-700 line-clamp-2">
              {answers.description}
            </span>
          </div>
        )}
      </div>

      {/* Selected Sections */}
      <div className="space-y-3">
        <div className="text-xs uppercase text-gray-500 font-semibold">
          {isRTL ? "أقسام الموقع" : "Website Sections"}
          <span className="text-gray-400 font-normal ml-2">
            ({selectedSections.length})
          </span>
        </div>

        <div className="space-y-2">
          {selectedSections.length > 0 ? (
            selectedSections.map((section) => {
              const name = SECTION_NAMES[section] || { en: section, ar: section };
              return (
                <div
                  key={section}
                  className="flex items-center gap-2 p-2 rounded bg-white border border-gray-200"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: themeColor }}
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {isRTL ? name.ar : name.en}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 italic">
              {isRTL ? "لم يتم اختيار أقسام" : "No sections selected"}
            </p>
          )}
        </div>
      </div>

      {/* Color Preview */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {isRTL ? "الألوان" : "Theme Colors"}
        </p>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
            style={{ backgroundColor: themeColor }}
            title="Primary color"
          />
          <div className="text-sm">
            <p className="font-medium text-gray-900">{isRTL ? "اللون الأساسي" : "Primary"}</p>
            <p className="text-xs text-gray-500">{themeColor.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

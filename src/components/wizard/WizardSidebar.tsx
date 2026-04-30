"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface WizardSidebarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: string; label: string; labelAr: string }>;
  isRTL: boolean;
  businessName?: string;
  businessType?: string;
  themeColor?: string;
  language?: "ar" | "en";
}

const INDUSTRY_LABELS: Record<string, { en: string; ar: string }> = {
  company: { en: "Company", ar: "شركة" },
  freelancer: { en: "Freelancer", ar: "عامل حر" },
  agency: { en: "Agency", ar: "وكالة" },
  restaurant: { en: "Restaurant", ar: "مطعم" },
  clinic: { en: "Clinic", ar: "عيادة" },
  realEstate: { en: "Real Estate", ar: "عقارات" },
  photographer: { en: "Photographer", ar: "مصور" },
  lawyer: { en: "Lawyer", ar: "محامي" },
  saas: { en: "SaaS", ar: "برنامج خدمة" },
  ecommerce: { en: "E-commerce", ar: "تجارة إلكترونية" },
  event: { en: "Event", ar: "حدث" },
  education: { en: "Education", ar: "تعليم" },
  gym: { en: "Gym", ar: "صالة ألعاب" },
};

export default function WizardSidebar({
  currentStep,
  totalSteps,
  steps,
  isRTL,
  businessName,
  businessType,
  themeColor,
  language,
}: WizardSidebarProps) {
  const industryLabel =
    businessType && INDUSTRY_LABELS[businessType]
      ? isRTL
        ? INDUSTRY_LABELS[businessType].ar
        : INDUSTRY_LABELS[businessType].en
      : "";

  return (
    <div
      className={`hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 sticky top-0 h-screen overflow-y-auto ${
        isRTL ? "border-l border-r-0" : ""
      }`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className={`text-lg font-bold text-[#111] ${isRTL ? "text-right" : ""}`}>
          Safahati
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${isRTL ? "text-right" : ""}`}>
          {isRTL ? "بناء موقعك بسهولة" : "Build your site in minutes"}
        </p>
      </div>

      {/* Step List */}
      <div className="flex-1 p-6 space-y-3 overflow-y-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                isCurrent
                  ? "bg-sky-50 border border-sky-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted && (
                  <CheckCircle2
                    size={20}
                    className="text-emerald-500"
                  />
                )}
                {isCurrent && (
                  <Circle
                    size={20}
                    className="text-sky-500 fill-sky-50"
                  />
                )}
                {isUpcoming && (
                  <Circle
                    size={20}
                    className="text-gray-300"
                  />
                )}
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? "text-sky-700" : "text-[#111]"
                  }`}
                >
                  {isRTL ? step.labelAr : step.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isCompleted && (isRTL ? "مكتمل" : "Completed")}
                  {isCurrent && (isRTL ? "الحالي" : "Current")}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Summary Card */}
      <div className={`m-6 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 ${isRTL ? "text-right" : ""}`}>
        <p className="text-xs font-semibold text-gray-500 uppercase">
          {isRTL ? "ملخص موقعك" : "Your Site"}
        </p>

        {businessName && (
          <div>
            <p className="text-xs text-gray-500">
              {isRTL ? "الاسم" : "Name"}
            </p>
            <p className="text-sm font-medium text-[#111] truncate">
              {businessName}
            </p>
          </div>
        )}

        {businessType && (
          <div>
            <p className="text-xs text-gray-500">
              {isRTL ? "نوع العمل" : "Type"}
            </p>
            <p className="text-sm font-medium text-[#111]">
              {industryLabel}
            </p>
          </div>
        )}

        {themeColor && (
          <div>
            <p className="text-xs text-gray-500 mb-1.5">
              {isRTL ? "اللون" : "Color"}
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md border border-gray-200"
                style={{ backgroundColor: themeColor }}
              />
              <p className="text-xs font-mono text-gray-600">
                {themeColor.toUpperCase()}
              </p>
            </div>
          </div>
        )}

        {language && (
          <div>
            <p className="text-xs text-gray-500">
              {isRTL ? "اللغة" : "Language"}
            </p>
            <p className="text-sm font-medium text-[#111]">
              {language === "ar"
                ? "🇸🇦 العربية"
                : "🇺🇸 English"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

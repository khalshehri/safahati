"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Globe } from "lucide-react";
import WizardSidebar from "./WizardSidebar";
import WizardStepBusinessEssentials from "./steps/WizardStepBusinessEssentials";
import WizardStepContactInfo from "./steps/WizardStepContactInfo";
import WizardStepBrand from "./steps/WizardStepBrand";
import WizardStepSections from "./steps/WizardStepSections";
import WizardStepLanguage from "./steps/WizardStepLanguage";
import WizardStepReview from "./steps/WizardStepReview";

const STEPS = [
  { id: "business", label: "Business", labelAr: "العمل" },
  { id: "contact", label: "Contact", labelAr: "التواصل" },
  { id: "brand", label: "Brand", labelAr: "العلامة" },
  { id: "sections", label: "Sections", labelAr: "الأقسام" },
  { id: "language", label: "Language", labelAr: "اللغة" },
  { id: "review", label: "Review", labelAr: "المراجعة" },
];

export default function WizardShell() {
  const {
    currentStep,
    setStep,
    answers,
    updateAnswers,
    validationErrors,
    setValidationErrors,
    isLoading,
    setIsLoading,
  } = useWizardStore();

  const [isRTL, setIsRTL] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (answers.language) {
      setIsRTL(answers.language === "ar");
    }
  }, [answers.language]);

  const stepComponents = [
    <WizardStepBusinessEssentials key="business" isRTL={isRTL} />,
    <WizardStepContactInfo key="contact" isRTL={isRTL} />,
    <WizardStepBrand key="brand" isRTL={isRTL} />,
    <WizardStepSections key="sections" isRTL={isRTL} />,
    <WizardStepLanguage key="language" isRTL={isRTL} />,
    <WizardStepReview key="review" isRTL={isRTL} />,
  ];

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setValidationErrors({});
      setStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setValidationErrors({});
      setStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/wizard/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = `/dashboard/${data.siteId}`;
      } else {
        const error = await res.json();
        console.error("Wizard submission failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = isRTL ? "en" : "ar";
    updateAnswers("language", newLang);
    setIsRTL(newLang === "ar");
  };

  if (!isMounted) return null;

  return (
    <div
      className={`bg-[#FAFAFA] min-h-screen flex ${isRTL ? "flex-row-reverse" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Desktop Sidebar */}
      <WizardSidebar
        currentStep={currentStep}
        totalSteps={STEPS.length}
        steps={STEPS}
        isRTL={isRTL}
        businessName={answers.businessName}
        businessType={answers.businessType}
        themeColor={answers.themeColor}
        language={answers.language as "ar" | "en" | undefined}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-gray-700 flex-1">
              {isRTL ? "Safahati" : "Safahati"}
            </div>
            <div className="text-xs text-gray-500">
              {isRTL
                ? `الخطوة ${currentStep + 1} من ${STEPS.length}`
                : `Step ${currentStep + 1} of ${STEPS.length}`}
            </div>
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Mobile Progress Dots */}
          <div className="px-6 pb-4 flex items-center justify-center gap-2">
            {STEPS.map((_, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    isCompleted
                      ? "w-6 bg-emerald-500"
                      : isCurrent
                        ? "w-6 bg-sky-500"
                        : "w-2 bg-gray-300"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 px-6 lg:px-0 py-12 lg:py-16 flex items-start justify-center overflow-y-auto">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -40 : 40 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {stepComponents[currentStep]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Bottom Bar */}
        <div className="lg:hidden sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {isRTL ? "السابق" : "Back"}
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isRTL ? "جاري..." : "..."}
              </span>
            ) : currentStep === STEPS.length - 1 ? (
              isRTL ? "إنشاء موقعي" : "Create my website"
            ) : (
              isRTL ? "متابعة" : "Continue"
            )}
          </button>
        </div>

        {/* Desktop Bottom Bar */}
        <div className="hidden lg:flex sticky bottom-0 bg-white border-t border-gray-100 max-w-xl mx-auto w-full px-8 py-6 items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={18} />
            {isRTL ? "السابق" : "Back"}
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-2.5 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </span>
            ) : (
              <>
                {currentStep === STEPS.length - 1
                  ? isRTL
                    ? "إنشاء موقعي"
                    : "Create my website"
                  : isRTL
                    ? "متابعة"
                    : "Continue"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

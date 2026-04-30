"use client";

import { useEffect, useState } from "react";
import { useWizardStore } from "@/lib/store/wizard-store";
import { motion, AnimatePresence } from "framer-motion";
import WizardStepBusinessEssentials from "./steps/WizardStepBusinessEssentials";
import WizardStepContactInfo from "./steps/WizardStepContactInfo";
import WizardStepBrand from "./steps/WizardStepBrand";
import WizardStepSections from "./steps/WizardStepSections";
import WizardStepLanguage from "./steps/WizardStepLanguage";
import WizardStepReview from "./steps/WizardStepReview";
import WizardPreview from "./WizardPreview";

const STEPS = [
  { id: "business", label: "Business Essentials", labelAr: "أساسيات العمل" },
  { id: "contact", label: "Contact Info", labelAr: "معلومات التواصل" },
  { id: "brand", label: "Brand", labelAr: "الهوية" },
  { id: "sections", label: "Website Sections", labelAr: "أقسام الموقع" },
  { id: "language", label: "Language", labelAr: "اللغة" },
  { id: "review", label: "Review", labelAr: "مراجعة" },
];

const stepComponents = [
  WizardStepBusinessEssentials,
  WizardStepContactInfo,
  WizardStepBrand,
  WizardStepSections,
  WizardStepLanguage,
  WizardStepReview,
];

export default function WizardShell() {
  const { currentStep, setStep, isLoading, setIsLoading } = useWizardStore();
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const CurrentStepComponent = stepComponents[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = async () => {
    const state = useWizardStore.getState();

    // Auto-save before advancing
    if (!isLastStep) {
      try {
        await fetch("/api/wizard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            industry: state.answers.businessType,
            step: currentStep + 1,
            answers: state.answers,
          }),
        });
      } catch (error) {
        console.error("Failed to auto-save:", error);
      }
      setStep(currentStep + 1);
    } else {
      await submitWizard();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const submitWizard = async () => {
    const state = useWizardStore.getState();
    try {
      setIsLoading(true);
      const res = await fetch("/api/wizard/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.answers),
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

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen bg-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top bar */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isRTL ? "إنشاء موقعك" : "Create Your Website"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isRTL ? `الخطوة ${currentStep + 1} من ${STEPS.length}` : `Step ${currentStep + 1} of ${STEPS.length}`}
              </p>
            </div>
            <button
              onClick={() => setIsRTL(!isRTL)}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isRTL ? "English" : "العربية"}
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black"
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Content - 2 Column Layout */}
      <div className="flex w-full min-h-[calc(100vh-160px)]">
        {/* Left Column - Form */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentStepComponent
                    isRTL={isRTL}
                    onLanguageChange={() => setIsRTL(!isRTL)}
                    onEditStep={setStep}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className={`mt-12 flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
              >
                {isRTL ? "السابق" : "Back"}
              </button>
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="px-8 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isRTL ? "جاري..." : "Loading..."}
                  </span>
                ) : isLastStep ? (
                  isRTL ? "إنشاء الموقع" : "Create Website"
                ) : (
                  isRTL ? "التالي" : "Next"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview (Desktop Only) */}
        <div className="hidden lg:flex lg:w-96 lg:flex-shrink-0 lg:border-l lg:border-gray-200 px-4 sm:px-8 py-12 md:py-16 lg:py-20 overflow-y-auto">
          <WizardPreview isRTL={isRTL} />
        </div>
      </div>
    </div>
  );
}

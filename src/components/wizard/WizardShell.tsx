"use client";

import { useEffect, useState } from "react";
import { useWizardStore, INDUSTRIES } from "@/lib/store/wizard-store";
import WizardStepBusinessType from "./steps/WizardStepBusinessType";
import WizardStepName from "./steps/WizardStepName";
import WizardStepCity from "./steps/WizardStepCity";
import WizardStepPhone from "./steps/WizardStepPhone";
import WizardStepLogo from "./steps/WizardStepLogo";
import WizardStepColor from "./steps/WizardStepColor";
import WizardStepLanguage from "./steps/WizardStepLanguage";
import WizardStepReview from "./steps/WizardStepReview";
import { motion, AnimatePresence } from "framer-motion";

const STEP_CONFIG = [
  { id: "businessType", label: "Business Type", labelAr: "نوع العمل" },
  { id: "businessName", label: "Business Name", labelAr: "اسم العمل" },
  { id: "city", label: "City", labelAr: "المدينة" },
  { id: "phone", label: "Phone", labelAr: "رقم الهاتف" },
  { id: "logo", label: "Logo", labelAr: "الشعار" },
  { id: "color", label: "Theme Color", labelAr: "لون المظهر" },
  { id: "language", label: "Language", labelAr: "اللغة" },
  { id: "review", label: "Review", labelAr: "مراجعة" },
];

const stepComponents = [
  WizardStepBusinessType,
  WizardStepName,
  WizardStepCity,
  WizardStepPhone,
  WizardStepLogo,
  WizardStepColor,
  WizardStepLanguage,
  WizardStepReview,
];

export default function WizardShell() {
  const { currentStep, setStep, isLoading } = useWizardStore();
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch existing draft if available
    fetchDraft();
  }, []);

  const fetchDraft = async () => {
    try {
      const res = await fetch("/api/wizard");
      if (res.ok) {
        const data = await res.json();
        useWizardStore.setState({
          currentStep: data.step || 0,
          answers: data.answers || {},
        });
      }
    } catch (error) {
      console.error("Failed to fetch wizard draft:", error);
    }
  };

  const CurrentStepComponent = stepComponents[currentStep];
  const isLastStep = currentStep === stepComponents.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      // Submit wizard
      await submitWizard();
    } else {
      setStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const submitWizard = async () => {
    const answers = useWizardStore.getState().answers;
    try {
      useWizardStore.getState().setIsLoading(true);
      const res = await fetch("/api/wizard/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to dashboard or site editor
        window.location.href = `/dashboard/${data.siteId}`;
      } else {
        const error = await res.json();
        console.error("Wizard submission failed:", error);
      }
    } finally {
      useWizardStore.getState().setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8 ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-2xl">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-900">
              {isRTL ? "بناء موقعك في 5 دقائق" : "Build Your Site in 5 Minutes"}
            </h1>
            <span className="text-sm font-medium text-slate-600">
              {currentStep + 1} / {STEP_CONFIG.length}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              animate={{ width: `${((currentStep + 1) / STEP_CONFIG.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {isRTL ? STEP_CONFIG[currentStep].labelAr : STEP_CONFIG[currentStep].label}
          </p>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <CurrentStepComponent />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className={`mt-8 flex gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0 || isLoading}
            className="flex-1 px-4 py-3 bg-slate-200 text-slate-900 font-medium rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRTL ? "السابق" : "Back"}
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {isRTL ? "جاري..." : "Loading..."}
              </span>
            ) : isLastStep ? (
              isRTL ? "إنشاء الموقع" : "Create Site"
            ) : (
              isRTL ? "التالي" : "Next"
            )}
          </button>
        </div>

        {/* Language toggle */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setIsRTL(!isRTL)}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            {isRTL ? "English" : "العربية"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useWizardStore } from "@/lib/store/wizard-store";
import { motion, AnimatePresence } from "framer-motion";
import ProgressIndicator from "./components/ProgressIndicator";
import SuccessCelebration from "./components/SuccessCelebration";
import WizardStepBusinessEssentials from "./steps/WizardStepBusinessEssentials";
import WizardStepContactInfo from "./steps/WizardStepContactInfo";
import WizardStepBrand from "./steps/WizardStepBrand";
import WizardStepLanguage from "./steps/WizardStepLanguage";
import WizardStepReview from "./steps/WizardStepReview";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const STEP_CONFIG = [
  { id: "business", label: "Business Essentials", labelAr: "أساسيات العمل" },
  { id: "contact", label: "Contact Info", labelAr: "معلومات التواصل" },
  { id: "brand", label: "Brand Identity", labelAr: "الهوية البصرية" },
  { id: "language", label: "Language", labelAr: "اللغة" },
  { id: "review", label: "Review", labelAr: "مراجعة" },
];

const stepComponents = [
  WizardStepBusinessEssentials,
  WizardStepContactInfo,
  WizardStepBrand,
  WizardStepLanguage,
  WizardStepReview,
];

export default function WizardShell() {
  const { currentStep, setStep, answers, setIsLoading, isLoading } =
    useWizardStore();
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDraft();
  }, []);

  const fetchDraft = async () => {
    try {
      const res = await fetch("/api/wizard");
      if (res.ok) {
        const data = await res.json();
        useWizardStore.setState({
          currentStep: Math.min(data.step || 0, STEP_CONFIG.length - 1),
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
    }

    if (isLastStep) {
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
        setShowCelebration(true);
        setTimeout(() => {
          window.location.href = `/dashboard/${data.siteId}`;
        }, 3500);
      } else {
        const error = await res.json();
        console.error("Wizard submission failed:", error);
        alert(
          isRTL
            ? "فشل الإنشاء. حاول مرة أخرى"
            : "Failed to create site. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang: "ar" | "en") => {
    setIsRTL(lang === "ar");
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-[#FFFBF5] via-[#F5EFE7] to-[#EBE2D9] ${
        isRTL ? "rtl" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Success Celebration */}
      {showCelebration && <SuccessCelebration isRTL={isRTL} />}

      {/* Container */}
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-[#D4894C]" size={28} />
            <h1 className="text-4xl md:text-5xl font-bold text-[#2D3436]">
              {isRTL ? "بناء موقعك" : "Build Your Site"}
            </h1>
          </div>
          <p className="text-lg text-[#8B7D6F] max-w-lg mx-auto">
            {isRTL
              ? "دعنا ننشئ موقعاً احترافياً لعملك في بضع دقائق"
              : "Let's create a professional website for your business in minutes"}
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <ProgressIndicator
            totalSteps={STEP_CONFIG.length}
            currentStep={currentStep}
            isRTL={isRTL}
          />
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 40 : -40 }}
            transition={{ duration: 0.35 }}
          >
            <CurrentStepComponent
              isRTL={isRTL}
              onLanguageChange={handleLanguageChange}
              onEditStep={setStep}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-8 flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrevious}
            disabled={currentStep === 0 || isLoading}
            className={`
              flex-1 h-12 px-6 rounded-lg font-semibold
              flex items-center justify-center gap-2
              transition-all duration-300
              ${
                currentStep === 0 || isLoading
                  ? "bg-gray-100 text-[#A99D93] cursor-not-allowed"
                  : "bg-[#E8DFD5] text-[#2D3436] hover:bg-[#D4D1CB] active:scale-95"
              }
            `}
          >
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            <span>{isRTL ? "السابق" : "Back"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={isLoading}
            className={`
              flex-1 h-12 px-6 rounded-lg font-semibold
              flex items-center justify-center gap-2
              text-white transition-all duration-300
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#D4894C] to-[#C76A3A] hover:shadow-lg active:scale-95"
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isRTL ? "جاري..." : "Loading..."}</span>
              </>
            ) : isLastStep ? (
              <>
                <Sparkles size={20} />
                <span>{isRTL ? "إنشاء الموقع" : "Create Site"}</span>
              </>
            ) : (
              <>
                <span>{isRTL ? "التالي" : "Next"}</span>
                {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Language Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <button
            onClick={() => {
              const newRTL = !isRTL;
              setIsRTL(newRTL);
              handleLanguageChange(newRTL ? "ar" : "en");
            }}
            className="text-sm font-medium text-[#D4894C] hover:text-[#C76A3A] transition-colors"
          >
            {isRTL ? "English" : "العربية"}
          </button>
        </motion.div>

        {/* Footer Help */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-xs text-[#A99D93]"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {isRTL
            ? "💡 البيانات محفوظة تلقائياً. يمكنك العودة في أي وقت."
            : "💡 Your data is automatically saved. You can return anytime."}
        </motion.p>
      </div>
    </div>
  );
}

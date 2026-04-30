"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  isRTL: boolean;
}

export default function ProgressIndicator({
  totalSteps,
  currentStep,
  isRTL,
}: ProgressIndicatorProps) {
  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#D4894C] to-[#C76A3A]"
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Step Indicators - Mobile: dots, Desktop: numbers */}
      <div
        className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={`
              relative w-10 h-10 rounded-full flex items-center justify-center
              text-sm font-semibold transition-all duration-300
              ${index < currentStep
                ? "bg-[#7BA386] text-white"
                : index === currentStep
                ? "bg-[#D4894C] text-white ring-4 ring-[#D4894C] ring-opacity-20"
                : "bg-gray-100 text-[#8B7D6F]"
              }
            `}
            animate={{
              scale: index === currentStep ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {index < currentStep ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Check size={20} strokeWidth={3} />
              </motion.div>
            ) : (
              <span className="hidden sm:inline">{index + 1}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Step Label */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <p className="text-sm text-[#8B7D6F]">
          {isRTL ? "خطوة" : "Step"} {currentStep + 1} {isRTL ? "من" : "of"}{" "}
          {totalSteps}
        </p>
      </motion.div>
    </div>
  );
}

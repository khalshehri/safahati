"use client";

import { useWizardStore, INDUSTRIES } from "@/lib/store/wizard-store";

export default function WizardStepBusinessType() {
  const { answers, updateAnswers } = useWizardStore();
  const selected = answers.businessType as string;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">What type of business do you have?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {INDUSTRIES.map((industry) => (
          <button
            key={industry.id}
            onClick={() => updateAnswers("businessType", industry.id)}
            className={`p-4 rounded-lg border-2 transition-all text-center font-medium ${
              selected === industry.id
                ? "border-blue-500 bg-blue-50 text-blue-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {industry.label}
          </button>
        ))}
      </div>
    </div>
  );
}

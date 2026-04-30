"use client";

import { useWizardStore } from "@/lib/store/wizard-store";

export default function WizardStepName() {
  const { answers, updateAnswers } = useWizardStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">What's your business name?</h2>
      <input
        type="text"
        value={(answers.businessName as string) || ""}
        onChange={(e) => updateAnswers("businessName", e.target.value)}
        placeholder="Enter your business name"
        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

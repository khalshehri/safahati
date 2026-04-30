"use client";

import { useWizardStore } from "@/lib/store/wizard-store";

export default function WizardStepCity() {
  const { answers, updateAnswers } = useWizardStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Which city are you in?</h2>
      <input
        type="text"
        value={(answers.city as string) || ""}
        onChange={(e) => updateAnswers("city", e.target.value)}
        placeholder="Enter your city"
        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

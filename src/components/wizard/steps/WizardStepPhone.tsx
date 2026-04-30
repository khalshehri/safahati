"use client";

import { useWizardStore } from "@/lib/store/wizard-store";

export default function WizardStepPhone() {
  const { answers, updateAnswers } = useWizardStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">What's your phone number?</h2>
      <input
        type="tel"
        value={(answers.phone as string) || ""}
        onChange={(e) => updateAnswers("phone", e.target.value)}
        placeholder="+966 50 000 0000"
        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          checked={(answers.whatsappEnabled as boolean) || false}
          onChange={(e) => updateAnswers("whatsappEnabled", e.target.checked)}
          className="w-5 h-5"
        />
        <span className="text-slate-700">Add WhatsApp button to my site</span>
      </label>
    </div>
  );
}

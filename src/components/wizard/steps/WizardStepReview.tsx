"use client";

import { useWizardStore, INDUSTRIES } from "@/lib/store/wizard-store";

export default function WizardStepReview() {
  const { answers } = useWizardStore();

  const industryLabel = INDUSTRIES.find((i) => i.id === answers.businessType)?.label;

  const reviewItems = [
    { label: "Business Type", value: industryLabel },
    { label: "Business Name", value: answers.businessName },
    { label: "City", value: answers.city },
    { label: "Phone", value: answers.phone },
    { label: "Language", value: answers.language === "ar" ? "Arabic" : "English" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Review your information</h2>
      <div className="space-y-3">
        {reviewItems.map((item) => (
          <div key={item.label} className="flex justify-between border-b border-slate-200 pb-3">
            <span className="text-slate-600 font-medium">{item.label}</span>
            <span className="text-slate-900 font-semibold">{item.value || "—"}</span>
          </div>
        ))}
      </div>
      {answers.logo && (
        <div className="mt-6">
          <p className="text-slate-600 font-medium mb-3">Your Logo</p>
          <img src={answers.logo as string} alt="Logo" className="h-20" />
        </div>
      )}
      <p className="mt-8 text-sm text-slate-600">
        Click "Create Site" below to build your website. You'll be able to edit everything later.
      </p>
    </div>
  );
}

"use client";

import { useWizardStore } from "@/lib/store/wizard-store";

const COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Green", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Slate", value: "#64748B" },
];

export default function WizardStepColor() {
  const { answers, updateAnswers } = useWizardStore();
  const selected = (answers.themeColor as string) || "#3B82F6";

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose your theme color</h2>
      <div className="grid grid-cols-4 gap-4">
        {COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => updateAnswers("themeColor", color.value)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selected === color.value ? "border-slate-900" : "border-slate-200"
            }`}
          >
            <div
              className="w-full h-12 rounded mb-2"
              style={{ backgroundColor: color.value }}
            />
            <p className="text-xs font-medium text-slate-700">{color.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useWizardStore } from "@/lib/store/wizard-store";

interface WizardStepReviewProps {
  isRTL: boolean;
  onEditStep?: (step: number) => void;
}

export default function WizardStepReview({
  isRTL,
  onEditStep,
}: WizardStepReviewProps) {
  const { answers } = useWizardStore();

  const items = [
    {
      label: isRTL ? "العمل" : "Business",
      value: `${answers.businessType} - ${answers.businessName}`,
      step: 0,
    },
    {
      label: isRTL ? "الموقع" : "Location",
      value: answers.city,
      step: 1,
    },
    {
      label: isRTL ? "الهاتف" : "Phone",
      value: answers.phone,
      step: 1,
    },
    {
      label: isRTL ? "اللون" : "Color",
      value: answers.themeColor,
      step: 2,
      isColor: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {isRTL ? "مراجعة البيانات" : "Review your details"}
        </h2>
        <p className="text-sm text-gray-600">
          {isRTL ? "تحقق من المعلومات قبل الإنشاء" : "Make sure everything is correct"}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="text-xs text-gray-600 font-medium">{item.label}</p>
              {item.isColor ? (
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: item.value }}
                  />
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-900 mt-1">{item.value}</p>
              )}
            </div>
            {onEditStep && (
              <button
                onClick={() => onEditStep(item.step)}
                className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-black text-white rounded-lg text-sm">
        <p>{isRTL ? "✨ جاهز لإنشاء موقعك!" : "✨ Ready to create your website!"}</p>
      </div>
    </div>
  );
}

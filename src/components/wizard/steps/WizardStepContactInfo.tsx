"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import WizardInput from "../ui/WizardInput";
import WizardSelect from "../ui/WizardSelect";

interface WizardStepContactInfoProps {
  isRTL: boolean;
}

const CITIES = [
  { value: "riyadh", label: "Riyadh", labelAr: "الرياض" },
  { value: "jeddah", label: "Jeddah", labelAr: "جدة" },
  { value: "dammam", label: "Dammam", labelAr: "الدمام" },
  { value: "dubai", label: "Dubai", labelAr: "دبي" },
  { value: "abudhabi", label: "Abu Dhabi", labelAr: "أبو ظبي" },
  { value: "doha", label: "Doha", labelAr: "الدوحة" },
  { value: "kuwait", label: "Kuwait City", labelAr: "مدينة الكويت" },
  { value: "manama", label: "Manama", labelAr: "المنامة" },
  { value: "cairo", label: "Cairo", labelAr: "القاهرة" },
  { value: "alexandria", label: "Alexandria", labelAr: "الإسكندرية" },
  { value: "other", label: "Other", labelAr: "آخرى" },
];

export default function WizardStepContactInfo({ isRTL }: WizardStepContactInfoProps) {
  const { answers, updateAnswers } = useWizardStore();

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-[#111] mb-3">
          {isRTL ? "معلومات التواصل" : "How can customers reach you?"}
        </h1>
        <p className="text-base text-gray-500">
          {isRTL ? "أضف طرق التواصل معك" : "Share your contact information"}
        </p>
      </div>

      {/* City Select */}
      <div>
        <WizardSelect
          label={isRTL ? "المدينة" : "City"}
          labelAr="المدينة"
          value={answers.city || ""}
          onChange={(value) => updateAnswers("city", value)}
          options={CITIES}
          isRTL={isRTL}
          required
        />
      </div>

      {/* Phone Input */}
      <div>
        <WizardInput
          label={isRTL ? "رقم الهاتف" : "Phone number"}
          labelAr="رقم الهاتف"
          value={answers.phone || ""}
          onChange={(value) => updateAnswers("phone", value)}
          placeholder="+966 50 123 4567"
          placeholderAr="+966 50 123 4567"
          type="tel"
          isRTL={isRTL}
          required
          helperText="Include country code"
          helperTextAr="اشمل رمز الدولة"
        />
      </div>

      {/* WhatsApp Toggle */}
      <div className="pt-4">
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={answers.whatsappEnabled || false}
            onChange={(e) => updateAnswers("whatsappEnabled", e.target.checked)}
            className="w-5 h-5 border-2 border-gray-300 rounded-md accent-sky-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-[#111]">
            {isRTL ? "تفعيل رسائل WhatsApp" : "Enable WhatsApp messaging"}
          </span>
        </label>
      </div>
    </div>
  );
}

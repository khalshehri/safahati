"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import Input from "../components/Input";

interface WizardStepContactInfoProps {
  isRTL: boolean;
}

const CITIES = [
  "Riyadh", "Jeddah", "Dammam", "Dubai", "Abu Dhabi",
  "Doha", "Kuwait City", "Manama", "Cairo", "Alexandria",
];

export default function WizardStepContactInfo({ isRTL }: WizardStepContactInfoProps) {
  const { answers, updateAnswers } = useWizardStore();

  return (
    <div className="space-y-8 lg:space-y-10">
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-1">
          {isRTL ? "معلومات التواصل" : "Contact information"}
        </h2>
        <p className="text-sm text-gray-600">
          {isRTL ? "كيف يمكن للعملاء التواصل معك؟" : "How can customers reach you?"}
        </p>
      </div>

      {/* City */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-2 block">
          {isRTL ? "المدينة" : "City"}
        </label>
        <select
          value={answers.city || ""}
          onChange={(e) => updateAnswers("city", e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <option value="">{isRTL ? "اختر المدينة" : "Select a city"}</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Phone */}
      <Input
        label={isRTL ? "رقم الهاتف" : "Phone number"}
        value={answers.phone || ""}
        onChange={(value) => updateAnswers("phone", value.replace(/\D/g, ""))}
        placeholder="+966501234567"
        type="tel"
        isRTL={isRTL}
      />

      {/* WhatsApp */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={answers.whatsappEnabled || false}
          onChange={(e) => updateAnswers("whatsappEnabled", e.target.checked)}
          className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-black"
        />
        <span className="text-sm font-medium text-gray-700">
          {isRTL ? "السماح بـ WhatsApp" : "Enable WhatsApp messaging"}
        </span>
      </label>
    </div>
  );
}

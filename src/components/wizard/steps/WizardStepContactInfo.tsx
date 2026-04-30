"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import StepCard from "../components/StepCard";
import InputField from "../components/InputField";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface WizardStepContactInfoProps {
  isRTL: boolean;
}

const MENA_CITIES = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Dubai",
  "Abu Dhabi",
  "Doha",
  "Kuwait City",
  "Manama",
  "Cairo",
  "Alexandria",
  "Amman",
  "Beirut",
];

export default function WizardStepContactInfo({
  isRTL,
}: WizardStepContactInfoProps) {
  const { answers, updateAnswers } = useWizardStore();

  const formatPhoneNumber = (phone: string) => {
    // Simple formatting: keep only digits and +
    return phone.replace(/[^\d+]/g, "");
  };

  return (
    <StepCard
      title={isRTL ? "كيف يمكن العثور عليك؟" : "How Can Customers Reach You?"}
      subtitle={isRTL ? "أضف معلومات التواصل الخاصة بك" : "Add your contact information"}
      isRTL={isRTL}
    >
      <div className="space-y-6">
        {/* City Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[#2D3436] flex items-center gap-2">
            <MapPin size={18} className="text-[#D4894C]" />
            {isRTL ? "المدينة" : "City"}
          </label>
          <select
            value={answers.city || ""}
            onChange={(e) => updateAnswers("city", e.target.value)}
            className={`
              w-full h-12 px-4 py-3 rounded-lg border-2
              border-[#E8DFD5] bg-white
              font-medium text-base
              focus:outline-none focus:border-[#D4894C] focus:ring-2 focus:ring-orange-100
              transition-all duration-300
              ${isRTL ? "text-right" : "text-left"}
            `}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="">
              {isRTL ? "اختر المدينة" : "Select your city"}
            </option>
            {MENA_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number */}
        <InputField
          label={
            <span className="flex items-center gap-2">
              <Phone size={18} className="text-[#D4894C]" />
              {isRTL ? "رقم الهاتف" : "Phone Number"}
            </span>
          }
          value={answers.phone || ""}
          onChange={(value) =>
            updateAnswers("phone", formatPhoneNumber(value))
          }
          placeholder={isRTL ? "+966501234567" : "+966 50 123 4567"}
          success={
            !!answers.phone && answers.phone.replace(/\D/g, "").length >= 7
          }
          isRTL={isRTL}
          type="tel"
        />

        {/* WhatsApp Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={answers.whatsappEnabled || false}
              onChange={(e) =>
                updateAnswers("whatsappEnabled", e.target.checked)
              }
              className="w-5 h-5 rounded border-[#7BA386] text-[#7BA386] focus:ring-green-300 cursor-pointer"
            />
            <span className="flex items-center gap-2 text-sm font-medium text-[#2D3436]">
              <MessageCircle size={18} className="text-green-600" />
              {isRTL
                ? "السماح بالدردشة عبر WhatsApp"
                : "Enable WhatsApp messaging"}
            </span>
          </label>
          <p className="text-xs text-[#8B7D6F] mt-2 ml-7">
            {isRTL
              ? "اسمح للعملاء بالاتصال بك عبر WhatsApp"
              : "Allow customers to reach you via WhatsApp"}
          </p>
        </motion.div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-lg border border-[#6B8FB3] border-opacity-30">
          <p className="text-sm text-[#2D3436]" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL
              ? "📍 ستظهر هذه المعلومات في قسم التواصل على موقعك"
              : "📍 This information will appear in your site's contact section"}
          </p>
        </div>
      </div>
    </StepCard>
  );
}

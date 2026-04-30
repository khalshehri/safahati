"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import StepCard from "../components/StepCard";
import InputField from "../components/InputField";
import { Building2, Briefcase, User, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface WizardStepBusinessEssentialsProps {
  isRTL: boolean;
}

const INDUSTRY_OPTIONS = [
  { id: "company", label: "Company", labelAr: "شركة", icon: Building2 },
  { id: "freelancer", label: "Freelancer", labelAr: "عامل حر", icon: User },
  { id: "agency", label: "Agency", labelAr: "وكالة", icon: Briefcase },
  { id: "restaurant", label: "Restaurant", labelAr: "مطعم", icon: Zap },
  { id: "clinic", label: "Clinic", labelAr: "عيادة", icon: Briefcase },
  { id: "realEstate", label: "Real Estate", labelAr: "عقارات", icon: Building2 },
  { id: "photographer", label: "Photographer", labelAr: "مصور", icon: Zap },
  { id: "lawyer", label: "Lawyer", labelAr: "محامي", icon: Briefcase },
  { id: "saas", label: "SaaS", labelAr: "برنامج خدمة", icon: Zap },
  { id: "ecommerce", label: "E-commerce", labelAr: "تجارة إلكترونية", icon: Briefcase },
  { id: "event", label: "Event", labelAr: "حدث", icon: User },
  { id: "education", label: "Education", labelAr: "تعليم", icon: Building2 },
  { id: "gym", label: "Gym", labelAr: "صالة ألعاب", icon: Zap },
];

export default function WizardStepBusinessEssentials({
  isRTL,
}: WizardStepBusinessEssentialsProps) {
  const { answers, updateAnswers } = useWizardStore();

  return (
    <StepCard
      title={isRTL ? "عن عملك" : "About Your Business"}
      subtitle={isRTL ? "دعنا نبدأ بالأساسيات" : "Let's start with the basics"}
      isRTL={isRTL}
    >
      <div className="space-y-8">
        {/* Industry Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#2D3436]">
            {isRTL ? "ما نوع عملك؟" : "What type of business are you?"}
          </h3>
          <div
            className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${
              isRTL ? "flex flex-row-reverse" : ""
            }`}
          >
            {INDUSTRY_OPTIONS.map((industry) => {
              const Icon = industry.icon;
              const isSelected = answers.businessType === industry.id;
              return (
                <motion.button
                  key={industry.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateAnswers("businessType", industry.id)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-300
                    flex flex-col items-center justify-center gap-2
                    ${
                      isSelected
                        ? "border-[#D4894C] bg-orange-50 shadow-md"
                        : "border-[#E8DFD5] bg-white hover:border-[#D4894C]"
                    }
                  `}
                >
                  <Icon
                    size={24}
                    className={isSelected ? "text-[#D4894C]" : "text-[#8B7D6F]"}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-[#D4894C]" : "text-[#2D3436]"
                    }`}
                  >
                    {isRTL ? industry.labelAr : industry.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Business Name */}
        <InputField
          label={isRTL ? "اسم العمل" : "Business Name"}
          value={answers.businessName || ""}
          onChange={(value) => updateAnswers("businessName", value)}
          placeholder={
            isRTL
              ? "أدخل اسم عملك"
              : "Enter your business name"
          }
          success={!!answers.businessName && answers.businessName.length > 2}
          isRTL={isRTL}
          maxLength={100}
        />

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-[#D4894C] border-opacity-30"
        >
          <p className="text-sm text-[#8B7D6F]" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL
              ? "✨ اختر من فضلك واسم عملك ونحن سننشئ موقعك بسهولة"
              : "✨ Choose your industry and business name, and we'll create your website with ease"}
          </p>
        </motion.div>
      </div>
    </StepCard>
  );
}

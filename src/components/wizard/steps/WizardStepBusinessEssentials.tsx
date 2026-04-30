"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { Building2, Briefcase, User, Zap } from "lucide-react";

interface WizardStepBusinessEssentialsProps {
  isRTL: boolean;
}

const INDUSTRIES = [
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
    <div className="space-y-8 lg:space-y-10">
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-1">
          {isRTL ? "نوع عملك" : "What type of business are you?"}
        </h2>
        <p className="text-sm text-gray-600">
          {isRTL ? "اختر الفئة الأقرب لعملك" : "Choose the category that best fits"}
        </p>
      </div>

      {/* Industry Grid */}
      <div className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6 ${isRTL ? "flex flex-row-reverse flex-wrap" : ""}`}>
        {INDUSTRIES.map((industry) => {
          const Icon = industry.icon;
          const isSelected = answers.businessType === industry.id;
          return (
            <motion.button
              key={industry.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateAnswers("businessType", industry.id)}
              className={`
                p-5 md:p-6 rounded-lg border-2 transition-all text-center
                ${
                  isSelected
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <Icon size={24} className="mx-auto mb-3 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 block">
                {isRTL ? industry.labelAr : industry.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Business Name */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          {isRTL ? "اسم العمل" : "Business name"}
        </h3>
        <Input
          value={answers.businessName || ""}
          onChange={(value) => updateAnswers("businessName", value)}
          placeholder={isRTL ? "أدخل اسم عملك" : "Enter your business name"}
          isRTL={isRTL}
        />
      </div>
    </div>
  );
}

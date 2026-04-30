"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import { motion } from "framer-motion";
import { Building2, Briefcase, User, Utensils, Stethoscope, Home, Camera, Scale, Zap, ShoppingCart, Calendar, BookOpen, Dumbbell } from "lucide-react";
import WizardInput from "../ui/WizardInput";

interface WizardStepBusinessEssentialsProps {
  isRTL: boolean;
}

const INDUSTRIES = [
  { id: "company", label: "Company", labelAr: "شركة", icon: Building2 },
  { id: "freelancer", label: "Freelancer", labelAr: "عامل حر", icon: User },
  { id: "agency", label: "Agency", labelAr: "وكالة", icon: Briefcase },
  { id: "restaurant", label: "Restaurant", labelAr: "مطعم", icon: Utensils },
  { id: "clinic", label: "Clinic", labelAr: "عيادة", icon: Stethoscope },
  { id: "realEstate", label: "Real Estate", labelAr: "عقارات", icon: Home },
  { id: "photographer", label: "Photographer", labelAr: "مصور", icon: Camera },
  { id: "lawyer", label: "Lawyer", labelAr: "محامي", icon: Scale },
  { id: "saas", label: "SaaS", labelAr: "برنامج خدمة", icon: Zap },
  { id: "ecommerce", label: "E-commerce", labelAr: "تجارة إلكترونية", icon: ShoppingCart },
  { id: "event", label: "Event", labelAr: "حدث", icon: Calendar },
  { id: "education", label: "Education", labelAr: "تعليم", icon: BookOpen },
  { id: "gym", label: "Gym", labelAr: "صالة ألعاب", icon: Dumbbell },
];

export default function WizardStepBusinessEssentials({
  isRTL,
}: WizardStepBusinessEssentialsProps) {
  const { answers, updateAnswers } = useWizardStore();

  const hasBusinessType = !!answers.businessType;
  const hasBusinessName = !!answers.businessName && answers.businessName.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-[#111] mb-3">
          {isRTL ? "نوع عملك" : "What type of business are you?"}
        </h1>
        <p className="text-base text-gray-500">
          {isRTL ? "اختر الفئة الأقرب لعملك" : "Choose the category that best fits your business"}
        </p>
      </div>

      {/* Industry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        {INDUSTRIES.map((industry) => {
          const Icon = industry.icon;
          const isSelected = answers.businessType === industry.id;
          return (
            <motion.button
              key={industry.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateAnswers("businessType", industry.id)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                isSelected
                  ? "border-sky-500 bg-sky-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <Icon size={28} className="mx-auto mb-2 text-gray-700" />
              <span className="text-xs sm:text-sm font-medium text-[#111] block">
                {isRTL ? industry.labelAr : industry.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Business Name Input */}
      <div className="mt-8">
        <WizardInput
          label={isRTL ? "اسم العمل" : "Business name"}
          labelAr="اسم العمل"
          value={answers.businessName || ""}
          onChange={(value) => updateAnswers("businessName", value)}
          placeholder={isRTL ? "أدخل اسم عملك" : "e.g., Tech Solutions"}
          placeholderAr="مثال: حلول التكنولوجيا"
          isRTL={isRTL}
          required
        />
      </div>
    </div>
  );
}

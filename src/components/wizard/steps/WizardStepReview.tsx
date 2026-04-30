"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import { getIndustryTemplate } from "@/config/industry-templates";
import { Edit2 } from "lucide-react";
import { ReactNode } from "react";

interface WizardStepReviewProps {
  isRTL: boolean;
}

const INDUSTRY_LABELS: Record<string, { en: string; ar: string }> = {
  company: { en: "Company", ar: "شركة" },
  freelancer: { en: "Freelancer", ar: "عامل حر" },
  agency: { en: "Agency", ar: "وكالة" },
  restaurant: { en: "Restaurant", ar: "مطعم" },
  clinic: { en: "Clinic", ar: "عيادة" },
  realEstate: { en: "Real Estate", ar: "عقارات" },
  photographer: { en: "Photographer", ar: "مصور" },
  lawyer: { en: "Lawyer", ar: "محامي" },
  saas: { en: "SaaS", ar: "برنامج خدمة" },
  ecommerce: { en: "E-commerce", ar: "تجارة إلكترونية" },
  event: { en: "Event", ar: "حدث" },
  education: { en: "Education", ar: "تعليم" },
  gym: { en: "Gym", ar: "صالة ألعاب" },
};

const SECTION_LABELS: Record<string, { en: string; ar: string }> = {
  navbar: { en: "Navigation", ar: "التنقل" },
  hero: { en: "Hero", ar: "البطل" },
  about: { en: "About", ar: "حول" },
  services: { en: "Services", ar: "الخدمات" },
  features: { en: "Features", ar: "الميزات" },
  team: { en: "Team", ar: "الفريق" },
  testimonials: { en: "Testimonials", ar: "الآراء" },
  clients: { en: "Clients", ar: "العملاء" },
  stats: { en: "Stats", ar: "الإحصائيات" },
  pricing: { en: "Pricing", ar: "التسعير" },
  faq: { en: "FAQ", ar: "الأسئلة" },
  cta: { en: "CTA", ar: "دعوة" },
  contact: { en: "Contact", ar: "التواصل" },
  footer: { en: "Footer", ar: "التذييل" },
};

interface ReviewCard {
  title: string;
  fields: Array<{ label: string; value: string | ReactNode }>;
  step: number;
}

export default function WizardStepReview({
  isRTL,
}: WizardStepReviewProps) {
  const { answers, setStep } = useWizardStore();

  const industryLabel = answers.businessType
    ? INDUSTRY_LABELS[answers.businessType]?.[isRTL ? "ar" : "en"] || answers.businessType
    : "—";

  const selectedSections = (answers.selectedSections as string[]) || [];

  const cards: ReviewCard[] = [
    {
      title: isRTL ? "العمل" : "Business",
      fields: [
        {
          label: isRTL ? "نوع العمل" : "Type",
          value: industryLabel,
        },
        {
          label: isRTL ? "اسم العمل" : "Name",
          value: answers.businessName || "—",
        },
      ],
      step: 0,
    },
    {
      title: isRTL ? "التواصل" : "Contact",
      fields: [
        {
          label: isRTL ? "المدينة" : "City",
          value: answers.city || "—",
        },
        {
          label: isRTL ? "الهاتف" : "Phone",
          value: answers.phone || "—",
        },
        {
          label: isRTL ? "WhatsApp" : "WhatsApp",
          value: answers.whatsappEnabled
            ? isRTL
              ? "مفعل"
              : "Enabled"
            : isRTL
              ? "معطل"
              : "Disabled",
        },
      ],
      step: 1,
    },
    {
      title: isRTL ? "العلامة" : "Brand",
      fields: [
        {
          label: isRTL ? "اللون" : "Color",
          value: (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md border border-gray-300"
                style={{ backgroundColor: answers.themeColor || "#000" }}
              />
              <span className="text-sm font-mono text-gray-700">
                {answers.themeColor || "—"}
              </span>
            </div>
          ),
        },
        {
          label: isRTL ? "الشعار" : "Logo",
          value: answers.logo
            ? isRTL
              ? "مرفوع"
              : "Uploaded"
            : isRTL
              ? "لم يتم التحميل"
              : "Not uploaded",
        },
        {
          label: isRTL ? "الوصف" : "Description",
          value:
            answers.description && answers.description.length > 0
              ? `${answers.description.substring(0, 30)}${answers.description.length > 30 ? "..." : ""}`
              : "—",
        },
      ],
      step: 2,
    },
    {
      title: isRTL ? "الأقسام" : "Sections",
      fields: [
        {
          label: isRTL ? "مختار" : "Selected",
          value: (
            <div className="flex flex-wrap gap-1">
              {selectedSections.length > 0 ? (
                selectedSections.map((section) => (
                  <span
                    key={section}
                    className="px-2 py-1 bg-sky-50 text-sky-700 text-xs rounded-md"
                  >
                    {SECTION_LABELS[section]?.[isRTL ? "ar" : "en"] || section}
                  </span>
                ))
              ) : (
                <span>—</span>
              )}
            </div>
          ),
        },
      ],
      step: 3,
    },
    {
      title: isRTL ? "اللغة" : "Language",
      fields: [
        {
          label: isRTL ? "اللغة الأساسية" : "Primary",
          value: answers.language === "ar"
            ? "🇸🇦 العربية"
            : "🇺🇸 English",
        },
      ],
      step: 4,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-[#111] mb-3">
          {isRTL ? "مراجعة التفاصيل" : "Review your details"}
        </h1>
        <p className="text-base text-gray-500">
          {isRTL ? "تحقق من جميع المعلومات قبل الإنشاء" : "Make sure everything is correct before creating your site"}
        </p>
      </div>

      {/* Review Cards Grid */}
      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="border border-gray-200 rounded-xl p-5 bg-white hover:border-gray-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#111]">
                {card.title}
              </h3>
              <button
                onClick={() => setStep(card.step)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                title={isRTL ? "تعديل" : "Edit"}
              >
                <Edit2 size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {card.fields.map((field) => (
                <div
                  key={field.label}
                  className="flex items-start justify-between"
                >
                  <p className="text-xs text-gray-500">
                    {field.label}
                  </p>
                  <p className="text-sm font-medium text-gray-700 text-right max-w-xs">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl text-center">
        <p className="text-sm font-medium text-sky-900">
          {isRTL
            ? "✨ جاهز لإنشاء موقعك الاحترافي!"
            : "✨ Ready to create your professional website!"}
        </p>
      </div>
    </div>
  );
}

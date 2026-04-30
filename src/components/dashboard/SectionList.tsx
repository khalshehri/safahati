"use client";

import type { InferSelectModel } from "drizzle-orm";
import { sections } from "@/lib/db/schema";
import { motion } from "framer-motion";

interface SectionListProps {
  sections: InferSelectModel<typeof sections>[];
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}

const SECTION_ICONS: Record<string, string> = {
  navbar: "🧭",
  hero: "⚡",
  about: "ℹ️",
  services: "🎯",
  features: "✨",
  team: "👥",
  testimonials: "💬",
  clients: "🏢",
  stats: "📊",
  pricing: "💳",
  faq: "❓",
  cta: "🚀",
  contact: "📧",
  footer: "🔗",
};

const SECTION_LABELS: Record<string, { en: string; ar: string }> = {
  navbar: { en: "Navigation Bar", ar: "شريط التنقل" },
  hero: { en: "Hero Section", ar: "قسم البطل" },
  about: { en: "About Us", ar: "عن الشركة" },
  services: { en: "Services", ar: "الخدمات" },
  features: { en: "Features", ar: "الميزات" },
  team: { en: "Team", ar: "الفريق" },
  testimonials: { en: "Testimonials", ar: "الآراء" },
  clients: { en: "Clients", ar: "العملاء" },
  stats: { en: "Statistics", ar: "الإحصائيات" },
  pricing: { en: "Pricing", ar: "التسعير" },
  faq: { en: "FAQ", ar: "الأسئلة الشائعة" },
  cta: { en: "Call to Action", ar: "الدعوة للإجراء" },
  contact: { en: "Contact", ar: "التواصل" },
  footer: { en: "Footer", ar: "التذييل" },
};

export default function SectionList({
  sections: sectionsList,
  selectedSectionId,
  onSelectSection,
}: SectionListProps) {
  return (
    <div className="px-4 py-4 space-y-2">
      {sectionsList.map((section, index) => {
        const isSelected = section.id === selectedSectionId;
        const label =
          SECTION_LABELS[section.blockType] || {
            en: section.blockType,
            ar: section.blockType,
          };
        const icon = SECTION_ICONS[section.blockType] || "📄";

        return (
          <motion.button
            key={section.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectSection(section.id)}
            className={`
              w-full text-left px-4 py-3 rounded-lg transition-all
              ${
                isSelected
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{label.en}</p>
                <p className="text-xs opacity-75">{section.templateId}</p>
              </div>
              {!section.isVisible && (
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  Hidden
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

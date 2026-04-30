import type { IndustryTemplate, SectionData } from "@/types/blocks";
import type { WizardAnswers } from "@/lib/validators";

export function populateSections(
  template: IndustryTemplate,
  answers: WizardAnswers
): Omit<SectionData, "id" | "siteId">[] {
  const sections = JSON.parse(JSON.stringify(template.sections));

  sections.forEach((section) => {
    const config = section.config as Record<string, any>;

    switch (section.blockType) {
      case "navbar":
        config.logo = answers.businessName;
        config.logoAr = answers.businessName;
        break;

      case "hero":
        if (["freelancer", "resume"].includes(answers.businessType)) {
          config.heading = answers.businessName;
          config.headingAr = answers.businessName;
        }
        if (answers.description) {
          config.subheading = answers.description;
          config.subheadingAr = answers.description;
        }
        break;

      case "about":
        config.heading = `About ${answers.businessName}`;
        config.headingAr = `عن ${answers.businessName}`;
        if (answers.description) {
          config.content = answers.description;
          config.contentAr = answers.description;
        }
        break;

      case "contact":
        config.phone = answers.phone;
        config.address = answers.city || "Riyadh, Saudi Arabia";
        config.addressAr = answers.city || "الرياض، المملكة العربية السعودية";
        break;

      case "footer":
        config.logo = answers.businessName;
        config.logoAr = answers.businessName;
        if (answers.description) {
          config.description = answers.description;
          config.descriptionAr = answers.description;
        }
        config.copyright = `© 2026 ${answers.businessName}. All rights reserved.`;
        config.copyrightAr = `© 2026 ${answers.businessName}. جميع الحقوق محفوظة.`;
        break;
    }
  });

  return sections;
}

export function buildTheme(
  baseTheme: Omit<IndustryTemplate["defaultTheme"], "direction">,
  answers: WizardAnswers
) {
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: answers.themeColor,
    },
    direction: answers.language === "ar" ? "rtl" : "ltr",
  };
}

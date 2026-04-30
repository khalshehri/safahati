// Technical field names → Plain language labels
export const PLAIN_LANGUAGE_LABELS: Record<string, { en: string; ar: string }> = {
  // Users table
  id: { en: "ID", ar: "المعرف" },
  name: { en: "Name", ar: "الاسم" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  phone: { en: "Phone", ar: "رقم الهاتف" },
  company: { en: "Company Name", ar: "اسم الشركة" },
  country: { en: "Country", ar: "الدولة" },
  timezone: { en: "Time Zone", ar: "المنطقة الزمنية" },
  language: { en: "Preferred Language", ar: "اللغة المفضلة" },
  onboardingComplete: { en: "Setup Complete", ar: "تم إكمال الإعداد" },

  // Sites table
  slug: { en: "Website URL", ar: "عنوان الموقع" },
  industry: { en: "Business Type", ar: "نوع العمل" },
  theme: { en: "Design Theme", ar: "مظهر التصميم" },
  status: { en: "Publish Status", ar: "حالة النشر" },
  description: { en: "About Your Business", ar: "نبذة عن عملك" },
  logo: { en: "Logo", ar: "الشعار" },
  favicon: { en: "Favicon", ar: "أيقونة الموقع" },
  customDomain: { en: "Custom Domain", ar: "النطاق المخصص" },
  seoTitle: { en: "Page Title (SEO)", ar: "عنوان الصفحة" },
  seoDescription: { en: "Page Description (SEO)", ar: "وصف الصفحة" },
  publishedAt: { en: "Published On", ar: "تاريخ النشر" },
  draftState: { en: "Draft Content", ar: "المسودة" },
  clientUpdatedAt: { en: "Last Updated", ar: "آخر تحديث" },

  // Sections table
  blockType: { en: "Section Type", ar: "نوع القسم" },
  templateId: { en: "Section Layout", ar: "تصميم القسم" },
  config: { en: "Section Content", ar: "محتوى القسم" },
  sortOrder: { en: "Position", ar: "الموضع" },
  isVisible: { en: "Visible", ar: "مرئي" },
  translationState: { en: "Translation Status", ar: "حالة الترجمة" },

  // UI Elements
  create: { en: "Add", ar: "إضافة" },
  edit: { en: "Edit", ar: "تعديل" },
  delete: { en: "Delete", ar: "حذف" },
  save: { en: "Save", ar: "حفظ" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  loading: { en: "Loading...", ar: "جاري التحميل..." },
  error: { en: "Error", ar: "خطأ" },
  success: { en: "Success", ar: "نجح" },
  confirm: { en: "Confirm", ar: "تأكيد" },
  close: { en: "Close", ar: "إغلاق" },
};

// Map of technical term → plain language
export const TECHNICAL_TO_PLAIN: Record<string, string> = {
  blockType: "Section Type",
  templateId: "Section Layout",
  config: "Section Settings",
  sortOrder: "Position",
  isVisible: "Show Section",
  siteId: "Website",
  userId: "User",
  createdAt: "Created",
  updatedAt: "Last Updated",
  publishedAt: "Published",
  draftState: "Draft",
};

export function getPlainLabel(
  technicalName: string,
  language: "en" | "ar" = "en"
): string {
  const label = PLAIN_LANGUAGE_LABELS[technicalName];
  if (!label) return technicalName;
  return label[language];
}

export function replaceWithPlainLanguage(
  text: string,
  language: "en" | "ar" = "en"
): string {
  let result = text;

  Object.entries(TECHNICAL_TO_PLAIN).forEach(([technical, plain]) => {
    const regex = new RegExp(technical, "gi");
    result = result.replace(regex, plain);
  });

  return result;
}

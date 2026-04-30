"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import StepCard from "../components/StepCard";
import ColorPicker from "../components/ColorPicker";
import { Upload, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface WizardStepBrandProps {
  isRTL: boolean;
}

export default function WizardStepBrand({ isRTL }: WizardStepBrandProps) {
  const { answers, updateAnswers } = useWizardStore();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLogoUpload = async (file: File) => {
    setUploadLoading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateAnswers("logo", data.url);
      } else {
        setUploadError(isRTL ? "فشل التحميل" : "Upload failed");
      }
    } catch (error) {
      setUploadError(isRTL ? "خطأ في التحميل" : "Upload error");
      console.error("Upload error:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <StepCard
      title={isRTL ? "هويتك البصرية" : "Create Your Visual Identity"}
      subtitle={isRTL ? "اختر الألوان والشعار" : "Choose colors and logo"}
      isRTL={isRTL}
    >
      <div className="space-y-8">
        {/* Logo Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#2D3436]">
            {isRTL ? "الشعار" : "Logo"}
          </h3>

          {answers.logo ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative p-6 bg-gray-50 rounded-lg border-2 border-[#7BA386]"
            >
              <div className="flex items-center gap-4">
                <img
                  src={answers.logo}
                  alt="Logo preview"
                  className="w-16 h-16 object-contain rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2D3436]">
                    {isRTL ? "تم التحميل بنجاح" : "Logo uploaded"}
                  </p>
                  <button
                    onClick={() => updateAnswers("logo", undefined)}
                    className="text-sm text-[#D97E5C] hover:underline"
                  >
                    {isRTL ? "تغيير" : "Change"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                }}
                className="hidden"
                disabled={uploadLoading}
              />
              <div
                className={`
                  p-8 border-2 border-dashed rounded-lg
                  text-center transition-all duration-300
                  ${
                    uploadLoading
                      ? "border-[#D4894C] bg-orange-50"
                      : "border-[#E8DFD5] bg-white hover:border-[#D4894C] hover:bg-orange-50"
                  }
                `}
              >
                <motion.div
                  animate={{ scale: uploadLoading ? 1.1 : 1 }}
                  className="flex justify-center mb-3"
                >
                  <div className="p-3 bg-orange-100 rounded-lg">
                    {uploadLoading ? (
                      <div className="w-6 h-6 border-2 border-[#D4894C] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={24} className="text-[#D4894C]" />
                    )}
                  </div>
                </motion.div>
                <p className="font-medium text-[#2D3436]">
                  {uploadLoading
                    ? isRTL
                      ? "جاري التحميل..."
                      : "Uploading..."
                    : isRTL
                    ? "اسحب الشعار هنا"
                    : "Drag logo here"}
                </p>
                <p className="text-sm text-[#8B7D6F]">
                  {isRTL ? "أو انقر لاختيار" : "or click to select"}
                </p>
              </div>
            </label>
          )}

          {uploadError && (
            <p className="text-sm text-[#D97E5C]">{uploadError}</p>
          )}
        </div>

        {/* Color Picker */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#2D3436]">
            {isRTL ? "لون العلامة التجارية" : "Brand Color"}
          </h3>
          <ColorPicker
            selectedColor={answers.themeColor || "#D4894C"}
            onColorSelect={(color) => updateAnswers("themeColor", color)}
            isRTL={isRTL}
          />
        </div>

        {/* Description */}
        <textarea
          value={answers.description || ""}
          onChange={(e) => updateAnswers("description", e.target.value)}
          placeholder={
            isRTL
              ? "اكتب وصفاً قصيراً لعملك..."
              : "Write a short description of your business..."
          }
          maxLength={500}
          className={`
            w-full h-24 px-4 py-3 rounded-lg border-2
            border-[#E8DFD5] bg-white
            font-medium text-base
            placeholder:text-[#A99D93]
            focus:outline-none focus:border-[#D4894C] focus:ring-2 focus:ring-orange-100
            transition-all duration-300
            resize-none
            ${isRTL ? "text-right" : "text-left"}
          `}
          dir={isRTL ? "rtl" : "ltr"}
        />
        <p className="text-xs text-[#A99D93]">
          {(answers.description || "").length} / 500
        </p>
      </div>
    </StepCard>
  );
}

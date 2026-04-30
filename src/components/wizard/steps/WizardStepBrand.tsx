"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import Input from "../components/Input";
import { useState } from "react";

interface WizardStepBrandProps {
  isRTL: boolean;
}

const COLORS = [
  { hex: "#000000", name: "Black" },
  { hex: "#1F2937", name: "Dark Gray" },
  { hex: "#6B7280", name: "Gray" },
  { hex: "#3B82F6", name: "Blue" },
  { hex: "#06B6D4", name: "Cyan" },
  { hex: "#10B981", name: "Green" },
  { hex: "#F59E0B", name: "Amber" },
  { hex: "#EF4444", name: "Red" },
  { hex: "#8B5CF6", name: "Purple" },
];

export default function WizardStepBrand({ isRTL }: WizardStepBrandProps) {
  const { answers, updateAnswers } = useWizardStore();
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleLogoUpload = async (file: File) => {
    setUploadLoading(true);
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
      }
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {isRTL ? "الهوية البصرية" : "Brand identity"}
        </h2>
        <p className="text-sm text-gray-600">
          {isRTL ? "اختر اللون والشعار" : "Choose a color and upload your logo"}
        </p>
      </div>

      {/* Color Picker */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-3 block">
          {isRTL ? "لون العلامة الأساسي" : "Primary brand color"}
        </label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => updateAnswers("themeColor", color.hex)}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                answers.themeColor === color.hex
                  ? "border-gray-400"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-3 block">
          {isRTL ? "الشعار" : "Logo (optional)"}
        </label>
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
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
          {answers.logo ? (
            <div className="flex items-center justify-center gap-3">
              <img src={answers.logo} alt="Logo" className="w-10 h-10 object-contain" />
              <span className="text-sm text-gray-700">{isRTL ? "تم التحميل" : "Uploaded"}</span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {isRTL ? "اسحب صورة أو انقر" : "Drag image or click"}
            </div>
          )}
        </label>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-2 block">
          {isRTL ? "الوصف (اختياري)" : "Description (optional)"}
        </label>
        <textarea
          value={answers.description || ""}
          onChange={(e) => updateAnswers("description", e.target.value)}
          placeholder={isRTL ? "اكتب وصفاً قصيراً..." : "Write a short description..."}
          maxLength={500}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
          rows={3}
        />
      </div>
    </div>
  );
}

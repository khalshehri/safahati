"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import { useState } from "react";
import { Upload, Loader } from "lucide-react";

interface WizardStepBrandProps {
  isRTL: boolean;
}

const COLORS = [
  { hex: "#000000", name: "Black" },
  { hex: "#1F2937", name: "Dark Gray" },
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
  const [customColor, setCustomColor] = useState(answers.themeColor || "");

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

  const descLength = (answers.description || "").length;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-[#111] mb-3">
          {isRTL ? "جعل موقعك فريداً" : "Make it yours"}
        </h1>
        <p className="text-base text-gray-500">
          {isRTL ? "اختر لوناً وأضف شعارك" : "Choose your brand color and upload your logo"}
        </p>
      </div>

      {/* Color Picker */}
      <div>
        <p className="text-sm font-medium text-[#111] mb-4">
          {isRTL ? "اللون الأساسي" : "Primary color"}
        </p>
        <div className="space-y-4">
          {/* Preset Colors */}
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => {
                  updateAnswers("themeColor", color.hex);
                  setCustomColor(color.hex);
                }}
                className={`w-12 h-12 rounded-xl border-2 transition-all ${
                  answers.themeColor === color.hex
                    ? "border-sky-500 scale-110"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <label className="text-sm font-medium text-[#111]">
              {isRTL ? "لون مخصص" : "Custom color"}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor || "#000000"}
                onChange={(e) => {
                  const hex = e.target.value;
                  setCustomColor(hex);
                  updateAnswers("themeColor", hex);
                }}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={customColor || ""}
                onChange={(e) => {
                  const hex = e.target.value;
                  setCustomColor(hex);
                  if (/^#[0-9A-F]{6}$/i.test(hex)) {
                    updateAnswers("themeColor", hex);
                  }
                }}
                placeholder="#000000"
                className="w-24 px-3 py-2 text-xs border border-gray-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <p className="text-sm font-medium text-[#111] mb-4">
          {isRTL ? "الشعار (اختياري)" : "Logo (optional)"}
        </p>
        <label
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            uploadLoading
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 hover:border-sky-500 hover:bg-sky-50"
          }`}
        >
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
          {uploadLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader size={20} className="text-sky-500 animate-spin" />
              <span className="text-sm text-gray-600">
                {isRTL ? "جاري التحميل..." : "Uploading..."}
              </span>
            </div>
          ) : answers.logo ? (
            <div className="flex items-center justify-center gap-3">
              <img
                src={answers.logo}
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-sm text-gray-700">
                {isRTL ? "تم التحميل" : "Uploaded"}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {isRTL ? "اسحب الصورة أو انقر" : "Drag image or click"}
              </span>
            </div>
          )}
        </label>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-[#111]">
            {isRTL ? "الوصف (اختياري)" : "Description (optional)"}
          </p>
          <p className="text-xs text-gray-400">
            {descLength} / 500
          </p>
        </div>
        <textarea
          value={answers.description || ""}
          onChange={(e) => updateAnswers("description", e.target.value.slice(0, 500))}
          placeholder={isRTL ? "اكتب وصفاً قصيراً عن عملك..." : "Tell customers about your business..."}
          className="w-full h-24 px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 resize-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

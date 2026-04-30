"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ColorOption {
  hex: string;
  name: string;
  category: string;
}

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  isRTL: boolean;
}

const COLOR_PALETTE: ColorOption[] = [
  // Warm
  { hex: "#D4894C", name: "Sunset Amber", category: "Warm" },
  { hex: "#E8A566", name: "Warm Apricot", category: "Warm" },
  { hex: "#C76A3A", name: "Terracotta", category: "Warm" },
  { hex: "#8B7D6F", name: "Warm Taupe", category: "Warm" },

  // Cool
  { hex: "#6B8FB3", name: "Soft Blue", category: "Cool" },
  { hex: "#7BA386", name: "Sage Green", category: "Cool" },
  { hex: "#8B7EA6", name: "Lavender", category: "Cool" },
  { hex: "#4A7089", name: "Deep Slate", category: "Cool" },

  // Vibrant
  { hex: "#F24E4E", name: "Vibrant Red", category: "Vibrant" },
  { hex: "#F59E0B", name: "Golden Yellow", category: "Vibrant" },
  { hex: "#10B981", name: "Emerald Green", category: "Vibrant" },
  { hex: "#8B5CF6", name: "Purple", category: "Vibrant" },

  // Neutral
  { hex: "#1F2937", name: "Deep Gray", category: "Neutral" },
  { hex: "#6B7280", name: "Gray", category: "Neutral" },
  { hex: "#D1D5DB", name: "Light Gray", category: "Neutral" },
  { hex: "#000000", name: "Black", category: "Neutral" },
];

export default function ColorPicker({
  selectedColor,
  onColorSelect,
  isRTL,
}: ColorPickerProps) {
  const categories = ["Warm", "Cool", "Vibrant", "Neutral"];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-semibold text-[#2D3436]">
            {isRTL
              ? {
                  Warm: "دافئ",
                  Cool: "بارد",
                  Vibrant: "نابض",
                  Neutral: "محايد",
                }[category]
              : category}
          </h3>

          <div
            className={`grid grid-cols-4 gap-3 ${isRTL ? "flex flex-row-reverse" : ""}`}
          >
            {COLOR_PALETTE.filter((c) => c.category === category).map(
              (color) => (
                <motion.button
                  key={color.hex}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onColorSelect(color.hex)}
                  className={`
                    relative w-full aspect-square rounded-xl
                    transition-all duration-300
                    ${
                      selectedColor === color.hex
                        ? "ring-4 ring-offset-2 ring-[#D4894C] shadow-lg"
                        : "hover:shadow-md"
                    }
                  `}
                  style={{
                    backgroundColor: color.hex,
                  }}
                  title={color.name}
                >
                  {selectedColor === color.hex && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check
                        size={24}
                        strokeWidth={3}
                        color="white"
                        className="drop-shadow-md"
                      />
                    </motion.div>
                  )}
                </motion.button>
              )
            )}
          </div>
        </div>
      ))}

      {/* Color Preview */}
      <motion.div
        layout
        className="mt-8 p-6 rounded-lg border-2 border-[#E8DFD5]"
      >
        <p className="text-sm text-[#8B7D6F] mb-3">
          {isRTL ? "معاينة العلامة التجارية" : "Brand Preview"}
        </p>
        <div className="space-y-2">
          <button
            style={{ backgroundColor: selectedColor }}
            className="w-full py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
          >
            {isRTL ? "زر الإجراء الأساسي" : "Primary Action Button"}
          </button>
          <div className="flex gap-2">
            <div
              style={{ backgroundColor: selectedColor }}
              className="w-10 h-10 rounded-lg"
            />
            <div className="flex-1">
              <div
                style={{ backgroundColor: selectedColor }}
                className="h-1 rounded-full"
              />
              <p className="text-xs text-[#A99D93] mt-2">
                {COLOR_PALETTE.find((c) => c.hex === selectedColor)?.name}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

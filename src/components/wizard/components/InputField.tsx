"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  success?: boolean;
  isRTL: boolean;
  maxLength?: number;
  type?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  error,
  success,
  isRTL,
  maxLength,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium text-[#2D3436]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            w-full h-12 px-4 py-3 rounded-lg
            border-2 transition-all duration-300
            font-medium text-base
            placeholder:text-[#A99D93]
            focus:outline-none
            ${isRTL ? "text-right" : "text-left"}
            ${
              error
                ? "border-[#D97E5C] bg-red-50 focus:border-[#D97E5C] focus:ring-2 focus:ring-red-100"
                : success
                ? "border-[#7BA386] bg-green-50 focus:border-[#7BA386] focus:ring-2 focus:ring-green-100"
                : "border-[#E8DFD5] bg-white hover:border-[#D4894C] focus:border-[#D4894C] focus:ring-2 focus:ring-orange-100"
            }
          `}
          dir={isRTL ? "rtl" : "ltr"}
        />

        {/* Success icon */}
        {success && !error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"} text-[#7BA386]`}
          >
            <Check size={20} strokeWidth={3} />
          </motion.div>
        )}

        {/* Error icon */}
        {error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"} text-[#D97E5C]`}
          >
            <AlertCircle size={20} />
          </motion.div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[#D97E5C] flex items-center gap-1"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <AlertCircle size={16} />
          {error}
        </motion.p>
      )}

      {/* Character count */}
      {maxLength && (
        <p
          className="text-xs text-[#A99D93]"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  );
}

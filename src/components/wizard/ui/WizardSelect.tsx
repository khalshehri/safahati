"use client";

import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
  labelAr?: string;
}

interface WizardSelectProps {
  label?: string;
  labelAr?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  helperText?: string;
  helperTextAr?: string;
  isRTL?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export default function WizardSelect({
  label,
  labelAr,
  value,
  onChange,
  options,
  error,
  helperText,
  helperTextAr,
  isRTL = false,
  required = false,
  disabled = false,
}: WizardSelectProps) {
  const displayLabel = isRTL && labelAr ? labelAr : label;
  const displayHelper = isRTL && helperTextAr ? helperTextAr : helperText;

  return (
    <div className="space-y-2">
      {displayLabel && (
        <label className="text-sm font-medium text-[#111]">
          {displayLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full h-12 px-4 text-sm appearance-none
            rounded-lg border transition-all
            focus:outline-none focus:ring-2
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-400/40"
                : "border-gray-200 focus:border-sky-500 focus:ring-sky-500/40"
            }
            ${isRTL ? "text-right pr-10" : "text-left"}
          `}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {isRTL && opt.labelAr ? opt.labelAr : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className={`
            absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none
            ${isRTL ? "left-4" : "right-4"}
          `}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {displayHelper && !error && (
        <p className="text-xs text-gray-400">{displayHelper}</p>
      )}
    </div>
  );
}

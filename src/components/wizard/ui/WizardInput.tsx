"use client";

interface WizardInputProps {
  label?: string;
  labelAr?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  placeholderAr?: string;
  error?: string;
  helperText?: string;
  helperTextAr?: string;
  type?: string;
  isRTL?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export default function WizardInput({
  label,
  labelAr,
  value,
  onChange,
  placeholder,
  placeholderAr,
  error,
  helperText,
  helperTextAr,
  type = "text",
  isRTL = false,
  required = false,
  disabled = false,
}: WizardInputProps) {
  const displayLabel = isRTL && labelAr ? labelAr : label;
  const displayPlaceholder = isRTL && placeholderAr ? placeholderAr : placeholder;
  const displayHelper = isRTL && helperTextAr ? helperTextAr : helperText;

  return (
    <div className="space-y-2">
      {displayLabel && (
        <label className="text-sm font-medium text-[#111]">
          {displayLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={displayPlaceholder}
        disabled={disabled}
        className={`
          w-full h-12 px-4 text-sm
          rounded-lg border transition-all
          focus:outline-none focus:ring-2
          placeholder:text-gray-400
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-400/40"
              : "border-gray-200 focus:border-sky-500 focus:ring-sky-500/40"
          }
          ${isRTL ? "text-right" : "text-left"}
        `}
        dir={isRTL ? "rtl" : "ltr"}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {displayHelper && !error && (
        <p className="text-xs text-gray-400">{displayHelper}</p>
      )}
    </div>
  );
}

"use client";

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  isRTL?: boolean;
}

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  isRTL = false,
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5 text-sm
          border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          transition-all
          placeholder:text-gray-400
          ${isRTL ? "text-right" : "text-left"}
        `}
        dir={isRTL ? "rtl" : "ltr"}
      />
    </div>
  );
}

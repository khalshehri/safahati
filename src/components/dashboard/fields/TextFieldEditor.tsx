"use client";

interface TextFieldEditorProps {
  fieldName: string;
  value: string;
  arabicValue?: string;
  onChange: (value: string) => void;
  onArabicChange?: (value: string) => void;
}

export default function TextFieldEditor({
  fieldName,
  value,
  arabicValue,
  onChange,
  onArabicChange,
}: TextFieldEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          {fieldName}
        </label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder={`Enter ${fieldName.toLowerCase()}`}
          dir="ltr"
        />
      </div>

      {arabicValue !== undefined && onArabicChange && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            {fieldName} (Arabic)
          </label>
          <input
            type="text"
            value={arabicValue || ""}
            onChange={(e) => onArabicChange(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder={`أدخل ${fieldName.toLowerCase()}`}
            dir="rtl"
          />
        </div>
      )}
    </div>
  );
}

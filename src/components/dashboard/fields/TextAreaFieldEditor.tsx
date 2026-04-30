"use client";

interface TextAreaFieldEditorProps {
  fieldName: string;
  value: string;
  arabicValue?: string;
  onChange: (value: string) => void;
  onArabicChange?: (value: string) => void;
}

export default function TextAreaFieldEditor({
  fieldName,
  value,
  arabicValue,
  onChange,
  onArabicChange,
}: TextAreaFieldEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          {fieldName}
        </label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          placeholder={`Enter ${fieldName.toLowerCase()}`}
          rows={5}
          dir="ltr"
        />
      </div>

      {arabicValue !== undefined && onArabicChange && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            {fieldName} (Arabic)
          </label>
          <textarea
            value={arabicValue || ""}
            onChange={(e) => onArabicChange(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            placeholder={`أدخل ${fieldName.toLowerCase()}`}
            rows={5}
            dir="rtl"
          />
        </div>
      )}
    </div>
  );
}

"use client";

import TextFieldEditor from "./TextFieldEditor";
import TextAreaFieldEditor from "./TextAreaFieldEditor";
import URLFieldEditor from "./URLFieldEditor";
import ObjectFieldEditor from "./ObjectFieldEditor";
import ArrayFieldEditor from "./ArrayFieldEditor";

interface DynamicFieldEditorProps {
  fieldName: string;
  value: any;
  arabicValue?: any;
  onChange: (value: any) => void;
  onArabicChange?: (value: any) => void;
}

const cleanFieldName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export default function DynamicFieldEditor({
  fieldName,
  value,
  arabicValue,
  onChange,
  onArabicChange,
}: DynamicFieldEditorProps) {
  const displayName = cleanFieldName(fieldName);

  // Determine field type based on value structure
  if (Array.isArray(value)) {
    return (
      <ArrayFieldEditor
        fieldName={displayName}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return (
      <ObjectFieldEditor
        fieldName={displayName}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (typeof value === "string") {
    // Detect if it's a URL
    if (fieldName.toLowerCase().includes("url") || value.startsWith("http")) {
      return (
        <URLFieldEditor
          fieldName={displayName}
          value={value}
          onChange={onChange}
        />
      );
    }

    // Detect if it's long text (use textarea)
    if (value.length > 100 || fieldName.toLowerCase().includes("content")) {
      return (
        <TextAreaFieldEditor
          fieldName={displayName}
          value={value}
          arabicValue={arabicValue}
          onChange={onChange}
          onArabicChange={onArabicChange}
        />
      );
    }

    // Default to text field
    return (
      <TextFieldEditor
        fieldName={displayName}
        value={value}
        arabicValue={arabicValue}
        onChange={onChange}
        onArabicChange={onArabicChange}
      />
    );
  }

  // Unknown type, show as JSON
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        {displayName}
      </label>
      <pre className="p-4 bg-gray-50 rounded-lg text-xs border border-gray-200 overflow-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

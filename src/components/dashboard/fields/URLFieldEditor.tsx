"use client";

interface URLFieldEditorProps {
  fieldName: string;
  value: string;
  onChange: (value: string) => void;
}

export default function URLFieldEditor({
  fieldName,
  value,
  onChange,
}: URLFieldEditorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        {fieldName}
      </label>
      <input
        type="url"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-mono"
        placeholder="https://example.com"
        dir="ltr"
      />
      <p className="text-xs text-gray-500">
        Enter a valid URL starting with http:// or https://
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ObjectFieldEditorProps {
  fieldName: string;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
}

const cleanFieldName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export default function ObjectFieldEditor({
  fieldName,
  value,
  onChange,
}: ObjectFieldEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFieldChange = (key: string, newValue: any) => {
    onChange({
      ...value,
      [key]: newValue,
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-black transition-colors"
      >
        {isExpanded ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
        {fieldName}
      </button>

      {isExpanded && (
        <div className="pl-4 space-y-4 border-l-2 border-gray-200">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {cleanFieldName(key)}
              </label>
              {typeof val === "string" ? (
                <input
                  type={key.toLowerCase().includes("url") ? "url" : "text"}
                  value={val || ""}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder={`Enter ${cleanFieldName(key).toLowerCase()}`}
                  dir={key.endsWith("Ar") ? "rtl" : "ltr"}
                />
              ) : typeof val === "number" ? (
                <input
                  type="number"
                  value={val || 0}
                  onChange={(e) =>
                    handleFieldChange(key, parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              ) : typeof val === "boolean" ? (
                <input
                  type="checkbox"
                  checked={val || false}
                  onChange={(e) => handleFieldChange(key, e.target.checked)}
                  className="w-4 h-4 border-gray-300 text-black rounded focus:ring-black"
                />
              ) : (
                <pre className="p-3 bg-gray-50 rounded-lg text-xs border border-gray-200 overflow-auto">
                  {JSON.stringify(val, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

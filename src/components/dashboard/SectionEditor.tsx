"use client";

import { useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { sections } from "@/lib/db/schema";
import DynamicFieldEditor from "./fields/DynamicFieldEditor";
import { Save, Loader2 } from "lucide-react";

interface SectionEditorProps {
  section: InferSelectModel<typeof sections>;
  onUpdate: (section: InferSelectModel<typeof sections>) => void;
  siteName: string;
}

export default function SectionEditor({
  section,
  onUpdate,
  siteName,
}: SectionEditorProps) {
  const initialConfig = typeof section.config === "string"
    ? JSON.parse(section.config)
    : section.config;
  const [config, setConfig] = useState<Record<string, any>>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const handleFieldChange = (fieldName: string, value: any) => {
    setConfig({
      ...config,
      [fieldName]: value,
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(
        `/api/sites/${section.siteId}/sections/${section.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config }),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
        setSavedAt(new Date());
      }
    } catch (error) {
      console.error("Failed to save section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getMainFields = () => {
    const fields = Object.keys(config).filter((key) => !key.endsWith("Ar"));
    return fields;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {section.blockType.charAt(0).toUpperCase() + section.blockType.slice(1)}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {siteName} • {section.templateId}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
        </div>
        {savedAt && (
          <p className="text-xs text-gray-500 mt-3">
            Saved at {savedAt.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-8">
          {getMainFields().map((fieldName) => (
            <DynamicFieldEditor
              key={fieldName}
              fieldName={fieldName}
              value={config[fieldName]}
              arabicValue={config[`${fieldName}Ar`]}
              onChange={(value) => handleFieldChange(fieldName, value)}
              onArabicChange={(value) =>
                handleFieldChange(`${fieldName}Ar`, value)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

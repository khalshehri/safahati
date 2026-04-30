"use client";

import { useWizardStore } from "@/lib/store/wizard-store";
import { ChangeEvent, useState } from "react";

export default function WizardStepLogo() {
  const { answers, updateAnswers } = useWizardStore();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        updateAnswers("logo", data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Add your logo (optional)</h2>
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        {(answers.logo as string) ? (
          <div>
            <img src={answers.logo as string} alt="Logo" className="h-24 mx-auto mb-4" />
            <button
              onClick={() => updateAnswers("logo", undefined)}
              className="text-sm text-slate-600 hover:text-red-600"
            >
              Remove logo
            </button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
              id="logo-upload"
            />
            <label htmlFor="logo-upload" className="cursor-pointer">
              <p className="text-slate-700 font-medium mb-2">
                {uploading ? "Uploading..." : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-slate-600">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

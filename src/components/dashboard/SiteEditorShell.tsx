"use client";

import { useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { sites, sections } from "@/lib/db/schema";
import SectionList from "./SectionList";
import SectionEditor from "./SectionEditor";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface SiteEditorShellProps {
  site: InferSelectModel<typeof sites>;
  sections: InferSelectModel<typeof sections>[];
}

export default function SiteEditorShell({
  site,
  sections: initialSections,
}: SiteEditorShellProps) {
  const [sections, setSections] = useState(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initialSections[0]?.id || null
  );

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const handleSectionUpdate = (updatedSection: typeof sections[0]) => {
    setSections(
      sections.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Header */}
      <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/${site.id}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="font-semibold text-gray-900">{site.name}</h1>
            <p className="text-xs text-gray-600">Edit sections</p>
          </div>
        </div>
      </div>

      {/* Left Sidebar - Section List */}
      <div className="hidden lg:flex w-80 bg-white border-r border-gray-200 flex-col">
        {/* Sidebar Header */}
        <div className="px-6 py-6 border-b border-gray-200">
          <Link
            href={`/dashboard/${site.id}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ChevronLeft size={16} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h2 className="text-lg font-bold text-gray-900">{site.name}</h2>
          <p className="text-sm text-gray-600">Edit your website sections</p>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto">
          <SectionList
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
          />
        </div>
      </div>

      {/* Right Side - Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedSection ? (
          <SectionEditor
            section={selectedSection}
            onUpdate={handleSectionUpdate}
            siteName={site.name}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No sections available</p>
          </div>
        )}
      </div>
    </div>
  );
}

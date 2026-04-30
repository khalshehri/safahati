"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ArrayFieldEditorProps {
  fieldName: string;
  value: any[];
  onChange: (value: any[]) => void;
}

const cleanFieldName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export default function ArrayFieldEditor({
  fieldName,
  value,
  onChange,
}: ArrayFieldEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItemExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleItemChange = (index: number, updatedItem: any) => {
    const newArray = [...value];
    newArray[index] = updatedItem;
    onChange(newArray);
  };

  const handleAddItem = () => {
    const newItem =
      value.length > 0
        ? { ...value[0] }
        : typeof value[0] === "object"
          ? {}
          : "";
    onChange([...value, newItem]);
    setExpandedItems([...expandedItems, value.length]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
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
        {fieldName} ({value.length} items)
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 pl-4 border-l-2 border-gray-200"
          >
            {value.map((item, index) => {
              const isItemExpanded = expandedItems.includes(index);
              const itemLabel =
                typeof item === "object" && item.label
                  ? item.label
                  : typeof item === "object" && item.title
                    ? item.title
                    : typeof item === "object" && item.value
                      ? item.value
                      : `Item ${index + 1}`;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Item Header */}
                  <button
                    onClick={() => toggleItemExpanded(index)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-left flex-1 min-w-0">
                      {isItemExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {itemLabel}
                        </p>
                        <p className="text-xs text-gray-600">
                          {typeof item === "object"
                            ? `${Object.keys(item).length} fields`
                            : typeof item}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(index);
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </button>

                  {/* Item Content */}
                  {isItemExpanded && (
                    <div className="p-4 space-y-4 bg-white border-t border-gray-200">
                      {typeof item === "object" && item !== null ? (
                        Object.entries(item).map(([key, val]) => (
                          <div key={key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              {cleanFieldName(key)}
                            </label>
                            {typeof val === "string" ? (
                              <input
                                type="text"
                                value={val || ""}
                                onChange={(e) =>
                                  handleItemChange(index, {
                                    ...item,
                                    [key]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                dir={key.endsWith("Ar") ? "rtl" : "ltr"}
                              />
                            ) : typeof val === "number" ? (
                              <input
                                type="number"
                                value={val}
                                onChange={(e) =>
                                  handleItemChange(index, {
                                    ...item,
                                    [key]: parseFloat(e.target.value),
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                            ) : (
                              <pre className="p-3 bg-gray-50 rounded-lg text-xs border border-gray-200">
                                {JSON.stringify(val, null, 2)}
                              </pre>
                            )}
                          </div>
                        ))
                      ) : (
                        <input
                          type="text"
                          value={item || ""}
                          onChange={(e) => handleItemChange(index, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Add Item Button */}
            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 w-full p-3 text-sm font-medium text-gray-700 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
              Add {fieldName.slice(0, -1)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

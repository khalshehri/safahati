"use client";

import { useState, useEffect } from "react";
import { DAYS_OF_WEEK, SAUDI_WEEKEND } from "@/lib/opening-hours";
import { toast } from "sonner";

interface Hour {
  dayOfWeek: number;
  timeStart: string;
  timeEnd: string;
  crossesMidnight: boolean;
}

interface OpeningHoursManagerProps {
  siteId: string;
}

export default function OpeningHoursManager({ siteId }: OpeningHoursManagerProps) {
  const [hours, setHours] = useState<Hour[]>([]);
  const [sameHoursEveryDay, setSameHoursEveryDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHours();
  }, [siteId]);

  const fetchHours = async () => {
    try {
      const res = await fetch(`/api/sites/${siteId}/opening-hours`);
      if (res.ok) {
        const data = await res.json();
        setHours(data.hours);
      }
    } catch (error) {
      console.error("Failed to fetch opening hours:", error);
      toast.error("Failed to load opening hours");
    } finally {
      setLoading(false);
    }
  };

  const updateHour = (dayOfWeek: number, field: string, value: any) => {
    setHours((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((h) => h.dayOfWeek === dayOfWeek);

      if (index >= 0) {
        updated[index] = { ...updated[index], [field]: value };
      } else {
        updated.push({
          dayOfWeek,
          timeStart: "09:00",
          timeEnd: "18:00",
          crossesMidnight: false,
          [field]: value,
        });
      }

      if (sameHoursEveryDay && field !== "dayOfWeek") {
        // Apply to all days
        return updated.map((h) => ({
          ...h,
          [field]: value,
        }));
      }

      return updated;
    });
  };

  const handleSameHoursToggle = (checked: boolean) => {
    setSameHoursEveryDay(checked);
    if (checked && hours.length > 0) {
      // Apply first day's hours to all days
      const template = hours[0];
      setHours(
        DAYS_OF_WEEK.map((day) => ({
          dayOfWeek: day.id,
          timeStart: template.timeStart,
          timeEnd: template.timeEnd,
          crossesMidnight: template.crossesMidnight,
        }))
      );
    }
  };

  const saveHours = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/sites/${siteId}/opening-hours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hours),
      });

      if (res.ok) {
        toast.success("Opening hours saved");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to save hours");
      }
    } catch (error) {
      console.error("Error saving hours:", error);
      toast.error("Failed to save opening hours");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-slate-600">Loading opening hours...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sameHoursEveryDay}
            onChange={(e) => handleSameHoursToggle(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-slate-700">
            Same hours every day
          </span>
        </label>
      </div>

      <div className="space-y-3">
        {DAYS_OF_WEEK.map((day) => {
          const dayHours = hours.find((h) => h.dayOfWeek === day.id) || {
            dayOfWeek: day.id,
            timeStart: "09:00",
            timeEnd: "18:00",
            crossesMidnight: false,
          };

          const isWeekend = SAUDI_WEEKEND.includes(day.id);

          return (
            <div
              key={day.id}
              className={`p-4 border rounded-lg ${
                isWeekend ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <label className="font-medium text-slate-700 w-24">{day.name}</label>
                {isWeekend && <span className="text-xs text-slate-500">(Weekend)</span>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-600">Open</label>
                  <input
                    type="time"
                    value={dayHours.timeStart}
                    onChange={(e) =>
                      updateHour(day.id, "timeStart", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Close</label>
                  <input
                    type="time"
                    value={dayHours.timeEnd}
                    onChange={(e) => updateHour(day.id, "timeEnd", e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={dayHours.crossesMidnight}
                      onChange={(e) =>
                        updateHour(day.id, "crossesMidnight", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <span>Midnight</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={saveHours}
        disabled={saving}
        className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : "Save Opening Hours"}
      </button>
    </div>
  );
}

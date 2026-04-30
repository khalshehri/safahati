"use client";

import { useEffect, useState } from "react";
import { DAYS_OF_WEEK, isOpenNow, formatTime, type OpeningHoursConfig } from "@/lib/opening-hours";
import { Clock } from "lucide-react";

interface OpeningHoursProps {
  hours: OpeningHoursConfig[];
  siteTimezone?: string;
  config?: {
    title?: string;
    titleAr?: string;
    showOpenNow?: boolean;
  };
}

export default function OpeningHours({
  hours,
  siteTimezone = "Asia/Riyadh",
  config = {},
}: OpeningHoursProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const defaultConfig = {
    title: "Opening Hours",
    titleAr: "ساعات العمل",
    showOpenNow: true,
    ...config,
  };

  useEffect(() => {
    setMounted(true);
    const { isOpen: open } = isOpenNow(hours, siteTimezone);
    setIsOpen(open);

    // Update every minute
    const interval = setInterval(() => {
      const { isOpen: open } = isOpenNow(hours, siteTimezone);
      setIsOpen(open);
    }, 60000);

    return () => clearInterval(interval);
  }, [hours, siteTimezone]);

  if (!mounted || !hours.length) return null;

  // Group hours by day
  const hoursByDay: Record<number, OpeningHoursConfig[]> = {};
  hours.forEach((h) => {
    if (!hoursByDay[h.dayOfWeek]) hoursByDay[h.dayOfWeek] = [];
    hoursByDay[h.dayOfWeek].push(h);
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-slate-700" />
        <h3 className="text-xl font-bold text-slate-900">{defaultConfig.title}</h3>
      </div>

      {defaultConfig.showOpenNow && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            isOpen
              ? "bg-green-50 border border-green-200"
              : "bg-slate-50 border border-slate-200"
          }`}
        >
          <p className={`font-semibold ${isOpen ? "text-green-700" : "text-slate-700"}`}>
            {isOpen ? "🟢 Open Now" : "🔴 Closed"}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {DAYS_OF_WEEK.map((day) => {
          const dayHours = hoursByDay[day.id];
          const timeString = dayHours
            ? dayHours.map((h) => `${formatTime(h.timeStart)} - ${formatTime(h.timeEnd)}`).join(", ")
            : "Closed";

          return (
            <div key={day.id} className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">{day.name}</span>
              <span className={`text-sm ${dayHours ? "text-slate-600" : "text-red-600"}`}>
                {timeString}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

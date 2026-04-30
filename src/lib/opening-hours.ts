import { z } from "zod";

export const DAYS_OF_WEEK = [
  { id: 0, name: "Sunday", nameAr: "الأحد" },
  { id: 1, name: "Monday", nameAr: "الاثنين" },
  { id: 2, name: "Tuesday", nameAr: "الثلاثاء" },
  { id: 3, name: "Wednesday", nameAr: "الأربعاء" },
  { id: 4, name: "Thursday", nameAr: "الخميس" },
  { id: 5, name: "Friday", nameAr: "الجمعة" },
  { id: 6, name: "Saturday", nameAr: "السبت" },
];

export const SAUDI_WEEKEND = [5, 6]; // Friday, Saturday

export interface OpeningHoursConfig {
  dayOfWeek: number;
  timeStart: string; // "HH:MM"
  timeEnd: string; // "HH:MM"
  crossesMidnight: boolean;
}

export const openingHoursValidation = z.object({
  dayOfWeek: z.number().min(0).max(6),
  timeStart: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM format required"),
  timeEnd: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM format required"),
  crossesMidnight: z.boolean().default(false),
});

export function isOpenNow(
  hours: OpeningHoursConfig[],
  timezone: string = "Asia/Riyadh"
): { isOpen: boolean; nextChangeAt?: string } {
  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [hours12, minutes] = timeFormatter.format(now).split(":").map(Number);
  const currentMinutes = hours12 * 60 + minutes;
  const currentDayOfWeek = now.toLocaleString("en-US", {
    timeZone: timezone,
    weekday: "short",
  });

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const todayDayOfWeek = dayMap[currentDayOfWeek];
  const todayHours = hours.find((h) => h.dayOfWeek === todayDayOfWeek);

  if (!todayHours) {
    return { isOpen: false };
  }

  const [startHour, startMinute] = todayHours.timeStart.split(":").map(Number);
  const [endHour, endMinute] = todayHours.timeEnd.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  let isOpen = false;

  if (todayHours.crossesMidnight) {
    // Hours cross midnight (e.g., 22:00 to 06:00)
    isOpen = currentMinutes >= startMinutes || currentMinutes < endMinutes;
  } else {
    // Normal hours
    isOpen = currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  return { isOpen };
}

export function formatTime(timeString: string, is24Hour: boolean = true): string {
  const [hours, minutes] = timeString.split(":").map(Number);

  if (is24Hour) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

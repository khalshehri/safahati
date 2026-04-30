"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Clock } from "lucide-react";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "aged" | "error";

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
  message?: string;
  lastSavedAt?: number;
}

export default function AutoSaveIndicator({
  status,
  message = "Auto-saving...",
  lastSavedAt,
}: AutoSaveIndicatorProps) {
  const [displayStatus, setDisplayStatus] = useState<AutoSaveStatus>("idle");
  const [displayMessage, setDisplayMessage] = useState<string>("");

  useEffect(() => {
    setDisplayStatus(status);

    switch (status) {
      case "saving":
        setDisplayMessage("Saving...");
        break;
      case "saved":
        setDisplayMessage("All changes saved");
        // Auto-hide after 2 seconds
        const timer = setTimeout(() => {
          setDisplayStatus("idle");
        }, 2000);
        return () => clearTimeout(timer);
      case "aged":
        setDisplayMessage("Last saved 30+ seconds ago");
        break;
      case "error":
        setDisplayMessage(message || "Failed to save");
        break;
      default:
        setDisplayMessage("");
    }
  }, [status, message]);

  const statusConfig = {
    idle: {
      bgColor: "bg-transparent",
      textColor: "text-slate-500",
      icon: null,
    },
    saving: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      icon: (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      ),
    },
    saved: {
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      icon: <Check className="w-4 h-4" />,
    },
    aged: {
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      icon: <Clock className="w-4 h-4" />,
    },
    error: {
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      icon: <AlertCircle className="w-4 h-4" />,
    },
  };

  const config = statusConfig[displayStatus];

  if (displayStatus === "idle") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg flex items-center gap-2 ${config.bgColor} ${config.textColor} text-sm font-medium shadow-md`}
      >
        {config.icon}
        <span>{displayMessage}</span>
      </motion.div>
    </AnimatePresence>
  );
}

// Undo toast for showing undo options
interface UndoToastProps {
  show: boolean;
  message?: string;
  onUndo: () => void;
  onDismiss: () => void;
  timeoutDuration?: number;
}

export function UndoToast({
  show,
  message = "Changes made",
  onUndo,
  onDismiss,
  timeoutDuration = 8000,
}: UndoToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onDismiss, timeoutDuration);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss, timeoutDuration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg flex items-center justify-between gap-4 shadow-lg"
        >
          <span className="text-sm font-medium">{message}</span>
          <div className="flex gap-2">
            <button
              onClick={onUndo}
              className="px-3 py-1 bg-white text-slate-900 font-medium rounded hover:bg-slate-100 transition-colors text-xs"
            >
              Undo
            </button>
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

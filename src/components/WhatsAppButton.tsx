"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  position?: "bottom-right" | "bottom-left";
}

export default function WhatsAppButton({
  phone,
  message = "Hi! I'd like to know more about your services.",
  position = "bottom-right",
}: WhatsAppButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formatPhoneForWhatsApp = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (!cleaned.startsWith(966) && !cleaned.startsWith("966")) {
      return cleaned.startsWith("0") ? "966" + cleaned.slice(1) : "966" + cleaned;
    }
    return cleaned;
  };

  const whatsappUrl = `https://wa.me/${formatPhoneForWhatsApp(phone)}?text=${encodeURIComponent(message)}`;

  const positionClass = position === "bottom-left" ? "left-4 bottom-4" : "right-4 bottom-4";

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.4 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`${positionClass} fixed z-50 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors`}
      aria-label="Chat on WhatsApp"
    >
      <motion.div
        className="absolute w-full h-full bg-green-500 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity: 0.3 }}
      />
      <svg className="relative z-10 w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.2-4.82 5.591-4.82 9.328 0 3.934 1.96 7.794 5.408 9.878l.384.214h4.114v.077c1.76.069 3.495-.635 4.733-1.97.904-.99 1.502-2.18 1.502-3.46 0-3.584-2.328-6.671-5.659-7.957-.822-.345-1.668-.52-2.524-.52zm10.573-4.736c-5.582 0-10.676 4.465-11.99 10.75 1.667.029 3.297.873 4.402 2.348.572-.203 1.159-.308 1.759-.308 3.59 0 6.528 2.938 6.528 6.528S15.926 24 12.336 24c-3.59 0-6.528-2.938-6.528-6.528 0-.6.105-1.187.308-1.759-1.475-1.105-2.319-2.735-2.348-4.402C1.465 10.676-2.96 5.582 2.622 5.582c2.36 0 4.577.94 6.26 2.623 1.684-1.683 3.9-2.623 6.26-2.623z" />
      </svg>
    </motion.a>
  );
}

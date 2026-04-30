"use client";

import React from "react";
import { motion } from "framer-motion";

interface StepCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  isRTL: boolean;
}

export default function StepCard({
  children,
  title,
  subtitle,
  isRTL,
}: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-md border border-[#E8DFD5] p-8 md:p-12 space-y-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-[#D4894C] to-[#D4894C] opacity-0 rounded-tl-2xl" />

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2D3436] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-[#8B7D6F]">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* Helper text */}
      <p className="text-sm text-[#A99D93] italic">
        {isRTL
          ? "يمكنك تحرير هذا لاحقاً"
          : "You can edit this later"}
      </p>
    </motion.div>
  );
}

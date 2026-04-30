"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SuccessCelebrationProps {
  isRTL: boolean;
  onAnimationComplete?: () => void;
}

const confettiPieces = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  delay: Math.random() * 0.2,
  duration: 2 + Math.random() * 1,
  x: (Math.random() - 0.5) * 400,
  y: -400 + Math.random() * 400,
  rotation: Math.random() * 720,
}));

export default function SuccessCelebration({
  isRTL,
  onAnimationComplete,
}: SuccessCelebrationProps) {
  useEffect(() => {
    const timer = setTimeout(onAnimationComplete, 3000);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: piece.x,
            y: piece.y,
            opacity: 0,
            rotate: piece.rotation,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
          className="absolute top-1/2 left-1/2 w-2 h-2 pointer-events-none"
          style={{
            backgroundColor:
              ["#D4894C", "#C76A3A", "#7BA386", "#8B7D6F"][
                Math.floor(Math.random() * 4)
              ],
            borderRadius: "50%",
          }}
        />
      ))}

      {/* Center Celebration */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        className="relative z-10 text-center pointer-events-auto"
      >
        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 15,
            delay: 0.3,
          }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(123, 163, 134, 0.7)",
                  "0 0 0 60px rgba(123, 163, 134, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-20 h-20 bg-[#7BA386] rounded-full flex items-center justify-center"
            >
              <Check size={40} strokeWidth={3} color="white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-2"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h2 className="text-4xl font-bold text-[#2D3436]">
            {isRTL ? "مبروك!" : "Congratulations!"}
          </h2>
          <p className="text-lg text-[#8B7D6F]">
            {isRTL
              ? "موقعك جاهز للإنشاء"
              : "Your website is ready to be created"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

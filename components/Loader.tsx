"use client";
import { motion } from "framer-motion";

interface Props {
  size?: number; // diameter of spinner
  color?: string; // optional override
}

export default function Loader({ size = 50, color }: Props) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        className="rounded-full border-4 border-t-[var(--gold)] border-gray-300"
        style={{
          width: size,
          height: size,
          borderTopColor: color || "var(--gold)",
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
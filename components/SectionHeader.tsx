"use client";
import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
  className?: string; // Allows extra classes if needed
}

export default function SectionHeader({ title, subtitle, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center mb-12 px-4 sm:px-6 md:px-0 ${className || ""}`} // responsive padding
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-2 leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[var(--text-secondary)] text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
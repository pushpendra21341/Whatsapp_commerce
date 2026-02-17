"use client";
import { motion } from "framer-motion";
import { ReactElement } from "react";

interface Props {
  type: string;
  value: string;
  icon?: ReactElement; // ✅ use ReactElement instead of JSX.Element
}

export default function ContactCard({ type, value, icon }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="
        bg-[var(--card-bg)] 
        border border-[var(--card-border)] 
        shadow-[var(--shadow)] 
        rounded-xl 
        p-4 sm:p-6 
        flex flex-col sm:flex-row 
        items-start sm:items-center 
        gap-4
        transition
      "
    >
      {icon && (
        <div className="text-[var(--gold)] text-3xl sm:text-2xl flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="text-left">
        <p className="text-[var(--text-muted)] text-sm sm:text-base">{type}</p>
        <p className="text-[var(--text-primary)] font-semibold text-base sm:text-lg">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

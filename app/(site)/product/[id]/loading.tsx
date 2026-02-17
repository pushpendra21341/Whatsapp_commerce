"use client";

import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text-primary)]">
      <Loader size={60} />
      <p className="mt-6 text-lg text-[var(--text-secondary)]">
        Loading product details, please wait...
      </p>
    </div>
  );
}
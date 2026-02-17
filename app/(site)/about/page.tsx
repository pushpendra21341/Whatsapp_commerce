"use client";
import { useState, useEffect } from "react";
import SectionHeader from "@/components/SectionHeader";
import Loader from "@/components/Loader";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);

  // Simulate loading (for future dynamic content)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // 0.5s delay
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader size={60} />;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-[var(--bg)] text-[var(--text-primary)]">
      {/* Section Header */}
      <SectionHeader
        title="About Us"
        subtitle="Learn more about our journey and values"
        className="mb-12 sm:mb-16"
      />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-12 gap-8">
        {/* Text Content */}
        <div className="flex-1 space-y-6">
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
            We are a passionate team dedicated to providing top-quality products
            that combine elegance and functionality. Our mission is to ensure every
            customer enjoys an outstanding experience.
          </p>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
            Founded with a vision of innovation and excellence, we continuously strive
            to improve and expand our offerings, ensuring that style, quality, and
            service go hand in hand.
          </p>
        </div>

        {/* Image */}
        <div className="flex-1 relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-[var(--card-border)]">
          <img
            src="about-us.png"
            alt="About us"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>

      {/* Footer Text */}
      <div className="mt-12 sm:mt-16 text-center px-4 sm:px-0">
        <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          We believe in transparency, commitment, and quality. Thank you for being part of our journey!
        </p>
      </div>
    </section>
  );
}
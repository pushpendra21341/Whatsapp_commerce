"use client";

import SectionHeader from "@/components/SectionHeader";
import ContactCard from "@/components/ContactCard";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ContactPage() {
  // Fetch values from environment
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com";
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+1234567890";
  const address =
    process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "123 Main Street, City, Country";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 bg-[var(--bg)] text-[var(--text-primary)]">
      <SectionHeader
        title="Contact Us"
        subtitle="We would love to hear from you"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-10">
        <ContactCard
          type="Email"
          value={email}
          icon={<FiMail className="text-[var(--gold)] w-6 h-6" />}
        />
        <ContactCard
          type="Phone"
          value={phone}
          icon={<FiPhone className="text-[var(--gold)] w-6 h-6" />}
        />
        <ContactCard
          type="Address"
          value={address}
          icon={<FiMapPin className="text-[var(--gold)] w-6 h-6" />}
        />
      </div>

      <div className="mt-16 text-center text-[var(--text-secondary)] text-sm sm:text-base">
        <p>Follow us on social media for updates and support.</p>
      </div>
    </section>
  );
}
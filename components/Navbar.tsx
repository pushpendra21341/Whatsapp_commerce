"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = ["/", "/products", "/about", "/contact"];
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-[var(--bg)] border-b border-[var(--border)] px-4 sm:px-8 py-4 md:py-5 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-serif tracking-widest text-[var(--gold)]"
        >
          COBRA TRADERS
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-6 items-center text-sm uppercase tracking-wider">
          {links.map((href) => (
            <Link
              key={href}
              href={href}
              className={`hover:text-[var(--gold)] transition ${
                isActive(href) ? "text-[var(--gold)] font-semibold" : ""
              }`}
            >
              {href === "/"
                ? "Home"
                : href
                    .replace("/", "")
                    .replace("-", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-[var(--gold)] border border-[var(--gold)] rounded-full"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[var(--bg)] border-t border-[var(--border)] shadow-lg z-50 flex flex-col items-center py-4 gap-4">
          {links.map((href) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`hover:text-[var(--gold)] ${
                isActive(href) ? "text-[var(--gold)] font-semibold" : ""
              }`}
            >
              {href === "/"
                ? "Home"
                : href
                    .replace("/", "")
                    .replace("-", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--gold)] text-[var(--gold)]"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      )}
    </nav>
  );
}
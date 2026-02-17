"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "@/app/theme-provider";
import SidebarLinks from "./SidebarLinks";
import { HiMenu, HiX } from "react-icons/hi";
import { Sun, Moon, LogOut } from "lucide-react";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative bg-[var(--bg)] text-[var(--text-primary)]">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] flex-col z-30">

        {/* Top */}
        <div className="p-6 border-b border-[var(--card-border)]">
          <h2 className="text-2xl font-bold text-[var(--gold)]">
            Admin Panel
          </h2>
        </div>

        {/* Middle Links */}
        <div className="flex-1 overflow-y-auto p-6">
          <SidebarLinks closeSidebar={() => {}} />
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-[var(--card-border)] space-y-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 border border-[var(--gold)] px-4 py-2 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            Toggle Theme
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="w-full flex items-center justify-center gap-2 border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MOBILE OVERLAY ================= */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] flex flex-col z-50 transform transition-transform duration-300 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-[var(--card-border)] relative">
          <button
            className="absolute top-4 right-4 text-2xl text-[var(--gold)]"
            onClick={() => setIsSidebarOpen(false)}
          >
            <HiX />
          </button>

          <h2 className="text-2xl font-bold text-[var(--gold)]">
            Admin Panel
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <SidebarLinks closeSidebar={() => setIsSidebarOpen(false)} />
        </div>

        {/* Mobile Bottom Actions */}
        <div className="p-6 border-t border-[var(--card-border)] space-y-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 border border-[var(--gold)] px-4 py-2 text-[var(--gold)]"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            Toggle Theme
          </button>

          <button
            onClick={() => {
              signOut({ callbackUrl: "/admin-login" });
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 border border-red-500 px-4 py-2 text-red-500"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="md:ml-64 min-h-screen flex flex-col">

        {/* Mobile Header */}
        <header className="md:hidden flex items-center gap-3 p-4 border-b border-[var(--card-border)] bg-[var(--card-bg)]">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl text-[var(--gold)]"
            aria-label="Open menu"
          >
            <HiMenu />
          </button>

          <span className="font-semibold text-[var(--gold)]">
            Admin Panel
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
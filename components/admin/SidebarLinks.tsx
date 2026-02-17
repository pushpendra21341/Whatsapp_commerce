"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinksProps {
  closeSidebar: () => void; // function to close mobile sidebar
}

export default function SidebarLinks({ closeSidebar }: SidebarLinksProps) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Create Product" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/settings", label: "Update Whatsapp" },
  ];

  return (
    <nav className="flex flex-col space-y-4 text-sm">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeSidebar} // close drawer on mobile
            className={`transition px-2 py-1 rounded ${
              isActive
                ? "bg-[var(--gold)] text-black font-semibold"
                : "hover:text-[var(--gold)]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
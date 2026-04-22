"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/katalog", label: "Catalog" },
  { href: "/transaksi", label: "Transaction" },
  { href: "/cart", label: "Cart" },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center" style={{ gap: "2rem" }}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm transition-colors ${
            pathname.startsWith(link.href)
              ? "text-[#001038] font-semibold underline underline-offset-4"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

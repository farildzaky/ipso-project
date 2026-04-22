"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import ProductIcons from "@/assets/admin/admin_product.svg";
import EcoBite from "@/assets/admin/ecobite_logo.svg";
import Image from "next/image";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#001038] flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <Image src={EcoBite} alt="EcoBite" width={32} height={32} />
        <span className="text-white font-semibold text-lg">EcoBite</span>
      </div>

      <div className="px-4 flex-1">
        <p className="text-white text-xs px-3 mb-2">Menu</p>
        <Link
          href="/admin/produk"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            pathname.startsWith("/admin/produk")
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Image src={ProductIcons} alt="Products" width={16} height={16} />
          Products
        </Link>
      </div>

      <div className="p-6">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 text-[#FB5329] text-sm hover:text-orange-300 transition-colors"
        >
          <span>⇥</span> Log Out
        </button>
        <p className="text-gray-600 text-xs mt-3">v0.0.1</p>
      </div>
    </div>
  );
}

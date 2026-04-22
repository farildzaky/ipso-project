import Link from "next/link";
import Image from "next/image";
import EcoBiteLogo from "@/assets/admin/ecobite_logo.svg";

export default function MainFooter() {
  return (
    <footer className="bg-[#001038] text-white mt-16 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Image src={EcoBiteLogo} alt="EcoBite" width={28} height={28} />
            <span className="font-bold text-lg">EcoBite</span>
          </div>
          <nav className="flex gap-8">
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/katalog"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Catalog
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Catalog Detail
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Customer Support
            </Link>
          </nav>
        </div>
        <div className="border-t border-white/10 pt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            © Ecobite 2026 – All Rights Reserved
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Agreement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

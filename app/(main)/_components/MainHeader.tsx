import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import EcoBiteLogo from "@/assets/admin/ecobite_logo.svg";
import NavLinks from "./NavLinks";

export default async function MainHeader() {
  const session = await auth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/katalog" className="flex items-center gap-2">
          <Image src={EcoBiteLogo} alt="EcoBite" width={28} height={28} />
          <span className="font-bold text-[#001038] text-lg">EcoBite</span>
        </Link>

        <NavLinks />

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <div className="w-8 h-8 rounded-full bg-[#001038] flex items-center justify-center text-white text-xs font-bold">
                {session.user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-[#001038]">
                {session.user.name}
              </span>
            </>
          ) : (
            <Link href="/login" className="text-sm text-[#001038] font-medium">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

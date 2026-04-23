// app/(main)/profil/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./_components/ProfilForm";

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    select: {
      id: true,
      nama: true,
      email: true,
      noTelepon: true,
      alamat: true,
      image: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <p className="text-sm text-gray-400 mb-6">
        Home / <span className="text-gray-800 font-medium">My Profile</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-2 h-fit">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-blue-50 text-[#1a3a5c] font-medium text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 pb-5 border-b border-gray-100 mb-6">
            Profile Details
          </h2>
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
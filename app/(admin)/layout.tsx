import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const session = await auth();
//   if (!session || session.user.role !== "admin") redirect("/katalog");

const name = "Admin"; // Ganti dengan nama pengguna yang sebenarnya dari session    
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader user={{ name }} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

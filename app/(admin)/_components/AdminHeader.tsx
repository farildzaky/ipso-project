import Image from "next/image";
import CalendarIcon from "@/assets/admin/admin_calendar.svg";

type Props = {
  user: { name?: string | null; image?: string | null };
};

export default function AdminHeader({ user }: Props) {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center bg-[#F4F5F7] p-3 gap-2 text-gray-500 text-sm">
        <Image src={CalendarIcon} alt="Calendar" width={16} height={16} />
        <span>{today}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
          {user.name?.charAt(0).toUpperCase() ?? "A"}
        </div>
        <span>{user.name}</span>
        <span className="text-gray-400">▾</span>
      </div>
    </header>
  );
}

import { AdminSidebar } from "@/components/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getFormattedToday } from "@/utils/Date";
import { CalendarIcon } from "lucide-react";
import { Outlet } from "react-router";

export default function AdminLayout() {
  const today = getFormattedToday();
  const { profile } = useUserProfile();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="">
        <header className="sticky top-0 z-30 flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 bg-green-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
              {today}
            </span>
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-white/10 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Profile"}
                  className="w-8 h-8 rounded-full border-2 border-green-400 object-cover"
                />
              )}
              {profile?.full_name && (
                <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm ml-2">
                  Admin {profile.full_name}
                </span>
              )}
            </div>
          </div>
        </header>

        <Outlet />

        {/* <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}

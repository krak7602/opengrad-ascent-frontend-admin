import BottomNavBar from "@/components/admin/BottomNavBar";
import SideNavBar from "@/components/admin/SideNavBar";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <div className="flex h-screen w-full flex-col lg:flex-row">
        <SideNavBar />
        <div className="flex-1">
          <BottomNavBar />
          <main className="p-6">{children}</main>
        </div>
        <Toaster />
      </div>
    </SessionWrapper>
  );
}

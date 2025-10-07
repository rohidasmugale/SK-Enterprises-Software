import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

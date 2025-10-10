import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Users, Shield, Building2, Briefcase } from "lucide-react";
import { dashboardStats } from "@/utils/dummyData";

const AdminDashboard = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const stats = dashboardStats.admin;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Admin Dashboard" 
        subtitle="System administration and management"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Managers"
            value={stats.totalManagers}
            icon={Briefcase}
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Total Supervisors"
            value={stats.totalSupervisors}
            icon={Shield}
            trend={{ value: 8, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            trend={{ value: 15, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="Total Sites"
            value={stats.totalSites}
            icon={Building2}
            trend={{ value: 5, isPositive: true }}
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

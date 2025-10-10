import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Shield, ClipboardList, CheckCircle2, Clock } from "lucide-react";
import { dashboardStats } from "@/utils/dummyData";

const ManagerDashboard = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const stats = dashboardStats.manager;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Manager Dashboard" 
        subtitle="Manage supervisors and team operations"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Supervisors"
            value={stats.totalSupervisors}
            icon={Shield}
            trend={{ value: 10, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={ClipboardList}
            trend={{ value: 5, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={Clock}
            delay={0.2}
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={CheckCircle2}
            trend={{ value: 18, isPositive: true }}
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

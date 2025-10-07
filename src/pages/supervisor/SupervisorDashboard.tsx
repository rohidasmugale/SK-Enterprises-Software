import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Users, ClipboardList, CheckCircle2, FileText } from "lucide-react";
import { dashboardStats } from "@/utils/dummyData";

const SupervisorDashboard = () => {
  const stats = dashboardStats.supervisor;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Supervisor Dashboard" 
        subtitle="Manage employees and daily operations"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Assigned Tasks"
            value={stats.assignedTasks}
            icon={ClipboardList}
            delay={0.1}
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={CheckCircle2}
            trend={{ value: 15, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon={FileText}
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;

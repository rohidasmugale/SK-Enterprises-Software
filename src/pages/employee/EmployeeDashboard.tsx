import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ClipboardList, CheckCircle2, Calendar, Clock } from "lucide-react";
import { dashboardStats } from "@/utils/dummyData";

const EmployeeDashboard = () => {
  const stats = dashboardStats.employee;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Employee Dashboard" 
        subtitle="View your tasks and attendance"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Assigned Tasks"
            value={stats.assignedTasks}
            icon={ClipboardList}
            delay={0}
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={CheckCircle2}
            trend={{ value: 20, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title="Pending Leaves"
            value={stats.pendingLeaves}
            icon={Calendar}
            delay={0.2}
          />
          <StatCard
            title="Upcoming Shifts"
            value={stats.upcomingShifts}
            icon={Clock}
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

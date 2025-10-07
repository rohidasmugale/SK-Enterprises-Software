import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Users, Shield, Building2, Briefcase, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboardStats, recentActivities, leaveRequests } from "@/utils/dummyData";
import { motion } from "framer-motion";

const SuperAdminDashboard = () => {
  const stats = dashboardStats.superadmin;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Super Admin Dashboard" 
        subtitle="Complete system overview and management"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
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

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatCard
              title="Active Tasks"
              value={stats.activeTasks}
              icon={CheckCircle2}
              trend={{ value: 23, isPositive: true }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <StatCard
              title="Pending Leaves"
              value={stats.pendingLeaves}
              icon={AlertCircle}
            />
          </motion.div>
        </div>

        {/* Recent Activities & Leave Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="flex items-start gap-3 pb-3 border-b last:border-0"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-secondary' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-primary'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leave Requests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Pending Leave Requests</CardTitle>
                <Badge variant="secondary">{leaveRequests.filter(l => l.status === 'pending').length} Pending</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.filter(l => l.status === 'pending').map((leave, index) => (
                    <motion.div
                      key={leave.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{leave.employee}</p>
                          <p className="text-sm text-muted-foreground">{leave.type}</p>
                        </div>
                        <Badge variant="outline">{leave.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>From: {leave.from} - To: {leave.to}</p>
                        <p className="mt-1">Reason: {leave.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Approve</Button>
                        <Button size="sm" variant="destructive" className="flex-1">Reject</Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Add User</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Create Supervisor</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Briefcase className="h-5 w-5" />
                  <span className="text-sm">Add Manager</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm">New Site</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

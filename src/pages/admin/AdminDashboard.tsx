import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Building2, 
  Briefcase, 
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  FileText,
  BarChart3,
  Send,
  Filter
} from "lucide-react";
import { dashboardStats } from "@/utils/dummyData";
import { useState } from "react";

// Types
interface AttendanceRecord {
  id: string;
  name: string;
  position: string;
  timeIn: string;
  timeOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  date: string;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'attendance' | 'system' | 'user' | 'approval';
}

const AdminDashboard = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const stats = dashboardStats.admin;
  
  const [activeTab, setActiveTab] = useState<'managers' | 'supervisors' | 'employees'>('managers');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Mock attendance data
  const [attendanceData, setAttendanceData] = useState<{
    managers: AttendanceRecord[];
    supervisors: AttendanceRecord[];
    employees: AttendanceRecord[];
  }>({
    managers: [
      {
        id: '1',
        name: 'John Smith',
        position: 'Operations Manager',
        timeIn: '09:00 AM',
        timeOut: '06:00 PM',
        status: 'present',
        date: '2024-01-20'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        position: 'HR Manager',
        timeIn: '09:15 AM',
        timeOut: '05:45 PM',
        status: 'late',
        date: '2024-01-20'
      },
      {
        id: '3',
        name: 'Mike Chen',
        position: 'IT Manager',
        timeIn: '08:45 AM',
        timeOut: '06:30 PM',
        status: 'present',
        date: '2024-01-20'
      }
    ],
    supervisors: [
      {
        id: '1',
        name: 'Emily Davis',
        position: 'Site Supervisor',
        timeIn: '08:00 AM',
        timeOut: '05:00 PM',
        status: 'present',
        date: '2024-01-20'
      },
      {
        id: '2',
        name: 'Robert Brown',
        position: 'Team Lead',
        timeIn: '--',
        timeOut: '--',
        status: 'absent',
        date: '2024-01-20'
      },
      {
        id: '3',
        name: 'Lisa Wang',
        position: 'Shift Supervisor',
        timeIn: '08:30 AM',
        timeOut: '04:30 PM',
        status: 'half-day',
        date: '2024-01-20'
      }
    ],
    employees: [
      {
        id: '1',
        name: 'Alex Thompson',
        position: 'Field Worker',
        timeIn: '07:00 AM',
        timeOut: '03:00 PM',
        status: 'present',
        date: '2024-01-20'
      },
      {
        id: '2',
        name: 'Maria Garcia',
        position: 'Technician',
        timeIn: '--',
        timeOut: '--',
        status: 'absent',
        date: '2024-01-20'
      },
      {
        id: '3',
        name: 'David Kim',
        position: 'Operator',
        timeIn: '07:15 AM',
        timeOut: '03:15 PM',
        status: 'present',
        date: '2024-01-20'
      }
    ]
  });

  // Recent activities data
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      user: 'John Smith',
      action: 'Checked in at Site A',
      timestamp: '10 minutes ago',
      type: 'attendance'
    },
    {
      id: '2',
      user: 'System',
      action: 'Daily backup completed',
      timestamp: '30 minutes ago',
      type: 'system'
    },
    {
      id: '3',
      user: 'Sarah Johnson',
      action: 'Updated employee records',
      timestamp: '1 hour ago',
      type: 'user'
    },
    {
      id: '4',
      user: 'Mike Chen',
      action: 'Approved leave request',
      timestamp: '2 hours ago',
      type: 'approval'
    },
    {
      id: '5',
      user: 'Emily Davis',
      action: 'Submitted site report',
      timestamp: '3 hours ago',
      type: 'user'
    }
  ]);

  // Quick action handlers
  const handleDownloadReport = () => {
    console.log('Downloading attendance report...');
    // Implement download logic
    alert('Attendance report download started!');
  };

  const handleSyncAttendance = () => {
    console.log('Syncing attendance data...');
    // Implement sync logic
    alert('Attendance data synced successfully!');
  };

  const handleSendReminders = () => {
    console.log('Sending attendance reminders...');
    // Implement reminder logic
    alert('Attendance reminders sent to all staff!');
  };

  const handleApproveAll = () => {
    console.log('Approving all pending attendance...');
    // Implement approval logic
    alert('All pending attendance approved!');
  };

  const handleMarkAttendance = (id: string, type: 'managers' | 'supervisors' | 'employees') => {
    console.log(`Marking attendance for ${id} in ${type}`);
    // Implement mark attendance logic
    alert(`Attendance marked for ${type.slice(0, -1)}!`);
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const statusConfig = {
      present: { variant: 'default' as const, label: 'Present', icon: CheckCircle2 },
      absent: { variant: 'destructive' as const, label: 'Absent', icon: XCircle },
      late: { variant: 'secondary' as const, label: 'Late', icon: Clock },
      'half-day': { variant: 'outline' as const, label: 'Half Day', icon: AlertCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'attendance':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      case 'user':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'approval':
        return <CheckCircle2 className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Admin Dashboard" 
        subtitle="System administration and management"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        {/* Quick Actions Bar */}
        <div className="bg-card rounded-lg border p-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleDownloadReport}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            
            <Button 
              onClick={handleSyncAttendance}
              className="flex items-center gap-2"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Data
            </Button>
            
            <Button 
              onClick={handleSendReminders}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Send className="h-4 w-4" />
              Send Reminders
            </Button>
            
            <Button 
              onClick={handleApproveAll}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve All
            </Button>

            <Button 
              onClick={() => console.log('Generate Payroll')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <FileText className="h-4 w-4" />
              Generate Payroll
            </Button>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Section */}
          <div className="lg:col-span-2 bg-card rounded-lg border">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Attendance
                </h2>
                
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Attendance Tabs */}
              <div className="flex border-b mb-4">
                {(['managers', 'supervisors', 'employees'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab} ({attendanceData[tab].length})
                  </button>
                ))}
              </div>

              {/* Attendance List */}
              <div className="space-y-3">
                {attendanceData[activeTab].map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{record.name}</h4>
                          {getStatusBadge(record.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{record.position}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            In: {record.timeIn}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Out: {record.timeOut}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAttendance(record.id, activeTab)}
                    >
                      Mark
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {activity.user}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Today's Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Present: </span>
                    <span className="font-medium">42</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Absent: </span>
                    <span className="font-medium">8</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Late: </span>
                    <span className="font-medium">5</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pending: </span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
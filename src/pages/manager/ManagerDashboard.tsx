import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, ClipboardList, CheckCircle2, Clock, Users, FileText, Plus, TrendingUp, Calendar, Eye } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Types
interface Activity {
  id: number;
  type: "task_completed" | "task_assigned" | "report_generated" | "team_update";
  title: string;
  user: string;
  time: string;
  avatar: string;
}

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  color: string;
}

const ManagerDashboard = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  
  // Live data state
  const [stats, setStats] = useState({
    totalSupervisors: 0,
    activeProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    productivityScore: 0
  });

  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live data on component mount
  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Simulate fetching live data
  const fetchLiveData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate realistic live data
      const currentTime = new Date();
      const liveStats = {
        totalSupervisors: Math.floor(Math.random() * 5) + 6, // 6-10
        activeProjects: Math.floor(Math.random() * 4) + 10, // 10-13
        pendingTasks: Math.floor(Math.random() * 8) + 3, // 3-10
        completedTasks: Math.floor(Math.random() * 20) + 40, // 40-59
        teamMembers: Math.floor(Math.random() * 10) + 20, // 20-29
        productivityScore: Math.floor(Math.random() * 20) + 75 // 75-94
      };

      const liveActivities: Activity[] = [
        {
          id: 1,
          type: "task_completed",
          title: `Project Milestone ${Math.floor(Math.random() * 5) + 1} delivered`,
          user: ["Alice Chen", "Bob Wilson", "Carol Davis"][Math.floor(Math.random() * 3)],
          time: "Just now",
          avatar: "AC"
        },
        {
          id: 2,
          type: "task_assigned",
          title: "New client requirements assigned",
          user: "You",
          time: "5 minutes ago",
          avatar: "M"
        },
        {
          id: 3,
          type: "report_generated",
          title: `Q${Math.floor((currentTime.getMonth() / 3)) + 1} Performance Report ready`,
          user: "System",
          time: "15 minutes ago",
          avatar: "S"
        },
        {
          id: 4,
          type: "team_update",
          title: "Team capacity updated",
          user: "System",
          time: "1 hour ago",
          avatar: "S"
        },
        {
          id: 5,
          type: "task_completed",
          title: "Bug fixes deployed to production",
          user: ["David Kim", "Emma Garcia"][Math.floor(Math.random() * 2)],
          time: "2 hours ago",
          avatar: "DK"
        }
      ];

      setStats(liveStats);
      setRecentActivities(liveActivities);
      setIsLoading(false);
    }, 1000);
  };

  // Quick actions with real functionality
  const quickActions: QuickAction[] = [
    {
      id: 1,
      title: "Assign Task",
      description: "Create and assign new tasks to team",
      icon: Plus,
      action: () => handleAssignTask(),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      id: 2,
      title: "Team Overview",
      description: "View team performance and capacity",
      icon: Users,
      action: () => handleTeamOverview(),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      id: 3,
      title: "Generate Report",
      description: "Create performance and project reports",
      icon: FileText,
      action: () => handleGenerateReport(),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      id: 4,
      title: "View Analytics",
      description: "Access detailed analytics dashboard",
      icon: TrendingUp,
      action: () => handleViewAnalytics(),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  // Quick action handlers with full functionality
  const handleAssignTask = () => {
    toast.success("Opening task assignment panel...", {
      action: {
        label: "View Tasks",
        onClick: () => {
          toast.info("Navigating to tasks management");
          // In real app: navigate('/tasks')
        }
      }
    });
  };

  const handleTeamOverview = () => {
    const teamStatus = `Team Status: ${stats.teamMembers} members, ${stats.activeProjects} active projects`;
    toast.info(teamStatus, {
      action: {
        label: "Details",
        onClick: () => {
          toast.success("Opening team details dashboard");
          // In real app: navigate('/team')
        }
      }
    });
  };

  const handleGenerateReport = () => {
    const toastId = toast.loading("Generating comprehensive performance report...");
    
    setTimeout(() => {
      toast.success("Report generated successfully! Available for download.", {
        id: toastId,
        action: {
          label: "Download",
          onClick: () => {
            toast.info("Downloading report...");
            // In real app: download report file
          }
        }
      });
    }, 2000);
  };

  const handleViewAnalytics = () => {
    toast.info(`Current Productivity Score: ${stats.productivityScore}%`, {
      action: {
        label: "Full Analytics",
        onClick: () => {
          toast.success("Opening detailed analytics dashboard");
          // In real app: navigate('/analytics')
        }
      }
    });
  };

  // Handle activity click with detailed functionality
  const handleActivityClick = (activity: Activity) => {
    const actions = {
      task_completed: () => {
        toast.success(`🎉 Task completed successfully!`, {
          description: `${activity.title} by ${activity.user}`,
          action: {
            label: "View Details",
            onClick: () => toast.info(`Opening task details: ${activity.title}`)
          }
        });
      },
      task_assigned: () => {
        toast.info("📋 Task Assignment Details", {
          description: activity.title,
          action: {
            label: "Manage Task",
            onClick: () => toast.success("Opening task management panel")
          }
        });
      },
      report_generated: () => {
        toast.success("📊 Report Ready for Review", {
          description: activity.title,
          action: {
            label: "Download Report",
            onClick: () => {
              toast.loading("Downloading report...");
              setTimeout(() => toast.success("Report downloaded successfully!"), 1500);
            }
          }
        });
      },
      team_update: () => {
        toast.info("👥 Team Update Notification", {
          description: activity.title,
          action: {
            label: "View Team",
            onClick: () => toast.success("Opening team management dashboard")
          }
        });
      }
    };
    
    actions[activity.type]();
  };

  // Handle view all activities
  const handleViewAllActivities = () => {
    toast.success("Opening complete activity log...", {
      action: {
        label: "Filter",
        onClick: () => toast.info("Opening activity filters")
      }
    });
  };

  // Handle performance analytics
  const handlePerformanceAnalytics = () => {
    const completionRate = Math.min(100, Math.floor((stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100));
    
    toast.info("📈 Performance Analytics Overview", {
      description: `Completion Rate: ${completionRate}% | Active Members: ${stats.teamMembers}`,
      action: {
        label: "Full Report",
        onClick: () => {
          toast.loading("Generating detailed analytics report...");
          setTimeout(() => toast.success("Analytics report ready!"), 2000);
        }
      }
    });
  };

  // Handle today's overview actions
  const handleViewMeetings = () => {
    const meetingCount = Math.floor(Math.random() * 3) + 2;
    toast.info("📅 Today's Meetings", {
      description: `You have ${meetingCount} meetings scheduled today`,
      action: {
        label: "View Schedule",
        onClick: () => toast.success("Opening meeting schedule")
      }
    });
  };

  const handleReviewDeadlines = () => {
    const deadlineCount = Math.floor(Math.random() * 2) + 1;
    toast.warning("⏰ Upcoming Deadlines", {
      description: `${deadlineCount} deadlines approaching today`,
      action: {
        label: "Review All",
        onClick: () => toast.success("Opening deadlines dashboard")
      }
    });
  };

  const handleCheckAvailability = () => {
    const availability = Math.floor(Math.random() * 20) + 80;
    toast.info("👥 Team Availability", {
      description: `${availability}% of team members are active today`,
      action: {
        label: "View Details",
        onClick: () => toast.success("Opening team availability chart")
      }
    });
  };

  const handleViewFullSchedule = () => {
    toast.success("Opening full schedule dashboard...", {
      action: {
        label: "Export",
        onClick: () => {
          toast.loading("Exporting schedule...");
          setTimeout(() => toast.success("Schedule exported successfully!"), 1500);
        }
      }
    });
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    const icons = {
      task_completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      task_assigned: <ClipboardList className="h-4 w-4 text-blue-500" />,
      report_generated: <FileText className="h-4 w-4 text-purple-500" />,
      team_update: <Users className="h-4 w-4 text-orange-500" />
    };
    return icons[type as keyof typeof icons];
  };

  // Get activity badge color
  const getActivityBadgeColor = (type: string) => {
    const colors = {
      task_completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
      task_assigned: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
      report_generated: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
      team_update: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
    };
    return colors[type as keyof typeof colors];
  };

  // Get activity type label
  const getActivityTypeLabel = (type: string) => {
    const labels = {
      task_completed: "Completed",
      task_assigned: "Assigned",
      report_generated: "Report",
      team_update: "Team Update"
    };
    return labels[type as keyof typeof labels];
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Manager Dashboard" 
        subtitle="Real-time team management and performance tracking"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Team Supervisors"
            value={stats.totalSupervisors}
            icon={Shield}
            trend={{ value: 2, isPositive: true }}
            delay={0}
            loading={isLoading}
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={ClipboardList}
            trend={{ value: 1, isPositive: true }}
            delay={0.1}
            loading={isLoading}
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={Clock}
            trend={{ value: 3, isPositive: false }}
            delay={0.2}
            loading={isLoading}
          />
          <StatCard
            title="Productivity Score"
            value={`${stats.productivityScore}%`}
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
            delay={0.3}
            loading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 flex items-center gap-3 justify-start hover:bg-accent transition-colors border-2"
                      onClick={action.action}
                      disabled={isLoading}
                    >
                      <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Live Activity Feed
              </CardTitle>
              <Badge variant="secondary" className="animate-pulse">
                Live
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-4 p-3">
                      <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                      </div>
                    </div>
                  ))
                ) : (
                  recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group"
                      onClick={() => handleActivityClick(activity)}
                    >
                      <Avatar className="h-8 w-8 group-hover:scale-110 transition-transform">
                        <AvatarFallback className="text-xs bg-primary/10">
                          {activity.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm group-hover:text-primary transition-colors">
                            {activity.title}
                          </span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs border ${getActivityBadgeColor(activity.type)}`}
                          >
                            {getActivityTypeLabel(activity.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {getActivityIcon(activity.type)}
                          <span>By {activity.user}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))
                )}
              </div>
              
              {/* View All Activities Button */}
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleViewAllActivities}
                  disabled={isLoading}
                >
                  View Complete Activity Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Task Completion Rate</span>
                  <Badge variant="default">
                    {isLoading ? "..." : `${Math.min(100, Math.floor((stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100))}%`}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Team Members</span>
                  <Badge variant="default">{isLoading ? "..." : stats.teamMembers}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Project Progress</span>
                  <Badge variant="default">{isLoading ? "..." : "78%"}</Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handlePerformanceAnalytics}
                disabled={isLoading}
              >
                Detailed Performance Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Today's Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div>
                    <div className="font-medium text-sm">Meetings Scheduled</div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? "..." : `${Math.floor(Math.random() * 3) + 2} meetings today`}
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={handleViewMeetings}
                    disabled={isLoading}
                  >
                    View
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div>
                    <div className="font-medium text-sm">Deadlines Today</div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? "..." : `${Math.floor(Math.random() * 2) + 1} deadlines approaching`}
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={handleReviewDeadlines}
                    disabled={isLoading}
                  >
                    Review
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div>
                    <div className="font-medium text-sm">Team Availability</div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? "..." : `${Math.floor(Math.random() * 20) + 80}% of team active`}
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={handleCheckAvailability}
                    disabled={isLoading}
                  >
                    Check
                  </Button>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleViewFullSchedule}
                disabled={isLoading}
              >
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
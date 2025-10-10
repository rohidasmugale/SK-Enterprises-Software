import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut,
  Building2,
  ClipboardList,
  UserCog,
  Shield,
  Briefcase,
  BarChart3,
  DollarSign,
  Bell
} from "lucide-react";
import { useRole, UserRole } from "@/context/RoleContext";
import { motion } from "framer-motion";

const getSidebarItems = (role: UserRole) => {
  const baseItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  ];

  switch (role) {
    case "superadmin":
      return [
        ...baseItems,
        { name: "Users & Roles", icon: UserCog, path: "users" },
        { name: "HRMS", icon: Users, path: "hrms" },
        { name: "CRM", icon: Building2, path: "crm" },
        { name: "ERP", icon: ClipboardList, path: "erp" },
        { name: "Billing & Finance", icon: DollarSign, path: "billing" },
        { name: "Operations", icon: ClipboardList, path: "operations" },
        { name: "Reports", icon: BarChart3, path: "reports" },
        { name: "Documents", icon: FileText, path: "documents" },
        { name: "Notifications", icon: Bell, path: "notifications" },
        { name: "Settings", icon: Settings, path: "settings" },
      ];

    case "admin":
      return [
        ...baseItems,
        { name: "Profile", icon: UserCog, path: "profile" },
        { name: "Team", icon: Users, path: "team" },
        { name: "Tasks", icon: ClipboardList, path: "tasks" },
        { name: "Reports", icon: BarChart3, path: "reports" },
        { name: "Leave", icon: Calendar, path: "leave" },
        { name: "Notifications", icon: Bell, path: "notifications" },
        { name: "Settings", icon: Settings, path: "settings" },
      ];

    case "manager":
      return [
        ...baseItems,
        { name: "Profile", icon: UserCog, path: "profile" },
        { name: "Supervisors", icon: Shield, path: "supervisors" },
        { name: "Team & Tasks", icon: ClipboardList, path: "tasks" },
        { name: "Reports", icon: BarChart3, path: "reports" },
        { name: "Leave", icon: Calendar, path: "leave" },
        { name: "Notifications", icon: Bell, path: "notifications" },
        { name: "Settings", icon: Settings, path: "settings" },
      ];

    case "supervisor":
      return [
        ...baseItems,
        { name: "Profile", icon: UserCog, path: "profile" },
        { name: "My Tasks", icon: ClipboardList, path: "tasks" },
        { name: "Employees", icon: Users, path: "employees" },
        { name: "Attendance", icon: Calendar, path: "attendance" },
        { name: "Leave", icon: Calendar, path: "leave" },
        { name: "Reports", icon: FileText, path: "reports" },
        { name: "Notifications", icon: Bell, path: "notifications" },
        { name: "Settings", icon: Settings, path: "settings" },
      ];

    case "employee":
      return [
        ...baseItems,
        { name: "My Tasks", icon: ClipboardList, path: "tasks" },
        { name: "Attendance", icon: Calendar, path: "attendance" },
        { name: "Documents", icon: FileText, path: "documents" },
        { name: "Salary Slip", icon: DollarSign, path: "salary" },
        { name: "Apply Leave", icon: Calendar, path: "leave" },
        { name: "Notifications", icon: Bell, path: "notifications" },
      ];

    default:
      return baseItems;
  }
};

interface DashboardSidebarProps {
  collapsed?: boolean;
}

export const DashboardSidebar = ({ collapsed = false }: DashboardSidebarProps) => {
  const { role, user, logout } = useRole();
  const sidebarItems = getSidebarItems(role);
  const basePath = `/${role}`;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg">SK PROJECT</h2>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={`${basePath}/${item.path}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50"
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {!collapsed && user && (
          <div className="px-3 py-2 text-sm">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </motion.div>
  );
};

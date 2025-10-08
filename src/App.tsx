import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "@/context/RoleContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Layouts
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import SupervisorLayout from "./layouts/SupervisorLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";

// Dashboards
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

// Super Admin Pages
import UsersRoles from "./pages/superadmin/UsersRoles";
import Managers from "./pages/superadmin/Managers";
import Supervisors from "./pages/superadmin/Supervisors";
import Employees from "./pages/superadmin/Employees";
import Documents from "./pages/superadmin/Documents";
import Operations from "./pages/superadmin/Operations";
import Notifications from "./pages/superadmin/Notifications";
import HRMS from "./pages/superadmin/HRMS";
import CRM from "./pages/superadmin/CRM";
import ERP from "./pages/superadmin/ERP";
import Billing from "./pages/superadmin/Billing";
import Reports from "./pages/superadmin/Reports";
import Settings from "./pages/superadmin/Settings";

// Supervisor Pages
import Tasks from "./pages/supervisor/Tasks";
import SupervisorEmployees from "./pages/supervisor/SupervisorEmployees";
import Attendance from "./pages/supervisor/Attendance";

// Employee Pages
import EmployeeTasks from "./pages/employee/EmployeeTasks";
import EmployeeDocuments from "./pages/employee/EmployeeDocuments";
import SalarySlip from "./pages/employee/SalarySlip";
import ApplyLeave from "./pages/employee/ApplyLeave";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Super Admin Routes */}
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="users" element={<UsersRoles />} />
              <Route path="managers" element={<Managers />} />
              <Route path="supervisors" element={<Supervisors />} />
              <Route path="employees" element={<Employees />} />
              <Route path="hrms" element={<HRMS />} />
              <Route path="documents" element={<Documents />} />
              <Route path="operations" element={<Operations />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="crm" element={<CRM />} />
              <Route path="erp" element={<ERP />} />
              <Route path="billing" element={<Billing />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users & Roles</h1></div>} />
              <Route path="managers" element={<div className="p-6"><h1 className="text-2xl font-bold">Managers</h1></div>} />
              <Route path="supervisors" element={<div className="p-6"><h1 className="text-2xl font-bold">Supervisors</h1></div>} />
              <Route path="employees" element={<div className="p-6"><h1 className="text-2xl font-bold">Employees</h1></div>} />
              <Route path="hrms" element={<div className="p-6"><h1 className="text-2xl font-bold">HRMS</h1></div>} />
              <Route path="crm" element={<div className="p-6"><h1 className="text-2xl font-bold">CRM</h1></div>} />
              <Route path="erp" element={<div className="p-6"><h1 className="text-2xl font-bold">ERP</h1></div>} />
              <Route path="billing" element={<div className="p-6"><h1 className="text-2xl font-bold">Billing & Finance</h1></div>} />
              <Route path="operations" element={<div className="p-6"><h1 className="text-2xl font-bold">Operations</h1></div>} />
              <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1></div>} />
              <Route path="documents" element={<div className="p-6"><h1 className="text-2xl font-bold">Documents</h1></div>} />
              <Route path="notifications" element={<div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>} />
            </Route>

            {/* Manager Routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <ManagerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="supervisors" element={<div className="p-6"><h1 className="text-2xl font-bold">Supervisors</h1></div>} />
              <Route path="tasks" element={<div className="p-6"><h1 className="text-2xl font-bold">Team & Tasks</h1></div>} />
              <Route path="hrms" element={<div className="p-6"><h1 className="text-2xl font-bold">HRMS</h1></div>} />
              <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1></div>} />
              <Route path="performance" element={<div className="p-6"><h1 className="text-2xl font-bold">Performance</h1></div>} />
              <Route path="notifications" element={<div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>} />
            </Route>

            {/* Supervisor Routes */}
            <Route
              path="/supervisor"
              element={
                <ProtectedRoute allowedRoles={["supervisor"]}>
                  <SupervisorLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<SupervisorDashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="employees" element={<SupervisorEmployees />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="leave" element={<div className="p-6"><h1 className="text-2xl font-bold">Leave Requests</h1></div>} />
              <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Upload Reports</h1></div>} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>} />
            </Route>

            {/* Employee Routes */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <EmployeeLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="tasks" element={<EmployeeTasks />} />
              <Route path="documents" element={<EmployeeDocuments />} />
              <Route path="salary" element={<SalarySlip />} />
              <Route path="leave" element={<ApplyLeave />} />
              <Route path="attendance" element={<div className="p-6"><h1 className="text-2xl font-bold">Attendance</h1></div>} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;

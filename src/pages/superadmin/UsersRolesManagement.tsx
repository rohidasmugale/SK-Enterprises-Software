import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManagersList } from "@/components/SuperAdmin/UsersAndRoles/ManagersList";
import { SupervisorsList } from "@/components/SuperAdmin/UsersAndRoles/SupervisorsList";
import { EmployeesList } from "@/components/SuperAdmin/UsersAndRoles/EmployeesList";
import { motion } from "framer-motion";

const UsersRolesManagement = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Users & Roles Management" subtitle="Manage all system users and their roles" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <Tabs defaultValue="managers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="managers">Managers</TabsTrigger>
            <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </TabsList>
          
          <TabsContent value="managers">
            <ManagersList />
          </TabsContent>
          
          <TabsContent value="supervisors">
            <SupervisorsList />
          </TabsContent>
          
          <TabsContent value="employees">
            <EmployeesList />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default UsersRolesManagement;

import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Users, Shield, Building2, Briefcase, AlertCircle, CheckCircle2, X, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

// Indian names dummy data
const indianNames = {
  male: ["Rajesh Kumar", "Amit Sharma", "Sanjay Patel", "Vikram Singh", "Arun Reddy", "Mohan Das", "Suresh Iyer", "Prakash Joshi", "Deepak Mehta", "Kiran Nair"],
  female: ["Priya Sharma", "Anjali Singh", "Sunita Reddy", "Kavita Patel", "Meera Iyer", "Laxmi Kumar", "Sonia Das", "Neha Joshi", "Pooja Mehta", "Ritu Nair"],
  sites: ["Mumbai Office", "Delhi Branch", "Bangalore Tech Park", "Chennai Center", "Hyderabad Campus", "Kolkata Unit", "Pune Facility", "Ahmedabad Complex"],
  departments: ["IT", "HR", "Finance", "Operations", "Marketing", "Sales", "Production", "Quality Control"]
};

// Extended dummy data with Indian names
const extendedDummyData = {
  dashboardStats: {
    superadmin: {
      totalManagers: 8,
      totalSupervisors: 15,
      totalEmployees: 125,
      totalSites: 6,
      activeTasks: 47,
      pendingLeaves: 12
    }
  },
  recentActivities: [
    { id: '1', user: 'Rajesh Kumar', action: 'Created new site - Bangalore Tech Park', time: '2 mins ago', type: 'success' },
    { id: '2', user: 'Priya Sharma', action: 'Approved leave request for Amit Sharma', time: '15 mins ago', type: 'success' },
    { id: '3', user: 'Sanjay Patel', action: 'Added new manager - Vikram Singh', time: '1 hour ago', type: 'success' },
    { id: '4', user: 'System', action: 'Security alert detected', time: '2 hours ago', type: 'warning' },
    { id: '5', user: 'Anjali Singh', action: 'Updated employee records', time: '3 hours ago', type: 'success' }
  ],
  leaveRequests: [
    { id: '1', employee: 'Rahul Verma', type: 'Sick Leave', from: '2024-01-15', to: '2024-01-17', reason: 'Fever and cold', status: 'pending' },
    { id: '2', employee: 'Sunita Reddy', type: 'Personal Leave', from: '2024-01-18', to: '2024-01-19', reason: 'Family function', status: 'pending' },
    { id: '3', employee: 'Kiran Nair', type: 'Emergency Leave', from: '2024-01-16', to: '2024-01-16', reason: 'Medical emergency', status: 'pending' },
    { id: '4', employee: 'Mohan Das', type: 'Vacation', from: '2024-01-20', to: '2024-01-25', reason: 'Family vacation', status: 'approved' },
    { id: '5', employee: 'Sonia Das', type: 'Sick Leave', from: '2024-01-14', to: '2024-01-15', reason: 'Doctor appointment', status: 'rejected' }
  ]
};

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(extendedDummyData.dashboardStats.superadmin);
  const [activities, setActivities] = useState(extendedDummyData.recentActivities);
  const [leaves, setLeaves] = useState(extendedDummyData.leaveRequests);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'employee',
    department: '',
    site: '',
    phone: ''
  });

  const [supervisorForm, setSupervisorForm] = useState({
    name: '',
    email: '',
    department: '',
    site: '',
    phone: '',
    experience: ''
  });

  const [managerForm, setManagerForm] = useState({
    name: '',
    email: '',
    department: '',
    sites: [] as string[],
    phone: '',
    experience: ''
  });

  const [siteForm, setSiteForm] = useState({
    name: '',
    address: '',
    manager: '',
    status: 'active' as 'active' | 'inactive',
    capacity: ''
  });

  // Lists data
  const [users, setUsers] = useState([
    { id: '1', name: 'Rajesh Kumar', email: 'rajesh.kumar@company.com', role: 'manager', department: 'IT', site: 'Mumbai Office', phone: '9876543210' },
    { id: '2', name: 'Priya Sharma', email: 'priya.sharma@company.com', role: 'supervisor', department: 'HR', site: 'Delhi Branch', phone: '9876543211' },
    { id: '3', name: 'Amit Sharma', email: 'amit.sharma@company.com', role: 'employee', department: 'Finance', site: 'Bangalore Tech Park', phone: '9876543212' },
    { id: '4', name: 'Sanjay Patel', email: 'sanjay.patel@company.com', role: 'manager', department: 'Operations', site: 'Chennai Center', phone: '9876543213' },
    { id: '5', name: 'Anjali Singh', email: 'anjali.singh@company.com', role: 'supervisor', department: 'Marketing', site: 'Hyderabad Campus', phone: '9876543214' }
  ]);

  const [sites, setSites] = useState([
    { id: '1', name: 'Mumbai Office', address: '123 Marine Drive, Mumbai', manager: 'Rajesh Kumar', status: 'active', capacity: '150' },
    { id: '2', name: 'Delhi Branch', address: '456 Connaught Place, Delhi', manager: 'Priya Sharma', status: 'active', capacity: '100' },
    { id: '3', name: 'Bangalore Tech Park', address: '789 Whitefield, Bangalore', manager: 'Sanjay Patel', status: 'active', capacity: '200' },
    { id: '4', name: 'Chennai Center', address: '321 T Nagar, Chennai', manager: 'Vikram Singh', status: 'active', capacity: '120' }
  ]);

  // Handle leave request actions
  const handleLeaveAction = async (leaveId: string, action: 'approve' | 'reject') => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLeaves(prevLeaves => 
        prevLeaves.map(leave => 
          leave.id === leaveId 
            ? { ...leave, status: action === 'approve' ? 'approved' : 'rejected' }
            : leave
        )
      );

      const leave = leaves.find(l => l.id === leaveId);
      if (leave) {
        const newActivity = {
          id: Date.now().toString(),
          user: `Super Admin`,
          action: `${action === 'approve' ? 'Approved' : 'Rejected'} leave request for ${leave.employee}`,
          time: 'Just now',
          type: action === 'approve' ? 'success' : 'warning'
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      }

      setStats(prev => ({
        ...prev,
        pendingLeaves: prev.pendingLeaves - 1
      }));

      toast.success(`Leave request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
    } catch (error) {
      toast.error(`Failed to ${action} leave request`);
    } finally {
      setIsLoading(false);
    }
  };

  // Form handlers
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: (users.length + 1).toString(),
        ...userForm
      };
      
      setUsers(prev => [...prev, newUser]);
      
      const newActivity = {
        id: Date.now().toString(),
        user: `Super Admin`,
        action: `Added new ${userForm.role}: ${userForm.name}`,
        time: 'Just now',
        type: 'success'
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      
      setStats(prev => ({
        ...prev,
        totalEmployees: userForm.role === 'employee' ? prev.totalEmployees + 1 : prev.totalEmployees,
        totalSupervisors: userForm.role === 'supervisor' ? prev.totalSupervisors + 1 : prev.totalSupervisors,
        totalManagers: userForm.role === 'manager' ? prev.totalManagers + 1 : prev.totalManagers
      }));

      setUserForm({ name: '', email: '', role: 'employee', department: '', site: '', phone: '' });
      toast.success('User added successfully');
      
    } catch (error) {
      toast.error('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSupervisor = {
        id: (users.length + 1).toString(),
        ...supervisorForm,
        role: 'supervisor'
      };
      
      setUsers(prev => [...prev, newSupervisor]);
      
      const newActivity = {
        id: Date.now().toString(),
        user: `Super Admin`,
        action: `Created new supervisor: ${supervisorForm.name}`,
        time: 'Just now',
        type: 'success'
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      
      setStats(prev => ({
        ...prev,
        totalSupervisors: prev.totalSupervisors + 1
      }));

      setSupervisorForm({ name: '', email: '', department: '', site: '', phone: '', experience: '' });
      toast.success('Supervisor created successfully');
      
    } catch (error) {
      toast.error('Failed to create supervisor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newManager = {
        id: (users.length + 1).toString(),
        ...managerForm,
        role: 'manager'
      };
      
      setUsers(prev => [...prev, newManager]);
      
      const newActivity = {
        id: Date.now().toString(),
        user: `Super Admin`,
        action: `Added new manager: ${managerForm.name}`,
        time: 'Just now',
        type: 'success'
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      
      setStats(prev => ({
        ...prev,
        totalManagers: prev.totalManagers + 1
      }));

      setManagerForm({ name: '', email: '', department: '', sites: [], phone: '', experience: '' });
      toast.success('Manager added successfully');
      
    } catch (error) {
      toast.error('Failed to add manager');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSite = {
        id: (sites.length + 1).toString(),
        ...siteForm
      };
      
      setSites(prev => [...prev, newSite]);
      
      const newActivity = {
        id: Date.now().toString(),
        user: `Super Admin`,
        action: `Created new site: ${siteForm.name}`,
        time: 'Just now',
        type: 'success'
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      
      setStats(prev => ({
        ...prev,
        totalSites: prev.totalSites + 1
      }));

      setSiteForm({ name: '', address: '', manager: '', status: 'active', capacity: '' });
      toast.success('Site created successfully');
      
    } catch (error) {
      toast.error('Failed to create site');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter pending leaves
  const pendingLeaves = leaves.filter(leave => leave.status === 'pending');
  
  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="flex items-start gap-3 pb-3 border-b last:border-0"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
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
                <Badge variant="secondary">{pendingLeaves.length} Pending</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingLeaves.map((leave, index) => (
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
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleLeaveAction(leave.id, 'approve')}
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Approve"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => handleLeaveAction(leave.id, 'reject')}
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Reject"}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {pendingLeaves.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending leave requests
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions with Forms */}
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
                {/* Add User Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="h-20 flex flex-col gap-2">
                      <Users className="h-5 w-5" />
                      <span className="text-sm">Add User</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={userForm.name}
                            onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                            placeholder="Enter email"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select value={userForm.role} onValueChange={(value: any) => setUserForm({...userForm, role: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="supervisor">Supervisor</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select value={userForm.department} onValueChange={(value) => setUserForm({...userForm, department: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {indianNames.departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="site">Site</Label>
                          <Select value={userForm.site} onValueChange={(value) => setUserForm({...userForm, site: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select site" />
                            </SelectTrigger>
                            <SelectContent>
                              {sites.map(site => (
                                <SelectItem key={site.id} value={site.name}>{site.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={userForm.phone}
                            onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Adding User..." : "Add User"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Create Supervisor Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Shield className="h-5 w-5" />
                      <span className="text-sm">Create Supervisor</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Supervisor</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSupervisor} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="supervisor-name">Full Name</Label>
                          <Input
                            id="supervisor-name"
                            value={supervisorForm.name}
                            onChange={(e) => setSupervisorForm({...supervisorForm, name: e.target.value})}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supervisor-email">Email</Label>
                          <Input
                            id="supervisor-email"
                            type="email"
                            value={supervisorForm.email}
                            onChange={(e) => setSupervisorForm({...supervisorForm, email: e.target.value})}
                            placeholder="Enter email"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="supervisor-department">Department</Label>
                          <Select value={supervisorForm.department} onValueChange={(value) => setSupervisorForm({...supervisorForm, department: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {indianNames.departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supervisor-site">Site</Label>
                          <Select value={supervisorForm.site} onValueChange={(value) => setSupervisorForm({...supervisorForm, site: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select site" />
                            </SelectTrigger>
                            <SelectContent>
                              {sites.map(site => (
                                <SelectItem key={site.id} value={site.name}>{site.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="supervisor-phone">Phone</Label>
                          <Input
                            id="supervisor-phone"
                            value={supervisorForm.phone}
                            onChange={(e) => setSupervisorForm({...supervisorForm, phone: e.target.value})}
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supervisor-experience">Experience (Years)</Label>
                          <Input
                            id="supervisor-experience"
                            type="number"
                            value={supervisorForm.experience}
                            onChange={(e) => setSupervisorForm({...supervisorForm, experience: e.target.value})}
                            placeholder="Enter years of experience"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating Supervisor..." : "Create Supervisor"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Add Manager Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Briefcase className="h-5 w-5" />
                      <span className="text-sm">Add Manager</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Manager</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddManager} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="manager-name">Full Name</Label>
                          <Input
                            id="manager-name"
                            value={managerForm.name}
                            onChange={(e) => setManagerForm({...managerForm, name: e.target.value})}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="manager-email">Email</Label>
                          <Input
                            id="manager-email"
                            type="email"
                            value={managerForm.email}
                            onChange={(e) => setManagerForm({...managerForm, email: e.target.value})}
                            placeholder="Enter email"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="manager-department">Department</Label>
                        <Select value={managerForm.department} onValueChange={(value) => setManagerForm({...managerForm, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianNames.departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="manager-phone">Phone</Label>
                          <Input
                            id="manager-phone"
                            value={managerForm.phone}
                            onChange={(e) => setManagerForm({...managerForm, phone: e.target.value})}
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="manager-experience">Experience (Years)</Label>
                          <Input
                            id="manager-experience"
                            type="number"
                            value={managerForm.experience}
                            onChange={(e) => setManagerForm({...managerForm, experience: e.target.value})}
                            placeholder="Enter years of experience"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Adding Manager..." : "Add Manager"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* New Site Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Building2 className="h-5 w-5" />
                      <span className="text-sm">New Site</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Site</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSite} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="site-name">Site Name</Label>
                        <Input
                          id="site-name"
                          value={siteForm.name}
                          onChange={(e) => setSiteForm({...siteForm, name: e.target.value})}
                          placeholder="Enter site name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site-address">Address</Label>
                        <Textarea
                          id="site-address"
                          value={siteForm.address}
                          onChange={(e) => setSiteForm({...siteForm, address: e.target.value})}
                          placeholder="Enter complete address"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="site-manager">Manager</Label>
                          <Select value={siteForm.manager} onValueChange={(value) => setSiteForm({...siteForm, manager: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.filter(user => user.role === 'manager').map(manager => (
                                <SelectItem key={manager.id} value={manager.name}>{manager.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="site-capacity">Capacity</Label>
                          <Input
                            id="site-capacity"
                            type="number"
                            value={siteForm.capacity}
                            onChange={(e) => setSiteForm({...siteForm, capacity: e.target.value})}
                            placeholder="Enter employee capacity"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site-status">Status</Label>
                        <Select value={siteForm.status} onValueChange={(value: 'active' | 'inactive') => setSiteForm({...siteForm, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating Site..." : "Create Site"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.role === 'manager' ? 'default' : 
                          user.role === 'supervisor' ? 'secondary' : 'outline'
                        }>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.site}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sites List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.name}</TableCell>
                      <TableCell>{site.address}</TableCell>
                      <TableCell>{site.manager}</TableCell>
                      <TableCell>{site.capacity} employees</TableCell>
                      <TableCell>
                        <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                          {site.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
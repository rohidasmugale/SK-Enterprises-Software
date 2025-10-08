import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Search, Download, Upload, Plus, Edit, Trash2, User, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Types
interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  status: "active" | "inactive";
  salary: number;
  documents: Document[];
}

interface Document {
  id: number;
  type: string;
  name: string;
  uploadDate: string;
  expiryDate: string;
  status: "valid" | "expired" | "expiring";
}

interface LeaveRequest {
  id: number;
  employee: string;
  employeeId: string;
  type: string;
  from: string;
  to: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

interface Attendance {
  id: number;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late" | "half-day";
}

interface Payroll {
  id: number;
  employeeId: string;
  employeeName: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "processed" | "pending";
}

interface Performance {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  kpi: number;
  rating: number;
  reviewDate: string;
}

// Dummy Data
const initialEmployees: Employee[] = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1-555-0101",
    department: "Engineering",
    position: "Senior Developer",
    joinDate: "2023-01-15",
    status: "active",
    salary: 75000,
    documents: [
      {
        id: 1,
        type: "Contract",
        name: "employment_contract.pdf",
        uploadDate: "2023-01-15",
        expiryDate: "2025-01-15",
        status: "valid"
      }
    ]
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    phone: "+1-555-0102",
    department: "HR",
    position: "HR Manager",
    joinDate: "2022-03-10",
    status: "active",
    salary: 65000,
    documents: [
      {
        id: 1,
        type: "Contract",
        name: "employment_contract.pdf",
        uploadDate: "2022-03-10",
        expiryDate: "2024-03-10",
        status: "expiring"
      }
    ]
  }
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employee: "John Doe",
    employeeId: "EMP001",
    type: "Sick Leave",
    from: "2024-01-15",
    to: "2024-01-16",
    reason: "Flu",
    status: "pending"
  },
  {
    id: 2,
    employee: "Jane Smith",
    employeeId: "EMP002",
    type: "Vacation",
    from: "2024-02-01",
    to: "2024-02-05",
    reason: "Family vacation",
    status: "approved"
  }
];

const initialAttendance: Attendance[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "John Doe",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    date: "2024-01-10",
    checkIn: "09:15",
    checkOut: "17:00",
    status: "late"
  }
];

const initialPayroll: Payroll[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "John Doe",
    month: "January 2024",
    basicSalary: 6250,
    allowances: 500,
    deductions: 300,
    netSalary: 6450,
    status: "processed"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    month: "January 2024",
    basicSalary: 5416,
    allowances: 400,
    deductions: 250,
    netSalary: 5566,
    status: "pending"
  }
];

const initialPerformance: Performance[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "John Doe",
    department: "Engineering",
    kpi: 85,
    rating: 4.5,
    reviewDate: "2024-01-05"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    department: "HR",
    kpi: 92,
    rating: 4.8,
    reviewDate: "2024-01-05"
  }
];

const HRMS = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [payroll, setPayroll] = useState<Payroll[]>(initialPayroll);
  const [performance, setPerformance] = useState<Performance[]>(initialPerformance);
  const [activeTab, setActiveTab] = useState("employees");
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: ""
  });

  // Employee Management
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast.error("Please fill required fields");
      return;
    }

    const employee: Employee = {
      id: employees.length + 1,
      employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      department: newEmployee.department,
      position: newEmployee.position,
      joinDate: new Date().toISOString().split('T')[0],
      status: "active",
      salary: Number(newEmployee.salary),
      documents: []
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: "", email: "", phone: "", department: "", position: "", salary: "" });
    toast.success("Employee added successfully");
  };

  const handleLeaveAction = (id: number, action: "approved" | "rejected") => {
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === id ? { ...leave, status: action } : leave
    ));
    toast.success(`Leave request ${action}!`);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      case "pending": return "secondary";
      case "active": return "default";
      case "inactive": return "destructive";
      case "processed": return "default";
      case "present": return "default";
      case "absent": return "destructive";
      case "late": return "secondary";
      default: return "outline";
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reports Data
  const attendanceSummary = {
    present: attendance.filter(a => a.status === "present").length,
    absent: attendance.filter(a => a.status === "absent").length,
    late: attendance.filter(a => a.status === "late").length,
    total: attendance.length
  };

  const payrollSummary = {
    total: payroll.reduce((sum, p) => sum + p.netSalary, 0),
    processed: payroll.filter(p => p.status === "processed").length,
    pending: payroll.filter(p => p.status === "pending").length
  };

  const documentExpiryReport = employees.flatMap(emp =>
    emp.documents.map(doc => ({
      employee: emp.name,
      document: doc.type,
      expiryDate: doc.expiryDate,
      status: doc.status
    }))
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="HRMS - Human Resource Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
          <TabsList className="w-full justify-start flex-wrap h-auto">
            <TabsTrigger value="employees" className="flex-1 min-w-[120px]">Employees</TabsTrigger>
            <TabsTrigger value="onboarding" className="flex-1 min-w-[120px]">Onboarding</TabsTrigger>
            <TabsTrigger value="attendance" className="flex-1 min-w-[120px]">Attendance</TabsTrigger>
            <TabsTrigger value="leave" className="flex-1 min-w-[120px]">Leave Management</TabsTrigger>
            <TabsTrigger value="shifts" className="flex-1 min-w-[120px]">Shift Roster</TabsTrigger>
            <TabsTrigger value="payroll" className="flex-1 min-w-[120px]">Payroll</TabsTrigger>
            <TabsTrigger value="performance" className="flex-1 min-w-[120px]">Performance</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 min-w-[120px]">Reports</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employees.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {employees.filter(e => e.status === "active").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {new Set(employees.map(e => e.department)).size}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">3</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Employee Database</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.employeeId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {employee.name}
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.joinDate}</TableCell>
                        <TableCell>${employee.salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(employee.status)}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onboarding Tab */}
          <TabsContent value="onboarding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Onboarding & Document Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Add New Employee</h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={newEmployee.phone}
                            onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={newEmployee.department}
                            onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            value={newEmployee.position}
                            onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salary">Salary</Label>
                          <Input
                            id="salary"
                            type="number"
                            value={newEmployee.salary}
                            onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddEmployee}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Document Upload</h3>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop documents here or click to browse
                      </p>
                      <Button variant="outline" className="mt-4">
                        Browse Files
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Required Documents</Label>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• Employment Contract</div>
                        <div>• ID Proof</div>
                        <div>• Educational Certificates</div>
                        <div>• Bank Details</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">287</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">12</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Late Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">8</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">25</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.checkIn}</TableCell>
                        <TableCell>{record.checkOut}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Management Tab */}
          <TabsContent value="leave" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leaveRequests.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {leaveRequests.filter(l => l.status === "pending").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {leaveRequests.filter(l => l.status === "approved").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {leaveRequests.filter(l => l.status === "rejected").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">{leave.employee}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{leave.type}</Badge>
                        </TableCell>
                        <TableCell>{leave.from}</TableCell>
                        <TableCell>{leave.to}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(leave.status)}>
                            {leave.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {leave.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleLeaveAction(leave.id, "approved")}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleLeaveAction(leave.id, "rejected")}
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shift Roster Tab */}
          <TabsContent value="shifts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shift & Roster Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Create Shift</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shiftName">Shift Name</Label>
                        <Input id="shiftName" placeholder="Morning Shift" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input id="startTime" type="time" defaultValue="09:00" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input id="endTime" type="time" defaultValue="17:00" />
                        </div>
                      </div>
                      <Button>Create Shift</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Current Shifts</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Morning Shift</div>
                          <div className="text-sm text-muted-foreground">09:00 - 17:00</div>
                        </div>
                        <Badge>15 employees</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Evening Shift</div>
                          <div className="text-sm text-muted-foreground">14:00 - 22:00</div>
                        </div>
                        <Badge>8 employees</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Night Shift</div>
                          <div className="text-sm text-muted-foreground">22:00 - 06:00</div>
                        </div>
                        <Badge>5 employees</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${payrollSummary.total.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{payrollSummary.processed}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">{payrollSummary.pending}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payroll.map((pay) => (
                      <TableRow key={pay.id}>
                        <TableCell className="font-medium">{pay.employeeName}</TableCell>
                        <TableCell>{pay.month}</TableCell>
                        <TableCell>${pay.basicSalary.toLocaleString()}</TableCell>
                        <TableCell>${pay.allowances.toLocaleString()}</TableCell>
                        <TableCell>${pay.deductions.toLocaleString()}</TableCell>
                        <TableCell>${pay.netSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(pay.status)}>
                            {pay.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Evaluation & KPIs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>KPI Score</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performance.map((perf) => (
                      <TableRow key={perf.id}>
                        <TableCell className="font-medium">{perf.employeeName}</TableCell>
                        <TableCell>{perf.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${perf.kpi}%` }}
                              />
                            </div>
                            {perf.kpi}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {perf.rating}/5
                          </Badge>
                        </TableCell>
                        <TableCell>{perf.reviewDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">HR Reports</h2>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export All Reports
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Attendance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Attendance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Present:</span>
                      <span className="font-medium">{attendanceSummary.present}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Absent:</span>
                      <span className="font-medium text-destructive">{attendanceSummary.absent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late:</span>
                      <span className="font-medium text-secondary">{attendanceSummary.late}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total Records:</span>
                      <span className="font-medium">{attendanceSummary.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payroll Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Payroll Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium">${payrollSummary.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processed:</span>
                      <span className="font-medium text-primary">{payrollSummary.processed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-medium text-muted-foreground">{payrollSummary.pending}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Department-wise Staff */}
              <Card>
                <CardHeader>
                  <CardTitle>Department-wise Staff Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(employees.map(e => e.department))).map(dept => (
                      <div key={dept} className="flex justify-between items-center">
                        <span>{dept}</span>
                        <Badge>
                          {employees.filter(e => e.department === dept).length} employees
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Document Expiry */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Expiry Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documentExpiryReport.slice(0, 5).map((doc, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div>
                          <div className="font-medium">{doc.employee}</div>
                          <div className="text-muted-foreground">{doc.document}</div>
                        </div>
                        <Badge variant={
                          doc.status === 'expired' ? 'destructive' : 
                          doc.status === 'expiring' ? 'secondary' : 'default'
                        }>
                          {doc.expiryDate}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default HRMS;
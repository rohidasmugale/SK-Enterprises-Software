import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SupervisorEmployees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", role: "Employee", site: "Site 01", status: "active", phone: "+1234567890", shift: "Morning" },
    { id: 2, name: "Jane Smith", role: "Employee", site: "Site 01", status: "active", phone: "+1234567891", shift: "Evening" },
  ]);

  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Employee added successfully!");
    setDialogOpen(false);
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Employee Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-3">
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
              <CardTitle className="text-sm font-medium">On Duty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{employees.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>My Team</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">Assign Site</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="site01">Site 01</SelectItem>
                        <SelectItem value="site02">Site 02</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shift">Shift</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6 AM - 2 PM)</SelectItem>
                        <SelectItem value="evening">Evening (2 PM - 10 PM)</SelectItem>
                        <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value="Employee" disabled />
                  </div>
                  <Button type="submit" className="w-full">Add Employee</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.site}</Badge>
                    </TableCell>
                    <TableCell>{employee.shift}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SupervisorEmployees;

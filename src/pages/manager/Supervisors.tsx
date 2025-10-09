import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye, Mail, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Supervisors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [supervisors, setSupervisors] = useState([
    { id: 1, name: "Alice Supervisor", email: "alice.s@sk.com", employees: 8, tasks: 12, status: "active" },
    { id: 2, name: "Bob Supervisor", email: "bob.s@sk.com", employees: 6, tasks: 9, status: "active" },
    { id: 3, name: "Carol Supervisor", email: "carol.s@sk.com", employees: 5, tasks: 7, status: "inactive" },
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Supervisor added successfully!");
    setDialogOpen(false);
  };

  const toggleStatus = (id: number) => {
    setSupervisors(supervisors.map(s => 
      s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
    ));
    toast.success("Supervisor status updated!");
  };

  const filteredSupervisors = supervisors.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Supervisors" subtitle="Manage your supervisors" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>All Supervisors</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supervisor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supervisor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter password" required />
                  </div>
                  <Button type="submit" className="w-full">Create Supervisor</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search supervisors..."
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
                  <TableHead>Email</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupervisors.map((supervisor) => (
                  <TableRow key={supervisor.id}>
                    <TableCell className="font-medium">{supervisor.name}</TableCell>
                    <TableCell>{supervisor.email}</TableCell>
                    <TableCell>{supervisor.employees}</TableCell>
                    <TableCell>{supervisor.tasks}</TableCell>
                    <TableCell>
                      <Badge variant={supervisor.status === "active" ? "default" : "secondary"}>
                        {supervisor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleStatus(supervisor.id)}
                        >
                          {supervisor.status === "active" ? (
                            <UserX className="h-4 w-4 text-destructive" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-primary" />
                          )}
                        </Button>
                      </div>
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

export default Supervisors;

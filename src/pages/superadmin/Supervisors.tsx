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
import { Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { supervisors } from "@/utils/dummyData";
import { motion } from "framer-motion";

const Supervisors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddSupervisor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Supervisor added successfully!");
    setDialogOpen(false);
  };

  const filteredSupervisors = supervisors.filter(supervisor => 
    supervisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supervisor.site.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Supervisors Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Supervisors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supervisors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {supervisors.filter(s => s.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {supervisors.reduce((sum, s) => sum + s.employees, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

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
                <form onSubmit={handleAddSupervisor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Supervisor Name</Label>
                    <Input id="name" placeholder="Enter name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
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
                        <SelectItem value="site03">Site 03</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Assign Manager</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager-a">Manager A</SelectItem>
                        <SelectItem value="manager-b">Manager B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Add Supervisor</Button>
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
                  <TableHead>Site</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupervisors.map((supervisor) => (
                  <TableRow key={supervisor.id}>
                    <TableCell className="font-medium">{supervisor.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{supervisor.site}</Badge>
                    </TableCell>
                    <TableCell>{supervisor.manager}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {supervisor.employees}
                      </div>
                    </TableCell>
                    <TableCell>{supervisor.phone}</TableCell>
                    <TableCell>
                      <Badge variant={supervisor.status === "active" ? "default" : "secondary"}>
                        {supervisor.status}
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
  );
};

export default Supervisors;

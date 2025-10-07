import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { managers } from "@/utils/dummyData";
import { motion } from "framer-motion";

const Managers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddManager = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Manager added successfully!");
    setDialogOpen(false);
  };

  const filteredManagers = managers.filter(manager => 
    manager.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Managers Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{managers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {managers.filter(m => m.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Supervisors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {managers.reduce((sum, m) => sum + m.supervisors, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {managers.reduce((sum, m) => sum + m.sites, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>All Managers</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Manager
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Manager</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddManager} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Manager Name</Label>
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
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="Enter department" required />
                  </div>
                  <Button type="submit" className="w-full">Add Manager</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search managers..."
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
                  <TableHead>Department</TableHead>
                  <TableHead>Supervisors</TableHead>
                  <TableHead>Sites</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell className="font-medium">{manager.name}</TableCell>
                    <TableCell>{manager.department}</TableCell>
                    <TableCell>{manager.supervisors}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {manager.sites}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {manager.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={manager.status === "active" ? "default" : "secondary"}>
                        {manager.status}
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

export default Managers;

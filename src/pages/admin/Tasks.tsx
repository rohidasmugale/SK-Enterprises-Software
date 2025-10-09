import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Tasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, title: "Update HRMS Module", assignedTo: "John Manager", priority: "high", status: "in-progress", dueDate: "2025-01-15" },
    { id: 2, title: "Prepare Monthly Report", assignedTo: "Sarah Manager", priority: "medium", status: "pending", dueDate: "2025-01-20" },
    { id: 3, title: "Review Leave Requests", assignedTo: "Alice Supervisor", priority: "high", status: "in-progress", dueDate: "2025-01-12" },
    { id: 4, title: "Employee Training Session", assignedTo: "Bob Supervisor", priority: "low", status: "completed", dueDate: "2025-01-10" },
  ]);

  const updateStatus = (id: number, status: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status } : task));
    toast.success("Task status updated!");
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'default';
      case 'in-progress': return 'default';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Task Management" subtitle="View and manage all assigned tasks" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(task.priority) as any} className="capitalize">
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={task.status} onValueChange={(value) => updateStatus(task.id, value)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
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

export default Tasks;

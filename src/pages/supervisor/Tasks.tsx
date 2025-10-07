import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Tasks = () => {
  const [tasksList, setTasksList] = useState([
    { id: 1, title: "Complete Site Inspection", priority: "high", status: "pending", deadline: "2024-01-22", assignedBy: "Manager A" },
    { id: 2, title: "Equipment Maintenance", priority: "high", status: "in-progress", deadline: "2024-01-21", assignedBy: "Manager A" },
    { id: 3, title: "Submit Daily Report", priority: "medium", status: "pending", deadline: "2024-01-23", assignedBy: "Super Admin" },
  ]);

  const handleStatusChange = (id: number, newStatus: string) => {
    setTasksList(tasksList.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    toast.success(`Task status updated to ${newStatus}!`);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "default";
      case "in-progress": return "default";
      case "pending": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="My Tasks" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasksList.filter(t => t.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {tasksList.filter(t => t.status === "in-progress").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {tasksList.filter(t => t.status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasksList.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.deadline}
                      </div>
                    </TableCell>
                    <TableCell>{task.assignedBy}</TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={task.status}
                        onValueChange={(value) => handleStatusChange(task.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
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

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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { tasks } from "@/utils/dummyData";
import { motion } from "framer-motion";

const Operations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAssignTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Task assigned successfully!");
    setDialogOpen(false);
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <DashboardHeader title="Operations & Task Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {tasks.filter(t => t.status === "in-progress").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {tasks.filter(t => t.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {tasks.filter(t => t.status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>All Tasks</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAssignTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input id="task-title" placeholder="Enter task title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter task description" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assign-to">Assign To</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager-a">Manager A</SelectItem>
                        <SelectItem value="supervisor-a">Supervisor A</SelectItem>
                        <SelectItem value="supervisor-b">Supervisor B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="date" required />
                  </div>
                  <Button type="submit" className="w-full">Assign Task</Button>
                </form>
              </DialogContent>
            </Dialog>
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
                  <TableHead>Task Title</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority === "high" && <AlertCircle className="mr-1 h-3 w-3" />}
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

export default Operations;

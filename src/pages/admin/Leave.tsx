import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Leave = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leaveRequests] = useState([
    { id: 1, employee: "John Doe", type: "Sick Leave", from: "2025-01-15", to: "2025-01-17", days: 3, status: "pending", reason: "Medical treatment" },
    { id: 2, employee: "Jane Smith", type: "Annual Leave", from: "2025-01-20", to: "2025-01-25", days: 5, status: "approved", reason: "Family vacation" },
    { id: 3, employee: "Mike Wilson", type: "Casual Leave", from: "2025-01-18", to: "2025-01-19", days: 2, status: "pending", reason: "Personal work" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Leave request submitted!");
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Leave Management" subtitle="Apply for and manage leave requests" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Leave Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="casual">Casual Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From Date</Label>
                    <Input id="from" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To Date</Label>
                    <Input id="to" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea id="reason" placeholder="Enter reason for leave" required />
                </div>
                <Button type="submit" className="w-full">Submit Request</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests.map((leave) => (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{leave.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {leave.from} to {leave.to} ({leave.days} days)
                      </p>
                    </div>
                    <Badge
                      variant={
                        leave.status === "approved"
                          ? "default"
                          : leave.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Reason: {leave.reason}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Leave;

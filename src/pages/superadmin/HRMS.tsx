import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { leaveRequests } from "@/utils/dummyData";
import { motion } from "framer-motion";

const HRMS = () => {
  const [leaves, setLeaves] = useState(leaveRequests);

  const handleLeaveAction = (id: number, action: "approved" | "rejected") => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: action } : leave
    ));
    toast.success(`Leave request ${action}!`);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      case "pending": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="HRMS - Human Resource Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <Tabs defaultValue="leave" className="space-y-6">
          <TabsList>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          <TabsContent value="leave" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leaves.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {leaves.filter(l => l.status === "pending").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {leaves.filter(l => l.status === "approved").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {leaves.filter(l => l.status === "rejected").length}
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
                    {leaves.map((leave) => (
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

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
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
                      <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-muted-foreground">25</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$145,680</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Processed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">298</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-muted-foreground">26</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default HRMS;

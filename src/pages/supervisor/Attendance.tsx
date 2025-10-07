import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: "John Doe", shift: "Morning", status: true },
    { id: 2, name: "Jane Smith", shift: "Evening", status: true },
    { id: 3, name: "Mike Johnson", shift: "Morning", status: false },
  ]);

  const toggleAttendance = (id: number) => {
    setAttendanceData(attendanceData.map(emp => 
      emp.id === id ? { ...emp, status: !emp.status } : emp
    ));
    toast.success("Attendance updated!");
  };

  const handleMarkAll = (present: boolean) => {
    setAttendanceData(attendanceData.map(emp => ({ ...emp, status: present })));
    toast.success(`All employees marked as ${present ? "present" : "absent"}!`);
  };

  const presentCount = attendanceData.filter(e => e.status).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Attendance Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{presentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {attendanceData.length - presentCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {Math.round((presentCount / attendanceData.length) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Today's Attendance</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleMarkAll(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All Present
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleMarkAll(false)}>
                <XCircle className="mr-2 h-4 w-4" />
                Mark All Absent
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Mark Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.shift}</TableCell>
                    <TableCell>
                      {employee.status ? (
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle className="h-4 w-4" />
                          Present
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-destructive">
                          <XCircle className="h-4 w-4" />
                          Absent
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm">
                          {employee.status ? "Present" : "Absent"}
                        </span>
                        <Switch
                          checked={employee.status}
                          onCheckedChange={() => toggleAttendance(employee.id)}
                        />
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

export default Attendance;

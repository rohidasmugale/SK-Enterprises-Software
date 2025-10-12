import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late" | "half-day";
  workHours: string;
}

const EmployeeAttendance = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: "1",
      date: "2024-01-10",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      status: "present",
      workHours: "9 hours"
    },
    {
      id: "2",
      date: "2024-01-09",
      checkIn: "09:15 AM",
      checkOut: "06:05 PM",
      status: "late",
      workHours: "8.5 hours"
    },
    {
      id: "3",
      date: "2024-01-08",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      status: "present",
      workHours: "9 hours"
    },
    {
      id: "4",
      date: "2024-01-07",
      checkIn: "-",
      checkOut: "-",
      status: "absent",
      workHours: "0 hours"
    },
    {
      id: "5",
      date: "2024-01-06",
      checkIn: "09:00 AM",
      checkOut: "01:00 PM",
      status: "half-day",
      workHours: "4 hours"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Present</Badge>;
      case "absent":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Late</Badge>;
      case "half-day":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Half Day</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalPresent = attendanceRecords.filter(r => r.status === "present").length;
  const totalAbsent = attendanceRecords.filter(r => r.status === "absent").length;
  const totalLate = attendanceRecords.filter(r => r.status === "late").length;
  const attendancePercentage = ((totalPresent + totalLate) / attendanceRecords.length * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Attendance" 
        subtitle="View your attendance records"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendancePercentage}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{totalPresent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Late Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{totalLate}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{totalAbsent}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Attendance History</CardTitle>
              </div>
              <CardDescription>Your attendance records (read-only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{record.date}</div>
                      <div className="text-sm text-muted-foreground flex gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          In: {record.checkIn}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Out: {record.checkOut}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{record.workHours}</span>
                      {getStatusBadge(record.status)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;

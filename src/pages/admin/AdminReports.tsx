import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminReports = () => {
  const reports = [
    { id: 1, name: "Monthly Attendance Report", type: "Attendance", date: "Jan 2025", status: "Ready" },
    { id: 2, name: "Financial Summary Q4 2024", type: "Financial", date: "Dec 2024", status: "Ready" },
    { id: 3, name: "Task Completion Report", type: "Tasks", date: "Jan 2025", status: "Processing" },
    { id: 4, name: "Employee Performance Review", type: "Performance", date: "Jan 2025", status: "Ready" },
  ];

  const handleDownload = (reportName: string) => {
    toast.success(`Downloading ${reportName}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Reports & Analytics" subtitle="Generate and download system reports" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Generated this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Generated</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">Latest report available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Report Types</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Different categoriess</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">{report.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Badge variant={report.status === "Ready" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(report.name)}
                    disabled={report.status !== "Ready"}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Attendance</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Performance</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Leave Summary</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Financial</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminReports;

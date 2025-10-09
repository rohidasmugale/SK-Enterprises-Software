import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ManagerReports = () => {
  const reports = [
    { id: 1, name: "Weekly Task Summary", date: "Week 2, Jan 2025", status: "Ready" },
    { id: 2, name: "Supervisor Performance", date: "Jan 2025", status: "Ready" },
    { id: 3, name: "Site Operations Report", date: "Jan 2025", status: "Processing" },
  ];

  const handleDownload = (reportName: string) => {
    toast.success(`Downloading ${reportName}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Reports" subtitle="View and download reports" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
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
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                    <Badge variant={report.status === "Ready" ? "default" : "secondary"}>
                      {report.status}
                    </Badge>
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
      </motion.div>
    </div>
  );
};

export default ManagerReports;

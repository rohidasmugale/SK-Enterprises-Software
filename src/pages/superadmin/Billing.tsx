import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, DollarSign, TrendingUp, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Invoice {
  id: string;
  client: string;
  amount: string;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
}

const Billing = () => {
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-001", client: "Tech Corp", amount: "$5,000", status: "paid", date: "2024-01-10", dueDate: "2024-01-20" },
    { id: "INV-002", client: "Digital Ltd", amount: "$3,500", status: "pending", date: "2024-01-15", dueDate: "2024-01-25" },
    { id: "INV-003", client: "StartUp Inc", amount: "$2,800", status: "overdue", date: "2024-01-05", dueDate: "2024-01-15" },
  ]);

  const revenueData = [
    { month: "Jan", revenue: 15000 },
    { month: "Feb", revenue: 18000 },
    { month: "Mar", revenue: 22000 },
    { month: "Apr", revenue: 19000 },
    { month: "May", revenue: 25000 },
    { month: "Jun", revenue: 28000 },
  ];

  const handleCreateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newInvoice: Invoice = {
      id: `INV-${(invoices.length + 1).toString().padStart(3, '0')}`,
      client: formData.get("client") as string,
      amount: formData.get("amount") as string,
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.get("dueDate") as string,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    toast.success("Invoice created successfully!");
    setInvoiceDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "pending": return "secondary";
      case "overdue": return "destructive";
      default: return "outline";
    }
  };

  const totalRevenue = invoices
    .filter(i => i.status === "paid")
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[^0-9.-]+/g, "")), 0);

  const pendingAmount = invoices
    .filter(i => i.status === "pending")
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[^0-9.-]+/g, "")), 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Billing & Finance" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {invoices.filter(i => i.status === "overdue").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payment Summary</TabsTrigger>
            <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Invoice Management</CardTitle>
                <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Create Invoice</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateInvoice} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="client">Client Name</Label>
                        <Input id="client" name="client" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" name="amount" placeholder="$5,000" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input id="dueDate" name="dueDate" type="date" required />
                      </div>
                      <Button type="submit" className="w-full">Create Invoice</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell className="font-semibold">{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setPreviewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.success("Invoice downloaded as PDF")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Paid Invoices</p>
                          <p className="text-2xl font-bold">
                            {invoices.filter(i => i.status === "paid").length}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Pending</p>
                          <p className="text-2xl font-bold">
                            {invoices.filter(i => i.status === "pending").length}
                          </p>
                        </div>
                        <FileText className="h-8 w-8 text-secondary" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Overdue</p>
                          <p className="text-2xl font-bold text-destructive">
                            {invoices.filter(i => i.status === "overdue").length}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-destructive" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Recent Payments</h3>
                  {invoices.filter(i => i.status === "paid").map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{invoice.client}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                      <Badge variant="default">{invoice.amount}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-4 border rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">INVOICE</h2>
                    <p className="text-muted-foreground">{selectedInvoice.id}</p>
                  </div>
                  <Badge variant={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Billed To:</p>
                    <p className="font-semibold">{selectedInvoice.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date:</p>
                    <p className="font-semibold">{selectedInvoice.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date:</p>
                    <p className="font-semibold">{selectedInvoice.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount:</p>
                    <p className="text-2xl font-bold text-primary">{selectedInvoice.amount}</p>
                  </div>
                </div>
                <Button className="w-full" onClick={() => toast.success("Invoice downloaded")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Billing;

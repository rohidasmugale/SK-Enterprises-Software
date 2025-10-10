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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, DollarSign, TrendingUp, Eye, Download, Upload, IndianRupee, Calendar, Clock, CreditCard, Banknote, Receipt, Edit } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface Invoice {
  id: string;
  client: string;
  clientEmail: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  tax: number;
  discount: number;
  paymentMethod?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  vendor: string;
  paymentMethod: string;
  gst?: number;
}

interface Payment {
  id: string;
  invoiceId: string;
  client: string;
  amount: number;
  date: string;
  method: string;
  status: "completed" | "failed" | "pending";
}

const Billing = () => {
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [expenseViewDialogOpen, setExpenseViewDialogOpen] = useState(false);
  const [expenseEditDialogOpen, setExpenseEditDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState("invoices");

  // Enhanced data with Indian context
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      client: "Tech Mahindra Ltd",
      clientEmail: "accounts@techmahindra.com",
      amount: 45000,
      status: "paid",
      date: "2024-01-10",
      dueDate: "2024-01-20",
      items: [
        { description: "Software Development Services", quantity: 1, rate: 30000, amount: 30000 },
        { description: "Technical Consulting", quantity: 10, rate: 1500, amount: 15000 }
      ],
      tax: 1800,
      discount: 0,
      paymentMethod: "Bank Transfer"
    },
    {
      id: "INV-002",
      client: "Infosys Technologies",
      clientEmail: "billing@infosys.com",
      amount: 75000,
      status: "pending",
      date: "2024-01-15",
      dueDate: "2024-01-25",
      items: [
        { description: "Cloud Infrastructure Setup", quantity: 1, rate: 50000, amount: 50000 },
        { description: "Maintenance & Support", quantity: 5, rate: 5000, amount: 25000 }
      ],
      tax: 3000,
      discount: 1000,
      paymentMethod: "UPI"
    },
    {
      id: "INV-003",
      client: "StartUp India Foundation",
      clientEmail: "finance@startupindia.org",
      amount: 28500,
      status: "overdue",
      date: "2024-01-05",
      dueDate: "2024-01-15",
      items: [
        { description: "Business Consulting", quantity: 15, rate: 1500, amount: 22500 },
        { description: "Documentation Services", quantity: 1, rate: 6000, amount: 6000 }
      ],
      tax: 1140,
      discount: 500,
    }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "EXP-001",
      category: "Software",
      description: "Annual Subscription - Microsoft Office",
      amount: 12000,
      date: "2024-01-05",
      status: "approved",
      vendor: "Microsoft India",
      paymentMethod: "Credit Card",
      gst: 2160
    },
    {
      id: "EXP-002",
      category: "Infrastructure",
      description: "Cloud Server Hosting - AWS",
      amount: 25000,
      date: "2024-01-12",
      status: "pending",
      vendor: "Amazon Web Services",
      paymentMethod: "Bank Transfer",
      gst: 4500
    },
    {
      id: "EXP-003",
      category: "Office Supplies",
      description: "Office Furniture & Equipment",
      amount: 45000,
      date: "2024-01-18",
      status: "approved",
      vendor: "Godrej Interio",
      paymentMethod: "Bank Transfer",
      gst: 8100
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY-001",
      invoiceId: "INV-001",
      client: "Tech Mahindra Ltd",
      amount: 45000,
      date: "2024-01-12",
      method: "Bank Transfer",
      status: "completed"
    },
    {
      id: "PAY-002",
      invoiceId: "INV-003",
      client: "StartUp India Foundation",
      amount: 28500,
      date: "2024-01-20",
      method: "UPI",
      status: "failed"
    }
  ]);

  // Enhanced revenue data
  const revenueData = [
    { month: "Jan", revenue: 245000, expenses: 82000, profit: 163000 },
    { month: "Feb", revenue: 318000, expenses: 95000, profit: 223000 },
    { month: "Mar", revenue: 422000, expenses: 112000, profit: 310000 },
    { month: "Apr", revenue: 389000, expenses: 98000, profit: 291000 },
    { month: "May", revenue: 515000, expenses: 125000, profit: 390000 },
    { month: "Jun", revenue: 628000, expenses: 145000, profit: 483000 },
  ];

  const expenseByCategory = [
    { name: "Software", value: 45000 },
    { name: "Infrastructure", value: 78000 },
    { name: "Salaries", value: 320000 },
    { name: "Office Supplies", value: 45000 },
    { name: "Marketing", value: 65000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Enhanced functions
  const handleCreateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const items: InvoiceItem[] = [];
    const itemCount = 3; // Fixed 3 items for simplicity
    
    for (let i = 0; i < itemCount; i++) {
      const description = formData.get(`item-${i}-description`) as string;
      const quantity = parseInt(formData.get(`item-${i}-quantity`) as string) || 0;
      const rate = parseInt(formData.get(`item-${i}-rate`) as string) || 0;
      
      if (description && quantity && rate) {
        items.push({
          description,
          quantity,
          rate,
          amount: quantity * rate
        });
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.18; // 18% GST
    const discount = parseInt(formData.get("discount") as string) || 0;
    const totalAmount = subtotal + tax - discount;

    const newInvoice: Invoice = {
      id: `INV-${(invoices.length + 1).toString().padStart(3, '0')}`,
      client: formData.get("client") as string,
      clientEmail: formData.get("clientEmail") as string,
      amount: totalAmount,
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.get("dueDate") as string,
      items,
      tax,
      discount,
    };
    
    setInvoices(prev => [newInvoice, ...prev]);
    toast.success("Invoice created successfully!");
    setInvoiceDialogOpen(false);
  };

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const amount = parseInt(formData.get("amount") as string);
    const gst = amount * 0.18; // 18% GST on expenses
    
    const newExpense: Expense = {
      id: `EXP-${(expenses.length + 1).toString().padStart(3, '0')}`,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      amount: amount + gst, // Total amount including GST
      date: formData.get("date") as string,
      status: "pending",
      vendor: formData.get("vendor") as string,
      paymentMethod: formData.get("paymentMethod") as string,
      gst: gst
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    toast.success("Expense added successfully!");
    setExpenseDialogOpen(false);
  };

  const handleEditExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedExpense) return;
    
    const formData = new FormData(e.currentTarget);
    const amount = parseInt(formData.get("amount") as string);
    const gst = amount * 0.18; // 18% GST on expenses
    
    const updatedExpense: Expense = {
      ...selectedExpense,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      amount: amount + gst,
      date: formData.get("date") as string,
      vendor: formData.get("vendor") as string,
      paymentMethod: formData.get("paymentMethod") as string,
      gst: gst
    };
    
    setExpenses(prev => prev.map(exp => 
      exp.id === selectedExpense.id ? updatedExpense : exp
    ));
    
    toast.success("Expense updated successfully!");
    setExpenseEditDialogOpen(false);
    setSelectedExpense(null);
  };

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setExpenseViewDialogOpen(true);
  };

  const handleEditExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setExpenseEditDialogOpen(true);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: "paid" } : inv
    ));
    
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setPayments(prev => [{
        id: `PAY-${(payments.length + 1).toString().padStart(3, '0')}`,
        invoiceId,
        client: invoice.client,
        amount: invoice.amount,
        date: new Date().toISOString().split('T')[0],
        method: "Manual",
        status: "completed"
      }, ...prev]);
    }
    
    toast.success("Invoice marked as paid!");
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const invoiceContent = `
      INVOICE: ${invoice.id}
      Client: ${invoice.client}
      Email: ${invoice.clientEmail}
      Date: ${invoice.date}
      Due Date: ${invoice.dueDate}
      Status: ${invoice.status}
      
      Items:
      ${invoice.items.map(item => `
        ${item.description} - Qty: ${item.quantity} - Rate: ₹${item.rate} - Amount: ₹${item.amount}
      `).join('')}
      
      Subtotal: ₹${invoice.items.reduce((sum, item) => sum + item.amount, 0)}
      GST (18%): ₹${invoice.tax}
      Discount: ₹${invoice.discount}
      Total: ₹${invoice.amount}
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Invoice ${invoice.id} downloaded!`);
  };

  const handleExportData = (type: string) => {
    let data = [];
    let filename = "";
    
    switch (type) {
      case "payments":
        data = payments;
        filename = "payments-export.csv";
        break;
      case "invoices":
        data = invoices;
        filename = "invoices-export.csv";
        break;
      case "expenses":
        data = expenses;
        filename = "expenses-export.csv";
        break;
    }
    
    // Simple CSV export simulation
    toast.success(`${type} data exported successfully!`);
    console.log(`Exported ${type}:`, data);
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": case "completed": case "approved": return "default";
      case "pending": return "secondary";
      case "overdue": case "failed": case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculations
  const totalRevenue = invoices
    .filter(i => i.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter(i => i.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = invoices
    .filter(i => i.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalExpenses = expenses
    .filter(e => e.status === "approved")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Billing & Finance" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Enhanced Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From {invoices.filter(i => i.status === "paid").length} paid invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
              <p className="text-xs text-muted-foreground">{invoices.filter(i => i.status === "pending").length} invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">{expenses.filter(e => e.status === "approved").length} approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </div>
              <p className="text-xs text-muted-foreground">Revenue - Expenses</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="payments">Payment Summary</TabsTrigger>
            <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
          </TabsList>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Invoice Management</CardTitle>
                <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Create Invoice</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateInvoice} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="client">Client Name</Label>
                          <Input id="client" name="client" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientEmail">Client Email</Label>
                          <Input id="clientEmail" name="clientEmail" type="email" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input id="dueDate" name="dueDate" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discount">Discount (₹)</Label>
                          <Input id="discount" name="discount" type="number" defaultValue="0" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Invoice Items</Label>
                        <div className="space-y-2">
                          {[0, 1, 2].map(index => (
                            <div key={index} className="grid grid-cols-12 gap-2">
                              <Input 
                                name={`item-${index}-description`} 
                                placeholder="Description" 
                                className="col-span-5" 
                                defaultValue={index === 0 ? "Service Description" : ""}
                              />
                              <Input 
                                name={`item-${index}-quantity`} 
                                type="number" 
                                placeholder="Qty" 
                                className="col-span-2" 
                                defaultValue={index === 0 ? "1" : ""}
                              />
                              <Input 
                                name={`item-${index}-rate`} 
                                type="number" 
                                placeholder="Rate" 
                                className="col-span-3" 
                                defaultValue={index === 0 ? "10000" : ""}
                              />
                              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                                ₹{(10 * 10000).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
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
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.client}</div>
                            <div className="text-sm text-muted-foreground">{invoice.clientEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {invoice.dueDate}
                          </div>
                        </TableCell>
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
                              onClick={() => handleDownloadInvoice(invoice)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {invoice.status !== "paid" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMarkAsPaid(invoice.id)}
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Expense Management</CardTitle>
                <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Add Expense</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="Salaries">Salaries</SelectItem>
                            <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (₹)</Label>
                          <Input id="amount" name="amount" type="number" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input id="date" name="date" type="date" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vendor">Vendor</Label>
                          <Input id="vendor" name="vendor" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentMethod">Payment Method</Label>
                          <Select name="paymentMethod" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Credit Card">Credit Card</SelectItem>
                              <SelectItem value="UPI">UPI</SelectItem>
                              <SelectItem value="Cash">Cash</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Add Expense</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.id}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(expense.status)}>
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewExpense(expense)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditExpenseClick(expense)}
                            >
                              <Edit className="h-4 w-4" />
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

          {/* Enhanced Payment Summary Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Payment Summary</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleExportData("payments")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" onClick={() => handleExportData("invoices")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export Invoices
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Paid Invoices</p>
                          <p className="text-2xl font-bold">
                            {invoices.filter(i => i.status === "paid").length}
                          </p>
                          <p className="text-sm text-primary font-semibold">
                            {formatCurrency(totalRevenue)}
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
                          <p className="text-sm text-secondary font-semibold">
                            {formatCurrency(pendingAmount)}
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-secondary" />
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
                          <p className="text-sm text-destructive font-semibold">
                            {formatCurrency(overdueAmount)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-destructive" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Expenses</p>
                          <p className="text-2xl font-bold">
                            {expenses.length}
                          </p>
                          <p className="text-sm text-destructive font-semibold">
                            {formatCurrency(totalExpenses)}
                          </p>
                        </div>
                        <Receipt className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Recent Payments</h3>
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{payment.client}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.date} • {payment.method}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Methods</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Bank Transfer</span>
                        <span className="font-semibold">60%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">UPI</span>
                        <span className="font-semibold">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Credit Card</span>
                        <span className="font-semibold">10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Other</span>
                        <span className="font-semibold">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Financial Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-4">Revenue vs Expenses</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                        <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Expense Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={expenseByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Profit Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, "Profit"]} />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Net Profit"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Invoice Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Invoice Preview - {selectedInvoice?.id}</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6 border rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">INVOICE</h2>
                    <p className="text-muted-foreground">{selectedInvoice.id}</p>
                  </div>
                  <Badge variant={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Billed To:</p>
                    <p className="font-semibold text-lg">{selectedInvoice.client}</p>
                    <p className="text-muted-foreground">{selectedInvoice.clientEmail}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invoice Date:</span>
                      <span className="font-medium">{selectedInvoice.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-medium">{selectedInvoice.dueDate}</span>
                    </div>
                    {selectedInvoice.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span className="font-medium">{selectedInvoice.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Invoice Items Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Rate (₹)</TableHead>
                        <TableHead className="text-right">Amount (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleMarkAsPaid(selectedInvoice.id)}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Mark as Paid
                    </Button>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex justify-between gap-8">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedInvoice.items.reduce((sum, item) => sum + item.amount, 0))}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>GST (18%):</span>
                      <span>{formatCurrency(selectedInvoice.tax)}</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between gap-8">
                        <span>Discount:</span>
                        <span className="text-green-600">-{formatCurrency(selectedInvoice.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-8 border-t pt-2">
                      <span className="font-bold">Total:</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(selectedInvoice.amount)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => {
                    handleDownloadInvoice(selectedInvoice);
                    setPreviewDialogOpen(false);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Invoice
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Expense View Dialog */}
        <Dialog open={expenseViewDialogOpen} onOpenChange={setExpenseViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Expense Details - {selectedExpense?.id}</DialogTitle>
            </DialogHeader>
            {selectedExpense && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Expense ID:</strong> {selectedExpense.id}</div>
                  <div><strong>Category:</strong> {selectedExpense.category}</div>
                  <div><strong>Vendor:</strong> {selectedExpense.vendor}</div>
                  <div><strong>Date:</strong> {selectedExpense.date}</div>
                  <div><strong>Payment Method:</strong> {selectedExpense.paymentMethod}</div>
                  <div><strong>Status:</strong> {selectedExpense.status}</div>
                </div>
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1">{selectedExpense.description}</p>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>{formatCurrency(selectedExpense.amount - (selectedExpense.gst || 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>{formatCurrency(selectedExpense.gst || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(selectedExpense.amount)}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Expense Edit Dialog */}
        <Dialog open={expenseEditDialogOpen} onOpenChange={setExpenseEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Expense - {selectedExpense?.id}</DialogTitle>
            </DialogHeader>
            {selectedExpense && (
              <form onSubmit={handleEditExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select name="category" defaultValue={selectedExpense.category} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Salaries">Salaries</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    name="description" 
                    defaultValue={selectedExpense.description} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-amount">Base Amount (₹)</Label>
                    <Input 
                      id="edit-amount" 
                      name="amount" 
                      type="number" 
                      defaultValue={selectedExpense.amount - (selectedExpense.gst || 0)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date</Label>
                    <Input 
                      id="edit-date" 
                      name="date" 
                      type="date" 
                      defaultValue={selectedExpense.date}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-vendor">Vendor</Label>
                    <Input 
                      id="edit-vendor" 
                      name="vendor" 
                      defaultValue={selectedExpense.vendor}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-paymentMethod">Payment Method</Label>
                    <Select name="paymentMethod" defaultValue={selectedExpense.paymentMethod} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full">Update Expense</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Billing;
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Edit, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

interface PurchaseOrder {
  id: string;
  vendor: string;
  items: string;
  amount: string;
  status: "pending" | "approved" | "delivered";
  date: string;
}

interface Workflow {
  id: string;
  name: string;
  stage: string;
  progress: number;
  assignedTo: string;
}

const ERP = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [poDialogOpen, setPoDialogOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Laptop", category: "Electronics", quantity: 50, price: "$1,200", status: "in-stock" },
    { id: "2", name: "Office Chair", category: "Furniture", quantity: 5, price: "$350", status: "low-stock" },
    { id: "3", name: "Printer", category: "Electronics", quantity: 0, price: "$450", status: "out-of-stock" },
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    { id: "PO-001", vendor: "Tech Supplies Inc", items: "Laptops x10", amount: "$12,000", status: "approved", date: "2024-01-15" },
    { id: "PO-002", vendor: "Office Depot", items: "Chairs x20", amount: "$7,000", status: "pending", date: "2024-01-16" },
  ]);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    { id: "WF-001", name: "Product Launch", stage: "Development", progress: 65, assignedTo: "Team A" },
    { id: "WF-002", name: "Warehouse Setup", stage: "Planning", progress: 30, assignedTo: "Team B" },
  ]);

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const quantity = parseInt(formData.get("quantity") as string);
    let status: Product['status'] = "in-stock";
    if (quantity === 0) status = "out-of-stock";
    else if (quantity < 10) status = "low-stock";

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      quantity,
      price: formData.get("price") as string,
      status,
    };
    setProducts(prev => [newProduct, ...prev]);
    toast.success("Product added successfully!");
    setProductDialogOpen(false);
  };

  const handleAddPO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPO: PurchaseOrder = {
      id: `PO-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`,
      vendor: formData.get("vendor") as string,
      items: formData.get("items") as string,
      amount: formData.get("amount") as string,
      status: "pending",
      date: new Date().toISOString().split('T')[0],
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    toast.success("Purchase order created!");
    setPoDialogOpen(false);
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case "in-stock": return "default";
      case "low-stock": return "secondary";
      case "out-of-stock": return "destructive";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "delivered": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="ERP Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {products.filter(p => p.status === "low-stock" || p.status === "out-of-stock").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchaseOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
            <TabsTrigger value="workflow">Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Inventory Management</CardTitle>
                <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Add Product</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Supplies">Supplies</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input id="quantity" name="quantity" type="number" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price</Label>
                          <Input id="price" name="price" placeholder="$999" required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Add Product</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell className="font-semibold">{product.price}</TableCell>
                        <TableCell>
                          <Badge variant={getStockColor(product.status)}>
                            {product.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchase">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Purchase Orders</CardTitle>
                <Dialog open={poDialogOpen} onOpenChange={setPoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Create Order</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Purchase Order</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddPO} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vendor">Vendor Name</Label>
                        <Input id="vendor" name="vendor" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="items">Items</Label>
                        <Input id="items" name="items" placeholder="e.g., Laptops x10" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" name="amount" placeholder="$12,000" required />
                      </div>
                      <Button type="submit" className="w-full">Create Order</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.id}</TableCell>
                        <TableCell>{po.vendor}</TableCell>
                        <TableCell>{po.items}</TableCell>
                        <TableCell className="font-semibold">{po.amount}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(po.status)}>{po.status}</Badge>
                        </TableCell>
                        <TableCell>{po.date}</TableCell>
                        <TableCell>
                          <Select 
                            value={po.status} 
                            onValueChange={(value) => {
                              setPurchaseOrders(prev => prev.map(p => 
                                p.id === po.id ? { ...p, status: value as PurchaseOrder['status'] } : p
                              ));
                              toast.success("Order status updated");
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Progress Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflows.map((workflow) => (
                  <Card key={workflow.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{workflow.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {workflow.stage} • Assigned to {workflow.assignedTo}
                            </p>
                          </div>
                          <Badge variant="outline">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {workflow.progress}%
                          </Badge>
                        </div>
                        <Progress value={workflow.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ERP;

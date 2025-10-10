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
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, Plus, Edit, Package, ShoppingCart, Trash2, Eye, 
  IndianRupee, Building, Users, MapPin, Download, Upload,
  UserCheck, Phone, Mail
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  costPrice: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  supplier: string;
  sku: string;
  reorderLevel: number;
}

interface PurchaseOrder {
  id: string;
  vendor: string;
  items: { productName: string; quantity: number; unitPrice: number; total: number }[];
  totalAmount: number;
  status: "draft" | "pending" | "approved" | "delivered";
  orderDate: string;
  deliveryDate: string;
}

interface Site {
  id: string;
  name: string;
  location: string;
  city: string;
  status: "active" | "inactive";
  manager: string;
  totalEmployees: number;
  contact: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  site: string;
  status: "active" | "inactive";
  salary: number;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  city: string;
  status: "active" | "inactive";
}

// Sample Data
const initialProducts: Product[] = [
  { id: "1", name: "Laptop Dell Inspiron", category: "Electronics", quantity: 50, price: 65000, costPrice: 55000, status: "in-stock", supplier: "Reliance Digital", sku: "PROD-001", reorderLevel: 10 },
  { id: "2", name: "Office Chair Executive", category: "Furniture", quantity: 5, price: 12000, costPrice: 8500, status: "low-stock", supplier: "Tata Electronics", sku: "PROD-002", reorderLevel: 8 },
  { id: "3", name: "HP Laser Printer", category: "Electronics", quantity: 0, price: 25000, costPrice: 18000, status: "out-of-stock", supplier: "Infosys Suppliers", sku: "PROD-003", reorderLevel: 5 },
];

const initialSites: Site[] = [
  { id: "SITE-001", name: "Tech Park Bangalore", location: "Whitefield", city: "Bangalore", status: "active", manager: "Rajesh Kumar", totalEmployees: 45, contact: "+91 80 2654 7890" },
  { id: "SITE-002", name: "Corporate Tower Mumbai", location: "Bandra Kurla Complex", city: "Mumbai", status: "active", manager: "Sanjay Singh", totalEmployees: 32, contact: "+91 22 2654 7891" },
];

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "Amit Patel", role: "Technician", phone: "+91 98765 43211", site: "SITE-001", status: "active", salary: 35000 },
  { id: "EMP-002", name: "Neha Gupta", role: "Quality Checker", phone: "+91 98765 43212", site: "SITE-001", status: "active", salary: 32000 },
  { id: "EMP-003", name: "Vikram Joshi", role: "Maintenance Engineer", phone: "+91 98765 43214", site: "SITE-002", status: "active", salary: 42000 },
];

const initialVendors: Vendor[] = [
  { id: "VEND-001", name: "Reliance Digital", category: "Electronics", contactPerson: "Mr. Sharma", phone: "+91 22 2654 7890", city: "Mumbai", status: "active" },
  { id: "VEND-002", name: "Tata Electronics", category: "Hardware", contactPerson: "Ms. Desai", phone: "+91 80 2654 7891", city: "Bangalore", status: "active" },
];

const initialPurchaseOrders: PurchaseOrder[] = [
  { 
    id: "PO-001", 
    vendor: "Reliance Digital", 
    items: [
      { productName: "Laptop Dell Inspiron", quantity: 10, unitPrice: 55000, total: 550000 },
      { productName: "HP Laser Printer", quantity: 5, unitPrice: 18000, total: 90000 }
    ],
    totalAmount: 640000,
    status: "approved", 
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-25"
  }
];

const ERP = () => {
  // State Management
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Dialog States
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [siteDialogOpen, setSiteDialogOpen] = useState(false);
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [poDialogOpen, setPoDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [viewEmployeesDialog, setViewEmployeesDialog] = useState<string | null>(null);

  // Utility Functions
  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "active": "default", "approved": "default", "delivered": "default", "in-stock": "default",
      "pending": "secondary", "inactive": "outline", "draft": "outline",
      "low-stock": "secondary", "out-of-stock": "destructive"
    };
    return statusColors[status] || "outline";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Product Functions
  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      quantity: parseInt(formData.get("quantity") as string),
      price: parseInt(formData.get("price") as string),
      costPrice: parseInt(formData.get("costPrice") as string),
      status: "in-stock",
      supplier: formData.get("supplier") as string,
      sku: `PROD-${(products.length + 1).toString().padStart(3, '0')}`,
      reorderLevel: parseInt(formData.get("reorderLevel") as string),
    };
    
    setProducts(prev => [newProduct, ...prev]);
    toast.success("Product added successfully!");
    setProductDialogOpen(false);
  };

  const handleEditProduct = (productId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setProducts(prev => prev.map(product => 
      product.id === productId ? {
        ...product,
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        quantity: parseInt(formData.get("quantity") as string),
        price: parseInt(formData.get("price") as string),
        costPrice: parseInt(formData.get("costPrice") as string),
        supplier: formData.get("supplier") as string,
        reorderLevel: parseInt(formData.get("reorderLevel") as string),
      } : product
    ));
    toast.success("Product updated successfully!");
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast.success("Product deleted successfully!");
  };

  // Site Functions
  const handleAddSite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newSite: Site = {
      id: `SITE-${(sites.length + 1).toString().padStart(3, '0')}`,
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      city: formData.get("city") as string,
      status: "active",
      manager: formData.get("manager") as string,
      totalEmployees: 0,
      contact: formData.get("contact") as string,
    };
    
    setSites(prev => [newSite, ...prev]);
    toast.success("Site added successfully!");
    setSiteDialogOpen(false);
  };

  // Employee Functions
  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newEmployee: Employee = {
      id: `EMP-${(employees.length + 1).toString().padStart(3, '0')}`,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      phone: formData.get("phone") as string,
      site: formData.get("site") as string,
      status: "active",
      salary: parseInt(formData.get("salary") as string),
    };
    
    setEmployees(prev => [newEmployee, ...prev]);
    
    // Update site employee count
    setSites(prev => prev.map(site => 
      site.id === newEmployee.site 
        ? { ...site, totalEmployees: site.totalEmployees + 1 }
        : site
    ));
    
    toast.success("Employee added successfully!");
    setEmployeeDialogOpen(false);
  };

  // Vendor Functions
  const handleAddVendor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newVendor: Vendor = {
      id: `VEND-${(vendors.length + 1).toString().padStart(3, '0')}`,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      contactPerson: formData.get("contactPerson") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      status: "active",
    };
    
    setVendors(prev => [newVendor, ...prev]);
    toast.success("Vendor added successfully!");
    setVendorDialogOpen(false);
  };

  // Purchase Order Functions
  const handleAddPO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPO: PurchaseOrder = {
      id: `PO-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`,
      vendor: formData.get("vendor") as string,
      items: products.filter(p => formData.get(`product-${p.id}`) === "on").map(product => ({
        productName: product.name,
        quantity: parseInt(formData.get(`quantity-${product.id}`) as string) || 1,
        unitPrice: product.costPrice,
        total: product.costPrice * (parseInt(formData.get(`quantity-${product.id}`) as string) || 1)
      })),
      totalAmount: 0, // Will be calculated
      status: "draft",
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: formData.get("deliveryDate") as string,
    };
    
    newPO.totalAmount = newPO.items.reduce((sum, item) => sum + item.total, 0);
    
    setPurchaseOrders(prev => [newPO, ...prev]);
    toast.success("Purchase order created successfully!");
    setPoDialogOpen(false);
  };

  // Import Functions
  const handleImport = (type: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Simulate CSV parsing
      toast.success(`${type} imported successfully from ${file.name}`);
      console.log(`Imported ${type} data:`, content);
    };
    reader.readAsText(file);
  };

  // Filtered Data
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const siteEmployees = (siteId: string) => 
    employees.filter(emp => emp.site === siteId);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="ERP Management System" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Products</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{products.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Sites</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-primary">{sites.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Vendors</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{vendors.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Employees</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{employees.length}</div></CardContent></Card>
        </div>

        <Tabs defaultValue="sites" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sites">Sites</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
          </TabsList>

          {/* Sites Tab */}
          <TabsContent value="sites">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Site Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button onClick={() => setSiteDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Site
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site ID</TableHead>
                      <TableHead>Site Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sites.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium">{site.id}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {site.name}
                        </TableCell>
                        <TableCell>{site.location}, {site.city}</TableCell>
                        <TableCell>{site.manager}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              <Users className="h-3 w-3 mr-1" />
                              {site.totalEmployees}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setViewEmployeesDialog(site.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEmployeeDialogOpen(true)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(site.status)}>
                            {site.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSites(prev => prev.filter(s => s.id !== site.id));
                                toast.success("Site deleted successfully!");
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
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

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Inventory Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button onClick={() => setProductDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {product.name}
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {product.quantity}
                            {product.quantity <= product.reorderLevel && (
                              <Badge variant="outline" className="text-xs">Reorder</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(product.status)}>
                            {product.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Product Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div><strong>SKU:</strong> {product.sku}</div>
                                    <div><strong>Name:</strong> {product.name}</div>
                                    <div><strong>Category:</strong> {product.category}</div>
                                    <div><strong>Quantity:</strong> {product.quantity}</div>
                                    <div><strong>Price:</strong> {formatCurrency(product.price)}</div>
                                    <div><strong>Cost Price:</strong> {formatCurrency(product.costPrice)}</div>
                                    <div><strong>Supplier:</strong> {product.supplier}</div>
                                    <div><strong>Reorder Level:</strong> {product.reorderLevel}</div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Product</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => handleEditProduct(product.id, e)} className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Product Name</Label>
                                      <Input name="name" defaultValue={product.name} required />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Category</Label>
                                      <Select name="category" defaultValue={product.category}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Electronics">Electronics</SelectItem>
                                          <SelectItem value="Furniture">Furniture</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Quantity</Label>
                                      <Input name="quantity" type="number" defaultValue={product.quantity} required />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Price</Label>
                                      <Input name="price" type="number" defaultValue={product.price} required />
                                    </div>
                                  </div>
                                  <Button type="submit" className="w-full">Update Product</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Vendor Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button onClick={() => setVendorDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vendor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor ID</TableHead>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.id}</TableCell>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell>{vendor.category}</TableCell>
                        <TableCell>{vendor.contactPerson}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {vendor.phone}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(vendor.status)}>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setVendors(prev => prev.filter(v => v.id !== vendor.id));
                                toast.success("Vendor deleted successfully!");
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
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

          {/* Purchase Orders Tab */}
          <TabsContent value="purchase">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Purchase Orders</CardTitle>
                <Button onClick={() => setPoDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </Button>
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
                      <TableHead>Order Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.id}</TableCell>
                        <TableCell>{po.vendor}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {po.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.productName} x {item.quantity}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(po.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(po.status)}>
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{po.orderDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
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
        </Tabs>

        {/* Add Site Dialog */}
        <Dialog open={siteDialogOpen} onOpenChange={setSiteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSite} className="space-y-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input name="location" required />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input name="city" required />
              </div>
              <div className="space-y-2">
                <Label>Manager</Label>
                <Input name="manager" required />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input name="contact" type="tel" required />
              </div>
              <Button type="submit" className="w-full">Add Site</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Product Dialog */}
        <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select name="category" required>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input name="quantity" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label>Reorder Level</Label>
                  <Input name="reorderLevel" type="number" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input name="price" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label>Cost Price</Label>
                  <Input name="costPrice" type="number" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Input name="supplier" required />
              </div>
              <Button type="submit" className="w-full">Add Product</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Employee Dialog */}
        <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="space-y-2">
                <Label>Employee Name</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input name="role" required />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label>Site</Label>
                <Select name="site" required>
                  <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Salary</Label>
                <Input name="salary" type="number" required />
              </div>
              <Button type="submit" className="w-full">Add Employee</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Employees Dialog */}
        <Dialog open={!!viewEmployeesDialog} onOpenChange={() => setViewEmployeesDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Employees - {sites.find(s => s.id === viewEmployeesDialog)?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {siteEmployees(viewEmployeesDialog || "").map(employee => (
                <div key={employee.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{employee.phone}</p>
                    <p className="text-sm font-semibold">{formatCurrency(employee.salary)}</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Data</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload CSV file with data
                </p>
                <Input 
                  type="file" 
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImport("Data", file);
                      setImportDialogOpen(false);
                    }
                  }}
                />
              </div>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Vendor Dialog */}
        <Dialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input name="category" required />
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input name="contactPerson" required />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input name="city" required />
              </div>
              <Button type="submit" className="w-full">Add Vendor</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Purchase Order Dialog */}
        <Dialog open={poDialogOpen} onOpenChange={setPoDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPO} className="space-y-4">
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Select name="vendor" required>
                  <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.name}>{vendor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delivery Date</Label>
                <Input name="deliveryDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label>Select Products</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center gap-2 p-2 border rounded">
                      <input 
                        type="checkbox" 
                        name={`product-${product.id}`}
                        className="rounded"
                      />
                      <span className="flex-1">{product.name}</span>
                      <Input 
                        name={`quantity-${product.id}`}
                        type="number" 
                        placeholder="Qty" 
                        className="w-20"
                        min="1"
                        defaultValue="1"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Create Purchase Order</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ERP;
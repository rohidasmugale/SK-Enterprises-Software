import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2, Phone, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  value: string;
}

interface Lead {
  id: string;
  name: string;
  source: string;
  status: "new" | "in-progress" | "closed";
  value: string;
  assignedTo: string;
}

interface Communication {
  id: string;
  clientName: string;
  type: "call" | "email" | "meeting";
  date: string;
  notes: string;
}

const CRM = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [commDialogOpen, setCommDialogOpen] = useState(false);

  const [clients, setClients] = useState<Client[]>([
    { id: "1", name: "John Smith", company: "Tech Corp", email: "john@tech.com", phone: "+1234567890", status: "active", value: "$50,000" },
    { id: "2", name: "Sarah Johnson", company: "Digital Ltd", email: "sarah@digital.com", phone: "+1234567891", status: "active", value: "$75,000" },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "Mike Wilson", source: "Website", status: "new", value: "$30,000", assignedTo: "Manager A" },
    { id: "2", name: "Emma Davis", source: "Referral", status: "in-progress", value: "$45,000", assignedTo: "Manager B" },
  ]);

  const [communications, setCommunications] = useState<Communication[]>([
    { id: "1", clientName: "John Smith", type: "call", date: "2024-01-15", notes: "Discussed project requirements" },
    { id: "2", clientName: "Sarah Johnson", type: "email", date: "2024-01-14", notes: "Sent proposal document" },
  ]);

  const handleAddClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      status: "active",
      value: formData.get("value") as string,
    };
    setClients(prev => [newClient, ...prev]);
    toast.success("Client added successfully!");
    setClientDialogOpen(false);
  };

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLead: Lead = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      source: formData.get("source") as string,
      status: "new",
      value: formData.get("value") as string,
      assignedTo: formData.get("assignedTo") as string,
    };
    setLeads(prev => [newLead, ...prev]);
    toast.success("Lead added successfully!");
    setLeadDialogOpen(false);
  };

  const handleAddCommunication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newComm: Communication = {
      id: Date.now().toString(),
      clientName: formData.get("clientName") as string,
      type: formData.get("type") as "call" | "email" | "meeting",
      date: formData.get("date") as string,
      notes: formData.get("notes") as string,
    };
    setCommunications(prev => [newComm, ...prev]);
    toast.success("Communication logged!");
    setCommDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "default";
      case "in-progress": return "secondary";
      case "closed": return "outline";
      case "active": return "default";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="CRM Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {leads.filter(l => l.status !== "closed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$175K</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{communications.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Client List</CardTitle>
                <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Add Client</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddClient} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Client Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" name="company" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="value">Expected Value</Label>
                        <Input id="value" name="value" placeholder="$50,000" required />
                      </div>
                      <Button type="submit" className="w-full">Add Client</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.company}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {client.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{client.value}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(client.status)}>{client.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                              setClients(prev => prev.filter(c => c.id !== client.id));
                              toast.success("Client deleted");
                            }}>
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

          <TabsContent value="leads">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Lead Tracker</CardTitle>
                <Dialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Add Lead</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Lead</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddLead} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="leadName">Lead Name</Label>
                        <Input id="leadName" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="source">Source</Label>
                        <Select name="source" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Cold Call">Cold Call</SelectItem>
                            <SelectItem value="Social Media">Social Media</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leadValue">Expected Value</Label>
                        <Input id="leadValue" name="value" placeholder="$30,000" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assign To</Label>
                        <Input id="assignedTo" name="assignedTo" required />
                      </div>
                      <Button type="submit" className="w-full">Add Lead</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead Name</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{lead.value}</TableCell>
                        <TableCell>{lead.assignedTo}</TableCell>
                        <TableCell>
                          <Select 
                            value={lead.status} 
                            onValueChange={(value) => {
                              setLeads(prev => prev.map(l => 
                                l.id === lead.id ? { ...l, status: value as Lead['status'] } : l
                              ));
                              toast.success("Lead status updated");
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
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

          <TabsContent value="communications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Communication Logs</CardTitle>
                <Dialog open={commDialogOpen} onOpenChange={setCommDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Log Communication</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log Communication</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddCommunication} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input id="clientName" name="clientName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select name="type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">Phone Call</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" name="notes" required />
                      </div>
                      <Button type="submit" className="w-full">Log Communication</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communications.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell className="font-medium">{comm.clientName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {comm.type === "call" && <Phone className="h-3 w-3 mr-1" />}
                            {comm.type === "email" && <Mail className="h-3 w-3 mr-1" />}
                            {comm.type === "meeting" && <Calendar className="h-3 w-3 mr-1" />}
                            {comm.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{comm.date}</TableCell>
                        <TableCell>{comm.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default CRM;

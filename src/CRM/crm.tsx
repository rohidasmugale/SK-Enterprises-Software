import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Search, Plus, Filter, Download, Mail, Phone, MessageSquare, FileText, CalendarIcon, Edit, Trash2, User, Building, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Types
interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "client" | "lost";
  value: number;
  assignedTo: string;
  createdDate: string;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  leadId: number;
  leadName: string;
}

interface Communication {
  id: number;
  leadId: number;
  leadName: string;
  type: "email" | "call" | "whatsapp" | "meeting";
  date: string;
  subject: string;
  notes: string;
  nextAction: string;
}

interface Quotation {
  id: number;
  leadId: number;
  leadName: string;
  quoteNumber: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil: string;
  services: string[];
}

interface ServiceContract {
  id: number;
  clientId: number;
  clientName: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  value: number;
  services: string[];
  sla: string;
  status: "active" | "expired" | "pending";
}

interface Campaign {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  leadsGenerated: number;
  conversionRate: number;
}

// Dummy Data
const initialLeads: Lead[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+1-555-0101",
    company: "TechCorp Inc",
    source: "Website",
    status: "qualified",
    value: 50000,
    assignedTo: "Sarah Johnson",
    createdDate: "2024-01-10",
    lastContact: "2024-01-15",
    nextFollowUp: "2024-01-20",
    notes: "Interested in enterprise solution"
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@retailco.com",
    phone: "+1-555-0102",
    company: "RetailCo",
    source: "Referral",
    status: "proposal",
    value: 35000,
    assignedTo: "Mike Chen",
    createdDate: "2024-01-12",
    lastContact: "2024-01-18",
    nextFollowUp: "2024-01-22",
    notes: "Reviewing proposal"
  },
  {
    id: 3,
    name: "Robert Kim",
    email: "r.kim@startupxyz.com",
    phone: "+1-555-0103",
    company: "StartupXYZ",
    source: "Campaign",
    status: "new",
    value: 20000,
    assignedTo: "Sarah Johnson",
    createdDate: "2024-01-14",
    lastContact: "2024-01-14",
    nextFollowUp: "2024-01-19",
    notes: "Hot lead from webinar"
  }
];

const initialContacts: Contact[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+1-555-0101",
    company: "TechCorp Inc",
    position: "CTO",
    leadId: 1,
    leadName: "John Smith"
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@retailco.com",
    phone: "+1-555-0102",
    company: "RetailCo",
    position: "Marketing Director",
    leadId: 2,
    leadName: "Maria Garcia"
  }
];

const initialCommunications: Communication[] = [
  {
    id: 1,
    leadId: 1,
    leadName: "John Smith",
    type: "call",
    date: "2024-01-15 10:30",
    subject: "Initial discovery call",
    notes: "Discussed current challenges and requirements. Very interested in our enterprise solution.",
    nextAction: "Send proposal"
  },
  {
    id: 2,
    leadId: 2,
    leadName: "Maria Garcia",
    type: "email",
    date: "2024-01-18 14:15",
    subject: "Proposal sent",
    notes: "Sent detailed proposal for marketing automation services.",
    nextAction: "Follow up in 3 days"
  }
];

const initialQuotations: Quotation[] = [
  {
    id: 1,
    leadId: 2,
    leadName: "Maria Garcia",
    quoteNumber: "QT-2024-001",
    amount: 35000,
    status: "sent",
    validUntil: "2024-02-18",
    services: ["Marketing Automation", "Analytics Dashboard", "Support"]
  },
  {
    id: 2,
    leadId: 1,
    leadName: "John Smith",
    quoteNumber: "QT-2024-002",
    amount: 50000,
    status: "draft",
    validUntil: "2024-02-20",
    services: ["Enterprise Solution", "Custom Development", "Training"]
  }
];

const initialContracts: ServiceContract[] = [
  {
    id: 1,
    clientId: 101,
    clientName: "Global Enterprises",
    contractNumber: "CN-2024-001",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    value: 120000,
    services: ["Premium Support", "Custom Development", "24/7 Monitoring"],
    sla: "Gold",
    status: "active"
  },
  {
    id: 2,
    clientId: 102,
    clientName: "Tech Solutions Ltd",
    contractNumber: "CN-2024-002",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    value: 85000,
    services: ["Standard Support", "Maintenance"],
    sla: "Silver",
    status: "pending"
  }
];

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Q1 Webinar Series",
    type: "Webinar",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    leadsGenerated: 45,
    conversionRate: 22
  },
  {
    id: 2,
    name: "Social Media Campaign",
    type: "Social Media",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    leadsGenerated: 28,
    conversionRate: 15
  }
];

const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [communications, setCommunications] = useState<Communication[]>(initialCommunications);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [contracts, setContracts] = useState<ServiceContract[]>(initialContracts);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [activeTab, setActiveTab] = useState("leads");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    value: "",
    assignedTo: "",
    notes: ""
  });
  const [newCommunication, setNewCommunication] = useState({
    leadId: "",
    type: "call" as "email" | "call" | "whatsapp" | "meeting",
    subject: "",
    notes: "",
    nextAction: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Lead Management
  const handleAddLead = () => {
    if (!newLead.name || !newLead.email) {
      toast.error("Please fill required fields");
      return;
    }

    const lead: Lead = {
      id: leads.length + 1,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      company: newLead.company,
      source: newLead.source,
      status: "new",
      value: Number(newLead.value) || 0,
      assignedTo: newLead.assignedTo,
      createdDate: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
      notes: newLead.notes
    };

    setLeads([...leads, lead]);
    setNewLead({ name: "", email: "", phone: "", company: "", source: "", value: "", assignedTo: "", notes: "" });
    setSelectedDate(undefined);
    toast.success("Lead added successfully");
  };

  const handleStatusChange = (leadId: number, newStatus: Lead["status"]) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    toast.success(`Lead status updated to ${newStatus}`);
  };

  const handleAddCommunication = () => {
    if (!newCommunication.leadId || !newCommunication.subject) {
      toast.error("Please fill required fields");
      return;
    }

    const lead = leads.find(l => l.id === Number(newCommunication.leadId));
    const communication: Communication = {
      id: communications.length + 1,
      leadId: Number(newCommunication.leadId),
      leadName: lead?.name || "",
      type: newCommunication.type,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      subject: newCommunication.subject,
      notes: newCommunication.notes,
      nextAction: newCommunication.nextAction
    };

    setCommunications([...communications, communication]);
    setNewCommunication({ leadId: "", type: "call", subject: "", notes: "", nextAction: "" });
    toast.success("Communication logged successfully");
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "new": return "secondary";
      case "contacted": return "default";
      case "qualified": return "default";
      case "proposal": return "default";
      case "negotiation": return "default";
      case "client": return "default";
      case "lost": return "destructive";
      case "draft": return "secondary";
      case "sent": return "default";
      case "accepted": return "default";
      case "rejected": return "destructive";
      case "active": return "default";
      case "expired": return "destructive";
      case "pending": return "secondary";
      default: return "outline";
    }
  };

  const getStatusVariant = (status: string) => {
    const statusMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      new: "secondary",
      contacted: "default",
      qualified: "default",
      proposal: "default",
      negotiation: "default",
      client: "default",
      lost: "destructive",
      draft: "secondary",
      sent: "default",
      accepted: "default",
      rejected: "destructive",
      active: "default",
      expired: "destructive",
      pending: "secondary"
    };
    return statusMap[status] || "outline";
  };

  const filteredLeads = leads.filter(lead =>
    (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lead.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "all" || lead.status === statusFilter)
  );

  // Analytics Data
  const leadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    clients: leads.filter(l => l.status === "client").length,
    conversionRate: Math.round((leads.filter(l => l.status === "client").length / leads.length) * 100) || 0
  };

  const pipelineValue = {
    new: leads.filter(l => l.status === "new").reduce((sum, l) => sum + l.value, 0),
    qualified: leads.filter(l => l.status === "qualified").reduce((sum, l) => sum + l.value, 0),
    proposal: leads.filter(l => l.status === "proposal").reduce((sum, l) => sum + l.value, 0),
    negotiation: leads.filter(l => l.status === "negotiation").reduce((sum, l) => sum + l.value, 0)
  };

  const upcomingRenewals = contracts.filter(contract => {
    const endDate = new Date(contract.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Lead & Customer Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
          <TabsList className="w-full justify-start flex-wrap h-auto">
            <TabsTrigger value="overview" className="flex-1 min-w-[120px]">Overview</TabsTrigger>
            <TabsTrigger value="leads" className="flex-1 min-w-[120px]">Leads</TabsTrigger>
            <TabsTrigger value="contacts" className="flex-1 min-w-[120px]">Contacts</TabsTrigger>
            <TabsTrigger value="communications" className="flex-1 min-w-[120px]">Communications</TabsTrigger>
            <TabsTrigger value="quotations" className="flex-1 min-w-[120px]">Quotations</TabsTrigger>
            <TabsTrigger value="contracts" className="flex-1 min-w-[120px]">Contracts</TabsTrigger>
            <TabsTrigger value="campaigns" className="flex-1 min-w-[120px]">Campaigns</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 min-w-[120px]">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leadStats.total}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{leadStats.new}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{leadStats.clients}</div>
                  <p className="text-xs text-muted-foreground">Converted</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{leadStats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">Lead to client</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Sales Pipeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Pipeline Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Leads</span>
                      <div className="text-right">
                        <div className="font-medium">${pipelineValue.new.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {leads.filter(l => l.status === "new").length} leads
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Qualified</span>
                      <div className="text-right">
                        <div className="font-medium">${pipelineValue.qualified.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {leads.filter(l => l.status === "qualified").length} leads
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Proposal Sent</span>
                      <div className="text-right">
                        <div className="font-medium">${pipelineValue.proposal.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {leads.filter(l => l.status === "proposal").length} leads
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Negotiation</span>
                      <div className="text-right">
                        <div className="font-medium">${pipelineValue.negotiation.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {leads.filter(l => l.status === "negotiation").length} leads
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Renewals */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Renewals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingRenewals.slice(0, 3).map((contract) => (
                      <div key={contract.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{contract.clientName}</div>
                          <div className="text-sm text-muted-foreground">
                            Ends on {contract.endDate}
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(contract.status)}>
                          ${contract.value.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                    {upcomingRenewals.length === 0 && (
                      <div className="text-center text-muted-foreground py-4">
                        No upcoming renewals
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                    <DialogDescription>
                      Enter the lead details below. The lead will be added to your pipeline.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={newLead.name}
                          onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newLead.email}
                          onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newLead.phone}
                          onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={newLead.company}
                          onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="source">Source</Label>
                        <Select value={newLead.source} onValueChange={(value) => setNewLead({...newLead, source: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="campaign">Campaign</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="value">Estimated Value</Label>
                        <Input
                          id="value"
                          type="number"
                          value={newLead.value}
                          onChange={(e) => setNewLead({...newLead, value: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Input
                        id="assignedTo"
                        value={newLead.assignedTo}
                        onChange={(e) => setNewLead({...newLead, assignedTo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextFollowUp">Next Follow-up</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newLead.notes}
                        onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddLead}>Add Lead</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lead Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Next Follow-up</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.email}</div>
                        </TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{lead.source}</Badge>
                        </TableCell>
                        <TableCell>${lead.value.toLocaleString()}</TableCell>
                        <TableCell>
                          <Select value={lead.status} onValueChange={(value: Lead["status"]) => handleStatusChange(lead.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="proposal">Proposal</SelectItem>
                              <SelectItem value="negotiation">Negotiation</SelectItem>
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{lead.lastContact}</TableCell>
                        <TableCell>{lead.nextFollowUp}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3" />
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

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Database</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Lead Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => {
                      const lead = leads.find(l => l.id === contact.leadId);
                      return (
                        <TableRow key={contact.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {contact.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {contact.company}
                            </div>
                          </TableCell>
                          <TableCell>{contact.position}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.phone}</TableCell>
                          <TableCell>
                            {lead && (
                              <Badge variant={getStatusVariant(lead.status)}>
                                {lead.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <Mail className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communications..."
                  className="pl-8"
                />
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Log Communication
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Log Communication</DialogTitle>
                    <DialogDescription>
                      Record a new communication with a lead or client.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="comm-lead">Lead/Client</Label>
                      <Select value={newCommunication.leadId} onValueChange={(value) => setNewCommunication({...newCommunication, leadId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lead" />
                        </SelectTrigger>
                        <SelectContent>
                          {leads.map(lead => (
                            <SelectItem key={lead.id} value={lead.id.toString()}>
                              {lead.name} - {lead.company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comm-type">Communication Type</Label>
                      <Select value={newCommunication.type} onValueChange={(value: "email" | "call" | "whatsapp" | "meeting") => setNewCommunication({...newCommunication, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">Phone Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comm-subject">Subject</Label>
                      <Input
                        id="comm-subject"
                        value={newCommunication.subject}
                        onChange={(e) => setNewCommunication({...newCommunication, subject: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comm-notes">Notes</Label>
                      <Textarea
                        id="comm-notes"
                        value={newCommunication.notes}
                        onChange={(e) => setNewCommunication({...newCommunication, notes: e.target.value})}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comm-next">Next Action</Label>
                      <Input
                        id="comm-next"
                        value={newCommunication.nextAction}
                        onChange={(e) => setNewCommunication({...newCommunication, nextAction: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddCommunication}>Log Communication</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communications.map((comm) => (
                    <div key={comm.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full ${
                        comm.type === 'email' ? 'bg-blue-100' :
                        comm.type === 'call' ? 'bg-green-100' :
                        comm.type === 'whatsapp' ? 'bg-green-50' : 'bg-purple-100'
                      }`}>
                        {comm.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                        {comm.type === 'call' && <Phone className="h-4 w-4 text-green-600" />}
                        {comm.type === 'whatsapp' && <MessageSquare className="h-4 w-4 text-green-600" />}
                        {comm.type === 'meeting' && <CalendarIcon className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{comm.leadName}</div>
                          <div className="text-sm text-muted-foreground">{comm.date}</div>
                        </div>
                        <div className="font-semibold mt-1">{comm.subject}</div>
                        <p className="text-sm text-muted-foreground mt-1">{comm.notes}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3" />
                          <span className="text-sm">Next: {comm.nextAction}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotations Tab */}
          <TabsContent value="quotations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quotations & Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote Number</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotations.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                        <TableCell>{quote.leadName}</TableCell>
                        <TableCell>${quote.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {quote.services.slice(0, 2).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {quote.services.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{quote.services.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{quote.validUntil}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(quote.status)}>
                            {quote.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
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

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Contracts & SLA Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract Number</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>SLA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                        <TableCell>{contract.clientName}</TableCell>
                        <TableCell>{contract.startDate}</TableCell>
                        <TableCell>{contract.endDate}</TableCell>
                        <TableCell>${contract.value.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{contract.sla}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(contract.status)}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
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

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Leads Generated</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{campaign.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {campaign.startDate} to {campaign.endDate}
                        </TableCell>
                        <TableCell>{campaign.leadsGenerated}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${campaign.conversionRate}%` }}
                              />
                            </div>
                            {campaign.conversionRate}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            new Date(campaign.endDate) > new Date() ? "default" : "secondary"
                          }>
                            {new Date(campaign.endDate) > new Date() ? "Active" : "Completed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Sales & Marketing Reports</h2>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Sales Pipeline Report */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Pipeline Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { stage: "New Leads", count: leads.filter(l => l.status === "new").length, value: pipelineValue.new },
                      { stage: "Contacted", count: leads.filter(l => l.status === "contacted").length, value: 0 },
                      { stage: "Qualified", count: leads.filter(l => l.status === "qualified").length, value: pipelineValue.qualified },
                      { stage: "Proposal", count: leads.filter(l => l.status === "proposal").length, value: pipelineValue.proposal },
                      { stage: "Negotiation", count: leads.filter(l => l.status === "negotiation").length, value: pipelineValue.negotiation },
                      { stage: "Client", count: leads.filter(l => l.status === "client").length, value: 0 }
                    ].map((stage, index) => (
                      <div key={stage.stage} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-yellow-500' :
                            index === 3 ? 'bg-orange-500' :
                            index === 4 ? 'bg-purple-500' : 'bg-green-600'
                          }`} />
                          <span className="text-sm">{stage.stage}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{stage.count} leads</div>
                          {stage.value > 0 && (
                            <div className="text-xs text-muted-foreground">
                              ${stage.value.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Rates */}
              <Card>
                <CardHeader>
                  <CardTitle>Lead Conversion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>New to Contacted</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contacted to Qualified</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Qualified to Proposal</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proposal to Client</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Overall Conversion</span>
                      <span className="font-semibold text-primary">{leadStats.conversionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Engagement History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {communications.slice(0, 5).map((comm) => (
                      <div key={comm.id} className="flex justify-between items-center text-sm">
                        <div>
                          <div className="font-medium">{comm.leadName}</div>
                          <div className="text-muted-foreground">{comm.type} - {comm.subject}</div>
                        </div>
                        <div className="text-right">
                          <div>{comm.date.split(' ')[0]}</div>
                          <Badge variant="outline" className="text-xs">
                            {comm.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign-to-Sale Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{campaign.leadsGenerated} leads</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.conversionRate}% conversion
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default LeadManagement;
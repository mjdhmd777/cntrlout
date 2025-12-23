import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock,
  CreditCard,
  Shield,
  LogOut,
  RefreshCw
} from "lucide-react";

interface Application {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  primary_skill?: string;
  company_name?: string;
}

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [freelancerApps, setFreelancerApps] = useState<Application[]>([]);
  const [clientApps, setClientApps] = useState<Application[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [freelancerRes, clientRes, paymentRes] = await Promise.all([
        supabase.from("freelancer_applications").select("*").order("created_at", { ascending: false }),
        supabase.from("client_applications").select("*").order("created_at", { ascending: false }),
        supabase.from("freelancer_payments").select("*").order("created_at", { ascending: false }),
      ]);

      if (freelancerRes.data) setFreelancerApps(freelancerRes.data);
      if (clientRes.data) setClientApps(clientRes.data);
      if (paymentRes.data) setPayments(paymentRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (
    type: "freelancer" | "client",
    userId: string,
    action: "approved" | "rejected" | "suspended"
  ) => {
    setActionLoading(userId);
    try {
      const table = type === "freelancer" ? "freelancer_applications" : "client_applications";
      
      const { error } = await supabase
        .from(table)
        .update({ 
          status: action,
          reviewed_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Application has been ${action}.`,
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="gap-1"><Clock size={12} /> Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="gap-1"><CheckCircle2 size={12} /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle size={12} /> Rejected</Badge>;
      case "suspended":
        return <Badge variant="secondary" className="gap-1"><Shield size={12} /> Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingFreelancers = freelancerApps.filter((a) => a.status === "pending").length;
  const pendingClients = clientApps.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <Badge variant="secondary" className="gap-1">
              <Shield size={12} />
              Admin Panel
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchData}>
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Freelancers</p>
                  <p className="text-2xl font-bold text-foreground">{pendingFreelancers}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Clients</p>
                  <p className="text-2xl font-bold text-foreground">{pendingClients}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Freelancers</p>
                  <p className="text-2xl font-bold text-foreground">{freelancerApps.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <Briefcase className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Payments Received</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{payments.filter((p) => p.payment_status === "completed").length * 99}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>User Applications</CardTitle>
            <CardDescription>Review and manage user applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="freelancers">
              <TabsList className="mb-4">
                <TabsTrigger value="freelancers" className="gap-2">
                  <Briefcase size={16} />
                  Freelancers ({freelancerApps.length})
                </TabsTrigger>
                <TabsTrigger value="clients" className="gap-2">
                  <Users size={16} />
                  Clients ({clientApps.length})
                </TabsTrigger>
                <TabsTrigger value="payments" className="gap-2">
                  <CreditCard size={16} />
                  Payments ({payments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="freelancers">
                {freelancerApps.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No freelancer applications yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Primary Skill</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {freelancerApps.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.full_name}</TableCell>
                            <TableCell>{app.email}</TableCell>
                            <TableCell>{app.primary_skill || "—"}</TableCell>
                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                            <TableCell>
                              {new Date(app.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {app.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleAction("freelancer", app.user_id, "approved")}
                                      disabled={actionLoading === app.user_id}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleAction("freelancer", app.user_id, "rejected")}
                                      disabled={actionLoading === app.user_id}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {app.status === "approved" && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleAction("freelancer", app.user_id, "suspended")}
                                    disabled={actionLoading === app.user_id}
                                  >
                                    Suspend
                                  </Button>
                                )}
                                {(app.status === "rejected" || app.status === "suspended") && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleAction("freelancer", app.user_id, "approved")}
                                    disabled={actionLoading === app.user_id}
                                  >
                                    Reactivate
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="clients">
                {clientApps.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No client applications yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientApps.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.full_name}</TableCell>
                            <TableCell>{app.email}</TableCell>
                            <TableCell>{app.company_name || "—"}</TableCell>
                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                            <TableCell>
                              {new Date(app.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {app.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleAction("client", app.user_id, "approved")}
                                      disabled={actionLoading === app.user_id}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleAction("client", app.user_id, "rejected")}
                                      disabled={actionLoading === app.user_id}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {app.status === "approved" && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleAction("client", app.user_id, "suspended")}
                                    disabled={actionLoading === app.user_id}
                                  >
                                    Suspend
                                  </Button>
                                )}
                                {(app.status === "rejected" || app.status === "suspended") && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleAction("client", app.user_id, "approved")}
                                    disabled={actionLoading === app.user_id}
                                  >
                                    Reactivate
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="payments">
                {payments.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No payments recorded yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment ID</TableHead>
                          <TableHead>Paid At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-mono text-xs">
                              {payment.user_id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>₹{payment.amount}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  payment.payment_status === "completed" ? "default" : "outline"
                                }
                              >
                                {payment.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {payment.payment_id || "—"}
                            </TableCell>
                            <TableCell>
                              {payment.paid_at
                                ? new Date(payment.paid_at).toLocaleDateString()
                                : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;

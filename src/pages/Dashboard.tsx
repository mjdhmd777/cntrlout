import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import PendingApproval from "@/components/dashboard/PendingApproval";
import PaymentRequired from "@/components/dashboard/PaymentRequired";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, status, hasPaid, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // If user has no role/status, redirect to onboarding
    if (!roleLoading && user && !status && role !== "admin") {
      navigate("/onboarding");
    }
  }, [status, role, roleLoading, user, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Admin dashboard
  if (role === "admin") {
    return <AdminDashboard />;
  }

  // Pending approval
  if (status === "pending") {
    return <PendingApproval role={role} />;
  }

  // Rejected
  if (status === "rejected") {
    return <PendingApproval role={role} isRejected />;
  }

  // Suspended
  if (status === "suspended") {
    return <PendingApproval role={role} isSuspended />;
  }

  // Freelancer needs to pay
  if (role === "freelancer" && status === "approved" && !hasPaid) {
    return <PaymentRequired />;
  }

  // Approved and paid (or client)
  if (role === "freelancer") {
    return <FreelancerDashboard />;
  }

  if (role === "client") {
    return <ClientDashboard />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Dashboard;

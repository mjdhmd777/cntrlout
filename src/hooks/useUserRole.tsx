import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type AppRole = "admin" | "freelancer" | "client" | null;
type UserStatus = "pending" | "approved" | "rejected" | "suspended" | null;

interface UseUserRoleReturn {
  role: AppRole;
  status: UserStatus;
  hasPaid: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const useUserRole = (): UseUserRoleReturn => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole>(null);
  const [status, setStatus] = useState<UserStatus>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!user) {
      setRole(null);
      setStatus(null);
      setHasPaid(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Fetch user role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleData) {
        setRole(roleData.role as AppRole);
      }

      // Check application status based on role
      if (roleData?.role === "freelancer") {
        const { data: appData } = await supabase
          .from("freelancer_applications")
          .select("status")
          .eq("user_id", user.id)
          .maybeSingle();
        
        setStatus(appData?.status as UserStatus || null);

        // Check payment status
        const { data: paymentData } = await supabase
          .from("freelancer_payments")
          .select("payment_status")
          .eq("user_id", user.id)
          .maybeSingle();
        
        setHasPaid(paymentData?.payment_status === "completed");
      } else if (roleData?.role === "client") {
        const { data: appData } = await supabase
          .from("client_applications")
          .select("status")
          .eq("user_id", user.id)
          .maybeSingle();
        
        setStatus(appData?.status as UserStatus || null);
        setHasPaid(true); // Clients don't need to pay
      } else if (roleData?.role === "admin") {
        setStatus("approved");
        setHasPaid(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return { role, status, hasPaid, loading, refetch: fetchUserData };
};

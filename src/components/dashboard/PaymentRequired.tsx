import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentRequired = () => {
  const { user } = useAuth();
  const { refetch } = useUserRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // For demo purposes, we'll simulate a successful payment
      // In production, integrate with Razorpay or Stripe
      
      const { error } = await supabase.from("freelancer_payments").upsert({
        user_id: user!.id,
        amount: 99,
        currency: "INR",
        payment_status: "completed",
        payment_id: `demo_${Date.now()}`,
        payment_method: "demo",
        paid_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Payment successful!",
        description: "Welcome to CnTrL Out. Your lifetime access is now active.",
      });

      await refetch();
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">You're Approved!</CardTitle>
          <CardDescription>
            Complete your one-time payment to activate your lifetime access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-accent/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">Lifetime Access</p>
            <p className="mt-1 text-4xl font-bold text-foreground">₹99</p>
            <p className="mt-1 text-sm text-muted-foreground">one-time payment</p>
          </div>

          <ul className="space-y-3">
            {[
              "Complete access to all platform features",
              "Create your public freelancer profile",
              "Apply to unlimited projects",
              "Zero commissions on earnings",
              "No recurring fees ever",
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <Button className="w-full gap-2" size="lg" onClick={handlePayment} disabled={loading}>
            <CreditCard size={18} />
            {loading ? "Processing..." : "Complete Payment"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Secure payment powered by industry-standard encryption
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRequired;

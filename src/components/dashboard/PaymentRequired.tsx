import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    email: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: () => void) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const PaymentRequired = () => {
  const { user, session } = useAuth();
  const { refetch } = useUserRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load payment gateway. Please refresh the page.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast({
        title: "Please wait",
        description: "Payment gateway is loading...",
      });
      return;
    }

    setLoading(true);

    try {
      // Create order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CnTrL Out",
        description: "Freelancer Lifetime Access",
        order_id: orderData.order_id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment via edge function
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                headers: {
                  Authorization: `Bearer ${session?.access_token}`,
                },
              }
            );

            if (verifyError || !verifyData?.success) {
              throw new Error(verifyError?.message || "Payment verification failed");
            }

            toast({
              title: "Payment successful!",
              description: "Welcome to CnTrL Out. Your lifetime access is now active.",
            });

            await refetch();
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Payment verification failed";
            toast({
              title: "Verification failed",
              description: message,
              variant: "destructive",
            });
          }
        },
        prefill: {
          email: user?.email || "",
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => {
        toast({
          title: "Payment failed",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      });
      razorpay.open();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Payment failed";
      toast({
        title: "Payment failed",
        description: message,
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

          <Button 
            className="w-full gap-2" 
            size="lg" 
            onClick={handlePayment} 
            disabled={loading || !scriptLoaded}
          >
            <CreditCard size={18} />
            {loading ? "Processing..." : !scriptLoaded ? "Loading..." : "Complete Payment"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Secure payment powered by Razorpay
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRequired;

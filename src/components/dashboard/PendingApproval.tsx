import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, XCircle, Ban, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

interface PendingApprovalProps {
  role: "freelancer" | "client" | null;
  isRejected?: boolean;
  isSuspended?: boolean;
}

const PendingApproval = ({ role, isRejected, isSuspended }: PendingApprovalProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          {isSuspended ? (
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <Ban className="h-8 w-8 text-destructive" />
            </div>
          ) : isRejected ? (
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          ) : (
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-8 w-8 text-primary" />
            </div>
          )}
          <CardTitle className="text-2xl">
            {isSuspended
              ? "Account Suspended"
              : isRejected
              ? "Application Rejected"
              : "Application Under Review"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSuspended ? (
            <p className="text-muted-foreground">
              Your account has been suspended. If you believe this is an error, please contact
              support at{" "}
              <a href="mailto:support@cntrlout.com" className="text-primary hover:underline">
                support@cntrlout.com
              </a>
            </p>
          ) : isRejected ? (
            <p className="text-muted-foreground">
              Unfortunately, your application has been rejected. This could be due to incomplete
              information or not meeting our requirements. Please contact support for more details.
            </p>
          ) : (
            <>
              <p className="text-muted-foreground">
                Thank you for applying as a {role === "freelancer" ? "freelancer" : "client"}!
              </p>
              <p className="text-muted-foreground">
                Our team is reviewing your application. This typically takes 24-48 hours. We'll
                notify you via email once a decision has been made.
              </p>
              {role === "freelancer" && (
                <div className="rounded-lg bg-accent/50 p-4 text-sm">
                  <p className="font-medium text-foreground">What happens next?</p>
                  <p className="mt-1 text-muted-foreground">
                    Once approved, you'll be prompted to complete a one-time ₹99 payment to
                    activate your lifetime access.
                  </p>
                </div>
              )}
            </>
          )}

          <Link to="/">
            <Button variant="outline" className="mt-4 gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;

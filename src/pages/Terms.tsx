import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background py-16">
        <div className="container max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold text-foreground">Terms & Conditions</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using CnTrL Out, you accept and agree to be bound by these Terms and 
              Conditions. If you do not agree to these terms, please do not use our platform.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">2. Platform Description</h2>
            <p className="text-muted-foreground">
              CnTrL Out is a freelancing ecosystem that connects freelancers with clients. We provide 
              a platform for discovery and connection, but do not act as an intermediary in any 
              transactions between users.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">3. User Registration</h2>
            <p className="text-muted-foreground">
              All users must register and be approved by our admin team before gaining access to 
              platform features. We reserve the right to reject or suspend any user at our discretion.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">4. Freelancer Fees</h2>
            <p className="text-muted-foreground">
              Freelancers are required to pay a one-time lifetime access fee of ₹99 after approval. 
              This fee is non-refundable and grants permanent access to all freelancer features.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">5. No Commissions</h2>
            <p className="text-muted-foreground">
              CnTrL Out does not charge any commissions on work completed through the platform. 
              All negotiations and payments between freelancers and clients are conducted independently.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">6. User Conduct</h2>
            <p className="text-muted-foreground">
              Users agree to conduct themselves professionally and not engage in any fraudulent, 
              misleading, or harmful behavior. Violation of these standards may result in account 
              suspension or termination.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              CnTrL Out is provided "as is" without any warranties. We are not responsible for any 
              disputes, losses, or damages arising from interactions between users on our platform.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">8. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@cntrlout.com" className="text-primary hover:underline">
                legal@cntrlout.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  Shield, 
  Zap,
  Sparkles,
  Clock
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-accent/20 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles size={16} />
              No commissions. No platform fees. Ever.
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Take control of your{" "}
              <span className="text-primary">freelance career</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              cntrlout is a curated freelancing ecosystem where talent meets opportunity 
              without the burden of platform fees. Join a movement of independent professionals.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth?mode=signup&role=freelancer">
                <Button size="lg" className="gap-2">
                  Join as Freelancer
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/auth?mode=signup&role=client">
                <Button size="lg" variant="outline" className="gap-2">
                  Hire Talent
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              ₹99 one-time lifetime access for freelancers • Free for clients
            </p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              How cntrlout Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A simple, transparent process designed to connect talent with opportunity
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Freelancer Flow */}
            <Card className="border-2 border-border bg-card">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">For Freelancers</h3>
                </div>
                <ol className="space-y-4">
                  {[
                    "Sign up and complete your profile",
                    "Submit your application for review",
                    "Get approved by our team",
                    "Pay ₹99 one-time for lifetime access",
                    "Start connecting with clients",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Client Flow */}
            <Card className="border-2 border-border bg-card">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Users size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">For Clients</h3>
                </div>
                <ol className="space-y-4">
                  {[
                    "Create your free account",
                    "Complete a brief onboarding form",
                    "Get approved by our team",
                    "Browse verified freelancers",
                    "Connect directly — no fees",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-semibold text-secondary">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why cntrlout */}
      <section className="bg-accent/30 py-20 md:py-28">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Why Choose cntrlout
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Built for professionals who value transparency, quality, and independence
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CheckCircle2,
                title: "Zero Commissions",
                description: "Keep 100% of what you earn. No hidden fees, ever.",
              },
              {
                icon: Shield,
                title: "Curated Community",
                description: "Every member is verified and approved by our team.",
              },
              {
                icon: Zap,
                title: "Lifetime Access",
                description: "One payment, permanent membership. No subscriptions.",
              },
              {
                icon: Clock,
                title: "Direct Connection",
                description: "Connect with clients or talent without intermediaries.",
              },
            ].map((feature, index) => (
              <Card key={index} className="border border-border bg-card transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lifetime Access CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80">
            <CardContent className="flex flex-col items-center p-12 text-center md:p-16">
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                Lifetime Access for ₹99
              </h2>
              <p className="mb-8 max-w-xl text-lg text-primary-foreground/90">
                One-time payment. No recurring charges. No commissions. 
                Join thousands of freelancers who have taken control.
              </p>
              <Link to="/auth?mode=signup&role=freelancer">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started Now
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

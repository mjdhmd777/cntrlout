import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { Loader2 } from "lucide-react";

const skillCategories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Video Production",
  "Data Science",
  "DevOps",
  "Consulting",
  "Other",
];

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "intermediate", label: "Intermediate (2-5 years)" },
  { value: "expert", label: "Expert (5+ years)" },
];

const timezones = [
  "IST (UTC+5:30)",
  "PST (UTC-8)",
  "EST (UTC-5)",
  "GMT (UTC+0)",
  "CET (UTC+1)",
  "AEST (UTC+10)",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, status, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Freelancer form
  const [freelancerForm, setFreelancerForm] = useState({
    fullName: "",
    email: "",
    country: "",
    timezone: "",
    primarySkill: "",
    secondarySkills: "",
    experienceLevel: "entry",
    portfolioLinks: "",
    bio: "",
    availability: "",
    pricingPreference: "both",
    agreedToTerms: false,
  });

  // Client form
  const [clientForm, setClientForm] = useState({
    fullName: "",
    email: "",
    companyName: "",
    companyWebsite: "",
    industry: "",
    description: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && status) {
      // Already submitted application
      navigate("/dashboard");
    }
  }, [status, roleLoading, navigate]);

  useEffect(() => {
    if (user) {
      if (role === "freelancer") {
        setFreelancerForm((prev) => ({ ...prev, email: user.email || "" }));
      } else {
        setClientForm((prev) => ({ ...prev, email: user.email || "" }));
      }
    }
  }, [user, role]);

  const handleFreelancerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!freelancerForm.agreedToTerms) {
      toast({
        title: "Agreement required",
        description: "Please agree to the platform rules to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const secondarySkillsArray = freelancerForm.secondarySkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const portfolioLinksArray = freelancerForm.portfolioLinks
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const { error } = await supabase.from("freelancer_applications").insert({
        user_id: user!.id,
        full_name: freelancerForm.fullName,
        email: freelancerForm.email,
        country: freelancerForm.country,
        timezone: freelancerForm.timezone,
        primary_skill: freelancerForm.primarySkill,
        secondary_skills: secondarySkillsArray,
        experience_level: freelancerForm.experienceLevel as "entry" | "intermediate" | "expert",
        portfolio_links: portfolioLinksArray,
        bio: freelancerForm.bio,
        availability: freelancerForm.availability,
        pricing_preference: freelancerForm.pricingPreference as "hourly" | "fixed" | "both",
        agreed_to_terms: freelancerForm.agreedToTerms,
      });

      if (error) throw error;

      // Update profile
      await supabase
        .from("profiles")
        .update({ full_name: freelancerForm.fullName })
        .eq("user_id", user!.id);

      toast({
        title: "Application submitted",
        description: "Your application is now under review.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("client_applications").insert({
        user_id: user!.id,
        full_name: clientForm.fullName,
        email: clientForm.email,
        company_name: clientForm.companyName || null,
        company_website: clientForm.companyWebsite || null,
        industry: clientForm.industry || null,
        description: clientForm.description || null,
      });

      if (error) throw error;

      // Update profile
      await supabase
        .from("profiles")
        .update({ full_name: clientForm.fullName })
        .eq("user_id", user!.id);

      toast({
        title: "Application submitted",
        description: "Your application is now under review.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <div className="mb-8 text-center">
          <Logo size="lg" className="justify-center" />
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Complete Your {role === "freelancer" ? "Freelancer" : "Client"} Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about yourself so we can verify your application
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              All fields marked with * are required
            </CardDescription>
          </CardHeader>
          <CardContent>
            {role === "freelancer" ? (
              <form onSubmit={handleFreelancerSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={freelancerForm.fullName}
                      onChange={(e) =>
                        setFreelancerForm({ ...freelancerForm, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={freelancerForm.email}
                      onChange={(e) =>
                        setFreelancerForm({ ...freelancerForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={freelancerForm.country}
                      onChange={(e) =>
                        setFreelancerForm({ ...freelancerForm, country: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone *</Label>
                    <Select
                      value={freelancerForm.timezone}
                      onValueChange={(value) =>
                        setFreelancerForm({ ...freelancerForm, timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primarySkill">Primary Skill *</Label>
                    <Select
                      value={freelancerForm.primarySkill}
                      onValueChange={(value) =>
                        setFreelancerForm({ ...freelancerForm, primarySkill: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillCategories.map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Experience Level *</Label>
                    <Select
                      value={freelancerForm.experienceLevel}
                      onValueChange={(value) =>
                        setFreelancerForm({ ...freelancerForm, experienceLevel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondarySkills">Secondary Skills</Label>
                  <Input
                    id="secondarySkills"
                    placeholder="React, Node.js, TypeScript (comma-separated)"
                    value={freelancerForm.secondarySkills}
                    onChange={(e) =>
                      setFreelancerForm({ ...freelancerForm, secondarySkills: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioLinks">Portfolio Links</Label>
                  <Input
                    id="portfolioLinks"
                    placeholder="https://portfolio.com, https://github.com/... (comma-separated)"
                    value={freelancerForm.portfolioLinks}
                    onChange={(e) =>
                      setFreelancerForm({ ...freelancerForm, portfolioLinks: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your experience and expertise..."
                    value={freelancerForm.bio}
                    onChange={(e) =>
                      setFreelancerForm({ ...freelancerForm, bio: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Input
                      id="availability"
                      placeholder="e.g., Full-time, 20hrs/week"
                      value={freelancerForm.availability}
                      onChange={(e) =>
                        setFreelancerForm({ ...freelancerForm, availability: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricingPreference">Pricing Preference *</Label>
                    <Select
                      value={freelancerForm.pricingPreference}
                      onValueChange={(value) =>
                        setFreelancerForm({ ...freelancerForm, pricingPreference: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={freelancerForm.agreedToTerms}
                    onCheckedChange={(checked) =>
                      setFreelancerForm({ ...freelancerForm, agreedToTerms: !!checked })
                    }
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the platform rules and understand that my application will be
                    reviewed before approval. I acknowledge that a one-time payment of ₹99 will
                    be required after approval. *
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleClientSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={clientForm.fullName}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientForm.email}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={clientForm.companyName}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, companyName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input
                      id="companyWebsite"
                      type="url"
                      placeholder="https://"
                      value={clientForm.companyWebsite}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, companyWebsite: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, Healthcare, Finance"
                    value={clientForm.industry}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, industry: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">What are you looking to accomplish?</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the type of projects or talent you're looking for..."
                    value={clientForm.description}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;

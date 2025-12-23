import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Users, 
  FolderOpen, 
  Plus, 
  Search,
  Bookmark,
  Clock,
  CheckCircle2
} from "lucide-react";

const ClientDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Client Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Find and connect with talented freelancers.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit gap-2">
              <CheckCircle2 size={14} />
              Free Access
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active Projects", value: "0", icon: FolderOpen },
              { label: "Total Projects", value: "0", icon: FolderOpen },
              { label: "Saved Freelancers", value: "0", icon: Bookmark },
              { label: "Freelancers Hired", value: "0", icon: Users },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
                      <stat.icon className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Post a Project */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Post your first project or browse our talent pool
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-2 border-dashed border-border bg-card/50 transition-colors hover:border-primary/50">
                    <CardContent className="flex flex-col items-center p-8 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Plus className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">Post a Project</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Describe your project and find the right freelancer
                      </p>
                      <Button>Create Project</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed border-border bg-card/50 transition-colors hover:border-primary/50">
                    <CardContent className="flex flex-col items-center p-8 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20">
                        <Search className="h-7 w-7 text-secondary" />
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">Browse Talent</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Explore verified freelancers and their portfolios
                      </p>
                      <Button variant="secondary">Browse Freelancers</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6 text-center">
                    <FolderOpen className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No projects yet. Create your first project to get started!
                    </p>
                    <Button variant="link" className="mt-2">
                      <Plus size={14} className="mr-1" />
                      New Project
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Saved Freelancers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6 text-center">
                    <Bookmark className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Save freelancers you're interested in for quick access later.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientDashboard;

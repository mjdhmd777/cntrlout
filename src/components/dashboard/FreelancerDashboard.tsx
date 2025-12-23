import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Briefcase, 
  Star, 
  FolderOpen, 
  Settings, 
  CheckCircle2,
  TrendingUp,
  Clock,
  ExternalLink
} from "lucide-react";

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Freelancer Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Welcome back! Manage your profile and find opportunities.
              </p>
            </div>
            <Badge variant="default" className="w-fit gap-2">
              <CheckCircle2 size={14} />
              Lifetime Access Active
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Profile Views", value: "0", icon: TrendingUp, change: "+0% this week" },
              { label: "Applications Sent", value: "0", icon: Briefcase, change: "0 pending" },
              { label: "Projects Completed", value: "0", icon: FolderOpen, change: "Keep going!" },
              { label: "Average Rating", value: "—", icon: Star, change: "No reviews yet" },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                  A complete profile helps you get discovered by clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Add a profile photo", completed: false },
                    { label: "Write a compelling bio", completed: true },
                    { label: "Add portfolio projects", completed: false },
                    { label: "Set your hourly rate", completed: false },
                    { label: "Add work experience", completed: false },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            item.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <span className="text-sm">{index + 1}</span>
                          )}
                        </div>
                        <span
                          className={
                            item.completed
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }
                        >
                          {item.label}
                        </span>
                      </div>
                      {!item.completed && (
                        <Button variant="ghost" size="sm">
                          Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Settings size={16} />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FolderOpen size={16} />
                    Manage Portfolio
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Briefcase size={16} />
                    Browse Projects
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ExternalLink size={16} />
                    View Public Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6 text-center">
                    <Clock className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No recent activity yet. Start by completing your profile!
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

export default FreelancerDashboard;

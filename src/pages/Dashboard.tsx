import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import RecentActivitiesPanel from "@/components/dashboard/RecentActivitiesPanel";
import FeatureCards from "@/components/dashboard/FeatureCards";
import {
  Bell,
  Settings,
  Search,
  Loader2,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { fetchUserProfile, fetchHealthStats } from "@/lib/api";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [healthStats, setHealthStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const profileData = await fetchUserProfile();
        const healthStatsData = await fetchHealthStats();

        setProfile(
          profileData || {
            name:
              user?.user_metadata?.name || user?.email?.split("@")[0] || "User",
          },
        );

        setHealthStats(
          healthStatsData || {
            last_checkup: "2023-05-15",
            blood_pressure: "120/80 mmHg",
            heart_rate: 72,
            weight: 68,
          },
        );
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserData();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not recorded";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Dashboard | Medgen AI</title>
      </Helmet>

      {/* Header */}
      <header className="apple-nav sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/vite.svg" alt="Medgen AI Logo" className="h-8 w-8" />
            <h1 className="text-xl font-semibold">Medgen AI</h1>
          </div>

          <div className="hidden md:flex items-center w-1/3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-full pl-10 bg-secondary/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar with Stats */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Stats */}
            <div className="apple-card bg-white p-6">
              <h3 className="font-semibold mb-4">Health Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Last Check-up
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(healthStats?.last_checkup)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Blood Pressure
                  </span>
                  <span className="text-sm font-medium">
                    {healthStats?.blood_pressure || "Not recorded"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Heart Rate
                  </span>
                  <span className="text-sm font-medium">
                    {healthStats?.heart_rate
                      ? `${healthStats.heart_rate} bpm`
                      : "Not recorded"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Weight</span>
                  <span className="text-sm font-medium">
                    {healthStats?.weight
                      ? `${healthStats.weight} kg`
                      : "Not recorded"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {/* Welcome Banner */}
            <div className="apple-card bg-black rounded-3xl p-8 text-white">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-semibold mb-3">
                  Welcome back, {profile?.name}
                </h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Your health assistant is ready to help you today.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    className="apple-button bg-white text-black hover:bg-white/90"
                    onClick={() => navigate("/diagnosis")}
                  >
                    Start New Diagnosis
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="apple-button border-white text-white hover:bg-white/10"
                    onClick={() => navigate("/reports")}
                  >
                    View Health Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="apple-card bg-white p-6">
              <RecentActivitiesPanel
                title="Recent Medical Activities"
                maxItems={5}
              />
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Medical Tools</h2>
          <FeatureCards />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Medgen AI. All rights
                reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-black"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-black"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-black"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

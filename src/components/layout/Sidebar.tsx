import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  MessageSquare,
  Search,
  Image,
  BarChart,
  Pill,
  Settings,
  FileText,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ to, icon, label, active = false }: SidebarLinkProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 mb-1 py-6",
          active
            ? "bg-black text-white"
            : "text-muted-foreground hover:text-black",
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-[280px] h-full min-h-screen bg-white border-r flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Medgen AI</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered medical assistant
        </p>
      </div>

      {user && (
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  user.user_metadata?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                }
              />
              <AvatarFallback className="bg-black text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {user.user_metadata?.name || user.email}
              </p>
              <p className="text-xs text-muted-foreground">Medical Patient</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <SidebarLink
            to="/dashboard"
            icon={<Home size={20} />}
            label="Dashboard"
            active={currentPath === "/dashboard"}
          />
          <SidebarLink
            to="/chatbot"
            icon={<MessageSquare size={20} />}
            label="AI Chatbot"
            active={currentPath === "/chatbot"}
          />
          <SidebarLink
            to="/diagnosis"
            icon={<Search size={20} />}
            label="Disease Diagnosis"
            active={currentPath === "/diagnosis"}
          />
          <SidebarLink
            to="/image-analysis"
            icon={<Image size={20} />}
            label="Image Analysis"
            active={currentPath === "/image-analysis"}
          />
          <SidebarLink
            to="/dataset-generation"
            icon={<BarChart size={20} />}
            label="Dataset Generation"
            active={currentPath === "/dataset-generation"}
          />
          <SidebarLink
            to="/drug-discovery"
            icon={<Pill size={20} />}
            label="Drug Discovery"
            active={currentPath === "/drug-discovery"}
          />
          <SidebarLink
            to="/reports"
            icon={<FileText size={20} />}
            label="Health Reports"
            active={currentPath === "/reports"}
          />
        </nav>
      </div>

      <div className="mt-auto px-3 py-6 border-t">
        <SidebarLink
          to="/settings"
          icon={<Settings size={20} />}
          label="Settings"
          active={currentPath === "/settings"}
        />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-black py-6"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

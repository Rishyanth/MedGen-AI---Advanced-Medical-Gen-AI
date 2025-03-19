import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";

const MainNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Don't show on landing page as it has its own nav
  if (location.pathname === "/") return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="apple-nav sticky top-0 z-50 w-full px-6 py-3 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="text-xl font-semibold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Medgen AI
        </div>
        <div className="hidden md:flex space-x-8">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Landing
          </button>
          <button
            onClick={() => navigate("/home")}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/chatbot")}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Chatbot
          </button>
          <button
            onClick={() => navigate("/diagnosis")}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Diagnosis
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Dashboard
          </button>
        </div>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                onClick={() => navigate("/settings")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                className="apple-button bg-black text-white hover:bg-black/90 text-sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button
                className="apple-button bg-black text-white hover:bg-black/90 text-sm"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;

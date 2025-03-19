import React from "react";
import { Helmet } from "react-helmet";
import LoginForm from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-y-auto h-full">
      <Helmet>
        <title>Login | Medgen AI</title>
      </Helmet>

      {/* Navigation */}
      <nav className="apple-nav sticky top-0 z-50 w-full px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-xl font-semibold">Medgen AI</div>
          <Button
            variant="ghost"
            className="text-sm font-medium hover:opacity-70 transition-opacity"
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-3 text-base text-muted-foreground">
              Sign in to your Medgen AI account
            </p>
          </div>
          <div className="mt-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

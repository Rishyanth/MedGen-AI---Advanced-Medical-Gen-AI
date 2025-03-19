import React from "react";
import { Helmet } from "react-helmet";
import DrugGenerator from "@/components/drug-discovery/DrugGenerator";
import AuthGuard from "@/components/auth/AuthGuard";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DrugDiscovery = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-y-auto h-full">
        <Helmet>
          <title>Drug Discovery | Medgen AI</title>
        </Helmet>

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">AI Drug Discovery</h1>
            <p className="text-muted-foreground mt-1">
              Explore AI-powered drug discovery and molecular generation
            </p>
          </div>

          <Alert
            variant="warning"
            className="bg-amber-50 border-amber-200 text-amber-800"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Research Tool Only</AlertTitle>
            <AlertDescription>
              This AI-assisted drug discovery tool is for research and
              educational purposes only. Generated molecules require extensive
              laboratory testing and validation before any practical
              applications.
            </AlertDescription>
          </Alert>

          <DrugGenerator />

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h3 className="font-medium mb-2">Input Method</h3>
                <p className="text-sm text-gray-600">
                  Enter a SMILES notation for a known molecule or describe a
                  disease/condition for which you need potential drug
                  candidates.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h3 className="font-medium mb-2">AI Processing</h3>
                <p className="text-sm text-gray-600">
                  Our AI models analyze the input and generate potential drug
                  candidates based on molecular structure prediction and
                  optimization.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h3 className="font-medium mb-2">Results Analysis</h3>
                <p className="text-sm text-gray-600">
                  Review generated molecules with their predicted properties,
                  bioactivity scores, and potential applications in treating the
                  specified condition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DrugDiscovery;

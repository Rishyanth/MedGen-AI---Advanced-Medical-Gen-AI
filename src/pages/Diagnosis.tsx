import React from "react";
import { Helmet } from "react-helmet";
import DiagnosisForm from "@/components/diagnosis/DiagnosisForm";
import AuthGuard from "@/components/auth/AuthGuard";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Diagnosis = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-y-auto h-full">
        <Helmet>
          <title>Disease Diagnosis | Medgen AI</title>
        </Helmet>

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Disease Diagnosis</h1>
            <p className="text-muted-foreground mt-1">
              Get AI-assisted diagnosis based on your symptoms
            </p>
          </div>

          <Alert
            variant="warning"
            className="bg-amber-50 border-amber-200 text-amber-800"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
              This AI-assisted diagnosis tool is for informational purposes only
              and does not replace professional medical advice. Always consult
              with a qualified healthcare provider for proper diagnosis and
              treatment.
            </AlertDescription>
          </Alert>

          <DiagnosisForm />

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h3 className="font-medium mb-2">Enter Your Symptoms</h3>
                <p className="text-sm text-gray-600">
                  Select from common symptoms or add your own. Rate the severity
                  to help our AI better understand your condition.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h3 className="font-medium mb-2">Provide Additional Info</h3>
                <p className="text-sm text-gray-600">
                  Add relevant details like age, gender, medical history, and
                  current medications for a more accurate assessment.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h3 className="font-medium mb-2">Review AI Diagnosis</h3>
                <p className="text-sm text-gray-600">
                  Get an AI-generated diagnosis with possible conditions,
                  recommendations, and next steps for your healthcare journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Diagnosis;

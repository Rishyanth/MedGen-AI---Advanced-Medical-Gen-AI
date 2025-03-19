import React from "react";
import { Helmet } from "react-helmet";
import ImageUploader from "@/components/image-analysis/ImageUploader";
import AuthGuard from "@/components/auth/AuthGuard";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ImageAnalysis = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-y-auto h-full">
        <Helmet>
          <title>Image Analysis | Medgen AI</title>
        </Helmet>

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Medical Image Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Analyze X-rays, MRIs, and medical reports with AI
            </p>
          </div>

          <Alert
            variant="warning"
            className="bg-amber-50 border-amber-200 text-amber-800"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
              This AI-assisted image analysis tool is for informational purposes
              only and does not replace professional medical interpretation.
              Always consult with a qualified healthcare provider for proper
              diagnosis.
            </AlertDescription>
          </Alert>

          <ImageUploader />

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">
              Supported Image Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">X-Ray Images</h3>
                <p className="text-sm text-gray-600">
                  Upload chest X-rays, bone X-rays, and other radiographic
                  images for AI analysis of potential abnormalities.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">MRI Scans</h3>
                <p className="text-sm text-gray-600">
                  Our AI can analyze brain MRIs, spinal MRIs, and other magnetic
                  resonance imaging scans to detect potential issues.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Medical Reports</h3>
                <p className="text-sm text-gray-600">
                  Upload lab reports, test results, and other medical documents
                  for OCR extraction and AI interpretation of the data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ImageAnalysis;

import React from "react";
import { Helmet } from "react-helmet";
import ImageAnalysisFeature from "@/components/image-analysis/ImageAnalysisFeature";

const ImageAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Medical Image Analysis | Medgen AI</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Medical Image Analysis</h1>
          <p className="text-gray-600">
            Upload and analyze medical images including X-rays, MRIs, and
            medical reports with AI assistance.
          </p>
        </div>
        <div className="h-[calc(100vh-220px)]">
          <ImageAnalysisFeature />
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysisPage;

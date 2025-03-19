import React from "react";
import { Helmet } from "react-helmet";
import DrugDiscoveryFeature from "@/components/drug-discovery/DrugDiscoveryFeature";

const DrugDiscoveryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>AI Drug Discovery | Medgen AI</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Drug Discovery</h1>
          <p className="text-gray-600">
            Explore potential drug candidates using AI-powered molecular
            structure prediction and analysis.
          </p>
        </div>
        <div className="h-[calc(100vh-220px)]">
          <DrugDiscoveryFeature />
        </div>
      </div>
    </div>
  );
};

export default DrugDiscoveryPage;

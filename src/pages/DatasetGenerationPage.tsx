import React from "react";
import { Helmet } from "react-helmet";
import DatasetGenerationFeature from "@/components/dataset-generation/DatasetGenerationFeature";

const DatasetGenerationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Synthetic Dataset Generation | Medgen AI</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Synthetic Medical Dataset Generator
          </h1>
          <p className="text-gray-600">
            Generate synthetic medical datasets for AI training and research
            while preserving privacy.
          </p>
        </div>
        <div className="h-[calc(100vh-220px)]">
          <DatasetGenerationFeature />
        </div>
      </div>
    </div>
  );
};

export default DatasetGenerationPage;

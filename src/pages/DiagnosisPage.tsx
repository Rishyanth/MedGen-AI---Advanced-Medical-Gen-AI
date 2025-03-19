import React from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiagnosisFeature from "@/components/diagnosis/DiagnosisFeature";
import DiseaseFeature from "@/components/diagnosis/DiseaseFeature";

const DiagnosisPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>AI Medical Diagnosis | Medgen AI</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Medical Diagnosis</h1>
          <p className="text-gray-600">
            Get AI-powered analysis of your symptoms and conditions with
            personalized treatment recommendations.
          </p>
        </div>

        <Tabs defaultValue="disease" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="symptoms">Symptom Analysis</TabsTrigger>
            <TabsTrigger value="disease">Treatment Planner</TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms" className="h-[calc(100vh-280px)]">
            <DiagnosisFeature />
          </TabsContent>

          <TabsContent value="disease" className="h-[calc(100vh-280px)]">
            <DiseaseFeature />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DiagnosisPage;

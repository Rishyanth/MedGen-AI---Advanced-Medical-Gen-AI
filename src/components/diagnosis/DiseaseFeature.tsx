import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";
import DiseaseForm from "./DiseaseForm";

const DiseaseFeature = () => {
  return (
    <Card className="w-full h-full flex flex-col bg-white shadow-sm border-gray-200">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 py-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-600" />
          AI Treatment Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <DiseaseForm />
      </CardContent>
    </Card>
  );
};

export default DiseaseFeature;

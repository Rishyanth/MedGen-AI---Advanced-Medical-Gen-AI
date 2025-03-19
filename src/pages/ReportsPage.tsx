import React from "react";
import { Helmet } from "react-helmet";
import HealthReportsFeature from "@/components/reports/HealthReportsFeature";
import AuthGuard from "@/components/auth/AuthGuard";

const ReportsPage = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-y-auto h-full">
        <Helmet>
          <title>Health Reports | Medgen AI</title>
        </Helmet>

        <HealthReportsFeature />
      </div>
    </AuthGuard>
  );
};

export default ReportsPage;

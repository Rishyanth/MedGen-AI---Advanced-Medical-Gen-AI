import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2, ArrowLeft } from "lucide-react";

interface ReportDetailProps {
  reportId: string;
  onBack: () => void;
}

const ReportDetail = ({ reportId, onBack }: ReportDetailProps) => {
  // In a real app, you would fetch the report details based on the ID
  // This is mock data for demonstration
  const report = {
    id: reportId,
    title: "Annual Physical Examination",
    date: "2023-12-15",
    doctor: "Dr. Sarah Johnson",
    facility: "Medgen Health Center",
    patientInfo: {
      name: "John Doe",
      dob: "1985-06-12",
      patientId: "P-12345",
    },
    vitals: {
      bloodPressure: "120/80 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      respiratoryRate: "16 breaths/min",
      height: "5'10\"",
      weight: "160 lbs",
      bmi: 23.0,
    },
    findings: [
      "Blood pressure is within normal range",
      "Heart and lung sounds normal",
      "Reflexes normal and symmetrical",
      "No abnormalities in abdominal examination",
      "Skin appears healthy with no concerning lesions",
    ],
    labResults: [
      { name: "Complete Blood Count", result: "Normal", referenceRange: "N/A" },
      {
        name: "Glucose (Fasting)",
        result: "92 mg/dL",
        referenceRange: "70-99 mg/dL",
      },
      {
        name: "Total Cholesterol",
        result: "185 mg/dL",
        referenceRange: "<200 mg/dL",
      },
      {
        name: "HDL Cholesterol",
        result: "55 mg/dL",
        referenceRange: ">40 mg/dL",
      },
      {
        name: "LDL Cholesterol",
        result: "110 mg/dL",
        referenceRange: "<130 mg/dL",
      },
    ],
    assessment:
      "Patient is in good overall health. Cholesterol levels are within normal range. Blood pressure is normal.",
    recommendations: [
      "Continue regular exercise regimen",
      "Maintain balanced diet",
      "Schedule follow-up appointment in 12 months",
      "Consider vitamin D supplementation during winter months",
    ],
    signature: "Dr. Sarah Johnson, MD",
    signatureDate: "2023-12-15",
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        <div className="flex-1" />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-2 bg-black text-white hover:bg-black/90"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="mb-8 border-t-4 border-t-black">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {report.title}
              </CardTitle>
              <p className="text-muted-foreground">
                {new Date(report.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{report.facility}</p>
              <p className="text-sm text-muted-foreground">
                Report ID: {report.id}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Patient Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Name:</p>
                <p className="text-sm">{report.patientInfo.name}</p>
                <p className="text-sm text-muted-foreground">Date of Birth:</p>
                <p className="text-sm">
                  {new Date(report.patientInfo.dob).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Patient ID:</p>
                <p className="text-sm">{report.patientInfo.patientId}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Provider Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Doctor:</p>
                <p className="text-sm">{report.doctor}</p>
                <p className="text-sm text-muted-foreground">Facility:</p>
                <p className="text-sm">{report.facility}</p>
                <p className="text-sm text-muted-foreground">
                  Date of Service:
                </p>
                <p className="text-sm">
                  {new Date(report.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-lg mb-4">Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(report.vitals).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-lg mb-4">Examination Findings</h3>
            <ul className="list-disc pl-5 space-y-2">
              {report.findings.map((finding, index) => (
                <li key={index} className="text-sm">
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-lg mb-4">Laboratory Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 border">Test</th>
                    <th className="text-left p-3 border">Result</th>
                    <th className="text-left p-3 border">Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  {report.labResults.map((lab, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3 border">{lab.name}</td>
                      <td className="p-3 border">{lab.result}</td>
                      <td className="p-3 border">{lab.referenceRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-lg mb-2">Assessment</h3>
            <p className="mb-6">{report.assessment}</p>

            <h3 className="font-semibold text-lg mb-2">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-2">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="text-sm">
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="flex justify-end">
              <div className="text-right">
                <p className="font-medium">{report.signature}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(report.signatureDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDetail;

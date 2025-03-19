import { supabase } from "./supabase";

// Types for reports
export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  doctor: string;
  status: "completed" | "pending" | "reviewed";
  summary: string;
  user_id?: string;
}

// Fetch reports for the current user
export const fetchUserReports = async (): Promise<Report[]> => {
  try {
    // In a real implementation, this would fetch from Supabase
    // For now, return mock data
    return [
      {
        id: "rep-001",
        title: "Annual Physical Examination",
        date: "2023-12-15",
        type: "Physical",
        doctor: "Dr. Sarah Johnson",
        status: "completed",
        summary:
          "Overall health is good. Blood pressure slightly elevated. Recommended lifestyle changes and follow-up in 3 months.",
      },
      {
        id: "rep-002",
        title: "Blood Work Analysis",
        date: "2023-11-28",
        type: "Laboratory",
        doctor: "Dr. Michael Chen",
        status: "reviewed",
        summary:
          "Cholesterol levels within normal range. Vitamin D deficiency detected. Recommended supplements and dietary changes.",
      },
      {
        id: "rep-003",
        title: "Cardiac Evaluation",
        date: "2023-10-05",
        type: "Specialist",
        doctor: "Dr. Emily Rodriguez",
        status: "completed",
        summary:
          "ECG shows normal heart rhythm. Stress test results normal. No significant cardiac concerns at this time.",
      },
      {
        id: "rep-004",
        title: "Allergy Testing Results",
        date: "2023-09-12",
        type: "Laboratory",
        doctor: "Dr. James Wilson",
        status: "reviewed",
        summary:
          "Positive reaction to pollen and dust mites. Prescribed antihistamines and provided allergen avoidance strategies.",
      },
      {
        id: "rep-005",
        title: "MRI Scan - Lower Back",
        date: "2023-08-20",
        type: "Imaging",
        doctor: "Dr. Lisa Thompson",
        status: "pending",
        summary:
          "Images taken successfully. Awaiting radiologist review and final report.",
      },
    ];
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

// Fetch a single report by ID
export const fetchReportById = async (
  reportId: string,
): Promise<Report | null> => {
  try {
    // In a real implementation, this would fetch from Supabase
    // For now, return mock data if ID matches
    const mockReports = await fetchUserReports();
    return mockReports.find((report) => report.id === reportId) || null;
  } catch (error) {
    console.error(`Error fetching report ${reportId}:`, error);
    throw error;
  }
};

// Generate a health report (this would typically be done by a healthcare provider)
export const generateHealthReport = async (
  data: Partial<Report>,
): Promise<Report> => {
  try {
    // In a real implementation, this would create a record in Supabase
    // For now, return mock data
    const newReport: Report = {
      id: `rep-${Math.floor(Math.random() * 1000)}`,
      title: data.title || "New Health Report",
      date: data.date || new Date().toISOString().split("T")[0],
      type: data.type || "General",
      doctor: data.doctor || "Dr. AI Assistant",
      status: "completed",
      summary:
        data.summary ||
        "This report was generated by the AI assistant based on provided information.",
    };

    return newReport;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

// Share a report with another user or healthcare provider
export const shareReport = async (
  reportId: string,
  recipientEmail: string,
): Promise<boolean> => {
  try {
    // In a real implementation, this would handle sharing logic
    // For now, just return success
    console.log(`Sharing report ${reportId} with ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error(`Error sharing report ${reportId}:`, error);
    throw error;
  }
};

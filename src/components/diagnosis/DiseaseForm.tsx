import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  AlertCircle,
  Loader2,
  Pill,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createActivity } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

type FollowUpQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

type DiagnosisResult = {
  condition: string;
  description: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  recommendations: string[];
};

const DiseaseForm = () => {
  const [disease, setDisease] = useState("");
  const [step, setStep] = useState(1);
  const [followUpQuestions, setFollowUpQuestions] = useState<
    FollowUpQuestion[]
  >([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleDiseaseSubmit = () => {
    if (!disease.trim()) {
      alert("Please enter a disease or condition");
      return;
    }

    // Generate follow-up questions based on the disease
    const questions = generateFollowUpQuestions(disease);
    setFollowUpQuestions(questions);
    setStep(2);
  };

  const generateFollowUpQuestions = (
    diseaseName: string,
  ): FollowUpQuestion[] => {
    // This would ideally come from an API or database
    // For now, we'll generate some generic questions based on the disease
    const commonQuestions: FollowUpQuestion[] = [
      {
        id: "q1",
        question:
          "How long have you been experiencing symptoms related to this condition?",
        options: [
          "Less than a week",
          "1-4 weeks",
          "1-6 months",
          "More than 6 months",
        ],
        answer: "",
      },
      {
        id: "q2",
        question: "Have you been diagnosed with this condition before?",
        options: ["Yes", "No", "Unsure"],
        answer: "",
      },
      {
        id: "q3",
        question: "Are you currently taking any medications?",
        options: ["Yes", "No"],
        answer: "",
      },
      {
        id: "q4",
        question: "Do you have any known allergies to medications?",
        options: ["Yes", "No", "Unsure"],
        answer: "",
      },
    ];

    // Add disease-specific questions
    const lowerDisease = diseaseName.toLowerCase();

    if (lowerDisease.includes("diabetes")) {
      commonQuestions.push(
        {
          id: "d1",
          question: "What type of diabetes do you have?",
          options: ["Type 1", "Type 2", "Gestational", "Unsure"],
          answer: "",
        },
        {
          id: "d2",
          question: "What was your last HbA1c reading?",
          options: ["Less than 7%", "7-8%", "8-9%", "Above 9%", "I don't know"],
          answer: "",
        },
      );
    } else if (
      lowerDisease.includes("hypertension") ||
      lowerDisease.includes("blood pressure")
    ) {
      commonQuestions.push(
        {
          id: "h1",
          question: "What is your typical blood pressure reading?",
          options: [
            "Normal (less than 120/80)",
            "Elevated (120-129/less than 80)",
            "Stage 1 (130-139/80-89)",
            "Stage 2 (140+/90+)",
            "I don't know",
          ],
          answer: "",
        },
        {
          id: "h2",
          question: "Do you monitor your blood pressure at home?",
          options: ["Yes, regularly", "Yes, occasionally", "No"],
          answer: "",
        },
      );
    } else if (
      lowerDisease.includes("asthma") ||
      lowerDisease.includes("copd") ||
      lowerDisease.includes("respiratory")
    ) {
      commonQuestions.push(
        {
          id: "r1",
          question: "How often do you experience breathing difficulties?",
          options: ["Daily", "Weekly", "Monthly", "Only during flare-ups"],
          answer: "",
        },
        {
          id: "r2",
          question: "Do you use an inhaler?",
          options: [
            "Yes, daily controller",
            "Yes, rescue inhaler as needed",
            "Both",
            "No",
          ],
          answer: "",
        },
      );
    }

    return commonQuestions;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setFollowUpQuestions(
      followUpQuestions.map((q) =>
        q.id === questionId ? { ...q, answer } : q,
      ),
    );
  };

  const handleGenerateReport = async () => {
    // Check if all follow-up questions are answered
    const unanswered = followUpQuestions.filter((q) => !q.answer);
    if (unanswered.length > 0) {
      alert("Please answer all follow-up questions");
      return;
    }

    setIsLoading(true);
    setApiKeyError(null);

    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a response with a timeout
      setTimeout(async () => {
        // Generate a mock diagnosis based on the disease and answers
        const mockDiagnosis = generateMockDiagnosis(
          disease,
          followUpQuestions,
          additionalInfo,
        );
        setDiagnosisResult(mockDiagnosis);
        setIsLoading(false);
        setStep(3);

        // Log this diagnosis in activities
        if (user) {
          try {
            await createActivity({
              user_id: user.id,
              title: "Disease Treatment Report",
              description: `Treatment report for ${disease}`,
              type: "diagnosis",
              status: "completed",
            });
          } catch (error) {
            console.error("Error logging diagnosis activity:", error);
          }
        }
      }, 3000);
    } catch (error) {
      console.error("Error generating report:", error);
      setIsLoading(false);
      setApiKeyError(
        "An error occurred while generating the report. Please try again.",
      );
    }
  };

  const generateMockDiagnosis = (
    diseaseName: string,
    questions: FollowUpQuestion[],
    additionalNotes: string,
  ): DiagnosisResult => {
    // This is a mock function - in a real app, you would use a trained ML model or API
    const lowerDisease = diseaseName.toLowerCase();

    if (lowerDisease.includes("diabetes")) {
      const type = questions.find((q) => q.id === "d1")?.answer || "Type 2";
      const isType1 = type === "Type 1";

      return {
        condition: `${type} Diabetes Mellitus`,
        description: `${type} Diabetes is a chronic condition affecting how your body processes blood sugar (glucose). ${isType1 ? "In Type 1 diabetes, the pancreas produces little or no insulin." : "In Type 2 diabetes, the body becomes resistant to insulin or doesn't produce enough insulin."}`,
        medications: [
          {
            name: isType1 ? "Insulin (Lantus)" : "Metformin",
            dosage: isType1
              ? "Based on weight and blood glucose"
              : "500-1000 mg",
            frequency: isType1 ? "Daily injections" : "Twice daily with meals",
            duration: "Ongoing",
          },
          {
            name: isType1 ? "Insulin (Novolog)" : "Glipizide",
            dosage: isType1 ? "Based on carbohydrate intake" : "5-10 mg",
            frequency: isType1 ? "Before meals" : "Once daily before breakfast",
            duration: "Ongoing",
          },
          {
            name: "Vitamin B12",
            dosage: "1000 mcg",
            frequency: "Daily",
            duration: "Ongoing",
          },
        ],
        recommendations: [
          "Monitor blood glucose levels regularly",
          "Follow a balanced diet low in simple carbohydrates",
          "Engage in regular physical activity",
          "Attend regular check-ups with your healthcare provider",
          "Have HbA1c tested every 3-6 months",
          "Check feet daily for any signs of neuropathy or wounds",
        ],
      };
    } else if (
      lowerDisease.includes("hypertension") ||
      lowerDisease.includes("blood pressure")
    ) {
      const bpReading =
        questions.find((q) => q.id === "h1")?.answer ||
        "Stage 1 (130-139/80-89)";
      const isStage2 = bpReading.includes("Stage 2");

      return {
        condition: `Hypertension (${isStage2 ? "Stage 2" : "Stage 1"})`,
        description: `Hypertension, or high blood pressure, is a common condition that can lead to serious health problems if untreated. ${isStage2 ? "Stage 2 hypertension is more severe and may require multiple medications." : "Stage 1 hypertension often responds well to lifestyle changes and sometimes medication."}`,
        medications: [
          {
            name: "Lisinopril (ACE inhibitor)",
            dosage: isStage2 ? "20-40 mg" : "10-20 mg",
            frequency: "Once daily",
            duration: "Ongoing",
          },
          {
            name: isStage2
              ? "Amlodipine (Calcium channel blocker)"
              : "Hydrochlorothiazide (Diuretic)",
            dosage: isStage2 ? "5-10 mg" : "12.5-25 mg",
            frequency: "Once daily",
            duration: "Ongoing",
          },
        ],
        recommendations: [
          "Monitor blood pressure regularly at home",
          "Reduce sodium intake to less than 2,300 mg per day",
          "Maintain a healthy weight",
          "Exercise regularly (at least 150 minutes per week)",
          "Limit alcohol consumption",
          "Quit smoking if applicable",
          "Manage stress through relaxation techniques",
        ],
      };
    } else if (lowerDisease.includes("asthma")) {
      const frequency =
        questions.find((q) => q.id === "r1")?.answer || "Weekly";
      const isSevere = frequency === "Daily";

      return {
        condition: `${isSevere ? "Persistent" : "Intermittent"} Asthma`,
        description: `Asthma is a condition in which your airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing, a whistling sound (wheezing) when you breathe out and shortness of breath.`,
        medications: [
          {
            name: isSevere
              ? "Fluticasone/Salmeterol (Advair)"
              : "Albuterol (ProAir, Ventolin)",
            dosage: isSevere ? "250/50 mcg" : "90 mcg, 2 puffs",
            frequency: isSevere ? "Twice daily" : "As needed for symptoms",
            duration: isSevere ? "Ongoing" : "During symptomatic periods",
          },
          {
            name: isSevere
              ? "Montelukast (Singulair)"
              : "Budesonide (Pulmicort)",
            dosage: isSevere ? "10 mg" : "180 mcg, 2 puffs",
            frequency: isSevere ? "Once daily at bedtime" : "Twice daily",
            duration: isSevere
              ? "Ongoing"
              : "During allergy season or as directed",
          },
        ],
        recommendations: [
          "Identify and avoid asthma triggers",
          "Use a peak flow meter to monitor breathing",
          "Follow your asthma action plan",
          "Keep rescue inhaler accessible at all times",
          "Get annual flu vaccine",
          "Consider allergen immunotherapy if allergies trigger asthma",
          "Use air purifiers in your home",
        ],
      };
    } else {
      // Generic response for other conditions
      return {
        condition: diseaseName,
        description: `Based on the information provided about ${diseaseName}, we've generated a general treatment plan. Please consult with a healthcare professional for a personalized approach.`,
        medications: [
          {
            name: "Medication recommendations require specific diagnosis",
            dosage: "As prescribed by your doctor",
            frequency: "As prescribed by your doctor",
            duration: "As prescribed by your doctor",
          },
        ],
        recommendations: [
          "Consult with a healthcare professional for a proper diagnosis and treatment plan",
          "Keep a symptom diary to track any patterns or triggers",
          "Maintain a healthy lifestyle with balanced diet and regular exercise",
          "Ensure adequate rest and sleep",
          "Stay hydrated",
          "Manage stress through relaxation techniques",
        ],
      };
    }
  };

  const handleReset = () => {
    setDisease("");
    setStep(1);
    setFollowUpQuestions([]);
    setAdditionalInfo("");
    setDiagnosisResult(null);
    setApiKeyError(null);
  };

  const handleSaveReport = () => {
    if (!diagnosisResult) return;

    // Create a text report
    let reportContent = `MEDGEN AI TREATMENT REPORT\n\n`;
    reportContent += `Date: ${new Date().toLocaleDateString()}\n\n`;
    reportContent += `CONDITION: ${diagnosisResult.condition}\n\n`;
    reportContent += `DESCRIPTION:\n${diagnosisResult.description}\n\n`;

    reportContent += `RECOMMENDED MEDICATIONS:\n`;
    diagnosisResult.medications.forEach((med, i) => {
      reportContent += `${i + 1}. ${med.name}\n`;
      reportContent += `   Dosage: ${med.dosage}\n`;
      reportContent += `   Frequency: ${med.frequency}\n`;
      reportContent += `   Duration: ${med.duration}\n\n`;
    });

    reportContent += `RECOMMENDATIONS:\n`;
    diagnosisResult.recommendations.forEach((rec, i) => {
      reportContent += `${i + 1}. ${rec}\n`;
    });

    reportContent += `\n\nADDITIONAL INFORMATION PROVIDED:\n`;
    if (additionalInfo) {
      reportContent += additionalInfo + "\n\n";
    } else {
      reportContent += "None provided\n\n";
    }

    reportContent += `FOLLOW-UP RESPONSES:\n`;
    followUpQuestions.forEach((q) => {
      reportContent += `Q: ${q.question}\nA: ${q.answer || "Not answered"}\n\n`;
    });

    reportContent += `\nDISCLAIMER:\nThis AI-generated treatment plan is for informational purposes only and does not constitute professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment.`;

    // Create a blob and download
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medgen-treatment-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    if (!diagnosisResult) return;

    // In a real app, you would use a library like xlsx to create an Excel file
    // For this demo, we'll create a CSV file which can be opened in Excel
    let csvContent = "data:text/csv;charset=utf-8,";

    // Headers
    csvContent += "Medication,Dosage,Frequency,Duration\n";

    // Data rows
    diagnosisResult.medications.forEach((med) => {
      csvContent += `"${med.name}","${med.dosage}","${med.frequency}","${med.duration}"\n`;
    });

    // Create a link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${diagnosisResult.condition.replace(/\s+/g, "_")}_medications.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>
          {step === 1 && "Step 1: Enter Disease or Condition"}
          {step === 2 && "Step 2: Additional Information"}
          {step === 3 && "Treatment Report"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                Enter a disease or medical condition to receive a personalized
                treatment plan and medication recommendations.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disease">Disease or Condition</Label>
              <Input
                id="disease"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                placeholder="e.g., Type 2 Diabetes, Hypertension, Asthma"
                className="w-full"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <ScrollArea className="h-[400px] pr-4">
              {followUpQuestions.length > 0 ? (
                followUpQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="space-y-3 p-4 border rounded-lg bg-gray-50 mb-4"
                  >
                    <h3 className="text-lg font-medium">{question.question}</h3>
                    <RadioGroup
                      value={question.answer}
                      onValueChange={(value) =>
                        handleAnswerChange(question.id, value)
                      }
                    >
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-white"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${question.id}-${index}`}
                            className="text-blue-600"
                          />
                          <Label
                            htmlFor={`${question.id}-${index}`}
                            className="cursor-pointer w-full"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Additional Questions Needed
                  </h3>
                  <p className="text-gray-500">
                    Based on the condition you entered, we have enough
                    information to proceed with the analysis.
                  </p>
                </div>
              )}

              <div className="space-y-2 mt-6">
                <Label htmlFor="additional-info">
                  Additional Information (Optional)
                </Label>
                <Textarea
                  id="additional-info"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Enter any additional information about your condition, medical history, or specific concerns..."
                  className="min-h-[120px]"
                />
              </div>
            </ScrollArea>
          </div>
        )}

        {step === 3 && diagnosisResult && (
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold text-primary">
                {diagnosisResult.condition}
              </h3>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700">{diagnosisResult.description}</p>
            </div>

            <Tabs defaultValue="medications">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="medications">
                  Recommended Medications
                </TabsTrigger>
                <TabsTrigger value="recommendations">
                  Lifestyle Recommendations
                </TabsTrigger>
              </TabsList>
              <TabsContent value="medications" className="pt-4">
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2 font-medium">
                          Medication
                        </th>
                        <th className="text-left p-2 font-medium">Dosage</th>
                        <th className="text-left p-2 font-medium">Frequency</th>
                        <th className="text-left p-2 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnosisResult.medications.map((med, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">
                            <div className="flex items-center">
                              <Pill className="h-4 w-4 text-blue-500 mr-2" />
                              {med.name}
                            </div>
                          </td>
                          <td className="p-2">{med.dosage}</td>
                          <td className="p-2">{med.frequency}</td>
                          <td className="p-2">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="recommendations" className="pt-4">
                <ul className="space-y-2">
                  {diagnosisResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
              <p className="text-sm font-medium">
                Important Disclaimer: This is an AI-generated treatment plan and
                should not replace professional medical advice. Please consult
                with a healthcare provider before starting any medication or
                treatment plan.
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">
              Generating your treatment plan...
            </p>
          </div>
        )}

        {apiKeyError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiKeyError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step < 3 ? (
          <>
            <Button
              variant="outline"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1 || isLoading}
            >
              Back
            </Button>
            <Button
              onClick={step === 1 ? handleDiseaseSubmit : handleGenerateReport}
              disabled={(step === 1 && !disease.trim()) || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : step === 1 ? (
                "Continue"
              ) : (
                "Generate Treatment Plan"
              )}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={handleReset}>
              Start New Treatment Plan
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleExportExcel}>
                Export to Excel
              </Button>
              <Button onClick={handleSaveReport}>
                <FileText className="mr-2 h-4 w-4" />
                Save Report
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default DiseaseForm;

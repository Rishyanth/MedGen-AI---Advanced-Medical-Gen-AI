import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  FileText,
  AlertCircle,
  Loader2,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateDiagnosis } from "@/lib/openai";

type Symptom = {
  id: string;
  name: string;
  selected: boolean;
};

type FollowUpQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

type DiagnosisResult = {
  condition: string;
  probability: number;
  description: string;
  recommendations: string[];
};

const INITIAL_SYMPTOMS: Symptom[] = [
  { id: "1", name: "Headache", selected: false },
  { id: "2", name: "Fever", selected: false },
  { id: "3", name: "Cough", selected: false },
  { id: "4", name: "Fatigue", selected: false },
  { id: "5", name: "Shortness of breath", selected: false },
  { id: "6", name: "Sore throat", selected: false },
  { id: "7", name: "Muscle aches", selected: false },
  { id: "8", name: "Loss of taste or smell", selected: false },
  { id: "9", name: "Nausea", selected: false },
  { id: "10", name: "Diarrhea", selected: false },
  { id: "11", name: "Chest pain", selected: false },
  { id: "12", name: "Dizziness", selected: false },
  { id: "13", name: "Rash", selected: false },
  { id: "14", name: "Joint pain", selected: false },
  { id: "15", name: "Abdominal pain", selected: false },
  { id: "16", name: "Vomiting", selected: false },
];

const FOLLOW_UP_QUESTIONS: Record<string, FollowUpQuestion[]> = {
  "1": [
    {
      id: "h1",
      question: "How would you rate your headache pain on a scale of 1-10?",
      options: ["1-3 (Mild)", "4-7 (Moderate)", "8-10 (Severe)"],
      answer: "",
    },
    {
      id: "h2",
      question: "How long have you been experiencing headaches?",
      options: ["Less than a day", "1-3 days", "4-7 days", "More than a week"],
      answer: "",
    },
    {
      id: "h3",
      question: "Where is the pain located?",
      options: ["Front of head", "Back of head", "One side", "All over"],
      answer: "",
    },
  ],
  "2": [
    {
      id: "f1",
      question: "What is your current temperature?",
      options: [
        "Below 100°F (37.8°C)",
        "100-102°F (37.8-38.9°C)",
        "Above 102°F (38.9°C)",
        "I haven't measured",
      ],
      answer: "",
    },
    {
      id: "f2",
      question: "How long have you had a fever?",
      options: ["Less than 24 hours", "1-3 days", "More than 3 days"],
      answer: "",
    },
    {
      id: "f3",
      question: "Does the fever come and go, or is it constant?",
      options: ["Comes and goes", "Constant", "Worse at certain times of day"],
      answer: "",
    },
  ],
  "3": [
    {
      id: "c1",
      question: "Is your cough dry or productive (bringing up mucus)?",
      options: ["Dry", "Productive (with mucus)", "Both/Varies"],
      answer: "",
    },
    {
      id: "c2",
      question: "How long have you been coughing?",
      options: ["Less than a week", "1-2 weeks", "More than 2 weeks"],
      answer: "",
    },
    {
      id: "c3",
      question: "Is your cough worse at any particular time?",
      options: ["Morning", "Night", "After exercise", "No particular pattern"],
      answer: "",
    },
  ],
  "5": [
    {
      id: "s1",
      question: "When do you experience shortness of breath?",
      options: [
        "At rest",
        "With mild activity",
        "With strenuous activity",
        "All the time",
      ],
      answer: "",
    },
    {
      id: "s2",
      question: "How long have you been experiencing shortness of breath?",
      options: ["Less than a day", "1-3 days", "4-7 days", "More than a week"],
      answer: "",
    },
  ],
};

const DiagnosisFeature = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>(INITIAL_SYMPTOMS);
  const [activeTab, setActiveTab] = useState("symptoms");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [followUpQuestions, setFollowUpQuestions] = useState<
    FollowUpQuestion[]
  >([]);
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>(
    [],
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [diagnosisText, setDiagnosisText] = useState<string | null>(null);

  const handleSymptomToggle = (symptomId: string) => {
    setSymptoms(
      symptoms.map((symptom) =>
        symptom.id === symptomId
          ? { ...symptom, selected: !symptom.selected }
          : symptom,
      ),
    );
  };

  const handleContinueToFollowUp = () => {
    const selectedSymptoms = symptoms.filter((s) => s.selected);

    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom");
      return;
    }

    // Gather follow-up questions for selected symptoms
    let questions: FollowUpQuestion[] = [];
    selectedSymptoms.forEach((symptom) => {
      if (FOLLOW_UP_QUESTIONS[symptom.id]) {
        questions = [...questions, ...FOLLOW_UP_QUESTIONS[symptom.id]];
      }
    });

    setFollowUpQuestions(questions);
    setActiveTab("followUp");
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setFollowUpQuestions(
      followUpQuestions.map((q) =>
        q.id === questionId ? { ...q, answer } : q,
      ),
    );
  };

  const handleAnalyzeSymptoms = async () => {
    // Check if all follow-up questions are answered
    const unanswered = followUpQuestions.filter((q) => !q.answer);
    if (unanswered.length > 0 && followUpQuestions.length > 0) {
      alert("Please answer all follow-up questions");
      return;
    }

    setIsAnalyzing(true);
    setApiKeyError(null);

    try {
      // Get selected symptom names
      const selectedSymptomNames = symptoms
        .filter((s) => s.selected)
        .map((s) => s.name);

      // Create answers object
      const answers: Record<string, string> = {};
      followUpQuestions.forEach((q) => {
        answers[q.question] = q.answer;
      });

      if (additionalInfo) {
        answers["Additional Information"] = additionalInfo;
      }

      // Call OpenAI API
      const response = await generateDiagnosis(selectedSymptomNames, answers);

      if (response.error) {
        // Handle API key error
        if (response.error.includes("API key")) {
          setApiKeyError(
            "No OpenAI API key found. Please add your API key in the settings.",
          );
        } else {
          setApiKeyError(response.error);
        }

        // Use fallback diagnosis
        const selectedIds = symptoms
          .filter((s) => s.selected)
          .map((s) => s.id)
          .sort()
          .join(",");

        // Get diagnosis results based on selected symptoms
        const results =
          DIAGNOSIS_RESULTS[selectedIds] || DIAGNOSIS_RESULTS.default;
        setDiagnosisResults(results);
        setDiagnosisText(null);
      } else if (response.content) {
        // Parse the response to extract potential conditions
        const content = response.content;
        setDiagnosisText(content);

        // Try to extract structured data from the response
        try {
          // Simple parsing - this is a basic approach and might need refinement
          const conditions: DiagnosisResult[] = [];

          // Look for sections that might indicate a condition
          const sections = content.split(/\n\n|\r\n\r\n/);

          for (const section of sections) {
            if (
              section.includes("condition") ||
              section.includes("diagnosis") ||
              section.includes("Condition") ||
              section.includes("Diagnosis")
            ) {
              const lines = section.split(/\n|\r\n/);
              let condition = "";
              let description = "";
              let probability = 0.5; // Default
              const recommendations: string[] = [];

              for (const line of lines) {
                if (
                  line.includes("condition:") ||
                  line.includes("Condition:") ||
                  line.includes("diagnosis:") ||
                  line.includes("Diagnosis:")
                ) {
                  condition =
                    line.split(/:|\-/)[1]?.trim() || "Unknown Condition";
                } else if (
                  line.includes("description") ||
                  line.includes("Description") ||
                  line.toLowerCase().includes("about")
                ) {
                  description = line.split(/:|\-/)[1]?.trim() || "";
                } else if (
                  line.includes("probability") ||
                  line.includes("Probability") ||
                  line.includes("likelihood") ||
                  line.includes("Likelihood")
                ) {
                  const match = line.match(/(\d+)\s*%/);
                  if (match) {
                    probability = parseInt(match[1]) / 100;
                  }
                } else if (
                  line.includes("recommendation") ||
                  line.includes("Recommendation") ||
                  line.includes("treatment") ||
                  line.includes("Treatment") ||
                  line.includes("- ")
                ) {
                  const rec = line.replace(/^\s*-\s*|^\d+\.\s*/, "").trim();
                  if (
                    rec &&
                    !rec.toLowerCase().includes("recommendation") &&
                    !rec.toLowerCase().includes("treatment")
                  ) {
                    recommendations.push(rec);
                  }
                }
              }

              if (condition) {
                conditions.push({
                  condition,
                  description:
                    description || "No detailed description available.",
                  probability,
                  recommendations:
                    recommendations.length > 0
                      ? recommendations
                      : [
                          "Consult with a healthcare professional for proper diagnosis and treatment.",
                        ],
                });
              }
            }
          }

          if (conditions.length > 0) {
            setDiagnosisResults(conditions);
          } else {
            // Fallback to default if parsing fails
            setDiagnosisResults(DIAGNOSIS_RESULTS.default);
          }
        } catch (parseError) {
          console.error("Error parsing diagnosis response:", parseError);
          setDiagnosisResults(DIAGNOSIS_RESULTS.default);
        }
      }
    } catch (error) {
      console.error("Error in diagnosis:", error);
      // Use fallback diagnosis
      setDiagnosisResults(DIAGNOSIS_RESULTS.default);
    } finally {
      setActiveTab("results");
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSymptoms(INITIAL_SYMPTOMS.map((s) => ({ ...s, selected: false })));
    setAdditionalInfo("");
    setFollowUpQuestions([]);
    setDiagnosisResults([]);
    setDiagnosisText(null);
    setApiKeyError(null);
    setActiveTab("symptoms");
  };

  const handleSaveReport = () => {
    // Create a text report
    let reportContent = `MEDGEN AI DIAGNOSIS REPORT\n\n`;
    reportContent += `Date: ${new Date().toLocaleDateString()}\n\n`;

    reportContent += `SYMPTOMS:\n`;
    const selectedSymptoms = symptoms.filter((s) => s.selected);
    selectedSymptoms.forEach((s) => {
      reportContent += `- ${s.name}\n`;
    });

    if (additionalInfo) {
      reportContent += `\nADDITIONAL INFORMATION:\n${additionalInfo}\n`;
    }

    if (followUpQuestions.length > 0) {
      reportContent += `\nFOLLOW-UP RESPONSES:\n`;
      followUpQuestions.forEach((q) => {
        if (q.answer) {
          reportContent += `Q: ${q.question}\nA: ${q.answer}\n\n`;
        }
      });
    }

    reportContent += `\nDIAGNOSIS RESULTS:\n`;
    diagnosisResults.forEach((result, i) => {
      reportContent += `\n${i + 1}. ${result.condition} (Probability: ${Math.round(result.probability * 100)}%)\n`;
      reportContent += `   ${result.description}\n\n`;
      reportContent += `   Recommendations:\n`;
      result.recommendations.forEach((rec) => {
        reportContent += `   - ${rec}\n`;
      });
      reportContent += `\n`;
    });

    reportContent += `\nDISCLAIMER:\nThis AI-generated diagnosis is for informational purposes only and does not constitute professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.`;

    // Create a blob and download
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medgen-diagnosis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full h-full flex flex-col bg-white shadow-sm border-gray-200">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 py-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-600" />
          AI Disease Diagnosis
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {apiKeyError && (
          <Alert variant="destructive" className="m-4 mb-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiKeyError}</AlertDescription>
          </Alert>
        )}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="symptoms"
              disabled={activeTab === "followUp" || activeTab === "results"}
            >
              Symptoms
            </TabsTrigger>
            <TabsTrigger
              value="followUp"
              disabled={activeTab === "symptoms" || activeTab === "results"}
            >
              Follow-up Questions
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={activeTab === "symptoms" || activeTab === "followUp"}
            >
              Diagnosis Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms" className="flex-1 p-4">
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-700">
                    Select all symptoms you're experiencing. The more
                    information you provide, the more accurate our AI diagnosis
                    will be.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Select your symptoms:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {symptoms.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                      >
                        <Checkbox
                          id={`symptom-${symptom.id}`}
                          checked={symptom.selected}
                          onCheckedChange={() =>
                            handleSymptomToggle(symptom.id)
                          }
                          className="text-blue-600"
                        />
                        <Label
                          htmlFor={`symptom-${symptom.id}`}
                          className="cursor-pointer w-full"
                        >
                          {symptom.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Additional information:
                  </h3>
                  <Textarea
                    placeholder="Describe any other symptoms or relevant information such as medical history, current medications, or when symptoms started..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </ScrollArea>

            <CardFooter className="mt-6 flex justify-end border-t pt-4 bg-gray-50">
              <Button
                onClick={handleContinueToFollowUp}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value="followUp" className="flex-1 p-4">
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="space-y-6">
                {followUpQuestions.length > 0 ? (
                  followUpQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="space-y-3 p-4 border rounded-lg bg-gray-50"
                    >
                      <h3 className="text-lg font-medium">
                        {question.question}
                      </h3>
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
                      Based on your selected symptoms, we have enough
                      information to proceed with the analysis.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <CardFooter className="mt-6 flex justify-between border-t pt-4 bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setActiveTab("symptoms")}
              >
                Back
              </Button>
              <Button
                onClick={handleAnalyzeSymptoms}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Symptoms"
                )}
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value="results" className="flex-1 p-4">
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-700 mb-2">
                    Diagnosis Summary
                  </h3>
                  <p className="text-sm text-blue-600">
                    Based on your symptoms and responses, our AI has generated
                    the following potential diagnoses. Please note that this is
                    not a substitute for professional medical advice.
                  </p>
                </div>

                {diagnosisResults.map((result, index) => (
                  <Card
                    key={index}
                    className="border-l-4 shadow-sm"
                    style={{
                      borderLeftColor: index === 0 ? "#3b82f6" : "#94a3b8",
                    }}
                  >
                    <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {result.condition}
                        </CardTitle>
                        <div className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Probability: {Math.round(result.probability * 100)}%
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">
                        {result.description}
                      </p>

                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Recommendations:
                        </h4>
                        <ul className="text-sm space-y-2">
                          {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="rounded-full bg-green-500 p-1 mt-1 flex-shrink-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="8"
                                  height="8"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {diagnosisText && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        AI Analysis Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600 whitespace-pre-wrap">
                        {diagnosisText}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-amber-800 mb-1">
                        Important Disclaimer
                      </h3>
                      <p className="text-xs text-amber-700">
                        This AI-generated diagnosis is for informational
                        purposes only and does not constitute professional
                        medical advice, diagnosis, or treatment. Always seek the
                        advice of your physician or other qualified health
                        provider with any questions you may have regarding a
                        medical condition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <CardFooter className="mt-6 flex justify-between border-t pt-4 bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setActiveTab("followUp")}
              >
                Back
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleReset}>
                  Start New Diagnosis
                </Button>
                <Button
                  onClick={handleSaveReport}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Save Report
                </Button>
              </div>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Fallback diagnosis results for when API is not available
const DIAGNOSIS_RESULTS: Record<string, DiagnosisResult[]> = {
  // Headache + Fever
  "1,2": [
    {
      condition: "Common Cold",
      probability: 0.65,
      description:
        "The common cold is a viral infection of your nose and throat. It's usually harmless, although it might not feel that way.",
      recommendations: [
        "Rest and stay hydrated",
        "Over-the-counter pain relievers",
        "Saline nasal spray",
        "Consult a doctor if symptoms worsen or persist beyond a week",
      ],
    },
    {
      condition: "Influenza (Flu)",
      probability: 0.25,
      description:
        "Influenza is a viral infection that attacks your respiratory system — your nose, throat and lungs.",
      recommendations: [
        "Rest and stay hydrated",
        "Over-the-counter fever reducers",
        "Antiviral medications (if prescribed by a doctor)",
        "Seek medical attention if symptoms are severe or you're in a high-risk group",
      ],
    },
  ],
  // Cough + Shortness of breath
  "3,5": [
    {
      condition: "Acute Bronchitis",
      probability: 0.55,
      description:
        "Bronchitis is an inflammation of the lining of your bronchial tubes, which carry air to and from your lungs.",
      recommendations: [
        "Rest and stay hydrated",
        "Over-the-counter cough suppressants",
        "Humidifier to ease breathing",
        "Consult a doctor if symptoms persist beyond 3 weeks or if you have recurring bronchitis",
      ],
    },
    {
      condition: "COVID-19",
      probability: 0.35,
      description:
        "COVID-19 is a respiratory illness caused by the SARS-CoV-2 virus. Symptoms range from mild to severe.",
      recommendations: [
        "Get tested for COVID-19",
        "Self-isolate to prevent spreading the virus",
        "Rest and stay hydrated",
        "Seek immediate medical attention if you have trouble breathing or persistent chest pain",
      ],
    },
  ],
  // Default for any other combination
  default: [
    {
      condition: "Multiple Possible Conditions",
      probability: 0.5,
      description:
        "Based on your symptoms, there are several possible conditions. More information is needed for a more accurate assessment.",
      recommendations: [
        "Monitor your symptoms and note any changes",
        "Rest and stay hydrated",
        "Consult with a healthcare professional for a proper diagnosis",
        "Seek immediate medical attention if symptoms worsen significantly",
      ],
    },
  ],
};

export default DiagnosisFeature;

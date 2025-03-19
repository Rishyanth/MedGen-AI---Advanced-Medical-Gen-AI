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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { createActivity } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface Symptom {
  id: string;
  name: string;
  selected: boolean;
  severity?: number;
  duration?: string;
}

const DiagnosisForm = () => {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { id: "1", name: "Headache", selected: false, severity: 5 },
    { id: "2", name: "Fever", selected: false, severity: 5 },
    { id: "3", name: "Cough", selected: false, severity: 5 },
    { id: "4", name: "Fatigue", selected: false, severity: 5 },
    { id: "5", name: "Shortness of breath", selected: false, severity: 5 },
    { id: "6", name: "Nausea", selected: false, severity: 5 },
    { id: "7", name: "Dizziness", selected: false, severity: 5 },
    { id: "8", name: "Chest pain", selected: false, severity: 5 },
    { id: "9", name: "Abdominal pain", selected: false, severity: 5 },
    { id: "10", name: "Joint pain", selected: false, severity: 5 },
  ]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSymptomToggle = (id: string) => {
    setSymptoms(
      symptoms.map((symptom) =>
        symptom.id === id
          ? { ...symptom, selected: !symptom.selected }
          : symptom,
      ),
    );
  };

  const handleSeverityChange = (id: string, value: number[]) => {
    setSymptoms(
      symptoms.map((symptom) =>
        symptom.id === id ? { ...symptom, severity: value[0] } : symptom,
      ),
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim()) {
      const newSymptom: Symptom = {
        id: `custom-${Date.now()}`,
        name: customSymptom.trim(),
        selected: true,
        severity: 5,
      };
      setSymptoms([...symptoms, newSymptom]);
      setCustomSymptom("");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // In a real app, this would call an API endpoint
    // For now, we'll simulate a response with a timeout
    setTimeout(async () => {
      const selectedSymptoms = symptoms.filter((s) => s.selected);

      // Generate a mock diagnosis based on symptoms
      const mockDiagnosis = generateMockDiagnosis(selectedSymptoms);
      setDiagnosisResult(mockDiagnosis);
      setIsLoading(false);
      setStep(3);

      // Log this diagnosis in activities
      if (user) {
        try {
          await createActivity({
            user_id: user.id,
            title: "AI Diagnosis",
            description: `Diagnosis for ${selectedSymptoms.map((s) => s.name).join(", ")}.`,
            type: "diagnosis",
            status: "completed",
          });
        } catch (error) {
          console.error("Error logging diagnosis activity:", error);
        }
      }
    }, 3000);
  };

  const generateMockDiagnosis = (selectedSymptoms: Symptom[]) => {
    // This is a mock function - in a real app, you would use a trained ML model
    const hasHeadache = selectedSymptoms.some((s) =>
      s.name.toLowerCase().includes("headache"),
    );
    const hasFever = selectedSymptoms.some((s) =>
      s.name.toLowerCase().includes("fever"),
    );
    const hasCough = selectedSymptoms.some((s) =>
      s.name.toLowerCase().includes("cough"),
    );
    const hasFatigue = selectedSymptoms.some((s) =>
      s.name.toLowerCase().includes("fatigue"),
    );
    const hasBreathingIssues = selectedSymptoms.some(
      (s) =>
        s.name.toLowerCase().includes("breath") ||
        s.name.toLowerCase().includes("breathing"),
    );
    const hasChestPain = selectedSymptoms.some((s) =>
      s.name.toLowerCase().includes("chest"),
    );

    if (hasFever && hasCough && hasFatigue) {
      if (hasBreathingIssues) {
        return {
          primaryCondition: "Possible COVID-19 or Respiratory Infection",
          confidence: 0.85,
          description:
            "Your symptoms are consistent with COVID-19 or another respiratory infection. These conditions can cause fever, cough, fatigue, and breathing difficulties.",
          recommendations: [
            "Get tested for COVID-19",
            "Self-isolate until you receive your test results",
            "Rest and stay hydrated",
            "Monitor your oxygen levels if possible",
            "Seek immediate medical attention if you experience severe breathing difficulties",
          ],
          differentialDiagnoses: [
            { condition: "COVID-19", probability: "High" },
            { condition: "Influenza", probability: "Medium" },
            { condition: "Pneumonia", probability: "Medium" },
            { condition: "Bronchitis", probability: "Low" },
          ],
        };
      } else {
        return {
          primaryCondition: "Possible Influenza (Flu)",
          confidence: 0.78,
          description:
            "Your symptoms suggest you may have influenza (the flu). The flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.",
          recommendations: [
            "Rest and stay hydrated",
            "Take over-the-counter fever reducers if needed",
            "Avoid contact with others to prevent spreading the illness",
            "Consult with a healthcare provider, especially if symptoms worsen",
          ],
          differentialDiagnoses: [
            { condition: "Influenza", probability: "High" },
            { condition: "Common Cold", probability: "Medium" },
            { condition: "COVID-19", probability: "Medium" },
            { condition: "Seasonal Allergies", probability: "Low" },
          ],
        };
      }
    } else if (hasHeadache && hasFatigue) {
      return {
        primaryCondition: "Possible Migraine or Tension Headache",
        confidence: 0.72,
        description:
          "Your symptoms are consistent with a migraine or tension headache. These conditions can cause head pain, fatigue, and sometimes sensitivity to light and sound.",
        recommendations: [
          "Rest in a quiet, dark room",
          "Apply cold or warm compresses to your head",
          "Stay hydrated",
          "Consider over-the-counter pain relievers",
          "Consult with a healthcare provider if headaches are severe or recurring",
        ],
        differentialDiagnoses: [
          { condition: "Tension Headache", probability: "High" },
          { condition: "Migraine", probability: "Medium" },
          { condition: "Dehydration", probability: "Medium" },
          { condition: "Sinusitis", probability: "Low" },
        ],
      };
    } else if (hasChestPain && hasBreathingIssues) {
      return {
        primaryCondition: "Possible Cardiac or Pulmonary Issue",
        confidence: 0.9,
        description:
          "Chest pain combined with breathing difficulties could indicate a serious cardiac or pulmonary condition that requires immediate medical attention.",
        recommendations: [
          "Seek emergency medical care immediately",
          "Do not drive yourself to the hospital",
          "If available, take aspirin if heart attack is suspected (unless allergic)",
          "Try to remain calm and take slow, deep breaths",
        ],
        differentialDiagnoses: [
          { condition: "Angina/Heart Attack", probability: "High" },
          { condition: "Pulmonary Embolism", probability: "Medium" },
          { condition: "Pneumonia", probability: "Medium" },
          { condition: "Anxiety Attack", probability: "Low" },
        ],
      };
    } else {
      // Default generic response
      return {
        primaryCondition: "Non-specific Symptoms",
        confidence: 0.6,
        description:
          "Based on the symptoms you've provided, there are several possible conditions that could be causing your discomfort. Your symptoms are somewhat general and could be associated with various conditions.",
        recommendations: [
          "Monitor your symptoms for any changes",
          "Ensure you're getting adequate rest and staying hydrated",
          "Consider consulting with a healthcare provider if symptoms persist or worsen",
          "Keep a symptom diary to track any patterns or triggers",
        ],
        differentialDiagnoses: [
          { condition: "Viral Infection", probability: "Medium" },
          { condition: "Stress/Fatigue", probability: "Medium" },
          { condition: "Seasonal Allergies", probability: "Low" },
          { condition: "Vitamin Deficiency", probability: "Low" },
        ],
      };
    }
  };

  const nextStep = () => {
    if (step === 1 && symptoms.some((s) => s.selected)) {
      setStep(2);
    } else if (step === 2) {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSymptoms(symptoms.map((s) => ({ ...s, selected: false, severity: 5 })));
    setAge("");
    setGender("");
    setMedicalHistory("");
    setCurrentMedications("");
    setAdditionalNotes("");
    setDiagnosisResult(null);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>
          {step === 1 && "Step 1: Select Your Symptoms"}
          {step === 2 && "Step 2: Additional Information"}
          {step === 3 && "Diagnosis Results"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="space-y-2 border rounded-md p-3"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`symptom-${symptom.id}`}
                      checked={symptom.selected}
                      onCheckedChange={() => handleSymptomToggle(symptom.id)}
                    />
                    <Label
                      htmlFor={`symptom-${symptom.id}`}
                      className="font-medium"
                    >
                      {symptom.name}
                    </Label>
                  </div>
                  {symptom.selected && (
                    <div className="pt-2">
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        Severity: {symptom.severity}/10
                      </Label>
                      <Slider
                        value={[symptom.severity || 5]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) =>
                          handleSeverityChange(symptom.id, value)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="custom-symptom">Add another symptom</Label>
                <Input
                  id="custom-symptom"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder="Enter symptom"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddCustomSymptom}
                disabled={!customSymptom.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-history">Medical History</Label>
              <Textarea
                id="medical-history"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Enter any relevant medical history (e.g., diabetes, hypertension, etc.)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-medications">Current Medications</Label>
              <Textarea
                id="current-medications"
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                placeholder="List any medications you are currently taking"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-notes">Additional Notes</Label>
              <Textarea
                id="additional-notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any additional information you'd like to provide"
              />
            </div>
          </div>
        )}

        {step === 3 && diagnosisResult && (
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold text-primary">
                {diagnosisResult.primaryCondition}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Confidence: {Math.round(diagnosisResult.confidence * 100)}%
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700">{diagnosisResult.description}</p>
            </div>

            <Tabs defaultValue="recommendations">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="differential">
                  Differential Diagnoses
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recommendations" className="pt-4">
                <ul className="space-y-2">
                  {diagnosisResult.recommendations.map(
                    (rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{rec}</span>
                      </li>
                    ),
                  )}
                </ul>
              </TabsContent>
              <TabsContent value="differential" className="pt-4">
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2 font-medium">Condition</th>
                        <th className="text-left p-2 font-medium">
                          Probability
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnosisResult.differentialDiagnoses.map(
                        (diag: any, i: number) => (
                          <tr key={i} className="border-t">
                            <td className="p-2">{diag.condition}</td>
                            <td className="p-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  diag.probability === "High"
                                    ? "bg-green-100 text-green-800"
                                    : diag.probability === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {diag.probability}
                              </span>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
              <p className="text-sm font-medium">
                Important Disclaimer: This is an AI-generated diagnosis and
                should not replace professional medical advice. Please consult
                with a healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">
              Analyzing your symptoms...
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step < 3 ? (
          <>
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1 || isLoading}
            >
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={
                (step === 1 && !symptoms.some((s) => s.selected)) || isLoading
              }
            >
              {step === 2 ? "Submit" : "Next"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={resetForm}>
              Start New Diagnosis
            </Button>
            <Button variant="secondary">Download Report</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default DiagnosisForm;

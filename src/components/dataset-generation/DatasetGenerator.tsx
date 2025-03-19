import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createActivity } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface DatasetConfig {
  datasetType: string;
  recordCount: number;
  includeImages: boolean;
  anonymizationLevel: string;
  dataFields: string[];
  diseaseCategory?: string;
  ageRange: [number, number];
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
}

const DatasetGenerator = () => {
  const [config, setConfig] = useState<DatasetConfig>({
    datasetType: "patient-records",
    recordCount: 100,
    includeImages: false,
    anonymizationLevel: "full",
    dataFields: ["demographics", "vitals", "medications"],
    diseaseCategory: "general",
    ageRange: [18, 80],
    genderDistribution: {
      male: 50,
      female: 50,
      other: 0,
    },
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDataset, setGeneratedDataset] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("configure");
  const { user } = useAuth();

  const datasetTypes = [
    { value: "patient-records", label: "Patient Records" },
    { value: "lab-results", label: "Laboratory Results" },
    { value: "medical-imaging", label: "Medical Imaging Data" },
    { value: "clinical-trials", label: "Clinical Trials Data" },
  ];

  const diseaseCategories = [
    { value: "general", label: "General Health" },
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" },
    { value: "oncology", label: "Oncology" },
    { value: "pulmonology", label: "Pulmonology" },
    { value: "endocrinology", label: "Endocrinology" },
  ];

  const dataFields = [
    { value: "demographics", label: "Demographics" },
    { value: "vitals", label: "Vital Signs" },
    { value: "medications", label: "Medications" },
    { value: "allergies", label: "Allergies" },
    { value: "diagnoses", label: "Diagnoses" },
    { value: "procedures", label: "Procedures" },
    { value: "lab-results", label: "Lab Results" },
    { value: "imaging", label: "Imaging Reports" },
  ];

  const handleDataFieldToggle = (field: string) => {
    setConfig((prev) => {
      const updatedFields = prev.dataFields.includes(field)
        ? prev.dataFields.filter((f) => f !== field)
        : [...prev.dataFields, field];
      return { ...prev, dataFields: updatedFields };
    });
  };

  const handleAgeRangeChange = (values: number[]) => {
    setConfig((prev) => ({ ...prev, ageRange: [values[0], values[1]] }));
  };

  const handleGenderDistributionChange = (gender: keyof typeof config.genderDistribution, value: number) => {
    setConfig((prev) => {
      const newDistribution = { ...prev.genderDistribution, [gender]: value };
      
      // Ensure total is 100%
      const total = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
      if (total !== 100) {
        const otherGenders = Object.keys(newDistribution).filter(g => g !== gender) as Array<keyof typeof newDistribution>;
        const remainingPercentage = 100 - value;
        
        if (otherGenders.length === 1) {
          newDistribution[otherGenders[0]] = remainingPercentage;
        } else {
          // Distribute remaining percentage proportionally
          const currentOtherTotal = otherGenders.reduce((sum, g) => sum + newDistribution[g], 0);
          if (currentOtherTotal > 0) {
            otherGenders.forEach(g => {
              newDistribution[g] = Math.round((newDistribution[g] / currentOtherTotal) * remainingPercentage);
            });
            
            // Adjust for rounding errors
            const newTotal = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
            if (newTotal !== 100) {
              newDistribution[otherGenders[0]] += (100 - newTotal);
            }
          } else {
            // If other genders are all 0, distribute evenly
            otherGenders.forEach(g => {
              newDistribution[g] = Math.floor(remainingPercentage / otherGenders.length);
            });
            // Add remainder to first gender
            const newTotal = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
            newDistribution[otherGenders[0]] += (100 - newTotal);
          }
        }
      }
      
      return { ...prev, genderDistribution: newDistribution };
    });
  };

  const handleGenerateDataset = async () => {
    setIsGenerating(true);
    
    // In a real app, this would call an API endpoint
    // For now, we'll simulate a response with a timeout
    setTimeout(async () => {
      const mockDataset = generateMockDataset();
      setGeneratedDataset(mockDataset);
      setIsGenerating(false);
      setActiveTab("preview");
      
      // Log this activity
      if (user) {
        try {
          await createActivity({
            user_id: user.id,
            title: "Dataset Generation",
            description: `Generated ${config.recordCount} ${config.datasetType} records`,
            type: "analysis",
            status: "completed",
          });
        } catch (error) {
          console.error("Error logging dataset generation activity:", error);
        }
      }
    }, 3000);
  };

  const generateMockDataset = () => {
    // This is a mock function - in a real app, you would use GANs or other generative models
    const records = [];
    
    // Generate sample records based on configuration
    for (let i = 0; i < Math.min(10, config.recordCount); i++) {
      const record: any = { id: `P${1000 + i}` };
      
      // Add demographics if selected
      if (config.dataFields.includes("demographics")) {
        // Determine gender based on distribution
        const genderRandom = Math.random() * 100;
        let gender;
        if (genderRandom < config.genderDistribution.male) {
          gender = "Male";
        } else if (genderRandom < config.genderDistribution.male + config.genderDistribution.female) {
          gender = "Female";
        } else {
          gender = "Other";
        }
        
        // Generate random age within range
        const age = Math.floor(Math.random() * (config.ageRange[1] - config.ageRange[0] + 1)) + config.ageRange[0];
        
        record.demographics = {
          age,
          gender,
          ethnicity: ["Caucasian", "African American", "Hispanic", "Asian", "Other"][Math.floor(Math.random() * 5)],
        };
      }
      
      // Add vitals if selected
      if (config.dataFields.includes("vitals")) {
        record.vitals = {
          heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
          bloodPressure: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 20) + 60}`, // 100-140/60-80 mmHg
          temperature: (Math.random() * 1.5 + 36).toFixed(1), // 36-37.5 °C
          respiratoryRate: Math.floor(Math.random() * 8) + 12, // 12-20 breaths/min
          oxygenSaturation: Math.floor(Math.random() * 5) + 95, // 95-100%
        };
      }
      
      // Add medications if selected
      if (config.dataFields.includes("medications")) {
        const medications = [
          "Lisinopril", "Atorvastatin", "Levothyroxine", "Metformin", 
          "Amlodipine", "Metoprolol", "Omeprazole", "Albuterol", 
          "Gabapentin", "Hydrochlorothiazide"
        ];
        
        const numMeds = Math.floor(Math.random() * 4); // 0-3 medications
        const patientMeds = [];
        
        for (let j = 0; j < numMeds; j++) {
          const randomMed = medications[Math.floor(Math.random() * medications.length)];
          if (!patientMeds.includes(randomMed)) {
            patientMeds.push(randomMed);
          }
        }
        
        record.medications = patientMeds.map(med => ({
          name: med,
          dosage: `${[5, 10, 20, 25, 50, 100][Math.floor(Math.random() * 6)]} mg`,
          frequency: ["Once daily", "Twice daily", "Three times daily", "As needed"][Math.floor(Math.random() * 4)],
        }));
      }
      
      // Add diagnoses if selected
      if (config.dataFields.includes("diagnoses")) {
        const diagnoses = {
          general: ["Hypertension", "Type 2 Diabetes", "Obesity", "GERD", "Osteoarthritis"],
          cardiology: ["Atrial Fibrillation", "Coronary Artery Disease", "Heart Failure", "Hypertension", "Mitral Valve Prolapse"],
          neurology: ["Migraine", "Epilepsy", "Multiple Sclerosis", "Parkinson's Disease", "Alzheimer's Disease"],
          oncology: ["Breast Cancer", "Prostate Cancer", "Lung Cancer", "Colorectal Cancer", "Lymphoma"],
          pulmonology: ["Asthma", "COPD", "Sleep Apnea", "Pulmonary Fibrosis", "Pneumonia"],
          endocrinology: ["Type 1 Diabetes", "Type 2 Diabetes", "Hypothyroidism", "Hyperthyroidism", "Cushing's Syndrome"],
        };
        
        const category = config.diseaseCategory || "general";
        const availableDiagnoses = diagnoses[category as keyof typeof diagnoses] || diagnoses.general;
        
        const numDiagnoses = Math.floor(Math.random() * 3); // 0-2 diagnoses
        const patientDiagnoses = [];
        
        for (let j = 0; j < numDiagnoses; j++) {
          const randomDiagnosis = availableDiagnoses[Math.floor(Math.random() * availableDiagnoses.length)];
          if (!patientDiagnoses.includes(randomDiagnosis)) {
            patientDiagnoses.push(randomDiagnosis);
          }
        }
        
        record.diagnoses = patientDiagnoses.map(diagnosis => ({
          condition: diagnosis,
          diagnosisDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Random date within last year
          status: ["Active", "Resolved", "Managed"][Math.floor(Math.random() * 3)],
        }));
      }
      
      // Add lab results if selected
      if (config.dataFields.includes("lab-results")) {
        record.labResults = [
          {
            test: "Complete Blood Count",
            components: [
              { name: "WBC", value: (Math.random() * 6 + 4).toFixed(1), units: "x10^9/L", reference: "4.5-11.0" },
              { name: "RBC", value: (Math.random() * 1 + 4).toFixed(1), units: "x10^12/L", reference: "4.5-5.5" },
              { name: "Hemoglobin", value: (Math.random() * 3 + 12).toFixed(1), units: "g/dL", reference: "13.5-17.5" },
              { name: "Hematocrit", value: (Math.random() * 10 + 37).toFixed(1), units: "%", reference: "41-50" },
              { name: "Platelets", value: Math.floor(Math.random() * 150 + 150), units: "x10^9/L", reference: "150-450" },
            ],
            date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Random date within last month
          },
          {
            test: "Basic Metabolic Panel",
            components: [
              { name: "Glucose", value: Math.floor(Math.random() * 50 + 70), units: "mg/dL", reference: "70-99" },
              { name: "Calcium", value: (Math.random() * 1 + 8.5).toFixed(1), units: "mg/dL", reference: "8.5-10.2" },
              { name: "Sodium", value: Math.floor(Math.random() * 10 + 135), units: "mmol/L", reference: "135-145" },
              { name: "Potassium", value: (Math.random() * 1.5 + 3.5).toFixed(1), units: "mmol/L", reference: "3.5-5.0" },
              { name: "Creatinine", value: (Math.random() * 0.5 + 0.6).toFixed(1), units: "mg/dL", reference: "0.6-1.2" },
            ],
            date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Random date within last month
          },
        ];
      }
      
      records.push(record);
    }
    
    return {
      metadata: {
        datasetType: config.datasetType,
        recordCount: config.recordCount,
        generatedAt: new Date().toISOString(),
        anonymizationLevel: config.anonymizationLevel,
        dataFields: config.dataFields,
        diseaseCategory: config.diseaseCategory,
      },
      records,
      totalRecords: config.recordCount,
      previewRecords: records.length,
    };
  };

  const handleDownload = () => {
    if (!generatedDataset) return;
    
    // Create a JSON blob and download it
    const dataStr = JSON.stringify(generatedDataset, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `medical-dataset-${config.datasetType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetGenerator = () => {
    setConfig({
      datasetType: "patient-records",
      recordCount: 100,
      includeImages: false,
      anonymizationLevel: "full",
      dataFields: ["demographics", "vitals", "medications"],
      diseaseCategory: "general",
      ageRange: [18, 80],
      genderDistribution: {
        male: 50,
        female: 50,
        other: 0,
      },
    });
    setGeneratedDataset(null);
    setActiveTab("configure");
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Synthetic Medical Dataset Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="configure" disabled={isGenerating}>
              Configure
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedDataset || isGenerating}>
              Preview Dataset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dataset-type">Dataset Type</Label>
                  <Select
                    value={config.datasetType}
                    onValueChange={(value) => setConfig({ ...config, datasetType: value })}
                  >
                    <SelectTrigger id="dataset-type">
                      <SelectValue placeholder="Select dataset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasetTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="disease-category">Disease Category</Label>
                  <Select
                    value={config.diseaseCategory}
                    onValueChange={(value) => setConfig({ ...config, diseaseCategory: value })}
                  >
                    <SelectTrigger id="disease-category">
                      <SelectValue placeholder="Select disease category" />
                    </SelectTrigger>
                    <SelectContent>
                      {diseaseCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="record-count">Number of Records: {config.recordCount}</Label>
                  <Slider
                    id="record-count"
                    min={10}
                    max={1000}
                    step={10}
                    value={[config.recordCount]}
                    onValueChange={(values) => setConfig({ ...config, recordCount: values[0] })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="anonymization">Anonymization Level</Label>
                  <Select
                    value={config.anonymizationLevel}
                    onValueChange={(value) => setConfig({ ...config, anonymizationLevel: value })}
                  >
                    <SelectTrigger id="anonymization">
                      <SelectValue placeholder="Select anonymization level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Includes Identifiers)</SelectItem>
                      <SelectItem value="partial">Partial (Limited Identifiers)</SelectItem>
                      <SelectItem value="full">Full (No Identifiers)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-images"
                    checked={config.includeImages}
                    onCheckedChange={(checked) => setConfig({ ...config, includeImages: checked })}
                  />
                  <Label htmlFor="include-images">Include Synthetic Images</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Data Fields to Include</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dataFields.map((field) => (
                      <div key={field.value} className="flex items-center space-x-2">
                        <Switch
                          id={`field-${field.value}`}
                          checked={config.dataFields.includes(field.value)}
                          onCheckedChange={() => handleDataFieldToggle(field.value)}
                        />
                        <Label htmlFor={`field-${field.value}`}>{field.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Age Range: {config.ageRange[0]} - {config.ageRange[1]} years</Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[config.ageRange[0], config.ageRange[1]]}
                    onValueChange={handleAgeRangeChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="block">Gender Distribution</Label>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="male-percent">Male: {config.genderDistribution.male}%</Label>
                      </div>
                      <Slider
                        id="male-percent"
                        min={0}
                        max={100}
                        step={1}
                        value={[config.genderDistribution.male]}
                        onValueChange={(values) => handleGenderDistributionChange("male", values[0])}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="female-percent">Female: {config.genderDistribution.female}%</Label>
                      </div>
                      <Slider
                        id="female-percent"
                        min
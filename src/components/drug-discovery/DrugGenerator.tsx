import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createActivity } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  FlaskConical,
  Download,
  RotateCw,
  Dna,
  Pill,
  Activity,
} from "lucide-react";

interface DrugCandidate {
  id: string;
  name: string;
  smiles: string;
  molecularWeight: number;
  logP: number;
  hDonors: number;
  hAcceptors: number;
  rotBonds: number;
  bioactivityScore: number;
  drugLikeness: number;
  syntheticAccessibility: number;
  predictedTargets: string[];
  potentialSideEffects: string[];
  imageUrl: string;
}

const DrugGenerator = () => {
  const [inputMethod, setInputMethod] = useState<"smiles" | "disease">(
    "disease",
  );
  const [smilesInput, setSmilesInput] = useState("");
  const [diseaseInput, setDiseaseInput] = useState("");
  const [targetType, setTargetType] = useState("enzyme");
  const [optimizationGoals, setOptimizationGoals] = useState<string[]>([
    "potency",
    "selectivity",
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDrugs, setGeneratedDrugs] = useState<DrugCandidate[] | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("input");
  const { user } = useAuth();

  const targetTypes = [
    { value: "enzyme", label: "Enzyme" },
    { value: "receptor", label: "Receptor" },
    { value: "ion-channel", label: "Ion Channel" },
    { value: "transporter", label: "Transporter" },
    { value: "transcription-factor", label: "Transcription Factor" },
  ];

  const optimizationOptions = [
    { value: "potency", label: "Potency" },
    { value: "selectivity", label: "Selectivity" },
    { value: "bioavailability", label: "Bioavailability" },
    { value: "metabolic-stability", label: "Metabolic Stability" },
    { value: "toxicity-reduction", label: "Toxicity Reduction" },
    { value: "blood-brain-barrier", label: "Blood-Brain Barrier Penetration" },
  ];

  const handleOptimizationToggle = (goal: string) => {
    setOptimizationGoals((prev) => {
      if (prev.includes(goal)) {
        return prev.filter((g) => g !== goal);
      } else {
        return [...prev, goal];
      }
    });
  };

  const handleGenerateDrugs = async () => {
    if (
      (inputMethod === "smiles" && !smilesInput) ||
      (inputMethod === "disease" && !diseaseInput)
    ) {
      return;
    }

    setIsGenerating(true);

    // In a real app, this would call an API endpoint
    // For now, we'll simulate a response with a timeout
    setTimeout(async () => {
      const mockDrugs = generateMockDrugCandidates();
      setGeneratedDrugs(mockDrugs);
      setIsGenerating(false);
      setActiveTab("results");

      // Log this activity
      if (user) {
        try {
          await createActivity({
            user_id: user.id,
            title: "Drug Discovery",
            description: `Generated drug candidates from ${inputMethod === "smiles" ? "SMILES" : "disease description"}`,
            type: "analysis",
            status: "completed",
          });
        } catch (error) {
          console.error("Error logging drug discovery activity:", error);
        }
      }
    }, 3000);
  };

  const generateMockDrugCandidates = (): DrugCandidate[] => {
    // This is a mock function - in a real app, you would use ML models
    const candidates: DrugCandidate[] = [];

    // Generate 5 mock drug candidates
    for (let i = 0; i < 5; i++) {
      const id = `DC-${Date.now()}-${i}`;

      // Generate properties based on input method and optimization goals
      let bioactivityScore = Math.random() * 0.5 + 0.5; // 0.5-1.0
      let drugLikeness = Math.random() * 0.6 + 0.4; // 0.4-1.0
      let syntheticAccessibility = Math.random() * 0.7 + 0.3; // 0.3-1.0

      // Adjust scores based on optimization goals
      if (optimizationGoals.includes("potency")) {
        bioactivityScore += 0.2;
        if (bioactivityScore > 1) bioactivityScore = 1;
      }

      if (optimizationGoals.includes("bioavailability")) {
        drugLikeness += 0.15;
        if (drugLikeness > 1) drugLikeness = 1;
      }

      // Generate mock SMILES
      let smiles = "";
      if (inputMethod === "smiles" && smilesInput) {
        // Modify the input SMILES slightly
        smiles =
          smilesInput.replace(/C/g, "CC").substring(0, 10) +
          "O" +
          smilesInput.substring(10, 20);
      } else {
        // Generate random SMILES-like string
        const elements = ["C", "N", "O", "S", "P"];
        const bonds = ["", "=", "#"];
        let mockSmiles = "";
        for (let j = 0; j < 15; j++) {
          const element = elements[Math.floor(Math.random() * elements.length)];
          const bond = bonds[Math.floor(Math.random() * bonds.length)];
          mockSmiles += element + bond;
        }
        smiles = mockSmiles;
      }

      // Generate disease-specific names if disease input is used
      let name = "";
      if (inputMethod === "disease" && diseaseInput) {
        const prefix = ["Novo", "Zeta", "Evo", "Medi", "Bio"][i];
        const suffix = ["zumab", "tinib", "stat", "mab", "nib"][i];
        name = `${prefix}${diseaseInput.substring(0, 3).toLowerCase()}${suffix}`;
      } else {
        const prefixes = ["Evo", "Neo", "Syn", "Tera", "Omni"];
        const suffixes = ["zole", "vir", "mab", "nib", "stat"];
        name = `${prefixes[i]}${suffixes[i]}`;
      }

      // Generate mock targets based on target type
      const targets = [];
      if (targetType === "enzyme") {
        targets.push("Tyrosine Kinase", "Phosphodiesterase");
      } else if (targetType === "receptor") {
        targets.push("Serotonin Receptor", "Dopamine Receptor");
      } else if (targetType === "ion-channel") {
        targets.push("Sodium Channel", "Potassium Channel");
      } else {
        targets.push("Protein Transporter", "Nuclear Receptor");
      }

      // Generate mock side effects
      const allSideEffects = [
        "Headache",
        "Nausea",
        "Dizziness",
        "Fatigue",
        "Insomnia",
        "Dry Mouth",
        "Rash",
        "Constipation",
        "Diarrhea",
        "Vomiting",
      ];
      const sideEffects = [];
      const numSideEffects = Math.floor(Math.random() * 3) + 1; // 1-3 side effects
      for (let j = 0; j < numSideEffects; j++) {
        const effect =
          allSideEffects[Math.floor(Math.random() * allSideEffects.length)];
        if (!sideEffects.includes(effect)) {
          sideEffects.push(effect);
        }
      }

      candidates.push({
        id,
        name,
        smiles,
        molecularWeight: Math.floor(Math.random() * 300) + 200, // 200-500 Da
        logP: parseFloat((Math.random() * 5 - 1).toFixed(2)), // -1 to 4
        hDonors: Math.floor(Math.random() * 5) + 1, // 1-5
        hAcceptors: Math.floor(Math.random() * 8) + 2, // 2-10
        rotBonds: Math.floor(Math.random() * 8) + 1, // 1-8
        bioactivityScore,
        drugLikeness,
        syntheticAccessibility,
        predictedTargets: targets,
        potentialSideEffects: sideEffects,
        imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${name}`, // Placeholder for molecular structure
      });
    }

    return candidates;
  };

  const handleDownload = (format: "json" | "csv") => {
    if (!generatedDrugs) return;

    let content = "";
    let filename = "";

    if (format === "json") {
      content = JSON.stringify(generatedDrugs, null, 2);
      filename = "drug-candidates.json";
    } else {
      // Create CSV header
      const headers = [
        "id",
        "name",
        "smiles",
        "molecularWeight",
        "logP",
        "hDonors",
        "hAcceptors",
        "rotBonds",
        "bioactivityScore",
        "drugLikeness",
        "syntheticAccessibility",
      ];
      content = headers.join(",") + "\n";

      // Add data rows
      generatedDrugs.forEach((drug) => {
        const row = [
          drug.id,
          drug.name,
          drug.smiles,
          drug.molecularWeight,
          drug.logP,
          drug.hDonors,
          drug.hAcceptors,
          drug.rotBonds,
          drug.bioactivityScore,
          drug.drugLikeness,
          drug.syntheticAccessibility,
        ];
        content += row.join(",") + "\n";
      });

      filename = "drug-candidates.csv";
    }

    // Create a download link
    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetGenerator = () => {
    setSmilesInput("");
    setDiseaseInput("");
    setTargetType("enzyme");
    setOptimizationGoals(["potency", "selectivity"]);
    setGeneratedDrugs(null);
    setActiveTab("input");
  };

  const renderProgressBar = (value: number, label: string) => {
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>{label}</span>
          <span>{Math.round(value * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primary rounded-full"
            style={{ width: `${value * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          Drug Discovery & Generation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input" disabled={isGenerating}>
              Input Parameters
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!generatedDrugs || isGenerating}
            >
              Generated Candidates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="pt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Input Method</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${inputMethod === "smiles" ? "border-primary bg-primary/5" : "hover:bg-gray-50"}`}
                    onClick={() => setInputMethod("smiles")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Dna
                        className={`h-5 w-5 ${inputMethod === "smiles" ? "text-primary" : "text-gray-500"}`}
                      />
                      <h3 className="font-medium">SMILES Notation</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Enter a SMILES string for a known molecule to generate
                      similar compounds
                    </p>
                  </div>
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${inputMethod === "disease" ? "border-primary bg-primary/5" : "hover:bg-gray-50"}`}
                    onClick={() => setInputMethod("disease")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity
                        className={`h-5 w-5 ${inputMethod === "disease" ? "text-primary" : "text-gray-500"}`}
                      />
                      <h3 className="font-medium">Disease/Condition</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Describe a disease or condition to generate potential drug
                      candidates
                    </p>
                  </div>
                </div>
              </div>

              {inputMethod === "smiles" ? (
                <div className="space-y-2">
                  <Label htmlFor="smiles-input">SMILES Notation</Label>
                  <Input
                    id="smiles-input"
                    value={smilesInput}
                    onChange={(e) => setSmilesInput(e.target.value)}
                    placeholder="e.g. CC(=O)OC1=CC=CC=C1C(=O)O (Aspirin)"
                  />
                  <p className="text-xs text-gray-500">
                    Enter a valid SMILES notation for a molecule. The AI will
                    generate similar compounds with optimized properties.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="disease-input">Disease or Condition</Label>
                  <Textarea
                    id="disease-input"
                    value={diseaseInput}
                    onChange={(e) => setDiseaseInput(e.target.value)}
                    placeholder="e.g. Type 2 Diabetes, Alzheimer's Disease, Hypertension"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500">
                    Describe the disease, condition, or therapeutic target in
                    detail. The more specific you are, the better the results.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="target-type">Target Type</Label>
                <Select
                  value={targetType}
                  onValueChange={(value) => setTargetType(value)}
                >
                  <SelectTrigger id="target-type">
                    <SelectValue placeholder="Select target type" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="block mb-2">Optimization Goals</Label>
                <div className="grid grid-cols-2 gap-2">
                  {optimizationOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Switch
                        id={`goal-${option.value}`}
                        checked={optimizationGoals.includes(option.value)}
                        onCheckedChange={() =>
                          handleOptimizationToggle(option.value)
                        }
                      />
                      <Label htmlFor={`goal-${option.value}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="pt-6">
            {generatedDrugs && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Generated Drug Candidates
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("json")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("csv")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      CSV
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {generatedDrugs.map((drug) => (
                    <div
                      key={drug.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-primary/5 p-4 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-semibold flex items-center gap-2">
                              <Pill className="h-5 w-5 text-primary" />
                              {drug.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 font-mono">
                              {drug.smiles}
                            </p>
                          </div>
                          <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Candidate {generatedDrugs.indexOf(drug) + 1}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-3">
                            Molecular Properties
                          </h5>
                          <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-gray-50 p-2 rounded">
                                <span className="text-gray-500">
                                  Molecular Weight:
                                </span>
                                <span className="float-right font-medium">
                                  {drug.molecularWeight} Da
                                </span>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <span className="text-gray-500">LogP:</span>
                                <span className="float-right font-medium">
                                  {drug.logP}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <span className="text-gray-500">H-Donors:</span>
                                <span className="float-right font-medium">
                                  {drug.hDonors}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <span className="text-gray-500">
                                  H-Acceptors:
                                </span>
                                <span className="float-right font-medium">
                                  {drug.hAcceptors}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <span className="text-gray-500">
                                  Rotatable Bonds:
                                </span>
                                <span className="float-right font-medium">
                                  {drug.rotBonds}
                                </span>
                              </div>
                            </div>

                            <h5 className="font-medium mt-4 mb-2">
                              Predicted Scores
                            </h5>
                            <div className="space-y-2">
                              {renderProgressBar(
                                drug.bioactivityScore,
                                "Bioactivity Score",
                              )}
                              {renderProgressBar(
                                drug.drugLikeness,
                                "Drug-likeness",
                              )}
                              {renderProgressBar(
                                drug.syntheticAccessibility,
                                "Synthetic Accessibility",
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
                            <img
                              src={drug.imageUrl}
                              alt={`Molecular structure of ${drug.name}`}
                              className="h-32 w-32"
                            />
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">
                              Predicted Targets
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {drug.predictedTargets.map((target, i) => (
                                <span
                                  key={i}
                                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                                >
                                  {target}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">
                              Potential Side Effects
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {drug.potentialSideEffects.map((effect, i) => (
                                <span
                                  key={i}
                                  className="bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {effect}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                  <p className="text-sm">
                    <strong>Disclaimer:</strong> These are AI-generated drug
                    candidates for research purposes only. All molecules would
                    require extensive laboratory testing, optimization, and
                    clinical trials before any potential therapeutic use.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">
              Generating drug candidates...
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetGenerator}
          disabled={isGenerating}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={handleGenerateDrugs}
          disabled={
            isGenerating ||
            (inputMethod === "smiles" && !smilesInput) ||
            (inputMethod === "disease" && !diseaseInput)
          }
        >
          <FlaskConical className="h-4 w-4 mr-2" />
          Generate Candidates
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DrugGenerator;

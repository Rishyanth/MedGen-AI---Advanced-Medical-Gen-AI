import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  FlaskConical,
  Loader2,
  Download,
  FileText,
  Zap,
  AlertCircle,
  Dna,
} from "lucide-react";

type DrugCandidate = {
  id: string;
  name: string;
  smiles: string;
  molecularWeight: number;
  logP: number;
  hDonors: number;
  hAcceptors: number;
  rotBonds: number;
  polarSurfaceArea: number;
  drugLikeness: number;
  synthesizability: number;
  predictedActivity: number;
  targetProtein?: string;
  bindingAffinity?: number;
  toxicityRisk: "Low" | "Medium" | "High";
  sideEffects: string[];
};

type GenerationMethod = "smiles" | "disease" | "protein";

const DrugDiscoveryFeature = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [generationMethod, setGenerationMethod] =
    useState<GenerationMethod>("smiles");
  const [smilesInput, setSmilesInput] = useState("CC(=O)OC1=CC=CC=C1C(=O)O"); // Aspirin
  const [diseaseInput, setDiseaseInput] = useState("");
  const [proteinInput, setProteinInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [drugCandidates, setDrugCandidates] = useState<DrugCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<DrugCandidate | null>(null);
  const [numCandidates, setNumCandidates] = useState(3);
  const [optimizationTarget, setOptimizationTarget] = useState("potency");

  const handleGenerateDrugs = () => {
    if (
      (generationMethod === "smiles" && !smilesInput) ||
      (generationMethod === "disease" && !diseaseInput) ||
      (generationMethod === "protein" && !proteinInput)
    ) {
      alert("Please provide the required input");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setDrugCandidates([]);
    setSelectedCandidate(null);

    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const newProgress = prev + Math.random() * 8;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);

    // Simulate drug generation
    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);

      // Generate mock drug candidates
      const candidates = generateMockDrugCandidates(
        numCandidates,
        generationMethod,
      );
      setDrugCandidates(candidates);
      setSelectedCandidate(candidates[0]);
      setActiveTab("results");
      setIsGenerating(false);
    }, 5000);
  };

  const generateMockDrugCandidates = (
    count: number,
    method: GenerationMethod,
  ): DrugCandidate[] => {
    const candidates: DrugCandidate[] = [];

    // Common side effects
    const possibleSideEffects = [
      "Nausea",
      "Headache",
      "Dizziness",
      "Fatigue",
      "Insomnia",
      "Dry mouth",
      "Constipation",
      "Diarrhea",
      "Rash",
      "Itching",
      "Increased heart rate",
      "Decreased appetite",
      "Drowsiness",
      "Blurred vision",
    ];

    // Generate different candidates based on the method
    for (let i = 0; i < count; i++) {
      let smiles = "";
      let name = "";
      let targetProtein = "";

      if (method === "smiles") {
        // Modify the input SMILES slightly
        smiles = modifySMILES(smilesInput);
        name = `Modified Compound ${i + 1}`;
      } else if (method === "disease") {
        // Generate based on disease
        if (diseaseInput.toLowerCase().includes("diabetes")) {
          smiles = "CC1=CN(C(=O)NC1=O)C2C(C(C(O2)CO)O)O"; // Metformin-like
          name = `Anti-diabetic Compound ${i + 1}`;
          targetProtein = "Insulin Receptor";
        } else if (diseaseInput.toLowerCase().includes("hypertension")) {
          smiles = "CCOC(=O)C1=C(NC(=C(C1C(=O)OC)C(=O)OC)C)CCCN"; // ACE inhibitor-like
          name = `Anti-hypertensive Compound ${i + 1}`;
          targetProtein = "Angiotensin-Converting Enzyme";
        } else {
          smiles = `CC(C)(C)NC(=O)C1CC2CCCCC2CN1CC(C(CC3=CC=CC=C3)NC(=O)C(CC(=O)N)NC(=O)C)O`;
          name = `Disease-Targeted Compound ${i + 1}`;
          targetProtein = "Disease-Related Protein";
        }
      } else if (method === "protein") {
        // Generate based on protein target
        smiles = `O=C(N[C@@H](CC1=CC=CC=C1)C(=O)N2CCC[C@H]2C(=O)N[C@@H](CCCCN)C(=O)N[C@@H](CC(=O)N)C(=O)NCC(=O)N)C`;
        name = `Protein-Targeted Compound ${i + 1}`;
        targetProtein = proteinInput || "Custom Protein Target";
      }

      // Generate random but realistic properties
      const molecularWeight = 250 + Math.random() * 300;
      const logP = -0.5 + Math.random() * 5;
      const hDonors = Math.floor(Math.random() * 5) + 1;
      const hAcceptors = Math.floor(Math.random() * 8) + 2;
      const rotBonds = Math.floor(Math.random() * 10) + 1;
      const polarSurfaceArea = 40 + Math.random() * 100;

      // Calculate drug-likeness (Lipinski's Rule of Five)
      let drugLikeness = 1.0;
      if (molecularWeight > 500) drugLikeness -= 0.2;
      if (logP > 5) drugLikeness -= 0.2;
      if (hDonors > 5) drugLikeness -= 0.2;
      if (hAcceptors > 10) drugLikeness -= 0.2;
      drugLikeness = Math.max(0.1, drugLikeness);

      // Random synthesizability (higher is better)
      const synthesizability = 0.3 + Math.random() * 0.7;

      // Random predicted activity (higher is better)
      const predictedActivity = 0.4 + Math.random() * 0.6;

      // Random binding affinity (lower is better)
      const bindingAffinity = 1 + Math.random() * 100;

      // Random toxicity risk
      const toxicityOptions: ["Low", "Medium", "High"] = [
        "Low",
        "Medium",
        "High",
      ];
      const toxicityRisk =
        toxicityOptions[Math.floor(Math.random() * (i === 0 ? 2 : 3))];

      // Random side effects (fewer for better compounds)
      const numSideEffects =
        Math.floor(Math.random() * 4) +
        (toxicityRisk === "Low" ? 1 : toxicityRisk === "Medium" ? 2 : 3);
      const sideEffects = [];
      for (let j = 0; j < numSideEffects; j++) {
        const effect =
          possibleSideEffects[
            Math.floor(Math.random() * possibleSideEffects.length)
          ];
        if (!sideEffects.includes(effect)) {
          sideEffects.push(effect);
        }
      }

      candidates.push({
        id: `drug-${Date.now()}-${i}`,
        name,
        smiles,
        molecularWeight,
        logP,
        hDonors,
        hAcceptors,
        rotBonds,
        polarSurfaceArea,
        drugLikeness,
        synthesizability,
        predictedActivity,
        targetProtein,
        bindingAffinity,
        toxicityRisk,
        sideEffects,
      });
    }

    return candidates;
  };

  // Helper function to slightly modify SMILES strings
  const modifySMILES = (smiles: string): string => {
    // This is a very simplified modification - in reality, you'd need a chemistry library
    // to make valid modifications to molecular structures
    const parts = smiles.split("");

    // Make a small change to the SMILES string
    if (parts.includes("C") && Math.random() > 0.5) {
      const idx = parts.indexOf("C");
      if (Math.random() > 0.5 && idx > 0) {
        parts[idx] = "CC";
      }
    }

    // Potentially add a functional group
    if (Math.random() > 0.7) {
      if (smiles.includes("=O")) {
        return smiles.replace("=O", "=S"); // Replace an oxygen with sulfur
      } else if (smiles.includes("F")) {
        return smiles.replace("F", "Cl"); // Replace fluorine with chlorine
      } else {
        return smiles + "F"; // Add a fluorine
      }
    }

    return parts.join("");
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="results" disabled={drugCandidates.length === 0}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Drug Generation Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className={`cursor-pointer hover:shadow-md transition-all ${generationMethod === "smiles" ? "border-blue-500 bg-blue-50" : ""}`}
                  onClick={() => setGenerationMethod("smiles")}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Dna className="h-8 w-8 mb-2 text-blue-500" />
                    <h3 className="font-medium">SMILES Notation</h3>
                    <p className="text-sm text-gray-500">
                      Generate from molecular structure
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer hover:shadow-md transition-all ${generationMethod === "disease" ? "border-blue-500 bg-blue-50" : ""}`}
                  onClick={() => setGenerationMethod("disease")}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <AlertCircle className="h-8 w-8 mb-2 text-red-500" />
                    <h3 className="font-medium">Disease Target</h3>
                    <p className="text-sm text-gray-500">
                      Generate for specific disease
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer hover:shadow-md transition-all ${generationMethod === "protein" ? "border-blue-500 bg-blue-50" : ""}`}
                  onClick={() => setGenerationMethod("protein")}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Zap className="h-8 w-8 mb-2 text-purple-500" />
                    <h3 className="font-medium">Protein Target</h3>
                    <p className="text-sm text-gray-500">
                      Target specific proteins
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {generationMethod === "smiles" && (
                <div>
                  <Label htmlFor="smiles-input">SMILES Notation</Label>
                  <Textarea
                    id="smiles-input"
                    placeholder="Enter SMILES notation (e.g., CC(=O)OC1=CC=CC=C1C(=O)O for Aspirin)"
                    value={smilesInput}
                    onChange={(e) => setSmilesInput(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Example: CC(=O)OC1=CC=CC=C1C(=O)O (Aspirin)
                  </p>
                </div>
              )}

              {generationMethod === "disease" && (
                <div>
                  <Label htmlFor="disease-input">Disease or Condition</Label>
                  <Input
                    id="disease-input"
                    placeholder="Enter disease name (e.g., Diabetes, Hypertension)"
                    value={diseaseInput}
                    onChange={(e) => setDiseaseInput(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter a disease to find potential drug candidates
                  </p>
                </div>
              )}

              {generationMethod === "protein" && (
                <div>
                  <Label htmlFor="protein-input">Protein Target</Label>
                  <Input
                    id="protein-input"
                    placeholder="Enter protein target (e.g., ACE, EGFR)"
                    value={proteinInput}
                    onChange={(e) => setProteinInput(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter a protein target to find potential binding molecules
                  </p>
                </div>
              )}

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="num-candidates">Number of Candidates</Label>
                  <Select
                    value={numCandidates.toString()}
                    onValueChange={(value) => setNumCandidates(parseInt(value))}
                  >
                    <SelectTrigger id="num-candidates">
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Candidate</SelectItem>
                      <SelectItem value="3">3 Candidates</SelectItem>
                      <SelectItem value="5">5 Candidates</SelectItem>
                      <SelectItem value="10">10 Candidates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="optimization-target">
                    Optimization Target
                  </Label>
                  <Select
                    value={optimizationTarget}
                    onValueChange={setOptimizationTarget}
                  >
                    <SelectTrigger id="optimization-target">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="potency">Potency</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="bioavailability">
                        Bioavailability
                      </SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleGenerateDrugs}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating... {Math.round(generationProgress)}%
                  </>
                ) : (
                  "Generate Drug Candidates"
                )}
              </Button>
            </CardFooter>
          </Card>

          {isGenerating && (
            <Progress value={generationProgress} className="w-full" />
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Drug Candidates</h2>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("generate")}
            >
              Generate More
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {drugCandidates.map((drug) => (
              <Card
                key={drug.id}
                className={`cursor-pointer hover:shadow-md transition-all ${selectedCandidate?.id === drug.id ? "border-blue-500" : ""}`}
                onClick={() => setSelectedCandidate(drug)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{drug.name}</CardTitle>
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Score: {drug.drugLikeness.toFixed(2)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Molecular Properties</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">SMILES:</span>
                          <span className="font-mono text-xs">
                            {drug.smiles}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Molecular Weight:
                          </span>
                          <span>{drug.molecularWeight.toFixed(2)} g/mol</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">LogP:</span>
                          <span>{drug.logP.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">H-Bond Donors:</span>
                          <span>{drug.hDonors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            H-Bond Acceptors:
                          </span>
                          <span>{drug.hAcceptors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Rotatable Bonds:
                          </span>
                          <span>{drug.rotBonds}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Polar Surface Area:
                          </span>
                          <span>{drug.polarSurfaceArea.toFixed(1)} Å²</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Biological Activity</h3>
                      <div className="space-y-2 text-sm">
                        {drug.targetProtein && (
                          <div>
                            <span className="text-gray-500">
                              Target Protein:
                            </span>
                            <span className="ml-2">{drug.targetProtein}</span>
                          </div>
                        )}
                        {drug.bindingAffinity && (
                          <div>
                            <span className="text-gray-500">
                              Binding Affinity:
                            </span>
                            <span className="ml-2">
                              {drug.bindingAffinity.toFixed(1)} nM
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">
                            Predicted Activity:
                          </span>
                          <span className="ml-2">
                            {(drug.predictedActivity * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Synthesizability:
                          </span>
                          <span className="ml-2">
                            {(drug.synthesizability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Toxicity Risk:</span>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded text-xs ${drug.toxicityRisk === "Low" ? "bg-green-100 text-green-800" : drug.toxicityRisk === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                          >
                            {drug.toxicityRisk}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">
                            Potential Side Effects:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {drug.sideEffects.map((effect, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs"
                              >
                                {effect}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Data
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">
                  Research Use Only
                </h3>
                <p className="text-sm text-amber-700">
                  The compounds suggested are theoretical and would require
                  extensive laboratory testing, optimization, and clinical
                  trials before consideration as therapeutic agents.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DrugDiscoveryFeature;

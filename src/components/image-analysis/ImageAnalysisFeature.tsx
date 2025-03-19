import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Loader2,
  ZoomIn,
  RotateCw,
  Download,
} from "lucide-react";

type AnalysisResult = {
  type: "xray" | "mri" | "report";
  findings: string[];
  impression: string;
  confidence: number;
  detectedAreas?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    confidence: number;
  }[];
  extractedText?: string;
};

const ImageAnalysisFeature = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [imageType, setImageType] = useState<"xray" | "mri" | "report" | null>(
    null,
  );
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setActiveTab("preview");
    setImageType(null);
    setAnalysisResult(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageTypeSelect = (type: "xray" | "mri" | "report") => {
    setImageType(type);
  };

  const handleAnalyzeImage = () => {
    if (!imageType || !selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 500);

    // Simulate analysis completion
    setTimeout(() => {
      clearInterval(interval);
      setAnalysisProgress(100);

      // Generate mock results based on image type
      let result: AnalysisResult;

      if (imageType === "xray") {
        result = {
          type: "xray",
          findings: [
            "No acute cardiopulmonary process",
            "Heart size is normal",
            "Lungs are clear without focal consolidation",
            "No pleural effusion or pneumothorax",
            "No acute osseous abnormality",
          ],
          impression: "Normal chest radiograph",
          confidence: 0.92,
          detectedAreas: [
            {
              x: 0.2,
              y: 0.3,
              width: 0.3,
              height: 0.2,
              label: "Heart",
              confidence: 0.98,
            },
            {
              x: 0.6,
              y: 0.3,
              width: 0.2,
              height: 0.2,
              label: "Right Lung",
              confidence: 0.95,
            },
            {
              x: 0.2,
              y: 0.3,
              width: 0.2,
              height: 0.2,
              label: "Left Lung",
              confidence: 0.94,
            },
          ],
        };
      } else if (imageType === "mri") {
        result = {
          type: "mri",
          findings: [
            "No evidence of acute infarction",
            "No intracranial hemorrhage",
            "No mass effect or midline shift",
            "Ventricles and sulci are normal in size and configuration",
            "No extra-axial fluid collections",
          ],
          impression: "Normal brain MRI without contrast",
          confidence: 0.89,
          detectedAreas: [
            {
              x: 0.3,
              y: 0.3,
              width: 0.4,
              height: 0.4,
              label: "Brain",
              confidence: 0.99,
            },
            {
              x: 0.4,
              y: 0.4,
              width: 0.1,
              height: 0.1,
              label: "Ventricles",
              confidence: 0.87,
            },
          ],
        };
      } else {
        result = {
          type: "report",
          findings: [
            "Blood glucose: 95 mg/dL (Normal range: 70-99 mg/dL)",
            "Total cholesterol: 185 mg/dL (Normal range: <200 mg/dL)",
            "HDL cholesterol: 55 mg/dL (Normal range: >40 mg/dL)",
            "LDL cholesterol: 110 mg/dL (Normal range: <100 mg/dL)",
            "Triglycerides: 100 mg/dL (Normal range: <150 mg/dL)",
          ],
          impression: "Lipid panel within normal limits. Blood glucose normal.",
          confidence: 0.95,
          extractedText:
            "LABORATORY REPORT\n\nPatient: John Doe\nDate: 06/15/2023\nTest: Comprehensive Metabolic Panel\n\nResults:\nGlucose: 95 mg/dL (70-99)\nBUN: 15 mg/dL (7-20)\nCreatinine: 0.9 mg/dL (0.6-1.2)\nSodium: 140 mEq/L (136-145)\nPotassium: 4.0 mEq/L (3.5-5.1)\nChloride: 101 mEq/L (98-107)\nCO2: 24 mEq/L (21-32)\nCalcium: 9.5 mg/dL (8.5-10.2)\nTotal Protein: 7.0 g/dL (6.0-8.3)\nAlbumin: 4.5 g/dL (3.5-5.0)\nTotal Bilirubin: 0.8 mg/dL (0.1-1.2)\nAST: 25 U/L (10-40)\nALT: 30 U/L (7-56)\nAlk Phos: 70 U/L (44-147)\n\nLipid Panel:\nTotal Cholesterol: 185 mg/dL (<200)\nHDL: 55 mg/dL (>40)\nLDL: 110 mg/dL (<100)\nTriglycerides: 100 mg/dL (<150)\n\nImpression: All values within normal range.",
        };
      }

      setAnalysisResult(result);
      setActiveTab("results");
      setIsAnalyzing(false);
    }, 5000);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 20, 60));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageType(null);
    setAnalysisResult(null);
    setZoom(100);
    setRotation(0);
    setActiveTab("upload");
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;

    // Create a simple text report
    let reportContent = `Medical Image Analysis Report\n\n`;
    reportContent += `Type: ${analysisResult.type.toUpperCase()}\n`;
    reportContent += `Date: ${new Date().toLocaleDateString()}\n\n`;
    reportContent += `Findings:\n`;
    analysisResult.findings.forEach((finding, i) => {
      reportContent += `${i + 1}. ${finding}\n`;
    });
    reportContent += `\nImpression: ${analysisResult.impression}\n`;
    reportContent += `Confidence: ${(analysisResult.confidence * 100).toFixed(1)}%\n`;

    if (analysisResult.extractedText) {
      reportContent += `\nExtracted Text:\n${analysisResult.extractedText}\n`;
    }

    // Create a blob and download
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medical-image-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full h-full flex flex-col bg-white">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Medical Image Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="preview" disabled={!previewUrl}>
              Preview & Settings
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisResult}>
              Analysis Results
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="upload"
            className="flex-1 p-6 flex flex-col items-center justify-center"
          >
            <div className="text-center max-w-md mx-auto">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6 cursor-pointer hover:border-blue-400 transition-colors"
                onClick={triggerFileInput}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Upload Medical Image
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop or click to upload X-rays, MRIs, CT scans, or
                  medical reports
                </p>
                <Button>Select File</Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
              </div>

              <div className="text-sm text-gray-500">
                <p className="mb-2">
                  Supported file types: JPEG, PNG, DICOM, PDF
                </p>
                <p>Maximum file size: 20MB</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 p-4 flex flex-col">
            {previewUrl && (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-medium">
                    {selectedFile?.name} (
                    {(selectedFile?.size || 0) / 1024 < 1024
                      ? `${((selectedFile?.size || 0) / 1024).toFixed(1)} KB`
                      : `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB`}
                    )
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoom <= 60}
                    >
                      -
                    </Button>
                    <span className="text-sm">{zoom}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoom >= 200}
                    >
                      +
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRotate}>
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto border rounded-md mb-4 bg-gray-50 flex items-center justify-center">
                  <div
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Medical image preview"
                      className="max-w-full max-h-[500px] object-contain"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">
                    Select image type for analysis:
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Card
                      className={`cursor-pointer hover:border-blue-400 transition-colors ${imageType === "xray" ? "border-blue-500 bg-blue-50" : ""}`}
                      onClick={() => handleImageTypeSelect("xray")}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <ImageIcon className="h-8 w-8 mb-2 text-gray-600" />
                        <span className="text-sm font-medium">X-Ray</span>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer hover:border-blue-400 transition-colors ${imageType === "mri" ? "border-blue-500 bg-blue-50" : ""}`}
                      onClick={() => handleImageTypeSelect("mri")}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <ImageIcon className="h-8 w-8 mb-2 text-gray-600" />
                        <span className="text-sm font-medium">MRI/CT Scan</span>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer hover:border-blue-400 transition-colors ${imageType === "report" ? "border-blue-500 bg-blue-50" : ""}`}
                      onClick={() => handleImageTypeSelect("report")}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <FileText className="h-8 w-8 mb-2 text-gray-600" />
                        <span className="text-sm font-medium">
                          Medical Report
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAnalyzeImage}
                    disabled={!imageType || isAnalyzing}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing... {Math.round(analysisProgress)}%
                      </>
                    ) : (
                      <>
                        Analyze Image <span className="ml-1">→</span>
                      </>
                    )}
                  </Button>
                </div>

                {isAnalyzing && (
                  <Progress value={analysisProgress} className="mt-4" />
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="flex-1 p-4">
            {analysisResult && (
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Analysis Results</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadReport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Image Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative border rounded bg-gray-50 flex items-center justify-center p-2">
                          <img
                            src={previewUrl!}
                            alt="Medical image"
                            className="max-w-full max-h-[300px] object-contain"
                          />

                          {/* Overlay annotations for X-ray and MRI */}
                          {(analysisResult.type === "xray" ||
                            analysisResult.type === "mri") &&
                            analysisResult.detectedAreas && (
                              <div className="absolute inset-0">
                                {analysisResult.detectedAreas.map((area, i) => (
                                  <div
                                    key={i}
                                    className="absolute border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center"
                                    style={{
                                      left: `${area.x * 100}%`,
                                      top: `${area.y * 100}%`,
                                      width: `${area.width * 100}%`,
                                      height: `${area.height * 100}%`,
                                    }}
                                  >
                                    <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                                      {area.label} (
                                      {(area.confidence * 100).toFixed(0)}%)
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
                            onClick={() => setActiveTab("preview")}
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Analysis Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-1">
                              Image Type
                            </div>
                            <div className="text-sm">
                              {analysisResult.type === "xray"
                                ? "X-Ray"
                                : analysisResult.type === "mri"
                                  ? "MRI/CT Scan"
                                  : "Medical Report"}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">
                              Confidence Score
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={analysisResult.confidence * 100}
                                className="h-2"
                              />
                              <span className="text-sm">
                                {(analysisResult.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">
                              Impression
                            </div>
                            <div className="text-sm p-2 bg-gray-50 rounded border">
                              {analysisResult.impression}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Detailed Findings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResult.findings.map((finding, i) => (
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
                            <span className="text-sm">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {analysisResult.type === "report" &&
                    analysisResult.extractedText && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            Extracted Text
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[200px] w-full rounded border p-4">
                            <pre className="text-xs font-mono whitespace-pre-wrap">
                              {analysisResult.extractedText}
                            </pre>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    )}

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("preview")}
                    >
                      Back to Image
                    </Button>
                    <Button onClick={handleReset}>Analyze New Image</Button>
                  </div>
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImageAnalysisFeature;

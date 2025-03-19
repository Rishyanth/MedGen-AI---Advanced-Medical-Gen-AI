import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { createActivity } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      // Reset analysis results when a new file is selected
      setAnalysisResult(null);
      setActiveTab("preview");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);

      // Reset analysis results when a new file is dropped
      setAnalysisResult(null);
      setActiveTab("preview");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);

    // In a real app, this would upload the image to a server for analysis
    // For now, we'll simulate a response with a timeout
    setTimeout(async () => {
      // Generate mock analysis based on file name
      const mockAnalysis = generateMockAnalysis(file.name.toLowerCase());
      setAnalysisResult(mockAnalysis);
      setIsLoading(false);
      setActiveTab("results");

      // Log this analysis in activities
      if (user) {
        try {
          await createActivity({
            user_id: user.id,
            title: "Image Analysis",
            description: `Analysis of ${file.name}`,
            type: "analysis",
            status: "completed",
          });
        } catch (error) {
          console.error("Error logging image analysis activity:", error);
        }
      }
    }, 3000);
  };

  const generateMockAnalysis = (filename: string) => {
    // This is a mock function - in a real app, you would use a trained ML model
    if (
      filename.includes("xray") ||
      filename.includes("x-ray") ||
      filename.includes("chest")
    ) {
      return {
        type: "X-Ray Analysis",
        findings: [
          {
            area: "Lungs",
            observation: "No significant abnormalities detected",
            confidence: 0.92,
          },
          {
            area: "Heart",
            observation: "Normal cardiac silhouette",
            confidence: 0.89,
          },
          {
            area: "Bones",
            observation: "No fractures or lesions detected",
            confidence: 0.95,
          },
        ],
        summary:
          "This chest X-ray appears normal with no significant pathological findings. The lungs are clear without evidence of infiltrates, effusions, or pneumothorax. The cardiac silhouette is of normal size and shape. No bony abnormalities are identified.",
        recommendations: [
          "No further imaging studies are recommended at this time",
          "Follow up with your healthcare provider as scheduled",
        ],
      };
    } else if (filename.includes("mri") || filename.includes("brain")) {
      return {
        type: "MRI Analysis",
        findings: [
          {
            area: "Brain Parenchyma",
            observation:
              "Small area of increased T2 signal in the left frontal lobe",
            confidence: 0.87,
          },
          {
            area: "Ventricles",
            observation: "Normal size and configuration",
            confidence: 0.94,
          },
          {
            area: "Blood Vessels",
            observation: "No evidence of aneurysm or vascular malformation",
            confidence: 0.91,
          },
        ],
        summary:
          "This brain MRI shows a small area of increased T2 signal in the left frontal lobe, which may represent a small area of gliosis or demyelination. The ventricles are normal in size and configuration. No evidence of mass effect, midline shift, or acute infarction. No abnormal enhancement is seen.",
        recommendations: [
          "Clinical correlation is recommended",
          "Consider follow-up imaging in 6 months to assess for any changes",
          "Neurology consultation may be beneficial",
        ],
      };
    } else if (
      filename.includes("report") ||
      filename.includes("lab") ||
      filename.includes("test")
    ) {
      return {
        type: "Medical Report OCR Analysis",
        extractedData: {
          patientInfo: {
            name: "[REDACTED]",
            id: "[REDACTED]",
            dob: "[REDACTED]",
          },
          testResults: [
            {
              test: "Hemoglobin",
              value: "14.2 g/dL",
              reference: "13.5-17.5 g/dL",
              status: "Normal",
            },
            {
              test: "White Blood Cell Count",
              value: "6.8 x10^9/L",
              reference: "4.5-11.0 x10^9/L",
              status: "Normal",
            },
            {
              test: "Platelet Count",
              value: "245 x10^9/L",
              reference: "150-450 x10^9/L",
              status: "Normal",
            },
            {
              test: "Glucose",
              value: "105 mg/dL",
              reference: "70-99 mg/dL",
              status: "Elevated",
            },
            {
              test: "Total Cholesterol",
              value: "210 mg/dL",
              reference: "<200 mg/dL",
              status: "Elevated",
            },
          ],
        },
        summary:
          "This appears to be a complete blood count (CBC) and basic metabolic panel. Most values are within normal ranges, with slightly elevated glucose and cholesterol levels.",
        recommendations: [
          "Follow up with healthcare provider regarding elevated glucose and cholesterol",
          "Consider dietary and lifestyle modifications",
          "Repeat testing in 3-6 months to monitor trends",
        ],
      };
    } else {
      // Generic response for other image types
      return {
        type: "General Medical Image Analysis",
        findings: [
          {
            observation: "Unable to determine specific medical content",
            confidence: 0.6,
          },
        ],
        summary:
          "This image does not appear to be a standard medical imaging type (X-ray, MRI, CT, etc.) or medical document that our system can analyze with high confidence. For accurate analysis, please upload a clear medical image or document.",
        recommendations: [
          "Consider uploading a different image format",
          "Ensure the image is a standard medical imaging type",
          "For document analysis, ensure text is clearly visible",
        ],
      };
    }
  };

  const resetImage = () => {
    setFile(null);
    setPreview(null);
    setAnalysisResult(null);
    setActiveTab("upload");
    setZoom(1);
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Medical Image Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" disabled={isLoading}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!preview || isLoading}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!analysisResult || isLoading}
            >
              <FileText className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="pt-6">
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Medical Image</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: JPG, PNG, DICOM, PDF (for medical reports)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="pt-6">
            {preview && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                      onClick={zoomIn}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                      onClick={zoomOut}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                      onClick={rotate}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                      onClick={resetImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="overflow-auto max-h-[500px] flex items-center justify-center border rounded-lg bg-gray-50">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full object-contain transition-all duration-200"
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        maxHeight: "500px",
                      }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Filename: {file?.name}</p>
                  <p>
                    Size:{" "}
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "Unknown"}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="pt-6">
            {analysisResult && (
              <div className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h3 className="text-xl font-semibold text-primary">
                    {analysisResult.type}
                  </h3>
                </div>

                {analysisResult.findings && (
                  <div>
                    <h4 className="font-medium mb-3">Findings</h4>
                    <div className="space-y-3">
                      {analysisResult.findings.map(
                        (finding: any, i: number) => (
                          <div key={i} className="border rounded-md p-3">
                            {finding.area && (
                              <p className="font-medium">{finding.area}</p>
                            )}
                            <p>{finding.observation}</p>
                            {finding.confidence && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-2 bg-gray-200 rounded-full flex-1">
                                  <div
                                    className="h-2 bg-primary rounded-full"
                                    style={{
                                      width: `${finding.confidence * 100}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {Math.round(finding.confidence * 100)}%
                                  confidence
                                </span>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {analysisResult.extractedData && (
                  <div>
                    <h4 className="font-medium mb-3">Extracted Data</h4>
                    <div className="border rounded-md overflow-hidden">
                      {analysisResult.extractedData.testResults && (
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-2 font-medium">
                                Test
                              </th>
                              <th className="text-left p-2 font-medium">
                                Value
                              </th>
                              <th className="text-left p-2 font-medium">
                                Reference
                              </th>
                              <th className="text-left p-2 font-medium">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {analysisResult.extractedData.testResults.map(
                              (result: any, i: number) => (
                                <tr key={i} className="border-t">
                                  <td className="p-2">{result.test}</td>
                                  <td className="p-2">{result.value}</td>
                                  <td className="p-2">{result.reference}</td>
                                  <td className="p-2">
                                    <span
                                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                                        result.status === "Normal"
                                          ? "bg-green-100 text-green-800"
                                          : result.status === "Elevated"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {result.status}
                                    </span>
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-gray-700">{analysisResult.summary}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map(
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
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                  <p className="text-sm font-medium">
                    Important Disclaimer: This is an AI-generated analysis and
                    should not replace professional medical interpretation.
                    Please consult with a healthcare provider for proper
                    diagnosis.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">
              Analyzing your image...
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetImage}
          disabled={!file || isLoading}
        >
          Reset
        </Button>
        <Button
          onClick={handleAnalyze}
          disabled={!file || isLoading || !!analysisResult}
        >
          Analyze Image
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUploader;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Database, Download, Loader2, Table, FileJson } from "lucide-react";

type DatasetType =
  | "patient"
  | "medical_records"
  | "lab_results"
  | "imaging"
  | "custom";

type DatasetConfig = {
  type: DatasetType;
  name: string;
  size: number;
  fields: {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "enum";
    include: boolean;
    options?: string[];
  }[];
  constraints: {
    missingValues: number;
    outliers: number;
    correlations: {
      field1: string;
      field2: string;
      strength: number;
    }[];
  };
};

const INITIAL_CONFIGS: Record<DatasetType, DatasetConfig> = {
  patient: {
    type: "patient",
    name: "Synthetic Patient Dataset",
    size: 100,
    fields: [
      { name: "patient_id", type: "string", include: true },
      { name: "age", type: "number", include: true },
      {
        name: "gender",
        type: "enum",
        include: true,
        options: ["Male", "Female", "Other"],
      },
      { name: "weight_kg", type: "number", include: true },
      { name: "height_cm", type: "number", include: true },
      {
        name: "blood_type",
        type: "enum",
        include: true,
        options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      {
        name: "smoking_status",
        type: "enum",
        include: true,
        options: ["Never", "Former", "Current"],
      },
      { name: "diabetes", type: "boolean", include: true },
      { name: "hypertension", type: "boolean", include: true },
      { name: "heart_disease", type: "boolean", include: true },
    ],
    constraints: {
      missingValues: 5,
      outliers: 2,
      correlations: [
        { field1: "age", field2: "hypertension", strength: 0.6 },
        { field1: "smoking_status", field2: "heart_disease", strength: 0.4 },
      ],
    },
  },
  medical_records: {
    type: "medical_records",
    name: "Synthetic Medical Records",
    size: 100,
    fields: [
      { name: "record_id", type: "string", include: true },
      { name: "patient_id", type: "string", include: true },
      { name: "visit_date", type: "date", include: true },
      { name: "diagnosis_code", type: "string", include: true },
      { name: "diagnosis_description", type: "string", include: true },
      { name: "medication_prescribed", type: "string", include: true },
      { name: "dosage", type: "string", include: true },
      { name: "follow_up_required", type: "boolean", include: true },
      { name: "follow_up_date", type: "date", include: true },
      { name: "notes", type: "string", include: true },
    ],
    constraints: {
      missingValues: 10,
      outliers: 3,
      correlations: [
        {
          field1: "diagnosis_code",
          field2: "medication_prescribed",
          strength: 0.8,
        },
        {
          field1: "follow_up_required",
          field2: "follow_up_date",
          strength: 0.9,
        },
      ],
    },
  },
  lab_results: {
    type: "lab_results",
    name: "Synthetic Lab Results",
    size: 100,
    fields: [
      { name: "result_id", type: "string", include: true },
      { name: "patient_id", type: "string", include: true },
      { name: "test_date", type: "date", include: true },
      { name: "test_name", type: "string", include: true },
      { name: "result_value", type: "number", include: true },
      { name: "unit", type: "string", include: true },
      { name: "reference_range_low", type: "number", include: true },
      { name: "reference_range_high", type: "number", include: true },
      { name: "is_abnormal", type: "boolean", include: true },
      { name: "notes", type: "string", include: true },
    ],
    constraints: {
      missingValues: 5,
      outliers: 8,
      correlations: [
        { field1: "result_value", field2: "is_abnormal", strength: 0.7 },
      ],
    },
  },
  imaging: {
    type: "imaging",
    name: "Synthetic Imaging Metadata",
    size: 50,
    fields: [
      { name: "image_id", type: "string", include: true },
      { name: "patient_id", type: "string", include: true },
      { name: "image_date", type: "date", include: true },
      {
        name: "modality",
        type: "enum",
        include: true,
        options: ["X-Ray", "MRI", "CT", "Ultrasound", "PET"],
      },
      { name: "body_part", type: "string", include: true },
      { name: "radiologist_id", type: "string", include: true },
      { name: "finding", type: "string", include: true },
      {
        name: "finding_severity",
        type: "enum",
        include: true,
        options: ["Normal", "Mild", "Moderate", "Severe", "Critical"],
      },
      { name: "follow_up_recommended", type: "boolean", include: true },
      { name: "notes", type: "string", include: true },
    ],
    constraints: {
      missingValues: 3,
      outliers: 2,
      correlations: [
        {
          field1: "finding_severity",
          field2: "follow_up_recommended",
          strength: 0.8,
        },
      ],
    },
  },
  custom: {
    type: "custom",
    name: "Custom Medical Dataset",
    size: 100,
    fields: [
      { name: "id", type: "string", include: true },
      { name: "value", type: "number", include: true },
      {
        name: "category",
        type: "enum",
        include: true,
        options: ["Category A", "Category B", "Category C"],
      },
      { name: "date", type: "date", include: true },
      { name: "flag", type: "boolean", include: true },
    ],
    constraints: {
      missingValues: 5,
      outliers: 3,
      correlations: [],
    },
  },
};

const DatasetGenerationFeature = () => {
  const [activeTab, setActiveTab] = useState("configure");
  const [selectedType, setSelectedType] = useState<DatasetType>("patient");
  const [config, setConfig] = useState<DatasetConfig>(INITIAL_CONFIGS.patient);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedData, setGeneratedData] = useState<any[] | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");

  const handleTypeChange = (type: DatasetType) => {
    setSelectedType(type);
    setConfig(INITIAL_CONFIGS[type]);
  };

  const handleConfigChange = (field: keyof DatasetConfig, value: any) => {
    setConfig({ ...config, [field]: value });
  };

  const handleFieldToggle = (index: number, checked: boolean) => {
    const updatedFields = [...config.fields];
    updatedFields[index] = { ...updatedFields[index], include: checked };
    setConfig({ ...config, fields: updatedFields });
  };

  const handleConstraintChange = (
    field: keyof typeof config.constraints,
    value: any,
  ) => {
    setConfig({
      ...config,
      constraints: { ...config.constraints, [field]: value },
    });
  };

  const handleGenerateDataset = () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);

    // Simulate dataset generation
    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);

      // Generate mock data based on configuration
      const data = generateMockData(config);
      setGeneratedData(data);
      setPreviewData(data.slice(0, 10)); // First 10 rows for preview
      setActiveTab("preview");
      setIsGenerating(false);
    }, 3000);
  };

  const generateMockData = (config: DatasetConfig): any[] => {
    const data = [];
    const includedFields = config.fields.filter((f) => f.include);

    for (let i = 0; i < config.size; i++) {
      const row: Record<string, any> = {};

      includedFields.forEach((field) => {
        // Skip some values to simulate missing data
        if (Math.random() * 100 < config.constraints.missingValues) {
          return;
        }

        switch (field.type) {
          case "string":
            row[field.name] = field.name.includes("id")
              ? `${field.name.charAt(0).toUpperCase()}${i.toString().padStart(5, "0")}`
              : `${field.name}_value_${Math.floor(Math.random() * 1000)}`;
            break;
          case "number":
            // Add some outliers
            if (Math.random() * 100 < config.constraints.outliers) {
              row[field.name] = Math.random() * 1000;
            } else {
              if (field.name === "age") {
                row[field.name] = Math.floor(Math.random() * 80) + 18;
              } else if (field.name === "weight_kg") {
                row[field.name] = Math.floor(Math.random() * 100) + 40;
              } else if (field.name === "height_cm") {
                row[field.name] = Math.floor(Math.random() * 50) + 150;
              } else {
                row[field.name] = Math.floor(Math.random() * 100);
              }
            }
            break;
          case "boolean":
            row[field.name] = Math.random() > 0.5;
            break;
          case "date":
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));
            row[field.name] = date.toISOString().split("T")[0];
            break;
          case "enum":
            if (field.options && field.options.length > 0) {
              const index = Math.floor(Math.random() * field.options.length);
              row[field.name] = field.options[index];
            } else {
              row[field.name] = "Unknown";
            }
            break;
        }
      });

      data.push(row);
    }

    // Apply correlations
    applyCorrelations(data, config.constraints.correlations);

    return data;
  };

  const applyCorrelations = (
    data: any[],
    correlations: typeof config.constraints.correlations,
  ) => {
    correlations.forEach(({ field1, field2, strength }) => {
      // Simple correlation implementation
      data.forEach((row) => {
        if (row[field1] !== undefined && Math.random() < strength) {
          if (typeof row[field1] === "boolean") {
            row[field2] = row[field1];
          } else if (
            typeof row[field1] === "number" &&
            typeof row[field2] === "number"
          ) {
            // Positive correlation between numbers
            row[field2] = row[field1] * (0.8 + Math.random() * 0.4);
          } else if (
            field1 === "finding_severity" &&
            field2 === "follow_up_recommended"
          ) {
            // Special case for imaging dataset
            row[field2] = ["Moderate", "Severe", "Critical"].includes(
              row[field1],
            );
          }
        }
      });
    });
  };

  const handleExportDataset = () => {
    if (!generatedData) return;

    let content: string;
    let filename: string;
    let type: string;

    if (exportFormat === "csv") {
      // Convert to CSV
      const headers = Object.keys(generatedData[0]).join(",");
      const rows = generatedData.map((row) =>
        Object.values(row)
          .map((value) => (typeof value === "string" ? `"${value}"` : value))
          .join(","),
      );
      content = [headers, ...rows].join("\n");
      filename = `${config.name.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}.csv`;
      type = "text/csv";
    } else {
      // JSON format
      content = JSON.stringify(generatedData, null, 2);
      filename = `${config.name.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}.json`;
      type = "application/json";
    }

    // Create download link
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full h-full flex flex-col bg-white">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">
          Synthetic Medical Dataset Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="configure">Configure Dataset</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedData}>
              Preview & Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="flex-1 p-4">
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Dataset Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(Object.keys(INITIAL_CONFIGS) as DatasetType[]).map(
                      (type) => (
                        <Card
                          key={type}
                          className={`cursor-pointer hover:border-blue-400 transition-colors ${selectedType === type ? "border-blue-500 bg-blue-50" : ""}`}
                          onClick={() => handleTypeChange(type)}
                        >
                          <CardContent className="p-4 flex flex-col items-center text-center">
                            <Database className="h-8 w-8 mb-2 text-gray-600" />
                            <span className="text-sm font-medium capitalize">
                              {type.replace("_", " ")}
                            </span>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dataset-name">Dataset Name</Label>
                    <Input
                      id="dataset-name"
                      value={config.name}
                      onChange={(e) =>
                        handleConfigChange("name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataset-size">
                      Dataset Size (rows): {config.size}
                    </Label>
                    <Slider
                      id="dataset-size"
                      min={10}
                      max={1000}
                      step={10}
                      value={[config.size]}
                      onValueChange={(value) =>
                        handleConfigChange("size", value[0])
                      }
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Fields</h3>
                  <div className="space-y-2">
                    {config.fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                      >
                        <Checkbox
                          id={`field-${index}`}
                          checked={field.include}
                          onCheckedChange={(checked) =>
                            handleFieldToggle(index, checked as boolean)
                          }
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`field-${index}`}
                            className="font-medium"
                          >
                            {field.name}
                          </Label>
                          <p className="text-xs text-gray-500 capitalize">
                            {field.type}
                          </p>
                        </div>
                        {field.type === "enum" && field.options && (
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            Options: {field.options.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Data Quality Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>
                        Missing Values (%): {config.constraints.missingValues}
                      </Label>
                      <Slider
                        min={0}
                        max={30}
                        step={1}
                        value={[config.constraints.missingValues]}
                        onValueChange={(value) =>
                          handleConstraintChange("missingValues", value[0])
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Outliers (%): {config.constraints.outliers}</Label>
                      <Slider
                        min={0}
                        max={20}
                        step={1}
                        value={[config.constraints.outliers]}
                        onValueChange={(value) =>
                          handleConstraintChange("outliers", value[0])
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Correlations</h3>
                  {config.constraints.correlations.length > 0 ? (
                    <div className="space-y-2">
                      {config.constraints.correlations.map(
                        (correlation, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded bg-gray-50"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-sm font-medium">
                                {correlation.field1} ↔ {correlation.field2}
                              </div>
                              <div className="text-xs">
                                Strength:{" "}
                                {(correlation.strength * 100).toFixed(0)}%
                              </div>
                            </div>
                            <Progress
                              value={correlation.strength * 100}
                              className="h-1"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No correlations defined for this dataset type.
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Additional Notes</h3>
                  <Textarea
                    placeholder="Add any notes about this dataset..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="mt-6 flex justify-end sticky bottom-4 right-4 z-10">
              <Button
                onClick={handleGenerateDataset}
                disabled={isGenerating}
                className="min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white shadow-lg py-6 px-8 text-lg font-medium"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating... {Math.round(generationProgress)}%
                  </>
                ) : (
                  "Generate Dataset"
                )}
              </Button>
            </div>

            {isGenerating && (
              <Progress value={generationProgress} className="mt-4" />
            )}
          </TabsContent>

          <TabsContent value="preview" className="flex-1 p-4">
            {previewData && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{config.name}</h3>
                    <p className="text-sm text-gray-500">
                      {config.size} rows,{" "}
                      {config.fields.filter((f) => f.include).length} fields
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="export-format" className="text-sm">
                        Export as:
                      </Label>
                      <Select
                        value={exportFormat}
                        onValueChange={(value) =>
                          setExportFormat(value as "csv" | "json")
                        }
                      >
                        <SelectTrigger id="export-format" className="w-[100px]">
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleExportDataset}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Dataset
                    </Button>
                  </div>
                </div>

                <div className="border rounded overflow-hidden">
                  <div className="bg-gray-100 p-2 border-b flex items-center space-x-2">
                    <Table className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Data Preview (first 10 rows)
                    </span>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            {Object.keys(previewData[0]).map((key) => (
                              <th
                                key={key}
                                className="p-2 text-left font-medium border-b"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={
                                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              {Object.values(row).map((value, colIndex) => (
                                <td key={colIndex} className="p-2 border-b">
                                  {value === null || value === undefined ? (
                                    <span className="text-gray-400 italic">
                                      null
                                    </span>
                                  ) : (
                                    String(value)
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileJson className="h-6 w-6 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-700 mb-1">
                        Dataset Information
                      </h3>
                      <p className="text-xs text-blue-600">
                        This synthetic dataset was generated with{" "}
                        {config.constraints.missingValues}% missing values and{" "}
                        {config.constraints.outliers}% outliers. It contains{" "}
                        {config.constraints.correlations.length} defined
                        correlations between fields. The data is completely
                        synthetic and does not contain any real patient
                        information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("configure")}
                  >
                    Back to Configuration
                  </Button>
                  <Button onClick={handleGenerateDataset}>
                    Regenerate Dataset
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatasetGenerationFeature;

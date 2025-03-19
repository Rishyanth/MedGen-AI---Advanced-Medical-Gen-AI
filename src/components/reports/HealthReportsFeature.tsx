import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Share2,
  Printer,
  Filter,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserReports, Report } from "@/lib/reports";

const ReportCard = ({ report }: { report: Report }) => {
  const statusColors = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-blue-100 text-blue-800",
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(report.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-sm mb-1">
              <span className="text-muted-foreground">Type:</span> {report.type}
            </p>
            <p className="text-sm mb-3">
              <span className="text-muted-foreground">Doctor:</span>{" "}
              {report.doctor}
            </p>
            <p className="text-sm text-muted-foreground border-l-2 border-gray-300 pl-3 py-1 mt-3">
              {report.summary}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`text-xs px-3 py-1 rounded-full ${statusColors[report.status]} mb-4`}
            >
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
            <Button variant="outline" size="sm" className="mb-2">
              <FileText className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HealthReportsFeature = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchUserReports();
        setReports(data);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    if (
      activeTab !== "all" &&
      report.type.toLowerCase() !== activeTab.toLowerCase()
    ) {
      return false;
    }

    if (searchTerm) {
      return (
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Reports</h1>
          <p className="text-muted-foreground">
            View and manage your medical reports and test results
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button className="flex items-center gap-2 bg-black text-white hover:bg-black/90">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search reports by title, doctor, or keywords..."
            className="w-full p-3 pl-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="laboratory">Laboratory</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="specialist">Specialist</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading reports...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "You don't have any health reports yet"}
              </p>
              {!searchTerm && (
                <Button className="bg-black text-white hover:bg-black/90">
                  Request New Report
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="physical" className="mt-0">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading reports...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No physical reports found
              </h3>
              <p className="text-muted-foreground mb-4">
                You don't have any physical examination reports yet
              </p>
              <Button className="bg-black text-white hover:bg-black/90">
                Request Physical Exam
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="laboratory" className="mt-0">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading reports...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No laboratory reports found
              </h3>
              <p className="text-muted-foreground mb-4">
                You don't have any laboratory test reports yet
              </p>
              <Button className="bg-black text-white hover:bg-black/90">
                Request Lab Tests
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="imaging" className="mt-0">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading reports...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No imaging reports found
              </h3>
              <p className="text-muted-foreground mb-4">
                You don't have any imaging scan reports yet
              </p>
              <Button className="bg-black text-white hover:bg-black/90">
                Request Imaging Scan
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="specialist" className="mt-0">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading reports...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No specialist reports found
              </h3>
              <p className="text-muted-foreground mb-4">
                You don't have any specialist consultation reports yet
              </p>
              <Button className="bg-black text-white hover:bg-black/90">
                Request Specialist Consultation
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthReportsFeature;

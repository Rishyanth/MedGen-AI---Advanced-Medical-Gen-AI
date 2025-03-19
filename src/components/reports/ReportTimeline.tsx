import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  type: string;
  description: string;
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "event-001",
    date: "2023-12-15",
    title: "Annual Physical Examination",
    type: "Checkup",
    description: "Routine annual physical examination with Dr. Sarah Johnson.",
  },
  {
    id: "event-002",
    date: "2023-11-28",
    title: "Blood Work Analysis",
    type: "Lab Test",
    description:
      "Comprehensive blood panel including cholesterol, glucose, and vitamin levels.",
  },
  {
    id: "event-003",
    date: "2023-10-05",
    title: "Cardiac Evaluation",
    type: "Specialist Visit",
    description:
      "Cardiology consultation with Dr. Emily Rodriguez including ECG and stress test.",
  },
  {
    id: "event-004",
    date: "2023-09-12",
    title: "Allergy Testing",
    type: "Lab Test",
    description: "Comprehensive allergy panel to identify potential allergens.",
  },
  {
    id: "event-005",
    date: "2023-08-20",
    title: "MRI Scan - Lower Back",
    type: "Imaging",
    description: "MRI scan to investigate persistent lower back pain.",
  },
  {
    id: "event-006",
    date: "2023-07-10",
    title: "Vaccination - Flu Shot",
    type: "Preventive Care",
    description: "Annual influenza vaccination.",
  },
  {
    id: "event-007",
    date: "2023-06-05",
    title: "Dental Checkup",
    type: "Dental",
    description: "Routine dental examination and cleaning.",
  },
  {
    id: "event-008",
    date: "2023-05-15",
    title: "Vision Test",
    type: "Vision Care",
    description: "Annual eye examination and prescription update.",
  },
];

const TimelineEvent = ({ event }: { event: TimelineEvent }) => {
  const typeColors: Record<string, string> = {
    Checkup: "bg-blue-100 text-blue-800",
    "Lab Test": "bg-purple-100 text-purple-800",
    "Specialist Visit": "bg-amber-100 text-amber-800",
    Imaging: "bg-green-100 text-green-800",
    "Preventive Care": "bg-teal-100 text-teal-800",
    Dental: "bg-pink-100 text-pink-800",
    "Vision Care": "bg-indigo-100 text-indigo-800",
    default: "bg-gray-100 text-gray-800",
  };

  const colorClass = typeColors[event.type] || typeColors.default;

  return (
    <div className="mb-8 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:bg-black before:rounded-full before:z-10 after:content-[''] after:absolute after:left-2 after:top-2 after:bottom-0 after:w-0.5 after:bg-gray-200 after:-z-10 last:after:hidden">
      <div className="mb-1">
        <span className="text-sm font-medium">
          {new Date(event.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${colorClass}`}>
          {event.type}
        </span>
      </div>
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-muted-foreground mb-3">{event.description}</p>
      <Button variant="outline" size="sm" className="text-xs">
        View Details
        <ArrowRight className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
};

const ReportTimeline = () => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Medical History Timeline</h2>
          <Button variant="outline" size="sm" className="text-sm">
            <FileText className="mr-1 h-4 w-4" />
            Export Timeline
          </Button>
        </div>

        <div className="mt-8">
          {mockTimelineEvents.map((event) => (
            <TimelineEvent key={event.id} event={event} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" className="text-sm">
            Load More History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportTimeline;

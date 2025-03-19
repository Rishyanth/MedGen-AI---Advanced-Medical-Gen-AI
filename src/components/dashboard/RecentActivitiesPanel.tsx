import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock,
  MessageSquare,
  FileText,
  Activity,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { fetchActivities, fetchActivitiesByType } from "@/lib/api";
import { ActivityItem } from "@/types/activities";
import { useSupabaseSubscription } from "@/hooks/useSupabaseSubscription";
import { Button } from "@/components/ui/button";

interface RecentActivitiesPanelProps {
  title?: string;
  maxItems?: number;
}

const RecentActivitiesPanel = ({
  title = "Recent Activities",
  maxItems = 5,
}: RecentActivitiesPanelProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const loadActivities = async () => {
    try {
      setLoading(true);
      let data;

      if (activeTab === "all") {
        data = await fetchActivities(maxItems);
      } else {
        data = await fetchActivitiesByType(activeTab, maxItems);
      }

      setActivities(data);
      setError(null);
    } catch (err: any) {
      console.error("Error loading activities:", err);
      setError("Failed to load activities. Please try again later.");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [activeTab, maxItems]);

  // Set up realtime subscription
  useSupabaseSubscription("activities", "*", () => {
    loadActivities();
  });

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get icon based on activity type
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "diagnosis":
        return <Activity className="h-4 w-4" />;
      case "chat":
        return <MessageSquare className="h-4 w-4" />;
      case "analysis":
        return <FileText className="h-4 w-4" />;
      default:
        return <CalendarClock className="h-4 w-4" />;
    }
  };

  // Get badge color based on status
  const getStatusBadge = (status?: ActivityItem["status"]) => {
    if (!status) return null;

    switch (status) {
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderActivityList = (activities: ActivityItem[]) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-destructive py-4">{error}</div>;
    }

    if (activities.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-4">
          No activities found
        </p>
      );
    }

    return activities.map((activity) => (
      <div
        key={activity.id}
        className="flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <div className="p-2 rounded-full bg-[#f5f5f7]">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{activity.title}</h4>
            {getStatusBadge(activity.status)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {activity.description}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDate(activity.created_at || activity.timestamp || "")}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-medium flex items-center gap-1"
        >
          View All
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="mb-4 bg-[#f5f5f7]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnoses</TabsTrigger>
          <TabsTrigger value="chat">Chats</TabsTrigger>
          <TabsTrigger value="analysis">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderActivityList(activities)}
        </TabsContent>

        <TabsContent value="diagnosis" className="space-y-4">
          {renderActivityList(activities.filter((a) => a.type === "diagnosis"))}
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          {renderActivityList(activities.filter((a) => a.type === "chat"))}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {renderActivityList(activities.filter((a) => a.type === "analysis"))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecentActivitiesPanel;

export interface ActivityItem {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  timestamp?: string;
  created_at?: string;
  type: "diagnosis" | "chat" | "analysis";
  status?: "completed" | "in-progress" | "pending";
}

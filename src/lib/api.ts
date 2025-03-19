import { supabase } from "./supabase";
import { ActivityItem } from "@/types/activities";

// Activities API
export async function fetchActivities(limit = 10) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }

  return data as ActivityItem[];
}

export async function fetchActivitiesByType(type: string, limit = 10) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`Error fetching ${type} activities:`, error);
    throw error;
  }

  return data as ActivityItem[];
}

export async function createActivity(
  activity: Omit<ActivityItem, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("activities")
    .insert(activity)
    .select()
    .single();

  if (error) {
    console.error("Error creating activity:", error);
    throw error;
  }

  return data as ActivityItem;
}

export async function updateActivity(
  id: string,
  updates: Partial<ActivityItem>,
) {
  const { data, error } = await supabase
    .from("activities")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating activity:", error);
    throw error;
  }

  return data as ActivityItem;
}

// User Profile API
export async function fetchUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data;
}

export async function updateUserProfile(updates: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("users")
    .upsert({ id: user.id, ...updates })
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data;
}

// Medical History API
export async function fetchMedicalHistory() {
  const { data, error } = await supabase
    .from("medical_history")
    .select("*")
    .order("diagnosis_date", { ascending: false });

  if (error) {
    console.error("Error fetching medical history:", error);
    throw error;
  }

  return data;
}

export async function addMedicalHistoryItem(item: any) {
  const { data, error } = await supabase
    .from("medical_history")
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error("Error adding medical history item:", error);
    throw error;
  }

  return data;
}

// Health Stats API
export async function fetchHealthStats() {
  const { data, error } = await supabase
    .from("health_stats")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    console.error("Error fetching health stats:", error);
    throw error;
  }

  return data;
}

export async function updateHealthStats(stats: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("health_stats")
    .upsert({ user_id: user.id, ...stats })
    .select()
    .single();

  if (error) {
    console.error("Error updating health stats:", error);
    throw error;
  }

  return data;
}

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

type SubscriptionCallback = (payload: any) => void;

export function useSupabaseSubscription(
  table: string,
  event: "INSERT" | "UPDATE" | "DELETE" | "*",
  callback: SubscriptionCallback,
) {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        {
          event,
          schema: "public",
          table,
        },
        callback,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, callback]);
}

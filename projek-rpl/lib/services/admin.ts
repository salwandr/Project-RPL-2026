import { supabase } from "@/lib/supabase";

export async function getAllChildren() {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function approveChildPayment(childId: string) {
  const { data, error } = await supabase
    .from("children")
    .update({
      payment_status: "approved",
    })
    .eq("id", childId)
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) throw error;

  return data;
}

export async function getAllDailyLogs() {
  const { data, error } = await supabase
    .from("daily_logs")
    .select(`
      *,
      children (
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateAdminDailyLog(logId: string, updates: any) {
  const { data, error } = await supabase
    .from("daily_logs")
    .update(updates)
    .eq("id", logId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAdminDailyLog(logId: string) {
  const { error } = await supabase
    .from("daily_logs")
    .delete()
    .eq("id", logId);

  if (error) throw error;
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) throw error;

  return data;
}

export async function rejectChildPayment(childId: string) {
  const { data, error } = await supabase
    .from("children")
    .update({
      payment_status: "rejected", // change to your enum value
    })
    .eq("id", childId)
    .select();

  if (error) throw error;

  return data;
}

export async function updateChildPaymentDetails(
  childId: string,
  updates: {
    start_date: string | null;
    end_date: string | null;
    total_amount: number | null;
  }
) {
  const { data, error } = await supabase
    .from("children")
    .update(updates)
    .eq("id", childId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
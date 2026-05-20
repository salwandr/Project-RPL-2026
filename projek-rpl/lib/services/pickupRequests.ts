import { supabase } from "@/lib/supabase";

export async function getPickupRequests() {
  const { data, error } = await supabase
    .from("pickup_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPickupRequestsByChild(childId: number) {
  const { data, error } = await supabase
    .from("pickup_requests")
    .select("*")
    .eq("child_id", childId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createPickupRequest(requestData: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("pickup_requests")
    .insert(requestData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePickupRequest(
  requestId: number,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("pickup_requests")
    .update(updates)
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function approvePickupRequest(
  requestId: number,
  approvedBy: string
) {
  const { data, error } = await supabase
    .from("pickup_requests")
    .update({
      status: "approved",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function rejectPickupRequest(
  requestId: number,
  approvedBy: string
) {
  const { data, error } = await supabase
    .from("pickup_requests")
    .update({
      status: "rejected",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
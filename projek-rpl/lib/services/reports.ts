import { supabase } from "@/lib/supabase";

export async function getReports(childId: number) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("child_id", childId)
    .order("report_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createReport(reportData: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("reports")
    .insert(reportData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReport(
  reportId: number,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("reports")
    .update(updates)
    .eq("id", reportId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReport(reportId: number) {
  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", reportId);

  if (error) throw error;
  return true;
}
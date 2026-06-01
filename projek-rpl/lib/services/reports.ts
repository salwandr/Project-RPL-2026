import { supabase } from "@/lib/supabase";

export async function getReports(childId?: string) {
  let query = supabase
    .from("reports")
    .select(`
      *,
      children (
        full_name
      )
    `)
    .order("report_date", { ascending: false });

  if (childId) {
    query = query.eq("child_id", childId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function createReport(reportData: {
  child_id: string;
  teacher_id?: string;
  report_type: "weekly" | "monthly";
  content: string;
  report_date?: string;
}) {
  const { data, error } = await supabase
    .from("reports")
    .insert(reportData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReport(
  reportId: string,
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

export async function deleteReport(reportId: string) {
  const { error } = await supabase.from("reports").delete().eq("id", reportId);

  if (error) throw error;
  return true;
}
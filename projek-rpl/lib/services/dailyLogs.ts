import { supabase } from "@/lib/supabase";

export async function getDailyLogs(childId: number) {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("child_id", childId)
    .order("log_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createDailyLog(logData: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("daily_logs")
    .insert(logData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDailyLog(
  logId: number,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("daily_logs")
    .update(updates)
    .eq("id", logId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDailyLog(logId: number) {
  const { error } = await supabase
    .from("daily_logs")
    .delete()
    .eq("id", logId);

  if (error) throw error;
  return true;
}

export async function uploadDailyLogPhoto(file: File, filePath: string) {
  const { data, error } = await supabase.storage
    .from("daily-log-photos")
    .upload(filePath, file, {
      upsert: true,
    });

  if (error) throw error;
  return data;
}

export async function getDailyLogPhotoUrl(filePath: string) {
  const { data, error } = await supabase.storage
    .from("daily-log-photos")
    .createSignedUrl(filePath, 60 * 60);

  if (error) throw error;
  return data.signedUrl;
}
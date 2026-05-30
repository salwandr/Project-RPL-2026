import { supabase } from "@/lib/supabase";

export interface Child {
  id: string;
  full_name: string;
  birth_date: string | null;
}

export interface DailyLog {
  id: string;
  child_id: string;
  teacher_id: string;
  log_date: string;
  title: string | null;
  description: string | null;
  photo_url: string | null;
  // Makan
  makan_pagi_porsi: "habis" | "setengah" | "sedikit" | "tidak" | null;
  makan_pagi_menu: string | null;
  makan_pagi_catatan: string | null;
  makan_siang_porsi: "habis" | "setengah" | "sedikit" | "tidak" | null;
  makan_siang_menu: string | null;
  makan_siang_catatan: string | null;
  snack_pagi: string | null;
  snack_sore: string | null;
  // Tidur
  tidur_mulai: string | null;
  tidur_selesai: string | null;
  tidur_kualitas: "nyenyak" | "gelisah" | "tidak" | null;
  // Toilet
  toilet: "mandiri" | "dibantu" | "belum" | "tidak" | null;
  toilet_frekuensi: string | null;
  // Mood
  mood: "senang" | "biasa" | "rewel" | "mengantuk" | null;
  mood_catatan: string | null;
  // Aktivitas
  aktivitas_belajar: string[] | null;
  bermain_catatan: string | null;
  // Catatan & foto
  catatan_umum: string | null;
  foto: string[] | null;
}

export async function getChildrenByParent(parentId: string): Promise<Child[]> {
  const { data, error } = await supabase
    .from("children")
    .select("id, full_name, birth_date")
    .eq("parent_id", parentId)
    .order("full_name");

  if (error) throw error;
  return data ?? [];
}

export async function getDailyLogs(childId: string): Promise<DailyLog[]> {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("child_id", childId)
    .order("log_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getDailyLogDates(childId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("log_date")
    .eq("child_id", childId)
    .order("log_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((r) => r.log_date);
}

export async function getDailyLogByDate(
  childId: string,
  date: string
): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("child_id", childId)
    .eq("log_date", date)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

export async function createDailyLog(
  logData: Partial<DailyLog>
): Promise<DailyLog> {
  const { data, error } = await supabase
    .from("daily_logs")
    .insert(logData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDailyLog(
  logId: string,
  updates: Partial<DailyLog>
): Promise<DailyLog> {
  const { data, error } = await supabase
    .from("daily_logs")
    .update(updates)
    .eq("id", logId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDailyLog(logId: string): Promise<boolean> {
  const { error } = await supabase
    .from("daily_logs")
    .delete()
    .eq("id", logId);

  if (error) throw error;
  return true;
}

export async function uploadDailyLogPhoto(
  file: File,
  filePath: string
): Promise<string> {
  const { error } = await supabase.storage
    .from("daily-log-photos")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data: urlData, error: urlError } = await supabase.storage
    .from("daily-log-photos")
    .createSignedUrl(filePath, 60 * 60);

  if (urlError) throw urlError;
  return urlData.signedUrl;
}
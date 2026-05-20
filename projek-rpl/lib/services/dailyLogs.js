import { supabase } from '@/lib/supabase'

export async function getDailyLogs(childId) {
  return await supabase
    .from('daily_logs')
    .select('*')
    .eq('child_id', childId)
    .order('log_date', { ascending: false })
}

export async function createDailyLog(logData) {
  return await supabase
    .from('daily_logs')
    .insert(logData)
    .select()
    .single()
}

export async function updateDailyLog(logId, updates) {
  return await supabase
    .from('daily_logs')
    .update(updates)
    .eq('id', logId)
    .select()
    .single()
}

export async function deleteDailyLog(logId) {
  return await supabase
    .from('daily_logs')
    .delete()
    .eq('id', logId)
}

export async function uploadDailyLogPhoto(file, filePath) {
  return await supabase.storage
    .from('daily-log-photos')
    .upload(filePath, file, {
      upsert: true
    })
}

export async function getDailyLogPhotoUrl(filePath) {
  return await supabase.storage
    .from('daily-log-photos')
    .createSignedUrl(filePath, 60 * 60)
}
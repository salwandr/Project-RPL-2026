import { supabase } from '@/lib/supabase'

export async function getReports(childId) {
  return await supabase
    .from('reports')
    .select('*')
    .eq('child_id', childId)
    .order('report_date', { ascending: false })
}

export async function createReport(reportData) {
  return await supabase
    .from('reports')
    .insert(reportData)
    .select()
    .single()
}

export async function updateReport(reportId, updates) {
  return await supabase
    .from('reports')
    .update(updates)
    .eq('id', reportId)
    .select()
    .single()
}

export async function deleteReport(reportId) {
  return await supabase
    .from('reports')
    .delete()
    .eq('id', reportId)
}
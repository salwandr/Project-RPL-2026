import { supabase } from '@/lib/supabase'

export async function getChildren() {
  return await supabase
    .from('children')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function getChildById(childId) {
  return await supabase
    .from('children')
    .select('*')
    .eq('id', childId)
    .single()
}

export async function createChild(childData) {
  return await supabase
    .from('children')
    .insert(childData)
    .select()
    .single()
}

export async function updateChild(childId, updates) {
  return await supabase
    .from('children')
    .update(updates)
    .eq('id', childId)
    .select()
    .single()
}

export async function deleteChild(childId) {
  return await supabase
    .from('children')
    .delete()
    .eq('id', childId)
}
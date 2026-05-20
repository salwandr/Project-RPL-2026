import { supabase } from '@/lib/supabase'

export async function getPickupRequests() {
  return await supabase
    .from('pickup_requests')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function getPickupRequestsByChild(childId) {
  return await supabase
    .from('pickup_requests')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
}

export async function createPickupRequest(requestData) {
  return await supabase
    .from('pickup_requests')
    .insert(requestData)
    .select()
    .single()
}

export async function updatePickupRequest(requestId, updates) {
  return await supabase
    .from('pickup_requests')
    .update(updates)
    .eq('id', requestId)
    .select()
    .single()
}

export async function approvePickupRequest(requestId, approvedBy) {
  return await supabase
    .from('pickup_requests')
    .update({
      status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single()
}

export async function rejectPickupRequest(requestId, approvedBy) {
  return await supabase
    .from('pickup_requests')
    .update({
      status: 'rejected',
      approved_by: approvedBy,
      approved_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single()
}
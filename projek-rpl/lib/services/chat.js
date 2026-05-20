import { supabase } from '@/lib/supabase'

export async function getConversations() {
  return await supabase
    .from('conversations')
    .select(`
      *,
      conversation_members (
        *,
        profiles (*)
      )
    `)
    .order('created_at', { ascending: false })
}

export async function createConversation() {
  return await supabase
    .from('conversations')
    .insert({})
    .select()
    .single()
}

export async function addConversationMember(conversationId, userId) {
  return await supabase
    .from('conversation_members')
    .insert({
      conversation_id: conversationId,
      user_id: userId
    })
    .select()
    .single()
}

export async function getMessages(conversationId) {
  return await supabase
    .from('messages')
    .select(`
      *,
      profiles (*)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
}

export async function sendMessage(messageData) {
  return await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single()
}

export async function updateMessage(messageId, updates) {
  return await supabase
    .from('messages')
    .update({
      ...updates,
      edited_at: new Date().toISOString()
    })
    .eq('id', messageId)
    .select()
    .single()
}

export async function markMessageAsRead(messageId, userId) {
  return await supabase
    .from('message_reads')
    .upsert({
      message_id: messageId,
      user_id: userId,
      read_at: new Date().toISOString()
    })
}

export function subscribeToMessages(conversationId, callback) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      callback
    )
    .subscribe()
}
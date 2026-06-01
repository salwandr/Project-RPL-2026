import { supabase } from "@/lib/supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export async function getConversations() {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      conversation_members (
        *,
        profiles (*)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createConversation() {
  const { data, error } = await supabase
    .from("conversations")
    .insert({})
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addConversationMember(
  conversationId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("conversation_members")
    .insert({
      conversation_id: conversationId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      profiles (*)
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(messageData: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("messages")
    .insert(messageData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMessage(
  messageId: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("messages")
    .update({
      ...updates,
      edited_at: new Date().toISOString(),
    })
    .eq("id", messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markMessageAsRead(messageId: string, userId: string) {
  const { data, error } = await supabase.from("message_reads").upsert({
    message_id: messageId,
    user_id: userId,
    read_at: new Date().toISOString(),
  });

  if (error) throw error;
  return data;
}

export function subscribeToMessages(
  conversationId: string,
  callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      callback
    )
    .subscribe();
}
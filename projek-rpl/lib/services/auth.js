import { supabase } from '@/lib/supabase'

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function logout() {
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  return { user: data?.user ?? null, error }
}

export async function getCurrentProfile() {
  const { user, error: userError } = await getCurrentUser()
  if (userError || !user) return { profile: null, error: userError }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { profile: data, error }
}
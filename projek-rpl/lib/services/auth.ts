import { supabase } from "@/lib/supabase";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
  return true;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  return data.user ?? null;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function registerParent({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "parent",
      },
    },
  });

  if (error) throw error;

  return data;
}

export async function verifyRegisterOtp({
  email,
  otp,
  fullName,
}: {
  email: string;
  otp: string;
  fullName: string;
}) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp.trim(),
    type: "signup",
  });

  if (error) throw error;

  const user = data.user;

  if (!user) {
    throw new Error("Verifikasi gagal.");
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    role: "parent",
  });

  if (profileError) throw profileError;

  return data;
}
import { supabase } from "@/lib/supabase";

export type Child = {
  id: number;
  name: string;
  kelas: string;
  usia: string;
  wali: string;
  telepon: string;
  avatar: string;
  program: "Harian" | "Bulanan";
  created_at?: string;
};

export type ChildInput = Omit<Child, "id" | "created_at">;

export async function getChildren(): Promise<Child[]> {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getChildById(childId: number): Promise<Child> {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("id", childId)
    .single();

  if (error) throw error;
  return data;
}

export async function createChild(childData: ChildInput): Promise<Child> {
  const { data, error } = await supabase
    .from("children")
    .insert(childData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateChild(
  childId: number,
  updates: Partial<ChildInput>
): Promise<Child> {
  const { data, error } = await supabase
    .from("children")
    .update(updates)
    .eq("id", childId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChild(childId: number): Promise<boolean> {
  const { error } = await supabase
    .from("children")
    .delete()
    .eq("id", childId);

  if (error) throw error;
  return true;
}
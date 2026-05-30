import { supabase } from "@/lib/supabase";

export type ProgramType = "Harian" | "Mingguan" | "Bulanan";
export type PaymentStatus = "pending" | "approved" | "rejected";

export type Child = {
  id: string;
  full_name: string;
  birth_date: string;
  parent_id: string;
  program?: ProgramType | null;
  payment_status?: PaymentStatus | null;
  created_at?: string;
};

export type ChildInput = {
  full_name: string;
  birth_date: string;
  parent_id: string;
  program?: ProgramType | null;
  payment_status?: PaymentStatus | null;
};

export async function getChildren(): Promise<Child[]> {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
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
  childId: string,
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
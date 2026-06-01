import { supabase } from "@/lib/supabase";

export type Attendance = {
  id: string;
  child_id: string;
  teacher_id: string | null;
  date: string;
  status: string;
  jam_checkin: string | null;
  jam_checkout: string | null;
  keterangan: string | null;
  created_at?: string;
  updated_at?: string;
};

export async function getAllAttendance() {
  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      children (
        full_name,
        program
      )
    `)
    .order("date", { ascending: false })
    .order("jam_checkin", { ascending: false });

  if (error) throw error;
  return data;
}

export async function checkInChild(childId: string, teacherId: string, note?: string) {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toTimeString().slice(0, 8);

  const { data, error } = await supabase
    .from("attendance")
    .insert({
      child_id: childId,
      teacher_id: teacherId,
      date: today,
      status: "hadir",
      jam_checkin: now,
      keterangan: note || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkOutChild(
  childId: string,
  checkoutTime?: string
) {
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("attendance")
    .update({
      jam_checkout:
        checkoutTime ||
        new Date().toTimeString().slice(0, 8),
    })
    .eq("child_id", childId)
    .eq("date", today);

  if (error) throw error;
}

export async function createAttendance(data: {
  child_id: string;
  teacher_id: string;
  status: string;
  keterangan?: string;
}) {
  const { error } = await supabase.from("attendance").insert({
    child_id: data.child_id,
    teacher_id: data.teacher_id,
    date: new Date().toISOString().split("T")[0],
    status: data.status,
    jam_checkin: new Date().toTimeString().slice(0, 8),
    keterangan: data.keterangan || null,
  });

  if (error) throw error;
}


export async function getTodayAttendance() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      children (
        full_name,
        program
      )
    `)
    .eq("date", today)
    .is("jam_checkout", null);

  if (error) throw error;

  return data;
}

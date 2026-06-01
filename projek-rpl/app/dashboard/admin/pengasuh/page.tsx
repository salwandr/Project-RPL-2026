"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DataPengasuhPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [fullName, setFullName] = useState("");

  async function loadTeachers() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "teacher")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error("Failed to load teachers:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  function openEdit(teacher: any) {
    setEditingTeacher(teacher);
    setFullName(teacher.full_name || "");
  }

  async function handleSave() {
    if (!editingTeacher) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", editingTeacher.id);

    if (error) {
      console.error(error);
      alert("Failed to update teacher.");
      return;
    }

    setEditingTeacher(null);
    loadTeachers();
  }

  async function handleDelete(teacherId: string) {
    const yes = confirm("Delete this teacher?");
    if (!yes) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", teacherId);

    if (error) {
      console.error(error);
      alert("Failed to delete teacher.");
      return;
    }

    loadTeachers();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">Data Pengasuh</h1>
      <p className="mt-1 text-gray-500">
        Kelola seluruh data pengasuh yang terdaftar.
      </p>

      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : teachers.length === 0 ? (
          <p className="text-gray-500">Belum ada data pengasuh.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="pb-4">Nama Pengasuh</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Tanggal Daftar</th>
                <th className="pb-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-b last:border-none">
                  <td className="py-4 font-bold">
                    {teacher.full_name || "-"}
                  </td>
                  <td>{teacher.role}</td>
                  <td>
                    {teacher.created_at
                      ? new Date(teacher.created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => openEdit(teacher)}
                      className="mr-3 rounded-full bg-pastel-blue px-4 py-2 text-sm font-bold text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-black">Edit Data Pengasuh</h2>

            <div className="mt-6">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Pengasuh"
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setEditingTeacher(null)}
                className="rounded-full bg-gray-100 px-5 py-3 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="rounded-full bg-sage-green px-5 py-3 font-bold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DataOrangTuaPage() {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingParent, setEditingParent] = useState<any>(null);
  const [fullName, setFullName] = useState("");

  async function loadParents() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "parent")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setParents(data || []);
    } catch (error) {
      console.error("Failed to load parents:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadParents();
  }, []);

  function openEdit(parent: any) {
    setEditingParent(parent);
    setFullName(parent.full_name || "");
  }

  async function handleSave() {
    if (!editingParent) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
      })
      .eq("id", editingParent.id);

    if (error) {
      console.error(error);
      alert("Failed to update parent.");
      return;
    }

    setEditingParent(null);
    loadParents();
  }

  async function handleDelete(parentId: string) {
    const yes = confirm("Delete this parent?");
    if (!yes) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", parentId);

    if (error) {
      console.error(error);
      alert("Failed to delete parent.");
      return;
    }

    loadParents();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">Data Orang Tua</h1>
      <p className="mt-1 text-gray-500">
        Kelola seluruh data orang tua yang terdaftar.
      </p>

      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : parents.length === 0 ? (
          <p className="text-gray-500">Belum ada data orang tua.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="pb-4">Nama Orang Tua</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Tanggal Daftar</th>
                <th className="pb-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {parents.map((parent) => (
                <tr key={parent.id} className="border-b last:border-none">
                  <td className="py-4 font-bold">
                    {parent.full_name || "-"}
                  </td>
                  <td>{parent.role}</td>
                  <td>
                    {parent.created_at
                      ? new Date(parent.created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => openEdit(parent)}
                      className="mr-3 rounded-full bg-pastel-blue px-4 py-2 text-sm font-bold text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(parent.id)}
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

      {editingParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-black">Edit Data Orang Tua</h2>

            <div className="mt-6">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Orang Tua"
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setEditingParent(null)}
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
"use client";

import { useEffect, useState } from "react";
import { getChildren, updateChild, deleteChild } from "@/lib/services/children";

export default function DataAnakPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChild, setEditingChild] = useState<any>(null);

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [program, setProgram] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  async function loadChildren() {
    try {
      setLoading(true);
      const data = await getChildren();
      setChildren(data);
    } catch (error) {
      console.error("Failed to load children:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChildren();
  }, []);

  function openEdit(child: any) {
    setEditingChild(child);
    setFullName(child.full_name || "");
    setBirthDate(child.birth_date || "");
    setProgram(child.program || "");
    setPaymentStatus(child.payment_status || "");
  }

  async function handleSave() {
    if (!editingChild) return;

    await updateChild(editingChild.id, {
      full_name: fullName,
      birth_date: birthDate,
      program: program as any,
      payment_status: paymentStatus as any,
    });

    setEditingChild(null);
    loadChildren();
  }

  async function handleDelete(childId: string) {
    const yes = confirm("Delete this child?");
    if (!yes) return;

    await deleteChild(childId);
    loadChildren();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">Data Anak</h1>
      <p className="mt-1 text-gray-500">
        Kelola seluruh data anak yang terdaftar.
      </p>

      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="pb-4">Nama Anak</th>
                <th className="pb-4">Tanggal Lahir</th>
                <th className="pb-4">Program</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {children.map((child) => (
                <tr key={child.id} className="border-b last:border-none">
                  <td className="py-4 font-bold">{child.full_name}</td>
                  <td>{child.birth_date || "-"}</td>
                  <td>{child.program || "-"}</td>
                  <td>{child.payment_status || "-"}</td>
                  <td className="text-right">
                    <button
                      onClick={() => openEdit(child)}
                      className="mr-3 rounded-full bg-pastel-blue px-4 py-2 text-sm font-bold text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(child.id)}
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

      {editingChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-black">Edit Data Anak</h2>

            <div className="mt-6 space-y-4">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Anak"
                className="w-full rounded-2xl border px-4 py-3"
              />

              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3"
              />

              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3"
              >
                <option value="">Belum memilih program</option>
                <option value="Harian">Harian</option>
                <option value="Mingguan">Mingguan</option>
                <option value="Bulanan">Bulanan</option>
              </select>

              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setEditingChild(null)}
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
"use client";

import { useEffect, useState } from "react";
import {
  AdminDailyLog,
  getAllDailyLogs,
  deleteDailyLog,
} from "@/lib/services/dailyLogs";

export default function AdminDailyLogPage() {
  const [logs, setLogs] = useState<AdminDailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    try {
      const data = await getAllDailyLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to load daily logs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(logId: string) {
    const confirmDelete = confirm("Delete this daily log?");
    if (!confirmDelete) return;

    try {
      await deleteDailyLog(logId);
      setLogs((prev) => prev.filter((log) => log.id !== logId));
    } catch (error) {
      console.error("Failed to delete daily log:", error);
      alert("Failed to delete daily log.");
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">Daily Log Management</h1>
      <p className="mt-1 text-gray-500">
        View and manage daily activity logs from pengasuh.
      </p>

      {loading ? (
        <p className="mt-8 text-gray-500">Loading daily logs...</p>
      ) : logs.length === 0 ? (
        <p className="mt-8 text-gray-500">No daily logs yet.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-5">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-[2rem] border border-warm-beige/40 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">
                    {log.children?.full_name || "Unknown Child"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Pengasuh: {log.profiles?.full_name || "Unknown Pengasuh"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Date: {log.log_date}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(log.id)}
                  className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-bold">Mood</p>
                  <p className="text-gray-600">{log.mood || "-"}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {log.mood_catatan || ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-bold">Makan</p>
                  <p className="text-gray-600">
                    Pagi: {log.makan_pagi_porsi || "-"} | Siang:{" "}
                    {log.makan_siang_porsi || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-bold">Tidur</p>
                  <p className="text-gray-600">
                    {log.tidur_mulai || "-"} - {log.tidur_selesai || "-"}
                  </p>
                  <p className="text-gray-600">
                    Kualitas: {log.tidur_kualitas || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-bold">Toilet</p>
                  <p className="text-gray-600">
                    {log.toilet || "-"} ({log.toilet_frekuensi || "-"})
                  </p>
                </div>
              </div>

              {log.catatan_umum && (
                <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                  <p className="font-bold">Catatan Umum</p>
                  <p className="mt-1 text-gray-600">{log.catatan_umum}</p>
                </div>
              )}

              {log.foto && log.foto.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {log.foto.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Daily log photo"
                      className="h-40 w-40 rounded-2xl object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
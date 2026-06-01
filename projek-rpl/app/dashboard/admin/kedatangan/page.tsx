"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Attendance = {
  id: string;
  date: string;
  status: string;
  jam_checkin: string | null;
  jam_checkout: string | null;
  keterangan: string | null;
  children: {
    full_name: string;
    program: string | null;
  }[];
};

export default function AdminKedatanganPage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("attendance")
        .select(`
          id,
          date,
          status,
          jam_checkin,
          jam_checkout,
          keterangan,
          children (
            full_name,
            program
          )
        `)
        .order("date", { ascending: false })
        .order("jam_checkin", { ascending: false });

      if (error) throw error;

      setAttendance(data || []);
    } catch (err) {
      console.error("ADMIN ATTENDANCE ERROR:", err);
      alert("Gagal memuat data kedatangan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">Kedatangan Anak</h1>

      <p className="mt-2 text-gray-500">
        Pantau data kedatangan anak yang sudah dicatat oleh pengasuh.
      </p>

      <div className="mt-8 rounded-[2rem] border border-warm-beige/40 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">Riwayat Kedatangan</h2>

        {loading ? (
          <p className="mt-6 text-gray-500">Memuat data...</p>
        ) : attendance.length === 0 ? (
          <p className="mt-6 text-gray-500">Belum ada data kedatangan.</p>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {attendance.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-warm-beige/40 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-black">
                      {item.children?.[0]?.full_name || "Nama anak tidak ditemukan"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Program: {item.children?.[0]?.program || "-"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Tanggal: {item.date}
                    </p>

                    {item.keterangan && (
                      <p className="mt-1 text-sm text-gray-500">
                        Keterangan: {item.keterangan}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="rounded-full bg-lime/20 px-4 py-2 text-sm font-black text-green-700">
                      {item.status}
                    </span>

                    <p className="mt-3 text-sm text-gray-500">
                      Check-in
                    </p>

                    <p className="text-2xl font-black">
                      {item.jam_checkin ? item.jam_checkin.slice(0, 5) : "-"}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Check-out:{" "}
                      {item.jam_checkout ? item.jam_checkout.slice(0, 5) : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
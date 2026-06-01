"use client";

import { useEffect, useState } from "react";
import { getAllAttendance } from "@/lib/services/attendance";

export default function PenjemputanPage() {
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    try {
      const data = await getAllAttendance();
      setAttendance(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">
        Penjemputan Anak
      </h1>

      <p className="mt-2 text-gray-500">
        Catat anak yang sudah dijemput.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {attendance.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-warm-beige/40 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {item.children?.full_name || item.children?.[0]?.full_name || "Nama anak tidak ditemukan"}
                </h2>

                <p className="text-sm text-gray-500">
                  {item.children?.[0]?.program || "-"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Check In:
                  {" "}
                  {item.jam_checkin?.slice(0, 5)}
                </p>
              </div>

                <div className="text-right">
                <p className="text-sm text-gray-500">
                    Check Out
                </p>

                <p className="text-xl font-black">
                    {item.jam_checkout
                    ? item.jam_checkout.slice(0, 5)
                    : "Belum"}
                </p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
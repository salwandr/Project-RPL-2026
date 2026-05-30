"use client";

import { useEffect, useState } from "react";
import { getChildren } from "@/lib/services/children";
import { useRouter } from "next/navigation";
import { getDailyLogs } from "@/lib/services/dailyLogs";

export default function OrangTuaDashboard() {
  const [anakCount, setAnakCount] = useState(0);
  const [dailyLogCount, setDailyLogCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [latestLogs, setLatestLogs] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const children = await getChildren();

        setAnakCount(children?.length || 0);

        if (children && children.length > 0) {
          const firstChild = children[0];
          const logs = await getDailyLogs(firstChild.id);

          setDailyLogCount(logs?.length || 0);
          setLatestLogs(logs?.slice(0, 3) || []);
        }
      } catch (error) {
        console.error("Failed to load orang tua dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

return (
  <div className="min-h-screen bg-background font-montserrat text-foreground">
    <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm border border-warm-beige/50">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-warm-beige/30 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-pastel-blue/20 blur-3xl" />
      <div className="absolute left-1/2 top-16 h-52 w-52 rounded-full bg-bubblegum/15 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-warm-beige bg-white px-4 py-2 shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A]">
            Dashboard Orang Tua
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          Pantau Aktivitas
          <br />
          <span className="text-sage-green">Anak Anda</span>
        </h1>

        <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-[#4A4A4A] md:text-base">
          Lihat data anak, daily log, dan status pembayaran Tanika Daycare
          dalam satu dashboard.
        </p>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-[2rem] border border-white bg-warm-beige/40 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4A4A4A]">
          Anak Terdaftar
        </p>

        <p className="mt-4 text-5xl font-bold text-foreground">
          {anakCount}
        </p>
      </div>

      <div className="rounded-[2rem] border border-white bg-sage-green/20 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4A4A4A]">
          Daily Log Hari Ini
        </p>

        <p className="mt-4 text-5xl font-bold text-sage-green">
          {dailyLogCount}
        </p>
      </div>

      <div className="rounded-[2rem] border border-white bg-bubblegum/20 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4A4A4A]">
          Status Pembayaran
        </p>

        <p className="mt-5 text-xl font-bold text-foreground">
          Belum disambung
        </p>
      </div>
    </div>
    
      <div className="mt-6 rounded-[2rem] border border-white bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-foreground">
      Daily Log Terbaru
    </h2>

    <div className="mt-4 space-y-3">
      {latestLogs.length === 0 ? (
        <p className="text-sm text-gray-500">
          Belum ada daily log hari ini.
        </p>
      ) : (
        latestLogs.map((log) => (
          <div
            key={log.id}
            className="rounded-xl bg-sage-green/10 p-3"
          >
            <p className="text-xs font-medium text-sage-green">
              {log.activity_time?.slice(0, 5)}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {log.title || "Aktivitas Anak"}
            </p>
          </div>
        ))
      )}
    </div>
  </div>
  </div>
);
}
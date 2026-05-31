"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const TIMELINE = [
  { jam: "07.00", label: "Penyambutan & Check-in" },
  { jam: "07.30", label: "Sarapan Pagi" },
  { jam: "08.30", label: "Circle Time & Doa" },
  { jam: "09.00", label: "Kegiatan Belajar" },
  { jam: "10.00", label: "Snack Time" },
  { jam: "10.30", label: "Bermain Bebas" },
  { jam: "12.00", label: "Makan Siang" },
  { jam: "13.00", label: "Tidur Siang" },
];

interface Anak {
  id: string;
  full_name: string;
  program: string | null;
  logDone: boolean;
}

const today = new Date().toISOString().split("T")[0];

function getNowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(".").map(Number);
  return h * 60 + m;
}

export default function PengasuhDashboardPage() {
  const router = useRouter();
  const [anakList, setAnakList] = useState<Anak[]>([]);
  const [teacherName, setTeacherName] = useState("Pengasuh");
  const [loading, setLoading] = useState(true);

  const nowMinutes = getNowMinutes();
  const timelineWithStatus = TIMELINE.map((t) => ({
    ...t,
    selesai: timeToMinutes(t.jam) < nowMinutes,
  }));
  const nextSchedule = timelineWithStatus.find((t) => !t.selesai);

  const jamSekarang = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, childrenRes, logsRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).single(),
        supabase.from("children").select("id, full_name, program").order("full_name"),
        supabase.from("daily_logs").select("child_id").eq("log_date", today),
      ]);

      if (profileRes.data) setTeacherName(profileRes.data.full_name);

      const children = childrenRes.data ?? [];
      const logs = logsRes.data ?? [];
      setAnakList(children.map((c) => ({
        ...c,
        logDone: logs.some((l) => l.child_id === c.id),
      })));
      setLoading(false);
    }
    load();
  }, []);

  const done = anakList.filter((a) => a.logDone).length;
  const belum = anakList.filter((a) => !a.logDone).length;

  return (
    <div className="space-y-5">

      {/* Hero card */}
      <div className="relative bg-[#1A1A1A] rounded-2xl p-5 md:p-7 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C4E02F]/10 rounded-full translate-x-24 -translate-y-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1883FF]/10 rounded-full -translate-x-16 translate-y-16 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex-1">
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-1">Selamat datang</p>
              <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">{teacherName}</h1>
              <p className="text-white/50 text-[12px] mt-0.5">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Total Anak",  value: anakList.length, color: "#C4E02F", textColor: "text-[#1A1A1A]" },
                { label: "Log Selesai", value: done,            color: "#1883FF", textColor: "text-white"      },
                { label: "Perlu Diisi", value: belum,           color: "#FEB700", textColor: "text-[#1A1A1A]"  },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl px-4 py-3 min-w-[80px] text-center" style={{ background: s.color }}>
                  <p className={`text-2xl font-black ${s.textColor} leading-none`}>{loading ? "—" : s.value}</p>
                  <p className={`text-[10px] font-bold ${s.textColor} opacity-70 mt-1`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {nextSchedule && (
            <div className="mt-4 flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-[#C4E02F] animate-pulse shrink-0" />
              <p className="text-white/60 text-[12px]">
                Jadwal berikutnya: <span className="text-white font-bold">{nextSchedule.label}</span>
                <span className="text-white/40"> · {nextSchedule.jam} WIB</span>
              </p>
              <span className="ml-auto text-white/30 text-[11px] font-mono">{jamSekarang}</span>
            </div>
          )}
        </div>
      </div>

      {/* Anak hadir */}
      <div className="bg-white rounded-2xl border border-[#F0EDE6] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0EDE6] flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-widest">Anak Hari Ini</h2>
          <button onClick={() => router.push("/dashboard/pengasuh/daily-log")}
            className="text-[11px] font-bold text-[#1883FF] hover:underline">
            Lihat semua
          </button>
        </div>

        {loading ? (
          <div className="divide-y divide-[#F7F5F0]">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-[#F0EDE6]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-[#F0EDE6]" />
                  <div className="h-2 w-20 rounded bg-[#F0EDE6]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[#F7F5F0]">
            {anakList.slice(0, 6).map((anak) => (
              <div key={anak.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FFFDF7] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#C4E02F]/15 border border-[#C4E02F]/30 flex items-center justify-center text-[11px] font-black text-[#5a7a00] shrink-0">
                  {anak.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{anak.full_name}</p>
                  <p className="text-[10px] text-[#4A4A4A]">{anak.program ?? "—"}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => router.push("/dashboard/pengasuh/daily-log")}
                    title="Isi Log"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                      ${anak.logDone
                        ? "bg-[#C4E02F]/15 text-[#5a7a00] cursor-default"
                        : "bg-[#1883FF]/10 text-[#1883FF] hover:bg-[#1883FF] hover:text-white"}`}
                  >
                    {anak.logDone ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/pengasuh/penjemputan")}
                    title="Penjemputan"
                    className="w-8 h-8 rounded-lg bg-[#FFE26F]/20 text-[#a07000] hover:bg-[#FFE26F] hover:text-[#1A1A1A] flex items-center justify-center transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress */}
      {!loading && anakList.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#F0EDE6] shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-wider">Progress Log Harian</p>
            <span className="text-[12px] font-bold text-[#1883FF]">{done}/{anakList.length}</span>
          </div>
          <div className="w-full h-2.5 bg-[#F0EDE6] rounded-full overflow-hidden">
            <div className="h-full bg-[#C4E02F] rounded-full transition-all duration-500"
              style={{ width: `${(done / anakList.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-[#F0EDE6] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0EDE6]">
          <h2 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-widest">Jadwal Hari Ini</h2>
        </div>
        <div className="px-5 py-4">
          <div className="flex gap-0 overflow-x-auto pb-2">
            {timelineWithStatus.map((item, i) => {
              const isNext = !item.selesai && (i === 0 || timelineWithStatus[i - 1].selesai);
              return (
                <div key={i} className="flex flex-col items-center" style={{ minWidth: "110px" }}>
                  <div className="flex items-center w-full">
                    <div className={`w-full h-0.5 ${i === 0 ? "invisible" : item.selesai ? "bg-[#C4E02F]" : "bg-[#F0EDE6]"}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all
                      ${item.selesai ? "bg-[#C4E02F] border-[#C4E02F]" : isNext ? "bg-white border-[#1883FF]" : "bg-white border-[#F0EDE6]"}`}>
                      {item.selesai ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isNext ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1883FF] animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[#E8E4DB]" />
                      )}
                    </div>
                    <div className={`w-full h-0.5 ${i === timelineWithStatus.length - 1 ? "invisible" : item.selesai ? "bg-[#C4E02F]" : "bg-[#F0EDE6]"}`} />
                  </div>
                  <div className="mt-2 text-center px-1">
                    <p className={`text-[10px] font-bold ${item.selesai ? "text-[#5a7a00]" : isNext ? "text-[#1883FF]" : "text-[#4A4A4A]/40"}`}>
                      {item.jam}
                    </p>
                    <p className={`text-[10px] mt-0.5 leading-tight font-medium ${item.selesai ? "text-[#4A4A4A]" : isNext ? "text-[#1A1A1A] font-bold" : "text-[#4A4A4A]/30"}`}>
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 

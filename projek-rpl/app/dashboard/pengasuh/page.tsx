"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CHILDREN = [
  { id: 1, nama: "Almira Zahra",  inisial: "AZ", masuk: "07.15", status: "Bermain",  statusColor: "#C4E02F", statusBg: "bg-[#C4E02F]/15", logDone: true  },
  { id: 2, nama: "Bintang Putra", inisial: "BP", masuk: "07.30", status: "Makan",    statusColor: "#FEB700", statusBg: "bg-[#FEB700]/15", logDone: false },
  { id: 3, nama: "Citra Nadia",   inisial: "CN", masuk: "08.00", status: "Tidur",    statusColor: "#99ADFF", statusBg: "bg-[#99ADFF]/15", logDone: false },
  { id: 4, nama: "Dafa Ramadhan", inisial: "DR", masuk: "08.10", status: "Belajar",  statusColor: "#1883FF", statusBg: "bg-[#1883FF]/15", logDone: true  },
  { id: 5, nama: "Elisa Putri",   inisial: "EP", masuk: "07.45", status: "Bermain",  statusColor: "#C4E02F", statusBg: "bg-[#C4E02F]/15", logDone: false },
  { id: 6, nama: "Farhan Akbar",  inisial: "FA", masuk: "07.50", status: "Istirahat",statusColor: "#FFA9DD", statusBg: "bg-[#FFA9DD]/15", logDone: false },
];

const TIMELINE = [
  { jam: "07.00", label: "Penyambutan & Check-in",  selesai: true  },
  { jam: "07.30", label: "Sarapan Pagi",             selesai: true  },
  { jam: "08.30", label: "Circle Time & Doa",        selesai: true  },
  { jam: "09.00", label: "Kegiatan Belajar",         selesai: false },
  { jam: "10.00", label: "Snack Time",               selesai: false },
  { jam: "10.30", label: "Bermain Bebas",            selesai: false },
  { jam: "12.00", label: "Makan Siang",              selesai: false },
  { jam: "13.00", label: "Tidur Siang",              selesai: false },
];

const NOTIFS = [
  { teks: "3 daily log belum diisi hari ini",        warna: "#FEB700", jam: "Sekarang" },
  { teks: "Pesan baru dari orang tua Bintang Putra", warna: "#1883FF", jam: "08.45"   },
  { teks: "Elisa Putri belum check-in",              warna: "#FFA9DD", jam: "08.00"   },
];

const logBelum = CHILDREN.filter((c) => !c.logDone).length;
const logDone  = CHILDREN.filter((c) => c.logDone).length;

export default function PengasuhDashboardPage() {
  const router = useRouter();
  const [selectedQuickChild, setSelectedQuickChild] = useState("");
  const [quickAktivitas, setQuickAktivitas]         = useState("");
  const [quickCatatan, setQuickCatatan]             = useState("");
  const [quickSent, setQuickSent]                   = useState(false);

  const handleQuickLog = async () => {
    if (!selectedQuickChild || !quickAktivitas) return;
    setQuickSent(true);
    await new Promise((r) => setTimeout(r, 1200));
    setQuickSent(false);
    setSelectedQuickChild("");
    setQuickAktivitas("");
    setQuickCatatan("");
  };

  const now = new Date();
  const jamSekarang = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const nextSchedule = TIMELINE.find((t) => !t.selesai);

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
              <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">Siti Aminah</h1>
              <p className="text-white/50 text-[12px] mt-0.5">
                {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Anak Hadir",   value: CHILDREN.length, color: "#C4E02F", textColor: "text-[#1A1A1A]" },
                { label: "Log Selesai",  value: logDone,          color: "#1883FF", textColor: "text-white"      },
                { label: "Perlu Diisi",  value: logBelum,         color: "#FEB700", textColor: "text-[#1A1A1A]"  },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl px-4 py-3 min-w-[80px] text-center"
                  style={{ background: s.color }}
                >
                  <p className={`text-2xl font-black ${s.textColor} leading-none`}>{s.value}</p>
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

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Anak hadir — 2 col */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0EDE6] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0EDE6] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-widest">Anak Hadir Hari Ini</h2>
            <button
              onClick={() => router.push("/dashboard/pengasuh/kedatangan")}
              className="text-[11px] font-bold text-[#1883FF] hover:underline"
            >
              Lihat semua
            </button>
          </div>
          <div className="divide-y divide-[#F7F5F0]">
            {CHILDREN.map((anak) => (
              <div key={anak.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FFFDF7] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#C4E02F]/15 border border-[#C4E02F]/30 flex items-center justify-center text-[11px] font-black text-[#5a7a00] shrink-0">
                  {anak.inisial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{anak.nama}</p>
                  <p className="text-[10px] text-[#4A4A4A]">Masuk {anak.masuk} WIB</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ${anak.statusBg}`} style={{ color: anak.statusColor }}>
                  {anak.status}
                </span>
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
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Quick Log */}
          <div className="bg-white rounded-2xl border border-[#F0EDE6] shadow-sm p-5">
            <h2 className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-4">Log Cepat</h2>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-1.5">Pilih Anak</p>
                <select
                  value={selectedQuickChild}
                  onChange={(e) => setSelectedQuickChild(e.target.value)}
                  className="w-full text-[12px] border border-[#E8E4DB] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-[#C4E02F] transition-colors"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <option value="">Pilih anak...</option>
                  {CHILDREN.map((c) => (
                    <option key={c.id} value={c.nama}>{c.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-1.5">Aktivitas</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Makan", "Tidur", "Bermain", "Belajar"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setQuickAktivitas(a)}
                      className={`py-2 rounded-xl text-[11px] font-bold border transition-all
                        ${quickAktivitas === a
                          ? "bg-[#C4E02F] text-[#1A1A1A] border-[#C4E02F]"
                          : "bg-white text-[#4A4A4A] border-[#E8E4DB] hover:border-[#C4E02F]/50"}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-1.5">Catatan (opsional)</p>
                <textarea
                  value={quickCatatan}
                  onChange={(e) => setQuickCatatan(e.target.value)}
                  rows={2}
                  placeholder="Catatan singkat..."
                  className="w-full text-[12px] border border-[#E8E4DB] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-[#C4E02F] resize-none transition-colors placeholder:text-[#4A4A4A]/30"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <button
                onClick={handleQuickLog}
                disabled={!selectedQuickChild || !quickAktivitas || quickSent}
                className={`w-full py-3 rounded-xl text-[13px] font-bold transition-all
                  ${quickSent
                    ? "bg-[#C4E02F] text-[#1A1A1A]"
                    : !selectedQuickChild || !quickAktivitas
                      ? "bg-[#F0EDE6] text-[#999] cursor-not-allowed"
                      : "bg-[#1A1A1A] text-[#C4E02F] hover:opacity-90 active:scale-95"}`}
              >
                {quickSent ? "Tersimpan" : "Simpan Log"}
              </button>
            </div>
          </div>

          {/* Notifikasi */}
          <div className="bg-white rounded-2xl border border-[#F0EDE6] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0EDE6]">
              <h2 className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-widest">Notifikasi</h2>
            </div>
            <div className="divide-y divide-[#F7F5F0]">
              {NOTIFS.map((n, i) => (
                <div key={i} className="flex gap-3 px-5 py-3.5 hover:bg-[#FFFDF7] transition-colors">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.warna }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1A1A1A] font-medium leading-snug">{n.teks}</p>
                    <p className="text-[10px] text-[#4A4A4A] mt-0.5">{n.jam}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline jadwal */}
      <div className="bg-white rounded-2xl border border-[#F0EDE6] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0EDE6]">
          <h2 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-widest">Jadwal Hari Ini</h2>
        </div>
        <div className="px-5 py-4">
          <div className="flex gap-0 overflow-x-auto pb-2">
            {TIMELINE.map((item, i) => {
              const isNext = !item.selesai && (i === 0 || TIMELINE[i - 1].selesai);
              return (
                <div key={i} className="flex flex-col items-center" style={{ minWidth: "110px" }}>
                  <div className="flex items-center w-full">
                    <div className={`w-full h-0.5 ${i === 0 ? "invisible" : item.selesai ? "bg-[#C4E02F]" : "bg-[#F0EDE6]"}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all
                      ${item.selesai
                        ? "bg-[#C4E02F] border-[#C4E02F]"
                        : isNext
                          ? "bg-white border-[#1883FF]"
                          : "bg-white border-[#F0EDE6]"}`}
                    >
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
                    <div className={`w-full h-0.5 ${i === TIMELINE.length - 1 ? "invisible" : item.selesai ? "bg-[#C4E02F]" : "bg-[#F0EDE6]"}`} />
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
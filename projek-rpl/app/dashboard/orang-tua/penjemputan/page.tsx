"use client";

import { useState } from "react";

type StatusPenjemputan = "menunggu" | "dalam-perjalanan" | "tiba" | "sudah-dijemput";

const STATUS_CONFIG: Record<StatusPenjemputan, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}> = {
  "menunggu": {
    label: "Menunggu Konfirmasi",
    color: "#FEB700",
    bg: "bg-[#FFE26F]/20",
    border: "border-[#FFE26F]",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FEB700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  "dalam-perjalanan": {
    label: "Penjemput Dalam Perjalanan",
    color: "#1883FF",
    bg: "bg-[#1883FF]/10",
    border: "border-[#1883FF]/30",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1883FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  "tiba": {
    label: "Penjemput Sudah Tiba",
    color: "#C4E02F",
    bg: "bg-[#C4E02F]/15",
    border: "border-[#C4E02F]/40",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4E02F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  "sudah-dijemput": {
    label: "Anak Sudah Dijemput",
    color: "#99ADFF",
    bg: "bg-[#99ADFF]/15",
    border: "border-[#99ADFF]/30",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#99ADFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
};

const PENJEMPUT_LIST = [
  { id: "1", nama: "Ayah — Bapak Andi", hubungan: "Ayah Kandung", telepon: "0812-3456-7890" },
  { id: "2", nama: "Ibu — Bu Rini", hubungan: "Ibu Kandung", telepon: "0823-9988-1234" },
  { id: "3", nama: "Nenek — Ibu Suharti", hubungan: "Nenek", telepon: "0878-5432-9900" },
];

const HISTORY = [
  { tanggal: "Senin, 12 Mei 2026", penjemput: "Ayah — Bapak Andi", jam: "16.45", status: "sudah-dijemput" as StatusPenjemputan },
  { tanggal: "Jumat, 09 Mei 2026", penjemput: "Ibu — Bu Rini", jam: "17.10", status: "sudah-dijemput" as StatusPenjemputan },
  { tanggal: "Kamis, 08 Mei 2026", penjemput: "Nenek — Ibu Suharti", jam: "16.30", status: "sudah-dijemput" as StatusPenjemputan },
];

export default function PenjemputanOrangTua() {
  const [statusHariIni] = useState<StatusPenjemputan>("dalam-perjalanan");
  const [selectedPenjemput, setSelectedPenjemput] = useState("1");
  const [jamJemput, setJamJemput] = useState("16:30");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const cfg = STATUS_CONFIG[statusHariIni];

  const handleKonfirmasi = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setConfirmed(true); }, 800);
  };

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="relative bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#99ADFF]/20 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFA9DD]/10 rounded-full translate-y-10 -translate-x-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#99ADFF]/20 border border-[#99ADFF]/30 rounded-full px-3 py-1 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#1883FF] animate-pulse" />
            <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider">Penjemputan Hari Ini</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Penjemputan Zahra</h1>
          <p className="text-[#4A4A4A] text-sm font-light mt-1">Selasa, 13 Mei 2026 · Jam operasional sampai 18.00</p>
        </div>
      </div>

      {/* STATUS CARD */}
      <div className={`${cfg.bg} border-2 ${cfg.border} rounded-[2rem] p-6`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            {cfg.icon}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] mb-1">Status Saat Ini</p>
            <p className="text-xl font-black" style={{ color: cfg.color }}>{cfg.label}</p>
          </div>
        </div>

        {/* Step progress */}
        <div className="mt-6 flex items-center gap-1">
          {(["menunggu", "dalam-perjalanan", "tiba", "sudah-dijemput"] as StatusPenjemputan[]).map((s, i, arr) => {
            const steps = ["menunggu", "dalam-perjalanan", "tiba", "sudah-dijemput"];
            const currentIdx = steps.indexOf(statusHariIni);
            const stepIdx = steps.indexOf(s);
            const done = stepIdx <= currentIdx;
            return (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all
                  ${done ? "bg-[#1883FF] text-white" : "bg-white border-2 border-[#D1D5DB] text-[#9CA3AF]"}`}>
                  {done ? "✓" : i + 1}
                </div>
                {i < arr.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full mx-1 transition-all ${stepIdx < currentIdx ? "bg-[#1883FF]" : "bg-[#E5E7EB]"}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {["Menunggu", "Perjalanan", "Tiba", "Selesai"].map((l) => (
            <span key={l} className="text-[9px] font-semibold text-[#4A4A4A] w-6 text-center">{l}</span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* FORM KONFIRMASI */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1883FF]/10 rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1883FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="font-bold text-[#1A1A1A]">Konfirmasi Penjemput</h2>
          </div>

          {confirmed ? (
            <div className="bg-[#C4E02F]/15 border border-[#C4E02F]/40 rounded-2xl p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-[#C4E02F] rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-bold text-[#1A1A1A]">Konfirmasi Terkirim!</p>
              <p className="text-sm text-[#4A4A4A] font-light">Pengasuh sudah menerima informasi penjemputan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pilih penjemput */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 ml-1">Siapa yang akan menjemput?</label>
                <div className="space-y-2">
                  {PENJEMPUT_LIST.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPenjemput(p.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all
                        ${selectedPenjemput === p.id
                          ? "border-[#1883FF] bg-[#1883FF]/5"
                          : "border-[#FFE26F] bg-white hover:border-[#1883FF]/40"
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                        ${selectedPenjemput === p.id ? "border-[#1883FF] bg-[#1883FF]" : "border-[#D1D5DB]"}`}>
                        {selectedPenjemput === p.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">{p.nama}</p>
                        <p className="text-xs text-[#4A4A4A] font-light">{p.hubungan} · {p.telepon}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Jam jemput */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 ml-1">Estimasi jam jemput</label>
                <input
                  type="time"
                  value={jamJemput}
                  onChange={(e) => setJamJemput(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all text-[#1A1A1A] font-semibold"
                />
              </div>

              <button
                onClick={handleKonfirmasi}
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-lg
                  ${loading
                    ? "bg-[#1883FF]/50 text-white cursor-not-allowed"
                    : "bg-[#1883FF] text-white hover:bg-[#1570e0] shadow-[#1883FF]/25 hover:scale-[1.01]"
                  }`}
              >
                {loading ? "Mengirim..." : "Konfirmasi Penjemputan"}
              </button>
            </div>
          )}
        </div>

        {/* RIWAYAT */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFE26F]/40 rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FEB700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 className="font-bold text-[#1A1A1A]">Riwayat Penjemputan</h2>
          </div>

          <div className="space-y-3">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFDF7] border border-[#FFE26F]/30">
                <div className="w-9 h-9 bg-[#C4E02F]/20 rounded-xl flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4E02F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A1A1A] truncate">{h.penjemput}</p>
                  <p className="text-xs text-[#4A4A4A] font-light">{h.tanggal}</p>
                </div>
                <span className="text-sm font-black text-[#1883FF] shrink-0">{h.jam}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
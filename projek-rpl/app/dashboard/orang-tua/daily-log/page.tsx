"use client";

import { useState } from "react";

const DATES = [
  "2026-05-13",
  "2026-05-12",
  "2026-05-11",
  "2026-05-08",
  "2026-05-07",
];

const LOGS: Record<string, {
  mandi: boolean;
  makan: { pagi: boolean; siang: boolean; sore: boolean };
  bermain: string;
  membaca: boolean;
  Mewarnai: boolean;
  bintang: number;
  catatan: string;
  foto?: string;
}> = {
  "2026-05-13": {
    mandi: true,
    makan: { pagi: true, siang: true, sore: false },
    bermain: "Lego, mewarnai, bermain pasir",
    membaca: true,
    Mewarnai: true,
    bintang: 5,
    catatan: "Hari ini Zahra sangat aktif dan ceria. Makan siang dengan lahap dan mau berbagi mainan dengan teman-temannya. Hebat!",
  },
  "2026-05-12": {
    mandi: true,
    makan: { pagi: true, siang: false, sore: true },
    bermain: "Puzzle, menggambar",
    membaca: false,
    Mewarnai: true,
    bintang: 4,
    catatan: "Zahra sedikit rewel saat makan siang, namun mood membaik setelah istirahat. Aktif bermain puzzle bersama teman.",
  },
  "2026-05-11": {
    mandi: true,
    makan: { pagi: true, siang: true, sore: true },
    bermain: "Bola, berlari-lari di taman",
    membaca: true,
    Mewarnai: true,
    bintang: 5,
    catatan: "Hari yang luar biasa! Zahra sangat semangat dan menghabiskan semua makanannya. Sudah bisa hafal surat Al-Fatihah.",
  },
  "2026-05-08": {
    mandi: false,
    makan: { pagi: true, siang: true, sore: false },
    bermain: "Boneka, main masak-masakan",
    membaca: true,
    Mewarnai: false,
    bintang: 3,
    catatan: "Zahra kurang fit hari ini, sempat merasa tidak enak badan setelah makan siang. Diistirahatkan lebih banyak.",
  },
  "2026-05-07": {
    mandi: true,
    makan: { pagi: false, siang: true, sore: true },
    bermain: "Krayon dan buku gambar",
    membaca: true,
    Mewarnai: true,
    bintang: 4,
    catatan: "Zahra menunjukkan kreativitas tinggi dalam menggambar hari ini. Gambar rumah dan keluarganya sangat detail dan berwarna.",
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "short",
  });
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="16" height="16" viewBox="0 0 24 24"
          fill={i <= value ? "#FEB700" : "none"}
          stroke={i <= value ? "#FEB700" : "#D1D5DB"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function CheckBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-all
      ${ok
        ? "bg-[#C4E02F]/15 border-[#C4E02F]/40 text-[#4A4A4A]"
        : "bg-[#FFA9DD]/10 border-[#FFA9DD]/30 text-[#4A4A4A]"
      }`}
    >
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shrink-0
        ${ok ? "bg-[#C4E02F]" : "bg-[#FFA9DD]"}`}
      >
        {ok ? "✓" : "✕"}
      </span>
      {label}
    </div>
  );
}

export default function DailyLogOrangTua() {
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const log = LOGS[selectedDate];

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="relative bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFE26F]/20 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1883FF]/10 rounded-full translate-y-10 -translate-x-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FFE26F]/30 border border-[#FFE26F] rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FEB700] animate-pulse" />
              <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider">Laporan Harian</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Daily Log Zahra</h1>
            <p className="text-[#4A4A4A] text-sm font-light mt-1">Kelas Matahari · Pengasuh: Bu Sari</p>
          </div>
          <div className="flex items-center gap-2 bg-[#1883FF]/10 border border-[#1883FF]/20 rounded-2xl px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1883FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-sm font-bold text-[#1883FF]">{formatDate(selectedDate)}</span>
          </div>
        </div>
      </div>

      {/* DATE SELECTOR */}
      <div>
        <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-3 ml-1">Pilih Tanggal</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {DATES.map((d) => {
            const isSelected = d === selectedDate;
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`flex flex-col items-center px-4 py-3 rounded-2xl border-2 font-semibold transition-all whitespace-nowrap shrink-0
                  ${isSelected
                    ? "bg-[#1883FF] border-[#1883FF] text-white shadow-lg shadow-[#1883FF]/25"
                    : "bg-white border-[#FFE26F] text-[#4A4A4A] hover:border-[#1883FF]/40 hover:bg-[#1883FF]/5"
                  }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-70">
                  {new Date(d).toLocaleDateString("id-ID", { weekday: "short" })}
                </span>
                <span className="text-lg font-bold leading-tight">{new Date(d).getDate()}</span>
                <span className="text-[10px] opacity-70">
                  {new Date(d).toLocaleDateString("id-ID", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {log && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* RUTINITAS */}
          <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#99ADFF]/20 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#99ADFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h2 className="font-bold text-[#1A1A1A]">Rutinitas</h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <CheckBadge ok={log.mandi} label="Mandi" />
              <CheckBadge ok={log.membaca} label="membaca" />
              <CheckBadge ok={log.Mewarnai} label="Mewarnai" />
              <CheckBadge ok={log.makan.pagi} label="Makan Pagi" />
              <CheckBadge ok={log.makan.siang} label="Makan Siang" />
              <CheckBadge ok={log.makan.sore} label="Makan Sore" />
            </div>
          </div>

          {/* RATING & BERMAIN */}
          <div className="space-y-4">
            {/* Bintang */}
            <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#FFE26F]/40 rounded-xl flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FEB700" stroke="#FEB700" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h2 className="font-bold text-[#1A1A1A]">Penilaian Hari Ini</h2>
              </div>
              <div className="flex items-center gap-3">
                <StarRating value={log.bintang} />
                <span className="text-2xl font-black text-[#1A1A1A]">{log.bintang}</span>
                <span className="text-[#4A4A4A] text-sm font-light">/ 5</span>
              </div>
            </div>

            {/* Bermain */}
            <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#FFA9DD]/20 rounded-xl flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFA9DD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <h2 className="font-bold text-[#1A1A1A]">Aktivitas Bermain</h2>
              </div>
              <p className="text-sm text-[#4A4A4A] font-medium bg-[#FFA9DD]/10 rounded-xl px-4 py-3 border border-[#FFA9DD]/20">
                {log.bermain}
              </p>
            </div>
          </div>

          {/* CATATAN PENGASUH — full width */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#C4E02F]/20 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4E02F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="font-bold text-[#1A1A1A]">Catatan Pengasuh</h2>
            </div>
            <div className="relative bg-[#FFFDF7] border border-[#FFE26F]/40 rounded-2xl p-5">
              <div className="absolute top-4 left-4 w-1 h-[calc(100%-2rem)] bg-[#FFE26F] rounded-full" />
              <p className="text-sm text-[#4A4A4A] leading-relaxed pl-4 font-light italic">
                "{log.catatan}"
              </p>
            </div>
            <p className="text-right text-xs text-[#4A4A4A] font-medium mt-2">— Bu Sari, Pengasuh Kelas Matahari</p>
          </div>

        </div>
      )}
    </div>
  );
}
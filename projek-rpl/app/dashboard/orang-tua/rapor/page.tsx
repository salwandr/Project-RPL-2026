"use client";

import { useState } from "react";

const BULAN = [
  { label: "Mei 2026",      value: "2026-05" },
  { label: "April 2026",    value: "2026-04" },
  { label: "Maret 2026",    value: "2026-03" },
  { label: "Februari 2026", value: "2026-02" },
];

type RaporData = {
  totalHadir: number;
  totalHariKerja: number;
  rutinitas: { label: string; persen: number; color: string }[];
  kegiatan: { label: string; persen: number; color: string }[];
  rataRataBintang: number;
  catatanPengasuh: string;
  highlight: string[];
};

const RAPOR: Record<string, RaporData> = {
  "2026-05": {
    totalHadir: 9,
    totalHariKerja: 13,
    rutinitas: [
      { label: "Mandi",       persen: 100, color: "#1883FF"  },
      { label: "Makan Pagi",  persen: 89,  color: "#FEB700"  },
      { label: "Makan Siang", persen: 78,  color: "#FFA9DD"  },
      { label: "Makan Sore",  persen: 67,  color: "#99ADFF"  },
      { label: "membaca",     persen: 89,  color: "#C4E02F"  },
      { label: "Mewarnai",      persen: 78,  color: "#1883FF"  },
    ],
    kegiatan: [
      { label: "Bermain Bebas",    persen: 100, color: "#FEB700" },
      { label: "Seni & Kreativitas", persen: 90, color: "#FFA9DD" },
      { label: "Motorik Halus",    persen: 80,  color: "#C4E02F" },
      { label: "Motorik Kasar",    persen: 95,  color: "#1883FF" },
      { label: "Sosial & Emosi",   persen: 85,  color: "#99ADFF" },
    ],
    rataRataBintang: 4.4,
    catatanPengasuh: "Zahra menunjukkan perkembangan yang sangat baik di bulan Mei. Ia semakin percaya diri berinteraksi dengan teman-temannya dan mulai menunjukkan kemampuan kepemimpinan dalam permainan kelompok. Kemampuan motorik halus meningkat pesat — gambar-gambarnya semakin detail. Terus semangat Zahra!",
    highlight: [
      "Bisa hafal Surat Al-Fatihah",
      "Aktif berbagi mainan dengan teman",
      "Senang menggambar dan mewarnai",
      "Sudah mau makan sayur tanpa diminta",
    ],
  },
  "2026-04": {
    totalHadir: 20,
    totalHariKerja: 22,
    rutinitas: [
      { label: "Mandi",       persen: 100, color: "#1883FF" },
      { label: "Makan Pagi",  persen: 95,  color: "#FEB700" },
      { label: "Makan Siang", persen: 85,  color: "#FFA9DD" },
      { label: "Makan Sore",  persen: 80,  color: "#99ADFF" },
      { label: "membaca",     persen: 91,  color: "#C4E02F" },
      { label: "Mewarnai",      persen: 86,  color: "#1883FF" },
    ],
    kegiatan: [
      { label: "Bermain Bebas",     persen: 100, color: "#FEB700" },
      { label: "Seni & Kreativitas", persen: 85, color: "#FFA9DD" },
      { label: "Motorik Halus",     persen: 75,  color: "#C4E02F" },
      { label: "Motorik Kasar",     persen: 90,  color: "#1883FF" },
      { label: "Sosial & Emosi",    persen: 88,  color: "#99ADFF" },
    ],
    rataRataBintang: 4.2,
    catatanPengasuh: "April berjalan dengan baik. Zahra mulai terbiasa dengan rutinitas harian dan lebih mandiri. Senang melihat perkembangannya!",
    highlight: [
      "Lebih mandiri dalam makan",
      "Teman-teman menyukainya",
      "Rajin mengikuti kegiatan seni",
    ],
  },
  "2026-03": {
    totalHadir: 18,
    totalHariKerja: 21,
    rutinitas: [
      { label: "Mandi",       persen: 95, color: "#1883FF" },
      { label: "Makan Pagi",  persen: 80, color: "#FEB700" },
      { label: "Makan Siang", persen: 75, color: "#FFA9DD" },
      { label: "Makan Sore",  persen: 70, color: "#99ADFF" },
      { label: "membaca",     persen: 85, color: "#C4E02F" },
      { label: "Mewarnai",      persen: 80, color: "#1883FF" },
    ],
    kegiatan: [
      { label: "Bermain Bebas",     persen: 100, color: "#FEB700" },
      { label: "Seni & Kreativitas", persen: 80, color: "#FFA9DD" },
      { label: "Motorik Halus",     persen: 70,  color: "#C4E02F" },
      { label: "Motorik Kasar",     persen: 85,  color: "#1883FF" },
      { label: "Sosial & Emosi",    persen: 75,  color: "#99ADFF" },
    ],
    rataRataBintang: 3.9,
    catatanPengasuh: "Zahra masih dalam proses adaptasi di awal Maret. Namun sudah mulai menunjukkan progress yang baik.",
    highlight: [
      "Mulai berani bermain dengan teman baru",
      "Sudah hafal nama-nama pengasuh",
    ],
  },
  "2026-02": {
    totalHadir: 15,
    totalHariKerja: 20,
    rutinitas: [
      { label: "Mandi",       persen: 90, color: "#1883FF" },
      { label: "Makan Pagi",  persen: 70, color: "#FEB700" },
      { label: "Makan Siang", persen: 65, color: "#FFA9DD" },
      { label: "Makan Sore",  persen: 60, color: "#99ADFF" },
      { label: "membaca",     persen: 75, color: "#C4E02F" },
      { label: "Mewarnai",      persen: 70, color: "#1883FF" },
    ],
    kegiatan: [
      { label: "Bermain Bebas",     persen: 95, color: "#FEB700" },
      { label: "Seni & Kreativitas", persen: 70, color: "#FFA9DD" },
      { label: "Motorik Halus",     persen: 65,  color: "#C4E02F" },
      { label: "Motorik Kasar",     persen: 80,  color: "#1883FF" },
      { label: "Sosial & Emosi",    persen: 65,  color: "#99ADFF" },
    ],
    rataRataBintang: 3.6,
    catatanPengasuh: "Bulan pertama Zahra di Tanika Daycare. Masih dalam tahap adaptasi namun sudah menunjukkan kemajuan.",
    highlight: [
      "Hari pertama tanpa menangis",
      "Mulai berani berkenalan",
    ],
  },
};

function ProgressBar({ persen, color }: { persen: number; color: string }) {
  return (
    <div className="w-full bg-[#F3F4F6] rounded-full h-2.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${persen}%`, backgroundColor: color }}
      />
    </div>
  );
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="relative w-5 h-5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#E5E7EB" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="#FEB700" stroke="none"
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${Math.max(0, (i - value) * 100)}% 0 0)` }}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function RaporOrangTua() {
  const [selectedBulan, setSelectedBulan] = useState(BULAN[0].value);
  const rapor = RAPOR[selectedBulan];
  const persenHadir = Math.round((rapor.totalHadir / rapor.totalHariKerja) * 100);

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="relative bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-[#C4E02F]/15 rounded-full -translate-y-20 translate-x-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#1883FF]/10 rounded-full translate-y-12 -translate-x-12 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#C4E02F]/20 border border-[#C4E02F]/40 rounded-full px-3 py-1 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#C4E02F]" />
            <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider">Rapor Bulanan</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Rapor Perkembangan Zahra</h1>
          <p className="text-[#4A4A4A] text-sm font-light mt-1">Kelas Matahari · Pengasuh: Bu Sari</p>
        </div>
      </div>

      {/* BULAN SELECTOR */}
      <div>
        <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-3 ml-1">Pilih Bulan</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {BULAN.map((b) => {
            const isSelected = b.value === selectedBulan;
            return (
              <button
                key={b.value}
                onClick={() => setSelectedBulan(b.value)}
                className={`px-5 py-2.5 rounded-2xl border-2 font-semibold text-sm transition-all whitespace-nowrap shrink-0
                  ${isSelected
                    ? "bg-[#1883FF] border-[#1883FF] text-white shadow-lg shadow-[#1883FF]/25"
                    : "bg-white border-[#FFE26F] text-[#4A4A4A] hover:border-[#1883FF]/40 hover:bg-[#1883FF]/5"
                  }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Kehadiran",
            value: `${rapor.totalHadir}/${rapor.totalHariKerja}`,
            sub: `${persenHadir}% hadir`,
            bg: "bg-[#1883FF]/10",
            border: "border-[#1883FF]/20",
            color: "#1883FF",
          },
          {
            label: "Rata-rata Bintang",
            value: rapor.rataRataBintang.toFixed(1),
            sub: "dari 5.0",
            bg: "bg-[#FFE26F]/20",
            border: "border-[#FFE26F]",
            color: "#FEB700",
          },
          {
            label: "Rutinitas",
            value: `${Math.round(rapor.rutinitas.reduce((a, r) => a + r.persen, 0) / rapor.rutinitas.length)}%`,
            sub: "rata-rata",
            bg: "bg-[#FFA9DD]/10",
            border: "border-[#FFA9DD]/30",
            color: "#FFA9DD",
          },
          {
            label: "Kegiatan",
            value: `${Math.round(rapor.kegiatan.reduce((a, k) => a + k.persen, 0) / rapor.kegiatan.length)}%`,
            sub: "rata-rata",
            bg: "bg-[#C4E02F]/10",
            border: "border-[#C4E02F]/30",
            color: "#C4E02F",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-[1.5rem] p-4 text-center`}>
            <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#4A4A4A] font-light mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* RUTINITAS */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#99ADFF]/20 rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#99ADFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h2 className="font-bold text-[#1A1A1A]">Rutinitas Harian</h2>
          </div>
          <div className="space-y-4">
            {rapor.rutinitas.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-[#1A1A1A]">{r.label}</span>
                  <span className="text-sm font-black" style={{ color: r.color }}>{r.persen}%</span>
                </div>
                <ProgressBar persen={r.persen} color={r.color} />
              </div>
            ))}
          </div>
        </div>

        {/* KEGIATAN */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFA9DD]/20 rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFA9DD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h2 className="font-bold text-[#1A1A1A]">Perkembangan Kegiatan</h2>
          </div>
          <div className="space-y-4">
            {rapor.kegiatan.map((k) => (
              <div key={k.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-[#1A1A1A]">{k.label}</span>
                  <span className="text-sm font-black" style={{ color: k.color }}>{k.persen}%</span>
                </div>
                <ProgressBar persen={k.persen} color={k.color} />
              </div>
            ))}
          </div>
        </div>

        {/* HIGHLIGHT */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFE26F]/40 rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FEB700" stroke="#FEB700" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h2 className="font-bold text-[#1A1A1A]">Pencapaian Bulan Ini</h2>
          </div>
          <div className="space-y-2">
            {rapor.highlight.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFE26F]/10 border border-[#FFE26F]/30">
                <div className="w-6 h-6 bg-[#FEB700] rounded-full flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[#1A1A1A]">{h}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <StarDisplay value={rapor.rataRataBintang} />
            <span className="text-2xl font-black text-[#1A1A1A]">{rapor.rataRataBintang}</span>
            <span className="text-sm text-[#4A4A4A] font-light">rata-rata bulan ini</span>
          </div>
        </div>

        {/* CATATAN PENGASUH */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
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
              "{rapor.catatanPengasuh}"
            </p>
          </div>
          <p className="text-right text-xs text-[#4A4A4A] font-medium">— Bu Sari, Pengasuh Kelas Matahari</p>
        </div>

      </div>
    </div>
  );
}
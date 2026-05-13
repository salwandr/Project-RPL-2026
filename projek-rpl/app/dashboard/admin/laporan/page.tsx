"use client";

import { useState } from "react";

type Periode = "harian" | "mingguan" | "bulanan";

const kehadiranData = {
  harian: [
    { hari: "Sen", hadir: 18, izin: 2, alpha: 1 },
    { hari: "Sel", hadir: 20, izin: 1, alpha: 0 },
    { hari: "Rab", hadir: 17, izin: 3, alpha: 1 },
    { hari: "Kam", hadir: 22, izin: 1, alpha: 0 },
    { hari: "Jum", hadir: 19, izin: 2, alpha: 0 },
  ],
  mingguan: [
    { hari: "Mgg 1", hadir: 88, izin: 9, alpha: 3 },
    { hari: "Mgg 2", hadir: 92, izin: 5, alpha: 3 },
    { hari: "Mgg 3", hadir: 85, izin: 10, alpha: 5 },
    { hari: "Mgg 4", hadir: 94, izin: 4, alpha: 2 },
  ],
  bulanan: [
    { hari: "Jan", hadir: 380, izin: 40, alpha: 12 },
    { hari: "Feb", hadir: 360, izin: 35, alpha: 9  },
    { hari: "Mar", hadir: 400, izin: 28, alpha: 7  },
    { hari: "Apr", hadir: 390, izin: 32, alpha: 10 },
    { hari: "Mei", hadir: 410, izin: 22, alpha: 5  },
  ],
};

const laporanHarian = [
  { nama: "Almira Zahra",  hadir: 22, izin: 2, alpha: 0, persentase: 92 },
  { nama: "Bintang Putra", hadir: 20, izin: 3, alpha: 1, persentase: 83 },
  { nama: "Citra Nadia",   hadir: 18, izin: 4, alpha: 2, persentase: 75 },
  { nama: "Dafa Ramadhan", hadir: 24, izin: 0, alpha: 0, persentase: 100 },
  { nama: "Elisa Putri",   hadir: 19, izin: 3, alpha: 2, persentase: 79 },
  { nama: "Farhan Akbar",  hadir: 21, izin: 2, alpha: 1, persentase: 88 },
  { nama: "Gita Lestari",  hadir: 23, izin: 1, alpha: 0, persentase: 96 },
  { nama: "Hendra Wijaya", hadir: 20, izin: 2, alpha: 2, persentase: 83 },
];

const avatarColors = [
  "bg-[#1883FF]/15 text-[#1883FF]",
  "bg-[#FFA9DD]/20 text-[#a0306a]",
  "bg-[#C4E02F]/15 text-[#5a7a00]",
  "bg-[#FEB700]/15 text-[#a07000]",
  "bg-[#99ADFF]/20 text-[#3a4aaa]",
];

export default function LaporanPage() {
  const [periode, setPeriode] = useState<Periode>("harian");

  const data = kehadiranData[periode];
  const maxVal = Math.max(...data.map((d) => d.hadir));
  const totalHadir = laporanHarian.reduce((s, r) => s + r.hadir, 0);
  const totalIzin  = laporanHarian.reduce((s, r) => s + r.izin, 0);
  const totalAlpha = laporanHarian.reduce((s, r) => s + r.alpha, 0);
  const rataRata   = Math.round(totalHadir / laporanHarian.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Laporan</h1>
          <p className="text-[13px] text-[#4A4A4A] mt-1">Rekap kehadiran dan aktivitas anak secara menyeluruh.</p>
        </div>
        <button className="flex items-center gap-2 border-2 border-[#FFE26F] text-[#1A1A1A] px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#FFE26F]/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Laporan
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Hadir",   value: totalHadir, bg: "bg-[#C4E02F]/10", border: "border-[#C4E02F]/20", text: "text-[#5a7a00]"  },
          { label: "Total Izin",    value: totalIzin,  bg: "bg-[#FEB700]/10", border: "border-[#FEB700]/20", text: "text-[#a07000]"  },
          { label: "Total Alpha",   value: totalAlpha, bg: "bg-[#FFA9DD]/10", border: "border-[#FFA9DD]/20", text: "text-[#a0306a]"  },
          { label: "Rata-rata",     value: rataRata,   bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/20", text: "text-[#1883FF]"  },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A4A4A] mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.text} leading-none`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-[14px] font-bold text-[#1A1A1A]">Grafik Kehadiran</h2>
            <p className="text-[11px] text-[#4A4A4A] mt-0.5">Hadir, Izin, Alpha per periode</p>
          </div>
          <div className="flex gap-2">
            {(["harian", "mingguan", "bulanan"] as Periode[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriode(p)}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all capitalize
                  ${periode === p
                    ? "bg-[#1A1A1A] text-[#FFE26F] border-[#1A1A1A]"
                    : "bg-white text-[#4A4A4A] border-[#FFE26F]/60 hover:border-[#FFE26F]"}`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-3 h-40 pb-2">
          {data.map((d) => (
            <div key={d.hari} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "120px" }}>
                {/* Hadir */}
                <div
                  className="w-full bg-[#1883FF] rounded-t-lg transition-all duration-500"
                  style={{ height: `${(d.hadir / maxVal) * 100}px` }}
                  title={`Hadir: ${d.hadir}`}
                />
              </div>
              <p className="text-[10px] font-bold text-[#4A4A4A]">{d.hari}</p>
              <p className="text-[10px] font-black text-[#1883FF]">{d.hadir}</p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#F0EDE6]">
          {[
            { color: "bg-[#1883FF]",   label: "Hadir" },
            { color: "bg-[#FEB700]",   label: "Izin"  },
            { color: "bg-[#FFA9DD]",   label: "Alpha" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm ${l.color}`} />
              <span className="text-[11px] text-[#4A4A4A] font-medium">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-anak tabel */}
      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE6] flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#1A1A1A]">Rekap Per Anak — Bulan Ini</h2>
          <span className="text-[11px] text-[#4A4A4A] font-medium">24 hari efektif</span>
        </div>

        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-[#F0EDE6] text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider">
          <div className="col-span-4">Nama</div>
          <div className="col-span-2 text-center">Hadir</div>
          <div className="col-span-2 text-center">Izin</div>
          <div className="col-span-2 text-center">Alpha</div>
          <div className="col-span-2 text-center">Kehadiran</div>
        </div>

        <div className="divide-y divide-[#F7F5F0]">
          {laporanHarian.map((row, i) => {
            const avatarColor = avatarColors[i % avatarColors.length];
            const pctColor =
              row.persentase >= 90 ? "text-[#5a7a00]" :
              row.persentase >= 75 ? "text-[#a07000]" : "text-[#a0306a]";
            const barColor =
              row.persentase >= 90 ? "bg-[#C4E02F]" :
              row.persentase >= 75 ? "bg-[#FEB700]" : "bg-[#FFA9DD]";
            const initials = row.nama.split(" ").map((n) => n[0]).join("").slice(0, 2);
            return (
              <div key={row.nama} className="grid grid-cols-2 md:grid-cols-12 px-6 py-4 items-center hover:bg-[#FFFDF7] transition-colors gap-y-1">
                <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${avatarColor}`}>
                    {initials}
                  </div>
                  <p className="text-[13px] font-bold text-[#1A1A1A]">{row.nama}</p>
                </div>
                <div className="hidden md:block col-span-2 text-center">
                  <span className="text-[13px] font-bold text-[#1A1A1A]">{row.hadir}</span>
                </div>
                <div className="hidden md:block col-span-2 text-center">
                  <span className="text-[12px] font-semibold text-[#a07000]">{row.izin}</span>
                </div>
                <div className="hidden md:block col-span-2 text-center">
                  <span className="text-[12px] font-semibold text-[#a0306a]">{row.alpha}</span>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col items-center gap-1">
                  <span className={`text-[13px] font-black ${pctColor}`}>{row.persentase}%</span>
                  <div className="w-full h-1.5 bg-[#F0EDE6] rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full`} style={{ width: `${row.persentase}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
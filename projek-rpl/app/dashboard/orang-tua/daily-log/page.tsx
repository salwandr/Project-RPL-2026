"use client";

import { useState } from "react";

const logs = [
  {
    tanggal: "Senin, 5 Mei 2026",
    mandi: "Anak 1 mandi dengan baik dan kooperatif pagi ini.",
    makan: "Makan habis semua, lahap sekali hari ini.",
    bermain: "Aktif bermain balok bersama teman-teman.",
    mengaji: "Mengaji Iqro halaman 5 dengan lancar.",
    sholat: "Gerakan sholat sudah bagus, bacaan masih dibantu.",
    nilaiStimulasi: 5,
  },
  {
    tanggal: "Jumat, 2 Mei 2026",
    mandi: "Perlu sedikit diingatkan tapi akhirnya mau mandi.",
    makan: "Makan setengah porsi, kurang nafsu makan.",
    bermain: "Bermain puzzle dan menggambar.",
    mengaji: "Mengaji Iqro halaman 4, perlu bimbingan.",
    sholat: "Masih belajar gerakan, semangat tinggi.",
    nilaiStimulasi: 4,
  },
];

const starFull  = "★";
const starEmpty = "☆";

export default function DailyLogOrangTuaPage() {
  const [selected, setSelected] = useState(0);
  const log = logs[selected];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-bold text-stone-800">Daily Log Anak 1</h1>
        <p className="text-[11px] text-stone-400 mt-0.5">Laporan aktivitas harian dari pengasuh</p>
      </div>

      {/* Date selector */}
      <div className="flex gap-2">
        {logs.map((l, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`px-4 py-2 rounded-xl text-[11px] font-semibold transition-all duration-150 hover:scale-[1.02]
              ${selected === i
                ? "bg-sage-green text-white shadow-sm"
                : "bg-white text-stone-500 border border-stone-100 hover:border-sage-green/30"}`}
          >
            {l.tanggal}
          </button>
        ))}
      </div>

      {/* Log card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-5">
        {/* Rutinitas */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-3">Rutinitas Harian</p>
          <div className="space-y-3">
            {[
              { label: "Mandi",   value: log.mandi   },
              { label: "Makan",   value: log.makan   },
              { label: "Bermain", value: log.bermain  },
            ].map((item) => (
              <div key={item.label} className="bg-stone-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold text-stone-500 mb-0.5">{item.label}</p>
                <p className="text-[12px] text-stone-700 leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-100" />

        {/* Kegiatan khusus */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-3">Kegiatan Khusus</p>
          <div className="space-y-3">
            {[
              { label: "Mengaji",        value: log.mengaji },
              { label: "Latihan Sholat", value: log.sholat  },
            ].map((item) => (
              <div key={item.label} className="bg-stone-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold text-stone-500 mb-0.5">{item.label}</p>
                <p className="text-[12px] text-stone-700 leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-100" />

        {/* Nilai stimulasi */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-2">Nilai Stimulasi</p>
          <p className="text-2xl text-amber-400 tracking-wider">
            {Array.from({ length: 5 }, (_, i) => i < log.nilaiStimulasi ? starFull : starEmpty).join("")}
          </p>
        </div>
      </div>
    </div>
  );
}
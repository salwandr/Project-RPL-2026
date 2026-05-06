"use client";

import { useState } from "react";

const months = ["Januari", "Februari", "Maret", "April", "Mei"];

const rapor = {
  Mei: {
    kehadiran: 18,
    totalHari: 22,
    rataStimulasi: 4.5,
    rutinitas: [
      { label: "Mandi Mandiri",      pencapaian: 90 },
      { label: "Makan Habis",        pencapaian: 75 },
      { label: "Bermain Kooperatif", pencapaian: 85 },
    ],
    kegiatan: [
      { label: "Mengaji",        pencapaian: 80 },
      { label: "Latihan Sholat", pencapaian: 70 },
    ],
    catatan: "Anak 1 menunjukkan perkembangan yang sangat baik bulan ini. Kemampuan bersosialisasi meningkat pesat dan sudah mulai percaya diri dalam mengikuti kegiatan bersama.",
  },
  April: {
    kehadiran: 20,
    totalHari: 21,
    rataStimulasi: 4.2,
    rutinitas: [
      { label: "Mandi Mandiri",      pencapaian: 85 },
      { label: "Makan Habis",        pencapaian: 70 },
      { label: "Bermain Kooperatif", pencapaian: 80 },
    ],
    kegiatan: [
      { label: "Mengaji",        pencapaian: 75 },
      { label: "Latihan Sholat", pencapaian: 65 },
    ],
    catatan: "Anak 1 mulai menunjukkan kemandirian yang lebih baik. Perlu perhatian lebih pada kemampuan makan dan mengaji.",
  },
};

type MonthKey = keyof typeof rapor;

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2.5 bg-warm-beige rounded-full overflow-hidden">
      <div
        className="h-full bg-sage-green rounded-full transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function RaporOrangTuaPage() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>("Mei");
  const data = rapor[selectedMonth] ?? null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[18px] font-bold text-stone-800">Rapor Perkembangan</h1>
        <p className="text-[11px] text-stone-400 mt-0.5">Rekap perkembangan bulanan Anak 1</p>
      </div>

      {/* Month selector */}
      <div className="flex gap-2 flex-wrap">
        {months.map((m) => {
          const hasData = m in rapor;
          return (
            <button
              key={m}
              onClick={() => hasData && setSelectedMonth(m as MonthKey)}
              disabled={!hasData}
              className={`px-4 py-2 rounded-xl text-[11px] font-semibold transition-all duration-150
                ${!hasData ? "bg-stone-100 text-stone-300 cursor-not-allowed" :
                  selectedMonth === m
                    ? "bg-sage-green text-white shadow-sm hover:scale-[1.02]"
                    : "bg-white text-stone-500 border border-stone-100 hover:border-sage-green/30 hover:scale-[1.02]"}`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {data && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Kehadiran",       value: `${data.kehadiran}/${data.totalHari}`, sub: "Hari hadir",        bg: "bg-sage-green/20",  text: "text-sage-green" },
              { label: "Rata Stimulasi",  value: data.rataStimulasi.toFixed(1),         sub: "Dari 5.0",          bg: "bg-warm-beige",     text: "text-stone-500"  },
              { label: "Persentase",      value: `${Math.round((data.kehadiran/data.totalHari)*100)}%`, sub: "Tingkat kehadiran", bg: "bg-pastel-blue/30", text: "text-blue-500"   },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default`}>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-1">{s.label}</p>
                <p className={`text-3xl font-bold ${s.text} leading-none mb-1`}>{s.value}</p>
                <p className="text-[10px] text-stone-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Rutinitas progress */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400">Rutinitas Harian</p>
            {data.rutinitas.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between mb-1">
                  <p className="text-[11px] font-semibold text-stone-600">{r.label}</p>
                  <p className="text-[11px] font-bold text-sage-green">{r.pencapaian}%</p>
                </div>
                <ProgressBar value={r.pencapaian} />
              </div>
            ))}
          </div>

          {/* Kegiatan khusus */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400">Kegiatan Khusus</p>
            {data.kegiatan.map((k) => (
              <div key={k.label}>
                <div className="flex justify-between mb-1">
                  <p className="text-[11px] font-semibold text-stone-600">{k.label}</p>
                  <p className="text-[11px] font-bold text-sage-green">{k.pencapaian}%</p>
                </div>
                <ProgressBar value={k.pencapaian} />
              </div>
            ))}
          </div>

          {/* Catatan pengasuh */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-2">Catatan Pengasuh</p>
            <p className="text-[12px] text-stone-600 leading-relaxed">{data.catatan}</p>
          </div>
        </>
      )}
    </div>
  );
}
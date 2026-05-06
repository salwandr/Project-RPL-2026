"use client";

import { useState } from "react";

interface DailyLog {
  id: number;
  childName: string;
  kelas: string;
  tanggal: string;
  mandi: string;
  makan: string;
  bermain: string;
  mengaji: string;
  sholat: string;
  nilaiStimulasi: number;
  avatar: string;
}

const logs: DailyLog[] = [
  { id: 1, childName: "Anak 1", kelas: "Rainbow Room",   tanggal: "2026-05-05", mandi: "Baik, kooperatif",          makan: "Habis semua",           bermain: "Aktif bermain balok", mengaji: "Iqro hal 5",      sholat: "Gerakan bagus",      nilaiStimulasi: 5, avatar: "A1" },
  { id: 2, childName: "Anak 2", kelas: "Sunshine Class", tanggal: "2026-05-05", mandi: "Perlu diingatkan",          makan: "Makan setengah porsi",  bermain: "Main puzzle",         mengaji: "Iqro hal 3",      sholat: "Masih belajar",      nilaiStimulasi: 4, avatar: "A2" },
  { id: 3, childName: "Anak 3", kelas: "Rainbow Room",   tanggal: "2026-05-05", mandi: "Mandiri",                   makan: "Lahap",                 bermain: "Bermain peran",       mengaji: "Al-Fatihah",      sholat: "Hafal bacaan",       nilaiStimulasi: 5, avatar: "A3" },
  { id: 4, childName: "Anak 4", kelas: "Star Class",     tanggal: "2026-05-05", mandi: "Baik",                      makan: "Makan dengan baik",     bermain: "Bermain outdoor",     mengaji: "Iqro hal 8",      sholat: "Gerakan lengkap",    nilaiStimulasi: 4, avatar: "A4" },
  { id: 5, childName: "Anak 5", kelas: "Sunshine Class", tanggal: "2026-05-05", mandi: "Perlu bantuan",             makan: "Pilih-pilih makanan",   bermain: "Menggambar",          mengaji: "Iqro hal 1",      sholat: "Baru mulai belajar", nilaiStimulasi: 3, avatar: "A5" },
];

const starFull  = "★";
const starEmpty = "☆";

export default function LaporanPage() {
  const [selected, setSelected] = useState<DailyLog | null>(null);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.childName.toLowerCase().includes(search.toLowerCase()) ||
      l.kelas.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Laporan",   value: logs.length,                                   bg: "bg-sage-green/20",  text: "text-sage-green" },
          { label: "Rata-rata Nilai", value: (logs.reduce((s,l) => s+l.nilaiStimulasi,0)/logs.length).toFixed(1), bg: "bg-warm-beige", text: "text-stone-500" },
          { label: "Nilai Sempurna",  value: logs.filter((l) => l.nilaiStimulasi === 5).length, bg: "bg-pastel-blue/30", text: "text-blue-500" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default`}>
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.text} leading-none`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* Log list */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <p className="text-[12px] font-bold text-stone-700">Laporan Harian</p>
            <input
              type="text"
              placeholder="Cari nama anak..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[11px] border border-stone-200 rounded-xl px-4 py-2 w-44 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-sage-green/30 placeholder:text-stone-300 transition-shadow"
            />
          </div>

          <div className="p-4 space-y-2">
            {filtered.map((log) => (
              <button
                key={log.id}
                onClick={() => setSelected(selected?.id === log.id ? null : log)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-200 border text-left
                  ${selected?.id === log.id
                    ? "border-sage-green bg-sage-green/5"
                    : "border-stone-100 bg-white"}`}
              >
                <div className="w-9 h-9 rounded-full bg-warm-beige border border-stone-200 flex items-center justify-center text-[9px] font-bold text-stone-500 flex-shrink-0">
                  {log.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-stone-700 truncate">{log.childName}</p>
                  <p className="text-[10px] text-stone-400 truncate">{log.kelas}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] text-amber-400 tracking-wider">
                    {Array.from({ length: 5 }, (_, i) => i < log.nilaiStimulasi ? starFull : starEmpty).join("")}
                  </p>
                  <p className="text-[9px] text-stone-400">{log.tanggal}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="w-72 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-stone-100 p-5 space-y-4 self-start">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-full bg-warm-beige border border-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-500">
                {selected.avatar}
              </div>
              <div>
                <p className="text-[13px] font-bold text-stone-700">{selected.childName}</p>
                <p className="text-[10px] text-stone-400">{selected.kelas} · {selected.tanggal}</p>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-2">Rutinitas Harian</p>
              {[
                { label: "Mandi",   value: selected.mandi   },
                { label: "Makan",   value: selected.makan   },
                { label: "Bermain", value: selected.bermain  },
              ].map((item) => (
                <div key={item.label} className="mb-2">
                  <p className="text-[10px] font-semibold text-stone-600">{item.label}</p>
                  <p className="text-[10px] text-stone-400 leading-snug">{item.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-2">Kegiatan Khusus</p>
              {[
                { label: "Mengaji",        value: selected.mengaji },
                { label: "Latihan Sholat", value: selected.sholat  },
              ].map((item) => (
                <div key={item.label} className="mb-2">
                  <p className="text-[10px] font-semibold text-stone-600">{item.label}</p>
                  <p className="text-[10px] text-stone-400 leading-snug">{item.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-1">Nilai Stimulasi</p>
              <p className="text-xl text-amber-400 tracking-wider">
                {Array.from({ length: 5 }, (_, i) => i < selected.nilaiStimulasi ? starFull : starEmpty).join("")}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-72 flex-shrink-0 bg-white/50 rounded-2xl border border-dashed border-stone-200 flex items-center justify-center self-start h-48">
            <p className="text-[11px] text-stone-400 text-center px-4">
              Pilih laporan untuk<br />melihat detail
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
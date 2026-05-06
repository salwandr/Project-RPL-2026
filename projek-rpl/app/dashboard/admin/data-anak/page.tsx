"use client";

import { useState } from "react";

interface Child {
  id: number;
  name: string;
  kelas: string;
  usia: string;
  wali: string;
  telepon: string;
  avatar: string;
  program: "Harian" | "Bulanan";
}

const allChildren: Child[] = [
  { id: 1,  name: "Anak 1",  kelas: "Rainbow Room",   usia: "3 th",  wali: "Budi S.",     telepon: "0812-xxxx-0001", avatar: "A1", program: "Bulanan" },
  { id: 2,  name: "Anak 2",  kelas: "Sunshine Class", usia: "4 th",  wali: "Rina W.",     telepon: "0812-xxxx-0002", avatar: "A2", program: "Harian"  },
  { id: 3,  name: "Anak 3",  kelas: "Rainbow Room",   usia: "3 th",  wali: "Doni P.",     telepon: "0812-xxxx-0003", avatar: "A3", program: "Bulanan" },
  { id: 4,  name: "Anak 4",  kelas: "Star Class",     usia: "5 th",  wali: "Sari L.",     telepon: "0812-xxxx-0004", avatar: "A4", program: "Bulanan" },
  { id: 5,  name: "Anak 5",  kelas: "Sunshine Class", usia: "4 th",  wali: "Hendra K.",   telepon: "0812-xxxx-0005", avatar: "A5", program: "Harian"  },
  { id: 6,  name: "Anak 6",  kelas: "Rainbow Room",   usia: "3 th",  wali: "Dewi M.",     telepon: "0812-xxxx-0006", avatar: "A6", program: "Bulanan" },
  { id: 7,  name: "Anak 7",  kelas: "Star Class",     usia: "5 th",  wali: "Agus R.",     telepon: "0812-xxxx-0007", avatar: "A7", program: "Harian"  },
  { id: 8,  name: "Anak 8",  kelas: "Sunshine Class", usia: "4 th",  wali: "Lestari N.",  telepon: "0812-xxxx-0008", avatar: "A8", program: "Bulanan" },
];

const kelasList = ["Semua", "Rainbow Room", "Sunshine Class", "Star Class"];

export default function DataAnakPage() {
  const [search, setSearch]       = useState("");
  const [filterKelas, setFilterKelas] = useState("Semua");

  const filtered = allChildren.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.wali.toLowerCase().includes(search.toLowerCase());
    const matchKelas  = filterKelas === "Semua" || c.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Anak",     value: allChildren.length,                                         bg: "bg-sage-green/20",  text: "text-sage-green" },
          { label: "Program Bulanan",value: allChildren.filter((c) => c.program === "Bulanan").length,  bg: "bg-warm-beige",     text: "text-stone-500"  },
          { label: "Program Harian", value: allChildren.filter((c) => c.program === "Harian").length,   bg: "bg-pastel-blue/30", text: "text-blue-500"   },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default`}>
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.text} leading-none mb-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-stone-100">
          <p className="text-[12px] font-bold text-stone-700">Data Anak Terdaftar</p>
          <div className="flex items-center gap-3">
            {/* Kelas filter */}
            <div className="flex gap-1">
              {kelasList.map((k) => (
                <button
                  key={k}
                  onClick={() => setFilterKelas(k)}
                  className={`text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all duration-150 hover:scale-105
                    ${filterKelas === k
                      ? "bg-sage-green text-white shadow-sm"
                      : "bg-warm-beige text-stone-500 hover:bg-sage-green/20"}`}
                >
                  {k}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Cari nama / wali..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[11px] border border-stone-200 rounded-xl px-4 py-2 w-44 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-sage-green/30 placeholder:text-stone-300 transition-shadow"
            />
          </div>
        </div>

        {/* Table body */}
        <div className="p-4 space-y-2">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-3 px-4 pb-1">
            {["Anak", "Kelas", "Usia", "Wali", "Telepon", "Program"].map((h) => (
              <p key={h} className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 col-span-2">{h}</p>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-[12px] text-stone-400 py-10">Tidak ada data.</p>
          ) : (
            filtered.map((child) => (
              <div
                key={child.id}
                className="grid grid-cols-12 gap-3 items-center px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-200 border border-stone-100"
              >
                {/* Anak */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-warm-beige border border-stone-200 flex items-center justify-center text-[9px] font-bold text-stone-500 flex-shrink-0">
                    {child.avatar}
                  </div>
                  <p className="text-[11px] font-semibold text-stone-700 truncate">{child.name}</p>
                </div>
                {/* Kelas */}
                <p className="col-span-2 text-[11px] text-stone-500 truncate">{child.kelas}</p>
                {/* Usia */}
                <p className="col-span-2 text-[11px] text-stone-500">{child.usia}</p>
                {/* Wali */}
                <p className="col-span-2 text-[11px] text-stone-500 truncate">{child.wali}</p>
                {/* Telepon */}
                <p className="col-span-2 text-[11px] text-stone-400 truncate">{child.telepon}</p>
                {/* Program */}
                <div className="col-span-2">
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full
                    ${child.program === "Bulanan"
                      ? "bg-sage-green/20 text-sage-green"
                      : "bg-pastel-blue/30 text-blue-500"}`}>
                    {child.program}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";

type CheckStatus = "hadir" | "belum";

interface Child {
  id: number;
  name: string;
  kelas: string;
  status: CheckStatus;
  jamCheckin: string | null;
  avatar: string;
}

const initialChildren: Child[] = [
  { id: 1, name: "Anak 1", kelas: "Rainbow Room",   status: "hadir", jamCheckin: "07:10", avatar: "A1" },
  { id: 2, name: "Anak 2", kelas: "Sunshine Class", status: "hadir", jamCheckin: "07:25", avatar: "A2" },
  { id: 3, name: "Anak 3", kelas: "Rainbow Room",   status: "belum", jamCheckin: null,    avatar: "A3" },
  { id: 4, name: "Anak 4", kelas: "Star Class",     status: "hadir", jamCheckin: "07:15", avatar: "A4" },
  { id: 5, name: "Anak 5", kelas: "Sunshine Class", status: "belum", jamCheckin: null,    avatar: "A5" },
  { id: 6, name: "Anak 6", kelas: "Rainbow Room",   status: "hadir", jamCheckin: "07:20", avatar: "A6" },
  { id: 7, name: "Anak 7", kelas: "Star Class",     status: "belum", jamCheckin: null,    avatar: "A7" },
  { id: 8, name: "Anak 8", kelas: "Sunshine Class", status: "hadir", jamCheckin: "07:22", avatar: "A8" },
];

export default function PengasuhKedatanganPage() {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [search, setSearch]     = useState("");

  const hadir  = children.filter((c) => c.status === "hadir").length;
  const belum  = children.filter((c) => c.status === "belum").length;
  const total  = children.length;

  const filtered = children.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.kelas.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckin = (id: number) => {
    const now = new Date();
    const jam  = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setChildren((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "hadir" as CheckStatus, jamCheckin: jam } : c
      )
    );
  };

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Anak",  value: total,  bg: "bg-sage-green/20",  text: "text-sage-green", sub: "Hari ini" },
          { label: "Sudah Hadir", value: hadir,  bg: "bg-sage-green/30",  text: "text-sage-green", sub: `${Math.round((hadir/total)*100)}% kehadiran` },
          { label: "Belum Hadir", value: belum,  bg: "bg-warm-beige",     text: "text-stone-500",  sub: "Menunggu check-in" },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default`}
          >
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.text} leading-none mb-1`}>{s.value}</p>
            <p className="text-[10px] text-stone-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-semibold text-stone-700">Progress Kehadiran</p>
          <span className="text-[12px] font-bold text-sage-green">{hadir}/{total}</span>
        </div>
        <div className="w-full h-3 bg-warm-beige rounded-full overflow-hidden">
          <div
            className="h-full bg-sage-green rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(hadir / total) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-stone-400 mt-2">{belum} anak belum check-in</p>
      </div>

      {/* Child list */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <p className="text-[12px] font-bold text-stone-700">Daftar Anak</p>
          <input
            type="text"
            placeholder="Cari nama anak..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[11px] border border-stone-200 rounded-xl px-4 py-2 w-48 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-sage-green/30 placeholder:text-stone-300 transition-shadow"
          />
        </div>

        <div className="p-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center text-[12px] text-stone-400 py-10">Tidak ada anak ditemukan.</p>
          ) : (
            filtered.map((child) => (
              <div
                key={child.id}
                className="flex items-center gap-4 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-200 border border-stone-100"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-warm-beige border border-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-500 flex-shrink-0 shadow-sm">
                  {child.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-stone-700 truncate">{child.name}</p>
                  <p className="text-[10px] text-stone-400 truncate">{child.kelas}</p>
                </div>

                {/* Jam checkin */}
                {child.jamCheckin && (
                  <p className="text-[10px] text-stone-400 hidden sm:block">
                    Masuk <span className="font-semibold text-stone-600">{child.jamCheckin}</span>
                  </p>
                )}

                {/* Status / Action */}
                {child.status === "hadir" ? (
                  <span className="text-[10px] font-bold text-white bg-sage-green px-3 py-1.5 rounded-full shadow-sm">
                    Hadir ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleCheckin(child.id)}
                    className="text-[10px] font-bold text-white bg-sage-green px-3 py-1.5 rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-150"
                  >
                    Check-in
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}